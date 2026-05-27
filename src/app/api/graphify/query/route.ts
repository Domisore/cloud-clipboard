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

// GET Handler (Natural Language / Keyword Query)
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
        const queryText = searchParams.get("q");

        if (!namespace) {
            return NextResponse.json({ error: "Missing parameter: namespace" }, { status: 400, headers });
        }
        if (!queryText) {
            return NextResponse.json({ error: "Missing parameter: q" }, { status: 400, headers });
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

        // Normalize graph structure for safety and layout guarantees
        if (graph && graph.nodes) {
            const rawEdges = graph.edges || graph.links || [];
            const normalizedNodes = graph.nodes.map((node: any, idx: number) => {
                const fileType = node.type || node.file_type || "code";
                const groupName = node.group || (node.community !== undefined ? `Community ${node.community}` : "General");
                
                // Position nodes dynamically on a spiral layout if x and y are missing
                const defaultX = node.x !== undefined && node.x !== null ? node.x : 350 + Math.cos(idx * 0.9) * (110 + idx * 18);
                const defaultY = node.y !== undefined && node.y !== null ? node.y : 250 + Math.sin(idx * 0.9) * (90 + idx * 14);

                return {
                    ...node,
                    type: fileType,
                    group: groupName,
                    description: node.description || `Codebase file: ${node.label || node.id}`,
                    properties: node.properties || {},
                    x: defaultX,
                    y: defaultY
                };
            });

            const normalizedEdges = rawEdges.map((edge: any) => {
                const rel = edge.relationship || edge.relation || "references";
                return {
                    ...edge,
                    relationship: rel
                };
            });

            graph = {
                nodes: normalizedNodes,
                edges: normalizedEdges
            };
        }

        // 4. Case-insensitive matches
        const q = queryText.toLowerCase();
        const matches: { node: any; score: number }[] = [];

        for (const node of graph.nodes) {
            let score = 0;

            if (node.label.toLowerCase().includes(q)) {
                score += 1.0;
            }
            if (node.description.toLowerCase().includes(q)) {
                score += 0.6;
            }
            if (node.group.toLowerCase().includes(q)) {
                score += 0.4;
            }
            
            // Check property matches
            if (node.properties) {
                for (const [key, val] of Object.entries(node.properties)) {
                    if (
                        key.toLowerCase().includes(q) || 
                        String(val).toLowerCase().includes(q)
                    ) {
                        score += 0.3;
                    }
                }
            }

            if (score > 0) {
                matches.push({ node, score });
            }
        }

        // 5. Rank matches by relevance score
        matches.sort((a, b) => b.score - a.score);

        return NextResponse.json({
            query: queryText,
            results: matches
        }, { status: 200, headers });

    } catch (error: any) {
        console.error("Graphify search query error:", error);
        return NextResponse.json({ error: error.message || "Failed to query graph" }, { status: 500, headers });
    }
}
