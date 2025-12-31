import { NextResponse } from 'next/server';
import { redis } from '@/lib/redis';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
    try {
        const { otp } = await request.json();

        if (!otp) {
            return NextResponse.json({ error: 'OTP is required' }, { status: 400 });
        }

        // 1. Validate OTP
        const sessionId = await redis.get<string>(`pair_token:${otp}`);

        if (!sessionId) {
            return NextResponse.json({ error: 'Invalid or expired code' }, { status: 401 });
        }

        // 2. Set Session Cookie
        const cookieStore = await cookies();
        cookieStore.set('drive_session', sessionId, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 // 24 hours
        });

        // 3. Delete OTP (Single-use)
        await redis.del(`pair_token:${otp}`);

        return NextResponse.json({ success: true, sessionId });

    } catch (error) {
        console.error('Sync join error:', error);
        return NextResponse.json({ error: 'Failed to join session' }, { status: 500 });
    }
}
