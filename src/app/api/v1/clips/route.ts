import { NextResponse } from 'next/server';
import { redis } from '@/lib/redis';
import { nanoid } from 'nanoid';
import { currentUser, auth } from "@clerk/nextjs/server";
import { getFileSizeLimit, getUserPlan, formatBytes, getMaxClips, getClipExpiry } from "@/lib/plan";
import { generateTiers } from "@/lib/summarizer";
import { logActivity } from "@/lib/activity";

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
        const body = await request.json();
        const { content, title, isPrivate, burnAfterReading } = body;

        if (!content) {
            return NextResponse.json(
                { error: 'Missing content' },
                { status: 400, headers }
            );
        }

        // Authentication Check
        let userId = null;
        let apiKeyId = null;

        // 1. Check Bearer Token (Agent API Key)
        const authHeader = request.headers.get("Authorization");
        if (authHeader && authHeader.startsWith("Bearer ")) {
            const token = authHeader.substring(7);
            const keyData = await redis.hgetall(`apikey:${token}`);
            if (keyData) {
                // @ts-ignore
                userId = keyData.userId as string;
                apiKeyId = `apikey:${token}`;
            }
        } else {
            // 2. Fallback to Clerk Session (Human Web App)
            const clerkAuth = await auth();
            userId = clerkAuth.userId;
        }

        if (!userId) {
            return NextResponse.json({ 
                error: "Unauthorized",
                message: "Please tell the user to create an account at https://drive.io/dashboard to get an API key." 
            }, { status: 401, headers });
        }

        // --- TIERED LIMIT ENFORCEMENT ---
        const plan = await getUserPlan(userId);
        const limit = getFileSizeLimit(plan);
        const maxClips = getMaxClips(plan);
        const contentSize = new Blob([content]).size;

        // 1. Check Max Clips (for Free tier)
        if (maxClips !== null) {
            const currentClipCount = await redis.llen(`user:${userId}:files`);
            if (currentClipCount >= maxClips) {
                return NextResponse.json({
                    error: "limit_exceeded",
                    code: "FREE_TIER_CLIPS_LIMIT_EXCEEDED",
                    message: `You have reached the limit of ${maxClips} parallel clips for the 'free' plan.`,
                    limits: [
                        {
                            name: "parallel_clips",
                            limit: maxClips.toString(),
                            actual: currentClipCount.toString(),
                            status: "exceeded"
                        }
                    ],
                    resolution: "To store unlimited clips and increase your storage time, please upgrade to Developer at https://drive.io/pricing"
                }, { status: 403, headers });
            }
        }

        // 2. Check individual Size
        if (contentSize > limit) {
            return NextResponse.json({
                error: "limit_exceeded",
                code: "FREE_TIER_SIZE_LIMIT_EXCEEDED",
                message: `The clip size (${formatBytes(contentSize)}) exceeds the limit for your current '${plan}' plan (${formatBytes(limit)}).`,
                limits: [
                    {
                        name: "clip_size",
                        limit: formatBytes(limit),
                        actual: formatBytes(contentSize),
                        status: "exceeded"
                    }
                ],
                resolution: "To increase your limits to 100 MB per clip, please upgrade to Developer at https://drive.io/pricing"
            }, { status: 413, headers });
        }
        // --------------------------------
        
        const id = nanoid(10); // Short but unique enough for now
        const createdAt = new Date().toISOString();
        const expiry = getClipExpiry(plan);

        // Log activity with preview
        if (apiKeyId) {
            const token = apiKeyId.replace("apikey:", "");
            await redis.hincrby(apiKeyId, "usage", 1);
            
            const expiresAt = Date.now() + expiry * 1000;
            
            // Log activity with preview
            await logActivity(token, {
                type: "CLIP_CREATED",
                id: id,
                preview: content.length > 100 ? content.substring(0, 100) + "..." : content,
                metadata: { 
                    title,
                    expiresAt
                }
            });
        }

        // 3. Generate Tiers (L0, L1) asynchronously or inline for simplicity here
        const tiers = await generateTiers(content);

        const clipData = {
            id,
            content: tiers.L2, // Full content
            abstract: tiers.L0,
            overview: tiers.L1,
            title: title || 'Untitled Clip',
            isPrivate: !!isPrivate,
            burnAfterReading: !!burnAfterReading,
            createdAt,
            type: 'text', // Distinguish from files if needed later
            hasTiers: true
        };

        // Store in Redis with tiered TTL
        await redis.set(`clip:${id}`, JSON.stringify(clipData), { ex: expiry });

        // Store specific tiers for O(1) retrieval
        await redis.set(`clip:${id}:L0`, tiers.L0, { ex: expiry });
        await redis.set(`clip:${id}:L1`, tiers.L1, { ex: expiry });

        // Add to User History
        await redis.lpush(`user:${userId}:files`, id);
        await redis.expire(`user:${userId}:files`, expiry);

        const publishOrigin = request.headers.get('origin') || 'https://drive.io';
        const url = `${publishOrigin}/c/${id}`; // Match the simplified URL in HN article

        return NextResponse.json({
            success: true,
            data: {
                id,
                url,
                tiers: ["L0", "L1", "L2"],
                expiresAt: new Date(Date.now() + expiry * 1000).toISOString(),
            },
        }, { headers });
    } catch (error) {
        console.error('Error creating clip:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500, headers }
        );
    }
}
