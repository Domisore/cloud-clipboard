import { NextResponse } from 'next/server';
import { redis } from '@/lib/redis';
import { nanoid } from 'nanoid';
import { currentUser, auth } from "@clerk/nextjs/server";
import { getFileSizeLimit, getUserPlan, formatBytes } from "@/lib/plan";

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
        const contentSize = new Blob([content]).size;

        if (contentSize > limit) {
            return NextResponse.json({
                error: "limit_exceeded",
                code: "FREE_TIER_LIMIT_EXCEEDED",
                message: `The clip size (${formatBytes(contentSize)}) exceeds the limit for your current '${plan}' plan (${formatBytes(limit)}).`,
                limits: [
                    {
                        name: "clip_size",
                        limit: formatBytes(limit),
                        actual: formatBytes(contentSize),
                        status: "exceeded"
                    }
                ],
                resolution: "To increase your limits to 100 MB per clip, please upgrade to Pro at https://drive.io/pricing"
            }, { status: 413, headers });
        }
        // --------------------------------

        // Increment API Key usage
        if (apiKeyId) {
            await redis.hincrby(apiKeyId, "usage", 1);
        }

        const id = nanoid(10); // Short but unique enough for now
        const createdAt = new Date().toISOString();

        const clipData = {
            id,
            content,
            title: title || 'Untitled Clip',
            isPrivate: !!isPrivate,
            burnAfterReading: !!burnAfterReading,
            createdAt,
            type: 'text', // Distinguish from files if needed later
        };

        // Store in Redis with a TTL (e.g., 30 days)
        await redis.set(`clip:${id}`, JSON.stringify(clipData), { ex: 2592000 });

        // Add to User History
        await redis.lpush(`user:${userId}:files`, id);
        await redis.expire(`user:${userId}:files`, 2592000); // 30 days

        const publishOrigin = request.headers.get('origin') || 'https://drive.io';
        const url = `${publishOrigin}/${id}`;

        return NextResponse.json({
            success: true,
            data: {
                id,
                url,
                expiresAt: new Date(Date.now() + 2592000 * 1000).toISOString(),
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
