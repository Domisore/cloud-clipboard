import { NextResponse } from 'next/server';
import { redis } from '@/lib/redis';
import { cookies } from 'next/headers';

export async function GET() {
    try {
        const cookieStore = await cookies();
        const sessionId = cookieStore.get('drive_session')?.value;

        if (!sessionId) {
            return NextResponse.json({ files: [] }); // No session, empty list
        }

        // Fetch all items from the list
        const rawFiles = await redis.lrange(`session:${sessionId}`, 0, -1);

        // Parse JSON strings
        const files = rawFiles.map(item => {
            try {
                return JSON.parse(item);
            } catch (e) {
                return null;
            }
        }).filter(Boolean);

        return NextResponse.json({ files });
    } catch (error) {
        console.error('Session list error:', error);
        return NextResponse.json({ error: 'Failed to list session files' }, { status: 500 });
    }
}
