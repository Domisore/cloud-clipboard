"use client";

import { useState, useMemo } from 'react';
import { 
    Search, Filter, Activity, Database, FileText, Code, Cpu, 
    Network, HelpCircle, Shield, Info, ArrowRight, ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Node {
    id: string;
    label: string;
    type: 'code' | 'doc' | 'external';
    group: 'API' | 'UI' | 'Docs' | 'Database' | 'Infrastructure';
    x: number;
    y: number;
    description: string;
    properties: Record<string, string>;
}

interface Edge {
    source: string;
    target: string;
    relationship: string;
}

const INITIAL_NODES: Node[] = [
    { 
        id: "node_1", 
        label: "public/skill.md", 
        type: "doc", 
        group: "Docs", 
        x: 100, 
        y: 100, 
        description: "Standard model execution instructions exposed to client agents.",
        properties: { format: "Markdown", size: "7.2 KB", visibility: "Public" }
    },
    { 
        id: "node_2", 
        label: "skills/drive-io/SKILL.md", 
        type: "doc", 
        group: "Docs", 
        x: 100, 
        y: 200, 
        description: "Workspace-specific model execution context loaded by skill_view.",
        properties: { format: "Markdown", size: "7.3 KB", visibility: "Workspace" }
    },
    { 
        id: "node_3", 
        label: "src/app/webdav/[[...path]]/route.ts", 
        type: "code", 
        group: "API", 
        x: 300, 
        y: 150, 
        description: "WebDAV filesystem protocol adapter, enabling rclone and Graphify mounts.",
        properties: { language: "TypeScript", routes: "OPTIONS, PROPFIND, GET, PUT, MKCOL, DELETE, MOVE", auth: "Bearer/Basic" }
    },
    { 
        id: "node_4", 
        label: "src/app/api/upload/route.ts", 
        type: "code", 
        group: "API", 
        x: 300, 
        y: 270, 
        description: "Presigned URL generator for secure client uploads to Cloudflare R2.",
        properties: { language: "TypeScript", method: "POST", returns: "JSON {url, id, key}" }
    },
    { 
        id: "node_5", 
        label: "src/app/api/complete/route.ts", 
        type: "code", 
        group: "API", 
        x: 300, 
        y: 390, 
        description: "Finalization route saving file metadata and indexing upload in Redis.",
        properties: { language: "TypeScript", method: "POST", logs: "Activity stream" }
    },
    { 
        id: "node_6", 
        label: "ApiKeyDashboard.tsx", 
        type: "code", 
        group: "UI", 
        x: 520, 
        y: 100, 
        description: "Main workspace client panel for managing API keys, webhooks, and registry items.",
        properties: { framework: "React/Next.js", state: "Stateful hooks", style: "Tailwind v4" }
    },
    { 
        id: "node_7", 
        label: "ArtifactLibrary.tsx", 
        type: "code", 
        group: "UI", 
        x: 520, 
        y: 220, 
        description: "Split-pane layout presenting sortable, paginated registry documents.",
        properties: { framework: "React/Next.js", components: "List-Detail Split", search: "Full-text client" }
    },
    { 
        id: "node_8", 
        label: "src/lib/redis.ts", 
        type: "code", 
        group: "Database", 
        x: 120, 
        y: 390, 
        description: "Database connector for Upstash Redis serverless client.",
        properties: { library: "@upstash/redis", scope: "User history, key metadata" }
    },
    { 
        id: "node_9", 
        label: "src/lib/r2.ts", 
        type: "code", 
        group: "Database", 
        x: 120, 
        y: 290, 
        description: "S3-compatible client connector for Cloudflare R2 bucket storage.",
        properties: { library: "@aws-sdk/client-s3", scope: "Raw binary persistence" }
    },
    { 
        id: "node_10", 
        label: "Upstash Redis KV", 
        type: "external", 
        group: "Infrastructure", 
        x: 80, 
        y: 500, 
        description: "Remote key-value server storing metadata, active keys, and session contexts.",
        properties: { provider: "Upstash serverless", protocol: "RESP/REST" }
    },
    { 
        id: "node_11", 
        label: "Cloudflare R2 Bucket", 
        type: "external", 
        group: "Infrastructure", 
        x: 200, 
        y: 500, 
        description: "Object storage bucket storing uploaded raw file streams securely.",
        properties: { provider: "Cloudflare", protocol: "S3 compatible" }
    },
    { 
        id: "node_12", 
        label: "Clerk Authentication", 
        type: "external", 
        group: "Infrastructure", 
        x: 520, 
        y: 350, 
        description: "Identity provider managing browser session cookies and keys.",
        properties: { provider: "Clerk.com", integration: "Middleware Auth" }
    }
];

const INITIAL_EDGES: Edge[] = [
    { source: "node_3", target: "node_8", relationship: "queries" },
    { source: "node_3", target: "node_9", relationship: "uploads/streams" },
    { source: "node_4", target: "node_8", relationship: "checks keys" },
    { source: "node_4", target: "node_9", relationship: "provisions" },
    { source: "node_5", target: "node_8", relationship: "indexes metadata" },
    { source: "node_5", target: "node_9", relationship: "validates" },
    { source: "node_6", target: "node_7", relationship: "imports" },
    { source: "node_8", target: "node_10", relationship: "syncs" },
    { source: "node_9", target: "node_11", relationship: "persists" },
    { source: "node_6", target: "node_12", relationship: "secures" },
    { source: "node_6", target: "node_3", relationship: "manages through" },
    { source: "node_7", target: "node_5", relationship: "finalizes via" }
];

export function KnowledgeGraphView() {
    const [searchQuery, setSearchQuery] = useState("");
    const [typeFilter, setTypeFilter] = useState("all");
    const [selectedNodeId, setSelectedNodeId] = useState<string | null>("node_3");
    const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

    // Filter nodes
    const filteredNodes = useMemo(() => {
        return INITIAL_NODES.filter(node => {
            const matchesSearch = searchQuery === "" || 
                node.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
                node.group.toLowerCase().includes(searchQuery.toLowerCase());
            
            const matchesType = typeFilter === "all" || node.type === typeFilter;
            return matchesSearch && matchesType;
        });
    }, [searchQuery, typeFilter]);

    // Selected node metadata
    const selectedNode = useMemo(() => {
        return INITIAL_NODES.find(n => n.id === selectedNodeId) || null;
    }, [selectedNodeId]);

    // Incoming & Outgoing Edges for Selection
    const nodeRelationships = useMemo(() => {
        if (!selectedNodeId) return { incoming: [], outgoing: [] };
        
        const incoming = INITIAL_EDGES
            .filter(e => e.target === selectedNodeId)
            .map(e => ({
                node: INITIAL_NODES.find(n => n.id === e.source),
                relationship: e.relationship
            })).filter(item => item.node);

        const outgoing = INITIAL_EDGES
            .filter(e => e.source === selectedNodeId)
            .map(e => ({
                node: INITIAL_NODES.find(n => n.id === e.target),
                relationship: e.relationship
            })).filter(item => item.node);

        return { incoming, outgoing };
    }, [selectedNodeId]);

    const getIconForType = (type: string) => {
        if (type === 'code') return <Code size={16} className="text-blue-500" />;
        if (type === 'doc') return <FileText size={16} className="text-amber-500" />;
        return <Cpu size={16} className="text-purple-500" />;
    };

    const getHexColorForGroup = (group: string) => {
        if (group === 'API') return '#3b82f6'; // Blue
        if (group === 'UI') return '#10b981'; // Green
        if (group === 'Docs') return '#f59e0b'; // Amber
        if (group === 'Database') return '#6366f1'; // Indigo
        return '#a855f7'; // Purple
    };

    return (
        <div className="flex flex-col gap-6">
            
            {/* Header Control Panel */}
            <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                        <Network className="w-6 h-6 text-blue-600 animate-pulse" />
                        Codebase Knowledge Graph
                    </h1>
                    <p className="text-xs text-slate-400 font-semibold mt-0.5">Interactive code structural map compiled by Graphify.</p>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    {/* Search */}
                    <div className="relative w-full md:w-64">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input 
                            type="text" 
                            placeholder="Search nodes..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500 transition-all font-semibold"
                        />
                    </div>

                    {/* Filter */}
                    <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.8 text-slate-600 hover:bg-slate-100/50 transition-all">
                        <Filter size={12} className="text-slate-400" />
                        <select 
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value)}
                            className="bg-transparent text-[11px] font-bold text-slate-700 focus:outline-none cursor-pointer pr-1"
                        >
                            <option value="all">All Node Types</option>
                            <option value="code">Source Code</option>
                            <option value="doc">Documentation</option>
                            <option value="external">Infrastructure</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Split Panel */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 min-h-[550px]">
                
                {/* Left Pane: Interactive Graph Canvas (Col span 3.5) */}
                <div className="lg:col-span-3 border border-slate-200 rounded-2xl bg-slate-900 shadow-xs relative overflow-hidden flex flex-col justify-between p-4 min-h-[500px]">
                    
                    {/* Canvas Info Badge */}
                    <div className="absolute top-4 left-4 bg-slate-950/80 border border-slate-800 backdrop-blur-md rounded-xl p-2.5 z-10 flex items-center gap-2 max-w-xs shadow-md">
                        <Info size={14} className="text-blue-400 shrink-0" />
                        <span className="text-[10px] text-slate-400 font-semibold leading-relaxed">
                            Click nodes to inspect relationships and preview abstracts. Hover to highlight connections.
                        </span>
                    </div>

                    {/* Legend */}
                    <div className="absolute bottom-4 left-4 bg-slate-950/80 border border-slate-800 backdrop-blur-md rounded-xl p-2.5 z-10 flex flex-wrap gap-x-3 gap-y-1.5 max-w-sm shadow-md">
                        <div className="flex items-center gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">API</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">UI</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Docs</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">DB</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Infra</span>
                        </div>
                    </div>

                    {/* SVG Graphic Canvas */}
                    <div className="flex-1 w-full h-full flex items-center justify-center relative select-none">
                        <svg className="w-full h-full min-h-[420px]" viewBox="0 0 620 540">
                            <defs>
                                <marker id="arrow" viewBox="0 0 10 10" refX="18" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                                    <path d="M 0 0 L 10 5 L 0 10 z" fill="#475569" />
                                </marker>
                                <marker id="arrow-active" viewBox="0 0 10 10" refX="18" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                                    <path d="M 0 0 L 10 5 L 0 10 z" fill="#3b82f6" />
                                </marker>
                            </defs>

                            {/* Draw Edges */}
                            {INITIAL_EDGES.map((edge, idx) => {
                                const sourceNode = INITIAL_NODES.find(n => n.id === edge.source);
                                const targetNode = INITIAL_NODES.find(n => n.id === edge.target);

                                if (!sourceNode || !targetNode) return null;

                                const isLinkedToSelected = selectedNodeId === edge.source || selectedNodeId === edge.target;
                                const isLinkedToHovered = hoveredNodeId === edge.source || hoveredNodeId === edge.target;
                                const isActive = isLinkedToSelected || isLinkedToHovered;

                                return (
                                    <g key={idx}>
                                        <line 
                                            x1={sourceNode.x} 
                                            y1={sourceNode.y} 
                                            x2={targetNode.x} 
                                            y2={targetNode.y} 
                                            stroke={isActive ? "#3b82f6" : "#334155"} 
                                            strokeWidth={isActive ? 2 : 1}
                                            strokeDasharray={isActive ? "none" : "3,3"}
                                            markerEnd={isActive ? "url(#arrow-active)" : "url(#arrow)"}
                                            className="transition-all duration-300"
                                        />
                                        {/* Optional relationship text on hover */}
                                        {isLinkedToHovered && (
                                            <text 
                                                x={(sourceNode.x + targetNode.x) / 2} 
                                                y={(sourceNode.y + targetNode.y) / 2 - 6}
                                                fill="#60a5fa"
                                                fontSize="9"
                                                fontFamily="monospace"
                                                fontWeight="bold"
                                                textAnchor="middle"
                                            >
                                                {edge.relationship}
                                            </text>
                                        )}
                                    </g>
                                );
                            })}

                            {/* Draw Nodes */}
                            {filteredNodes.map((node) => {
                                const isSelected = selectedNodeId === node.id;
                                const isHovered = hoveredNodeId === node.id;
                                const isMatchedInSearch = searchQuery !== "" && node.label.toLowerCase().includes(searchQuery.toLowerCase());
                                const groupColor = getHexColorForGroup(node.group);

                                return (
                                    <g 
                                        key={node.id} 
                                        transform={`translate(${node.x}, ${node.y})`}
                                        className="cursor-pointer"
                                        onClick={() => setSelectedNodeId(node.id)}
                                        onMouseEnter={() => setHoveredNodeId(node.id)}
                                        onMouseLeave={() => setHoveredNodeId(null)}
                                    >
                                        {/* Outer selection ring */}
                                        <circle 
                                            r={16} 
                                            fill="transparent" 
                                            stroke={isSelected ? "#3b82f6" : isHovered ? "#60a5fa" : "transparent"} 
                                            strokeWidth={2}
                                            className="transition-all duration-200"
                                        />

                                        {/* Core circle */}
                                        <circle 
                                            r={10} 
                                            fill={groupColor}
                                            className={`transition-transform duration-200 ${
                                                isHovered || isSelected ? 'scale-125' : ''
                                            } ${isMatchedInSearch ? 'animate-ping opacity-75' : ''}`}
                                        />

                                        {/* Text label */}
                                        <text 
                                            y={-22} 
                                            textAnchor="middle"
                                            fill={isSelected ? "#ffffff" : isHovered ? "#93c5fd" : "#94a3b8"}
                                            fontSize="10"
                                            fontWeight={isSelected || isHovered ? "bold" : "normal"}
                                            fontFamily="monospace"
                                            className="transition-colors duration-200 bg-slate-950 px-1"
                                        >
                                            {node.label.split('/').pop()}
                                        </text>
                                    </g>
                                );
                            })}
                        </svg>
                    </div>
                </div>

                {/* Right Pane: Node Details / Split Info (Col span 2) */}
                <div className="lg:col-span-2 border border-slate-200 rounded-2xl bg-white shadow-xs p-5 flex flex-col justify-between overflow-hidden">
                    <AnimatePresence mode="wait">
                        {selectedNode ? (
                            <motion.div 
                                key={selectedNode.id}
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                className="flex-1 flex flex-col justify-between gap-6"
                            >
                                {/* Node Header Info */}
                                <div className="border-b border-slate-100 pb-4">
                                    <div className="flex items-center gap-2">
                                        <div className="p-1.5 bg-slate-50 border border-slate-100 rounded-lg">
                                            {getIconForType(selectedNode.type)}
                                        </div>
                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 uppercase tracking-wide">
                                            {selectedNode.group}
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-black text-slate-900 mt-2 font-mono truncate">{selectedNode.label}</h3>
                                    <p className="text-slate-400 text-xs mt-1.5 font-semibold leading-relaxed">
                                        {selectedNode.description}
                                    </p>
                                </div>

                                {/* Properties Grid */}
                                <div>
                                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Properties</h4>
                                    <div className="grid grid-cols-1 gap-2.5">
                                        {Object.entries(selectedNode.properties).map(([key, val]) => (
                                            <div key={key} className="flex justify-between items-center text-xs border-b border-slate-50 pb-1.5">
                                                <span className="text-slate-400 font-mono capitalize">{key.replace('_', ' ')}</span>
                                                <span className="text-slate-700 font-bold max-w-[180px] truncate">{val}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Traversal Links (Incoming / Outgoing) */}
                                <div>
                                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Graph Relationships</h4>
                                    <div className="flex flex-col gap-2 max-h-36 overflow-y-auto pr-1">
                                        {nodeRelationships.incoming.map((rel: any, idx) => (
                                            <div 
                                                key={`in-${idx}`}
                                                onClick={() => setSelectedNodeId(rel.node.id)}
                                                className="flex items-center justify-between p-2 rounded-lg bg-slate-50 hover:bg-blue-50 border border-slate-100 hover:border-blue-200/50 cursor-pointer transition-all"
                                            >
                                                <span className="text-[10px] font-mono text-slate-400 truncate max-w-[120px]">{rel.node.label.split('/').pop()}</span>
                                                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 border border-blue-100 flex items-center gap-1">
                                                    {rel.relationship} <ArrowRight size={10} />
                                                </span>
                                            </div>
                                        ))}

                                        {nodeRelationships.outgoing.map((rel: any, idx) => (
                                            <div 
                                                key={`out-${idx}`}
                                                onClick={() => setSelectedNodeId(rel.node.id)}
                                                className="flex items-center justify-between p-2 rounded-lg bg-slate-50 hover:bg-blue-50 border border-slate-100 hover:border-blue-200/50 cursor-pointer transition-all"
                                            >
                                                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center gap-1">
                                                    <ArrowRight size={10} /> {rel.relationship}
                                                </span>
                                                <span className="text-[10px] font-mono text-slate-400 truncate max-w-[120px]">{rel.node.label.split('/').pop()}</span>
                                            </div>
                                        ))}

                                        {nodeRelationships.incoming.length === 0 && nodeRelationships.outgoing.length === 0 && (
                                            <span className="text-slate-400 text-xs font-semibold">Orphan node (no connections).</span>
                                        )}
                                    </div>
                                </div>

                                {/* Traversal/Query actions */}
                                <div className="border-t border-slate-100 pt-4 flex items-center justify-between mt-auto">
                                    <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-1.5">
                                        <Shield size={12} className="text-emerald-500" /> Standard Node Access Allowed
                                    </span>
                                    <button 
                                        onClick={() => alert(`Node pointer: drive://graph/acme/nodes/${selectedNode.id}`)}
                                        className="flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:underline"
                                    >
                                        <span>Copy Graph Pointer</span>
                                        <ExternalLink size={12} />
                                    </button>
                                </div>

                            </motion.div>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-400 gap-3">
                                <Network size={44} className="text-slate-200 animate-pulse" />
                                <h4 className="font-bold text-slate-700">No Node Selected</h4>
                                <p className="text-xs text-slate-400 font-semibold max-w-xs leading-relaxed">
                                    Choose any node from the interactive canvas web diagram to view its details, static AST properties, and direct relationship channels.
                                </p>
                            </div>
                        )}
                    </AnimatePresence>
                </div>

            </div>
        </div>
    );
}
