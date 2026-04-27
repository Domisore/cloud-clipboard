"use client";

import { DemoPlayer } from './DemoPlayer';
import { ContextWindowDemo } from './ContextWindowDemo';

export function HowItWorks() {
    return (
        <section id="how-it-works" className="w-full max-w-5xl mx-auto py-16 animate-fade-in relative flex flex-col items-center">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-accent to-transparent"></div>

            <div className="text-center mb-12">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">How it works</h2>
                <p className="text-foreground-muted mt-2 max-w-2xl mx-auto">See how Drive.io keeps your agents fast and your bills low.</p>
            </div>

            <div className="w-full mb-20">
                <div className="flex flex-col items-center mb-10">
                    <div className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold uppercase tracking-widest mb-4">Case Study A</div>
                    <h3 className="text-xl md:text-2xl font-bold text-white text-center">One Agent: No more context bleed</h3>
                    <p className="text-zinc-500 text-sm mt-2 text-center max-w-xl">Drive.io automatically offloads large logs and attachments so your agent never hits a context wall.</p>
                </div>
                <ContextWindowDemo />
            </div>

            <div className="w-full">
                <div className="flex flex-col items-center mb-10">
                    <div className="px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-[10px] font-bold uppercase tracking-widest mb-4">Case Study B</div>
                    <h3 className="text-xl md:text-2xl font-bold text-white text-center">Many Agents: Faster handoffs</h3>
                    <p className="text-zinc-500 text-sm mt-2 text-center max-w-xl">Pass massive datasets from one model to another instantly. No more copy-pasting raw text into prompts.</p>
                </div>
                <DemoPlayer />
            </div>
        </section>
    );
}
