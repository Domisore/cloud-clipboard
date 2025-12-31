import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get('drive_session')?.value;

    return NextResponse.json({
        connected: !!sessionId,
        sessionId: sessionId || null
    });
}
