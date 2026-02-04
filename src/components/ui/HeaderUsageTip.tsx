"use client";

import { useState, useEffect } from 'react';
import { Download, X, Bookmark, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function HeaderUsageTip() {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [isInstalled, setIsInstalled] = useState(false);

    // Check if dismissed previously
    useEffect(() => {
        const dismissed = localStorage.getItem('usage-tip-dismissed');
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;

        setIsInstalled(isStandalone);

        if (!dismissed && !isStandalone) {
            // Delay slightly to not overwhelm on load
            const timer = setTimeout(() => setIsVisible(true), 1500);
            return () => clearTimeout(timer);
        }
    }, []);

    useEffect(() => {
        const handler = (e: any) => {
            e.preventDefault();
            setDeferredPrompt(e);
        };

        window.addEventListener('beforeinstallprompt', handler);
        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        setDeferredPrompt(null);
        if (outcome === 'accepted') {
            setIsVisible(false);
        }
    };

    const handleDismiss = () => {
        setIsVisible(false);
        localStorage.setItem('usage-tip-dismissed', 'true');
    };

    if (!isVisible || isInstalled) return null;

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    className="w-full max-w-3xl mx-auto mb-6 px-4"
                >
                    <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-accent/10 via-surface to-surface border border-accent/20 shadow-lg p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-6 backdrop-blur-sm">

                        {/* Content */}
                        <div className="flex items-start gap-3 flex-1">
                            <div className="bg-accent/20 p-2 rounded-lg shrink-0 mt-0.5 sm:mt-0">
                                {deferredPrompt ? (
                                    <Download className="w-5 h-5 text-accent" />
                                ) : (
                                    <Bookmark className="w-5 h-5 text-accent" />
                                )}
                            </div>
                            <div className="flex flex-col gap-0.5">
                                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                                    {deferredPrompt ? "Install Drive.io" : "Quick Access"}
                                    <span className="text-[10px] font-bold bg-accent/20 text-accent px-1.5 py-0.5 rounded uppercase tracking-wider">Tip</span>
                                </h3>
                                <p className="text-xs text-foreground-muted leading-relaxed">
                                    {deferredPrompt
                                        ? "Install as an app for faster sharing and native performance."
                                        : "Bookmark this page (Cmd/Ctrl + D) so it's ready when you need it."}
                                </p>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-3 w-full sm:w-auto pl-10 sm:pl-0">
                            {deferredPrompt && (
                                <button
                                    onClick={handleInstallClick}
                                    className="text-xs font-semibold bg-accent text-black px-3 py-1.5 rounded-md hover:bg-accent/90 transition-colors whitespace-nowrap flex items-center gap-1.5"
                                >
                                    <Download className="w-3.5 h-3.5" />
                                    Install App
                                </button>
                            )}
                            <button
                                onClick={handleDismiss}
                                className="text-xs font-medium text-foreground-muted hover:text-foreground transition-colors p-1.5 rounded-md hover:bg-white/5"
                                aria-label="Dismiss tip"
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
