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
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="w-full max-w-4xl mx-auto mb-8 px-4"
                >
                    <div className="relative overflow-hidden rounded-xl bg-surface border border-border-color shadow-sm p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 backdrop-blur-sm">

                        {/* Content */}
                        <div className="flex items-center gap-3 flex-1">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                                <span className="text-[10px] font-bold bg-muted/50 text-foreground-muted px-1.5 py-0.5 rounded uppercase tracking-wider w-fit">News</span>
                                <p className="text-sm text-foreground-muted">
                                    Meet <span className="text-white font-medium">Pclip</span> — the independent, human-centric cloud clipboard companion by the Drive.io team.
                                </p>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-3 w-full sm:w-auto pl-10 sm:pl-0 shrink-0">
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
                                className="text-xs font-semibold bg-surface border border-purple-500/30 text-purple-300 px-4 py-2 rounded-md hover:bg-purple-500/10 transition-colors whitespace-nowrap flex items-center gap-1.5"
                            >
                                <Download className="w-3.5 h-3.5" />
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
