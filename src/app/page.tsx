import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";
import Link from "next/link";
import { CarbonAd } from "@/components/ui/CarbonAd";
import { PclipPromoBanner } from "@/components/ui/PclipPromoBanner";
import { AgentSplash } from "@/components/moltbot/AgentSplash";
import { VisitorBadge } from "@/components/ui/VisitorBadge";
import { ArrowRight, HardDrive, Zap, ShieldCheck } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-accent/30 selection:text-foreground">

      <Header />

      <main className="flex-1 flex flex-col relative pt-20 sm:pt-32 pb-8 sm:pb-12 px-4 sm:px-6">

        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto mb-20 animate-fade-in relative z-10">
          <Link href="/agents" className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-300 text-sm font-medium mb-8 hover:bg-purple-500/20 transition-colors">
            <span className="flex items-center justify-center p-0.5 rounded-full bg-purple-500/20">
              <img src="/moltbot-2.png" alt="Moltbot" className="w-5 h-5 rounded-full" />
            </span>
            New: Agent-to-Agent File Sharing is here
          </Link>
          
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight mb-6 text-foreground leading-tight">
            The <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-blue-400">Hard Drive</span> for <br className="hidden sm:block" /> AI Agents.
          </h1>
          
          <p className="text-xl sm:text-2xl font-medium text-foreground-muted mb-10 leading-relaxed max-w-2xl mx-auto">
            A neutral, cross-framework persistence layer for LangGraph, CrewAI, and beyond. Slash token costs by passing 7-token pointers instead of raw payloads.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-accent text-background font-bold text-lg hover:bg-accent/90 transition-all shadow-lg hover:translate-y-[-2px] active:translate-y-[2px]"
            >
              Get Started Free
            </Link>
            <Link
              href="/protocol"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-surface border border-border-color text-foreground font-bold text-lg hover:bg-white/5 transition-all flex items-center justify-center gap-2"
            >
              View Protocol <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* Core Value Props - 3 Simple Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-32">
          <div className="p-8 rounded-3xl bg-surface/30 border border-border-color/50 backdrop-blur-sm">
            <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center text-accent mb-6">
              <HardDrive className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-3">Infinite Persistence</h3>
            <p className="text-foreground-muted leading-relaxed">
              Give your agents a dedicated space to store and retrieve artifacts without bloating their context window.
            </p>
          </div>
          
          <div className="p-8 rounded-3xl bg-surface/30 border border-border-color/50 backdrop-blur-sm">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 mb-6">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-3">O(1) Token Scaling</h3>
            <p className="text-foreground-muted leading-relaxed">
              Pass datasets of any size between models using small pointers. Reduce token overhead by up to 99%.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-surface/30 border border-border-color/50 backdrop-blur-sm">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-6">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-3">Structural Intelligence</h3>
            <p className="text-foreground-muted leading-relaxed">
              Drive.io understands relationships. It doesn't just store files; it maps how your code, notes, and data connect.
            </p>
          </div>
        </div>

        {/* New "Connect the Dots" Section for Normies */}
        <div className="max-w-6xl mx-auto mb-32 px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
                The Hard Drive with <br/> <span className="text-accent">Artificial Intuition.</span>
              </h2>
              <p className="text-lg text-foreground-muted mb-8 leading-relaxed">
                Traditional storage is like a dumb closet—you throw things in and hope to find them later. Drive.io is like a personal researcher that remembers <strong>why</strong> you saved something and <strong>what</strong> it relates to.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                  <p className="text-foreground-muted font-medium"><span className="text-foreground">Stop Organizing:</span> Files organize themselves based on your project context.</p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                  <p className="text-foreground-muted font-medium"><span className="text-foreground">Cross-File Memory:</span> Your AI assistant remembers relationships across different sessions.</p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                  <p className="text-foreground-muted font-medium"><span className="text-foreground">Skip the Search:</span> Find the right information by following the map, not by guessing filenames.</p>
                </li>
              </ul>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-[40px] bg-gradient-to-tr from-accent/20 to-blue-500/10 border border-white/5 flex items-center justify-center overflow-hidden">
                {/* Visual representation of a Knowledge Graph (Static mockup) */}
                <div className="relative w-64 h-64">
                   <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-16 rounded-2xl bg-accent/20 border border-accent/40 flex items-center justify-center backdrop-blur-xl animate-pulse">
                      <HardDrive className="w-8 h-8 text-accent" />
                   </div>
                   <div className="absolute bottom-0 left-0 w-14 h-14 rounded-2xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center" />
                   <div className="absolute bottom-0 right-0 w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center" />
                   <svg className="absolute inset-0 w-full h-full -z-10" viewBox="0 0 100 100">
                      <line x1="50" y1="20" x2="15" y2="80" stroke="currentColor" strokeOpacity="0.2" strokeWidth="0.5" />
                      <line x1="50" y1="20" x2="85" y2="80" stroke="currentColor" strokeOpacity="0.2" strokeWidth="0.5" />
                   </svg>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 p-6 rounded-3xl bg-surface border border-border-color shadow-2xl backdrop-blur-xl max-w-[240px]">
                 <p className="text-sm font-bold text-foreground mb-1">Semantic Match Found</p>
                 <p className="text-xs text-foreground-muted">"Design Spec" relates to "Landing Page Code" via Architecture Map.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Demo */}
        <div className="w-full max-w-5xl mx-auto mb-32">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Try the Hard Drive Demo</h2>
            <p className="text-foreground-muted">See how agents talk to each other through the Drive.io deep storage layer.</p>
          </div>
          <AgentSplash />
        </div>

        {/* Pclip Prominent Promo Banner */}
        <div className="max-w-4xl mx-auto w-full mb-24 opacity-80 hover:opacity-100 transition-opacity">
            <PclipPromoBanner />
        </div>

        {/* Final CTA */}
        <div className="max-w-4xl mx-auto w-full text-center py-20 px-8 rounded-[40px] bg-gradient-to-b from-surface to-transparent border border-border-color/30 mb-24">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-8">Ready to offload your context?</h2>
          <Link
            href="/dashboard"
            className="inline-flex px-10 py-5 rounded-2xl bg-accent text-background font-bold text-xl hover:bg-accent/90 transition-all shadow-2xl hover:scale-105"
          >
            Get Your Agent API Key
          </Link>
          <div className="mt-8 text-foreground-muted text-sm font-medium tracking-widest uppercase">
            No Credit Card Required • Developer-First
          </div>
        </div>

        <div className="max-w-5xl mx-auto w-full flex flex-col gap-12 items-center">
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
