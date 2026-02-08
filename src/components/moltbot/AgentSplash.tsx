import Link from 'next/link';
import { Bot, Zap, ArrowRight, Terminal } from 'lucide-react';

export function AgentSplash() {
    return (
        <div className="w-full max-w-5xl mx-auto my-20 relative group">
            {/* Decorative background glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>

            <div className="relative relative flex flex-col md:flex-row items-center justify-between p-8 md:p-12 bg-black/80 backdrop-blur-xl border border-purple-500/30 rounded-2xl overflow-hidden">

                {/* Abstract Tech Pattern Overlay */}
                <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:16px_16px]"></div>

                <div className="flex-1 z-10 text-left">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-mono mb-6 animate-pulse">
                        <Terminal className="w-3 h-3" />
                        <span>NEW: AGENTIC PROTOCOL V1</span>
                    </div>

                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                        Now Speaking <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Agent.</span>
                    </h2>

                    <p className="text-zinc-400 text-lg md:text-xl max-w-xl leading-relaxed mb-8">
                        Your AI assistants in Moltbook (and beyond) can finally "save" files.
                        Connect them to your drive.io cloud clipboard in one step.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link
                            href="/agents"
                            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-black font-bold rounded-lg hover:bg-zinc-200 transition-all transform hover:scale-105"
                        >
                            See How It Works
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                        <div className="flex items-center gap-4 px-4 py-2 text-zinc-500 text-sm font-mono">
                            <Bot className="w-4 h-4" />
                            <span>Moltbot Ready</span>
                        </div>
                    </div>
                </div>

                {/* Visual Graphic */}
                <div className="hidden md:flex flex-1 items-center justify-center relative z-10 w-full max-w-sm mt-8 md:mt-0">
                    <div className="relative w-full aspect-video bg-zinc-900/90 rounded-xl border border-zinc-800 p-4 font-mono text-xs text-green-400 shadow-2xl flex flex-col gap-2">
                        <div className="flex items-center gap-2 border-b border-zinc-800 pb-2 mb-2">
                            <div className="w-2 h-2 rounded-full bg-red-500"></div>
                            <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            <span className="text-zinc-500 ml-2">moltbot --v1</span>
                        </div>
                        <div className="typing-effect opacity-80">
                            <span className="text-purple-400">❯</span> searching for memory...<br />
                            <span className="text-purple-400">❯</span> <span className="text-white">found file:</span> analysis.pdf<br />
                            <span className="text-purple-400">❯</span> uploading to drive.io...<br />
                            <span className="text-green-500">✔ success:</span> drive.io/c/k8j29s
                        </div>

                        {/* Floating "Card" representing the user receiving it */}
                        <div className="absolute -bottom-6 -right-6 bg-zinc-800 p-3 rounded-lg border border-zinc-700 shadow-xl flex items-center gap-3 animate-bounce-slow">
                            <div className="w-8 h-8 rounded bg-blue-500/20 flex items-center justify-center text-blue-400">
                                <Zap className="w-4 h-4" />
                            </div>
                            <div>
                                <div className="text-zinc-400 text-[10px]">Just now</div>
                                <div className="text-white font-bold">Received File</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
