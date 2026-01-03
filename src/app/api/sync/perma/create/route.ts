import { NextResponse } from 'next/server';
import { redis } from '@/lib/redis';
import { cookies } from 'next/headers';
import { v4 as uuidv4 } from 'uuid';
import { nanoid } from 'nanoid';

export async function POST(request: Request) {
    try {
        const cookieStore = await cookies();
        let sessionId = cookieStore.get('drive_session')?.value;

        // If no session exists, create one
        if (!sessionId) {
            sessionId = uuidv4();
            cookieStore.set('drive_session', sessionId, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 60 * 60 * 24 * 365 * 10 // 10 years (effectively permanent)
            });
        }

        // Generate 32-char generic token, prefixed with pk_
        const rawToken = nanoid(32);
        const permKey = `pk_${rawToken}`;

        // Store Key -> SessionID mapping (Permanent)
        await redis.set(`perma_key:${permKey}`, sessionId);

        // Mark Session as Active (Revocable)
        await redis.set(`session_meta:${sessionId}`, 'active'); // No expiry for perma sessions? Or just long?

        return NextResponse.json({
            key: permKey
        });

    } catch (error) {
        console.error('Perma-key generation error:', error);
        return NextResponse.json({ error: 'Failed to generate permanent key' }, { status: 500 });
    }
}
