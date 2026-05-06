"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Terminal, Monitor, Code2, Server, BookOpen } from 'lucide-react';
import { HowItWorks } from '@/components/ui/HowItWorks';
import { TokenBenchmark } from '@/components/ui/TokenBenchmark';
import { InstallationGuide } from '@/components/ui/InstallationGuide';

export function DeveloperTabs({ skillContent }: { skillContent: string }) {
    const [activeTab, setActiveTab] = useState<'protocol' | 'api' | 'skill'>('protocol');

    return (
        <div className="flex flex-col md:flex-row gap-12">
            {/* Left Sidebar Navigation */}
            <aside className="w-full md:w-64 shrink-0">
                <div className="sticky top-32 space-y-2">
                    <button 
                        onClick={() => setActiveTab('protocol')}
                        className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                            activeTab === 'protocol' 
                            ? 'bg-accent/10 text-accent border border-accent/20' 
                            : 'text-foreground-muted hover:bg-surface hover:text-foreground border border-transparent'
                        }`}
                    >
                        <Server size={18} />
                        Protocol Architecture
                    </button>
                    <button 
                        onClick={() => setActiveTab('api')}
                        className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                            activeTab === 'api' 
                            ? 'bg-accent/10 text-accent border border-accent/20' 
                            : 'text-foreground-muted hover:bg-surface hover:text-foreground border border-transparent'
                        }`}
                    >
                        <Terminal size={18} />
                        API Reference
                    </button>
                    <button 
                        onClick={() => setActiveTab('skill')}
                        className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                            activeTab === 'skill' 
                            ? 'bg-accent/10 text-accent border border-accent/20' 
                            : 'text-foreground-muted hover:bg-surface hover:text-foreground border border-transparent'
                        }`}
                    >
                        <BookOpen size={18} />
                        SKILL.md Definition
                    </button>
                    
                    <div className="mt-8 pt-8 border-t border-border-color">
                        <Link href="/dashboard" className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white text-black font-bold rounded-xl hover:bg-zinc-200 transition-colors text-sm">
                            <Code2 size={16} />
                            Get API Key
                        </Link>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 min-w-0">
                {activeTab === 'protocol' && (
                    <div className="space-y-24 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* Differentiation Callout Section */}
                        <div className="w-full py-16 px-6 rounded-3xl bg-surface/20 border border-border-color/30 backdrop-blur-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl -z-10 group-hover:bg-accent/10 transition-colors"></div>
                        
                        <div className="flex flex-col xl:flex-row gap-12 items-center">
                            <div className="flex-1 space-y-6">
                            <h2 className="text-3xl font-bold text-foreground leading-tight">
                                Not a memory layer. <br />A <span className="text-accent">persistent hard drive.</span>
                            </h2>
                            <p className="text-foreground-muted text-base leading-relaxed">
                                A new category of agent infrastructure tooling is emerging to solve the context problem. It's worth being precise about what each layer does:
                            </p>
                            
                            <div className="overflow-x-auto rounded-xl border border-border-color/50 bg-black/20">
                                <table className="w-full text-left text-sm whitespace-nowrap min-w-[500px]">
                                <thead>
                                    <tr className="bg-white/5 border-b border-border-color/50">
                                    <th className="px-4 py-3 font-bold text-foreground-muted uppercase tracking-widest text-[10px]">Layer</th>
                                    <th className="px-4 py-3 font-bold text-foreground-muted uppercase tracking-widest text-[10px]">What it solves</th>
                                    <th className="px-4 py-3 font-bold text-foreground-muted uppercase tracking-widest text-[10px]">Examples</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border-color/20">
                                    <tr>
                                    <td className="px-4 py-4 font-bold text-foreground">Memory</td>
                                    <td className="px-4 py-4 text-foreground-muted text-xs whitespace-normal">Agents forget past sessions and user context</td>
                                    <td className="px-4 py-4 text-foreground-muted text-xs">Mem0, Zep</td>
                                    </tr>
                                    <tr className="bg-accent/5">
                                    <td className="px-4 py-4 font-bold text-accent">Hard Drive</td>
                                    <td className="px-4 py-4 text-accent/90 text-xs font-semibold whitespace-normal">Passing large files mid-run blows up token budgets</td>
                                    <td className="px-4 py-4 text-accent/90 text-xs font-bold">Drive.io</td>
                                    </tr>
                                    <tr>
                                    <td className="px-4 py-4 font-bold text-foreground">Orchestration</td>
                                    <td className="px-4 py-4 text-foreground-muted text-xs whitespace-normal">Coordinating agent tasks and dependencies</td>
                                    <td className="px-4 py-4 text-foreground-muted text-xs">LangGraph, CrewAI</td>
                                    </tr>
                                </tbody>
                                </table>
                            </div>
                            </div>
                            
                            <div className="flex-1 space-y-6">
                            <p className="text-foreground-muted text-sm leading-relaxed">
                                These layers are complementary, not competing. A well-architected pipeline might use <strong>Zep</strong> to retrieve user preferences at the start of a run, <strong>Drive.io</strong> to relay datasets mid-run, and <strong>LangGraph</strong> to coordinate the workflow throughout.
                            </p>
                            <p className="text-foreground-muted text-sm leading-relaxed border-l-2 border-accent pl-4 italic bg-accent/5 py-4 rounded-r-lg">
                                Drive.io's lane is specifically <strong>intra-pipeline persistence</strong>: the moment one agent needs to park something large for another to retrieve later, without either agent's context window paying the price.
                            </p>
                            </div>
                        </div>
                        </div>

                        <section id="how-it-works">
                        <h2 className="text-3xl font-bold mb-8">System Architecture</h2>
                        <HowItWorks />
                        </section>

                        <section id="benchmarks">
                        <h2 className="text-3xl font-bold mb-8">Performance Benchmarks</h2>
                        <TokenBenchmark />
                        </section>

                        <section id="integration">
                            <div className="bg-surface/50 border-y border-border-color py-24 my-16 backdrop-blur-sm relative overflow-hidden rounded-3xl">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent to-transparent"></div>
                            <div className="max-w-4xl mx-auto px-6 text-center">
                            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-8 leading-tight">
                                The Cross-Framework Storage Layer
                            </h2>
                            <p className="text-foreground text-lg mb-10 leading-relaxed max-w-2xl mx-auto">
                                Drive.io defines a neutral standard for artifact persistence. Whether your swarm is built on LangGraph, CrewAI, or AutoGen, our protocol ensures that data remains accessible and context windows remain clean.
                            </p>
                            <div className="flex flex-wrap justify-center gap-6 opacity-60">
                                <span className="text-sm font-bold tracking-widest uppercase">LangGraph</span>
                                <span className="text-sm font-bold tracking-widest uppercase">CrewAI</span>
                                <span className="text-sm font-bold tracking-widest uppercase">AutoGen</span>
                                <span className="text-sm font-bold tracking-widest uppercase">Semantic Kernel</span>
                            </div>
                            </div>
                        </div>
                        <h2 className="text-3xl font-bold mb-8">Implementation Guide</h2>
                        <InstallationGuide />
                        </section>
                    </div>
                )}

                {activeTab === 'api' && (
                    <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="prose prose-invert max-w-none">
                            <div>
                                <h3 className="text-xl font-bold mb-4">Authentication & API Keys</h3>
                                <p className="text-foreground-muted mb-4">
                                    Most endpoints on Drive.io can be used unauthenticated (zero-auth) for quick sharing. However, to access cross-agent context or persistent user artifacts, you must authenticate.
                                </p>
                                <div className="bg-surface border border-border-color rounded-lg p-4 mb-4">
                                    <ol className="list-decimal list-inside text-foreground-muted space-y-2">
                                        <li>Navigate to the <Link href="/dashboard" className="text-accent hover:underline">Developer Dashboard</Link>.</li>
                                        <li>Generate a new API Key (format: <code>sk_abc123...</code>).</li>
                                        <li>Send this key in the header of your requests: <code>Authorization: Bearer &lt;your_api_key&gt;</code></li>
                                    </ol>
                                </div>
                            </div>

                            <div className="mt-12">
                                <h3 className="text-xl font-bold mb-4">System Constraints</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="p-4 bg-surface border border-border-color rounded-lg">
                                        <h4 className="font-bold text-foreground mb-1">Rate Limits</h4>
                                        <p className="text-sm text-foreground-muted">No hard programmatic limits, but aggressive polling will trigger IP bans.</p>
                                    </div>
                                    <div className="p-4 bg-surface border border-border-color rounded-lg">
                                        <h4 className="font-bold text-foreground mb-1">Size Limits</h4>
                                        <p className="text-sm text-foreground-muted">Max upload size is <strong>5GB</strong> for binary files via relay, and 100MB for clips.</p>
                                    </div>
                                    <div className="p-4 bg-surface border border-border-color rounded-lg">
                                        <h4 className="font-bold text-foreground mb-1">TTL Duration</h4>
                                        <p className="text-sm text-foreground-muted">All data auto-deletes after <strong>24 hours</strong>, or immediately upon first read if <code>burnAfterReading</code> is set.</p>
                                    </div>
                                </div>
                            </div>

                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 mt-16 pt-8 border-t border-border-color/50">
                                <Terminal className="w-6 h-6 text-accent" />
                                Clips & Artifacts
                            </h2>

                            <p className="text-foreground-muted mb-6">
                                The Clips API allows agents to persist text, code, or data blobs to a permanent URL.
                                This is the primary interface for the <code>drive_skill</code> used by Manus, OpenClaw, and other agentic platforms.
                            </p>

                            {/* Endpoint Card */}
                            <div className="bg-surface border border-border-color rounded-xl overflow-hidden mb-8">
                                <div className="px-6 py-4 border-b border-border-color bg-surface/50 flex flex-wrap items-center justify-between gap-4">
                                    <div className="flex items-center gap-3">
                                        <span className="bg-green-500/10 text-green-500 text-xs font-bold px-2 py-1 rounded">POST</span>
                                        <code className="text-sm font-mono text-foreground">/api/v1/clips</code>
                                    </div>
                                    <span className="text-xs text-foreground-muted">Public Access</span>
                                </div>

                                <div className="p-6">
                                    <h3 className="text-sm font-bold uppercase tracking-wider text-foreground-muted mb-4">Request Body</h3>
                                    <div className="overflow-x-auto mb-6 rounded-lg border border-border-color/50">
                                        <table className="w-full text-left text-sm whitespace-nowrap min-w-[500px]">
                                            <thead>
                                                <tr className="border-b border-border-color bg-black/20">
                                                    <th className="px-4 py-3 font-medium text-foreground">Field</th>
                                                    <th className="px-4 py-3 font-medium text-foreground">Type</th>
                                                    <th className="px-4 py-3 font-medium text-foreground">Description</th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-foreground-muted divide-y divide-border-color/50">
                                                <tr>
                                                    <td className="px-4 py-3 font-mono text-accent">content</td>
                                                    <td className="px-4 py-3">string</td>
                                                    <td className="px-4 py-3 whitespace-normal">The data to save. Can be plain text, code, or JSON string.</td>
                                                </tr>
                                                <tr>
                                                    <td className="px-4 py-3 font-mono text-accent">title</td>
                                                    <td className="px-4 py-3">string</td>
                                                    <td className="px-4 py-3 whitespace-normal">Optional title for the clip.</td>
                                                </tr>
                                                <tr>
                                                    <td className="px-4 py-3 font-mono text-accent">isPrivate</td>
                                                    <td className="px-4 py-3">boolean</td>
                                                    <td className="px-4 py-3 whitespace-normal">If true, the clip is not listed in public feeds (unlisted).</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>

                                    <h3 className="text-sm font-bold uppercase tracking-wider text-foreground-muted mb-4">Example Request</h3>
                                    <div className="bg-black rounded-lg p-4 font-mono text-xs text-zinc-300 overflow-x-auto">
                                        <pre className="min-w-max">
{`curl -X POST https://drive.io/api/v1/clips \\
  -H "Content-Type: application/json" \\
  -d '{"content": "System status: OK", "title": "Health Check", "isPrivate": true}'`}
                                        </pre>
                                    </div>
                                </div>
                            </div>

                            {/* Response Card */}
                            <div className="bg-surface border border-border-color rounded-xl overflow-hidden">
                                <div className="px-6 py-4 border-b border-border-color bg-surface/50">
                                    <h3 className="text-sm font-bold text-foreground">Response</h3>
                                </div>
                                <div className="p-6 overflow-x-auto">
                                    <div className="bg-black rounded-lg p-4 font-mono text-xs text-green-400 min-w-max">
                                        <pre>
{`{
  "success": true,
  "data": {
    "id": "k8j29s",
    "url": "https://drive.io/c/k8j29s",
    "expiresAt": "2026-03-10T15:00:00Z"
  }
}`}
                                        </pre>
                                    </div>
                                </div>
                            </div>

                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 mt-16 pt-8 border-t border-border-color/50">
                                <Monitor className="w-6 h-6 text-accent" />
                                Platform Integration
                            </h2>

                            <p className="text-foreground-muted mb-8">
                                Drive.io is fully compatible with the <strong>Model Context Protocol (MCP)</strong>. You can connect it to your favorite agentic platforms in seconds.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                                {/* Cursor */}
                                <div className="bg-surface border border-border-color rounded-xl p-6 hover:border-accent/30 transition-colors">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 bg-zinc-800 rounded font-bold text-xs">Cu</div>
                                        <h3 className="font-bold text-white">Cursor</h3>
                                    </div>
                                    <ol className="text-sm text-foreground-muted space-y-3 list-decimal list-inside">
                                        <li>Open <strong>Settings</strong> &gt; <strong>Features</strong> &gt; <strong>MCP</strong>.</li>
                                        <li>Click <strong>+ Add New MCP Server</strong>.</li>
                                        <li>Name: <code>Drive.io</code>, Type: <code>SSE</code>.</li>
                                        <li>URL: <code className="text-accent underline break-all">https://drive.io/api/mcp?apiKey=sk_...</code></li>
                                    </ol>
                                </div>

                                {/* Windsurf */}
                                <div className="bg-surface border border-border-color rounded-xl p-6 hover:border-accent/30 transition-colors">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 bg-zinc-800 rounded font-bold text-xs">Wi</div>
                                        <h3 className="font-bold text-white">Windsurf</h3>
                                    </div>
                                    <p className="text-sm text-foreground-muted mb-4">Configure in your <code>mcp_config.json</code>:</p>
                                    <div className="bg-black rounded-lg p-3 text-[10px] font-mono text-zinc-400 overflow-x-auto">
                                        <pre>{`"drive-io": {
  "type": "sse",
  "url": "https://drive.io/api/mcp?apiKey=sk_..."
}`}</pre>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'skill' && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <h2 className="text-2xl font-bold text-foreground">Standard SKILL.md</h2>
                                <p className="text-foreground-muted mt-2">
                                    Drop this into your OpenClaw or Moltbot agent's `skills/` directory to instantly grant them Drive.io powers.
                                </p>
                            </div>
                            <a
                                href="/skill.md"
                                target="_blank"
                                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-black font-bold rounded-xl hover:bg-zinc-200 transition-colors whitespace-nowrap"
                            >
                                Download Raw
                            </a>
                        </div>
                        <div className="bg-[#0c0c0d] border border-border-color rounded-2xl p-6 overflow-x-auto custom-scrollbar">
                            <pre className="text-sm text-zinc-300 font-mono whitespace-pre-wrap leading-relaxed min-w-[600px]">
                                {skillContent}
                            </pre>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
