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

// OPTIONS Handler (CORS preflight)
export async function OPTIONS(request: Request) {
    const origin = request.headers.get('origin');
    return new Response(null, {
        status: 200,
        headers: corsHeaders(origin),
    });
}

// GET Handler - Fetch Version History
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

        // 2. Parse query parameters
        const { searchParams } = new URL(request.url);
        const namespace = searchParams.get("namespace");

        if (!namespace) {
            return NextResponse.json({ error: "Missing parameter: namespace" }, { status: 400, headers });
        }

        // 3. Fetch version metadata list from Redis
        const rawVersions = await redis.lrange(`graph:${userId}:${namespace}:versions`, 0, -1);
        const versions = rawVersions.map((v) => {
            if (typeof v === "string") {
                try {
                    return JSON.parse(v);
                } catch (e) {
                    return v;
                }
            }
            return v;
        });

        return NextResponse.json({ success: true, versions }, { status: 200, headers });

    } catch (error: any) {
        console.error("Graphify versions fetch error:", error);
        return NextResponse.json({ error: error.message || "Failed to fetch versions" }, { status: 500, headers });
    }
}

// POST Handler - Rollback / Restore version
export async function POST(request: Request) {
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

        // 2. Parse request body
        const body = await request.json();
        const { namespace, version } = body;

        if (!namespace) {
            return NextResponse.json({ error: "Missing parameter: namespace" }, { status: 400, headers });
        }
        if (version === undefined || version === null) {
            return NextResponse.json({ error: "Missing parameter: version" }, { status: 400, headers });
        }

        // 3. Fetch specific graph version
        const targetGraph = await redis.get(`graph:${userId}:${namespace}:v${version}`);
        if (!targetGraph) {
            return NextResponse.json({ error: `Graph version v${version} not found` }, { status: 404, headers });
        }

        // 4. Overwrite latest pointer with version data
        await redis.set(`graph:${userId}:${namespace}:latest`, typeof targetGraph === "string" ? targetGraph : JSON.stringify(targetGraph));

        // 5. Append a restore/rollback log record in the versions list
        const restoreMeta = {
            version,
            uploadedAt: Date.now(),
            isRestore: true,
            restoredFrom: `v${version}`
        };
        await redis.lpush(`graph:${userId}:${namespace}:versions`, JSON.stringify(restoreMeta));

        return NextResponse.json({
            success: true,
            message: `Successfully restored namespace ${namespace} to version v${version}`,
            version
        }, { status: 200, headers });

    } catch (error: any) {
        console.error("Graphify versions rollback error:", error);
        return NextResponse.json({ error: error.message || "Failed to restore version" }, { status: 500, headers });
    }
}
