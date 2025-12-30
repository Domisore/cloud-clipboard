export interface UploadResult {
    id: string;
    url: string;
    filename: string;
    size: number;
    mimeType?: string; // Optional for backward compatibility
    uploadedAt: number;
    expiresAt: number;
    burnOnRead: boolean;
}

export async function mockUpload(file: File, burnOnRead: boolean = false): Promise<UploadResult> {
    return new Promise((resolve) => {
        setTimeout(() => {
            const id = Math.random().toString(36).substring(2, 8);
            const uploadedAt = Date.now();
            resolve({
                id,
                url: `https://drive.io/${id}`,
                filename: file.name,
                size: file.size,
                mimeType: file.type || 'application/octet-stream',
                uploadedAt,
                expiresAt: uploadedAt + 24 * 60 * 60 * 1000, // 24 hours
                burnOnRead,
            });
        }, 1500); // Simulate 1.5s upload
    });
}

// Export as uploadFile for easy switching between mock and real upload
export const uploadFile = mockUpload;
