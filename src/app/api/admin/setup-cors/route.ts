import { r2 } from "@/lib/r2";
import { PutBucketCorsCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        console.log("Attempting to apply CORS to bucket:", process.env.R2_BUCKET_NAME);

        await r2.send(new PutBucketCorsCommand({
            Bucket: process.env.R2_BUCKET_NAME,
            CORSConfiguration: {
                CORSRules: [
                    {
                        AllowedHeaders: ["*"],
                        AllowedMethods: ["PUT", "POST", "GET", "HEAD"],
                        AllowedOrigins: ["*"],
                        ExposeHeaders: ["ETag"],
                        MaxAgeSeconds: 3600
                    }
                ]
            }
        }));

        return NextResponse.json({ success: true, message: "CORS configuration updated successfully for production." });
    } catch (error: any) {
        console.error("CORS Update Failed:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
