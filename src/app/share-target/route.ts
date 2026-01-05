import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const title = formData.get('title') as string || '';
        const text = formData.get('text') as string || '';
        const url = formData.get('url') as string || '';
        const file = formData.get('file') as File | null;

        // Shared data payload
        let shareData: any = {
            title,
            text,
            url,
            timestamp: Date.now()
        };

        if (file && file.size > 0) {
            // Convert file to Base64 to pass to client via LocalStorage/IndexedDB proxy
            // Note: This has size limitations (approx 5MB for LocalStorage).
            // For larger files, a Service Worker or immediate server upload would be needed.
            // Given the constraints, we support small-medium files here.

            const arrayBuffer = await file.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            const base64 = buffer.toString('base64');

            shareData.file = {
                name: file.name,
                type: file.type,
                size: file.size,
                data: base64 // Client must convert back to Blob
            };
        }

        // HTML Trampoline
        // We render a temporary page that writes to localStorage and redirects.
        const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Receiving Share...</title>
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <style>
                    body { background: #000; color: #fff; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; font-family: monospace; }
                    .loader { border: 2px solid #333; border-top: 2px solid #fff; border-radius: 50%; width: 20px; height: 20px; animation: spin 1s linear infinite; margin-bottom: 20px; }
                    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                </style>
            </head>
            <body>
                <div class="loader"></div>
                <div>Processing Shared Content...</div>
                <script>
                    try {
                        const data = ${JSON.stringify(shareData)};
                        // Use a specific key for the app to pick up
                        localStorage.setItem('drive_pending_share', JSON.stringify(data));
                        // Redirect to home
                        window.location.replace('/');
                    } catch (e) {
                        document.body.innerHTML = '<div style="color:red">Error processing share: ' + e.message + '</div>';
                        console.error(e);
                    }
                </script>
            </body>
            </html>
        `;

        return new Response(html, {
            headers: { 'Content-Type': 'text/html' }
        });

    } catch (error) {
        console.error('Share Target Error:', error);
        return new Response('Error handling share', { status: 500 });
    }
}
