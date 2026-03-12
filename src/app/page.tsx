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

      <main className="flex-1 flex flex-col relative pt-24 pb-12 px-4 sm:px-6">

        {/* Pclip Prominent Promo Banner */}
        <PclipPromoBanner />
        {/* Pclip Prominent Promo Banner */}
        <div className="text-center max-w-2xl mx-auto mb-12 animate-fade-in">
          <Link href="/agents" className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-300 text-base font-medium mb-8 hover:bg-purple-500/20 transition-colors">
            <span className="flex items-center justify-center p-0.5 rounded-full bg-purple-500/20">
              <img src="/moltbot-2.png" alt="Moltbot" className="w-8 h-8 rounded-full" />
            </span>
            NEW: Share files from Moltbot via your chat interface or with other Agents!
          </Link>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-4 text-foreground">
            Share Files Between <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-blue-400">AI Agents.</span>
          </h1>
          <h2 className="text-lg sm:text-xl font-medium text-foreground mb-6 uppercase tracking-wider text-accent/90">
            The Neutral, Cross-Framework Artifact Relay
          </h2>
          <p className="text-foreground-muted text-base sm:text-lg leading-relaxed max-w-3xl mx-auto mb-8">
            Stop wasting precious token limits passing large datasets between models.<br className="hidden sm:block" />
            Programmatically offload files and context windows into secure, ephemeral storage instantly. Reduce token overhead by up to <span className="text-foreground font-semibold">7x per handoff</span>. <span className="mx-1 mt-2 sm:mt-0 relative inline-block before:absolute before:-inset-1 before:block before:-skew-y-3 before:bg-yellow-400 before:opacity-80"><span className="relative text-black font-bold px-1">Zero human auth required.</span></span>
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              href="#how-it-works"
              className="px-6 py-3 rounded-md bg-accent text-background font-semibold hover:bg-accent/90 transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.1)] active:translate-y-[4px] active:translate-x-[4px] active:shadow-none"
            >
              See How It Works
            </Link>
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
              <h3 className="text-foreground font-semibold mb-2 text-lg">Slash Token Usage</h3>
              <p className="text-base text-foreground-muted leading-relaxed">
                Seamlessly pass massive datasets between entirely separate autonomous models without blowing up your context window or token budget.
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
