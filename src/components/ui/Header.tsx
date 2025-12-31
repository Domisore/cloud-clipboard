"use client";

import Link from "next/link";
import { useState } from 'react';
import { SyncHub } from '@/components/sync/SyncHub';
import { useSession } from '@/context/SessionContext';
import { Zap, Check } from 'lucide-react';

export function Header() {
    const [isSyncOpen, setIsSyncOpen] = useState(false);
    const { isConnected } = useSession();

    return (
        <header className="w-full flex flex-col">
            {/* Top Bar */}
            <div className="w-full bg-surface text-gray-400 text-[10px] sm:text-xs py-1 text-center border-b border-border-color">
                DRIVE.IO DOMAIN FOR SALE. SERIOUS INQUIRIES: d0332486@gmail.com
            </div>

            {/* Header with Logo and Hero */}
            <div className="w-full px-4 sm:px-8 py-4 sm:py-6 relative">
                {/* Sync Button (Absolute Top Right) */}
                <div className="absolute top-3 right-4 sm:top-4 sm:right-8">
                    <button
                        onClick={() => setIsSyncOpen(true)}
                        className={`
                            border font-bold text-[10px] sm:text-xs px-3 py-1.5 flex items-center gap-2 transition-all
                            ${isConnected
                                ? 'border-accent text-accent bg-accent/10 hover:bg-accent/20'
                                : 'border-border-color text-gray-400 hover:text-white hover:border-white'
                            }
                        `}
                    >
                        {isConnected ? <Check className="w-3 h-3" /> : <Zap className="w-3 h-3" />}
                        SYNC DEVICES
                    </button>
                </div>

                <div className="max-w-7xl mx-auto">
                    {/* Logo */}
                    <Link href="/" className="inline-flex items-center gap-2 mb-4 group hover:opacity-80 transition-opacity">
                        <div className="w-5 h-5 border-[1.5px] border-accent flex items-center justify-center">
                            <span className="text-accent font-bold text-xs">D</span>
                        </div>
                        <span className="text-base font-mono font-bold text-gray-300">drive.io</span>
                    </Link>

                    {/* Hero Section */}
                    <div className="max-w-3xl">
                        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-2 leading-tight">
                            Your Cloud Clipboard. <span className="text-accent">Transfer Anything.</span>
                        </h1>
                        <p className="text-sm sm:text-base text-gray-400 mb-1 leading-relaxed">
                            Copy on your phone. Paste on your laptop. Share files between any devices instantly through the cloud.
                        </p>
                        <p className="text-xs text-gray-500">
                            No accounts. No apps. Just paste, get a link, and access from anywhere.
                        </p>
                    </div>
                </div>
            </div>

            {isSyncOpen && <SyncHub onClose={() => setIsSyncOpen(false)} />}
        </header>
    );
}
