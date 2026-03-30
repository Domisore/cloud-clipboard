"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";
import { Clock, Copy, Check, FileText, Share2, ShieldAlert } from "lucide-react";
import Link from "next/link";

export default function ClipPage() {
    const params = useParams();
    const id = params.id as string;

    const [clipData, setClipData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const fetchClip = async () => {
            try {
                const res = await fetch(`/api/file/${id}`);
                if (res.ok) {
                    const data = await res.json();
                    setClipData(data);
                }
            } catch (e) {
                console.error("Failed to fetch clip", e);
            } finally {
                setLoading(false);
            }
        };
        fetchClip();
    }, [id]);

    const handleCopy = () => {
        if (!clipData) return;
        // In our unified API, clipData.url is a data: URL for text clips
        // We want the actual text which is in the data: URL or we'd need to fetch raw.
        // Actually, the api/file/[id] returns { content } for clips but I should check.
        // Wait, let's look at api/file/[id]/route.ts again.
        // It returns: { id, filename, size, mimeType, uploadedAt, expiresAt, url: 'data:...' }
        // It DOES NOT return 'content' in the JSON!
        
        // Let's check api/file/[id]/route.ts line 61-70.
        // It returns { url: `data:text/plain;charset=utf-8,${encodeURIComponent(metadata.content)}` }
        
        const text = decodeURIComponent(clipData.url.split(',')[1]);
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col font-mono bg-[#0D1117] text-[#C9D1D9]">
                <Header />
                <main className="flex-1 flex items-center justify-center">
                    <div className="text-accent animate-pulse font-bold tracking-tighter">RETRIEVING_CLIP...</div>
                </main>
                <Footer />
            </div>
        );
    }

    if (!clipData) {
        return (
            <div className="min-h-screen flex flex-col font-mono bg-[#0D1117] text-[#C9D1D9]">
                <Header />
                <main className="flex-1 flex flex-col items-center justify-center p-4">
                    <div className="w-full max-w-md border-2 border-red-500/50 bg-[#161B22] p-8 rounded-xl shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 right-0 h-1 bg-red-500"></div>
                        <ShieldAlert className="w-12 h-12 text-red-500 mb-4 mx-auto" />
                        <h1 className="text-2xl font-bold text-center mb-2">404 // NOT_FOUND</h1>
                        <p className="text-gray-400 text-center mb-8">
                            This clip doesn't exist, has expired, or has been burned after reading.
                        </p>
                        <Link href="/" className="block w-full py-3 bg-white text-black text-center font-bold rounded-lg hover:bg-accent transition-colors">
                            RETURN_HOME
                        </Link>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    const content = decodeURIComponent(clipData.url.split(',')[1]);

    return (
        <div className="min-h-screen flex flex-col font-sans bg-[#0D1117] text-[#C9D1D9]">
            <Header />

            <main className="flex-1 flex flex-col items-center pt-32 pb-12 px-4">
                <div className="w-full max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {/* Header Info */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-accent/10 rounded-lg border border-accent/20">
                                <FileText className="w-5 h-5 text-accent" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-white tracking-tight">{clipData.filename || "Untitled Clip"}</h1>
                                <p className="text-xs text-gray-500 font-mono uppercase tracking-widest">
                                    {id} // {new Date(clipData.uploadedAt).toLocaleDateString()}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <button 
                                onClick={handleCopy}
                                className="flex items-center gap-2 px-4 py-2 bg-[#161B22] border border-[#30363D] hover:border-accent/50 text-sm font-medium rounded-lg transition-all"
                            >
                                {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                                <span>{copied ? "COPIED" : "COPY_TEXT"}</span>
                            </button>
                            <button className="p-2 bg-[#161B22] border border-[#30363D] hover:border-accent/50 rounded-lg transition-all">
                                <Share2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-accent/20 to-blue-500/20 rounded-2xl blur opacity-30"></div>
                        <div className="relative bg-[#161B22] border border-[#30363D] rounded-xl overflow-hidden min-h-[400px] flex flex-col">
                            <div className="flex items-center justify-between px-4 py-2 bg-[#0D1117]/50 border-b border-[#30363D]">
                                <div className="flex gap-1.5">
                                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/40"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20 border border-yellow-500/40"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/20 border border-green-500/40"></div>
                                </div>
                                <div className="text-[10px] text-gray-500 font-mono">
                                    {content.length} CHARS
                                </div>
                            </div>
                            <pre className="flex-1 p-6 font-mono text-sm leading-relaxed overflow-x-auto selection:bg-accent/30 selection:text-white whitespace-pre-wrap">
                                {content}
                            </pre>
                        </div>
                    </div>

                    {/* Meta Footer */}
                    <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-6 px-2">
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                <Clock className="w-3.5 h-3.5" />
                                <span>RETRIEVED {new Date().toLocaleTimeString()}</span>
                            </div>
                            <div className="flex items-center gap-2 text-[10px] bg-accent/5 text-accent px-2 py-1 rounded border border-accent/10 font-bold uppercase tracking-widest">
                                Secure // Encrypted
                            </div>
                        </div>

                        <div className="text-[10px] text-gray-600 font-mono tracking-widest uppercase">
                            POWERED BY DRIVE.IO
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
