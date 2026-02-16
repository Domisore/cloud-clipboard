import { Redis } from '@upstash/redis';

// Hardcoding credentials for debugging session since environment loading is flaky in this context
const url = "https://mutual-sloth-58086.upstash.io";
const token = "AeLmAAIncDE0NzFiMjAxNGNjNzU0NTFlYjYzNDg3MDFhMDc5MmZiMHAxNTgwODY";

if (!url || !token) {
    console.error("Redis credentials missing.");
    process.exit(1);
}

const redis = new Redis({
    url: url,
    token: token,
});

async function checkKey() {
    const id = 'k70A3Ap4PE';
    console.log(`Checking Redis for ID: ${id}`);

    try {
        const clip = await redis.get(`clip:${id}`);
        console.log('Clip data:', clip);

        const file = await redis.get(`file:${id}`);
        console.log('File data:', file);
    } catch (error) {
        console.error("Redis error:", error);
    }
}

checkKey();
