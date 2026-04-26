"use client";

import { useState, useEffect } from 'react';
import { Terminal, Key, Plus, Copy, CheckCircle2, Trash2, Eye, EyeOff, AlertTriangle, RefreshCw, Activity, X, Trash } from 'lucide-react';
import { Header } from '@/components/ui/Header';
import { useRouter } from 'next/navigation';

interface ApiKey {
    id: string;
    name: string;
    createdAt: number;
    usage: number;
    // Note: The UI only sees the hashed/stored key metadata via the GET endpoint.
    // The raw key is only shown ONCE upon creation.
}

export function ApiKeyDashboard({ isBypass = false, plan = "free" }: { isBypass?: boolean; plan?: string }) {
    const [keys, setKeys] = useState<ApiKey[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isGenerating, setIsGenerating] = useState(false);
    const [newKeyName, setNewKeyName] = useState("");
    const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);
    const [revealedKeys, setRevealedKeys] = useState<Record<string, boolean>>({});
    const [keyToDelete, setKeyToDelete] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);
    const [viewingActivityKey, setViewingActivityKey] = useState<string | null>(null);
    const [activities, setActivities] = useState<any[]>([]);
    const [isActivityLoading, setIsActivityLoading] = useState(false);
    const router = useRouter();

    const isLocal = typeof window !== 'undefined' && window.location.hostname === 'localhost';
    
    useEffect(() => {
        fetchKeys();
    }, []);

    const handleSyncSubscription = async () => {
        setIsSyncing(true);
        try {
            const res = await fetch('/api/user/sync-subscription', { method: 'POST' });
            if (res.ok) {
                // Refresh the page to get latest metadata from server
                router.refresh();
                // Or just a window reload for absolute certainty on localhost
                window.location.reload();
            }
        } catch (error) {
            console.error("Failed to sync subscription", error);
        } finally {
            setIsSyncing(false);
        }
    };

    const fetchKeys = async () => {
        try {
            const url = isBypass ? '/api/v1/agents/keys?agent_bypass=true' : '/api/v1/agents/keys';
            const res = await fetch(url);
            if (res.ok) {
                const data = await res.json();
                setKeys(data.map((keyString: string) => typeof keyString === 'string' ? JSON.parse(keyString) : keyString));
            }
        } catch (error) {
            console.error("Failed to fetch keys", error);
        } finally {
            setIsLoading(false);
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
                fetchKeys(); // Refresh the list
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

    const fetchActivity = async (key: string) => {
        setIsActivityLoading(true);
        setViewingActivityKey(key);
        try {
            const url = isBypass 
                ? `/api/v1/agents/keys/activity?agent_bypass=true&key=${key}` 
                : `/api/v1/agents/keys/activity?key=${key}`;
            const res = await fetch(url);
            if (res.ok) {
                const data = await res.json();
                setActivities(data);
            }
        } catch (error) {
            console.error("Failed to fetch activity", error);
        } finally {
            setIsActivityLoading(false);
        }
    };

    const handleClearActivity = async (key: string) => {
        try {
            const url = isBypass 
                ? `/api/v1/agents/keys/activity?agent_bypass=true&key=${key}` 
                : `/api/v1/agents/keys/activity?key=${key}`;
            const res = await fetch(url, { method: 'DELETE' });
            if (res.ok) {
                setActivities([]);
            }
        } catch (error) {
            console.error("Failed to clear activity", error);
        }
    };

    return (
        <div className="min-h-screen flex flex-col font-mono bg-black text-zinc-300 selection:bg-purple-900/50">
            <Header />
            
            {/* Active Development Banner */}
            <div className="w-full bg-indigo-900/30 border-b border-indigo-500/30 py-4 px-6 relative z-20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-accent/5 via-transparent to-accent/5 animate-pulse"></div>
                <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 relative z-10">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-accent text-background shadow-lg shadow-accent/20">
                            <Activity size={18} />
                        </div>
                        <div className="flex flex-col">
                            <p className="text-sm font-bold text-white">Drive.io is in Active Development</p>
                            <p className="text-xs text-zinc-400">We are currently tailoring the platform for specific enterprise and organization needs.</p>
                        </div>
                    </div>
                    <a 
                        href="mailto:deji@branelogic.com" 
                        className="px-5 py-2 rounded-xl bg-white text-black text-xs font-black transition-all hover:scale-105 active:scale-95 shadow-xl flex items-center gap-2 whitespace-nowrap"
                    >
                        Contact Founder: deji@branelogic.com
                    </a>
                </div>
            </div>

            <main className="flex-1 w-full max-w-5xl mx-auto pt-20 pb-20 px-6">

                <div className="mb-12">
                    <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 flex items-center gap-4">
                        Developer Dashboard
                        <span className={`text-xs px-3 py-1 rounded-full border align-middle uppercase tracking-wider font-bold ${
                            plan === 'pro' 
                                ? 'bg-accent/20 text-accent border-accent/50' 
                                : 'bg-zinc-800 text-zinc-500 border-zinc-700'
                        }`}>
                            {plan === 'pro' ? 'Developer' : 'Free'} Plan
                        </span>
                        {isLocal && (
                            <button 
                                onClick={handleSyncSubscription}
                                disabled={isSyncing}
                                className="p-1.5 bg-zinc-900 border border-zinc-800 rounded-md text-zinc-500 hover:text-white hover:border-zinc-700 transition-all flex items-center gap-2 text-[10px] uppercase font-bold tracking-wider"
                                title="Sync Developer Status manually (Local Only)"
                            >
                                <RefreshCw size={12} className={isSyncing ? "animate-spin" : ""} />
                                {isSyncing ? "Syncing..." : "Sync status"}
                            </button>
                        )}
                        {isBypass && <span className="text-sm bg-red-500/20 text-red-400 px-3 py-1 rounded-full border border-red-500/50">TEST MODE</span>}
                    </h1>
                    <p className="text-zinc-500 max-w-2xl">
                        Manage your Agent API keys. These credentials allow headless swarms to push artifacts and
                        establish A2A handoff queues without browser session cookies.
                        {isBypass && <span className="block mt-2 text-red-400/80">⚠️ You are currently using the agent bypass mode. Keys generated here are mock test keys and do not pollute your real account.</span>}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                        {/* Left Column: Key Generation */}
                    <div className="md:col-span-1 space-y-6">
                        <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-xl">
                            <h2 className="text-white font-bold mb-4 flex items-center gap-2">
                                <Plus size={18} className="text-purple-400" />
                                Create New Key
                            </h2>
                            <form onSubmit={handleGenerateKey} className="space-y-4">
                                <div>
                                    <label className="block text-xs text-zinc-500 uppercase tracking-widest mb-2">Agent/Fleet Name</label>
                                    <input
                                        type="text"
                                        value={newKeyName}
                                        onChange={(e) => setNewKeyName(e.target.value)}
                                        placeholder="e.g. Data-Scraper-Bot"
                                        className="w-full bg-black border border-zinc-800 rounded px-4 py-2 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors"
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={isGenerating || !newKeyName.trim()}
                                    className="w-full bg-white text-black font-bold py-2 rounded hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                                >
                                    {isGenerating ? "Generating..." : "Generate Key"}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Right Column: Key List */}
                    <div className="md:col-span-2 space-y-4">
                        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <Key size={20} className="text-zinc-500" />
                            Active Agent Keys
                        </h2>

                        {isLoading ? (
                            <div className="p-8 border border-dashed border-zinc-800 rounded-xl text-center text-zinc-500">
                                Loading configurations...
                            </div>
                        ) : keys.length === 0 ? (
                            <div className="p-12 border border-dashed border-zinc-800 rounded-xl text-center flex flex-col items-center">
                                <Terminal size={32} className="text-zinc-700 mb-4" />
                                <h3 className="text-zinc-400 font-bold mb-2">No active agents</h3>
                                <p className="text-sm text-zinc-600">Create an API key on the left to equip your first agent swarm.</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {keys.map((key) => {
                                    const rawKey = key.id.replace('apikey:', '');
                                    const isRevealed = revealedKeys[key.id];
                                    const maskedKey = `do_${'*'.repeat(24)}`;
                                    
                                    return (
                                        <div key={key.id} className="p-5 bg-zinc-900/50 border border-zinc-800 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 group hover:border-zinc-700 transition-colors">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="text-white font-bold">{key.name}</h3>
                                                    <span className="px-2 py-0.5 rounded bg-green-500/10 text-green-400 text-[10px] uppercase font-bold tracking-wider">Active</span>
                                                </div>
                                                
                                                <div className="flex items-center gap-2 bg-black/50 border border-zinc-800 rounded inline-flex p-1 pl-3">
                                                    <code className="text-white text-xs font-mono">
                                                        {isRevealed ? rawKey : maskedKey}
                                                    </code>
                                                    <div className="flex items-center border-l border-zinc-800 ml-2 pl-1">
                                                        <button 
                                                            onClick={() => toggleKeyVisibility(key.id)}
                                                            className="p-1.5 hover:bg-zinc-800 rounded text-zinc-500 hover:text-zinc-300 transition-colors"
                                                            title={isRevealed ? "Hide key" : "Reveal key"}
                                                        >
                                                            {isRevealed ? <EyeOff size={14} /> : <Eye size={14} />}
                                                        </button>
                                                        <button
                                                            onClick={() => handleCopy(rawKey, key.id)}
                                                            className="p-1.5 hover:bg-zinc-800 rounded text-zinc-500 hover:text-white transition-colors"
                                                            title="Copy key"
                                                        >
                                                            {copiedKeyId === key.id ? <CheckCircle2 size={14} className="text-green-400" /> : <Copy size={14} />}
                                                        </button>
                                                    </div>
                                                </div>
                                                
                                                <div className="text-[10px] text-zinc-600 font-mono mt-2">
                                                    Created {new Date(key.createdAt).toLocaleDateString()}
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-6 self-start sm:self-center">
                                                <div className="text-right">
                                                    <div className="text-xl font-bold text-white">{key.usage || 0}</div>
                                                    <div className="text-[10px] text-zinc-500 uppercase tracking-widest">Relayed</div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => fetchActivity(rawKey)}
                                                        className="px-3 py-1.5 bg-zinc-800/50 border border-zinc-800 text-zinc-400 hover:text-purple-400 hover:bg-purple-500/10 hover:border-purple-500/30 rounded-lg transition-all flex items-center gap-2 group/btn"
                                                        title="View activity log"
                                                    >
                                                        <Activity size={14} className="group-hover/btn:scale-110 transition-transform" />
                                                        <span className="text-[10px] font-bold uppercase tracking-wider">Logs</span>
                                                    </button>
                                                    <button 
                                                        onClick={() => setKeyToDelete(rawKey)}
                                                        className="p-2 text-zinc-600 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
                                                        title="Delete agent key"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Delete Confirmation Modal */}
            {keyToDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 max-w-md w-full shadow-2xl">
                        <div className="flex items-start gap-4 mb-4">
                            <div className="p-3 bg-red-500/10 text-red-400 rounded-full">
                                <AlertTriangle size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white mb-2">Revoke Agent Access?</h3>
                                <p className="text-sm text-zinc-400 leading-relaxed">
                                    You are about to delete this API key. Any autonomous agents currently using this key will immediately lose access to the relay API and their handoff queues will fail.
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => setKeyToDelete(null)}
                                className="flex-1 px-4 py-2 rounded font-bold text-zinc-300 hover:text-white bg-zinc-800 hover:bg-zinc-700 transition-colors"
                                disabled={isDeleting}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDeleteKey(keyToDelete)}
                                className="flex-1 px-4 py-2 rounded font-bold text-white bg-red-600 hover:bg-red-700 transition-colors flex justify-center items-center"
                                disabled={isDeleting}
                            >
                                {isDeleting ? "Deleting..." : "Yes, Revoke Key"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Activity Modal */}
            {viewingActivityKey && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in">
                    <div className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-3xl max-h-[80vh] flex flex-col shadow-2xl overflow-hidden">
                        <div className="p-6 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/30">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-purple-500/10 text-purple-400 rounded-lg">
                                    <Activity size={20} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white">Activity Log</h3>
                                    <p className="text-xs text-zinc-500 font-mono">Key: {viewingActivityKey.substring(0, 8)}...</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                {activities.length > 0 && (
                                    <button
                                        onClick={() => handleClearActivity(viewingActivityKey)}
                                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 text-xs font-bold transition-all border border-red-500/20"
                                    >
                                        <Trash size={12} />
                                        Clear History
                                    </button>
                                )}
                                <button
                                    onClick={() => setViewingActivityKey(null)}
                                    className="p-2 hover:bg-zinc-800 rounded-full text-zinc-500 hover:text-white transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                            {isActivityLoading ? (
                                <div className="flex flex-col items-center justify-center py-20 gap-4">
                                    <RefreshCw size={32} className="text-purple-500 animate-spin" />
                                    <p className="text-zinc-500 animate-pulse">Syncing logs...</p>
                                </div>
                            ) : activities.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-20 bg-zinc-900/20 rounded-xl border border-dashed border-zinc-800">
                                    <Terminal size={40} className="text-zinc-700 mb-4" />
                                    <p className="text-zinc-500 font-bold">No activity detected yet</p>
                                    <p className="text-xs text-zinc-600 mt-1 text-center max-w-xs">Logs will appear here once agents start making requests with this key.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {activities.map((activity, idx) => (
                                        <div key={idx} className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl hover:border-zinc-700 transition-all group">
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="flex items-center gap-3">
                                                    <span className={`text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded border ${
                                                        activity.type === 'CLIP_CREATED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                                                        activity.type === 'HANDOFF_CREATED' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 
                                                        'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                                    }`}>
                                                        {activity.type.replace('_', ' ')}
                                                    </span>
                                                    <span className="text-[10px] text-zinc-600 font-mono">
                                                        {new Date(activity.timestamp).toLocaleString()}
                                                    </span>
                                                </div>
                                                <code className="text-[9px] text-zinc-700 px-1.5 py-0.5 bg-black/30 rounded border border-zinc-800">
                                                    {activity.id}
                                                </code>
                                            </div>
                                            
                                            {activity.preview && (
                                                <div className="relative">
                                                    <div className="absolute -left-1 top-0 bottom-0 w-1 bg-zinc-800 rounded-full group-hover:bg-purple-500/30 transition-colors" />
                                                    <div className="pl-4">
                                                        <p className="text-sm text-zinc-300 font-mono line-clamp-3 bg-black/20 p-2 rounded border border-zinc-900 leading-relaxed italic">
                                                            "{activity.preview}"
                                                        </p>
                                                    </div>
                                                </div>
                                            )}

                                            {activity.metadata && Object.keys(activity.metadata).length > 0 && (
                                                <div className="mt-3 flex flex-wrap gap-2 items-center">
                                                    {Object.entries(activity.metadata).map(([k, v]) => {
                                                        if (k === 'expiresAt') {
                                                            const timeLeft = (v as number) - Date.now();
                                                            if (timeLeft <= 0) return null;
                                                            
                                                            const hours = Math.floor(timeLeft / (1000 * 60 * 60));
                                                            const mins = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
                                                            const days = Math.floor(hours / 24);
                                                            
                                                            let display = "";
                                                            if (days > 0) display = `${days}d ${hours % 24}h`;
                                                            else if (hours > 0) display = `${hours}h ${mins}m`;
                                                            else display = `${mins}m`;

                                                            return (
                                                                <span key={k} className="text-[9px] bg-red-500/10 text-red-400 px-2 py-0.5 rounded flex gap-1 border border-red-500/20 items-center">
                                                                    <RefreshCw size={8} className="animate-spin-slow" />
                                                                    <span className="font-bold uppercase">Expires in: {display}</span>
                                                                </span>
                                                            );
                                                        }

                                                        return (
                                                            <span key={k} className="text-[9px] bg-zinc-800/50 text-zinc-500 px-2 py-0.5 rounded flex gap-1 border border-zinc-800">
                                                                <span className="text-zinc-600 uppercase font-bold">{k}:</span>
                                                                <span className="text-zinc-400">{String(v)}</span>
                                                            </span>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        
                        <div className="p-4 bg-black/40 border-t border-zinc-800 text-center">
                            <p className="text-[10px] text-zinc-600 uppercase tracking-widest font-bold">Showing last 100 interaction events</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
