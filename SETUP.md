# Cloud Clipboard - Setup Guide

## Error: "Failed to fetch" during file upload

This error occurs because the application requires Cloudflare R2 and Upstash Redis credentials to be configured.

## Required Services

### 1. Cloudflare R2 (File Storage)
Cloudflare R2 is an S3-compatible object storage service used to store uploaded files.

**Setup Steps:**
1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to **R2** in the sidebar
3. Click **Create bucket** and give it a name (e.g., `cloud-clipboard`)
4. Go to **Manage R2 API Tokens**
5. Click **Create API Token**
6. Select **Read & Write** permissions
7. Copy the following values:
   - Account ID
   - Access Key ID
   - Secret Access Key

### 2. Upstash Redis (Metadata Storage)
Upstash Redis is used to store file metadata and manage expiration.

**Setup Steps:**
1. Go to [Upstash Console](https://console.upstash.com/)
2. Create a new Redis database (free tier available)
3. Select a region close to your users
4. Copy the **REST URL** and **REST Token** from the database details

## Configuration

1. Create a `.env.local` file in the project root:
   ```bash
   cp env.example .env.local
   ```

2. Edit `.env.local` and replace the placeholder values:
   ```env
   R2_ACCOUNT_ID=your_actual_account_id
   R2_ACCESS_KEY_ID=your_actual_access_key
   R2_SECRET_ACCESS_KEY=your_actual_secret_key
   R2_BUCKET_NAME=your_bucket_name
   
   UPSTASH_REDIS_REST_URL=https://your-redis-url.upstash.io
   UPSTASH_REDIS_REST_TOKEN=your_actual_token
   ```

3. Restart the development server:
   ```bash
   # Stop the current server (Ctrl+C in the terminal)
   npm run dev
   ```

## Verification

After setting up the environment variables:
1. The application should start without errors
2. You should be able to upload files successfully
3. Files will be stored in your R2 bucket
4. Metadata will be stored in Upstash Redis

## Current Status: Real Cloud Storage Enabled ☁️

**The application is configured to use real cloud storage (Cloudflare R2 + Upstash Redis).**

### What this means:
- Files are securely uploaded to your R2 bucket
- Metadata is stored in your Upstash Redis database
- Links are persistent and shareable
- "MOCK MODE" banners will no longer appear

### Troubleshooting
If you encounter errors:
1. Ensure your `.env.local` file is populated (run `npx vercel env pull`)
2. Check your R2 bucket CORS settings
3. Verify your Upstash Redis credentials

### To enable real cloud storage:

1. Set up Cloudflare R2 and Upstash Redis (see instructions above)
2. Create and configure your `.env.local` file
3. Edit `src/components/ui/DropZone.tsx` and change line 6:
   ```typescript
   // Change from:
   import { uploadFile } from '@/services/mockUpload';
   
   // To:
   import { uploadFile } from '@/services/upload';
   ```
4. Restart the development server
