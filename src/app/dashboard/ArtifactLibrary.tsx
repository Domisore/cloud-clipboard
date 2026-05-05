"use client";

import { useState, useEffect, useMemo } from 'react';
import { 
    FileText, Code, FileJson, FileType, Search, Filter,
    Clock, Copy, CheckCircle2, ChevronDown, ChevronRight, 
    Download, Activity, ShieldAlert
} from 'lucide-react';

export function formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

interface Artifact {
    type: string; // 'CLIP_CREATED' or 'FILE_UPLOADED'
    id: string;
    timestamp: number;
    preview: string;
    metadata: {
        title?: string;
        filename?: string;
        contentType?: string;
        sizeBytes?: number;
        agentName?: string;
        expiresAt?: number;
    };
    rawKey?: string; // which key this belongs to
}

interface ArtifactLibraryProps {
    activities: any[];
    isLoading?: boolean;
}

export function ArtifactLibrary({ activities, isLoading = false }: ArtifactLibraryProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [typeFilter, setTypeFilter] = useState("all");
    const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const artifacts = useMemo(() => {
        return activities.filter(a => a.type === 'CLIP_CREATED' || a.type === 'FILE_UPLOADED' || a.type === 'HANDOFF_CREATED');
    }, [activities]);

    const handleCopy = (e: React.MouseEvent, text: string, id: string) => {
        e.stopPropagation();
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const toggleRow = (id: string) => {
        setExpandedRows(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const getIconForType = (contentType: string) => {
        if (!contentType) return <FileType size={18} />;
        if (contentType.includes('json')) return <FileJson size={18} className="text-yellow-400" />;
        if (contentType.includes('markdown') || contentType.includes('md')) return <FileText size={18} className="text-blue-400" />;
        if (contentType.includes('text')) return <FileText size={18} className="text-zinc-400" />;
        if (contentType.includes('javascript') || contentType.includes('code')) return <Code size={18} className="text-emerald-400" />;
        return <FileType size={18} className="text-purple-400" />;
    };

    const formatRelativeTime = (timestamp: number) => {
        const diff = Math.floor((Date.now() - timestamp) / 1000);
        if (diff < 60) return `${diff}s ago`;
        if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
        return `${Math.floor(diff / 86400)}d ago`;
    };

    const filteredArtifacts = useMemo(() => {
        return artifacts.filter(a => {
            const matchesSearch = searchQuery === "" || 
                (a.metadata?.filename?.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (a.metadata?.agentName?.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (a.id.toLowerCase().includes(searchQuery.toLowerCase()));
            
            const typeCategory = a.metadata?.contentType?.includes('json') ? 'json' :
                                 a.metadata?.contentType?.includes('markdown') ? 'md' :
                                 a.metadata?.contentType?.includes('text') ? 'text' : 'other';

            const matchesType = typeFilter === "all" || typeCategory === typeFilter;
            
            return matchesSearch && matchesType;
        });
    }, [artifacts, searchQuery, typeFilter]);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-4 border border-dashed border-zinc-800 rounded-xl">
                <Activity size={32} className="text-purple-500 animate-pulse" />
                <p className="text-zinc-500 animate-pulse font-mono text-sm">Syncing artifact library...</p>
            </div>
        );
    }

    if (artifacts.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 bg-zinc-900/20 rounded-xl border border-dashed border-zinc-800">
                <FileType size={40} className="text-zinc-700 mb-4" />
                <p className="text-zinc-400 font-bold mb-2">Your agents haven't created any artifacts yet.</p>
                <p className="text-sm text-zinc-600 text-center max-w-md">
                    Use the drive.io API to upload a file or create a clip, and it will appear here.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in">
            {/* Controls */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-zinc-900/50 p-4 rounded-xl border border-zinc-800">
                <div className="relative w-full sm:w-96">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                    <input 
                        type="text" 
                        placeholder="Search by filename or agent..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-black border border-zinc-800 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors"
                    />
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="flex items-center gap-2 bg-black border border-zinc-800 rounded-lg px-3 py-2">
                        <Filter size={14} className="text-zinc-500" />
                        <select 
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value)}
                            className="bg-transparent text-sm text-zinc-300 focus:outline-none cursor-pointer"
                        >
                            <option value="all">All Types</option>
                            <option value="md">Markdown</option>
                            <option value="json">JSON</option>
                            <option value="text">Text</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* List */}
            <div className="space-y-3">
                {filteredArtifacts.map((artifact) => {
                    const isExpanded = expandedRows[artifact.id];
                    const url = typeof window !== 'undefined' ? `${window.location.origin}/c/${artifact.id}` : `https://drive.io/c/${artifact.id}`;
                    
                    return (
                        <div key={artifact.id} className="bg-zinc-900/40 border border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-700 transition-colors">
                            {/* Row Header */}
                            <div 
                                onClick={() => toggleRow(artifact.id)}
                                className="p-4 flex items-center justify-between cursor-pointer group"
                            >
                                <div className="flex items-center gap-4 flex-1 min-w-0">
                                    <div className="p-2 bg-black rounded-lg border border-zinc-800 group-hover:border-zinc-700 transition-colors">
                                        {getIconForType(artifact.metadata?.contentType || '')}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="font-bold text-white text-sm truncate">
                                                {artifact.metadata?.filename || `artifact-${artifact.id.substring(0, 5)}`}
                                            </h3>
                                            {artifact.metadata?.agentName && (
                                                <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 text-[10px] uppercase font-bold tracking-wider hidden sm:inline-block">
                                                    {artifact.metadata.agentName}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-3 text-xs text-zinc-500 font-mono truncate">
                                            <span>{url}</span>
                                            <span className="hidden sm:inline-block">•</span>
                                            <span className="hidden sm:flex items-center gap-1">
                                                <Clock size={10} />
                                                {formatRelativeTime(artifact.timestamp)}
                                            </span>
                                            {artifact.metadata?.sizeBytes && (
                                                <>
                                                    <span className="hidden sm:inline-block">•</span>
                                                    <span className="hidden sm:inline-block">{formatBytes(artifact.metadata.sizeBytes)}</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 pl-4">
                                    <button
                                        onClick={(e) => handleCopy(e, url, artifact.id)}
                                        className="p-1.5 rounded hover:bg-zinc-800 text-zinc-500 hover:text-white transition-colors"
                                        title="Copy URL"
                                    >
                                        {copiedId === artifact.id ? <CheckCircle2 size={16} className="text-green-400" /> : <Copy size={16} />}
                                    </button>
                                    <div className="text-zinc-600 group-hover:text-zinc-400 transition-colors">
                                        {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                                    </div>
                                </div>
                            </div>

                            {/* Expanded Preview */}
                            {isExpanded && (
                                <div className="p-4 border-t border-zinc-800 bg-black/50">
                                    <div className="mb-4 flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-xs text-zinc-500 font-mono">
                                            <span className="px-2 py-1 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded opacity-70 cursor-not-allowed" title="Coming in PRD 2">
                                                Unnamed artifact — add a name
                                            </span>
                                        </div>
                                        <a 
                                            href={url} 
                                            target="_blank" 
                                            rel="noreferrer"
                                            className="flex items-center gap-1.5 text-xs text-purple-400 hover:text-purple-300 transition-colors"
                                        >
                                            <Download size={14} />
                                            View Full File
                                        </a>
                                    </div>
                                    <div className="relative">
                                        <div className="absolute -left-2 top-0 bottom-0 w-1 bg-zinc-800 rounded-full" />
                                        <div className="pl-2">
                                            <pre className="text-xs text-zinc-300 font-mono bg-black p-3 rounded-lg border border-zinc-800 overflow-x-auto whitespace-pre-wrap max-h-64 overflow-y-auto custom-scrollbar">
                                                {artifact.preview || "No preview available."}
                                            </pre>
                                        </div>
                                    </div>
                                    {artifact.metadata?.expiresAt && (
                                        <div className="mt-4 flex items-center gap-2 text-[10px] text-zinc-500 font-mono">
                                            <ShieldAlert size={12} className="text-red-400/50" />
                                            Expires {new Date(artifact.metadata.expiresAt).toLocaleString()}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
