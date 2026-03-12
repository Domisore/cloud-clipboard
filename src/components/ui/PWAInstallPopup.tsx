"use client";

import { useState, useEffect } from 'react';
import { Download, X, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function PWAInstallPopup() {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [isInstalled, setIsInstalled] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        // Check if already installed
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
        setIsInstalled(isStandalone);

        const handler = (e: any) => {
            e.preventDefault();
            setDeferredPrompt(e);
            
            // Show popup after a short delay once prompt is available
            const timer = setTimeout(() => {
                setIsVisible(true);
            }, 3000);
            return () => clearTimeout(timer);
        };

        window.addEventListener('beforeinstallprompt', handler);
        window.addEventListener('appinstalled', () => {
            setIsInstalled(true);
            setDeferredPrompt(null);
            setIsVisible(false);
        });

        // If it's already installed, don't show
        if (isStandalone) {
            setIsVisible(false);
        }

        return () => {
            window.removeEventListener('beforeinstallprompt', handler);
        };
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
            setDeferredPrompt(null);
            setIsInstalled(true);
            setIsVisible(false);
        }
    };

    if (!isMounted || isInstalled || !isVisible) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.9 }}
                className="fixed bottom-6 right-6 z-[100] max-w-sm w-full"
            >
                <div className="bg-surface border border-accent/30 shadow-2xl rounded-2xl p-5 relative overflow-hidden group">
                    {/* Background Glow */}
                    <div className="absolute -top-12 -right-12 w-24 h-24 bg-accent/20 blur-3xl rounded-full group-hover:bg-accent/30 transition-colors"></div>
                    
                    <button 
                        onClick={() => setIsVisible(false)}
                        className="absolute top-3 right-3 p-1 text-foreground-muted hover:text-foreground hover:bg-white/5 rounded-full transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>

                    <div className="flex gap-4 items-start">
                        <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center flex-shrink-0">
                            <Download className="w-6 h-6 text-accent" />
                        </div>
                        <div className="flex-1 pr-6">
                            <div className="flex items-center gap-1.5 mb-1">
                                <Sparkles className="w-3.5 h-3.5 text-accent" />
                                <span className="text-[10px] font-bold text-accent uppercase tracking-widest">Premium App</span>
                            </div>
                            <h3 className="text-base font-bold text-white mb-1">Install Pclip App</h3>
                            <p className="text-sm text-foreground-muted leading-relaxed mb-4">
                                One-click access from your home screen and a faster, native experience.
                            </p>
                            <button
                                onClick={handleInstallClick}
                                className="w-full py-2.5 bg-accent text-background font-bold rounded-lg hover:scale-[1.02] transition-transform shadow-lg shadow-accent/20 text-sm"
                            >
                                Install App Now
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
