import { Redis } from '@upstash/redis';

export const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL || 'https://unexpected-missing-url.upstash.io',
    token: process.env.UPSTASH_REDIS_REST_TOKEN || 'missing-token',
});
