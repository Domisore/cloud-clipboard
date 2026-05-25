import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";
import { auth } from "@clerk/nextjs/server";

// CORS headers helper
function corsHeaders(origin: string | null) {
    const allowedOrigin = origin || '*';
    return {
        'Access-Control-Allow-Origin': allowedOrigin,
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Credentials': 'true',
    };
}

// Authentication check mapping Basic and Bearer auth to User ID
async function getUserIdFromAuth(request: Request): Promise<string | null> {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader) return null;

    let token = "";
    if (authHeader.startsWith("Bearer ")) {
        token = authHeader.substring(7);
    } else if (authHeader.startsWith("Basic ")) {
        try {
            const credentials = Buffer.from(authHeader.substring(6), 'base64').toString('utf-8');
            const parts = credentials.split(':');
            token = parts[1] || parts[0];
        } catch (e) {
            console.error("Failed to decode Basic auth header:", e);
        }
    }

    if (!token) return null;
    const keyData = await redis.hgetall(`apikey:${token}`);
    if (!keyData) return null;
    return keyData.userId as string;
}

// Default fallback mock graph structure
const DEFAULT_MOCK_GRAPH = {
    nodes: [
        { id: "node_1", label: "public/skill.md", type: "doc", group: "Docs", x: 100, y: 100, description: "Standard instructions.", properties: {} },
        { id: "node_2", label: "skills/drive-io/SKILL.md", type: "doc", group: "Docs", x: 100, y: 200, description: "Workspace skill context.", properties: {} },
        { id: "node_3", label: "src/app/webdav/[[...path]]/route.ts", type: "code", group: "API", x: 300, y: 150, description: "WebDAV filesystem protocol adapter.", properties: {} },
        { id: "node_4", label: "src/app/api/upload/route.ts", type: "code", group: "API", x: 300, y: 270, description: "Presigned URL generator.", properties: {} },
        { id: "node_5", label: "src/app/api/complete/route.ts", type: "code", group: "API", x: 300, y: 390, description: "Finalization route.", properties: {} },
        { id: "node_6", label: "ApiKeyDashboard.tsx", type: "code", group: "UI", x: 520, y: 100, description: "Main workspace client panel.", properties: {} },
        { id: "node_7", label: "ArtifactLibrary.tsx", type: "code", group: "UI", x: 520, y: 220, description: "Split-pane layout.", properties: {} },
        { id: "node_8", label: "src/lib/redis.ts", type: "code", group: "Database", x: 120, y: 390, description: "Redis client connector.", properties: {} },
        { id: "node_9", label: "src/lib/r2.ts", type: "code", group: "Database", x: 120, y: 290, description: "S3-compatible connector.", properties: {} },
        { id: "node_10", label: "Upstash Redis KV", type: "external", group: "Infrastructure", x: 80, y: 500, description: "Remote Redis server.", properties: {} },
        { id: "node_11", label: "Cloudflare R2 Bucket", type: "external", group: "Infrastructure", x: 200, y: 500, description: "Object storage bucket.", properties: {} },
        { id: "node_12", label: "Clerk Authentication", type: "external", group: "Infrastructure", x: 520, y: 350, description: "Identity provider.", properties: {} }
    ],
    edges: [
        { source: "node_3", target: "node_8", relationship: "queries" },
        { source: "node_3", target: "node_9", relationship: "uploads/streams" },
        { source: "node_4", target: "node_8", relationship: "checks keys" },
        { source: "node_4", target: "node_9", relationship: "provisions" },
        { source: "node_5", target: "node_8", relationship: "indexes metadata" },
        { source: "node_5", target: "node_9", relationship: "validates" },
        { source: "node_6", target: "node_7", relationship: "imports" },
        { source: "node_8", target: "node_10", relationship: "syncs" },
        { source: "node_9", target: "node_11", relationship: "persists" },
        { source: "node_6", target: "node_12", relationship: "secures" },
        { source: "node_6", target: "node_3", relationship: "manages through" },
        { source: "node_7", target: "node_5", relationship: "finalizes via" }
    ]
};

// OPTIONS Handler
export async function OPTIONS(request: Request) {
    const origin = request.headers.get('origin');
    return new Response(null, {
        status: 200,
        headers: corsHeaders(origin),
    });
}

// GET Handler (Programmatic node traversal via BFS)
export async function GET(request: Request) {
    const origin = request.headers.get('origin');
    const headers = corsHeaders(origin);

    try {
        // 1. Authenticate user
        let userId: string | null = null;
        try {
            const session = await auth();
            userId = session.userId;
        } catch (e) {
            // Not authenticated via Clerk session
        }

        if (!userId) {
            userId = await getUserIdFromAuth(request);
        }

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers });
        }

        // 2. Parse parameters
        const { searchParams } = new URL(request.url);
        const namespace = searchParams.get("namespace");
        const targetId = searchParams.get("id");
        const depthParam = searchParams.get("depth") || "1";
        const maxDepth = parseInt(depthParam, 10);

        if (!namespace) {
            return NextResponse.json({ error: "Missing parameter: namespace" }, { status: 400, headers });
        }
        if (!targetId) {
            return NextResponse.json({ error: "Missing parameter: id" }, { status: 400, headers });
        }
        if (isNaN(maxDepth) || maxDepth < 0) {
            return NextResponse.json({ error: "Invalid parameter: depth must be a non-negative integer" }, { status: 400, headers });
        }

        // 3. Fetch latest graph
        const graphData = await redis.get(`graph:${userId}:${namespace}:latest`);
        let graph: any = DEFAULT_MOCK_GRAPH;

        if (graphData) {
            if (typeof graphData === "string") {
                graph = JSON.parse(graphData);
            } else {
                graph = graphData;
            }
        }

        // 4. Find target node
        const targetNode = graph.nodes.find((n: any) => n.id === targetId);
        if (!targetNode) {
            return NextResponse.json({ error: `Node not found: ${targetId}` }, { status: 404, headers });
        }

        // 5. Run BFS Traversal to collect nodes inside range
        const visitedIds = new Set<string>([targetId]);
        const queue: { id: string; currentDepth: number }[] = [{ id: targetId, currentDepth: 0 }];

        while (queue.length > 0) {
            const curr = queue.shift()!;
            
            if (curr.currentDepth < maxDepth) {
                // Find connected edges
                for (const edge of graph.edges) {
                    if (edge.source === curr.id && !visitedIds.has(edge.target)) {
                        visitedIds.add(edge.target);
                        queue.push({ id: edge.target, currentDepth: curr.currentDepth + 1 });
                    } else if (edge.target === curr.id && !visitedIds.has(edge.source)) {
                        visitedIds.add(edge.source);
                        queue.push({ id: edge.source, currentDepth: curr.currentDepth + 1 });
                    }
                }
            }
        }

        // 6. Filter nodes & edges matching search
        const resultNodes = graph.nodes.filter((n: any) => visitedIds.has(n.id));
        const resultEdges = graph.edges.filter((e: any) => visitedIds.has(e.source) && visitedIds.has(e.target));

        return NextResponse.json({
            target: targetNode,
            nodes: resultNodes,
            edges: resultEdges
        }, { status: 200, headers });

    } catch (error: any) {
        console.error("Graphify node fetch error:", error);
        return NextResponse.json({ error: error.message || "Failed to fetch node" }, { status: 500, headers });
    }
}
