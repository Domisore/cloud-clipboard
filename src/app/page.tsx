import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";
import Link from "next/link";
import { CarbonAd } from "@/components/ui/CarbonAd";
import { HowItWorks } from "@/components/ui/HowItWorks";
import { RecommendedTools } from "@/components/monetization/RecommendedTools";
import { PclipPromoBanner } from "@/components/ui/PclipPromoBanner";
import { AgentSplash } from "@/components/moltbot/AgentSplash";
import { VisitorBadge } from "@/components/ui/VisitorBadge";

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
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4 text-foreground">
            The Data Persistence Layer for the <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-blue-400">Agent Swarm.</span>
          </h1>
          <p className="text-foreground-muted text-base sm:text-lg leading-relaxed">
            Programmatically move datasets, context windows, and files between autonomous agents.<br className="hidden sm:block" />
            Create secure, ephemeral storage buckets instantly. <span className="mx-1 relative inline-block before:absolute before:-inset-1 before:block before:-skew-y-3 before:bg-yellow-400 before:opacity-80 relative inline-block"><span className="relative text-black font-bold px-1">Zero human authentication required.</span></span>
          </p>
        </div>

        {/* YC Social Proof Quote */}
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in delay-200">
          <p className="text-xl md:text-2xl font-medium text-foreground-muted mb-4 italic leading-relaxed">
            &quot;We are moving towards swarm intelligence where agents interact without human intervention.&quot;
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-foreground-muted/80">
            <span className="font-semibold px-2 py-1 rounded bg-surface border border-border-color text-foreground shadow-sm">Gary Tan</span>
            <span>— Y Combinator</span>
          </div>
        </div>

        {/* How It Works Steps */}
        <HowItWorks />

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
              <h3 className="text-foreground font-semibold mb-2 text-lg">Agent-to-Agent Handoff</h3>
              <p className="text-base text-foreground-muted leading-relaxed">
                Seamlessly pass massive datasets, context windows, or downloaded files between completely separate autonomous models and human reviewers.
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


          {/* Recommended Privacy Tools (Affiliate) */}
          <RecommendedTools />

          {/* Chrome Extension CTA */}
          <a
            href="https://chromewebstore.google.com/detail/pclip-cloud-clipboard/dcdppgjojehkngjhcdklkdbalegbmkin?hl=en&authuser=0"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center p-5 rounded-xl bg-surface/50 border border-border-color hover:border-accent hover:bg-surface transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg group max-w-2xl mx-auto w-full"
          >
            <div className="flex items-center gap-2 mb-1">
              <svg className="w-6 h-6 text-foreground group-hover:text-accent transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
              </svg>
              <span className="text-lg font-bold tracking-tight text-foreground group-hover:text-accent transition-colors">Install the Chrome Extension</span>
            </div>
            <p className="text-foreground-muted text-xs font-medium group-hover:text-foreground transition-colors">
              Right-click to send text and images instantly to your cloud drive.
            </p>
          </a>

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
