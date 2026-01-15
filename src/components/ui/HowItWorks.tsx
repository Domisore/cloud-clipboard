"use client";

import { UploadCloud, Smartphone, ArrowDownCircle } from 'lucide-react';

export function HowItWorks() {
    return (
        <section className="w-full max-w-5xl mx-auto py-8 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                {/* Connecting Line (Desktop) */}
                <div className="hidden md:block absolute top-[24px] left-[16%] right-[16%] h-[2px] bg-gradient-to-r from-border-color via-accent/20 to-border-color -z-10" />

                {/* Step 1 */}
                <div className="flex flex-col items-center text-center group">
                    <div className="w-12 h-12 rounded-full bg-surface border border-border-color flex items-center justify-center text-foreground mb-4 relative z-10 group-hover:bg-accent/10 group-hover:border-accent/50 transition-colors shadow-sm">
                        <UploadCloud size={20} />
                        <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-background border border-border-color flex items-center justify-center text-[10px] font-bold text-foreground-muted shadow-sm">1</div>
                    </div>
                    <h3 className="text-sm font-bold text-foreground mb-2">Upload & Create</h3>
                    <p className="text-xs text-foreground-muted px-4 leading-relaxed">
                        Paste text or drag & drop files to instantly create a secure share link.
                    </p>
                </div>

                {/* Step 2 */}
                <div className="flex flex-col items-center text-center group">
                    <div className="w-12 h-12 rounded-full bg-surface border border-border-color flex items-center justify-center text-foreground mb-4 relative z-10 group-hover:bg-accent/10 group-hover:border-accent/50 transition-colors shadow-sm">
                        <Smartphone size={20} />
                        <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-background border border-border-color flex items-center justify-center text-[10px] font-bold text-foreground-muted shadow-sm">2</div>
                    </div>
                    <h3 className="text-sm font-bold text-foreground mb-2">Connect & Sync</h3>
                    <p className="text-xs text-foreground-muted px-4 leading-relaxed">
                        Pair your other device using the magic link, code, or QR scan.
                    </p>
                </div>

                {/* Step 3 */}
                <div className="flex flex-col items-center text-center group">
                    <div className="w-12 h-12 rounded-full bg-surface border border-border-color flex items-center justify-center text-foreground mb-4 relative z-10 group-hover:bg-accent/10 group-hover:border-accent/50 transition-colors shadow-sm">
                        <ArrowDownCircle size={20} />
                        <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-background border border-border-color flex items-center justify-center text-[10px] font-bold text-foreground-muted shadow-sm">3</div>
                    </div>
                    <h3 className="text-sm font-bold text-foreground mb-2">Grab & Download</h3>
                    <p className="text-xs text-foreground-muted px-4 leading-relaxed">
                        Access your clipboard history and download files instantly on the new device.
                    </p>
                </div>
            </div>
        </section>
    );
}
