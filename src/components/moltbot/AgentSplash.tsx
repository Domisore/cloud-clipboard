import Link from 'next/link';
import { Bot, Zap, ArrowRight, Terminal } from 'lucide-react';
import { AgentHUD } from '@/components/ui/AgentHUD';

export function AgentSplash() {
    return (
        <div className="w-full max-w-5xl mx-auto my-20 relative group">
            {/* Decorative background glow */}
            <div className="absolute -inset-1 bg-accent/20 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>

            <div className="relative flex flex-col md:flex-row items-center justify-between p-8 md:p-12 bg-surface backdrop-blur-xl border border-accent/20 rounded-2xl overflow-hidden shadow-lg">

                {/* Abstract Tech Pattern Overlay */}
                <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(var(--accent)_1px,transparent_1px)] [background-size:16px_16px]"></div>

                <div className="flex-1 z-10 text-left">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-mono mb-6 animate-pulse">
                        <Terminal className="w-3 h-3" />
                        <span>NEW: AGENTIC PROTOCOL V1</span>
                    </div>

                    <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4 tracking-tight">
                        The <span className="text-purple-600">Hard Drive</span> for AI Agents.
                    </h2>
                    <p className="text-foreground-muted text-lg md:text-xl max-w-xl leading-relaxed mb-8">
                        Stop passing massive datasets directly in context. Equip your AI assistants across LangGraph, CrewAI, AutoGen, and beyond with a dedicated persistence layer. Save up to 99% on token costs.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex items-center gap-4 px-4 py-3 bg-surface border border-border-color rounded-lg text-foreground-muted text-sm font-mono">
                            <Bot className="w-4 h-4 text-purple-600" />
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
