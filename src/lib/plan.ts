import { clerkClient } from "@clerk/nextjs/server";

export const FREE_FILE_SIZE_LIMIT = 5 * 1024 * 1024; // 5MB
export const PRO_FILE_SIZE_LIMIT = 100 * 1024 * 1024; // 100MB

export const FREE_MAX_CLIPS = 10;
export const FREE_CLIP_EXPIRY = 24 * 60 * 60; // 24 Hours in seconds
export const PRO_CLIP_EXPIRY = 30 * 24 * 60 * 60; // 30 Days in seconds

export type Plan = 'free' | 'pro';

export async function getUserPlan(userId: string): Promise<Plan> {
    try {
        const client = await clerkClient();
        const user = await client.users.getUser(userId);
        const plan = (user.publicMetadata?.plan as Plan) || 'free';
        return plan;
    } catch (error) {
        console.error("[PLAN_ERROR] Failed to fetch user plan:", error);
        return 'free'; // Default to free on error
    }
}

export function getFileSizeLimit(plan: Plan): number {
    return plan === 'pro' ? PRO_FILE_SIZE_LIMIT : FREE_FILE_SIZE_LIMIT;
}

export function getClipExpiry(plan: Plan): number {
    return plan === 'pro' ? PRO_CLIP_EXPIRY : FREE_CLIP_EXPIRY;
}

export function getMaxClips(plan: Plan): number | null {
    return plan === 'pro' ? null : FREE_MAX_CLIPS;
}

export function formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
