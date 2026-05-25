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
        { 
            id: "node_1", 
            label: "public/skill.md", 
            type: "doc", 
            group: "Docs", 
            x: 100, 
            y: 100, 
            description: "Standard model execution instructions exposed to client agents.",
            properties: { format: "Markdown", size: "7.2 KB", visibility: "Public" }
        },
        { 
            id: "node_2", 
            label: "skills/drive-io/SKILL.md", 
            type: "doc", 
            group: "Docs", 
            x: 100, 
            y: 200, 
            description: "Workspace-specific model execution context loaded by skill_view.",
            properties: { format: "Markdown", size: "7.3 KB", visibility: "Workspace" }
        },
        { 
            id: "node_3", 
            label: "src/app/webdav/[[...path]]/route.ts", 
            type: "code", 
            group: "API", 
            x: 300, 
            y: 150, 
            description: "WebDAV filesystem protocol adapter, enabling rclone and Graphify mounts.",
            properties: { language: "TypeScript", routes: "OPTIONS, PROPFIND, GET, PUT, MKCOL, DELETE, MOVE", auth: "Bearer/Basic" }
        },
        { 
            id: "node_4", 
            label: "src/app/api/upload/route.ts", 
            type: "code", 
            group: "API", 
            x: 300, 
            y: 270, 
            description: "Presigned URL generator for secure client uploads to Cloudflare R2.",
            properties: { language: "TypeScript", method: "POST", returns: "JSON {url, id, key}" }
        },
        { 
            id: "node_5", 
            label: "src/app/api/complete/route.ts", 
            type: "code", 
            group: "API", 
            x: 300, 
            y: 390, 
            description: "Finalization route saving file metadata and indexing upload in Redis.",
            properties: { language: "TypeScript", method: "POST", logs: "Activity stream" }
        },
        { 
            id: "node_6", 
            label: "ApiKeyDashboard.tsx", 
            type: "code", 
            group: "UI", 
            x: 520, 
            y: 100, 
            description: "Main workspace client panel for managing API keys, webhooks, and registry items.",
            properties: { framework: "React/Next.js", state: "Stateful hooks", style: "Tailwind v4" }
        },
        { 
            id: "node_7", 
            label: "ArtifactLibrary.tsx", 
            type: "code", 
            group: "UI", 
            x: 520, 
            y: 220, 
            description: "Split-pane layout presenting sortable, paginated registry documents.",
            properties: { framework: "React/Next.js", components: "List-Detail Split", search: "Full-text client" }
        },
        { 
            id: "node_8", 
            label: "src/lib/redis.ts", 
            type: "code", 
            group: "Database", 
            x: 120, 
            y: 390, 
            description: "Database connector for Upstash Redis serverless client.",
            properties: { library: "@upstash/redis", scope: "User history, key metadata" }
        },
        { 
            id: "node_9", 
            label: "src/lib/r2.ts", 
            type: "code", 
            group: "Database", 
            x: 120, 
            y: 290, 
            description: "S3-compatible client connector for Cloudflare R2 bucket storage.",
            properties: { library: "@aws-sdk/client-s3", scope: "Raw binary persistence" }
        },
        { 
            id: "node_10", 
            label: "Upstash Redis KV", 
            type: "external", 
            group: "Infrastructure", 
            x: 80, 
            y: 500, 
            description: "Remote key-value server storing metadata, active keys, and session contexts.",
            properties: { provider: "Upstash serverless", protocol: "RESP/REST" }
        },
        { 
            id: "node_11", 
            label: "Cloudflare R2 Bucket", 
            type: "external", 
            group: "Infrastructure", 
            x: 200, 
            y: 500, 
            description: "Object storage bucket storing uploaded raw file streams securely.",
            properties: { provider: "Cloudflare", protocol: "S3 compatible" }
        },
        { 
            id: "node_12", 
            label: "Clerk Authentication", 
            type: "external", 
            group: "Infrastructure", 
            x: 520, 
            y: 350, 
            description: "Identity provider managing browser session cookies and keys.",
            properties: { provider: "Clerk.com", integration: "Middleware Auth" }
        }
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

// GET Handler
export async function GET(request: Request) {
    const origin = request.headers.get('origin');
    const headers = corsHeaders(origin);

    try {
        // 1. Try Clerk session auth
        let userId: string | null = null;
        try {
            const session = await auth();
            userId = session.userId;
        } catch (e) {
            // Not authenticated via Clerk session
        }

        // 2. Try API key auth
        if (!userId) {
            userId = await getUserIdFromAuth(request);
        }

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers });
        }

        const { searchParams } = new URL(request.url);
        const namespace = searchParams.get("namespace");

        if (!namespace) {
            return NextResponse.json({ error: "Missing parameter: namespace" }, { status: 400, headers });
        }

        const graphData = await redis.get(`graph:${userId}:${namespace}:latest`);
        let graph: any = DEFAULT_MOCK_GRAPH;

        if (graphData) {
            if (typeof graphData === "string") {
                graph = JSON.parse(graphData);
            } else {
                graph = graphData;
            }
        }

        const tier = searchParams.get("tier") || "L2";

        if (tier === "L0") {
            const l0Summary = {
                namespace,
                nodeCount: graph.nodes.length,
                edgeCount: graph.edges.length,
                groups: Array.from(new Set(graph.nodes.map((n: any) => n.group))),
                topNodes: graph.nodes.slice(0, 5).map((n: any) => ({ id: n.id, label: n.label, type: n.type }))
            };
            return NextResponse.json(l0Summary, { status: 200, headers });
        }

        if (tier === "L1") {
            const l1Nodes = graph.nodes.filter((n: any) => n.group === 'API' || n.group === 'Database' || n.group === 'UI');
            const l1NodeIds = new Set(l1Nodes.map((n: any) => n.id));
            const l1Edges = graph.edges.filter((e: any) => l1NodeIds.has(e.source) && l1NodeIds.has(e.target));
            return NextResponse.json({ nodes: l1Nodes, edges: l1Edges }, { status: 200, headers });
        }

        return NextResponse.json(graph, { status: 200, headers });
    } catch (error: any) {
        console.error("Graphify fetch error:", error);
        return NextResponse.json({ error: error.message || "Failed to fetch graph" }, { status: 500, headers });
    }
}
