"use client";

import { useEffect, useState } from 'react';
import { UploadResult } from '@/services/mockUpload';
import { migrateOldUploads } from '@/services/migrateUploads';
import { Trash2, Copy, FileText, Image as ImageIcon, File, Clock } from 'lucide-react';

export function RecentList() {
    const [uploads, setUploads] = useState<UploadResult[]>([]);
    const [mounted, setMounted] = useState(false);
    const [copiedId, setCopiedId] = useState<string | null>(null);

    useEffect(() => {
        setMounted(true);
        const stored = localStorage.getItem('recent_uploads');
        if (stored) {
            setUploads(JSON.parse(stored));
        }

        // Listen for updates
        const handleStorage = () => {
            const stored = localStorage.getItem('recent_uploads');
            if (stored) {
                setUploads(JSON.parse(stored));
            }
        };

        window.addEventListener('storage-update', handleStorage);
        return () => window.removeEventListener('storage-update', handleStorage);
    }, []);

    const copyToClipboard = (url: string, id: string) => {
        navigator.clipboard.writeText(url);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const deleteItem = (id: string) => {
        const newUploads = uploads.filter(u => u.id !== id);
        setUploads(newUploads);
        localStorage.setItem('recent_uploads', JSON.stringify(newUploads));
    };

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
    };

    const formatTimeAgo = (timestamp: number): string => {
        const seconds = Math.floor((Date.now() - timestamp) / 1000);

        if (seconds < 60) return `${seconds}s ago`;
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
        return `${Math.floor(seconds / 86400)}d ago`;
    };

    const getFileIcon = (mimeType: string | undefined) => {
        if (!mimeType) return <File className="w-5 h-5" />;
        if (mimeType.startsWith('image/')) {
            return <ImageIcon className="w-5 h-5" />;
        }
        if (mimeType.startsWith('text/')) {
            return <FileText className="w-5 h-5" />;
        }
        return <File className="w-5 h-5" />;
    };

    const getFileTypeLabel = (mimeType: string | undefined): string => {
        if (!mimeType) return 'FILE';
        if (mimeType.startsWith('image/')) return 'IMAGE';
        if (mimeType.startsWith('text/')) return 'TEXT';
        if (mimeType.startsWith('video/')) return 'VIDEO';
        if (mimeType.startsWith('audio/')) return 'AUDIO';
        if (mimeType.includes('pdf')) return 'PDF';
        if (mimeType.includes('zip') || mimeType.includes('compressed')) return 'ARCHIVE';
        return 'FILE';
    };

    if (!mounted || uploads.length === 0) return null;

    return (
        <div className="w-full max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">Recent Uploads</h3>
                <span className="text-xs text-gray-500">{uploads.length} FILE{uploads.length !== 1 ? 'S' : ''}</span>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {uploads.map((upload) => (
                    <div
                        key={upload.id}
                        className="border border-border-color bg-surface/30 hover:bg-surface/50 transition-colors group"
                    >
                        <div className="p-4">
                            {/* Header Row */}
                            <div className="flex items-start justify-between gap-4 mb-3">
                                <div className="flex items-start gap-3 flex-1 min-w-0">
                                    {/* File Icon */}
                                    <div className="flex-shrink-0 w-10 h-10 border border-border-color bg-background flex items-center justify-center text-accent">
                                        {getFileIcon(upload.mimeType)}
                                    </div>

                                    {/* File Info */}
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-sm font-bold text-white break-all mb-1">
                                            {upload.filename}
                                        </h4>
                                        <div className="flex items-center gap-3 text-xs text-gray-500">
                                            <span className="font-mono">{getFileTypeLabel(upload.mimeType)}</span>
                                            <span>•</span>
                                            <span>{formatFileSize(upload.size)}</span>
                                            <span>•</span>
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {formatTimeAgo(upload.uploadedAt)}
                                            </span>
                                            {upload.burnOnRead && (
                                                <>
                                                    <span>•</span>
                                                    <span className="text-danger font-bold">🔥 BURN_ON_READ</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2 flex-shrink-0">
                                    <button
                                        onClick={() => copyToClipboard(upload.url, upload.id)}
                                        className="text-xs bg-white text-black px-3 py-1.5 font-bold hover:bg-accent transition-colors flex items-center gap-1.5"
                                        title="Copy Link"
                                    >
                                        <Copy className="w-3 h-3" />
                                        {copiedId === upload.id ? 'COPIED!' : 'COPY'}
                                    </button>
                                    <button
                                        onClick={() => deleteItem(upload.id)}
                                        className="p-1.5 hover:text-danger transition-colors border border-transparent hover:border-danger"
                                        title="Burn Now"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Footer Row - URL Preview */}
                            <div className="pt-3 border-t border-border-color/50">
                                <div className="flex items-center justify-between gap-2">
                                    <code className="text-xs text-accent font-mono truncate">
                                        {upload.url}
                                    </code>
                                    <a
                                        href={upload.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs text-gray-500 hover:text-accent transition-colors whitespace-nowrap"
                                    >
                                        OPEN →
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Carbon Ads Placeholder */}
            <div className="mt-12 border border-border-color p-4 flex items-center justify-between bg-surface/20 max-w-sm ml-auto">
                <div className="text-xs text-gray-500">
                    <p className="font-bold text-white mb-1">Developer Portfolio Hosting</p>
                    <p>Showcase your work with style.</p>
                </div>
                <div className="w-8 h-8 bg-gray-700"></div>
            </div>
        </div>
    );
}
