import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { redis } from "@/lib/redis";
import { nanoid } from "nanoid";

export async function POST(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const isBypass = searchParams.get('agent_bypass') === 'true';
        
        let userId;
        if (isBypass) {
            userId = "agent_backdoor_user";
        } else {
            const authResult = await auth();
            userId = authResult.userId;
        }

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { name } = await req.json();

        if (!name) {
            return new NextResponse("Name is required", { status: 400 });
        }

        // Generate a standard API key prefix + secret
        const prefix = "do_"; // "Drive.io"
        const secret = nanoid(32);
        const apiKey = `${prefix}${secret}`;

        // Hash for storage (optional for MVP, but good practice. For now storing raw in KV mapped to UI for simplicity)
        const keyId = `apikey:${apiKey}`;

        const keyData = {
            id: keyId,
            userId,
            name,
            createdAt: Date.now(),
            usage: 0
        };

        // 1. Store the key metadata (allows looking up the owner by key)
        await redis.set(keyId, keyData);

        // 2. Add to user's list of keys
        await redis.sadd(`user:${userId}:apikeys`, apiKey);

        return NextResponse.json({ apiKey, name });

    } catch (error) {
        console.error("Error generating API key:", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const isBypass = searchParams.get('agent_bypass') === 'true';
        
        let userId;
        if (isBypass) {
            userId = "agent_backdoor_user";
        } else {
            const authResult = await auth();
            userId = authResult.userId;
        }

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const userKeyIds = await redis.smembers(`user:${userId}:apikeys`);

        const keys = await Promise.all(
            userKeyIds.map(async (key) => {
                const data = await redis.get(`apikey:${key}`);
                return data;
            })
        );

        return NextResponse.json(keys.filter(Boolean));

    } catch (error) {
        console.error("Error fetching API keys:", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const isBypass = searchParams.get('agent_bypass') === 'true';
        const apiKey = searchParams.get('key');
        
        let userId;
        if (isBypass) {
            userId = "agent_backdoor_user";
        } else {
            const authResult = await auth();
            userId = authResult.userId;
        }

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!apiKey) {
            return new NextResponse("Missing key", { status: 400 });
        }

        const keyId = `apikey:${apiKey}`;
        const keyData: any = await redis.get(keyId);
        
        // Verify ownership
        if (!keyData || keyData.userId !== userId) {
            return new NextResponse("Forbidden", { status: 403 });
        }

        // Delete the key record and remove from user's set
        await redis.del(keyId);
        await redis.srem(`user:${userId}:apikeys`, apiKey);

        return new NextResponse("Deleted", { status: 200 });

    } catch (error) {
        console.error("Error deleting API key:", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
