import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";
import Link from "next/link";
import { CarbonAd } from "@/components/ui/CarbonAd";
import { HowItWorks } from "@/components/ui/HowItWorks";
import { RecommendedTools } from "@/components/monetization/RecommendedTools";
import { InstallationGuide } from "@/components/ui/InstallationGuide";
import { PclipPromoBanner } from "@/components/ui/PclipPromoBanner";
import { AgentSplash } from "@/components/moltbot/AgentSplash";
import { VisitorBadge } from "@/components/ui/VisitorBadge";
import { TokenBenchmark } from "@/components/ui/TokenBenchmark";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-accent/30 selection:text-foreground">

      <Header />

      <main className="flex-1 flex flex-col relative pt-20 sm:pt-24 pb-8 sm:pb-12 px-4 sm:px-6">

        <div className="text-center max-w-2xl mx-auto mb-12 animate-fade-in relative z-10">
          <Link href="/agents" className="inline-flex flex-col sm:flex-row items-center gap-2 sm:gap-3 px-4 sm:px-5 py-2 rounded-xl sm:rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-300 text-sm sm:text-base font-medium mb-8 hover:bg-purple-500/20 transition-colors text-center w-full sm:w-auto">
            <span className="flex items-center justify-center p-0.5 rounded-full bg-purple-500/20">
              <img src="/moltbot-2.png" alt="Moltbot" className="w-8 h-8 rounded-full" />
            </span>
            NEW: Share files from OpenClaw via your chat interface or with other Agents!
          </Link>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-4 text-foreground leading-tight">
            Share Files & Data Between <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-blue-400">AI Agents.</span>
          </h1>
          <h2 className="text-lg sm:text-xl font-medium text-foreground mb-6 uppercase tracking-wider text-accent/90 leading-relaxed">
            The neutral, cross-framework artifact relay for <br className="hidden sm:block" /> LangGraph, CrewAI, AutoGen, and beyond.
          </h2>
          <p className="text-foreground-muted text-base sm:text-lg leading-relaxed max-w-3xl mx-auto mb-10">
            Memory layers like Mem0 and Zep help agents remember the past. <strong>Drive.io handles what's happening right now</strong> — turning any file or dataset into a 7-token pointer so your agents stop burning context on raw payloads mid-run.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-accent text-background font-bold text-lg hover:bg-accent/90 transition-all shadow-hacker-green hover:translate-y-[-2px] active:translate-y-[2px]"
            >
              Get Your Agent API Key
            </Link>
            <Link
              href="#how-it-works"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-surface border border-border-color text-foreground font-bold text-lg hover:bg-white/5 transition-all"
            >
              See Token Savings
            </Link>
          </div>
        </div>

        {/* Pclip Prominent Promo Banner Moved Down */}
        <div className="max-w-4xl mx-auto w-full mb-12 opacity-80 hover:opacity-100 transition-opacity">
            <PclipPromoBanner />
        </div>

        {/* New Differentiation Callout Section */}
        <div className="max-w-5xl mx-auto w-full mb-32 py-16 px-6 rounded-3xl bg-surface/20 border border-border-color/30 backdrop-blur-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl -z-10 group-hover:bg-accent/10 transition-colors"></div>
          
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <div className="flex-1 space-y-6">
              <h2 className="text-3xl font-bold text-foreground leading-tight">
                Not a memory layer. <br />An <span className="text-accent">artifact relay.</span>
              </h2>
              <p className="text-foreground-muted text-base leading-relaxed">
                A new category of agent infrastructure tooling is emerging to solve the context problem. It's worth being precise about what each layer does:
              </p>
              
              <div className="overflow-hidden rounded-xl border border-border-color/50 bg-black/20">
                <table className="w-full text-left text-sm">
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
                      <td className="px-4 py-4 text-foreground-muted text-xs">Agents forget past sessions and user context</td>
                      <td className="px-4 py-4 text-foreground-muted text-xs">Mem0, Zep</td>
                    </tr>
                    <tr className="bg-accent/5">
                      <td className="px-4 py-4 font-bold text-accent">Artifact Relay</td>
                      <td className="px-4 py-4 text-accent/90 text-xs font-semibold">Passing large files mid-run blows up token budgets</td>
                      <td className="px-4 py-4 text-accent/90 text-xs font-bold">Drive.io</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-4 font-bold text-foreground">Orchestration</td>
                      <td className="px-4 py-4 text-foreground-muted text-xs">Coordinating agent tasks and dependencies</td>
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
                Drive.io's lane is specifically <strong>intra-pipeline efficiency</strong>: the moment one agent needs to hand something large to another, without either agent's context window paying the price.
              </p>
            </div>
          </div>
        </div>

        {/* Framing the Problem */}
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in delay-200">
          <p className="text-xl md:text-2xl font-medium text-foreground-muted mb-4 italic leading-relaxed">
            &quot;Passing raw data between agents consumes an average of 6,411 tokens per run versus 841 tokens with a pointer-based relay.&quot;
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-foreground-muted/80">
            <span className="font-semibold px-2 py-1 rounded bg-surface border border-border-color text-foreground shadow-sm">Research</span>
            <span>— Arxiv (Nov 2024)</span>
          </div>
        </div>

        {/* How It Works Steps */}
        <HowItWorks />

        {/* Measured Benchmark Data */}
        <TokenBenchmark />

        {/* Agentic Protocol Section */}
        <div className="bg-surface/50 border-y border-border-color py-24 my-16 backdrop-blur-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent to-transparent"></div>
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-8 leading-tight">
              The Cross-Framework Artifact Relay — <br /><span className="text-accent/80">Complementary to Your Memory Layer</span>
            </h2>
            <p className="text-foreground text-lg mb-10 leading-relaxed max-w-2xl mx-auto">
              Drive.io defines a neutral standard for artifact handoffs. Whether your swarm is built on LangGraph, CrewAI, or AutoGen, our protocol ensures that data remains accessible and context windows remain clean.
            </p>
            <div className="flex flex-wrap justify-center gap-6 opacity-60">
                <span className="text-sm font-bold tracking-widest uppercase">LangGraph</span>
                <span className="text-sm font-bold tracking-widest uppercase">CrewAI</span>
                <span className="text-sm font-bold tracking-widest uppercase">AutoGen</span>
                <span className="text-sm font-bold tracking-widest uppercase">Semantic Kernel</span>
            </div>
          </div>
        </div>

        {/* Main Interaction Area */}
        <div className="w-full max-w-5xl mx-auto flex flex-col gap-12">
          <AgentSplash />

          {/* Feature 1: Programmatic Persistence */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6 pb-4 border-t border-border-color/50">
            <div className="p-6 rounded-2xl bg-surface/30 border border-border-color/50 hover:border-accent/30 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 16 4-4-4-4" /><path d="m6 8-4 4 4 4" /><path d="m14.5 4-5 16" /></svg>
              </div>
              <h3 className="text-foreground font-semibold mb-2 text-lg">Programmatic Persistence</h3>
              <p className="text-base text-foreground-muted leading-relaxed">
                Bypass human-centric rate limits and CAPTCHAs. Generate instantly accessible, zero-auth data URLs directly from standard agent tool calls.
              </p>
            </div>

            {/* Feature 2: Agent-to-Agent Handoff */}
            <div className="p-6 rounded-2xl bg-surface/30 border border-border-color/50 hover:border-accent/30 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" /><polyline points="16 6 12 2 8 6" /><line x1="12" y1="2" x2="12" y2="15" /></svg>
              </div>
              <h3 className="text-foreground font-semibold mb-2 text-lg">O(1) Token Scaling</h3>
              <p className="text-base text-foreground-muted leading-relaxed">
                Pass massive datasets between separate models via 7-token pointers. Eliminate mid-run context window exhaustion and slash token budgets by &gt;99%.
              </p>
            </div>

            {/* Feature 3: Provenance & Audit Logs */}
            <div className="p-6 rounded-2xl bg-surface/30 border border-border-color/50 hover:border-accent/30 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-400 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" /><path d="m9 12 2 2 4-4" /></svg>
              </div>
              <h3 className="text-foreground font-semibold mb-2 text-lg">Provenance & Audit Logs</h3>
              <p className="text-base text-foreground-muted leading-relaxed">
                Solve the autonomous liability gap. We track exact creation times, TTL expirations, and access events—creating an undeniable paper trail for all AI actions.
              </p>
            </div>
          </div>


          {/* Clear API Integration Steps */}
          <InstallationGuide />

          {/* Recommended Privacy Tools (Affiliate) */}
          <RecommendedTools />

          {/* Pclip Chrome Extension CTA */}
          <div className="max-w-2xl mx-auto w-full">
            <div className="flex items-center gap-2 mb-3">
              <span className="h-px flex-1 bg-border-color/50"></span>
              <span className="text-[10px] font-bold text-foreground-muted uppercase tracking-[0.2em] whitespace-nowrap">Also by the Drive.io Team</span>
              <span className="h-px flex-1 bg-border-color/50"></span>
            </div>
            <a
              href="https://chromewebstore.google.com/detail/pclip-cloud-clipboard/dcdppgjojehkngjhcdklkdbalegbmkin?hl=en&authuser=0"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center p-6 rounded-2xl bg-gradient-to-br from-purple-500/5 to-surface/50 border border-purple-500/20 hover:border-purple-500/40 hover:bg-surface transition-all transform hover:scale-[1.01] active:scale-[0.99] shadow-xl group w-full"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-bold tracking-tight text-white group-hover:text-purple-400 transition-colors">Install Pclip Extension</span>
                  <span className="text-[10px] font-bold text-purple-500/60 uppercase tracking-widest">Web Clipper for Pclip.me</span>
                </div>
              </div>
              <p className="text-foreground-muted text-sm text-center leading-relaxed max-w-md group-hover:text-foreground transition-colors">
                The independent, human-centric way to send text and images instantly to your Pclip cloud clipboard.
              </p>
            </a>
          </div>

          <div className="flex justify-center opacity-80 hover:opacity-100 transition-opacity">
            <CarbonAd />
          </div>



          <VisitorBadge />
        </div>
      </main>

      <Footer />
    </div>
  );
}
