"use client";

import { useState, useEffect } from 'react';
import { X, ExternalLink, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export function PclipPromoBanner() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const dismissed = localStorage.getItem('pclip-promo-dismissed');
        if (!dismissed) {
            const timer = setTimeout(() => setIsVisible(true), 1000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleDismiss = () => {
        setIsVisible(false);
        localStorage.setItem('pclip-promo-dismissed', 'true');
    };

    if (!isVisible) return null;

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    className="w-full max-w-4xl mx-auto mb-8 px-4"
                >
                    <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-purple-500/10 via-surface to-surface border border-purple-500/20 shadow-lg p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 backdrop-blur-sm">

                        {/* Content */}
                        <div className="flex items-start gap-4 flex-1">
                            <div className="shrink-0 mt-1">
                                <img src="/pclip-192x192.png" alt="Pclip" className="w-10 h-10 rounded-lg shadow-sm" />
                            </div>
                            <div className="flex flex-col gap-1">
                                <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
                                    Looking for the Clipboard? We've rebranded to Pclip!
                                    <span className="text-[10px] font-bold bg-purple-500/20 text-purple-400 px-1.5 py-0.5 rounded uppercase tracking-wider">New</span>
                                </h3>
                                <p className="text-sm text-foreground-muted leading-relaxed max-w-2xl">
                                    While drive.io focuses on Agent infrastructure, our human-centric clipboard lives on as Pclip.
                                    Instantly save text or files across devices using our Web App or the brand new Chrome Extension.
                                </p>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-3 w-full sm:w-auto pl-14 sm:pl-0 shrink-0">
                            <Link
                                href="/clipboard"
                                className="text-xs font-semibold bg-surface border border-border-color text-foreground px-4 py-2 rounded-md hover:bg-white/5 transition-colors whitespace-nowrap flex items-center gap-1.5"
                            >
                                Open Web App
                                <ExternalLink className="w-3.5 h-3.5" />
                            </Link>
                            <a
                                href="https://chromewebstore.google.com/detail/pclip-cloud-clipboard/dcdppgjojehkngjhcdklkdbalegbmkin?hl=en&authuser=0"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs font-semibold bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600 transition-colors whitespace-nowrap flex items-center gap-1.5 shadow-sm shadow-purple-500/20"
                            >
                                <ExternalLink className="w-3.5 h-3.5" />
                                Get Extension
                            </a>
                            <button
                                onClick={handleDismiss}
                                className="text-xs font-medium text-foreground-muted hover:text-foreground transition-colors p-1.5 rounded-md hover:bg-white/5 ml-1"
                                aria-label="Dismiss"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
