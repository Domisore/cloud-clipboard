import { NextResponse } from 'next/server';
import { redis } from '@/lib/redis';
import { nanoid } from 'nanoid';
import { currentUser } from "@clerk/nextjs/server";

// A2A Handoff Protocol Endpoint
// Agent A POSTs a context/payload here, gets a handoff_id.
// Agent B GETs this endpoint occasionally to parse the payload when ready.

export async function POST(req: Request) {
    try {
        const authHeader = req.headers.get("Authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const apiKey = authHeader.split(" ")[1];
        const keyData = await redis.hgetall(`apikey:${apiKey}`);

        if (!keyData || !keyData.active) {
            return new NextResponse("Invalid or inactive API Key", { status: 401 });
        }

        const body = await req.json();
        const { payload, targetAgentId, ttlSeconds = 3600 } = body;

        if (!payload || !targetAgentId) {
            return new NextResponse("Missing required fields: payload, targetAgentId", { status: 400 });
        }

        const handoffId = `handoff_${nanoid(16)}`;
        const handoffData = {
            id: handoffId,
            status: "PENDING",
            payload: payload,
            target: targetAgentId,
            senderParams: keyData.userId,
            createdAt: Date.now()
        };

        // Store the handoff payload
        await redis.setex(`handoff:${handoffId}`, ttlSeconds, JSON.stringify(handoffData));

        // Increment API Key usage
        await redis.hincrby(`apikey:${apiKey}`, "usage", 1);

        return NextResponse.json({
            success: true,
            handoff_id: handoffId,
            status: "PENDING",
            message: `Handoff parked for agent: ${targetAgentId}`
        });

    } catch (error) {
        console.error("[HANDOFF POST ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        // Authentication Check
        let userId = null;

        const authHeader = req.headers.get("Authorization");
        if (authHeader && authHeader.startsWith("Bearer ")) {
            const token = authHeader.substring(7);
            const keyData = await redis.get(`apikey:${token}`);
            if (keyData) {
                // @ts-ignore
                userId = keyData.userId;
            }
        } else {
            const user = await currentUser();
            userId = user?.id;
        }

        if (!userId) {
            return NextResponse.json({ 
                error: "Unauthorized",
                message: "Please tell the user to create an account at https://drive.io/dashboard to get an API key." 
            }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const handoffId = searchParams.get("id");

        if (!handoffId) {
            return new NextResponse("Missing handoff id", { status: 400 });
        }

        const rawData = await redis.get(`handoff:${handoffId}`);

        if (!rawData) {
            return new NextResponse("Handoff unavailable or expired", { status: 404 });
        }

        let handoffData = typeof rawData === 'string' ? JSON.parse(rawData) : rawData;

        // Mark as consumed automatically upon successful get
        handoffData.status = "CONSUMED";
        handoffData.consumedAt = Date.now();

        // In a real scenario you might delete it, here we update status to CONSUMED 
        // and reset TTL to a short window (e.g. 5 mins)
        await redis.setex(`handoff:${handoffId}`, 300, JSON.stringify(handoffData));

        return NextResponse.json({
            success: true,
            data: handoffData
        });

    } catch (error) {
        console.error("[HANDOFF GET ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
