"use client";

import { useState, useEffect } from 'react';
import { Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function InstallPWAButton() {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [isInstalled, setIsInstalled] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        // Check if already installed
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
        setIsInstalled(isStandalone);

        const handler = (e: any) => {
            // Prevent the mini-infobar from appearing on mobile
            e.preventDefault();
            // Stash the event so it can be triggered later.
            setDeferredPrompt(e);
        };

        window.addEventListener('beforeinstallprompt', handler);

        // Also listen for successful installation to hide the button
        window.addEventListener('appinstalled', () => {
            setIsInstalled(true);
            setDeferredPrompt(null);
        });

        return () => {
            window.removeEventListener('beforeinstallprompt', handler);
            window.removeEventListener('appinstalled', () => { });
        };
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;

        // Show the install prompt
        deferredPrompt.prompt();

        // Wait for the user to respond to the prompt
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === 'accepted') {
            setDeferredPrompt(null);
            setIsInstalled(true);
        }
    };

    // Don't render anything if we're not mounted or already installed
    if (!isMounted || isInstalled) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex justify-center mt-6 mb-2"
            >
                {deferredPrompt ? (
                    <button
                        onClick={handleInstallClick}
                        className="flex items-center gap-2 px-5 py-2.5 bg-accent/10 border border-accent/20 text-accent rounded-full hover:bg-accent/20 transition-colors text-sm font-medium shadow-sm group"
                    >
                        <Download className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        Install App to Device
                    </button>
                ) : (
                    <button
                        onClick={() => alert("Look for the 'install' icon ⤓ in your browser's address bar (top right) or check the browser menu (⋮) to install Pclip as an app!")}
                        className="flex items-center gap-2 px-5 py-2.5 bg-surface border border-border-color text-foreground-muted hover:text-foreground rounded-full hover:bg-white/5 transition-colors text-sm font-medium shadow-sm"
                    >
                        <Download className="w-4 h-4" />
                        Install App to Device
                    </button>
                )}
            </motion.div>
        </AnimatePresence>
    );
}
