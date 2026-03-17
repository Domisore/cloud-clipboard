"use client";

import { useEffect, useState } from 'react';
import { FileText, Image as ImageIcon, Link as LinkIcon, Clock, Trash2, Check, ChevronDown, ChevronUp, RefreshCw } from 'lucide-react';
import { useSession } from '@/context/SessionContext'; // Import context
import { UploadResult } from '@/services/mockUpload';

type Upload = {
    url: string;
    key: string;
    id?: string; // Add optional id
    expiresAt: number;
    filename?: string;
    textSnippet?: string;
    type?: string;
    mimeType?: string; // Add mimeType from UploadResult
};

function formatTimeAgo(timestamp: number): string {
    const diff = Math.max(0, Math.floor((timestamp - Date.now()) / 1000));

    if (diff < 60) return `${diff}s`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
    return `${Math.floor(diff / 86400)}d`;
}

export function RecentList() {
    const { userFiles, refreshFiles, isRefreshing, lastSyncedAt } = useSession(); // Get user files
    const [uploads, setUploads] = useState<Upload[]>([]);
    const [showToast, setShowToast] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        if (showToast) {
            const timer = setTimeout(() => setShowToast(false), 2000);
            return () => clearTimeout(timer);
        }
    }, [showToast]);

    const loadUploads = () => {
        let merged: Upload[] = [];

        // 1. Add User Files (Remote)
        if (userFiles && userFiles.length > 0) {
            const remoteUploads = userFiles.map((f: UploadResult) => ({
                url: f.url || (typeof window !== 'undefined' ? `${window.location.origin}/${f.id}` : ''),
                key: f.id, // Map ID to key
                id: f.id,
                expiresAt: f.expiresAt,
                filename: f.filename,
                textSnippet: f.textSnippet,
                type: f.mimeType,
                mimeType: f.mimeType
            }));
            merged = [...remoteUploads];
        }

        // 2. Add Local Files (deduplicate)
        const stored = localStorage.getItem('recent_uploads');
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                const now = Date.now();
                const activeLocal = parsed.filter((u: any) => {
                    // Filter expired
                    if (u.expiresAt <= now) return false;
                    // Filter if already present in remote (by id)
                    const id = u.id || u.key;
                    if (merged.some(m => m.key === id || m.id === id)) return false;
                    return true;
                });

                // Map local format to Upload type if needed
                const mappedLocal = activeLocal.map((u: any) => ({
                    ...u,
                    key: u.id || u.key, // Ensure key exists
                    type: u.mimeType || u.type // Ensure type exists
                }));

                merged = [...merged, ...mappedLocal];

                // Cleanup expired local storage
                if (activeLocal.length !== parsed.length) {
                    // We don't save merged back to local, we only prune expired local items
                    // But we can't easily prune *just* expired without losing the ones we filtered out for duplication?
                    // Actually, we should just prune expired from the source list.
                    // For simplicity, let's just trigger a cleanup of strictly expired items.
                    const strictlyActive = parsed.filter((u: any) => u.expiresAt > now);
                    if (strictlyActive.length !== parsed.length) {
                        localStorage.setItem('recent_uploads', JSON.stringify(strictlyActive));
                    }
                }
            } catch (e) {
                console.error("Failed to parse recent uploads", e);
            }
        }

        // Sort by recency (newest first)? 
        // userFiles are usually sorted by DB, local by append. 
        // Let's rely on append order or sort? 
        // Let's sort by uploadedAt if available, otherwise fallback.
        // But Upload type above doesn't have uploadedAt.
        // userFiles has it. Local might.
        // Let's just set the state for now.
        setUploads(merged);
    };

    useEffect(() => {
        setMounted(true);
        loadUploads();
        window.addEventListener('storage-update', loadUploads);
        const interval = setInterval(loadUploads, 30000); // Check expiry every 30s
        return () => {
            window.removeEventListener('storage-update', loadUploads);
            clearInterval(interval);
        };
    }, [userFiles]); // Re-run when userFiles changes

    const deleteUpload = (key: string) => {
        const updated = uploads.filter(u => u.key !== key);
        setUploads(updated);
        localStorage.setItem('recent_uploads', JSON.stringify(updated));
    };

    if (!mounted) return null;

    return (
        <div className="w-full max-w-5xl mx-auto space-y-4 animate-fade-in">
            <div className="flex items-center justify-center gap-4 py-2">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center gap-2 group cursor-pointer"
                >
                    <h2 className="text-xs font-bold text-foreground-muted uppercase tracking-wider group-hover:text-foreground transition-colors">
                        Recent Activity ({uploads.length})
                    </h2>
                    {isOpen ? (
                        <ChevronUp size={16} className="text-foreground-muted group-hover:text-foreground transition-colors" />
                    ) : (
                        <ChevronDown size={16} className="text-foreground-muted group-hover:text-foreground transition-colors" />
                    )}
                </button>

                <div className="flex items-center gap-2">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            refreshFiles();
                        }}
                        disabled={isRefreshing}
                        className={`p-1.5 rounded-full hover:bg-white/5 transition-all ${isRefreshing ? 'animate-spin text-accent' : 'text-foreground-muted hover:text-foreground'}`}
                        title="Sync Recent Activity"
                    >
                        <RefreshCw size={14} />
                    </button>
                    {lastSyncedAt && (
                        <span className="text-[10px] text-foreground-muted/40 font-mono hidden sm:inline">
                            Synced {new Date(lastSyncedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </span>
                    )}
                </div>
            </div>

            {isOpen && (
                <div className="animate-in slide-in-from-top-2 fade-in duration-200">
                    {uploads.length === 0 ? (
                        <div className="opacity-50 text-center py-8 border border-dashed border-border-color rounded-lg">
                            <div className="text-sm text-foreground-muted">No recent uploads found.</div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {uploads.map((upload) => (
                                <a
                                    key={upload.key}
                                    href={upload.url}
                                    className="group relative bg-surface/50 hover:bg-surface border border-border-color rounded-lg p-5 transition-all text-left block hover:border-accent/40 active:scale-[0.99]"
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="p-2 rounded-md bg-background border border-border-color text-accent/80">
                                            {upload.type?.startsWith('image') ? <ImageIcon size={18} /> : <FileText size={18} />}
                                        </div>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); deleteUpload(upload.key); }}
                                            className="text-foreground-muted hover:text-danger opacity-0 group-hover:opacity-100 transition-opacity"
                                            title="Remove from history"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>

                                    <div className="mb-4">
                                        <h3 className="text-foreground font-medium text-sm truncate pr-4" title={upload.filename}>
                                            {upload.filename || 'Untitled Paste'}
                                        </h3>
                                        {upload.textSnippet && (
                                            <p className="text-xs text-foreground-muted mt-1 font-mono line-clamp-2 opacity-70">
                                                {upload.textSnippet}
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex items-center justify-between pt-3 border-t border-border-color/50">
                                        <div className="flex items-center gap-1.5 text-[10px] text-foreground-muted">
                                            <Clock size={12} />
                                            <span suppressHydrationWarning>{formatTimeAgo(upload.expiresAt)} left</span>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    navigator.clipboard.writeText(upload.url);
                                                    setShowToast(true);
                                                }}
                                                className="flex items-center gap-1.5 text-xs font-bold text-accent hover:underline opacity-80 hover:opacity-100"
                                            >
                                                <LinkIcon size={12} />
                                                Copy Link
                                            </button>
                                        </div>
                                    </div>
                                </a>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {showToast && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-foreground text-background px-4 py-2 rounded-full text-xs font-bold shadow-xl animate-in fade-in slide-in-from-bottom-2 duration-200 flex items-center gap-2 z-50">
                    <Check size={14} />
                    Copied
                </div>
            )}
        </div>
    );
}
