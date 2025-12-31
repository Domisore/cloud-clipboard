"use client";

import { useEffect, useState, useCallback } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useSession } from '@/context/SessionContext';
import { Copy, RefreshCw, Smartphone, Monitor, Check } from 'lucide-react';
import { JoinSession } from './JoinSession';

export function SyncHub({ onClose }: { onClose: () => void }) {
    const { generateSyncCode, isConnected, disconnect } = useSession();
    const [otp, setOtp] = useState<string>('...');
    const [expiresAt, setExpiresAt] = useState<number>(0);
    const [magicLink, setMagicLink] = useState<string>('');
    const [timeLeft, setTimeLeft] = useState<number>(120);
    const [copied, setCopied] = useState(false);

    const refreshCode = useCallback(async () => {
        try {
            const data = await generateSyncCode();
            setOtp(data.otp);
            setExpiresAt(data.expiresAt);
            setMagicLink(data.magicLink);
            setTimeLeft(120);
        } catch (e) {
            console.error(e);
        }
    }, [generateSyncCode]);

    // Initial generation
    useEffect(() => {
        refreshCode();
    }, [refreshCode]);

    // Timer
    useEffect(() => {
        const interval = setInterval(() => {
            const seconds = Math.max(0, Math.floor((expiresAt - Date.now()) / 1000));
            setTimeLeft(seconds);
            if (seconds <= 0) {
                refreshCode();
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [expiresAt, refreshCode]);

    const handleCopyLink = () => {
        navigator.clipboard.writeText(magicLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };



    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-surface border-2 border-border-color p-0 max-w-3xl w-full relative flex flex-col md:flex-row shadow-2xl">
                <button onClick={onClose} className="absolute top-4 right-4 md:right-4 md:top-4 z-10 text-gray-500 hover:text-white text-xl p-2">✕</button>

                {/* Left: Desktop OTP */}
                <div className="flex-1 p-8 border-b md:border-b-0 md:border-r border-border-color flex flex-col justify-center items-center text-center bg-background/50 relative">
                    {isConnected && (
                        <div className="absolute top-4 left-4 flex flex-col gap-2">
                            <span className="bg-accent/20 text-accent text-[10px] font-bold px-2 py-1 border border-accent rounded-full animate-pulse flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
                                SESSION ACTIVE
                            </span>
                            <button onClick={disconnect} className="text-[10px] text-danger border border-danger/50 px-2 py-1 hover:bg-danger hover:text-white transition-colors">
                                DISCONNECT
                            </button>
                        </div>
                    )}
                    <Monitor className="w-8 h-8 text-gray-500 mb-4" />
                    <h3 className="text-sm font-bold text-gray-400 mb-6">PAIR WITH DESKTOP</h3>

                    <div className="font-mono text-6xl md:text-7xl font-bold text-white tracking-widest mb-2 font-numeric select-all">
                        {otp.slice(0, 3)} {otp.slice(3)}
                    </div>
                    <div className="text-xs text-accent animate-pulse mt-4">
                        EXPIRES IN {timeLeft}s
                    </div>
                </div>

                {/* Right: Mobile QR & Link */}
                <div className="flex-1 p-8 flex flex-col justify-center items-center bg-surface">
                    <Smartphone className="w-8 h-8 text-gray-500 mb-4" />
                    <h3 className="text-sm font-bold text-gray-400 mb-6">PAIR WITH MOBILE</h3>

                    <div className="bg-white p-2 mb-6">
                        <QRCodeSVG value={magicLink} size={180} level="L" />
                    </div>

                    <button
                        onClick={handleCopyLink}
                        className="flex items-center gap-2 text-xs font-bold border border-border-color px-4 py-2 hover:bg-white hover:text-black transition-colors"
                    >
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        {copied ? 'LINK COPIED' : 'COPY MAGIC LINK'}
                    </button>
                </div>
            </div>

            {/* Join Section Footer */}
            <div className="bg-background border-2 border-t-0 border-border-color p-4 max-w-3xl w-full flex items-center justify-between gap-4">
                <span className="text-xs text-gray-500 font-bold hidden md:inline">JOINING A SESSION instead?</span>
                <div className="flex-1 max-w-xs">
                    <JoinSession />
                </div>
            </div>
        </div>
    );
}
