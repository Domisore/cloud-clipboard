import { NextResponse } from 'next/server';
import { redis } from '@/lib/redis';
import { r2 } from '@/lib/r2';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        // In Next.js 15+, params is a Promise
        const { id } = await params;

        if (!id) {
            return NextResponse.json({ error: 'Missing file ID' }, { status: 400 });
        }

        // 1. Get metadata from Redis (Try FILE first)
        let metadata: any = await redis.get(`file:${id}`);
        let isClip = false;

        if (!metadata) {
            // 2. Try CLIP
            metadata = await redis.get(`clip:${id}`);
            if (metadata) {
                isClip = true;
            } else {
                return NextResponse.json({ error: 'File not found or expired' }, { status: 404 });
            }
        }

        if (isClip) {
            // It's a text clip, allow valid response without R2
            return NextResponse.json({
                id: metadata.id,
                filename: metadata.title || 'snippet.txt',
                size: new Blob([metadata.content]).size,
                mimeType: 'text/plain',
                uploadedAt: metadata.createdAt,
                expiresAt: null, // Clips might use Redis TTL, here we can just say null or calc
                url: `data:text/plain;charset=utf-8,${encodeURIComponent(metadata.content)}`,
                rawUrl: null
            });
        }

        // 2. Generate Presigned URL for Download (GET)
        const command = new GetObjectCommand({
            Bucket: process.env.R2_BUCKET_NAME,
            Key: metadata.key,
        });

        // URL valid for 1 hour
        const downloadUrl = await getSignedUrl(r2, command, { expiresIn: 3600 });

        // 3. Return combined data
        // We map Redis metadata to the frontend's expected UploadResult shape
        return NextResponse.json({
            id: metadata.id,
            filename: metadata.filename,
            size: metadata.size,
            mimeType: metadata.contentType, // Backend stores as contentType, frontend uses mimeType
            uploadedAt: metadata.uploadedAt,
            expiresAt: metadata.uploadedAt + 24 * 60 * 60 * 1000, // 24h validity
            url: downloadUrl, // The crucial part: this is now the real R2 URL
            rawUrl: downloadUrl // Alias if needed
        });

    } catch (error) {
        console.error('File fetch error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
