"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Download } from "lucide-react";
import Link from "next/link";
import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";
import { UploadResult } from "@/services/mockUpload";
import { CarbonAd } from "@/components/ui/CarbonAd";
import { MONETIZATION } from "@/components/monetization/MonetizationWrapper";
import { ShieldAlert } from "lucide-react";

export default function FilePage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const [fileData, setFileData] = useState<UploadResult | null>(null);
    const [loading, setLoading] = useState(true);
    const [timeLeft, setTimeLeft] = useState(0);

    useEffect(() => {
        const fetchFile = async () => {
            try {
                // 1. Try fetching from API (Real Backend)
                const res = await fetch(`/api/file/${id}`);
                if (res.ok) {
                    const data = await res.json();
                    setFileData(data);
                    // Initial time calc
                    const minutesLeft = Math.max(0, Math.round((data.expiresAt - Date.now()) / 1000 / 60));
                    setTimeLeft(minutesLeft);
                    return;
                }
            } catch (e) {
                console.error("Failed to fetch file from API", e);
            }

            // 2. Fallback: Try localStorage (Mock Mode / Legacy)
            const stored = localStorage.getItem('recent_uploads');
            if (stored) {
                const uploads: UploadResult[] = JSON.parse(stored);
                const file = uploads.find(u => u.id === id);

                if (file) {
                    setFileData(file);
                    // Initial time calc
                    const minutesLeft = Math.max(0, Math.round((file.expiresAt - Date.now()) / 1000 / 60));
                    setTimeLeft(minutesLeft);
                }
            }
        };

        fetchFile().finally(() => setLoading(false));
    }, [id]);

    useEffect(() => {
        // Update time left every minute
        if (!fileData) return;

        const interval = setInterval(() => {
            const minutesLeft = Math.max(0, Math.round((fileData.expiresAt - Date.now()) / 1000 / 60));
            setTimeLeft(minutesLeft);

            if (minutesLeft === 0) {
                clearInterval(interval);
            }
        }, 60000); // Update every minute

        return () => clearInterval(interval);
    }, [fileData]);

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col font-mono selection:bg-accent selection:text-black">
                <Header />
                <main className="flex-1 flex items-center justify-center">
                    <div className="text-accent font-bold text-xl animate-pulse">
                        LOADING...
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    if (!fileData) {
        return (
            <div className="min-h-screen flex flex-col font-mono selection:bg-accent selection:text-black">
                <Header />
                <main className="flex-1 flex flex-col items-center justify-center p-4">
                    <div className="w-full max-w-md border-2 border-danger bg-surface p-6">
                        <h1 className="text-2xl font-bold text-danger mb-4">404 // NOT_FOUND</h1>
                        <p className="text-gray-400 mb-6">
                            This file doesn't exist or has already been burned.
                        </p>
                        <Link
                            href="/"
                            className="inline-block bg-foreground text-background px-4 py-2 font-bold hover:bg-accent hover:text-black transition-colors"
                        >
                            [ GO_HOME ]
                        </Link>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    const fileSizeMB = (fileData.size / 1024 / 1024).toFixed(2);

    return (
        <div className="min-h-screen flex flex-col font-mono selection:bg-accent selection:text-black">
            <Header />

            <main className="flex-1 flex flex-col items-center justify-center p-4">
                <div className="w-full max-w-md border-2 border-border-color bg-surface p-6 relative overflow-hidden">
                    {/* Top Green Bar */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-accent"></div>

                    <div className="flex justify-between items-start mb-8">
                        <div className="flex-1 pr-4">
                            <h1 className="text-xl font-bold break-all">{fileData.filename}</h1>
                            <p className="text-xs text-gray-500 mt-1">{fileSizeMB} MB // {fileData.mimeType || 'unknown'}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                            <p className="text-xs text-danger font-bold animate-pulse whitespace-nowrap">
                                {timeLeft} MIN LEFT
                            </p>
                        </div>
                    </div>

                    <div className="bg-background border border-border-color p-4 mb-6">
                        <p className="text-xs text-gray-400 mb-2 font-bold">FILE_INFO:</p>
                        <div className="space-y-1 text-xs font-mono">
                            <p><span className="text-accent">ID:</span> {fileData.id}</p>
                            <p><span className="text-accent">SIZE:</span> {fileData.size} bytes</p>
                            <p><span className="text-accent">EXPIRES:</span> {new Date(fileData.expiresAt).toLocaleString()}</p>
                        </div>
                    </div>

                    {/* Large Preview Area */}
                    <div className="mb-6 bg-background border border-border-color p-2 min-h-[100px] flex items-center justify-center">
                        {fileData.mimeType?.startsWith('image/') ? (
                            <img
                                src={fileData.url}
                                alt={fileData.filename}
                                className="max-w-full max-h-[400px] object-contain"
                            />
                        ) : fileData.mimeType?.startsWith('video/') ? (
                            <video
                                src={fileData.url}
                                controls
                                className="max-w-full max-h-[400px]"
                            />
                        ) : (
                            <div className="text-center p-8">
                                <span className="text-4xl mb-2 block">📄</span>
                                <p className="text-sm text-gray-500">No preview available</p>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col gap-4">
                        {/* Only show Mock Mode banner if it's actually a mock upload (detected by URL or explicit flag) */}
                        {fileData.url.includes('drive.io') && (
                            <div className="bg-background border border-accent p-4 text-center">
                                <p className="text-xs text-accent mb-2">⚠️ MOCK MODE</p>
                                <p className="text-xs text-gray-400">
                                    This is a demo. In production, you would download the actual file here.
                                </p>
                            </div>
                        )}


                        <button
                            onClick={() => {
                                if (fileData.url.includes('drive.io')) {
                                    alert(`In production, this would download:\n${fileData.filename}\n\nFor now, this is just a mock preview.`);
                                } else {
                                    // Browser native behavior - open in new tab
                                    window.open(fileData.url, '_blank');
                                }
                            }}
                            className="w-full h-12 bg-foreground text-background font-bold flex items-center justify-center gap-2 hover:bg-accent hover:text-black transition-colors shadow-hacker"
                        >
                            <Download className="w-4 h-4" />
                            OPEN / DOWNLOAD
                        </button>

                        {/* Affiliate: VPN Safe-Share */}
                        {MONETIZATION.AFFILIATES.ENABLED && (
                            <div className="bg-surface border border-accent/30 p-4 text-center mt-2">
                                <div className="flex items-center justify-center gap-2 mb-2">
                                    <ShieldAlert className="w-4 h-4 text-accent" />
                                    <p className="text-xs font-bold text-gray-300">UNSECURED CONNECTION DETECTED</p>
                                </div>
                                <p className="text-xs text-gray-400 mb-3">
                                    Your IP address is visible. Protect your downloads with a no-logs VPN.
                                </p>
                                <a
                                    href={MONETIZATION.AFFILIATES.VPN_URL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-block bg-accent/10 text-accent border border-accent px-4 py-2 text-xs font-bold hover:bg-accent hover:text-black transition-all"
                                >
                                    [ ENABLE_CLOAKING_MODE ]
                                </a>
                            </div>
                        )}

                        {/* Ad Placement */}
                        {MONETIZATION.CARBON.ENABLED && (
                            <div className="mt-4">
                                <CarbonAd />
                            </div>
                        )}

                        <div className="text-center mt-4">
                            <Link href="/" className="text-xs text-gray-500 hover:text-accent border-b border-transparent hover:border-accent transition-colors">
                                [ I_WANT_TO_TOSS_A_FILE_TOO ]
                            </Link>
                        </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-border-color">
                        <p className="text-xs text-gray-600 text-center">
                            TOSSED VIA DRIVE.IO // NO LOGS // NO MASTERS
                        </p>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
