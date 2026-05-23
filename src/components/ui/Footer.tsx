"use client";

import { usePathname } from 'next/navigation';
import Link from 'next/link';

export function Footer() {
    const pathname = usePathname();
    const isLandingPage = pathname === '/' || pathname === '/pclip';

    return (
        <footer className={`w-full py-12 text-center text-[10px] ${isLandingPage ? 'text-zinc-600 border-t border-zinc-900 bg-zinc-950/20' : 'text-foreground-muted/40'}`}>
            <div className="flex items-center justify-center gap-4 mb-3 flex-wrap max-w-4xl mx-auto px-4">
                <Link href="/privacy" className={`transition-colors ${isLandingPage ? 'text-zinc-500 hover:text-zinc-300' : 'hover:text-foreground'}`}>Privacy</Link>
                <span>•</span>
                <Link href="/terms" className={`transition-colors ${isLandingPage ? 'text-zinc-500 hover:text-zinc-300' : 'hover:text-foreground'}`}>Terms</Link>
                <span>•</span>
                <a href="https://discord.gg/PTtKGCmg" target="_blank" rel="noopener noreferrer" className={`transition-colors ${isLandingPage ? 'text-zinc-500 hover:text-zinc-300' : 'hover:text-foreground'}`}>Discord</a>
                <span>•</span>
                <Link href="/contact" className={`transition-colors ${isLandingPage ? 'text-zinc-500 hover:text-zinc-300' : 'hover:text-foreground'}`}>Contact</Link>
                <span>•</span>
                <a href="/llms.txt" className={`transition-colors ${isLandingPage ? 'text-zinc-500 hover:text-zinc-300' : 'hover:text-foreground'}`}>Documentation (llms.txt)</a>
                <span>•</span>
                <a href="/skill.md" className={`transition-colors ${isLandingPage ? 'text-zinc-500 hover:text-zinc-300' : 'hover:text-foreground'}`}>Agent Skills</a>
                <span>•</span>
                <a href="/api/mcp" className={`transition-colors ${isLandingPage ? 'text-zinc-500 hover:text-zinc-300' : 'hover:text-foreground'}`}>MCP Server</a>
                <span>•</span>
                <a href="https://chromewebstore.google.com/detail/pclip-cloud-clipboard/dcdppgjojehkngjhcdklkdbalegbmkin?hl=en&authuser=0" target="_blank" rel="noopener noreferrer" className={`transition-colors ${isLandingPage ? 'text-zinc-500 hover:text-zinc-300' : 'hover:text-foreground'}`}>Chrome Extension</a>
            </div>
            <p className={isLandingPage ? 'text-zinc-600' : ''}>End-to-end encrypted · Serverless · No Logs</p>
        </footer>
    );
}
