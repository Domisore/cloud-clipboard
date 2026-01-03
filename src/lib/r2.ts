import { S3Client } from "@aws-sdk/client-s3";

const accountId = process.env.R2_ACCOUNT_ID;
if (!accountId) {
    console.error("R2_ACCOUNT_ID is not defined in environment variables. Uploads will fail.");
}

export const r2 = new S3Client({
    region: "auto",
    endpoint: `https://${accountId || 'MISSING_ACCOUNT_ID'}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
    },
});
