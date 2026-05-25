"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ArrowRight, Check, Copy, Terminal, Play, 
  Cpu, Database, Sparkles, Code2, Shield, 
  Activity, Zap, Server, RefreshCw, ChevronLeft, ChevronRight
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

const SLIDES = [
  {
    title: "Interactive Workspace Visualizer",
    description: "See your files and how they connect in real-time. Track file notes, verification tags, and historical version rollbacks easily.",
    image: "/workspace-visualizer.png",
    tags: ["Visual Map", "File Relations"]
  },
  {
    title: "AI Canvas Controller",
    description: "Let your team and AI assistants chat with your workspace. Ask the AI to point out files, highlight linked documents, and pan the view dynamically.",
    image: "/dashboard-screenshot.png",
    tags: ["Smart Workspace", "Interactive Canvas"]
  },
  {
    title: "Stacked Workspace Architecture",
    description: "Understand how your data moves: from raw Source Files and LLM Wikis, up to a Graphify Semantic Layer, ending in drive.io's interactive Search, Traversal, and Reporting dashboard.",
    image: "/tiered-context-layers.png",
    tags: ["Architecture", "Data Flow"]
  },
  {
    title: "Automated Tag & Approval Ledger",
    description: "Enable automated bots (like security scanners or campaign planners) to publish status tags directly on your workspace files for easy auditing.",
    image: "/workspace-visualizer.png",
    tags: ["Compliance Tags", "Asset Audits"]
  }
];

export function LandingPageClient() {
  const [copiedInstall, setCopiedInstall] = useState(false);
  const [activeTab, setActiveTab] = useState<"python" | "typescript" | "curl">("python");
  const [isRunning, setIsRunning] = useState(false);
  const [consoleLogs, setConsoleLogs] = useState<string[]>([]);
  const [consoleState, setConsoleState] = useState<"idle" | "running" | "done">("idle");
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setActiveSlide(prev => (prev + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused]);

  const copyInstallCommand = () => {
    navigator.clipboard.writeText("npm i @drive-io/sdk");
    setCopiedInstall(true);
    setTimeout(() => setCopiedInstall(false), 2000);
  };

  const codeSnippets = {
    python: `from drive import DriveClient

# 1. Connect to your team workspace (e.g. acme-campaign)
client = DriveClient(api_key="dr_live_8x2j9k...", namespace="acme-campaign")

# 2. Get quick summaries of files (Saves 90%+ on AI token bills)
workspace_summary = client.graphify.latest(tier="L1")
print(f"Connected! Loaded {len(workspace_summary.nodes)} workspace files.")

# 3. Find files linked directly to a marketing campaign list
campaign_links = client.graphify.query_node(
    node_id="src/marketing-schedule.xlsx",
    depth=1,
    include_annotations=True
)

for edge in campaign_links.edges:
    print(f"Linked File: {edge.target} | Tags: {edge.annotations}")`,
    typescript: `import { DriveClient } from "@drive-io/sdk";

// 1. Connect to your team workspace (e.g. acme-campaign)
const client = new DriveClient({
  apiKey: "dr_live_8x2j9k...",
  namespace: "acme-campaign"
});

// 2. Get quick summaries of files (Saves 90%+ on AI token bills)
const summary = await client.graphify.latest({ tier: "L1" });
console.log(\`Connected! Loaded \${summary.nodes.length} workspace files.\`);

// 3. Find files linked directly to a marketing campaign list
const campaignLinks = await client.graphify.queryNode({
  nodeId: "src/marketing-schedule.xlsx",
  depth: 1,
  includeAnnotations: true
});

campaignLinks.edges.forEach(edge => {
  console.log(\`Linked File: \${edge.target} | Tags: \${JSON.stringify(edge.annotations)}\`);
});`,
    curl: `# 1. Get quick file summaries for your AI assistants
curl -X GET "https://api.drive.io/v1/graphify/latest?namespace=acme-campaign&tier=L1" \\
  -H "Authorization: Bearer dr_live_8x2j9k..."

# 2. Get details and tags for a specific file and its links
curl -X GET "https://api.drive.io/v1/graphify/node?namespace=acme-campaign&id=src/marketing-schedule.xlsx&depth=1&annotations=true" \\
  -H "Authorization: Bearer dr_live_8x2j9k..."`
  };

  const handleRunCode = () => {
    if (isRunning) return;
    setIsRunning(true);
    setConsoleState("running");
    setConsoleLogs([]);

    const steps = [
      { delay: 400, text: "> Connecting to campaign workspace 'acme-campaign'..." },
      { delay: 900, text: "✓ Connected. Loaded workspace map (142 files, 389 links)." },
      { delay: 1500, text: "> Auditing file links and validation statuses..." },
      { delay: 2200, text: "⚠ Found 1 broken link: 'summer-banner.png' has no matching entry in 'marketing-schedule.xlsx'" },
      { delay: 2800, text: "> Analyzing most-connected hub files (hotspots)..." },
      { delay: 3300, text: "✓ 3 most-connected files found in your workspace:" },
      { delay: 3700, text: "[\n  { \"file\": \"src/marketing-schedule.xlsx\", \"importance\": \"High\", \"incomingLinks\": 18, \"outgoingLinks\": 4 },\n  { \"file\": \"src/assets/logo.png\", \"importance\": \"Medium\", \"incomingLinks\": 12, \"outgoingLinks\": 2 },\n  { \"file\": \"src/campaign-rules.docx\", \"importance\": \"Medium\", \"incomingLinks\": 1, \"outgoingLinks\": 15 }\n]" },
      { delay: 4100, text: "✓ Checked smart summaries (Saved 23,160 AI tokens; 96.5% AI billing cost reduction)" }
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
            Visual Workspace Graph for Teams and AI Assistants
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-6 leading-[1.1]">
            Connect your workspace files. <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-purple-400 via-violet-400 to-indigo-400 bg-clip-text text-transparent">
              Map links, verify tags, and cut AI costs.
            </span>
          </h1>

          <p className="text-lg text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Stop digging through folders or copying full files into AI tools. drive.io automatically links your spreadsheets, designs, and code files into a visual map. Let your team and AI assistants find connections, view summaries, and check statuses in seconds.
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
              Read SDK Reference
            </Link>
          </div>
        </div>

        {/* Interactive Code / Output Terminal Playground */}
        {/* Screenshot Showcase Carousel */}
        <div className="max-w-5xl mx-auto w-full mb-36 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-white mb-3">
              Comprehensive Workspace Viewer
            </h2>
            <p className="text-zinc-400 max-w-xl mx-auto">
              A premium visual suite to audit file connections, check automated verification tags, and compare workspace versions.
            </p>
          </div>

          <div className="relative bg-zinc-950/45 border border-zinc-800 rounded-3xl overflow-hidden p-3 md:p-6 shadow-2xl backdrop-blur-md">
            
            {/* Slide content container */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              
              {/* Slide Media Pane */}
              <div 
                className="lg:col-span-8 relative aspect-[16/10] bg-zinc-900/50 rounded-2xl overflow-hidden border border-zinc-800 flex items-center justify-center"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
              >
                <AnimatePresence mode="wait">
                  <motion.img 
                    key={activeSlide}
                    src={SLIDES[activeSlide].image}
                    alt={SLIDES[activeSlide].title}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.02 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="w-full h-full object-cover"
                  />
                </AnimatePresence>

                {/* Navigation Arrows on Hover/Overlay */}
                <div className="absolute inset-0 flex items-center justify-between px-4 opacity-0 hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => setActiveSlide(prev => (prev - 1 + SLIDES.length) % SLIDES.length)}
                    className="p-2 rounded-full bg-zinc-900/80 border border-zinc-700 hover:border-zinc-500 text-white transition-all focus:outline-none cursor-pointer"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => setActiveSlide(prev => (prev + 1) % SLIDES.length)}
                    className="p-2 rounded-full bg-zinc-900/80 border border-zinc-700 hover:border-zinc-500 text-white transition-all focus:outline-none cursor-pointer"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Slide Detail Pane */}
              <div className="lg:col-span-4 flex flex-col justify-center px-2 md:px-4">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeSlide}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col gap-4"
                  >
                    <div className="flex flex-wrap gap-2">
                      {SLIDES[activeSlide].tags.map((tag, idx) => (
                        <span key={idx} className="px-2.5 py-0.8 text-[10px] font-bold font-mono tracking-wider text-purple-400 bg-purple-950/40 border border-purple-900/50 rounded-md uppercase">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <h3 className="text-xl font-bold text-white tracking-tight">
                      {SLIDES[activeSlide].title}
                    </h3>
                    
                    <p className="text-sm text-zinc-400 leading-relaxed font-medium">
                      {SLIDES[activeSlide].description}
                    </p>
                  </motion.div>
                </AnimatePresence>

                {/* Progress Indicators & Buttons */}
                <div className="flex items-center gap-4 mt-8 pt-6 border-t border-zinc-900">
                  <div className="flex gap-2">
                    {SLIDES.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveSlide(idx)}
                        className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                          activeSlide === idx ? 'w-6 bg-purple-500' : 'w-2 bg-zinc-800 hover:bg-zinc-750'
                        }`}
                        title={`Go to slide ${idx + 1}`}
                      />
                    ))}
                  </div>

                  <div className="ml-auto flex gap-2">
                    <button 
                      onClick={() => setActiveSlide(prev => (prev - 1 + SLIDES.length) % SLIDES.length)}
                      className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-850 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                      title="Previous Slide"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => setActiveSlide(prev => (prev + 1) % SLIDES.length)}
                      className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-850 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                      title="Next Slide"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

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

        {/* Interactive Code / Output Terminal Playground */}
        <div className="max-w-5xl mx-auto w-full mb-32 relative z-10 flex flex-col items-center gap-6">
          {/* Quick Copy Command */}
          <div className="inline-flex items-center gap-3 px-4 py-2.5 rounded-lg bg-zinc-950 border border-zinc-850 text-xs font-mono text-zinc-300 max-w-md justify-between w-full sm:w-auto">
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

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-zinc-950/60 border border-zinc-850 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-md w-full">
            
            {/* Left Side: Code Editor */}
            <div className="lg:col-span-7 border-b lg:border-b-0 lg:border-r border-zinc-850 flex flex-col">
              {/* Tab Header */}
              <div className="flex items-center justify-between px-4 py-3 bg-zinc-950 border-b border-zinc-850">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
                  <div className="w-2.5 h-2.5 rounded-full bg-zinc-850" />
                  <div className="w-2.5 h-2.5 rounded-full bg-zinc-900" />
                  <span className="text-[11px] text-zinc-500 font-mono ml-2">workspace_client.py</span>
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
                          : log.startsWith("⚠")
                          ? "text-yellow-400 font-medium animate-pulse"
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

        {/* Capabilities Grid */}
        <div className="max-w-5xl mx-auto w-full mb-36 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-white mb-3">
              Smart Workspace Database
            </h2>
            <p className="text-zinc-400 max-w-xl mx-auto">
              Automatic file relationship mapping and smart summaries. Skip setting up complex vector storage or custom file-parsing scripts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Feature 1 */}
            <div className="p-6 rounded-xl bg-zinc-950 border border-zinc-900 hover:border-zinc-800 transition-all flex gap-4">
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0">
                <Database className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-zinc-200 mb-2">Connected Asset Mapping</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">
                  Map links between creative banners, schedule spreadsheets, guidelines, and code. Let your team and AI assistants navigate connections directly instead of guessing file locations.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-xl bg-zinc-950 border border-zinc-900 hover:border-zinc-800 transition-all flex gap-4">
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-zinc-200 mb-2">Stacked Data Flow Tiers</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">
                  Organize your workspace in three clear tiers: connect raw file formats, index them in a semantic relations graph, and query or report on them using a real-time dashboard.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-xl bg-zinc-950 border border-zinc-900 hover:border-zinc-800 transition-all flex gap-4">
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0">
                <Code2 className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-zinc-200 mb-2">Interactive Visual Map</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">
                  Help team members and AI tools work together. Visually inspect broken links, find disconnected assets, and highlight campaign files on an interactive map.
                </p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-xl bg-zinc-950 border border-zinc-900 hover:border-zinc-800 transition-all flex gap-4">
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0">
                <Shield className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-zinc-200 mb-2">Workspace History & Rollbacks</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">
                  Track how your workspace connections change over time. Easily compare older versions, view tag edits, and roll back to previous campaign mappings safely.
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
              Connect your workspace files and AI tools in three simple steps.
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
                <h3 className="text-sm font-bold text-zinc-200 mb-1">Index Your Workspace Structure</h3>
                <p className="text-xs text-zinc-500">
                  Upload folders or sync directories. Drive automatically parses file relations, links documents, and builds a visual database structure.
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
                <h3 className="text-sm font-bold text-zinc-200 mb-1">Query & Traverse Connections</h3>
                <p className="text-xs text-zinc-500">
                  Let your team members or AI assistants query links, traverse file relationships, and run compliance reports directly on the semantic layer.
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
                <h3 className="text-sm font-bold text-zinc-200 mb-1">Audit Verification Tags</h3>
                <p className="text-xs text-zinc-500">
                  Inspect tags written by managers or automated verification bots to confirm that assets are compliant, approved, and linked properly.
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
              Ready to graphify your workspace?
            </h2>
            <p className="text-zinc-400 max-w-md mx-auto mb-8 text-sm leading-relaxed">
              Provision a secure, ultra-low latency graph store for your AI assistants and agents today. Start for free, upgrade as you scale.
            </p>

            <div className="flex justify-center gap-4">
              <Link
                href="/dashboard"
                className="px-6 py-2.5 rounded-lg bg-purple-600 text-white font-semibold text-xs hover:bg-purple-500 transition-colors flex items-center gap-1.5"
              >
                Get Started for Free
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
