"use client";

import { useState, useEffect, useMemo } from 'react';
import { 
    FileText, Code, FileJson, FileType, Search, Filter,
    Clock, Copy, CheckCircle2, ChevronDown, ChevronRight, 
    Download, Activity, ShieldAlert, ArrowUpDown, ChevronLeft, ExternalLink, Calendar, Database
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
    agent?: string; // which agent key generated this
}

interface ArtifactLibraryProps {
    activities: any[];
    isLoading?: boolean;
}

export function ArtifactLibrary({ activities, isLoading = false }: ArtifactLibraryProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [agentFilter, setAgentFilter] = useState("all");
    const [typeFilter, setTypeFilter] = useState("all");
    const [sortBy, setSortBy] = useState("newest");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedArtifactId, setSelectedArtifactId] = useState<string | null>(null);
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const itemsPerPage = 10;

    // Normalize incoming activities
    const artifacts = useMemo<Artifact[]>(() => {
        return activities.filter(a => a.type === 'CLIP_CREATED' || a.type === 'FILE_UPLOADED' || a.type === 'HANDOFF_CREATED');
    }, [activities]);

    // Reset pagination and selection on filter change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, agentFilter, typeFilter, sortBy]);

    // Extract list of unique agents for filtering dropdown
    const uniqueAgents = useMemo(() => {
        const agents = new Set<string>();
        artifacts.forEach(a => {
            if (a.agent) {
                agents.add(a.agent);
            } else if (a.metadata?.agentName) {
                agents.add(a.metadata.agentName);
            }
        });
        return Array.from(agents);
    }, [artifacts]);

    // Map MIME / Content Type to Icons
    const getIconForType = (contentType: string) => {
        if (!contentType) return <FileType size={18} className="text-purple-500" />;
        const mime = contentType.toLowerCase();
        if (mime.includes('json')) return <FileJson size={18} className="text-amber-500" />;
        if (mime.includes('markdown') || mime.includes('md')) return <FileText size={18} className="text-blue-500" />;
        if (mime.includes('text')) return <FileText size={18} className="text-slate-500" />;
        if (mime.includes('javascript') || mime.includes('typescript') || mime.includes('code')) return <Code size={18} className="text-emerald-500" />;
        return <FileType size={18} className="text-indigo-500" />;
    };

    const [now, setNow] = useState<number>(0);

    useEffect(() => {
        setNow(Date.now());
        const interval = setInterval(() => setNow(Date.now()), 15000);
        return () => clearInterval(interval);
    }, []);

    const formatRelativeTime = (timestamp: number) => {
        const currentNow = now || Date.now();
        const diff = Math.floor((currentNow - timestamp) / 1000);
        if (diff < 60) return `${Math.max(0, diff)}s ago`;
        if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
        return `${Math.floor(diff / 86400)}d ago`;
    };

    // Filter, search, and sort logic
    const processedArtifacts = useMemo(() => {
        let filtered = artifacts.filter(a => {
            // Search Match (checks filename, ID, agent name)
            const filename = a.metadata?.filename || a.metadata?.title || 'Unnamed Artifact';
            const matchesSearch = searchQuery === "" || 
                filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
                a.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (a.agent || "").toLowerCase().includes(searchQuery.toLowerCase());

            // Agent Filter Match
            const actualAgentName = a.agent || a.metadata?.agentName || "Unknown";
            const matchesAgent = agentFilter === "all" || actualAgentName === agentFilter;

            // Content Type Filter Match
            const mime = (a.metadata?.contentType || "").toLowerCase();
            const matchesType = typeFilter === "all" ||
                (typeFilter === "md" && (mime.includes("markdown") || mime.includes("md"))) ||
                (typeFilter === "json" && mime.includes("json")) ||
                (typeFilter === "text" && mime.includes("text") && !mime.includes("markdown") && !mime.includes("json")) ||
                (typeFilter === "other" && !mime.includes("json") && !mime.includes("text") && !mime.includes("markdown"));

            return matchesSearch && matchesAgent && matchesType;
        });

        // Sorting
        filtered.sort((a, b) => {
            if (sortBy === "newest") return b.timestamp - a.timestamp;
            if (sortBy === "oldest") return a.timestamp - b.timestamp;
            if (sortBy === "size_large") {
                return (b.metadata?.sizeBytes || 0) - (a.metadata?.sizeBytes || 0);
            }
            if (sortBy === "size_small") {
                return (a.metadata?.sizeBytes || 0) - (b.metadata?.sizeBytes || 0);
            }
            if (sortBy === "name_az") {
                const nameA = a.metadata?.filename || 'Unnamed';
                const nameB = b.metadata?.filename || 'Unnamed';
                return nameA.localeCompare(nameB);
            }
            if (sortBy === "name_za") {
                const nameA = a.metadata?.filename || 'Unnamed';
                const nameB = b.metadata?.filename || 'Unnamed';
                return nameB.localeCompare(nameA);
            }
            return 0;
        });

        return filtered;
    }, [artifacts, searchQuery, agentFilter, typeFilter, sortBy]);

    // Selected artifact details
    const selectedArtifact = useMemo(() => {
        if (!selectedArtifactId) return null;
        return processedArtifacts.find(a => a.id === selectedArtifactId) || null;
    }, [processedArtifacts, selectedArtifactId]);

    // Handle copying file URLs
    const handleCopy = (e: React.MouseEvent, text: string, id: string) => {
        e.stopPropagation();
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    // Download Handler
    const handleDownload = async (artifact: Artifact) => {
        try {
            const res = await fetch(`/api/file/${artifact.id}?download=true`);
            if (res.ok) {
                const blob = await res.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = artifact.metadata?.filename || `${artifact.id}.txt`;
                document.body.appendChild(a);
                a.click();
                a.remove();
                window.URL.revokeObjectURL(url);
            } else {
                alert("Failed to download file. It may have expired.");
            }
        } catch (error) {
            console.error("Error downloading file:", error);
            alert("Error downloading file.");
        }
    };

    // Pagination bounds
    const totalPages = Math.ceil(processedArtifacts.length / itemsPerPage);
    const paginatedArtifacts = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return processedArtifacts.slice(startIndex, startIndex + itemsPerPage);
    }, [processedArtifacts, currentPage]);

    // Auto-select first item if layout is split-pane and nothing is selected
    useEffect(() => {
        if (paginatedArtifacts.length > 0 && !selectedArtifactId) {
            setSelectedArtifactId(paginatedArtifacts[0].id);
        }
    }, [paginatedArtifacts, selectedArtifactId]);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-24 gap-4 border border-dashed border-slate-200 rounded-2xl bg-white shadow-xs">
                <Activity size={36} className="text-blue-600 animate-pulse" />
                <p className="text-slate-400 font-bold uppercase tracking-wider text-xs">Scanning Artifact Registry...</p>
            </div>
        );
    }

    if (artifacts.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-dashed border-slate-200 text-center px-6">
                <div className="h-12 w-12 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center mb-4 shadow-sm">
                    <FileType size={24} className="text-slate-400" />
                </div>
                <h3 className="text-slate-800 font-bold text-lg mb-1">No artifacts index found</h3>
                <p className="text-slate-400 text-sm max-w-sm font-semibold mb-4 leading-relaxed">
                    Trigger your agent tools or upload a file using the CLI/cURL endpoints. ephemerally stored files will sync here.
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6">
            
            {/* Header Control Panel */}
            <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between">
                
                {/* Search */}
                <div className="relative w-full md:w-80">
                    <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                        type="text" 
                        placeholder="Search by filename or ID..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-blue-500 transition-all font-semibold"
                    />
                </div>

                {/* Filters Row */}
                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                    {/* Agent Filter */}
                    <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-600 hover:bg-slate-100/50 transition-all">
                        <Filter size={14} className="text-slate-400" />
                        <select 
                            value={agentFilter}
                            onChange={(e) => setAgentFilter(e.target.value)}
                            className="bg-transparent text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer pr-1"
                        >
                            <option value="all">All Agents</option>
                            {uniqueAgents.map(agent => (
                                <option key={agent} value={agent}>{agent}</option>
                            ))}
                        </select>
                    </div>

                    {/* Content Type Filter */}
                    <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-600 hover:bg-slate-100/50 transition-all">
                        <FileType size={14} className="text-slate-400" />
                        <select 
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value)}
                            className="bg-transparent text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer pr-1"
                        >
                            <option value="all">All Types</option>
                            <option value="md">Markdown</option>
                            <option value="json">JSON</option>
                            <option value="text">Plain Text</option>
                            <option value="other">Binary / Other</option>
                        </select>
                    </div>

                    {/* Sort By */}
                    <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-600 hover:bg-slate-100/50 transition-all">
                        <ArrowUpDown size={14} className="text-slate-400" />
                        <select 
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="bg-transparent text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer pr-1"
                        >
                            <option value="newest">Newest First</option>
                            <option value="oldest">Oldest First</option>
                            <option value="size_large">Largest Size</option>
                            <option value="size_small">Smallest Size</option>
                            <option value="name_az">Name A-Z</option>
                            <option value="name_za">Name Z-A</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Split Pane Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 min-h-[500px]">
                
                {/* Left Pane: List View (Col span 2) */}
                <div className="lg:col-span-2 flex flex-col justify-between border border-slate-200 rounded-2xl bg-white shadow-xs p-4 gap-4">
                    <div className="flex flex-col gap-2 overflow-y-auto max-h-[550px] pr-1">
                        {paginatedArtifacts.length === 0 ? (
                            <div className="py-20 text-center text-slate-400 font-semibold text-xs uppercase tracking-wider">
                                No matching artifacts found
                            </div>
                        ) : (
                            paginatedArtifacts.map((artifact) => {
                                const isSelected = selectedArtifactId === artifact.id;
                                const filename = artifact.metadata?.filename || artifact.metadata?.title || 'Unnamed Artifact';
                                const actualAgentName = artifact.agent || artifact.metadata?.agentName || "Human / Web App";
                                
                                return (
                                    <div 
                                        key={artifact.id}
                                        onClick={() => setSelectedArtifactId(artifact.id)}
                                        className={`p-3.5 rounded-xl cursor-pointer transition-all border flex items-center justify-between gap-3 ${
                                            isSelected 
                                                ? 'bg-blue-50/55 border-blue-200 shadow-xs' 
                                                : 'border-slate-100 hover:border-slate-200 bg-white hover:bg-slate-50/30'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className={`p-2 bg-slate-50 rounded-lg border ${
                                                isSelected ? 'border-blue-200/50 bg-white' : 'border-slate-100'
                                            }`}>
                                                {getIconForType(artifact.metadata?.contentType || '')}
                                            </div>
                                            <div className="min-w-0">
                                                <h4 className="font-bold text-slate-800 text-sm truncate">{filename}</h4>
                                                <div className="flex items-center gap-2 mt-1.5">
                                                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-500 uppercase tracking-wide truncate max-w-[120px]">
                                                        {actualAgentName}
                                                    </span>
                                                    <span className="text-[10px] text-slate-400 font-mono">
                                                        {formatRelativeTime(artifact.timestamp)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <ChevronRight size={16} className={`text-slate-400 transition-transform ${
                                            isSelected ? 'text-blue-500 translate-x-0.5' : ''
                                        }`} />
                                    </div>
                                );
                            })
                        )}
                    </div>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-2">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                disabled={currentPage === 1}
                                className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold text-xs disabled:opacity-50 disabled:pointer-events-none transition-colors"
                            >
                                <ChevronLeft size={14} /> Prev
                            </button>
                            <span className="text-xs font-bold text-slate-500">
                                Page {currentPage} of {totalPages}
                            </span>
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                disabled={currentPage === totalPages}
                                className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold text-xs disabled:opacity-50 disabled:pointer-events-none transition-colors"
                            >
                                Next <ChevronRight size={14} />
                            </button>
                        </div>
                    )}
                </div>

                {/* Right Pane: Detail View (Col span 3) */}
                <div className="lg:col-span-3 border border-slate-200 rounded-2xl bg-white shadow-xs flex flex-col overflow-hidden">
                    {selectedArtifact ? (
                        <div className="flex-1 flex flex-col justify-between p-6 gap-6">
                            
                            {/* Detail Header */}
                            <div className="flex flex-col gap-3 pb-5 border-b border-slate-100">
                                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                                    <div className="min-w-0">
                                        <h3 className="text-xl font-black text-slate-900 tracking-tight leading-snug truncate">
                                            {selectedArtifact.metadata?.filename || selectedArtifact.metadata?.title || 'Unnamed Artifact'}
                                        </h3>
                                        <div className="flex flex-wrap items-center gap-2 mt-2">
                                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-100 text-[10px] font-bold uppercase tracking-wider">
                                                <Database size={10} />
                                                Agent: {selectedArtifact.agent || selectedArtifact.metadata?.agentName || "Human / Web App"}
                                            </span>
                                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200 text-[10px] font-bold">
                                                {selectedArtifact.metadata?.contentType || "application/octet-stream"}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Action row */}
                                    <div className="flex items-center gap-2 shrink-0">
                                        <button
                                            onClick={(e) => handleCopy(e, `${window.location.origin}/c/${selectedArtifact.id}`, selectedArtifact.id)}
                                            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-xs hover:border-slate-300 transition-all shadow-xs"
                                        >
                                            {copiedId === selectedArtifact.id ? (
                                                <>
                                                    <CheckCircle2 size={14} className="text-emerald-600" />
                                                    <span className="text-emerald-700">Copied!</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Copy size={14} />
                                                    <span>Copy Link</span>
                                                </>
                                            )}
                                        </button>
                                        <a 
                                            href={`${window.location.origin}/c/${selectedArtifact.id}`}
                                            target="_blank" 
                                            rel="noreferrer"
                                            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/10 transition-all"
                                        >
                                            <ExternalLink size={14} />
                                            <span>Open</span>
                                        </a>
                                        <button
                                            onClick={() => handleDownload(selectedArtifact)}
                                            className="flex items-center justify-center p-2 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors"
                                            title="Download File"
                                        >
                                            <Download size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Metadata Details Grid */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50/55 border border-slate-100 rounded-2xl">
                                <div>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Artifact ID</span>
                                    <code className="text-xs font-mono font-bold text-slate-700 mt-1 block truncate">{selectedArtifact.id}</code>
                                </div>
                                <div>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">File Size</span>
                                    <span className="text-xs font-bold text-slate-700 mt-1 block truncate">
                                        {selectedArtifact.metadata?.sizeBytes ? formatBytes(selectedArtifact.metadata.sizeBytes) : 'Unknown'}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Uploaded At</span>
                                    <span className="text-xs font-bold text-slate-700 mt-1 block truncate flex items-center gap-1">
                                        <Calendar size={12} className="text-slate-400" />
                                        {new Date(selectedArtifact.timestamp).toLocaleDateString()}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Status</span>
                                    <span className="text-xs font-bold text-slate-700 mt-1 block truncate flex items-center gap-1">
                                        <Clock size={12} className="text-slate-400" />
                                        Active (24h TTL)
                                    </span>
                                </div>
                            </div>

                            {/* Code Preview block */}
                            <div className="flex-1 flex flex-col min-h-0 gap-2">
                                <span className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
                                    <FileText size={14} /> Abstract Preview
                                </span>
                                <div className="flex-1 relative min-h-[160px] bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-inner">
                                    <div className="absolute top-0 left-0 right-0 h-8 bg-slate-950 border-b border-slate-800/80 px-4 flex items-center justify-between">
                                        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">content_preview</span>
                                        <span className="text-[10px] font-mono text-slate-600">UTF-8</span>
                                    </div>
                                    <div className="absolute top-8 bottom-0 left-0 right-0 overflow-y-auto p-4 custom-scrollbar">
                                        <pre className="text-xs text-slate-300 font-mono whitespace-pre-wrap leading-relaxed">
                                            {selectedArtifact.preview || "No content preview generated for this file."}
                                        </pre>
                                    </div>
                                </div>
                            </div>

                            {selectedArtifact.metadata?.expiresAt && (
                                <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-semibold mt-2">
                                    <ShieldAlert size={12} className="text-amber-500" />
                                    <span>This file is ephemeral and auto-destructs on {new Date(selectedArtifact.metadata.expiresAt).toLocaleString()}</span>
                                </div>
                            )}

                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400 gap-3">
                            <FileType size={48} className="text-slate-200 animate-pulse" />
                            <h4 className="font-bold text-slate-700">No Artifact Selected</h4>
                            <p className="text-xs text-slate-400 font-semibold max-w-xs leading-relaxed">
                                Choose an item from the left pane to view its detailed layout, metadata summaries, and direct transfer settings.
                            </p>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
