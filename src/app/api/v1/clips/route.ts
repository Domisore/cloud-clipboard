import { NextResponse } from 'next/server';
import { redis } from '@/lib/redis';
import { nanoid } from 'nanoid';
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
        const body = await request.json();
        const { content, title, isPrivate, burnAfterReading } = body;

        if (!content) {
            return NextResponse.json(
                { error: 'Missing content' },
                { status: 400, headers }
            );
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

        // Add to User History (if active)
        const user = await currentUser();
        if (user) {
            await redis.lpush(`user:${user.id}:files`, id);
            await redis.expire(`user:${user.id}:files`, 2592000); // 30 days
        }

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
