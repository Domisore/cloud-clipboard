/**
 * Migration utility to update old uploads in localStorage
 * This adds missing fields to uploads created before the schema update
 */

import { UploadResult } from './mockUpload';

export function migrateOldUploads(): void {
    try {
        const stored = localStorage.getItem('recent_uploads');
        if (!stored) return;

        const uploads: any[] = JSON.parse(stored);
        let needsMigration = false;

        const migratedUploads = uploads.map((upload) => {
            const migrated: UploadResult = {
                id: upload.id,
                url: upload.url,
                filename: upload.filename,
                size: upload.size,
                mimeType: upload.mimeType || 'application/octet-stream',
                uploadedAt: upload.uploadedAt || upload.expiresAt - 24 * 60 * 60 * 1000 || Date.now(),
                expiresAt: upload.expiresAt || Date.now() + 24 * 60 * 60 * 1000,
                burnOnRead: upload.burnOnRead || false,
            };

            // Check if migration was needed
            if (!upload.mimeType || !upload.uploadedAt || upload.burnOnRead === undefined) {
                needsMigration = true;
            }

            return migrated;
        });

        // Only update localStorage if migration was needed
        if (needsMigration) {
            localStorage.setItem('recent_uploads', JSON.stringify(migratedUploads));
            console.log(`Migrated ${uploads.length} upload(s) to new schema`);
        }
    } catch (error) {
        console.error('Failed to migrate old uploads:', error);
    }
}
