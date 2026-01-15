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
                <a href="https://forms.fillout.com/t/vej46NKrCkus" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">Contact</a>
            </div>
            <p>End-to-end encrypted · Serverless · No Logs</p>
        </footer>
    );
}
