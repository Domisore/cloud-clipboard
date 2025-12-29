import { UploadResult } from './mockUpload'; // Re-using interface for now

export async function uploadFile(file: File): Promise<UploadResult> {
    // 1. Get Presigned URL
    const initRes = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            filename: file.name,
            contentType: file.type,
            size: file.size,
        }),
    });

    if (!initRes.ok) throw new Error('Failed to get upload URL');
    const { url, id, key } = await initRes.json();

    // 2. Upload to R2
    const uploadRes = await fetch(url, {
        method: 'PUT',
        body: file,
        headers: {
            'Content-Type': file.type,
        },
    });

    if (!uploadRes.ok) throw new Error('Failed to upload file to storage');

    // 3. Complete Upload (Save Metadata)
    const completeRes = await fetch('/api/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            id,
            key,
            filename: file.name,
            size: file.size,
            contentType: file.type,
        }),
    });

    if (!completeRes.ok) throw new Error('Failed to save metadata');

    return {
        id,
        url: `${window.location.origin}/${id}`, // Link to our view page
        filename: file.name,
        size: file.size,
        expiresAt: Date.now() + 24 * 60 * 60 * 1000,
    };
}
