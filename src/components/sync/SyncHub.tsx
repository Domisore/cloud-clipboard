"use client";

import { useEffect, useState, useCallback } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useSession } from '@/context/SessionContext';
import { Copy, RefreshCw, Check, Zap, X } from 'lucide-react';
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
        burnSession();
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-in fade-in duration-200">
            <div className="relative w-full max-w-md bg-background border border-border-color rounded-2xl shadow-2xl p-6 overflow-y-auto max-h-[90vh]">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 hover:bg-surface rounded-full transition-colors text-foreground-muted hover:text-foreground"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Header */}
                <div className="text-center mb-6">
                    <h2 className="text-xl font-bold text-foreground mb-1 flex items-center justify-center gap-2">
                        <Zap className="w-5 h-5 text-accent" />
                        Sync Devices
                    </h2>
                    <p className="text-xs text-foreground-muted">
                        Link devices to share files instantly.
                    </p>
                </div>

                {/* Section 1: This Device (Host) */}
                <div className="flex flex-col items-center mb-8">
                    <div className="flex p-1 bg-surface border border-border-color rounded-lg mb-6">
                        <button
                            onClick={() => setMode('standard')}
                            className={`px-4 py-1.5 rounded-md text-[10px] font-bold transition-all ${mode === 'standard' ? 'bg-background shadow-sm text-foreground' : 'text-foreground-muted hover:text-foreground'}`}
                        >
                            STANDARD (24H)
                        </button>
                        <button
                            onClick={() => setMode('perma')}
                            className={`px-4 py-1.5 rounded-md text-[10px] font-bold transition-all ${mode === 'perma' ? 'bg-background shadow-sm text-foreground' : 'text-foreground-muted hover:text-foreground'}`}
                        >
                            PERMANENT
                        </button>
                    </div>

                    {mode === 'standard' ? (
                        <div className="w-full flex flex-col items-center animate-in fade-in duration-300">
                            <div className="bg-surface p-6 rounded-xl border border-border-color mb-4 w-full text-center">
                                <div className="text-4xl font-mono font-bold text-accent tracking-[0.2em] mb-2 select-all">
                                    {otp}
                                </div>
                                <p className="text-[10px] text-foreground-muted uppercase tracking-wider">
                                    Expires in {formatTimeLeft(timeLeft)}
                                </p>
                            </div>

                            <div className="flex items-center gap-3 w-full">
                                <input
                                    readOnly
                                    value={magicLink}
                                    className="flex-1 bg-surface/50 border border-border-color rounded-lg px-3 py-2 text-xs text-foreground-muted font-mono truncate"
                                />
                                <button
                                    onClick={handleCopyLink}
                                    className="p-2 bg-surface hover:bg-surface-hover border border-border-color rounded-lg transition-colors text-foreground"
                                    title="Copy Magic Link"
                                >
                                    {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="w-full flex flex-col items-center animate-in fade-in duration-300">
                            <div className="bg-surface/50 p-5 rounded-xl border border-border-color w-full text-center mb-4">
                                {!permaKey ? (
                                    <div className="py-4">
                                        <button
                                            onClick={generatePermaKey}
                                            className="px-4 py-2 bg-accent text-background text-xs font-bold rounded hover:bg-accent/90 transition-colors flex items-center gap-2 mx-auto"
                                        >
                                            <RefreshCw className="w-3 h-3" />
                                            Generate Key
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <p className="text-[10px] text-foreground-muted mb-2 uppercase font-bold">Your Permanent Key</p>
                                        <div className="text-xl font-mono font-bold text-accent break-all select-all mb-3">
                                            {permaKey}
                                        </div>
                                        <button
                                            onClick={() => {
                                                navigator.clipboard.writeText(permaKey);
                                                setCopied(true);
                                                setTimeout(() => setCopied(false), 2000);
                                            }}
                                            className="text-xs text-foreground hover:text-accent underline decoration-dotted underline-offset-4"
                                        >
                                            {copied ? 'Copied!' : 'Copy to Clipboard'}
                                        </button>
                                    </>
                                )}
                            </div>
                            <div className="text-[10px] text-yellow-500/80 bg-yellow-500/10 border border-yellow-500/20 px-3 py-2 rounded-lg w-full text-left">
                                <strong>Note:</strong> Save this key in a secure location like Google Keep or in a private DM    yourself in a messaging app. It grants permanent access to this session.
                            </div>
                        </div>
                    )}
                </div>

                {/* Divider */}
                <div className="relative w-full mb-8">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-border-color" />
                    </div>
                    <div className="relative flex justify-center text-[10px] uppercase font-bold">
                        <span className="bg-background px-2 text-foreground-muted">Or Connect</span>
                    </div>
                </div>

                {/* Section 2: Join (Guest) */}
                <div className="w-full">
                    <JoinSession />
                </div>
            </div>
        </div>
    );
}

