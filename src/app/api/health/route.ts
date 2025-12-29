import { redis } from "@/lib/redis";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const start = Date.now();
        const pong = await redis.ping(); // Should return "PONG"
        const latency = Date.now() - start;

        return NextResponse.json({
            status: 'online',
            redis: {
                connected: pong === 'PONG',
                latency: `${latency}ms`,
                response: pong
            },
            env: {
                hasRedisUrl: !!process.env.UPSTASH_REDIS_REST_URL,
                hasRedisToken: !!process.env.UPSTASH_REDIS_REST_TOKEN,
                hasR2Account: !!process.env.R2_ACCOUNT_ID,
                hasR2Key: !!process.env.R2_ACCESS_KEY_ID,
                hasR2Secret: !!process.env.R2_SECRET_ACCESS_KEY,
                hasR2Bucket: !!process.env.R2_BUCKET_NAME,
            },
            timestamp: new Date().toISOString()
        });
    } catch (e) {
        console.error("Health check failed:", e);
        return NextResponse.json({
            status: 'error',
            error: String(e),
            env: {
                hasRedisUrl: !!process.env.UPSTASH_REDIS_REST_URL,
                hasRedisToken: !!process.env.UPSTASH_REDIS_REST_TOKEN
            }
        }, { status: 500 });
    }
}
