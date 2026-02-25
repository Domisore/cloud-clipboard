"use client";

import { Smartphone, Laptop, ArrowRight, Bookmark, Download, Puzzle } from 'lucide-react';
import { InstallPWAButton } from './InstallPWAButton';

export function PclipUsageGuide() {
    return (
        <div className="w-full max-w-5xl mx-auto mt-12 mb-8 animate-fade-in border-t border-border-color/50 pt-16">

            {/* Visual Concept */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-16">
                <div className="flex flex-col items-center gap-4 bg-surface/50 border border-border-color p-8 rounded-2xl min-w-[220px] shadow-sm relative overflow-hidden group hover:border-accent/40 transition-colors">
                    <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <Smartphone className="w-12 h-12 text-foreground-muted group-hover:text-accent transition-colors relative z-10" />
                    <span className="font-semibold text-base relative z-10">Share or Paste From Mobile</span>
                </div>

                <div className="flex md:flex-col items-center gap-2 text-accent/60 my-4 md:my-0">
                    <ArrowRight className="w-8 h-8 hidden md:block" />
                    <ArrowRight className="w-8 h-8 md:hidden rotate-90" />
                    <span className="text-[10px] font-bold uppercase tracking-widest bg-accent/10 text-accent px-2.5 py-1 rounded-full shadow-sm">Automagic Sync</span>
                </div>

                <div className="flex flex-col items-center gap-4 bg-surface/50 border border-border-color p-8 rounded-2xl min-w-[220px] shadow-sm relative overflow-hidden group hover:border-purple-400/40 transition-colors">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <Laptop className="w-12 h-12 text-foreground-muted group-hover:text-purple-400 transition-colors relative z-10" />
                    <span className="font-semibold text-base relative z-10">Copy on Laptop</span>
                </div>
            </div>

            {/* Action Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* 1. PWA */}
                <div className="bg-gradient-to-br from-surface to-background border border-border-color p-6 rounded-xl flex flex-col items-start gap-4 hover:border-accent/30 transition-colors shadow-sm">
                    <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent ring-1 ring-accent/20">
                        <Download className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="font-bold text-foreground text-lg mb-1.5">Install App</h3>
                        <p className="text-sm text-foreground-muted leading-relaxed">
                            Install Pclip as a standalone app on your phone or laptop for instant, native-like access from your home screen.
                        </p>
                    </div>
                    <div className="mt-auto pt-4 w-full">
                        <InstallPWAButton className="flex justify-center w-full" />
                    </div>
                </div>

                {/* 2. Extension */}
                <div className="bg-gradient-to-br from-surface to-background border border-border-color p-6 rounded-xl flex flex-col items-start gap-4 hover:border-purple-500/30 transition-colors shadow-sm">
                    <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 ring-1 ring-purple-500/20">
                        <Puzzle className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="font-bold text-foreground text-lg mb-1.5">Chrome Extension</h3>
                        <p className="text-sm text-foreground-muted leading-relaxed">
                            Upload files, text, and links right from your browser toolbar without having to open a new tab.
                        </p>
                    </div>
                    <div className="mt-auto pt-4 w-full">
                        <a
                            href="/pclip-extension.zip"
                            download
                            className="flex items-center justify-center gap-2 w-full py-2.5 bg-surface hover:bg-white/5 border border-border-color rounded-lg text-sm font-bold text-foreground transition-colors shadow-sm"
                        >
                            Download Extension
                        </a>
                    </div>
                </div>

                {/* 3. Bookmark */}
                <div className="bg-gradient-to-br from-surface to-background border border-border-color p-6 rounded-xl flex flex-col items-start gap-4 hover:border-white/20 transition-colors shadow-sm">
                    <div className="w-12 h-12 rounded-xl bg-surface flex items-center justify-center text-foreground-muted ring-1 ring-border-color">
                        <Bookmark className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="font-bold text-foreground text-lg mb-1.5">Bookmark Us</h3>
                        <p className="text-sm text-foreground-muted leading-relaxed">
                            Hit <kbd className="bg-background px-1.5 py-0.5 rounded border border-border-color font-mono text-xs shadow-sm mx-1">Cmd/Ctrl + D</kbd> to bookmark this page. Always keep your clipboard exactly one click away.
                        </p>
                    </div>
                </div>
            </div>

        </div>
    );
}
