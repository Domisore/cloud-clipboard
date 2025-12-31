import { NextResponse } from 'next/server';
import { redis } from '@/lib/redis';
import { cookies } from 'next/headers';

export async function POST() {
    try {
        const cookieStore = await cookies();
        const sessionId = cookieStore.get('drive_session')?.value;

        if (!sessionId) {
            return NextResponse.json({ error: 'No active session' }, { status: 400 });
        }

        // 1. Delete Session Metadata (Invalidates the session globally)
        await redis.del(`session_meta:${sessionId}`);

        // 2. Delete Session Data (Files list)
        await redis.del(`session:${sessionId}`);

        // 3. Clear Cookie locally
        cookieStore.delete('drive_session');

        return NextResponse.json({ success: true, message: 'Session burned' });

    } catch (error) {
        console.error('Session burn error:', error);
        return NextResponse.json({ error: 'Failed to burn session' }, { status: 500 });
    }
}
