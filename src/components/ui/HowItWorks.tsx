"use client";

import Image from 'next/image';

export function HowItWorks() {
    return (
        <section id="how-it-works" className="w-full max-w-5xl mx-auto py-16 animate-fade-in relative flex flex-col items-center">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-accent to-transparent"></div>

            <div className="text-center mb-12">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">How it Works</h2>
            </div>

            <div className="w-full max-w-4xl relative rounded-2xl overflow-hidden border border-border-color/50 shadow-2xl bg-surface/20">
                <img 
                    src="/agent_data_flow_labeled.png" 
                    alt="Drive.io Agent Native Artifact Relay Schematic" 
                    className="w-full h-auto object-contain hover:scale-[1.01] transition-transform duration-500 ease-in-out"
                />
            </div>
        </section>
    );
}
