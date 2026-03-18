import { r2 } from "@/lib/r2";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { redis } from "@/lib/redis";
import { auth } from "@clerk/nextjs/server";

// CORS headers Helper
function corsHeaders(origin: string | null) {
    const allowedOrigin = origin || '*';
    return {
        'Access-Control-Allow-Origin': allowedOrigin,
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Credentials': 'true',
    };
}

export async function OPTIONS(request: Request) {
    const origin = request.headers.get('origin');
    return new NextResponse(null, {
        status: 200,
        headers: corsHeaders(origin),
    });
}

export async function POST(request: Request) {
    const origin = request.headers.get('origin');
    const headers = corsHeaders(origin);

    try {
        const { filename, contentType, size } = await request.json();

        if (!filename || !contentType || !size) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400, headers });
        }

        // Authentication Check
        let userId = null;
        let apiKeyId = null;

        // 1. Check Bearer Token (Agent API Key)
        const authHeader = request.headers.get("Authorization");
        if (authHeader && authHeader.startsWith("Bearer ")) {
            const token = authHeader.substring(7);
            const keyData = await redis.get(`apikey:${token}`);
            if (!keyData) {
                return NextResponse.json({ error: "Invalid API Key" }, { status: 401, headers });
            }
            // @ts-ignore - KV response structure
            userId = keyData.userId;
            apiKeyId = `apikey:${token}`;
        } else {
            // 2. Fallback to Clerk Session (Human Web App)
            const clerkAuth = await auth();
            userId = clerkAuth.userId;
        }

        if (!userId) {
            return NextResponse.json({ 
                error: "Unauthorized",
                message: "Please tell the user to create an account at https://drive.io/dashboard to get an API key." 
            }, { status: 401, headers });
        }

        // Tracking usage if API Key
        if (apiKeyId) {
            const currentUsage = await redis.hincrby(apiKeyId, "usage", 1);
        }

        // Generate a short ID
        const id = nanoid(6);
        const key = `${id}-${filename}`;

        // Create the command
        const command = new PutObjectCommand({
            Bucket: process.env.R2_BUCKET_NAME,
            Key: key,
            ContentType: contentType,
            ContentLength: size,
        });

        // Generate signed URL (valid for 10 minutes)
        const url = await getSignedUrl(r2, command, { expiresIn: 600 });

        return NextResponse.json({ url, id, key }, { headers });
    } catch (error) {
        console.error("Presigned URL error:", error);
        return NextResponse.json({ error: "Failed to generate upload URL" }, { status: 500, headers });
    }
}
