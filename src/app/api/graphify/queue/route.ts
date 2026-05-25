import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";
import { auth } from "@clerk/nextjs/server";
import { nanoid } from "nanoid";

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

// GET Handler (Check Job Status)
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

        const { searchParams } = new URL(request.url);
        const jobId = searchParams.get("jobId");

        if (!jobId) {
            return NextResponse.json({ error: "Missing parameter: jobId" }, { status: 400, headers });
        }

        const job = await redis.hgetall(`graphify:job:${jobId}`);
        if (!job) {
            return NextResponse.json({ error: "Job not found" }, { status: 404, headers });
        }

        // Verify that the user owns this job
        if (job.userId !== userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers });
        }

        return NextResponse.json(job, { status: 200, headers });
    } catch (error: any) {
        console.error("Graphify job status check error:", error);
        return NextResponse.json({ error: error.message || "Failed to check job status" }, { status: 500, headers });
    }
}

// POST Handler (Enqueue Compilation Job)
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

        const body = await request.json();
        const { namespace } = body;

        if (!namespace) {
            return NextResponse.json({ error: "Missing parameter: namespace" }, { status: 400, headers });
        }

        const jobId = `job_${nanoid(10)}`;

        // Store job state
        await redis.hset(`graphify:job:${jobId}`, {
            status: "queued",
            namespace,
            userId,
            createdAt: Date.now()
        });

        // Push to job queue list
        const jobPayload = { jobId, userId, namespace };
        await redis.lpush("graphify:jobs", JSON.stringify(jobPayload));

        return NextResponse.json({ 
            success: true, 
            jobId,
            status: "queued"
        }, { status: 200, headers });

    } catch (error: any) {
        console.error("Graphify queue error:", error);
        return NextResponse.json({ error: error.message || "Failed to queue job" }, { status: 500, headers });
    }
}
