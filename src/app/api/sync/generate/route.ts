import { NextResponse } from 'next/server';
import { redis } from '@/lib/redis';
import { customAlphabet } from 'nanoid';
import { cookies } from 'next/headers';
import { v4 as uuidv4 } from 'uuid';

// 6-digit number generator
const generateOTP = customAlphabet('0123456789', 6);

export async function POST(request: Request) {
    try {
        const cookieStore = await cookies();
        let sessionId = cookieStore.get('drive_session')?.value;

        // If no session exists, create one
        if (!sessionId) {
            sessionId = uuidv4();
        }

        // Generate 6-digit OTP
        const otp = generateOTP();

        // Store OTP -> SessionID mapping with 120s TTL
        await redis.set(`pair_token:${otp}`, sessionId, { ex: 120 });

        // Mark Session as Active (Revocable)
        await redis.set(`session_meta:${sessionId}`, 'active', { ex: 86400 });

        // If it was a new session, ensure we set the cookie on the generator too (optional, but good practice)
        // actually, mostly we just return the OTP. The generator already "knows" its session or will adopt this one?
        // Usually generator is the 'host'. If it didn't have a session, it now 'has' one effectively.
        // We should probably set the cookie here if it didn't exist, so the host is "logged in" to the session it just shared.
        if (!cookieStore.get('drive_session')) {
            cookieStore.set('drive_session', sessionId, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 60 * 60 * 24 // 24 hours
            });
        }

        return NextResponse.json({
            otp,
            expiresAt: Date.now() + 120 * 1000,
            magicLink: `${new URL(request.url).origin}/sync/${otp}` // Construct magic link
        });

    } catch (error) {
        console.error('Sync generation error:', error);
        return NextResponse.json({ error: 'Failed to generate sync token' }, { status: 500 });
    }
}
