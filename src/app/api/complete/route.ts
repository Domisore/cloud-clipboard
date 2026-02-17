import { redis } from "@/lib/redis";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { currentUser } from "@clerk/nextjs/server";

export async function POST(request: Request) {
    try {
        const { id, key, filename, size, contentType, burnAfterReading } = await request.json();

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
            // No expiration for user history? Or maybe 30 days?
            // Let's keep it 30 days for now to avoid indefinite growth of old file refs
            // Note: The metadata itself expires in 24h, so we might have dead links if we don't clean up
            // BUT, user might want to see history of what they uploaded even if it's expired?
            // For now, let's just push. API will handle missing metadata.
            await redis.expire(`user:${user.id}:files`, 2592000); // 30 days
        }

        return NextResponse.json({ success: true, id });
    } catch (error) {
        console.error("Metadata save error:", error);
        return NextResponse.json({ error: "Failed to save metadata" }, { status: 500 });
    }
}
