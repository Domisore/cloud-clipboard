"use client";

import React, { useState } from 'react';
import { Mail, MessageSquare, Twitter, Send, ArrowRight, Shield, Zap, Globe } from 'lucide-react';

export default function ContactPage() {
    const [formState, setFormState] = useState<'idle' | 'sending' | 'success'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormState('sending');
        
        // Log the submission (placeholder for where the message goes)
        // In a production environment, this would hit an API route / Discord webhook
        const formData = new FormData(e.currentTarget as HTMLFormElement);
        console.log('Contact Form Submission:', Object.fromEntries(formData.entries()));
        
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

                <div className="max-w-3xl mx-auto">
                    {/* Centered Contact Form */}
                    <div className="glass-panel p-10 rounded-3xl relative overflow-hidden group border border-accent/20">
                        <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                            <Mail className="w-32 h-32 text-accent" />
                        </div>
                        
                        <div className="mb-10 text-center">
                            <h2 className="text-3xl font-bold text-white mb-3 flex items-center justify-center gap-3">
                                <Send className="w-6 h-6 text-accent" />
                                Support Request
                            </h2>
                            <p className="text-foreground-muted leading-relaxed">
                                Reach out to our engineering team directly. We typically respond within 24 hours.
                            </p>
                        </div>

                        {formState === 'success' ? (
                            <div className="py-16 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
                                <div className="w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-8">
                                    <Shield className="w-10 h-10 text-accent" />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-3">Message Received</h3>
                                <p className="text-foreground-muted text-lg max-w-md mx-auto">Thank you for reaching out. Our team has received your inquiry and will be in touch shortly.</p>
                                <button 
                                    onClick={() => setFormState('idle')}
                                    className="mt-10 text-accent font-bold hover:underline py-2 px-4 rounded-lg bg-accent/5"
                                >
                                    Send another message
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-bold text-foreground-muted uppercase tracking-widest ml-1">Full Name</label>
                                        <input 
                                            required
                                            type="text" 
                                            placeholder="Your name" 
                                            className="w-full bg-black/40 border border-border-color rounded-xl px-5 py-4 text-sm focus:focus-ring transition-all placeholder:text-zinc-600 outline-none"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-bold text-foreground-muted uppercase tracking-widest ml-1">Work Email</label>
                                        <input 
                                            required
                                            type="email" 
                                            placeholder="you@company.com" 
                                            className="w-full bg-black/40 border border-border-color rounded-xl px-5 py-4 text-sm focus:focus-ring transition-all placeholder:text-zinc-600 outline-none"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-bold text-foreground-muted uppercase tracking-widest ml-1">Company or Project</label>
                                    <input 
                                        type="text" 
                                        placeholder="Project Name" 
                                        className="w-full bg-black/40 border border-border-color rounded-xl px-5 py-4 text-sm focus:focus-ring transition-all placeholder:text-zinc-600 outline-none"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-bold text-foreground-muted uppercase tracking-widest ml-1">How can we help?</label>
                                    <textarea 
                                        required
                                        rows={5}
                                        placeholder="Describe your inquiry..." 
                                        className="w-full bg-black/40 border border-border-color rounded-xl px-5 py-4 text-sm focus:focus-ring transition-all placeholder:text-zinc-600 outline-none resize-none"
                                    ></textarea>
                                </div>
                                <button 
                                    disabled={formState === 'sending'}
                                    className="w-full py-5 bg-accent text-zinc-950 font-bold rounded-xl hover:bg-white transition-all transform hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-3 disabled:opacity-50 text-base"
                                >
                                    {formState === 'sending' ? (
                                        <>
                                            <div className="w-5 h-5 border-3 border-zinc-950 border-t-transparent rounded-full animate-spin"></div>
                                            <span>SENDING...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>SEND MESSAGE</span>
                                            <ArrowRight className="w-5 h-5" />
                                        </>
                                    )}
                                </button>
                            </form>
                        )}
                    </div>

                    {/* Minimal Support Info */}
                    <div className="mt-12 text-center text-sm text-foreground-muted">
                        <p>Prefer direct email? Reach our support at <span className="text-white font-mono">support@drive.io</span></p>
                    </div>
                </div>
            </div>
        </main>
    );
}
