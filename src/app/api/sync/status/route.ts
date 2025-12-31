import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { redis } from '@/lib/redis';

export async function GET() {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get('drive_session')?.value;

    let isValid = false;
    if (sessionId) {
        // Check if session is truly active (not burned)
        const status = await redis.get(`session_meta:${sessionId}`);
        isValid = status === 'active';
    }

    if (!isValid && sessionId) {
        // If we have a cookie but session is invalid (burned/expired), 
        // we essentially tell client to consider itself disconnected.
        // The client context should handle clearing the slate.
    }

    return NextResponse.json({
        connected: isValid,
        sessionId: isValid ? sessionId : null
    });
}
