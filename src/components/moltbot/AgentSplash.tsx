import Link from 'next/link';
import { Bot, Zap, ArrowRight, Terminal } from 'lucide-react';
import { AgentHUD } from '@/components/ui/AgentHUD';

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
                        The <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Hard Drive</span> for AI Agents.
                    </h2>
                    <p className="text-zinc-400 text-lg md:text-xl max-w-xl leading-relaxed mb-8">
                        Stop passing massive datasets directly in context. Equip your AI assistants across LangGraph, CrewAI, AutoGen, and beyond with a dedicated persistence layer. Save up to 99% on token costs.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex items-center gap-4 px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-400 text-sm font-mono">
                            <Bot className="w-4 h-4 text-purple-400" />
                            <span>Moltbot Ready</span>
                        </div>
                    </div>
                </div>

                {/* Visual Graphic */}
                <div className="hidden md:flex flex-1 items-center justify-center relative z-10 w-full max-w-md mt-8 md:mt-0 transform scale-90 sm:scale-100 transition-transform">
                    <AgentHUD />
                </div>
            </div>
        </div>
    );
}
