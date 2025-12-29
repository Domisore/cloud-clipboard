import { redis } from "@/lib/redis";
import { NextResponse } from "next/server";

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

        return NextResponse.json({ success: true, id });
    } catch (error) {
        console.error("Metadata save error:", error);
        return NextResponse.json({ error: "Failed to save metadata" }, { status: 500 });
    }
}
