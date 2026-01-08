import { Redis } from '@upstash/redis';

const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;

if (!url || !token) {
    console.error("Redis credentials missing. Ensure UPSTASH_REDIS_REST_URL/TOKEN or KV_REST_API_URL/TOKEN are set.");
}

export const redis = new Redis({
    url: url || 'https://example.upstash.io',
    token: token || 'missing_token',
});
