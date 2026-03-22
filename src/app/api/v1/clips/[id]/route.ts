import { NextResponse } from 'next/server';
import { redis } from '@/lib/redis';

// CORS headers Helper
function corsHeaders(origin: string | null) {
    const allowedOrigin = origin || '*';
    return {
        'Access-Control-Allow-Origin': allowedOrigin,
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };
}

export async function OPTIONS(request: Request) {
    const origin = request.headers.get('origin');
    return new NextResponse(null, {
        status: 200,
        headers: corsHeaders(origin),
    });
}

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const origin = request.headers.get('origin');
    const headers = corsHeaders(origin);

    const { searchParams } = new URL(request.url);
    const tier = searchParams.get('tier') || 'L2'; // Default to full content

    try {
        // 1. If tier is L0 or L1, try O(1) specific key first
        if (tier === 'L0' || tier === 'L1') {
            const tieredContent = await redis.get(`clip:${id}:${tier}`) || await redis.get(`file:${id}:${tier}`);
            if (tieredContent) {
                return NextResponse.json({
                    success: true,
                    tier,
                    content: tieredContent
                }, { headers });
            }
        }

        // 2. Fallback: Get full clip or file data
        const rawClip = await redis.get(`clip:${id}`);
        const rawFile = !rawClip ? await redis.get(`file:${id}`) : null;
        const rawData = rawClip || rawFile;

        if (!rawData) {
            return NextResponse.json({ error: "Artifact not found" }, { status: 404, headers });
        }

        const data = typeof rawData === 'string' ? JSON.parse(rawData) : rawData;

        // Return requested tier from object if available, else L2 (full content)
        // For files, L2 is usually handled via the download link, but here we provide metadata 
        // or a pointer if it's L2.
        let content = data.content || (data.key ? `[Full File: ${data.filename}]` : "");
        if (tier === 'L0') content = data.abstract || "L0 tier unavailable.";
        if (tier === 'L1') content = data.overview || "L1 tier unavailable.";

        return NextResponse.json({
            success: true,
            tier,
            content: content,
            metadata: {
                title: data.title || data.filename,
                createdAt: data.createdAt || data.uploadedAt,
                type: data.type || (data.key ? 'file' : 'text'),
                size: data.size
            }
        }, { headers });

    } catch (error) {
        console.error("[RETRIEVAL_ERROR]", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500, headers });
    }
}
