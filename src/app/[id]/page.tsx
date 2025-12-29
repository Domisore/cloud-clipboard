import { redis } from "@/lib/redis";
import { r2 } from "@/lib/r2";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { notFound } from "next/navigation";
import { Download } from "lucide-react";
import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function FilePage({ params }: PageProps) {
    const { id } = await params;

    // 1. Get Metadata
    const metadata = await redis.get<any>(`file:${id}`);

    if (!metadata) {
        notFound();
    }

    // 2. Generate Download URL
    const command = new GetObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key: metadata.key,
    });

    const downloadUrl = await getSignedUrl(r2, command, { expiresIn: 3600 }); // 1 hour link

    // Calculate time left (approx)
    const timeLeft = Math.max(0, Math.round((metadata.uploadedAt + 86400000 - Date.now()) / 1000 / 60)); // minutes

    return (
        <div className="min-h-screen flex flex-col font-mono selection:bg-accent selection:text-black">
            <Header />

            <main className="flex-1 flex flex-col items-center justify-center p-4">
                <div className="w-full max-w-md border-2 border-border-color bg-surface p-6 relative overflow-hidden">
                    {/* Top Green Bar */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-accent"></div>

                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <h1 className="text-xl font-bold break-all">{metadata.filename}</h1>
                            <p className="text-xs text-gray-500 mt-1">{(metadata.size / 1024 / 1024).toFixed(2)} MB // {metadata.contentType}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-danger font-bold animate-pulse">{timeLeft} MIN LEFT</p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4">
                        <a
                            href={downloadUrl}
                            className="w-full h-12 bg-foreground text-background font-bold flex items-center justify-center gap-2 hover:bg-accent hover:text-black transition-colors shadow-hacker"
                        >
                            <Download className="w-4 h-4" />
                            DOWNLOAD_NOW
                        </a>

                        <div className="text-center mt-4">
                            <a href="/" className="text-xs text-gray-500 hover:text-accent border-b border-transparent hover:border-accent transition-colors">
                                [ I_WANT_TO_TOSS_A_FILE_TOO ]
                            </a>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
