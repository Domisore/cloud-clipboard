import { clerkClient } from "@clerk/nextjs/server";

export const FREE_FILE_SIZE_LIMIT = 5 * 1024 * 1024; // 5MB
export const PRO_FILE_SIZE_LIMIT = 100 * 1024 * 1024; // 100MB

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

export function formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
