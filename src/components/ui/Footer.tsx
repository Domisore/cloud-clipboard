"use client";

import Link from 'next/link';

export function Footer() {
    return (
        <footer className="w-full py-8 text-center text-[10px] text-foreground-muted/40">
            <div className="flex items-center justify-center gap-4 mb-2">
                <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
                <span>•</span>
                <Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link>
                <span>•</span>
                <a href="https://github.com/Domisore/cloud-clipboard" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">GitHub</a>
            </div>
            <p>End-to-end encrypted · Serverless · No Logs</p>
        </footer>
    );
}
