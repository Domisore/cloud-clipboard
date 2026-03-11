"use client";

import { useState, useEffect } from 'react';
import { Terminal, Key, Plus, Copy, CheckCircle2, Trash2, ArrowRight } from 'lucide-react';
import { Header } from '@/components/ui/Header';

interface ApiKey {
    id: string;
    name: string;
    createdAt: number;
    usage: number;
    // Note: The UI only sees the hashed/stored key metadata via the GET endpoint.
    // The raw key is only shown ONCE upon creation.
}

export function ApiKeyDashboard() {
    const [keys, setKeys] = useState<ApiKey[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isGenerating, setIsGenerating] = useState(false);
    const [newKeyName, setNewKeyName] = useState("");
    const [newlyGeneratedKey, setNewlyGeneratedKey] = useState<string | null>(null);
    const [copiedKey, setCopiedKey] = useState(false);

    useEffect(() => {
        fetchKeys();
    }, []);

    const fetchKeys = async () => {
        try {
            const res = await fetch('/api/v1/agents/keys');
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
            const res = await fetch('/api/v1/agents/keys', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newKeyName })
            });

            if (res.ok) {
                const data = await res.json();
                setNewlyGeneratedKey(data.apiKey);
                setNewKeyName("");
                fetchKeys(); // Refresh the list
            }
        } catch (error) {
            console.error("Failed to generate key", error);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleCopy = (key: string) => {
        navigator.clipboard.writeText(key);
        setCopiedKey(true);
        setTimeout(() => setCopiedKey(false), 2000);
    };

    return (
        <div className="min-h-screen flex flex-col font-mono bg-black text-zinc-300 selection:bg-purple-900/50">
            <Header />
            <main className="flex-1 w-full max-w-5xl mx-auto pt-32 pb-20 px-6">

                <div className="mb-12">
                    <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">Developer Dashboard</h1>
                    <p className="text-zinc-500 max-w-2xl">
                        Manage your Agent API keys. These credentials allow headless swarms to push artifacts and
                        establish A2A handoff queues without browser session cookies.
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

                        {newlyGeneratedKey && (
                            <div className="p-6 bg-purple-500/10 border border-purple-500/30 rounded-xl animate-in fade-in slide-in-from-top-4">
                                <h3 className="text-purple-400 font-bold text-sm mb-2 uppercase tracking-wide">Save Your Key</h3>
                                <p className="text-xs text-zinc-400 mb-4">
                                    For security, this key will only be shown once. Please store it safely.
                                </p>
                                <div className="flex items-center gap-2 bg-black border border-zinc-800 rounded p-1 pl-3">
                                    <code className="text-white text-xs truncate flex-1">{newlyGeneratedKey}</code>
                                    <button
                                        onClick={() => handleCopy(newlyGeneratedKey)}
                                        className="p-2 bg-zinc-900 hover:bg-zinc-800 rounded text-zinc-400 hover:text-white transition-colors"
                                    >
                                        {copiedKey ? <CheckCircle2 size={14} className="text-green-400" /> : <Copy size={14} />}
                                    </button>
                                </div>
                            </div>
                        )}
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
                                {keys.map((key) => (
                                    <div key={key.id} className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl flex items-center justify-between group hover:border-zinc-700 transition-colors">
                                        <div>
                                            <div className="flex items-center gap-3 mb-1">
                                                <h3 className="text-white font-bold">{key.name}</h3>
                                                <span className="px-2 py-0.5 rounded bg-green-500/10 text-green-400 text-[10px] uppercase font-bold tracking-wider">Active</span>
                                            </div>
                                            <div className="text-xs text-zinc-500 font-mono">
                                                Created {new Date(key.createdAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-6">
                                            <div className="text-right hidden sm:block">
                                                <div className="text-xl font-bold text-white">{key.usage || 0}</div>
                                                <div className="text-[10px] text-zinc-500 uppercase tracking-widest">Artifacts Relayed</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                </div>
            </main>
        </div>
    );
}
