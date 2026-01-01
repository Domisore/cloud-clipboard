"use client";

import { useRef, useState } from "react";

export function DemoPlayer() {
    return (
        <div className="w-full max-w-4xl mx-auto mt-8 mb-12">
            <div className="border border-border-color bg-surface/30 p-1 relative overflow-hidden group">
                {/* Header / Label */}
                <div className="absolute top-0 left-0 bg-accent text-black text-[10px] font-bold px-2 py-0.5 z-10">
                    DEMO.EXE
                </div>

                {/* The "Video" (Animated WebP) */}
                <img
                    src="/demo.webp"
                    alt="Drive.io Walkthrough"
                    className="w-full h-auto opacity-80 group-hover:opacity-100 transition-opacity"
                />

                {/* Scanline/Grid Overlay Effect */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-20 pointer-events-none bg-[length:100%_4px,3px_100%]"></div>
            </div>

            <p className="text-center text-xs text-gray-500 mt-2 font-mono">
                // WATCH: SYNC DEVICES • BURN-ON-READ • ZERO TRACES
            </p>
        </div>
    );
}
