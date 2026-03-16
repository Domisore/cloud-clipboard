import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";
import Link from "next/link";
import { HowItWorks } from "@/components/ui/HowItWorks";
import { InstallationGuide } from "@/components/ui/InstallationGuide";
import { TokenBenchmark } from "@/components/ui/TokenBenchmark";
import { VisitorBadge } from "@/components/ui/VisitorBadge";

export default function PclipLandingPage() {
    return (
        <div className="min-h-screen flex flex-col font-sans selection:bg-accent/30 selection:text-foreground">
            <Header />

            <main className="flex-1 flex flex-col relative pt-20 sm:pt-24 pb-8 sm:pb-12 px-4 sm:px-6">
                <div className="text-center max-w-2xl mx-auto mb-12 animate-fade-in">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-bold uppercase tracking-widest mb-6">
                        Independent Product
                    </div>
                    <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-4 text-foreground leading-tight">
                        Instant Cross-Device <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-blue-400">Cloud Clipboard.</span>
                    </h1>
                    <p className="text-foreground-muted text-base sm:text-lg leading-relaxed max-w-3xl mx-auto mb-8">
                        Move text, code snippets, and files between your phone, laptop, and tablet instantly.
                        No account required to start. Secure, ephemeral, and private by design.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            href="/clipboard"
                            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-accent text-background font-bold text-lg hover:bg-accent/90 transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.1)] hover:translate-y-[2px] hover:translate-x-[2px] active:translate-y-[4px] active:translate-x-[4px] active:shadow-none"
                        >
                            Open Clipboard
                        </Link>
                        <a
                            href="https://chromewebstore.google.com/detail/pclip-cloud-clipboard/dcdppgjojehkngjhcdklkdbalegbmkin?hl=en&authuser=0"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-surface border border-border-color text-foreground font-bold text-lg hover:bg-white/5 transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.1)]"
                        >
                            Get Extension
                        </a>
                    </div>
                </div>

                {/* Simplified How It Works for Humans */}
                <div className="max-w-5xl mx-auto w-full py-12 border-t border-border-color/50">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 mb-6">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="20" x="5" y="2" rx="2" ry="2" /><path d="M12 18h.01" /></svg>
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-white">1. Copy on One Device</h3>
                            <p className="text-foreground-muted text-sm leading-relaxed">
                                Paste any text or drop a file into the web app or extension. It's instantly encrypted and stored.
                            </p>
                        </div>
                        <div className="flex flex-col items-center text-center">
                            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-400 mb-6">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-white">2. Sync Instantly</h3>
                            <p className="text-foreground-muted text-sm leading-relaxed">
                                Use a 6-digit sync code or sign in to Pclip to connect all your devices in seconds.
                            </p>
                        </div>
                        <div className="flex flex-col items-center text-center">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-6">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-white">3. Paste Anywhere</h3>
                            <p className="text-foreground-muted text-sm leading-relaxed">
                                Your recent activity is waiting for you on your other devices. Download or copy with one click.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Extension Focus Section */}
                <div className="max-w-4xl mx-auto w-full py-20">
                    <div className="bg-gradient-to-br from-purple-500/10 to-surface border border-purple-500/20 rounded-3xl p-8 sm:p-12 flex flex-col md:flex-row items-center gap-12">
                        <div className="flex-1">
                            <h2 className="text-3xl font-bold mb-6 text-white leading-tight">Better with the Extension</h2>
                            <p className="text-foreground-muted text-lg mb-8 leading-relaxed">
                                The Pclip extension for Chrome allows you to save text and files directly from your right-click menu or the toolbar popup.
                                It's the fastest way to bridge the gap between your desktop and mobile devices.
                            </p>
                            <ul className="space-y-4 mb-8">
                                <li className="flex items-center gap-3 text-foreground-muted">
                                    <div className="w-5 h-5 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400">✓</div>
                                    <span>One-click clipboard access</span>
                                </li>
                                <li className="flex items-center gap-3 text-foreground-muted">
                                    <div className="w-5 h-5 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400">✓</div>
                                    <span>Right-click to save selection</span>
                                </li>
                                <li className="flex items-center gap-3 text-foreground-muted">
                                    <div className="w-5 h-5 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400">✓</div>
                                    <span>Recent Activity at your fingertips</span>
                                </li>
                            </ul>
                            <a
                                href="https://chromewebstore.google.com/detail/pclip-cloud-clipboard/dcdppgjojehkngjhcdklkdbalegbmkin?hl=en&authuser=0"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white font-bold rounded-xl transition-all"
                            >
                                Install Pclip Extension
                            </a>
                        </div>
                        <div className="w-full md:w-72 aspect-[3/4] bg-surface border border-border-color rounded-2xl shadow-2xl relative overflow-hidden hidden sm:block">
                            {/* Mockup of extension popup if we had an image, for now just a placeholder visual */}
                            <div className="absolute inset-x-0 top-0 h-10 bg-zinc-800 flex items-center px-4 gap-2">
                                <img src="/pclip-192x192.png" className="w-4 h-4" alt="" />
                                <span className="text-[10px] font-bold uppercase tracking-wider">Pclip Extension</span>
                            </div>
                            <div className="p-4 pt-14 space-y-4">
                                <div className="h-24 bg-zinc-900 border border-zinc-800 rounded-lg"></div>
                                <div className="h-10 bg-white rounded-lg"></div>
                                <div className="space-y-2 pt-4">
                                    <div className="h-2 w-1/2 bg-zinc-800 rounded"></div>
                                    <div className="h-12 bg-zinc-900 border border-zinc-800 rounded-lg"></div>
                                    <div className="h-12 bg-zinc-900 border border-zinc-800 rounded-lg"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <VisitorBadge />
            </main>

            <Footer />
        </div>
    );
}
