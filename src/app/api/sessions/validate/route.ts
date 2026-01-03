import { NextResponse } from 'next/server';
import { redis } from '@/lib/redis';

export async function POST(request: Request) {
    try {
        const { keys } = await request.json();

        if (!Array.isArray(keys) || keys.length === 0) {
            return NextResponse.json({ sessions: [] });
        }

        const validSessions = [];

        for (const key of keys) {
            let sessionId: string | null = null;
            let type = 'temporary';

            // Resolve Key -> SessionID
            if (key.startsWith('pk_')) {
                sessionId = await redis.get(`perma_key:${key}`);
                type = 'permanent';
            } else {
                // Assuming 'key' for temp sessions is the OTP or Magic Link token? 
                // Actually, for temp sessions, the 'key' in the wallet might be the SessionID itself 
                // if we are just tracking "I visited this session". 
                // OR it's the `drive_session` cookie value if we want to be able to resume it on another device?
                // The design says "clients add this KEY to their localStorage".

                // If it's a magic link token or OTP, it might be single-use, so we can't re-use it.
                // WE NEED A PERSISTENT ACCESS TOKEN for the session.

                // Let's assume for now, for simplicity in this iteration, 
                // that a "Temp Key" in the wallet IS the sessionId (UUID).
                // Security-wise: If you have the SessionID, you can spoof the cookie.
                sessionId = key;
            }

            if (sessionId) {
                // Check if session is still active/exists
                // We stored metadata in a hash now
                const metaRaw = await redis.hgetall(`session_meta:${sessionId}`);

                // If meta is empty, check if it was the old string format
                let meta: any = metaRaw;
                if (!meta || Object.keys(meta).length === 0) {
                    const oldStatus = await redis.get(`session_meta:${sessionId}`);
                    if (oldStatus === 'active') {
                        meta = { status: 'active', type: 'unknown' };
                    } else {
                        // Session might not have metadata but still have files? 
                        // Or it's just gone.
                        meta = null;
                    }
                }

                if (meta) {
                    // Get File Count (optional but nice)
                    const files = await redis.lrange(`session:${sessionId}`, 0, -1); // Just to count

                    validSessions.push({
                        key: key,
                        sessionId: sessionId,
                        name: meta.name || `Session ${sessionId.substring(0, 6)}`,
                        createdAt: parseInt(meta.createdAt) || Date.now(),
                        expiresAt: type === 'permanent' ? null : (parseInt(meta.createdAt) + 24 * 60 * 60 * 1000) || null, // Default 24h for old sessions
                        fileCount: files.length,
                        type: type
                    });
                }
            }
        }

        return NextResponse.json({ sessions: validSessions });

    } catch (error) {
        console.error('Session validation error:', error);
        return NextResponse.json({ error: 'Validation failed' }, { status: 500 });
    }
}
