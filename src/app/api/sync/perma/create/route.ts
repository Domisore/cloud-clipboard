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
        const defaultName = `Session ${rawToken.substring(0, 6)}`;
        const createdAt = Date.now();

        // Store Key -> SessionID mapping (Permanent)
        await redis.set(`perma_key:${permKey}`, sessionId);

        // Store Session Metadata
        // We use a hash to store metadata about the session
        await redis.hset(`session_meta:${sessionId}`, {
            status: 'active',
            name: defaultName,
            createdAt: createdAt,
            type: 'permanent'
        });

        return NextResponse.json({
            key: permKey,
            sessionId: sessionId,
            name: defaultName,
            createdAt: createdAt,
            expiresAt: null // Permanent
        });

    } catch (error: any) {
        console.error('Perma-key generation error DETAILS:', {
            message: error.message,
            stack: error.stack,
            env_vars_check: {
                has_upstash_url: !!process.env.UPSTASH_REDIS_REST_URL,
                has_kv_url: !!process.env.KV_REST_API_URL,
                has_redis_url: !!process.env.REDIS_URL
            }
        });
        return NextResponse.json({
            error: 'Failed to generate permanent key',
            details: error.message
        }, { status: 500 });
    }
}
