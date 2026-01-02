"use client";

import Link from "next/link";
import { useState } from 'react';
import { SyncHub } from '@/components/sync/SyncHub';
import { useSession } from '@/context/SessionContext';
import { Zap, Check, Command } from 'lucide-react';
import { Tooltip } from '@/components/ui/Tooltip';

export function Header() {
    const [isSyncOpen, setIsSyncOpen] = useState(false);
    const { isConnected } = useSession();

    return (
        <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="w-8 h-8 rounded-lg bg-surface border border-border-color flex items-center justify-center group-hover:border-accent/50 transition-colors shadow-sm">
                        <Command className="w-4 h-4 text-foreground group-hover:text-accent transition-colors" />
                    </div>
                    <span className="font-sans font-semibold text-sm tracking-tight text-foreground group-hover:text-white transition-colors">
                        Drive.io
                    </span>
                </Link>

                {/* Right Actions */}
                <div className="flex items-center gap-4">
                    <Link
                        href="/how-it-works"
                        className="hidden sm:block text-xs font-medium text-foreground-muted hover:text-foreground transition-colors"
                    >
                        How it works
                    </Link>

                    <Tooltip content="Sync devices instanty">
                        <button
                            onClick={() => setIsSyncOpen(true)}
                            className={`
                                h-8 px-3 rounded-md text-xs font-medium flex items-center gap-2 transition-all border
                                ${isConnected
                                    ? 'bg-accent/10 border-accent/20 text-accent hover:bg-accent/20'
                                    : 'bg-surface border-border-color text-foreground hover:border-foreground-muted'
                                }
                            `}
                        >
                            {isConnected ? <Check className="w-3.5 h-3.5" /> : <Zap className="w-3.5 h-3.5" />}
                            <span>{isConnected ? 'Synced' : 'Connect'}</span>
                        </button>
                    </Tooltip>
                </div>
            </div>

            {isSyncOpen && <SyncHub onClose={() => setIsSyncOpen(false)} />}
        </header>
    );
}
