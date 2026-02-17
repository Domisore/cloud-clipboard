import { NextResponse } from 'next/server';
import { redis } from '@/lib/redis';
import { currentUser } from '@clerk/nextjs/server';

export async function GET() {
    try {
        const user = await currentUser();

        if (!user) {
            return NextResponse.json({ files: [] });
        }

        // Fetch user's file IDs
        const fileIds = await redis.lrange(`user:${user.id}:files`, 0, -1);

        if (!fileIds.length) {
            return NextResponse.json({ files: [] });
        }

        // Fetch metadata for each file
        // We use mget if possible, but keys are `file:{id}`
        // redis.mget doesn't support pattern w/o keys, so we map.
        // Pipeline would be better but let's do parallel get for now or loop.

        // Actually, let's use a pipeline or just Promise.all
        const promises = fileIds.map(id => redis.get(`file:${id}`));
        const rawFiles = await Promise.all(promises);

        // Filter out nulls (expired files)
        const files = rawFiles.filter(Boolean);

        return NextResponse.json({ files });
    } catch (error) {
        console.error('User files list error:', error);
        return NextResponse.json({ error: 'Failed to list user files' }, { status: 500 });
    }
}
