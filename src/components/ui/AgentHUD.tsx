"use client";

import { Crosshair, Cpu, HardDrive } from 'lucide-react';
import { useEffect, useState } from 'react';

export function AgentHUD() {
    const [scanPosition, setScanPosition] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setScanPosition(prev => {
                const next = prev + 2;
                return next > 100 ? 0 : next;
            });
        }, 50);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative w-full max-w-sm aspect-[4/3] bg-[#1a0505] border-2 border-red-500/30 rounded-lg overflow-hidden font-mono text-red-500 shadow-[0_0_20px_rgba(239,68,68,0.15)]">
            {/* Scanline effect */}
            <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(255,0,0,0.05)_50%)] bg-[length:100%_4px] pointer-events-none z-20"></div>

            {/* Animated scanning bar */}
            <div
                className="absolute left-0 right-0 h-0.5 bg-red-400/60 shadow-[0_0_8px_rgba(239,68,68,0.8)] z-30 transition-all duration-75"
                style={{ top: `${scanPosition}%` }}
            ></div>

            {/* Corner brackets */}
            <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-red-500/70"></div>
            <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-red-500/70"></div>
            <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-red-500/70"></div>
            <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-red-500/70"></div>

            {/* Crosshair center */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20 z-10 pointer-events-none">
                <Crosshair size={140} strokeWidth={1} />
            </div>

            {/* Content overlay */}
            <div className="absolute inset-0 p-6 flex flex-col justify-between z-10">

                {/* Top stats */}
                <div className="flex justify-between text-[10px] tracking-widest opacity-90">
                    <div className="flex flex-col gap-1">
                        <span>SYS.MEM: 94.2% <span className="text-white animate-pulse">[WARN]</span></span>
                        <span>TOKEN.BUDGET: <span className="text-red-400">EXHAUSTED</span></span>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                        <span>DATASET: 342.1MB</span>
                        <span className="text-red-400 font-bold animate-pulse">ACTION REQ</span>
                    </div>
                </div>

                {/* Center targeting */}
                <div className="flex flex-col items-center justify-center gap-2 mt-4">
                    <div className="px-2 py-0.5 bg-red-950/80 border border-red-500/50 text-[10px] text-white tracking-[0.2em] mb-1">
                        SQL DUMP ACQUIRED
                    </div>

                    <div className="w-full bg-red-950/40 border border-red-500/30 p-3 rounded backdrop-blur-sm relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,1)]"></div>
                        <p className="text-[11px] leading-relaxed mb-2">
                            <span className="opacity-60">&gt; Executing tool: </span>
                            <span className="text-white font-bold">upload_artifact()</span>
                        </p>
                        <p className="text-[10px] opacity-70 mb-3 font-mono break-all leading-tight">
                            PAYLOAD: db_dump_v4.sql<br />
                            SIZE: 342,104,812 BYTES<br />
                            STATUS: <span className="text-green-400">UPLOAD COMPLETE</span>
                        </p>

                        <div className="flex items-center gap-2 bg-[#1a0505] p-2 border border-red-500/40 text-[10px]">
                            <HardDrive size={12} className="text-red-400" />
                            <span className="text-white truncate">https://drive.io/xL9k2M</span>
                        </div>
                    </div>
                </div>

                {/* Bottom stats */}
                <div className="flex justify-between items-end text-[10px] tracking-widest opacity-90">
                    <div className="flex items-center gap-2 text-red-400">
                        <Cpu size={12} className="animate-pulse" />
                        <span>PROCESSING...</span>
                    </div>
                    <div className="text-right">
                        <span>TOKENS SAVED:</span><br />
                        <span className="text-white font-bold text-xs shadow-red-500/50 drop-shadow-md">84,500</span>
                    </div>
                </div>

            </div>
        </div>
    );
}
