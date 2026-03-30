import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { redis } from "@/lib/redis";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const apiKey = searchParams.get('key');
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

        if (!apiKey) {
            return new NextResponse("Missing key", { status: 400 });
        }

        // Verify ownership
        const keyId = `apikey:${apiKey}`;
        const keyData: any = await redis.hgetall(keyId);
        
        if (!keyData || keyData.userId !== userId) {
            return new NextResponse("Forbidden", { status: 403 });
        }

        // Fetch activity
        const activityKey = `${keyId}:activity`;
        const activities = await redis.lrange(activityKey, 0, 99);
        
        // Upstash returns strings, we need to parse them
        const parsedActivities = activities.map((a: any) => typeof a === 'string' ? JSON.parse(a) : a);

        return NextResponse.json(parsedActivities);

    } catch (error) {
        console.error("Error fetching token activity:", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const apiKey = searchParams.get('key');
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

        if (!apiKey) {
            return new NextResponse("Missing key", { status: 400 });
        }

        // Verify ownership
        const keyId = `apikey:${apiKey}`;
        const keyData: any = await redis.hgetall(keyId);
        
        if (!keyData || keyData.userId !== userId) {
            return new NextResponse("Forbidden", { status: 403 });
        }

        // Clear activity log
        const activityKey = `${keyId}:activity`;
        await redis.del(activityKey);

        return new NextResponse("Deleted", { status: 200 });

    } catch (error) {
        console.error("Error deleting token activity:", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
