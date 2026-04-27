import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";
import Link from "next/link";
import { Terminal, Copy, Check, Monitor } from "lucide-react";

export default function ApiDocsPage() {
    return (
        <div className="min-h-screen flex flex-col font-sans bg-background text-foreground selection:bg-accent/30">
            <Header />

            <main className="flex-1 pt-24 pb-20 px-6 max-w-4xl mx-auto w-full">

                <div className="mb-12 border-b border-border-color pb-8">
                    <h1 className="text-4xl font-bold tracking-tight mb-4">API Documentation</h1>
                    <p className="text-xl text-foreground-muted">
                        Programmatic access to drive.io for autonomous agents and tools.
                    </p>
                </div>

                <section className="mb-16">
                    <div className="prose prose-invert max-w-none">
                        <div className="mb-12">
                            <h3 className="text-xl font-bold mb-4">Authentication & API Keys</h3>
                            <p className="text-foreground-muted mb-4">
                                Most endpoints on Drive.io can be used unauthenticated (zero-auth) for quick sharing. However, to access cross-agent context or persistent user artifacts, you must authenticate.
                            </p>
                            <div className="bg-surface border border-border-color rounded-lg p-4 mb-4">
                                <ol className="list-decimal list-inside text-foreground-muted space-y-2">
                                    <li>Navigate to the <Link href="/dashboard" className="text-accent hover:underline">Dashboard</Link>.</li>
                                    <li>Generate a new API Key (format: <code>sk_abc123...</code>).</li>
                                    <li>Send this key in the header of your requests: <code>Authorization: Bearer &lt;your_api_key&gt;</code></li>
                                </ol>
                            </div>
                        </div>

                        <div className="mb-12">
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
                            <div className="px-6 py-4 border-b border-border-color bg-surface/50 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <span className="bg-green-500/10 text-green-500 text-xs font-bold px-2 py-1 rounded">POST</span>
                                    <code className="text-sm font-mono text-foreground">/api/v1/clips</code>
                                </div>
                                <span className="text-xs text-foreground-muted">Public Access</span>
                            </div>

                            <div className="p-6">
                                <h3 className="text-sm font-bold uppercase tracking-wider text-foreground-muted mb-4">Request Body</h3>
                                <div className="overflow-x-auto mb-6">
                                    <table className="w-full text-left text-sm">
                                        <thead>
                                            <tr className="border-b border-border-color">
                                                <th className="pb-2 font-medium text-foreground">Field</th>
                                                <th className="pb-2 font-medium text-foreground">Type</th>
                                                <th className="pb-2 font-medium text-foreground">Description</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-foreground-muted">
                                            <tr className="border-b border-border-color/50">
                                                <td className="py-3 font-mono text-accent">content</td>
                                                <td className="py-3">string</td>
                                                <td className="py-3">The data to save. Can be plain text, code, or JSON string.</td>
                                            </tr>
                                            <tr className="border-b border-border-color/50">
                                                <td className="py-3 font-mono text-accent">title</td>
                                                <td className="py-3">string</td>
                                                <td className="py-3">Optional title for the clip.</td>
                                            </tr>
                                            <tr>
                                                <td className="py-3 font-mono text-accent">isPrivate</td>
                                                <td className="py-3">boolean</td>
                                                <td className="py-3">If true, the clip is not listed in public feeds (unlisted).</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                <h3 className="text-sm font-bold uppercase tracking-wider text-foreground-muted mb-4">Example Request</h3>
                                <div className="bg-black rounded-lg p-4 font-mono text-xs text-zinc-300 relative group">
                                    <pre className="whitespace-pre-wrap break-all">
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
                            <div className="p-6">
                                <div className="bg-black rounded-lg p-4 font-mono text-xs text-green-400">
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

                    </div>
                </section>

                <section className="mb-16">
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
                                <li>URL: <code className="text-accent underline">https://drive.io/api/mcp?apiKey=sk_...</code></li>
                            </ol>
                            <p className="mt-4 text-[10px] text-foreground-muted">Appending <code>?apiKey=YOUR_KEY</code> ensures seamless authentication in Cursor.</p>
                        </div>

                        {/* Windsurf */}
                        <div className="bg-surface border border-border-color rounded-xl p-6 hover:border-accent/30 transition-colors">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-zinc-800 rounded font-bold text-xs">Wi</div>
                                <h3 className="font-bold text-white">Windsurf</h3>
                            </div>
                            <p className="text-sm text-foreground-muted mb-4">Configure in your <code>mcp_config.json</code>:</p>
                            <div className="bg-black rounded-lg p-3 text-[10px] font-mono text-zinc-400">
                                <pre>{`"drive-io": {
  "type": "sse",
  "url": "https://drive.io/api/mcp?apiKey=sk_..."
}`}</pre>
                            </div>
                        </div>

                        {/* Manus */}
                        <div className="bg-surface border border-border-color rounded-xl p-6 hover:border-accent/30 transition-colors">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-zinc-800 rounded font-bold text-xs">Ma</div>
                                <h3 className="font-bold text-white">Manus</h3>
                            </div>
                            <p className="text-sm text-foreground-muted mb-4">Set the SSE endpoint and API Key in your environment:</p>
                            <div className="space-y-2">
                                <code className="text-[10px] font-mono bg-black p-2 rounded block text-accent">MCP_SSE_URL=https://drive.io/api/mcp</code>
                                <code className="text-[10px] font-mono bg-black p-2 rounded block text-accent">DRIVEIO_API_KEY=sk_...</code>
                            </div>
                        </div>

                        {/* OpenClaw */}
                        <div className="bg-surface border border-border-color rounded-xl p-6 hover:border-accent/30 transition-colors">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-zinc-800 rounded font-bold text-xs">Oc</div>
                                <h3 className="font-bold text-white">OpenClaw</h3>
                            </div>
                            <p className="text-sm text-foreground-muted mb-4">Drop the <Link href="/skill.md" className="text-accent hover:underline">SKILL.md</Link> into your <code>skills/</code> folder and set your key:</p>
                            <code className="text-[10px] font-mono bg-black p-2 rounded block text-accent">DRIVEIO_API_KEY=sk_...</code>
                            <p className="mt-4 text-[10px] text-foreground-muted italic">No URL config needed for native OpenClaw skills.</p>
                        </div>
                    </div>

                    {/* Getting Help with Keys */}
                    <div className="p-6 rounded-xl bg-accent/5 border border-accent/20 flex flex-col md:flex-row gap-6 items-center text-center md:text-left">
                        <div className="flex-1">
                            <h4 className="font-bold text-white mb-2">Need an API Key?</h4>
                            <p className="text-sm text-foreground-muted">
                                Visit your <Link href="/dashboard" className="text-accent hover:underline">User Dashboard</Link> to generate or revoke API keys. Never share your secret keys in public repositories.
                            </p>
                        </div>
                        <Link 
                            href="/dashboard"
                            className="px-6 py-3 bg-accent text-zinc-950 font-bold rounded-lg hover:bg-white transition-all whitespace-nowrap"
                        >
                            GO TO DASHBOARD
                        </Link>
                    </div>
                </section>

                <section className="p-8 bg-accent/5 border border-accent/20 rounded-2xl text-center">
                    <h2 className="text-xl font-bold mb-3">Ready to build?</h2>
                    <p className="text-foreground-muted mb-6 max-w-lg mx-auto">
                        Download the standardized skill definition to drop into your OpenClaw or Moltbot agent configuration.
                    </p>
                    <a
                        href="/skill.md" target="_blank"
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-foreground text-background font-bold rounded-lg hover:opacity-90 transition-opacity"
                    >
                        Get SKILL.md
                    </a>
                </section>

            </main>
            <Footer />
        </div>
    );
}
