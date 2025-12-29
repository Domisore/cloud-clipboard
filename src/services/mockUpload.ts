export interface UploadResult {
    id: string;
    url: string;
    filename: string;
    size: number;
    expiresAt: number;
}

export async function mockUpload(file: File): Promise<UploadResult> {
    return new Promise((resolve) => {
        setTimeout(() => {
            const id = Math.random().toString(36).substring(2, 8);
            resolve({
                id,
                url: `https://drive.io/${id}`,
                filename: file.name,
                size: file.size,
                expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
            });
        }, 1500); // Simulate 1.5s upload
    });
}
