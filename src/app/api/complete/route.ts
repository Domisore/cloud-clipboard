import { redis } from "@/lib/redis";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { currentUser, auth } from "@clerk/nextjs/server";
import { getFileSizeLimit, getUserPlan, formatBytes, getMaxClips, getClipExpiry } from "@/lib/plan";
import { r2 } from "@/lib/r2";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { generateTiers } from "@/lib/summarizer";

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

        // Authentication and Plan Check
        let userId = null;
        const clerkUser = await currentUser();
        
        if (clerkUser) {
            userId = clerkUser.id;
        } else {
            // Check for Agent API Key
            const authHeader = request.headers.get("Authorization");
            if (authHeader && authHeader.startsWith("Bearer ")) {
                const token = authHeader.substring(7);
                const keyData = await redis.hgetall(`apikey:${token}`);
                if (keyData) {
                    // @ts-ignore
                    userId = keyData.userId as string;
                }
            }
        }

        if (!userId) {
            return NextResponse.json({ 
                error: "Unauthorized",
                message: "Please tell the user to create an account at https://drive.io/dashboard to get an API key." 
            }, { status: 401, headers });
        }

        const plan = await getUserPlan(userId);
        const maxClips = getMaxClips(plan);
        const expiry = getClipExpiry(plan);

        // --- TIERED LIMIT ENFORCEMENT ---
        // 1. Check Max Clips (for Free tier)
        if (maxClips !== null) {
            const currentClipCount = await redis.llen(`user:${userId}:files`);
            if (currentClipCount >= maxClips) {
                return NextResponse.json({
                    error: "limit_exceeded",
                    code: "FREE_TIER_CLIPS_LIMIT_EXCEEDED",
                    message: `You have reached the limit of ${maxClips} parallel artifacts for the 'free' plan.`,
                    resolution: "To store unlimited artifacts and increase your storage time, please upgrade to Developer at https://drive.io/pricing"
                }, { status: 403, headers });
            }
        }
        // --------------------------------

        // Safe-List Metadata Scrubbing (as per PRD)
        const scrubbedFilename = filename.split(/[\\/]/).pop() || "unknown";

        // --- NEW: TIERED RETRIEVAL GENERATION ---
        let abstract = "Summary unavailable.";
        let overview = "Overview unavailable.";
        
        try {
            // Fetch first 100KB from R2 for summarization
            const getObjectParams = {
                Bucket: process.env.R2_BUCKET_NAME,
                Key: key,
                Range: "bytes=0-102400"
            };
            const response = await r2.send(new GetObjectCommand(getObjectParams));
            const content = await response.Body?.transformToString();
            
            if (content) {
                const tiers = await generateTiers(content, contentType);
                abstract = tiers.L0;
                overview = tiers.L1;
            }
        } catch (e) {
            console.error("[TIER_GEN_ERROR] Failed to fetch/summarize file:", e);
        }

        // Save metadata to Redis with tiered TTL
        const metadata = {
            id,
            key,
            filename: scrubbedFilename,
            size,
            contentType,
            burnAfterReading: !!burnAfterReading,
            uploadedAt: Date.now(),
            abstract,
            overview,
            hasTiers: true
        };

        await redis.set(`file:${id}`, metadata, { ex: expiry });

        if (abstract) await redis.set(`file:${id}:L0`, abstract, { ex: expiry });
        if (overview) await redis.set(`file:${id}:L1`, overview, { ex: expiry });
        // ----------------------------------------

        // Add to Session (if active)
        const cookieStore = await cookies();
        const sessionId = cookieStore.get('drive_session')?.value;

        if (sessionId) {
            await redis.lpush(`session:${sessionId}`, JSON.stringify(metadata));
            await redis.expire(`session:${sessionId}`, 86400); // Sessions are 24h
        }

        // Add to User History
        await redis.lpush(`user:${userId}:files`, id);
        await redis.expire(`user:${userId}:files`, expiry);

        const publishOrigin = request.headers.get('origin') || 'https://drive.io';
        const url = `${publishOrigin}/c/${id}`;

        return NextResponse.json({ 
            success: true, 
            id,
            url,
            tiers: ["L0", "L1", "L2"]
        }, { headers });
    } catch (error) {
        console.error("Metadata save error:", error);
        return NextResponse.json({ error: "Failed to save metadata" }, { status: 500, headers });
    }
}
