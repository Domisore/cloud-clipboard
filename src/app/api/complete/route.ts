import { redis } from "@/lib/redis";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { currentUser } from "@clerk/nextjs/server";

// CORS headers Helper
function corsHeaders(origin: string | null) {
    const allowedOrigin = origin || '*';
    return {
        'Access-Control-Allow-Origin': allowedOrigin,
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Credentials': 'true',
    };
}

export async function OPTIONS(request: Request) {
    const origin = request.headers.get('origin');
    return new NextResponse(null, {
        status: 200,
        headers: corsHeaders(origin),
    });
}

export async function POST(request: Request) {
    const origin = request.headers.get('origin');
    const headers = corsHeaders(origin);

    try {
        const { id, key, filename, size, contentType, burnAfterReading } = await request.json();

        if (!id || !key || !filename || !size) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400, headers });
        }

        // Save metadata to Redis with 24h expiry
        const metadata = {
            id,
            key,
            filename,
            size,
            contentType,
            burnAfterReading: !!burnAfterReading,
            uploadedAt: Date.now(),
        };

        await redis.set(`file:${id}`, metadata, { ex: 86400 }); // 24 hours

        // Add to Session (if active)
        const cookieStore = await cookies();
        const sessionId = cookieStore.get('drive_session')?.value;

        if (sessionId) {
            // Push to front of list
            await redis.lpush(`session:${sessionId}`, JSON.stringify(metadata));
            // Keep only last 20 items? Or just rely on expire?
            // Let's set expire on the list itself to match the session window (24h)
            await redis.expire(`session:${sessionId}`, 86400);
        }

        // Add to User History (if active)
        const user = await currentUser();
        if (user) {
            await redis.lpush(`user:${user.id}:files`, id);
            await redis.expire(`user:${user.id}:files`, 2592000); // 30 days
        }

        return NextResponse.json({ success: true, id }, { headers });
    } catch (error) {
        console.error("Metadata save error:", error);
        return NextResponse.json({ error: "Failed to save metadata" }, { status: 500, headers });
    }
}
