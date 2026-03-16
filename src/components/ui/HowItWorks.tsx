"use client";

import { DemoPlayer } from './DemoPlayer';

export function HowItWorks() {
    return (
        <section id="how-it-works" className="w-full max-w-5xl mx-auto py-16 animate-fade-in relative flex flex-col items-center">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-accent to-transparent"></div>

            <div className="text-center mb-12">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">See How it Works</h2>
                <p className="text-foreground-muted mt-2">Interactive Agentic Protocol Simulation</p>
            </div>

            <DemoPlayer />
        </section>
    );
}
