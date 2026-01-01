"use client";

import { MONETIZATION } from '@/components/monetization/MonetizationWrapper';

export function Footer() {
    return (
        <footer className="fixed bottom-0 left-0 right-0 h-8 border-t border-border-color bg-background flex items-center justify-center gap-2 text-xs text-gray-500 z-50">
            <p>
                Copyright <a href="https://bigbrane.com" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors font-bold">Brane Technologies</a> 2026 // NO LOGS // NO MASTERS
            </p>
            <p>//</p>
            <a
                href="https://forms.fillout.com/t/vej46NKrCkus"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-accent transition-colors font-bold"
            >
                CONTACT
            </a>
        </footer>
    );
}
