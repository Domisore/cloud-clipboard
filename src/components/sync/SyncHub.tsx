"use client";

import { useEffect, useState, useCallback } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useSession } from '@/context/SessionContext';
import { Copy, RefreshCw, Smartphone, Monitor, Check } from 'lucide-react';
import { JoinSession } from './JoinSession';

export function SyncHub({ onClose }: { onClose: () => void }) {
    const { generateSyncCode, isConnected, disconnect, burnSession } = useSession();
    const [otp, setOtp] = useState<string>('...');
    const [expiresAt, setExpiresAt] = useState<number>(0);
    const [magicLink, setMagicLink] = useState<string>('');
    const [timeLeft, setTimeLeft] = useState<number>(120);
    const [copied, setCopied] = useState(false);

    // Perma-Connect State
    const [mode, setMode] = useState<'standard' | 'perma'>('standard');
    const [permaKey, setPermaKey] = useState<string>('');

    const generatePermaKey = async () => {
        try {
            const res = await fetch('/api/sync/perma/create', { method: 'POST' });
            const data = await res.json();
            if (data.key) {
                setPermaKey(data.key);
            }
        } catch (e) {
            console.error('Failed to generate perm key', e);
        }
    };

    const refreshCode = useCallback(async () => {
        try {
            const data = await generateSyncCode();
            setOtp(data.otp);
            setExpiresAt(data.expiresAt);
            setMagicLink(data.magicLink);
            setTimeLeft(86400); // Reset to 24h
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

    const formatTimeLeft = (seconds: number) => {
        if (seconds > 3600) {
            return Math.floor(seconds / 3600) + ' HOURS';
        }
        return Math.floor(seconds / 60) + ' MINS';
    };

    const handleCopyLink = () => {
        navigator.clipboard.writeText(magicLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleBurn = async () => {
        if (confirm('ARE YOU SURE? This will destroy the session for everyone connected.')) {
            await burnSession();
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-surface border-2 border-border-color p-0 max-w-3xl w-full relative flex flex-col md:flex-row shadow-2xl">
                <div className="absolute top-4 left-4 z-20 flex gap-2">
                    <button
                        onClick={() => setMode('standard')}
                        className={`text-[10px] font-bold px-3 py-1 rounded-full transition-colors ${mode === 'standard' ? 'bg-primary text-primary-foreground' : 'bg-surface border border-border-color text-muted-foreground hover:text-foreground'}`}
                    >
                        STANDARD
                    </button>
                    <button
                        onClick={() => setMode('perma')}
                        className={`text-[10px] font-bold px-3 py-1 rounded-full transition-colors ${mode === 'perma' ? 'bg-primary text-primary-foreground' : 'bg-surface border border-border-color text-muted-foreground hover:text-foreground'}`}
                    >
                        PERMANENT
                    </button>
                </div>

                <button onClick={onClose} className="absolute top-4 right-4 z-30 text-gray-500 hover:text-white text-xl p-2">✕</button>

                {mode === 'standard' ? (
                    <>
                        {/* Left: Desktop OTP */}
                        <div className="flex-1 p-8 border-b md:border-b-0 md:border-r border-border-color flex flex-col justify-center items-center text-center bg-background/50 relative pt-16">
                            {isConnected && (
                                <div className="absolute top-16 left-4 flex flex-col gap-2">
                                    <span className="bg-accent/20 text-accent text-[10px] font-bold px-2 py-1 border border-accent rounded-full animate-pulse flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
                                        SESSION ACTIVE
                                    </span>
                                    <button onClick={disconnect} className="text-[10px] text-gray-500 border border-gray-700 px-2 py-1 hover:bg-gray-800 hover:text-white transition-colors">
                                        LEAVE SESSION
                                    </button>
                                    <button onClick={handleBurn} className="text-[10px] text-danger border border-danger/50 px-2 py-1 hover:bg-danger hover:text-white transition-colors font-bold">
                                        BURN SESSION
                                    </button>
                                </div>
                            )}
                            <Monitor className="w-8 h-8 text-gray-500 mb-4" />
                            <h3 className="text-sm font-bold text-gray-400 mb-2">PAIR WITH DESKTOP</h3>
                            <p className="text-[10px] text-gray-500 mb-6 uppercase tracking-wider max-w-[200px]">
                                Temporary code (24h). Ideal for sharing with others.
                            </p>

                            <div className="font-mono text-6xl md:text-7xl font-bold text-white tracking-widest mb-2 font-numeric select-all">
                                {otp.slice(0, 3)} {otp.slice(3)}
                            </div>
                            <div className="text-xs text-accent animate-pulse mt-4">
                                EXPIRES IN {formatTimeLeft(timeLeft)}
                            </div>
                        </div>

                        {/* Right: Mobile QR & Link */}
                        <div className="flex-1 p-8 flex flex-col justify-center items-center bg-surface pt-16">
                            <Smartphone className="w-8 h-8 text-gray-500 mb-4" />
                            <h3 className="text-sm font-bold text-gray-400 mb-2">PAIR WITH MOBILE</h3>
                            <p className="text-[10px] text-gray-500 mb-6 uppercase tracking-wider">Scan with your mobile camera</p>

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
                            <p className="text-[10px] text-gray-500 mt-2 text-center max-w-[200px]">
                                Share link via WhatsApp or Messenger
                            </p>
                        </div>
                    </>
                ) : (
                    /* Permanent Mode */
                    <div className="w-full p-8 flex flex-col items-center justify-center min-h-[400px] text-center pt-16">
                        <h3 className="text-xl font-bold mb-4">Permanent Connection Key</h3>
                        <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-lg max-w-md mb-6 text-left">
                            <p className="text-xs text-red-200 font-bold mb-2">⚠️ CAUTION: FOR YOUR EYES ONLY</p>
                            <p className="text-xs text-red-200/80 leading-relaxed mb-2">
                                This key grants <strong>permanent access</strong> to this account. Do NOT share it with anyone.
                                Use the "Standard" 24h code for temporary sharing.
                            </p>
                            <p className="text-xs text-red-200/80 leading-relaxed">
                                <strong>Recommendation:</strong> Save this key in a secure place like Google Keep, or email it to yourself to connect your other devices.
                            </p>
                        </div>

                        {!permaKey ? (
                            <button
                                onClick={generatePermaKey}
                                className="bg-accent text-accent-foreground font-bold px-6 py-3 rounded-lg hover:bg-accent/90 transition-colors flex items-center gap-2"
                            >
                                <RefreshCw className="w-4 h-4" />
                                GENERATE NEW PERMANENT KEY
                            </button>
                        ) : (
                            <div className="w-full max-w-lg animate-in fade-in slide-in-from-bottom-4">
                                <div className="bg-background border border-border-color p-4 rounded-lg flex items-center gap-4 mb-4">
                                    <code className="flex-1 font-mono text-xs break-all text-left text-accent">
                                        {permaKey}
                                    </code>
                                    <button
                                        onClick={() => {
                                            navigator.clipboard.writeText(permaKey);
                                            setCopied(true);
                                            setTimeout(() => setCopied(false), 2000);
                                        }}
                                        className="p-2 hover:bg-surface rounded transition-colors"
                                    >
                                        {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                                    </button>
                                </div>
                                <p className="text-xs text-yellow-500/80 font-medium">
                                    ⚠️ Save this key securely. It will not be shown again.
                                </p>
                            </div>
                        )}
                    </div>
                )}
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
