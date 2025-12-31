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
            <div className="w-full px-4 sm:px-8 py-8 sm:py-12 relative">
                {/* Sync Button (Absolute Top Right) */}
                <div className="absolute top-4 right-4 sm:top-8 sm:right-8">
                    <button
                        onClick={() => setIsSyncOpen(true)}
                        className={`
                            border font-bold text-xs sm:text-sm px-4 py-2 flex items-center gap-2 transition-all
                            ${isConnected
                                ? 'border-accent text-accent bg-accent/10 hover:bg-accent/20'
                                : 'border-border-color text-gray-400 hover:text-white hover:border-white'
                            }
                        `}
                    >
                        {isConnected ? <Check className="w-4 h-4" /> : <Zap className="w-4 h-4" />}
                        {isConnected ? 'DEVICES PAIRED' : 'SYNC DEVICES'}
                    </button>
                </div>

                <div className="max-w-7xl mx-auto">
                    {/* Logo */}
                    <Link href="/" className="inline-flex items-center gap-2 mb-8 sm:mb-12 group hover:opacity-80 transition-opacity">
                        <div className="w-8 h-8 border-2 border-accent flex items-center justify-center">
                            <span className="text-accent font-bold text-lg">D</span>
                        </div>
                        <span className="text-xl font-mono font-bold text-gray-300">drive.io</span>
                    </Link>

                    {/* Hero Section */}
                    <div className="max-w-3xl">
                        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-tight">
                            Your Cloud Clipboard.<br />
                            <span className="text-accent">Transfer Anything.</span>
                        </h1>
                        <p className="text-lg sm:text-xl text-gray-400 mb-4 leading-relaxed">
                            Copy on your phone. Paste on your laptop. Share files between any devices instantly through the cloud.
                        </p>
                        <p className="text-base sm:text-lg text-gray-500">
                            No accounts. No apps. Just paste, get a link, and access from anywhere.
                        </p>
                    </div>
                </div>
            </div>

            {isSyncOpen && <SyncHub onClose={() => setIsSyncOpen(false)} />}
        </header>
    );
}
