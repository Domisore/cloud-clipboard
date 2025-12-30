"use client";

import { useState, useEffect } from 'react';
import { UploadResult } from '@/services/mockUpload';
import { Trash2, Copy, FileText, Image as ImageIcon, File, Clock } from 'lucide-react';

interface RecentItemProps {
    upload: UploadResult;
    isCopied: boolean;
    onCopy: (url: string, id: string) => void;
    onDelete: (id: string) => void;
}

export function RecentItem({ upload, isCopied, onCopy, onDelete }: RecentItemProps) {
    const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);

    useEffect(() => {
        if (upload.mimeType?.startsWith('image/')) {
            const controller = new AbortController();

            fetch(`/api/file/${upload.id}`, { signal: controller.signal })
                .then(res => res.ok ? res.json() : null)
                .then(data => {
                    if (data && data.url) {
                        setThumbnailUrl(data.url);
                    }
                })
                .catch(err => {
                    if (err.name !== 'AbortError') {
                        console.error("Thumbnail fetch error", err);
                    }
                });

            return () => controller.abort();
        }
    }, [upload.id, upload.mimeType]);

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

    const getFileIcon = () => {
        const mimeType = upload.mimeType;
        if (!mimeType) return <File className="w-5 h-5 text-gray-500" />;

        // Show thumbnail for images
        if (mimeType.startsWith('image/')) {
            if (thumbnailUrl) {
                return (
                    <div className="w-full h-full relative overflow-hidden group-hover:scale-105 transition-transform duration-300">
                        <img
                            src={thumbnailUrl}
                            alt={upload.filename}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                e.currentTarget.parentElement?.classList.add('bg-background');
                                // Show fallback icon
                                const fallback = document.createElement('div');
                                fallback.className = 'w-full h-full flex items-center justify-center';
                                fallback.innerHTML = '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>';
                                e.currentTarget.parentElement?.appendChild(fallback);
                            }}
                        />
                    </div>
                );
            } else {
                return <ImageIcon className="w-5 h-5 animate-pulse text-gray-400" />;
            }
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

    return (
        <div className="border border-border-color bg-surface/30 hover:bg-surface/50 transition-colors group">
            <div className="p-4">
                {/* Header Row */}
                <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                        {/* File Icon */}
                        <div className="flex-shrink-0 w-10 h-10 border border-border-color bg-background flex items-center justify-center text-accent overflow-hidden">
                            {getFileIcon()}
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
                            onClick={() => onCopy(upload.url, upload.id)}
                            className="text-xs bg-white text-black px-3 py-1.5 font-bold hover:bg-accent transition-colors flex items-center gap-1.5"
                            title="Copy Link"
                        >
                            <Copy className="w-3 h-3" />
                            {isCopied ? 'COPIED!' : 'COPY'}
                        </button>
                        <button
                            onClick={() => onDelete(upload.id)}
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
    );
}
