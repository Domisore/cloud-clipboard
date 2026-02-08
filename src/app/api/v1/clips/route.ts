import { NextResponse } from 'next/server';
import { redis } from '@/lib/redis';
import { nanoid } from 'nanoid';

export async function POST(request: Request) {
    try {
        // TODO: Implement Bearer token authentication
        // const authHeader = request.headers.get('authorization');
        // if (!authHeader || !authHeader.startsWith('Bearer ')) { ... }

        const body = await request.json();
        const { content, title, isPrivate } = body;

        if (!content) {
            return NextResponse.json(
                { error: 'Missing content' },
                { status: 400 }
            );
        }

        const id = nanoid(10); // Short but unique enough for now
        const createdAt = new Date().toISOString();

        const clipData = {
            id,
            content,
            title: title || 'Untitled Clip',
            isPrivate: !!isPrivate,
            createdAt,
            type: 'text', // Distinguish from files if needed later
        };

        // Store in Redis with a TTL (e.g., 30 days) or persistent
        // Using 30 days (2592000 seconds) for now to mimic temporary clipboard behavior
        await redis.set(`clip:${id}`, JSON.stringify(clipData), { ex: 2592000 });

        // Construct the public URL
        // Assuming the app is hosted at the origin of the request or a configured base URL
        // For now, we'll return a relative path or use the origin from headers if available
        const origin = request.headers.get('origin') || 'https://drive.io';
        const url = `${origin}/c/${id}`;

        return NextResponse.json({
            success: true,
            data: {
                id,
                url,
                expiresAt: new Date(Date.now() + 2592000 * 1000).toISOString(),
            },
        });
    } catch (error) {
        console.error('Error creating clip:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
