"use client";

import { useState, useEffect, useMemo } from 'react';
import { 
    Terminal, Key, Plus, Copy, CheckCircle2, Trash2, Eye, EyeOff, 
    AlertTriangle, RefreshCw, Activity, X, Trash, 
    Layers, Package, BarChart3, Clock, Zap
} from 'lucide-react';
import { Header } from '@/components/ui/Header';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    LineChart, Line, AreaChart, Area, XAxis, YAxis, 
    Tooltip, ResponsiveContainer, CartesianGrid 
} from 'recharts';

interface ApiKey {
    id: string;
    name: string;
    createdAt: number;
    usage: number;
}

interface ActivityEvent {
    id: string;
    type: string;
    timestamp: number;
    agent?: string;
    preview?: string;
    metadata?: any;
}

export function ApiKeyDashboard({ isBypass = false, plan = "free" }: { isBypass?: boolean; plan?: string }) {
    const [activeTab, setActiveTab] = useState<"overview" | "agents" | "activity" | "artifacts">("overview");
    const [keys, setKeys] = useState<ApiKey[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isGenerating, setIsGenerating] = useState(false);
    const [newKeyName, setNewKeyName] = useState("");
    const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);
    const [revealedKeys, setRevealedKeys] = useState<Record<string, boolean>>({});
    const [keyToDelete, setKeyToDelete] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);
    const [allActivities, setAllActivities] = useState<ActivityEvent[]>([]);
    const [isActivityLoading, setIsActivityLoading] = useState(false);
    const router = useRouter();

    const isLocal = typeof window !== 'undefined' && window.location.hostname === 'localhost';

    useEffect(() => {
        fetchKeys();
    }, []);

    const fetchKeys = async () => {
        try {
            const url = isBypass ? '/api/v1/agents/keys?agent_bypass=true' : '/api/v1/agents/keys';
            const res = await fetch(url);
            if (res.ok) {
                const data = await res.json();
                const parsedKeys = data.map((keyString: string) => typeof keyString === 'string' ? JSON.parse(keyString) : keyString);
                setKeys(parsedKeys);
                
                // Fetch activity for all keys to populate global activity
                fetchAllActivities(parsedKeys);
            }
        } catch (error) {
            console.error("Failed to fetch keys", error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchAllActivities = async (agentKeys: ApiKey[]) => {
        setIsActivityLoading(true);
        try {
            const activitiesPromises = agentKeys.map(async (key) => {
                const rawKey = key.id.replace('apikey:', '');
                const url = isBypass 
                    ? `/api/v1/agents/keys/activity?agent_bypass=true&key=${rawKey}` 
                    : `/api/v1/agents/keys/activity?key=${rawKey}`;
                const res = await fetch(url);
                if (res.ok) {
                    const data = await res.json();
                    return data.map((a: any) => ({ ...a, agent: key.name }));
                }
                return [];
            });

            const results = await Promise.all(activitiesPromises);
            const flatActivities = results.flat().sort((a, b) => b.timestamp - a.timestamp);
            setAllActivities(flatActivities);
        } catch (error) {
            console.error("Failed to fetch all activities", error);
        } finally {
            setIsActivityLoading(false);
        }
    };

    const handleGenerateKey = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newKeyName.trim()) return;

        setIsGenerating(true);
        try {
            const url = isBypass ? '/api/v1/agents/keys?agent_bypass=true' : '/api/v1/agents/keys';
            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newKeyName })
            });

            if (res.ok) {
                setNewKeyName("");
                fetchKeys();
            }
        } catch (error) {
            console.error("Failed to generate key", error);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleDeleteKey = async (apiKey: string) => {
        setIsDeleting(true);
        try {
            const baseUrl = isBypass ? '/api/v1/agents/keys?agent_bypass=true&key=' : '/api/v1/agents/keys?key=';
            const res = await fetch(`${baseUrl}${apiKey}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                setKeyToDelete(null);
                fetchKeys();
            }
        } catch (error) {
            console.error("Failed to delete key", error);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleCopy = (key: string, id: string) => {
        navigator.clipboard.writeText(key);
        setCopiedKeyId(id);
        setTimeout(() => setCopiedKeyId(null), 2000);
    };

    const toggleKeyVisibility = (id: string) => {
        setRevealedKeys(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const handleSyncSubscription = async () => {
        setIsSyncing(true);
        try {
            const res = await fetch('/api/user/sync-subscription', { method: 'POST' });
            if (res.ok) {
                router.refresh();
                window.location.reload();
            }
        } catch (error) {
            console.error("Failed to sync subscription", error);
        } finally {
            setIsSyncing(false);
        }
    };

    // Aggregate Stats
    const stats = useMemo(() => {
        const totalRelays = keys.reduce((acc, k) => acc + (k.usage || 0), 0);
        const tokensSaved = totalRelays * 1.2; // Mock calculation
        const activeAgents = keys.length;
        const avgLatency = 32; // Mock

        return { totalRelays, tokensSaved, activeAgents, avgLatency };
    }, [keys]);

    // Chart Data
    const chartData = useMemo(() => {
        // Generate mock time-series data based on activities or just dummy data for visual impact
        return [
            { time: "00:00", relays: 45, savings: 54 },
            { time: "04:00", relays: 32, savings: 38 },
            { time: "08:00", relays: 89, savings: 106 },
            { time: "12:00", relays: 124, savings: 148 },
            { time: "16:00", relays: 98, savings: 117 },
            { time: "20:00", relays: 67, savings: 80 },
            { time: "Now", relays: 82, savings: 98 },
        ];
    }, []);

    return (
        <div className="min-h-screen flex flex-col font-mono bg-[#080808] text-zinc-300 selection:bg-orange-500/30">
            <Header />
            
            <main className="flex-1 w-full max-w-6xl mx-auto pt-32 pb-20 px-6">
                
                {/* Tabs Navigation */}
                <div className="flex border-b border-zinc-800 mb-8 sticky top-[72px] bg-[#080808]/80 backdrop-blur-md z-10">
                    {[
                        { id: 'overview', label: 'Overview', icon: BarChart3 },
                        { id: 'agents', label: 'Agents', icon: Key },
                        { id: 'activity', label: 'Activity', icon: Clock },
                        { id: 'artifacts', label: 'Artifacts', icon: Package }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex items-center gap-2 px-6 py-4 text-[11px] font-bold uppercase tracking-widest transition-all relative ${
                                activeTab === tab.id ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
                            }`}
                        >
                            <tab.icon size={14} />
                            {tab.label}
                            {activeTab === tab.id && (
                                <motion.div 
                                    layoutId="activeTab"
                                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500"
                                />
                            )}
                        </button>
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    {activeTab === 'overview' && (
                        <motion.div 
                            key="overview"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-8"
                        >
                            {/* Stats Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                {[
                                    { label: 'Relays (24h)', value: stats.totalRelays.toLocaleString(), sub: 'vs baseline', color: 'orange' },
                                    { label: 'Tokens Saved', value: `${stats.tokensSaved.toFixed(1)}k`, sub: 'Relay optimization', color: 'emerald' },
                                    { label: 'Active Agents', value: stats.activeAgents, sub: 'Connected fleets', color: 'blue' },
                                    { label: 'Avg Latency', value: `${stats.avgLatency}ms`, sub: 'P50 Response', color: 'purple' }
                                ].map((stat, i) => (
                                    <div key={i} className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl relative overflow-hidden group">
                                        <div className={`absolute top-0 left-0 w-1 h-full bg-${stat.color}-500/50`} />
                                        <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-2">{stat.label}</div>
                                        <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                                        <div className="text-[10px] text-zinc-600 italic">{stat.sub}</div>
                                    </div>
                                ))}
                            </div>

                            {/* Main Chart */}
                            <div className="p-8 bg-zinc-900/30 border border-zinc-800 rounded-2xl">
                                <div className="flex items-center justify-between mb-8">
                                    <div>
                                        <h3 className="text-white font-bold flex items-center gap-2">
                                            <Activity size={18} className="text-orange-500" />
                                            Relay Activity Flow
                                        </h3>
                                        <p className="text-xs text-zinc-500 mt-1">Token savings vs raw processing overhead</p>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-orange-500" />
                                            <span className="text-[10px] text-zinc-400 uppercase font-bold tracking-tighter">Relays</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                            <span className="text-[10px] text-zinc-400 uppercase font-bold tracking-tighter">Savings</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="h-[300px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={chartData}>
                                            <defs>
                                                <linearGradient id="colorRelays" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.1}/>
                                                    <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                                                </linearGradient>
                                                <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                                            <XAxis 
                                                dataKey="time" 
                                                stroke="#4b5563" 
                                                fontSize={10} 
                                                tickLine={false} 
                                                axisLine={false}
                                            />
                                            <YAxis 
                                                stroke="#4b5563" 
                                                fontSize={10} 
                                                tickLine={false} 
                                                axisLine={false}
                                                tickFormatter={(v) => `${v}`}
                                            />
                                            <Tooltip 
                                                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1f2937', borderRadius: '8px' }}
                                                itemStyle={{ fontSize: '12px' }}
                                                labelStyle={{ color: '#9ca3af', marginBottom: '4px' }}
                                            />
                                            <Area type="monotone" dataKey="relays" stroke="#f97316" fillOpacity={1} fill="url(#colorRelays)" strokeWidth={2} />
                                            <Area type="monotone" dataKey="savings" stroke="#10b981" fillOpacity={1} fill="url(#colorSavings)" strokeWidth={2} />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'agents' && (
                        <motion.div 
                            key="agents"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
                        >
                            {/* Left Column: Key Generation */}
                            <div className="lg:col-span-1 space-y-6">
                                <div className="p-8 bg-zinc-900 border border-zinc-800 rounded-2xl">
                                    <h2 className="text-white font-bold mb-6 flex items-center gap-2">
                                        <Plus size={20} className="text-orange-500" />
                                        Provision Agent
                                    </h2>
                                    <form onSubmit={handleGenerateKey} className="space-y-6">
                                        <div>
                                            <label className="block text-[10px] text-zinc-500 uppercase tracking-[0.2em] mb-3">Agent Identifier</label>
                                            <input
                                                type="text"
                                                value={newKeyName}
                                                onChange={(e) => setNewKeyName(e.target.value)}
                                                placeholder="e.g. Ingest-Worker-01"
                                                className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500 transition-colors placeholder:text-zinc-700"
                                                required
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={isGenerating || !newKeyName.trim()}
                                            className="w-full bg-orange-600 hover:bg-orange-500 text-white font-bold py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 shadow-lg shadow-orange-900/20"
                                        >
                                            {isGenerating ? <RefreshCw size={18} className="animate-spin" /> : "Deploy Key"}
                                        </button>
                                    </form>
                                </div>

                                <div className="p-6 bg-orange-500/5 border border-orange-500/10 rounded-2xl">
                                    <h3 className="text-orange-500 font-bold text-xs uppercase tracking-widest mb-3 flex items-center gap-2">
                                        <Zap size={14} />
                                        Quick Start
                                    </h3>
                                    <p className="text-[11px] text-zinc-500 leading-relaxed">
                                        Use your keys to authenticate headless agents. All handoffs are relayed through the L0 edge for O(1) retrieval.
                                    </p>
                                </div>
                            </div>

                            {/* Right Column: Key List */}
                            <div className="lg:col-span-2 space-y-4">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                        <Layers size={22} className="text-zinc-600" />
                                        Agent Clusters
                                    </h2>
                                    <span className="text-[10px] text-zinc-500 font-bold uppercase">{keys.length} Keys Active</span>
                                </div>

                                {isLoading ? (
                                    <div className="p-12 border border-dashed border-zinc-800 rounded-2xl text-center text-zinc-500 flex flex-col items-center gap-4">
                                        <RefreshCw size={32} className="animate-spin text-zinc-700" />
                                        <span className="text-sm font-bold uppercase tracking-widest">Scanning Registry...</span>
                                    </div>
                                ) : keys.length === 0 ? (
                                    <div className="p-16 border border-dashed border-zinc-800 rounded-2xl text-center flex flex-col items-center">
                                        <Terminal size={48} className="text-zinc-800 mb-6" />
                                        <h3 className="text-zinc-400 font-bold mb-2">No agents found in this cluster</h3>
                                        <p className="text-xs text-zinc-600 max-w-xs">Provision a new key on the left to start relaying agentic artifacts.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {keys.map((key) => {
                                            const rawKey = key.id.replace('apikey:', '');
                                            const isRevealed = revealedKeys[key.id];
                                            const maskedKey = `do_${'*'.repeat(24)}`;
                                            
                                            return (
                                                <motion.div 
                                                    layout
                                                    key={key.id} 
                                                    className="p-6 bg-zinc-900/40 border border-zinc-800/60 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-6 group hover:border-orange-500/30 hover:bg-zinc-900/60 transition-all"
                                                >
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-3 mb-3">
                                                            <h3 className="text-white font-bold truncate">{key.name}</h3>
                                                            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                                                <span className="text-[9px] text-emerald-500 uppercase font-black tracking-tighter">Connected</span>
                                                            </div>
                                                        </div>
                                                        
                                                        <div className="flex items-center gap-2 bg-black/40 border border-zinc-800 rounded-lg p-1.5 pl-4 max-w-md">
                                                            <code className="text-zinc-300 text-[10px] font-mono truncate">
                                                                {isRevealed ? rawKey : maskedKey}
                                                            </code>
                                                            <div className="flex items-center border-l border-zinc-800 ml-auto pl-2">
                                                                <button 
                                                                    onClick={() => toggleKeyVisibility(key.id)}
                                                                    className="p-2 hover:bg-zinc-800 rounded-md text-zinc-500 hover:text-white transition-colors"
                                                                >
                                                                    {isRevealed ? <EyeOff size={14} /> : <Eye size={14} />}
                                                                </button>
                                                                <button
                                                                    onClick={() => handleCopy(rawKey, key.id)}
                                                                    className="p-2 hover:bg-zinc-800 rounded-md text-zinc-500 hover:text-white transition-colors"
                                                                >
                                                                    {copiedKeyId === key.id ? <CheckCircle2 size={14} className="text-emerald-400" /> : <Copy size={14} />}
                                                                </button>
                                                            </div>
                                                        </div>
                                                        
                                                        <div className="flex items-center gap-4 mt-4">
                                                            <div className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">
                                                                Joined {new Date(key.createdAt).toLocaleDateString()}
                                                            </div>
                                                            <div className="w-1 h-1 rounded-full bg-zinc-800" />
                                                            <div className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">
                                                                Relay ID: {key.id.substring(0, 8)}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-8 self-start sm:self-center border-l border-zinc-800/50 pl-8">
                                                        <div className="text-right">
                                                            <div className="text-2xl font-black text-white leading-none">{key.usage || 0}</div>
                                                            <div className="text-[9px] text-zinc-500 font-bold uppercase tracking-[0.2em] mt-1">Relays</div>
                                                        </div>
                                                        <button 
                                                            onClick={() => setKeyToDelete(rawKey)}
                                                            className="p-3 text-zinc-700 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                                                        >
                                                            <Trash2 size={20} />
                                                        </button>
                                                    </div>
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'activity' && (
                        <motion.div 
                            key="activity"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-6"
                        >
                            <div className="flex items-center justify-between mb-2">
                                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                    <Clock size={22} className="text-zinc-600" />
                                    Relay Event Log
                                </h2>
                                <div className="flex items-center gap-4">
                                    <span className="text-[10px] text-zinc-500 font-bold uppercase">Syncing real-time</span>
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                                </div>
                            </div>

                            <div className="bg-zinc-900/30 border border-zinc-800 rounded-2xl overflow-hidden">
                                {isActivityLoading && allActivities.length === 0 ? (
                                    <div className="p-20 text-center flex flex-col items-center gap-4">
                                        <RefreshCw size={32} className="animate-spin text-orange-500" />
                                        <span className="text-sm font-bold text-zinc-500 uppercase tracking-widest">Retrieving Logs...</span>
                                    </div>
                                ) : allActivities.length === 0 ? (
                                    <div className="p-20 text-center flex flex-col items-center gap-4">
                                        <Terminal size={48} className="text-zinc-800" />
                                        <span className="text-sm font-bold text-zinc-500">No events recorded in the last 24h</span>
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="border-b border-zinc-800 bg-black/20">
                                                    <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Timestamp</th>
                                                    <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Agent</th>
                                                    <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Type</th>
                                                    <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Artifact Preview</th>
                                                    <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">ID</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {allActivities.map((event, idx) => (
                                                    <tr key={idx} className="border-b border-zinc-800/50 hover:bg-zinc-800/20 transition-colors group">
                                                        <td className="px-6 py-4 text-[11px] text-zinc-500 font-mono">
                                                            {new Date(event.timestamp).toLocaleTimeString()}
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <span className="text-[11px] font-bold text-white">{event.agent || 'Unknown'}</span>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <span className={`text-[9px] font-black uppercase tracking-tighter px-2 py-0.5 rounded border ${
                                                                event.type === 'CLIP_CREATED' ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' :
                                                                event.type === 'HANDOFF_CREATED' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                                                'bg-zinc-500/10 text-zinc-400 border-zinc-500/20'
                                                            }`}>
                                                                {event.type.replace('_', ' ')}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 max-w-xs">
                                                            <p className="text-[11px] text-zinc-400 truncate italic">
                                                                {event.preview ? `"${event.preview}"` : "—"}
                                                            </p>
                                                        </td>
                                                        <td className="px-6 py-4 text-[10px] font-mono text-zinc-700">
                                                            {event.id.substring(0, 12)}...
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'artifacts' && (
                        <motion.div 
                            key="artifacts"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.02 }}
                            className="space-y-6"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                    <Package size={22} className="text-zinc-600" />
                                    Artifact Registry
                                </h2>
                                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Storage: Relay L0 Edge</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {allActivities.filter(a => a.type === 'CLIP_CREATED' || a.type === 'HANDOFF_CREATED').map((artifact, i) => (
                                    <div key={i} className="p-6 bg-zinc-900/40 border border-zinc-800 rounded-2xl hover:border-orange-500/20 transition-all group">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="p-3 bg-black rounded-xl border border-zinc-800 group-hover:border-orange-500/30 transition-colors">
                                                <Package size={20} className="text-orange-500" />
                                            </div>
                                            <span className="text-[9px] text-zinc-600 font-mono">{new Date(artifact.timestamp).toLocaleDateString()}</span>
                                        </div>
                                        <h4 className="text-white font-bold mb-2 truncate">Artifact_{artifact.id.substring(0, 6)}</h4>
                                        <p className="text-xs text-zinc-500 mb-6 line-clamp-2 italic leading-relaxed">
                                            {artifact.preview || "No preview available for this artifact."}
                                        </p>
                                        <div className="flex items-center justify-between pt-4 border-t border-zinc-800/50">
                                            <span className="text-[9px] text-zinc-500 uppercase font-black tracking-widest">{artifact.agent}</span>
                                            <button className="text-[10px] text-orange-500 font-bold hover:underline">View Source</button>
                                        </div>
                                    </div>
                                ))}
                                
                                {allActivities.filter(a => a.type === 'CLIP_CREATED' || a.type === 'HANDOFF_CREATED').length === 0 && (
                                    <div className="col-span-full p-20 text-center border border-dashed border-zinc-800 rounded-2xl">
                                        <Package size={48} className="mx-auto text-zinc-800 mb-4" />
                                        <p className="text-zinc-500 font-bold">No artifacts in the registry</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            {/* Modals - Same logic as before but with updated styling */}
            {keyToDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 max-w-md w-full shadow-2xl">
                        <div className="flex items-start gap-4 mb-6">
                            <div className="p-3 bg-red-500/10 text-red-500 rounded-full border border-red-500/20">
                                <AlertTriangle size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white mb-2">Revoke Agent?</h3>
                                <p className="text-sm text-zinc-400 leading-relaxed">
                                    You are about to revoke this agent's access. Any active swarms using this key will immediately lose connectivity to the relay.
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <button
                                onClick={() => setKeyToDelete(null)}
                                className="flex-1 px-4 py-3 rounded-lg font-bold text-zinc-400 hover:text-white bg-zinc-800 transition-colors"
                                disabled={isDeleting}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDeleteKey(keyToDelete)}
                                className="flex-1 px-4 py-3 rounded-lg font-bold text-white bg-red-600 hover:bg-red-500 transition-all flex justify-center items-center"
                                disabled={isDeleting}
                            >
                                {isDeleting ? <RefreshCw size={18} className="animate-spin" /> : "Confirm Revoke"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

