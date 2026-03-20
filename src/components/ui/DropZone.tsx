"use client";

import { useState, useCallback, useMemo } from 'react';
import { usePaste } from '@/hooks/usePaste';
import { clsx } from 'clsx';
import { uploadFile } from '@/services/upload';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';

const FREE_LIMIT = 5 * 1024 * 1024; // 5MB
const PRO_LIMIT = 100 * 1024 * 1024; // 100MB

export function DropZone() {
    const { user } = useUser();
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
    const [burnOnRead, setBurnOnRead] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false);
    const [error, setError] = useState<{ message: string; type: 'limit' | 'other' } | null>(null);

    const plan = (user?.publicMetadata?.plan as 'free' | 'pro') || 'free';
    const limit = plan === 'pro' ? PRO_LIMIT : FREE_LIMIT;

    const handleUpload = useCallback(async (file: File) => {
        setError(null);

        if (file.size > limit) {
            setError({
                message: `File too large (${(file.size / (1024 * 1024)).toFixed(1)}MB). Free tier limit is 5MB.`,
                type: 'limit'
            });
            return;
        }

        setIsUploading(true);
        setUploadSuccess(null);

        try {
            const result = await uploadFile(file, burnOnRead);

            // Save to local storage
            const existing = JSON.parse(localStorage.getItem('recent_uploads') || '[]');
            const uploadWithSnippet = {
                ...result,
                textSnippet: file.type === 'text/plain' && file.size < 10240 ? await file.text().then(t => t.slice(0, 50)) : undefined
            };
            const updated = [uploadWithSnippet, ...existing];
            localStorage.setItem('recent_uploads', JSON.stringify(updated));

            // Dispatch event for RecentList
            window.dispatchEvent(new Event('storage-update'));

            setUploadSuccess(result.url);

            // Clear success message after 5 seconds
            setTimeout(() => setUploadSuccess(null), 5000);
        } catch (err: any) {
            console.error(err);
            setError({ message: err.message || 'Upload failed', type: 'other' });
        } finally {
            setIsUploading(false);
        }
    }, [burnOnRead, limit]);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0) {
            handleUpload(files[0]);
        }
    }, [handleUpload]);

    const handlePaste = useCallback((files: File[], text: string | null) => {
        if (files.length > 0) {
            handleUpload(files[0]);
        } else if (text) {
            // Create a text file from the content
            const blob = new Blob([text], { type: 'text/plain' });
            const file = new File([blob], `paste-${Date.now()}.txt`, { type: 'text/plain' });
            handleUpload(file);
        }
    }, [handleUpload]);

    usePaste(handlePaste);

    return (
        <div className="w-full max-w-4xl mx-auto p-4 sm:p-8 border-2 border-dashed border-border-color rounded-none relative overflow-hidden">
            <div className="grid grid-cols-3 gap-2 sm:gap-4">

                {/* Card 1: Paste Text */}
                <div className="aspect-square border border-border-color bg-surface/50 flex flex-col items-center justify-center gap-2 sm:gap-4 hover:border-accent hover:text-accent transition-colors group cursor-pointer" onClick={() => navigator.clipboard.readText().then(t => handlePaste([], t))}>
                    <div className="w-10 h-10 sm:w-16 sm:h-16 border-2 border-current flex items-center justify-center rounded-lg transition-all">
                        <span className="text-xl sm:text-4xl font-bold">T</span>
                    </div>
                    <p className="text-[10px] sm:text-sm font-medium text-center leading-tight">Paste Text<span className="hidden sm:inline"> (Ctrl+V)</span></p>
                </div>

                {/* Card 2: Paste Image */}
                <div className="aspect-square border border-border-color bg-surface/50 flex flex-col items-center justify-center gap-2 sm:gap-4 hover:border-accent hover:text-accent transition-colors group cursor-pointer">
                    <div className="w-10 h-10 sm:w-16 sm:h-16 border-2 border-current flex items-center justify-center rounded-lg transition-all">
                        <div className="w-6 h-5 sm:w-10 sm:h-8 border-2 border-current rounded-sm relative">
                            <div className="absolute top-0.5 right-0.5 sm:top-1 sm:right-1 w-1 h-1 sm:w-2 sm:h-2 bg-current rounded-full"></div>
                        </div>
                    </div>
                    <p className="text-[10px] sm:text-sm font-medium text-center leading-tight">Paste Image<span className="hidden sm:inline"> (Ctrl+V)</span></p>
                </div>

                {/* Card 3: Drag & Drop (Click to Select) */}
                <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => document.getElementById('file-input')?.click()}
                    className={clsx(
                        "aspect-square border border-border-color bg-surface/50 flex flex-col items-center justify-center gap-2 sm:gap-4 transition-colors cursor-pointer",
                        isDragging ? "border-accent bg-accent/10 shadow-hacker-green" : "hover:border-accent hover:text-accent"
                    )}
                >
                    <input
                        type="file"
                        id="file-input"
                        className="hidden"
                        onChange={(e) => {
                            if (e.target.files && e.target.files.length > 0) {
                                handleUpload(e.target.files[0]);
                            }
                        }}
                    />
                    <div className="w-10 h-10 sm:w-16 sm:h-16 flex items-center justify-center transition-all">
                        <svg className="w-8 h-8 sm:w-12 sm:h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
                        </svg>
                    </div>
                    <div className="text-center">
                        <p className="text-xs sm:text-lg font-bold leading-none sm:leading-normal">Upload</p>
                        <p className="text-[10px] sm:text-base font-medium hidden sm:block">Drag or Click</p>
                    </div>
                </div>
            </div>

            {/* Footer Actions */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-sm text-gray-400 max-w-xs text-center sm:text-left">
                    {plan === 'free' ? 'Free Plan: 5MB Max' : 'Pro Plan: 100MB Max'}. Clips are encrypted and ephemeral.
                </p>

                <div className="flex items-center gap-4">
                    {/* Burn-on-Read Toggle */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setBurnOnRead(!burnOnRead)}
                            className={`w-12 h-6 rounded-full relative transition-colors ${burnOnRead ? 'bg-danger' : 'bg-gray-600'
                                }`}
                            title={burnOnRead ? 'Burn-on-Read: ON' : 'Burn-on-Read: OFF'}
                        >
                            <div
                                className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${burnOnRead ? 'right-1' : 'left-1'
                                    }`}
                            ></div>
                        </button>
                        <div className="flex items-center gap-1">
                            <span className="text-xs text-gray-500 hidden sm:inline">
                                {burnOnRead ? (
                                    <span className="text-danger font-bold">BURN_ON_READ</span>
                                ) : (
                                    'Burn-on-Read'
                                )}
                            </span>
                            <div
                                className="relative hidden sm:inline-block"
                                onMouseEnter={() => setShowTooltip(true)}
                                onMouseLeave={() => setShowTooltip(false)}
                            >
                                <span className="text-xs text-gray-500 cursor-help">
                                    ⓘ
                                </span>
                                {showTooltip && (
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 bg-surface border border-accent p-3 text-xs text-gray-300 z-50 shadow-hacker-green">
                                        <div className="mb-1 font-bold text-accent">Burn-on-Read</div>
                                        <div>Files are automatically deleted after the first download for maximum privacy.</div>
                                        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px border-4 border-transparent border-t-accent"></div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {plan === 'free' && (
                        <Link href="/pricing" className="bg-accent/20 text-accent px-3 py-1 text-[10px] font-bold border border-accent/30 hover:bg-accent hover:text-background transition-all uppercase tracking-wider">
                            Get Pro
                        </Link>
                    )}
                </div>
            </div>

            {/* Error Overlay */}
            {error && (
                <div className="absolute inset-0 bg-black/95 flex items-center justify-center z-20 animate-in fade-in duration-300">
                    <div className="text-center p-8 space-y-6 max-w-md">
                        <div className="text-red-500 font-black text-2xl uppercase tracking-tighter">
                            [ ERROR: LIMIT_EXCEEDED ]
                        </div>
                        <p className="text-gray-400 font-mono text-sm leading-relaxed">
                            {error.message}
                        </p>
                        <div className="flex flex-col gap-3">
                            {error.type === 'limit' && (
                                <Link 
                                    href="/pricing"
                                    className="bg-accent text-background px-6 py-3 text-sm font-black uppercase hover:bg-accent/90 transition-all shadow-hacker-green"
                                >
                                    Upgrade to Pro (100MB)
                                </Link>
                            )}
                            <button
                                onClick={() => setError(null)}
                                className="text-gray-500 font-mono text-xs uppercase hover:text-white transition-colors"
                            >
                                Dismiss
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Status Overlay */}
            {isUploading && (
                <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-10 transition-all duration-300">
                    <div className="text-accent font-bold text-xl animate-pulse tracking-[0.2em]">
                        UPLOADING...
                    </div>
                </div>
            )}

            {/* Success Overlay */}
            {uploadSuccess && !isUploading && (
                <div className="absolute inset-0 bg-black/90 flex items-center justify-center z-10 animate-in zoom-in-95 duration-200">
                    <div className="text-center space-y-4 p-6">
                        <div className="text-accent font-bold text-2xl uppercase tracking-widest">
                            ✓ UPLOADED
                        </div>
                        <div className="text-white text-xs font-mono break-all max-w-sm p-3 bg-white/5 border border-white/10">
                            {uploadSuccess}
                        </div>
                        <div className="flex gap-2 justify-center pt-2">
                             <button
                                onClick={() => {
                                    navigator.clipboard.writeText(uploadSuccess);
                                    // Feedback
                                    const btn = document.getElementById('copy-btn-inner');
                                    if (btn) btn.textContent = 'COPIED!';
                                    setTimeout(() => { if (btn) btn.textContent = 'COPY_LINK'; }, 2000);
                                }}
                                className="bg-white text-black px-6 py-2 text-sm font-bold hover:bg-accent transition-colors min-w-[120px]"
                                id="copy-btn-inner"
                            >
                                COPY_LINK
                            </button>
                            <button
                                onClick={() => setUploadSuccess(null)}
                                className="bg-gray-700 text-white px-6 py-2 text-sm font-bold hover:bg-gray-600 transition-colors"
                            >
                                DONE
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
