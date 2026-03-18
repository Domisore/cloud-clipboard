"use client";

import React, { useState } from 'react';
import { Mail, MessageSquare, Twitter, Send, ArrowRight, Shield, Zap, Globe } from 'lucide-react';

export default function ContactPage() {
    return (
        <main className="min-h-screen bg-background pt-32 pb-20 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-16 animate-fade-in">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-mono mb-6">
                        <Globe className="w-3 h-3" />
                        <span>SUPPORT CENTER</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-6">
                        Get in touch with <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-blue-400">Drive.io</span>
                    </h1>
                    <p className="text-foreground-muted text-lg max-w-2xl mx-auto leading-relaxed">
                        Have a question about the Agentic Protocol or integration? Our engineering team is here to help you optimize your agentic workflows.
                    </p>
                </div>

                {/* Hero Visualization */}
                <div className="relative w-full h-48 mb-16 overflow-hidden flex items-center justify-center">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(88,166,255,0.15)_0%,transparent_70%)]"></div>
                    <div className="relative">
                        {/* Abstract Hub Logic Graphic */}
                        <div className="w-32 h-32 rounded-full border border-accent/30 flex items-center justify-center animate-pulse">
                            <div className="w-24 h-24 rounded-full border border-accent/50 flex items-center justify-center">
                                <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center">
                                    <Zap className="w-8 h-8 text-accent" />
                                </div>
                            </div>
                        </div>
                        {/* Orbital lines */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border border-zinc-800 rounded-full border-dashed animate-[spin_20s_linear_infinite]"></div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 border border-zinc-900 rounded-full border-dashed animate-[spin_30s_linear_infinite_reverse]"></div>
                    </div>
                </div>

                <div className="max-w-4xl mx-auto">
                    {/* Centered Contact Form - RESTORED FILLOUT FORM */}
                    <div className="glass-panel p-1 rounded-3xl relative overflow-hidden group border border-accent/20 min-h-[600px] shadow-2xl">
                        <iframe 
                            src="https://forms.fillout.com/t/vej46NKrCkus" 
                            width="100%" 
                            height="600" 
                            frameBorder="0" 
                            marginHeight={0} 
                            marginWidth={0}
                            title="Contact Form"
                            className="rounded-2xl"
                        ></iframe>
                    </div>
                    </div>

                    {/* Minimal Support Info */}
                    <div className="mt-12 text-center text-sm text-foreground-muted">
                        <p>Prefer direct email? Reach our support at <span className="text-white font-mono">support@drive.io</span></p>
                    </div>
                </div>
            </main>
        );
    }
