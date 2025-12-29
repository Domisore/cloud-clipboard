import { r2 } from "@/lib/r2";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextResponse } from "next/server";
import { nanoid } from "nanoid";

export async function POST(request: Request) {
    try {
        const { filename, contentType, size } = await request.json();

        if (!filename || !contentType || !size) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
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

        return NextResponse.json({ url, id, key });
    } catch (error) {
        console.error("Presigned URL error:", error);
        return NextResponse.json({ error: "Failed to generate upload URL" }, { status: 500 });
    }
}
