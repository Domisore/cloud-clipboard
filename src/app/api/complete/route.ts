import { redis } from "@/lib/redis";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: Request) {
    try {
        const { id, key, filename, size, contentType } = await request.json();

        if (!id || !key || !filename || !size) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Save metadata to Redis with 24h expiry
        const metadata = {
            id,
            key,
            filename,
            size,
            contentType,
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

        return NextResponse.json({ success: true, id });
    } catch (error) {
        console.error("Metadata save error:", error);
        return NextResponse.json({ error: "Failed to save metadata" }, { status: 500 });
    }
}
