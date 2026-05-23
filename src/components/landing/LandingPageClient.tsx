"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ArrowRight, Check, Copy, Terminal, Play, 
  Cpu, Database, Sparkles, Code2, Shield, 
  Activity, Zap, Server, RefreshCw 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";

// Framework logo/icon list
const INTEGRATIONS = [
  { name: "LangChain", type: "Framework" },
  { name: "CrewAI", type: "Orchestrator" },
  { name: "AutoGen", type: "Multi-Agent" },
  { name: "LlamaIndex", type: "RAG" },
  { name: "OpenAI", type: "LLM" },
  { name: "Anthropic", type: "LLM" },
  { name: "Gemini", type: "LLM" },
  { name: "Vercel AI SDK", type: "Integration" }
];

export function LandingPageClient() {
  const [copiedInstall, setCopiedInstall] = useState(false);
  const [activeTab, setActiveTab] = useState<"python" | "typescript" | "curl">("python");
  const [isRunning, setIsRunning] = useState(false);
  const [consoleLogs, setConsoleLogs] = useState<string[]>([]);
  const [consoleState, setConsoleState] = useState<"idle" | "running" | "done">("idle");

  const copyInstallCommand = () => {
    navigator.clipboard.writeText("npm i @drive-io/sdk");
    setCopiedInstall(true);
    setTimeout(() => setCopiedInstall(false), 2000);
  };

  const codeSnippets = {
    python: `from drive import Drive

# 1. Initialize client
client = Drive(api_key="dr_live_8x2j9k...")

# 2. Add memory context
client.memories.add(
    user_id="user_129",
    content="Prefers writing code in TypeScript, dark mode UI"
)

# 3. Retrieve memory semantically
context = client.memories.search(
    query="What is the user's preferred stack?",
    limit=1
)
print(context)`,
    typescript: `import { Drive } from "@drive-io/sdk";

// 1. Initialize client
const client = new Drive({
  apiKey: "dr_live_8x2j9k..."
});

// 2. Add memory context
await client.memories.add({
  userId: "user_129",
  content: "Prefers writing code in TypeScript, dark mode UI"
});

// 3. Retrieve memory semantically
const context = await client.memories.search({
  query: "What is the user's preferred stack?",
  limit: 1
});
console.log(context);`,
    curl: `# 1. Ingest memory context
curl -X POST "https://api.drive.io/v1/memories" \\
  -H "Authorization: Bearer dr_live_8x2j9k..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "user_id": "user_129",
    "content": "Prefers writing code in TypeScript, dark mode UI"
  }'

# 2. Search memories semantically
curl -X POST "https://api.drive.io/v1/memories/search" \\
  -H "Authorization: Bearer dr_live_8x2j9k..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "query": "What is the user's preferred stack?"
  }'`
  };

  const handleRunCode = () => {
    if (isRunning) return;
    setIsRunning(true);
    setConsoleState("running");
    setConsoleLogs([]);

    const steps = [
      { delay: 400, text: "> Initializing connection to drive.io..." },
      { delay: 1000, text: "> Authorization header verified successfully." },
      { delay: 1500, text: "> Ingesting raw context: \"Prefers writing code in TypeScript, dark mode UI\"" },
      { delay: 2200, text: "✓ Context analyzed, distilled and indexed successfully. (21ms)" },
      { delay: 2800, text: "> Querying similarity index: \"What is the user's preferred stack?\"" },
      { delay: 3400, text: "✓ 1 relevant memory retrieved (cosine distance: 0.9412)" },
      { delay: 3800, text: "[\n  {\n    \"id\": \"mem_01j4k92\",\n    \"content\": \"Prefers writing code in TypeScript, dark mode UI\",\n    \"score\": 0.9412,\n    \"timestamp\": 1716391485\n  }\n]" }
    ];

    steps.forEach((step, index) => {
      setTimeout(() => {
        setConsoleLogs(prev => [...prev, step.text]);
        if (index === steps.length - 1) {
          setIsRunning(false);
          setConsoleState("done");
        }
      }, step.delay);
    });
  };

  return (
    <div className="min-h-screen bg-[#050506] text-zinc-300 flex flex-col font-sans selection:bg-purple-500/30 selection:text-white overflow-x-hidden">
      {/* Header Container */}
      <Header />

      {/* Main Wrapper */}
      <main className="flex-1 flex flex-col pt-32 pb-24 px-4 sm:px-6 relative">
        
        {/* Subtle Violet Background Glows */}
        <div className="absolute top-[-10%] left-[50%] -translate-x-1/2 w-[800px] sm:w-[1200px] h-[600px] bg-purple-900/10 blur-[160px] rounded-full pointer-events-none z-0" />
        <div className="absolute top-[40%] right-[-10%] w-[600px] h-[600px] bg-purple-900/5 blur-[140px] rounded-full pointer-events-none z-0" />
        <div className="absolute bottom-[10%] left-[-10%] w-[600px] h-[600px] bg-purple-900/5 blur-[140px] rounded-full pointer-events-none z-0" />

        {/* Hero Area */}
        <div className="max-w-4xl mx-auto text-center relative z-10 mb-20">
          {/* Micro-badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 text-xs font-medium tracking-wide mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
            Universal Memory Layer for AI Agents
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-6 leading-[1.1]">
            Persistent memory <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-purple-400 via-violet-400 to-indigo-400 bg-clip-text text-transparent">
              for your AI assistants.
            </span>
          </h1>

          <p className="text-lg text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Give your AI tools a permanent, secure place to store documents, remember user preferences, and share context across workflows. Connect with a single line of code.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto px-6 py-3 rounded-lg bg-white text-black font-semibold text-sm hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2"
            >
              Get Started for Free
              <ArrowRight className="w-4 h-4" />
            </Link>
            
            <Link
              href="/developers"
              className="w-full sm:w-auto px-6 py-3 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 font-semibold text-sm hover:bg-zinc-850 hover:text-white transition-all flex items-center justify-center"
            >
              Read Documentation
            </Link>
          </div>

          {/* Quick Copy Command */}
          <div className="inline-flex items-center gap-3 px-4 py-2.5 rounded-lg bg-zinc-950 border border-zinc-850 text-xs font-mono text-zinc-300 max-w-md mx-auto justify-between w-full sm:w-auto">
            <div className="flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5 text-purple-400" />
              <span>npm install @drive-io/sdk</span>
            </div>
            <button 
              onClick={copyInstallCommand}
              className="p-1 text-zinc-400 hover:text-zinc-200 transition-colors focus:outline-none"
              title="Copy to clipboard"
            >
              {copiedInstall ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Interactive Code / Output Terminal Playground */}
        <div className="max-w-5xl mx-auto w-full mb-32 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-zinc-950/60 border border-zinc-850 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-md">
            
            {/* Left Side: Code Editor */}
            <div className="lg:col-span-7 border-b lg:border-b-0 lg:border-r border-zinc-850 flex flex-col">
              {/* Tab Header */}
              <div className="flex items-center justify-between px-4 py-3 bg-zinc-950 border-b border-zinc-850">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
                  <div className="w-2.5 h-2.5 rounded-full bg-zinc-850" />
                  <div className="w-2.5 h-2.5 rounded-full bg-zinc-900" />
                  <span className="text-[11px] text-zinc-500 font-mono ml-2">drive_agent_config.py</span>
                </div>
                {/* SDK Language Switcher */}
                <div className="flex gap-1.5">
                  <button 
                    onClick={() => setActiveTab("python")}
                    className={`px-2.5 py-1 text-[11px] font-mono rounded ${activeTab === "python" ? "bg-zinc-900 text-purple-400 font-semibold" : "text-zinc-500 hover:text-zinc-300"}`}
                  >
                    python
                  </button>
                  <button 
                    onClick={() => setActiveTab("typescript")}
                    className={`px-2.5 py-1 text-[11px] font-mono rounded ${activeTab === "typescript" ? "bg-zinc-900 text-purple-400 font-semibold" : "text-zinc-500 hover:text-zinc-300"}`}
                  >
                    typescript
                  </button>
                  <button 
                    onClick={() => setActiveTab("curl")}
                    className={`px-2.5 py-1 text-[11px] font-mono rounded ${activeTab === "curl" ? "bg-zinc-900 text-purple-400 font-semibold" : "text-zinc-500 hover:text-zinc-300"}`}
                  >
                    curl
                  </button>
                </div>
              </div>

              {/* Code Area */}
              <div className="p-5 flex-1 font-mono text-[12px] leading-relaxed text-zinc-300 overflow-x-auto select-text min-h-[300px]">
                <pre>{codeSnippets[activeTab]}</pre>
              </div>
            </div>

            {/* Right Side: Output Terminal */}
            <div className="lg:col-span-5 flex flex-col bg-zinc-950">
              {/* Terminal Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-850">
                <div className="flex items-center gap-2">
                  <Server className="w-3.5 h-3.5 text-zinc-500" />
                  <span className="text-[11px] font-mono text-zinc-400">Response Console</span>
                </div>

                {/* Run Button */}
                <button
                  onClick={handleRunCode}
                  disabled={isRunning}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-semibold transition-colors ${
                    isRunning 
                      ? "bg-zinc-900 text-zinc-500 cursor-not-allowed" 
                      : "bg-purple-600 text-white hover:bg-purple-500"
                  }`}
                >
                  {isRunning ? (
                    <RefreshCw className="w-3 h-3 animate-spin" />
                  ) : (
                    <Play className="w-3 h-3 fill-current" />
                  )}
                  {isRunning ? "Running..." : "Run Code"}
                </button>
              </div>

              {/* Log Output Area */}
              <div className="p-5 flex-1 font-mono text-[11.5px] leading-relaxed text-zinc-300 min-h-[300px] flex flex-col justify-between overflow-y-auto">
                <div className="space-y-2">
                  {consoleState === "idle" && (
                    <div className="text-zinc-600 italic">
                      Click "Run Code" to simulate SDK actions.
                    </div>
                  )}
                  
                  {consoleLogs.map((log, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={
                        log.startsWith("✓") 
                          ? "text-green-400 font-medium" 
                          : log.startsWith("[") || log.startsWith(" ") || log.startsWith("]")
                          ? "text-zinc-400 font-mono text-[11px] whitespace-pre" 
                          : "text-zinc-400"
                      }
                    >
                      {log}
                    </motion.div>
                  ))}
                </div>

                {consoleState === "done" && (
                  <div className="pt-4 border-t border-zinc-900 text-[10px] text-zinc-500 flex items-center justify-between">
                    <span>STATUS: 200 OK</span>
                    <span>RTT: 21ms</span>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* Integration ecosystem list */}
        <div className="max-w-4xl mx-auto w-full text-center mb-36 relative z-10">
          <p className="text-xs font-mono uppercase tracking-[0.2em] text-zinc-500 mb-8">
            Works with any AI agent, orchestrator, or model stack
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {INTEGRATIONS.map((integration, idx) => (
              <div 
                key={idx}
                className="flex flex-col items-center justify-center p-4 rounded-xl bg-zinc-950 border border-zinc-900 hover:border-zinc-800 transition-colors group"
              >
                <span className="text-sm font-semibold text-zinc-300 group-hover:text-white transition-colors">
                  {integration.name}
                </span>
                <span className="text-[10px] text-zinc-600 font-mono mt-1">
                  {integration.type}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Capabilities Grid */}
        <div className="max-w-5xl mx-auto w-full mb-36 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-white mb-3">
              Memory as an API
            </h2>
            <p className="text-zinc-400 max-w-xl mx-auto">
              Drop-in state management for AI. Skip setting up vector databases and writing parser microservices.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Feature 1 */}
            <div className="p-6 rounded-xl bg-zinc-950 border border-zinc-900 hover:border-zinc-800 transition-all flex gap-4">
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0">
                <Database className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-zinc-200 mb-2">Long-Term Persistence</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">
                  Automatically consolidate past user messages and agent activities. Let your agent learn and recall guidelines across session boundaries.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-xl bg-zinc-950 border border-zinc-900 hover:border-zinc-800 transition-all flex gap-4">
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-zinc-200 mb-2">Semantic Extraction</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">
                  Drive automatically summarizes, de-duplicates, and extracts core facts and user preferences from unstructured text streams.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-xl bg-zinc-950 border border-zinc-900 hover:border-zinc-800 transition-all flex gap-4">
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0">
                <Code2 className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-zinc-200 mb-2">Multi-Agent Knowledge Sync</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">
                  Allow multiple distinct agents (coding assistant, database agent, support bot) to access and modify a unified memory tree safely.
                </p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-xl bg-zinc-950 border border-zinc-900 hover:border-zinc-800 transition-all flex gap-4">
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0">
                <Shield className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-zinc-200 mb-2">Developer Instrumentation</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">
                  Inspect memories, review search similarity metrics, provision secure API keys, and configure real-time webhooks in your dashboard.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Step-by-Step Implementation Guide */}
        <div className="max-w-4xl mx-auto w-full mb-36 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-2xl font-bold text-white mb-2">
              Setup is simple
            </h2>
            <p className="text-zinc-500 text-sm">
              Connect your AI agent to Drive.io in three simple actions.
            </p>
          </div>

          <div className="space-y-10">
            {/* Step 1 */}
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-300 flex items-center justify-center shrink-0">
                  01
                </div>
                <div className="flex-1 w-px bg-zinc-900 my-2" />
              </div>
              <div className="pb-4">
                <h3 className="text-sm font-bold text-zinc-200 mb-1">Generate API Credentials</h3>
                <p className="text-xs text-zinc-500">
                  Create a developer account and grab your API access key from the [Developer Console](file:///Users/deji.omisore/projects/cloud-clipboard/src/app/dashboard/ApiKeyDashboard.tsx).
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-300 flex items-center justify-center shrink-0">
                  02
                </div>
                <div className="flex-1 w-px bg-zinc-900 my-2" />
              </div>
              <div className="pb-4">
                <h3 className="text-sm font-bold text-zinc-200 mb-1">Upload files or ingest memories</h3>
                <p className="text-xs text-zinc-500">
                  Push files, logs, or plain text messages into the Drive API. Let our pipeline handle compression and embedding generation dynamically.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-300 flex items-center justify-center shrink-0">
                  03
                </div>
              </div>
              <div>
                <h3 className="text-sm font-bold text-zinc-200 mb-1">Search semantically</h3>
                <p className="text-xs text-zinc-500">
                  Query the store from your agent's system prompt. Retrieve relevant context instantly to keep conversations coherent.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Card Section */}
        <div className="max-w-4xl mx-auto w-full mb-20 relative z-10">
          <div className="relative rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-950 p-12 text-center shadow-2xl">
            {/* Inward Radial Purple Glow */}
            <div className="absolute inset-0 bg-radial-gradient from-purple-900/10 via-transparent to-transparent opacity-60 pointer-events-none" />
            
            <h2 className="text-3xl font-extrabold text-white mb-4">
              Ready to give your agents memory?
            </h2>
            <p className="text-zinc-400 max-w-md mx-auto mb-8 text-sm leading-relaxed">
              Provision a secure, ultra-low latency memory store for your AI assistants today. Start for free, upgrade as you scale.
            </p>

            <div className="flex justify-center gap-4">
              <Link
                href="/dashboard"
                className="px-6 py-2.5 rounded-lg bg-purple-600 text-white font-semibold text-xs hover:bg-purple-500 transition-colors flex items-center gap-1.5"
              >
                Sign Up Now
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

      </main>

      {/* Footer container */}
      <Footer />
    </div>
  );
}
