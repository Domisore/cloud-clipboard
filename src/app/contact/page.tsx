"use client";

import React, { useState } from 'react';
import { Mail, MessageSquare, Twitter, Send, ArrowRight, Shield, Zap, Globe } from 'lucide-react';

export default function ContactPage() {
    const [formState, setFormState] = useState<'idle' | 'sending' | 'success'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormState('sending');
        // Simulate transmission
        await new Promise(resolve => setTimeout(resolve, 2000));
        setFormState('success');
    };

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

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                    {/* Direct Contact Form */}
                    <div className="glass-panel p-8 rounded-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Mail className="w-24 h-24 text-accent" />
                        </div>
                        
                        <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
                            <Send className="w-5 h-5 text-accent" />
                            Send Message
                        </h2>
                        <p className="text-foreground-muted text-sm mb-8 leading-relaxed">
                            Reach out to our team directly through the form below.
                        </p>

                        {formState === 'success' ? (
                            <div className="py-12 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Shield className="w-8 h-8 text-accent" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">Message Sent</h3>
                                <p className="text-foreground-muted">We've received your inquiry. Our team will respond shortly.</p>
                                <button 
                                    onClick={() => setFormState('idle')}
                                    className="mt-8 text-accent text-sm font-bold hover:underline"
                                >
                                    Send another message
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-foreground-muted uppercase tracking-widest ml-1">Full Name</label>
                                    <input 
                                        required
                                        type="text" 
                                        placeholder="Your name" 
                                        className="w-full bg-black/40 border border-border-color rounded-xl px-4 py-3 text-sm focus:focus-ring transition-all placeholder:text-zinc-600 outline-none"
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-foreground-muted uppercase tracking-widest ml-1">Email Address</label>
                                        <input 
                                            required
                                            type="email" 
                                            placeholder="Your work email" 
                                            className="w-full bg-black/40 border border-border-color rounded-xl px-4 py-3 text-sm focus:focus-ring transition-all placeholder:text-zinc-600 outline-none"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-foreground-muted uppercase tracking-widest ml-1">Company</label>
                                        <input 
                                            type="text" 
                                            placeholder="Company or Project" 
                                            className="w-full bg-black/40 border border-border-color rounded-xl px-4 py-3 text-sm focus:focus-ring transition-all placeholder:text-zinc-600 outline-none"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-foreground-muted uppercase tracking-widest ml-1">Message</label>
                                    <textarea 
                                        required
                                        rows={4}
                                        placeholder="How can we help you?" 
                                        className="w-full bg-black/40 border border-border-color rounded-xl px-4 py-3 text-sm focus:focus-ring transition-all placeholder:text-zinc-600 outline-none resize-none"
                                    ></textarea>
                                </div>
                                <button 
                                    disabled={formState === 'sending'}
                                    className="w-full py-4 bg-accent text-zinc-950 font-bold rounded-xl hover:bg-white transition-all transform hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {formState === 'sending' ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin"></div>
                                            <span>SENDING...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>SEND MESSAGE</span>
                                            <ArrowRight className="w-4 h-4" />
                                        </>
                                    )}
                                </button>
                            </form>
                        )}
                    </div>

                    {/* Secondary Contact Info */}
                    <div className="space-y-8">
                        {/* Community Hub */}
                        <div className="glass-panel p-8 rounded-2xl relative overflow-hidden group hover:border-accent/30 transition-all">
                            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                                <MessageSquare className="w-5 h-5 text-indigo-400" />
                                Community
                            </h3>
                            <p className="text-foreground-muted text-sm mb-6 leading-relaxed">
                                Join our community of AI developers. Share your Drive.io integrations, get help from the community, and collaborate on agentic tools.
                            </p>
                            <a 
                                href="https://discord.gg/PTtKGCmg" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-6 py-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-bold text-sm hover:bg-indigo-500/20 transition-all"
                            >
                                JOIN DISCORD
                                <ArrowRight className="w-4 h-4" />
                            </a>
                        </div>

                        {/* Project Updates */}
                        <div className="glass-panel p-8 rounded-2xl relative overflow-hidden group hover:border-accent/30 transition-all">
                            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                                <Twitter className="w-5 h-5 text-sky-400" />
                                Updates
                            </h3>
                            <div className="space-y-4 mb-6">
                                <div className="p-3 rounded-xl bg-black/40 border border-border-color text-xs">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-white font-bold">@DriveioHQ</span>
                                        <span className="text-foreground-muted font-mono">2h ago</span>
                                    </div>
                                    <p className="text-foreground-muted leading-relaxed">Agentic Protocol V1.2.4 released. Improved tiered data retrieval for LangGraph agents. 🚀</p>
                                </div>
                            </div>
                            <a 
                                href="https://twitter.com/DriveioHQ" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-6 py-2 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-400 font-bold text-sm hover:bg-sky-500/20 transition-all"
                            >
                                FOLLOW ON X
                                <ArrowRight className="w-4 h-4" />
                            </a>
                        </div>

                        {/* System Performance Info */}
                        <div className="p-6 rounded-2xl border border-zinc-800/50 bg-zinc-900/20">
                            <h4 className="text-[10px] font-bold text-foreground-muted uppercase tracking-widest mb-4">System Performance</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <div className="text-white font-mono font-bold">99.9%</div>
                                    <div className="text-[9px] text-foreground-muted uppercase">Avg Reduction</div>
                                </div>
                                <div>
                                    <div className="text-white font-mono font-bold">O(1)</div>
                                    <div className="text-[9px] text-foreground-muted uppercase">Token Handoff</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
