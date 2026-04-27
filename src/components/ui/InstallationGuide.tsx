"use client";

import { useState } from 'react';
import { Terminal, Copy, CheckCircle2 } from 'lucide-react';

export function InstallationGuide() {
    const [copiedContent, setCopiedContent] = useState<string | null>(null);

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopiedContent(text);
        setTimeout(() => setCopiedContent(null), 2000);
    };

    const CodeBlock = ({ code, language = "bash" }: { code: string, language?: string }) => (
        <div className="relative group mt-2 mb-6">
            <div className="absolute top-0 right-0 p-2 z-10">
                <button
                    onClick={() => handleCopy(code)}
                    className="p-1.5 rounded-md bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors"
                    aria-label="Copy code"
                >
                    {copiedContent === code ? <CheckCircle2 size={16} className="text-green-400" /> : <Copy size={16} />}
                </button>
            </div>
            <pre className="p-4 rounded-xl bg-[#0d0d0d] border border-zinc-800 overflow-x-auto text-sm font-mono text-zinc-300">
                <code>{code}</code>
            </pre>
        </div>
    );

    return (
        <div className="w-full max-w-5xl mx-auto py-16 px-4">
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Setup in 2 minutes</h2>
                <p className="text-foreground-muted text-lg max-w-2xl mx-auto">
                    Integrate Drive.io into your agents with a few lines of code. 
                    No complex auth, no servers to manage.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* MCP Integration */}
                <div className="p-6 rounded-2xl bg-surface/50 border border-border-color shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-bl-[100px] -z-10 group-hover:scale-110 transition-transform"></div>

                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400">
                            <Terminal size={20} />
                        </div>
                        <h3 className="text-xl font-bold text-foreground">MCP / Claude</h3>
                    </div>

                    <p className="text-sm text-foreground-muted mb-4 leading-relaxed">
                        Drive.io is a native MCP server. Point Claude straight to our endpoint to give him the `upload_artifact` tool instantly.
                    </p>

                    <div className="text-xs font-semibold tracking-wider text-zinc-500 uppercase mb-2">Claude Desktop Config</div>
                    <CodeBlock
                        language="json"
                        code={`{
  "mcpServers": {
    "drive.io": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-sse",
        "https://drive.io/api/mcp"
      ]
    }
  }
}`}
                    />
                </div>

                {/* Python / A2A Integration */}
                <div className="p-6 rounded-2xl bg-surface/50 border border-border-color shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-bl-[100px] -z-10 group-hover:scale-110 transition-transform"></div>

                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m8 9 3 3-3 3" /><path d="M13 15h3" /></svg>
                        </div>
                        <h3 className="text-xl font-bold text-foreground">Python API</h3>
                    </div>

                    <p className="text-sm text-foreground-muted mb-4 leading-relaxed">
                        For CrewAI or LangGraph, use our Python SDK to park data and get back a pointer link.
                    </p>

                    <div className="text-xs font-semibold tracking-wider text-zinc-500 uppercase mb-2">Install Package</div>
                    <CodeBlock code="pip install driveio-agent" />

                    <div className="text-xs font-semibold tracking-wider text-zinc-500 uppercase mb-2">Basic Data Upload</div>
                    <CodeBlock
                        language="python"
                        code={`from driveio import Relay

relay = Relay(api_key="sk_abc123")
url = relay.context.upload(dataset_df)

print(f"Artifact at: {url}")`}
                    />
                </div>

                {/* A2A Sync/Webhooks */}
                <div className="p-6 rounded-2xl bg-surface/50 border border-border-color shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-bl-[100px] -z-10 group-hover:scale-110 transition-transform"></div>

                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 3h5v5" /><path d="M8 3H3v5" /><path d="M12 22v-8.3a4 4 0 0 0-1.172-2.872L3 3" /><path d="m15 9 6-6" /></svg>
                        </div>
                        <h3 className="text-xl font-bold text-foreground">Agent-to-Agent</h3>
                    </div>

                    <p className="text-sm text-foreground-muted mb-4 leading-relaxed">
                        Agent A parks the data, and Agent B picks it up automatically when it's ready. Simple async work.
                    </p>

                    <div className="text-xs font-semibold tracking-wider text-zinc-500 uppercase mb-2">Agent B (Receiver) Hook</div>
                    <CodeBlock
                        language="python"
                        code={`@relay.on_handoff("agent_b")
def process_data(payload):
    print(f"Executing payload")
    return run_analysis(payload)
    
# Polls & fires automatically`}
                    />
                </div>

            </div>
        </div>
    );
}
