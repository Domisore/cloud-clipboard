"use client";

import { useState, useEffect } from 'react';
import { Terminal, Key, Plus, Copy, CheckCircle2, Trash2, Eye, EyeOff, AlertTriangle, RefreshCw } from 'lucide-react';
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

    return (
        <div className="min-h-screen flex flex-col font-mono bg-black text-zinc-300 selection:bg-purple-900/50">
            <Header />
            <main className="flex-1 w-full max-w-5xl mx-auto pt-32 pb-20 px-6">

                <div className="mb-12">
                    <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 flex items-center gap-4">
                        Developer Dashboard
                        <span className={`text-xs px-3 py-1 rounded-full border align-middle uppercase tracking-wider font-bold ${
                            plan === 'pro' 
                                ? 'bg-accent/20 text-accent border-accent/50' 
                                : 'bg-zinc-800 text-zinc-500 border-zinc-700'
                        }`}>
                            {plan} Plan
                        </span>
                        {isLocal && (
                            <button 
                                onClick={handleSyncSubscription}
                                disabled={isSyncing}
                                className="p-1.5 bg-zinc-900 border border-zinc-800 rounded-md text-zinc-500 hover:text-white hover:border-zinc-700 transition-all flex items-center gap-2 text-[10px] uppercase font-bold tracking-wider"
                                title="Sync Pro Status manually (Local Only)"
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
                                                <button 
                                                    onClick={() => setKeyToDelete(rawKey)}
                                                    className="p-2 text-zinc-600 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
                                                    title="Delete agent key"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
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
        </div>
    );
}
