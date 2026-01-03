"use client";

import { useSession, SessionData } from '@/context/SessionContext';
import { Clock, Shield, Trash2, Edit2, Play, Users } from 'lucide-react';
import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';

export function SessionList({ onClose }: { onClose: () => void }) {
    const { wallet, sessionId, switchSession, removeFromWallet, renameSession } = useSession();
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editName, setEditName] = useState('');

    const handleStartEdit = (session: SessionData) => {
        setEditingId(session.key);
        setEditName(session.name);
    };

    const handleSaveEdit = (key: string) => {
        if (editName.trim()) {
            renameSession(key, editName);
        }
        setEditingId(null);
    };

    return (
        <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-background border-l border-border-color shadow-2xl z-50 transform transition-transform animate-in slide-in-from-right duration-300">
            <div className="flex flex-col h-full">
                <div className="p-6 border-b border-border-color flex justify-between items-center bg-surface/30 backdrop-blur-sm">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <Users className="w-5 h-5 text-accent" />
                        Session Wallet
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-surface/50 rounded-full transition-colors">
                        ✕
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {wallet.length === 0 ? (
                        <div className="text-center text-foreground-muted py-12">
                            <p>No active sessions found.</p>
                            <p className="text-sm mt-2">Create a new upload or sync a device to get started.</p>
                        </div>
                    ) : (
                        wallet.map(session => (
                            <div
                                key={session.key}
                                className={`
                                    relative group p-4 rounded-xl border transition-all duration-200
                                    ${session.sessionId === sessionId
                                        ? 'bg-accent/5 border-accent shadow-[0_0_15px_rgba(88,166,255,0.15)]'
                                        : 'bg-surface/50 border-border-color hover:border-accent/50'
                                    }
                                `}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex-1 min-w-0 mr-2">
                                        {editingId === session.key ? (
                                            <input
                                                value={editName}
                                                onChange={e => setEditName(e.target.value)}
                                                onBlur={() => handleSaveEdit(session.key)}
                                                onKeyDown={e => e.key === 'Enter' && handleSaveEdit(session.key)}
                                                className="w-full bg-background border border-accent rounded px-2 py-1 text-sm focus:outline-none"
                                                autoFocus
                                            />
                                        ) : (
                                            <h3 className="font-medium truncate flex items-center gap-2">
                                                {session.name}
                                                <button
                                                    onClick={() => handleStartEdit(session)}
                                                    className="opacity-0 group-hover:opacity-100 p-1 hover:text-accent transition-opacity"
                                                >
                                                    <Edit2 className="w-3 h-3" />
                                                </button>
                                            </h3>
                                        )}
                                    </div>
                                    {session.type === 'permanent' ? (
                                        <span className="shrink-0 px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center gap-1">
                                            <Shield className="w-3 h-3" />
                                            Perm
                                        </span>
                                    ) : (
                                        <span className="shrink-0 px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            Temp
                                        </span>
                                    )}
                                </div>

                                <div className="text-xs text-foreground-muted mb-4 flex flex-col gap-1">
                                    <div>Files: {session.fileCount}</div>
                                    {session.expiresAt && (
                                        <div className="text-yellow-500/80">
                                            Expires {formatDistanceToNow(session.expiresAt, { addSuffix: true })}
                                        </div>
                                    )}
                                </div>

                                <div className="flex gap-2">
                                    {session.sessionId !== sessionId && (
                                        <button
                                            onClick={() => {
                                                switchSession(session.key);
                                                onClose();
                                            }}
                                            className="flex-1 py-1.5 flex items-center justify-center gap-2 bg-accent text-background text-xs font-bold rounded hover:bg-accent/90 transition-colors"
                                        >
                                            <Play className="w-3 h-3" />
                                            Resume
                                        </button>
                                    )}
                                    <button
                                        onClick={() => removeFromWallet(session.key)}
                                        className="px-3 py-1.5 flex items-center justify-center bg-surface hover:bg-danger/20 hover:text-danger border border-border-color rounded transition-colors text-foreground-muted"
                                        title="Forget Session"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
