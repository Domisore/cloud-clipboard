"use client";

import { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';

export function InstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handler = (e: any) => {
            // Prevent the mini-infobar from appearing on mobile
            e.preventDefault();
            // Stash the event so it can be triggered later.
            setDeferredPrompt(e);
            // Update UI notify the user they can install the PWA
            setIsVisible(true);
        };

        window.addEventListener('beforeinstallprompt', handler);

        return () => {
            window.removeEventListener('beforeinstallprompt', handler);
        };
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;

        // Show the install prompt
        deferredPrompt.prompt();

        // Wait for the user to respond to the prompt
        const { outcome } = await deferredPrompt.userChoice;

        // We've used the prompt, and can't use it again, throw it away
        setDeferredPrompt(null);
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
            <div className="max-w-md mx-auto bg-surface border-2 border-accent shadow-2xl p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="bg-accent/10 p-2 rounded-lg">
                        <Download className="w-6 h-6 text-accent" />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-sm text-white">INSTALL APP</span>
                        <span className="text-xs text-gray-400">Add to home screen for faster access</span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setIsVisible(false)}
                        className="p-2 hover:bg-white/5 rounded-full transition-colors"
                        aria-label="Dismiss"
                    >
                        <X className="w-4 h-4 text-gray-500" />
                    </button>
                    <button
                        onClick={handleInstallClick}
                        className="bg-accent text-black text-xs font-bold px-4 py-2 hover:bg-accent/90 transition-colors uppercase"
                    >
                        INSTALL
                    </button>
                </div>
            </div>
        </div>
    );
}
