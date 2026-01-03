import { S3Client, PutBucketCorsCommand } from "@aws-sdk/client-s3";
import fs from 'fs';
import path from 'path';

// Simple .env parser since dotenv might not be installed
function loadEnv() {
    try {
        const envPath = path.resolve(process.cwd(), '.env.local');
        if (fs.existsSync(envPath)) {
            const content = fs.readFileSync(envPath, 'utf-8');
            content.split('\n').forEach(line => {
                const [key, ...values] = line.split('=');
                if (key && values.length > 0) {
                    const val = values.join('=').trim();
                    if (!process.env[key.trim()] && !key.startsWith('#')) {
                        process.env[key.trim()] = val;
                    }
                }
            });
            console.log("Loaded .env.local");
        }
    } catch (e) {
        console.warn("Could not load .env.local", e);
    }
}

loadEnv();

const accountId = process.env.R2_ACCOUNT_ID;
const accessKeyId = process.env.R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
const bucketName = process.env.R2_BUCKET_NAME;

if (!accountId || !accessKeyId || !secretAccessKey || !bucketName) {
    console.error("Missing R2 environment variables. Please check .env.local");
    process.exit(1);
}

const r2 = new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId,
        secretAccessKey,
    },
});

async function setCors() {
    console.log(`Setting CORS for bucket: ${bucketName}...`);
    try {
        await r2.send(new PutBucketCorsCommand({
            Bucket: bucketName,
            CORSConfiguration: {
                CORSRules: [
                    {
                        AllowedHeaders: ["*"],
                        AllowedMethods: ["PUT", "POST", "GET", "HEAD"],
                        AllowedOrigins: ["*"], // For production, you might want to lock this down to your domain
                        ExposeHeaders: ["ETag"],
                        MaxAgeSeconds: 3600
                    }
                ]
            }
        }));
        console.log("✅ CORS configuration applied successfully!");
        console.log("Your uploads should now work from Vercel/Production.");
    } catch (err) {
        console.error("❌ Failed to set CORS:", err);
    }
}

setCors();
