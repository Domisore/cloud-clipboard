import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";
import Link from "next/link";
import { ArrowLeft, Smartphone, Monitor, Share2, ScanLine } from "lucide-react";

export default function HowItWorks() {
    return (
        <div className="min-h-screen flex flex-col font-sans selection:bg-accent/30 selection:text-foreground">
            <Header />

            <main className="flex-1 flex flex-col items-center justify-start p-4 sm:p-8 gap-8 relative z-10 w-full max-w-5xl mx-auto">
                <div className="w-full">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-sm text-foreground-muted hover:text-foreground mb-8 transition-colors group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        RETURN TO HOMEPAGE
                    </Link>

                    <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-foreground">How it Works</h2>
                    <p className="text-foreground-muted mb-12 max-w-2xl text-lg">
                        Drive.io is the fastest way to move data between screens. No login required.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* 1. Mobile to PC */}
                        <div className="bg-surface/30 border border-border-color rounded-2xl p-6 sm:p-8 hover:border-accent/30 transition-colors">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 bg-blue-500/10 rounded-lg text-blue-400">
                                    <Smartphone className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold text-foreground">Mobile to PC</h3>
                            </div>
                            <ol className="list-decimal list-inside space-y-4 text-sm sm:text-base text-foreground-muted">
                                <li>Open <span className="text-foreground font-bold">drive.io</span> on your computer browser.</li>
                                <li>Click <span className="text-accent font-bold">Connect</span> in the top right.</li>
                                <li>On your phone, scan the <span className="text-foreground font-bold">QR Code</span> displayed on your PC screen.</li>
                                <li>Once paired, any file or text you paste on your phone appears instantly on your PC.</li>
                            </ol>
                        </div>

                        {/* 2. PC to Mobile */}
                        <div className="bg-surface/30 border border-border-color rounded-2xl p-6 sm:p-8 hover:border-accent/30 transition-colors">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 bg-emerald-500/10 rounded-lg text-emerald-400">
                                    <ScanLine className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold text-foreground">PC to Mobile</h3>
                            </div>
                            <ol className="list-decimal list-inside space-y-4 text-sm sm:text-base text-foreground-muted">
                                <li>Click <span className="text-accent font-bold">Connect</span> on your PC to see the Sync Hub.</li>
                                <li>Open your phone's camera and scan the QR code.</li>
                                <li>Accept the connection on your mobile device.</li>
                                <li>Drag & drop files onto the PC DropZone—they will auto-download on your phone.</li>
                            </ol>
                        </div>

                        {/* 3. PC to PC */}
                        <div className="bg-surface/30 border border-border-color rounded-2xl p-6 sm:p-8 hover:border-accent/30 transition-colors">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 bg-purple-500/10 rounded-lg text-purple-400">
                                    <Monitor className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold text-foreground">PC to PC</h3>
                            </div>
                            <ol className="list-decimal list-inside space-y-4 text-sm sm:text-base text-foreground-muted">
                                <li>Click <span className="text-accent font-bold">Connect</span> on PC #1 to get a 6-digit code.</li>
                                <li>On PC #2, click <span className="text-accent font-bold">Connect</span> and switch to the "Join" tab.</li>
                                <li>Enter the 6-digit code from PC #1.</li>
                                <li>Both computers are now fused. Clipboard and files sync bidirectionally.</li>
                            </ol>
                        </div>

                        {/* 4. Share with Someone Else */}
                        <div className="bg-surface/30 border border-border-color rounded-2xl p-6 sm:p-8 hover:border-accent/30 transition-colors">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 bg-orange-500/10 rounded-lg text-orange-400">
                                    <Share2 className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold text-foreground">Share Link</h3>
                            </div>
                            <ol className="list-decimal list-inside space-y-4 text-sm sm:text-base text-foreground-muted">
                                <li>Upload your file(s) to the DropZone.</li>
                                <li>Look at the <span className="text-foreground font-bold">Recent Activity</span> list below.</li>
                                <li>Click <span className="text-accent font-bold">Copy Link</span> next to any file.</li>
                                <li>Send this link to anyone. They can download the file immediately without an account.</li>
                            </ol>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
