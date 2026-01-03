import { NextResponse } from 'next/server';
import { redis } from '@/lib/redis';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
    try {
        const { key } = await request.json();

        if (!key || !key.startsWith('pk_')) {
            return NextResponse.json({ error: 'Invalid key format' }, { status: 400 });
        }

        // Lookup Session ID
        const sessionId = await redis.get<string>(`perma_key:${key}`);

        if (!sessionId) {
            return NextResponse.json({ error: 'Invalid or revoked key' }, { status: 401 });
        }

        // Establish Session
        const cookieStore = await cookies();
        cookieStore.set('drive_session', sessionId, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 365 * 10 // 10 years
        });

        return NextResponse.json({ success: true, sessionId });

    } catch (error) {
        console.error('Perma-key connect error:', error);
        return NextResponse.json({ error: 'Failed to connect with key' }, { status: 500 });
    }
}
