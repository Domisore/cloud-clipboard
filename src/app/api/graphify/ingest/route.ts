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

// OPTIONS Handler
export async function OPTIONS(request: Request) {
    const origin = request.headers.get('origin');
    return new Response(null, {
        status: 200,
        headers: corsHeaders(origin),
    });
}

// POST Handler
export async function POST(request: Request) {
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
        const queryNamespace = searchParams.get("namespace");

        const body = await request.json();
        let { namespace, graph } = body;

        // Support various formats:
        // 1. Nested format: { namespace, graph: { nodes, edges } }
        // 2. Flat format: { namespace, nodes, edges }
        // 3. Flat with links instead of edges: { namespace, nodes, links }
        const nodes = body.nodes || (graph && graph.nodes);
        const edges = body.edges || (graph && graph.edges) || body.links || (graph && graph.links);

        if (!namespace && body.namespace) {
            namespace = body.namespace;
        }

        // Apply query parameter override/fallback
        if (!namespace && queryNamespace) {
            namespace = queryNamespace;
        }

        // Apply database fallback if namespace is still missing
        if (!namespace) {
            try {
                const namespaces = await redis.smembers(`user:${userId}:namespaces`);
                if (namespaces && namespaces.length > 0) {
                    namespace = namespaces[0];
                } else {
                    namespace = "default";
                }
            } catch (e) {
                namespace = "default";
            }
        }

        // Validate and normalize the graph structure for frontend compatibility
        if (nodes && edges) {
            const normalizedNodes = (nodes || []).map((node: any, idx: number) => {
                const fileType = node.type || node.file_type || "code";
                const groupName = node.group || (node.community !== undefined ? `Community ${node.community}` : "General");
                
                // Position nodes dynamically on a spiral layout if x and y are missing
                const defaultX = node.x !== undefined ? node.x : 350 + Math.cos(idx * 0.9) * (110 + idx * 18);
                const defaultY = node.y !== undefined ? node.y : 250 + Math.sin(idx * 0.9) * (90 + idx * 14);

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

            const normalizedEdges = (edges || []).map((edge: any) => {
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

        if (!namespace || !graph || !graph.nodes || !graph.edges) {
            return NextResponse.json({ error: "Missing required fields: namespace, graph (with nodes and edges)" }, { status: 400, headers });
        }

        // Ensure namespace is registered
        await redis.sadd(`user:${userId}:namespaces`, namespace);

        // Increment version counter
        const version = await redis.incr(`graph:${userId}:${namespace}:version_counter`);

        // Save latest graph
        await redis.set(`graph:${userId}:${namespace}:latest`, JSON.stringify(graph));

        // Save version-specific graph
        await redis.set(`graph:${userId}:${namespace}:v${version}`, JSON.stringify(graph));

        // Save version metadata in history list
        const versionMeta = {
            version,
            uploadedAt: Date.now(),
            nodeCount: graph.nodes.length,
            edgeCount: graph.edges.length
        };
        await redis.lpush(`graph:${userId}:${namespace}:versions`, JSON.stringify(versionMeta));

        return NextResponse.json({ 
            success: true, 
            version,
            nodeCount: graph.nodes.length,
            edgeCount: graph.edges.length
        }, { status: 200, headers: {
            ...headers,
            'Content-Type': 'application/json'
        } });
    } catch (error: any) {
        console.error("Graphify ingest error:", error);
        return NextResponse.json({ error: error.message || "Failed to ingest graph" }, { status: 500, headers });
    }
}
