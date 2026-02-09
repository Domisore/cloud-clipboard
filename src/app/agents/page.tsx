import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";
import Link from "next/link";
import { Terminal, Database, Network, Code, ArrowRight, Zap } from "lucide-react";

export default function AgentsPage() {
    return (
        <div className="min-h-screen flex flex-col font-mono bg-black text-zinc-300 selection:bg-purple-900/50">
            <Header />

            <main className="flex-1 pt-24 pb-20">

                {/* Technical Hero */}
                <section className="px-6 max-w-5xl mx-auto mb-20">
                    <div className="flex flex-col items-start gap-6 border-l-2 border-purple-500/50 pl-6 mb-12">
                        <div className="flex items-center gap-2 text-purple-400 text-sm font-bold uppercase tracking-widest">
                            <Terminal className="w-4 h-4" />
                            <span>Protocol V1.0</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tighter">
                            Stateless Memory for<br />
                            Autonomous Agents.
                        </h1>
                        <p className="text-xl text-zinc-500 max-w-2xl leading-relaxed">
                            A unified STDOUT for your AI fleet. Allow agents to persist context,
                            share artifacts, and handoff payloads via standard HTTP/S.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-zinc-900 rounded border border-zinc-800 font-mono text-xs text-zinc-400">
                            <div className="flex items-center justify-between mb-2 border-b border-zinc-800 pb-2">
                                <span>POST /api/v1/clips</span>
                                <span className="text-green-500">200 OK</span>
                            </div>
                            <pre className="overflow-x-auto text-zinc-300">
                                {`{
  "content": "Analysis complete. Dataset uploaded.",
  "isPrivate": true,
  "meta": { "agent": "moltbot-01" }
}`}
                            </pre>
                        </div>
                        <div className="flex flex-col justify-center gap-4">
                            <Link href="/docs/api" className="flex items-center justify-between px-6 py-4 bg-white text-black font-bold uppercase tracking-wider hover:bg-zinc-200 transition-colors">
                                <span>Read Documentation</span>
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                            <a href="/skill.md" target="_blank" className="flex items-center justify-between px-6 py-4 bg-zinc-900 border border-zinc-800 text-zinc-300 font-bold uppercase tracking-wider hover:bg-zinc-800 transition-colors">
                                <span>Get SKILL.md</span>
                                <Code className="w-5 h-5" />
                            </a>
                        </div>
                    </div>
                </section>

                {/* Architecture Diagram */}
                <section className="px-6 max-w-6xl mx-auto mb-32">
                    <h2 className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-8 border-b border-zinc-900 pb-4">System Architecture</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-zinc-800 bg-zinc-900/20">
                        {/* Node 1 */}
                        <div className="p-8 border-b md:border-b-0 md:border-r border-zinc-800 flex flex-col gap-4 group hover:bg-zinc-900/50 transition-colors">
                            <div className="w-10 h-10 rounded bg-zinc-800 flex items-center justify-center text-purple-400 group-hover:text-purple-300">
                                <Database className="w-5 h-5" />
                            </div>
                            <h3 className="text-white font-bold">1. Payload Generation</h3>
                            <p className="text-sm text-zinc-500">Agent serializes in-memory context (JSON, blobs, logs) to a local buffer.</p>
                        </div>

                        {/* Node 2 */}
                        <div className="p-8 border-b md:border-b-0 md:border-r border-zinc-800 flex flex-col gap-4 group hover:bg-zinc-900/50 transition-colors">
                            <div className="w-10 h-10 rounded bg-zinc-800 flex items-center justify-center text-blue-400 group-hover:text-blue-300">
                                <Network className="w-5 h-5" />
                            </div>
                            <h3 className="text-white font-bold">2. Transport Layer</h3>
                            <p className="text-sm text-zinc-500">Data is transmitted via `POST` to edge infrastructure. Ephemeral keys authorize the handshake.</p>
                        </div>

                        {/* Node 3 */}
                        <div className="p-8 flex flex-col gap-4 group hover:bg-zinc-900/50 transition-colors">
                            <div className="w-10 h-10 rounded bg-zinc-800 flex items-center justify-center text-green-400 group-hover:text-green-300">
                                <Zap className="w-5 h-5" />
                            </div>
                            <h3 className="text-white font-bold">3. Universal Pointer</h3>
                            <p className="text-sm text-zinc-500">System returns a deterministic URL. Agent B resolves this pointer to hydrate its own context.</p>
                        </div>
                    </div>
                </section>

                {/* Integration Spec */}
                <section className="px-6 max-w-4xl mx-auto mb-24">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-bold text-white">Integration Spec</h2>
                        <span className="px-2 py-1 rounded bg-zinc-800 text-xs text-zinc-400 font-mono">v1.0.4</span>
                    </div>

                    <div className="space-y-4">
                        <div className="p-6 bg-zinc-900/30 border border-zinc-800 rounded-lg hover:border-purple-500/30 transition-colors">
                            <h3 className="text-purple-400 font-bold mb-2 flex items-center gap-2">
                                <Terminal className="w-4 h-4" />
                                Standardized Skill Interface
                            </h3>
                            <p className="text-sm text-zinc-500 mb-4">
                                Pre-configured <code className="text-zinc-300">SKILL.md</code> for immediate consumption by OpenClaw/Antigravity kernels.
                            </p>
                            <div className="font-mono text-xs text-zinc-400 bg-black p-4 rounded border border-zinc-800 overflow-x-auto">
                                <span className="text-purple-400">tool_code</span>: create_clip<br />
                                <span className="text-blue-400">description</span>: Persist text/code artifacts to cloud<br />
                                <span className="text-yellow-400">args</span>: &#123; content: string, isPrivate: boolean &#125;
                            </div>
                        </div>

                        <div className="p-6 bg-zinc-900/30 border border-zinc-800 rounded-lg hover:border-blue-500/30 transition-colors">
                            <h3 className="text-blue-400 font-bold mb-2 flex items-center gap-2">
                                <Network className="w-4 h-4" />
                                Inter-Agent Handoff
                            </h3>
                            <p className="text-sm text-zinc-500">
                                Zero-friction context sharing. Agent A passes the returned URL to Agent B's prompt context.
                            </p>
                        </div>
                    </div>
                </section>

            </main>
            <Footer />
        </div>
    );
}
