// Simulate the server-side logic of /api/file/[id]/route.ts
import { Redis } from '@upstash/redis';

const url = "https://mutual-sloth-58086.upstash.io";
const token = "AeLmAAIncDE0NzFiMjAxNGNjNzU0NTFlYjYzNDg3MDFhMDc5MmZiMHAxNTgwODY";

const redis = new Redis({
    url: url,
    token: token,
});

async function simulateGet(id: string) {
    console.log(`Simulating GET /api/file/${id}`);

    // 1. Get metadata from Redis (Try FILE first)
    let metadata: any = await redis.get(`file:${id}`);
    let isClip = false;

    if (!metadata) {
        console.log("Not found in file:..., checking clip:...");
        // 2. Try CLIP
        metadata = await redis.get(`clip:${id}`);
        if (metadata) {
            isClip = true;
            console.log("Found in clip:", metadata);
        } else {
            console.log("Not found in clip either.");
            return;
        }
    } else {
        console.log("Found in file:", metadata);
    }

    // 3. Check for Burn After Reading
    if (metadata.burnAfterReading) {
        console.log("Burn after reading is TRUE. Would delete.");
    }

    if (isClip) {
        // It's a text clip, allow valid response without R2
        const responseProxy = {
            id: metadata.id,
            filename: metadata.title || 'snippet.txt',
            size: new Blob([metadata.content]).size,
            mimeType: 'text/plain',
            uploadedAt: metadata.createdAt,
            expiresAt: null,
            url: `data:text/plain;charset=utf-8,${encodeURIComponent(metadata.content)}`,
            rawUrl: null
        };
        console.log("Constructed Response:", responseProxy);
    }
}

simulateGet('k70A3Ap4PE');
