import { NextResponse } from 'next/server';
import { redis } from '@/lib/redis';

export const dynamic = 'force-dynamic';
export const revalidate = 0; // Disable cache for real-time monitoring

async function scanPrefixCount(prefix: string): Promise<number> {
    try {
        let cursor: string | number = 0;
        let count = 0;
        do {
            const result = await redis.scan(cursor, { match: `${prefix}:*`, count: 1000 });
            // Upstash returns [cursor, [keys]]
            const nextCursor = result[0] as string | number;
            const keys = (result[1] || []) as string[];

            count += keys.length;
            cursor = nextCursor;
        } while (cursor !== 0 && cursor !== "0");
        return count;
    } catch (error) {
        console.error(`Error scanning prefix ${prefix}:`, error);
        return 0; // Return 0 on error so it doesn't break the whole page
    }
}

export async function GET() {
    try {
        // We're just fetching the counts of existing keys. 
        // No sensitive data is loaded or exposed.
        const [
            activeSessions,
            permanentLinks,
            uploadedFiles,
            textClips
        ] = await Promise.all([
            scanPrefixCount('session_meta'),
            scanPrefixCount('perma_key'),
            scanPrefixCount('file'),
            scanPrefixCount('clip')
        ]);

        return NextResponse.json({
            success: true,
            data: {
                activeSessions,
                permanentLinks,
                uploadedFiles,
                textClips,
                lastUpdated: new Date().toISOString()
            }
        });
    } catch (error) {
        console.error('Metrics fetch error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch metrics' },
            { status: 500 }
        );
    }
}
