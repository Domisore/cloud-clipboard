import { redis } from "./redis";

export type ActivityType = "CLIP_CREATED" | "HANDOFF_CREATED" | "HANDOFF_CONSUMED" | "FILE_UPLOADED";

export interface ActivityEntry {
    type: ActivityType;
    timestamp: number;
    id: string; // clipId or handoffId
    preview?: string;
    metadata?: Record<string, any>;
}

/**
 * Logs an activity for a specific API key.
 * Keeps only the last 100 activities.
 */
export async function logActivity(apiKey: string, entry: Omit<ActivityEntry, "timestamp">) {
    try {
        const fullEntry: ActivityEntry = {
            ...entry,
            timestamp: Date.now(),
        };

        const key = `apikey:${apiKey}:activity`;
        
        // Push to the front of the list
        await redis.lpush(key, JSON.stringify(fullEntry));
        
        // Trim to keep only the last 100 items
        await redis.ltrim(key, 0, 99);
        
    } catch (error) {
        console.error("Failed to log activity:", error);
    }
}
