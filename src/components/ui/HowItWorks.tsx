"use client";

import { UploadCloud, Smartphone, ArrowDownCircle } from 'lucide-react';

export function HowItWorks() {
    return (
        <section id="how-it-works" className="w-full max-w-5xl mx-auto py-8 animate-fade-in">
            <div className="grid grid-cols-3 gap-4 md:gap-8 relative">
                {/* Connecting Line (Desktop) */}
                <div className="hidden md:block absolute top-[24px] left-[16%] right-[16%] h-[2px] bg-gradient-to-r from-border-color via-accent/20 to-border-color -z-10" />

                {/* Step 1 */}
                <div className="flex flex-col items-center text-center group">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-surface border border-border-color flex items-center justify-center text-foreground mb-2 md:mb-4 relative z-10 group-hover:bg-accent/10 group-hover:border-accent/50 transition-colors shadow-sm">
                        <UploadCloud size={16} className="md:w-5 md:h-5" />
                        <div className="absolute -top-1.5 -right-1.5 md:-top-2 md:-right-2 w-5 h-5 md:w-6 md:h-6 rounded-full bg-background border border-border-color flex items-center justify-center text-[9px] md:text-[10px] font-bold text-foreground-muted shadow-sm">1</div>
                    </div>
                    <h3 className="text-[10px] md:text-sm font-bold text-foreground mb-1 md:mb-2 leading-tight">Upload <br className="md:hidden" />& Create</h3>
                    <p className="hidden md:block text-xs text-foreground-muted px-4 leading-relaxed">
                        Paste text or drag & drop files to instantly create a secure share link.
                    </p>
                </div>

                {/* Step 2 */}
                <div className="flex flex-col items-center text-center group">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-surface border border-border-color flex items-center justify-center text-foreground mb-2 md:mb-4 relative z-10 group-hover:bg-accent/10 group-hover:border-accent/50 transition-colors shadow-sm">
                        <Smartphone size={16} className="md:w-5 md:h-5" />
                        <div className="absolute -top-1.5 -right-1.5 md:-top-2 md:-right-2 w-5 h-5 md:w-6 md:h-6 rounded-full bg-background border border-border-color flex items-center justify-center text-[9px] md:text-[10px] font-bold text-foreground-muted shadow-sm">2</div>
                    </div>
                    <h3 className="text-[10px] md:text-sm font-bold text-foreground mb-1 md:mb-2 leading-tight">Connect <br className="md:hidden" />& Sync</h3>
                    <p className="hidden md:block text-xs text-foreground-muted px-4 leading-relaxed">
                        Pair your other device using the magic link, code, or QR scan.
                    </p>
                </div>

                {/* Step 3 */}
                <div className="flex flex-col items-center text-center group">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-surface border border-border-color flex items-center justify-center text-foreground mb-2 md:mb-4 relative z-10 group-hover:bg-accent/10 group-hover:border-accent/50 transition-colors shadow-sm">
                        <ArrowDownCircle size={16} className="md:w-5 md:h-5" />
                        <div className="absolute -top-1.5 -right-1.5 md:-top-2 md:-right-2 w-5 h-5 md:w-6 md:h-6 rounded-full bg-background border border-border-color flex items-center justify-center text-[9px] md:text-[10px] font-bold text-foreground-muted shadow-sm">3</div>
                    </div>
                    <h3 className="text-[10px] md:text-sm font-bold text-foreground mb-1 md:mb-2 leading-tight">Grab <br className="md:hidden" />& Download</h3>
                    <p className="hidden md:block text-xs text-foreground-muted px-4 leading-relaxed">
                        Access your clipboard history and download files instantly on the new device.
                    </p>
                </div>
            </div>
        </section>
    );
}
