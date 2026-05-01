import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";
import Link from "next/link";
import { CarbonAd } from "@/components/ui/CarbonAd";
import { PclipPromoBanner } from "@/components/ui/PclipPromoBanner";
import { AgentSplash } from "@/components/moltbot/AgentSplash";
import { VisitorBadge } from "@/components/ui/VisitorBadge";
import { CodeTabs } from "@/components/ui/CodeTabs";
import { ProcessFlow } from "@/components/ui/ProcessFlow";
import { ArrowRight, HardDrive, Zap, ShieldCheck, Database, Share2, Cpu } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-accent/30 selection:text-foreground">
      <Header />

      <main className="flex-1 flex flex-col relative pt-32 pb-20 px-4 sm:px-6">
        {/* Hero Section */}
        <div className="text-center max-w-5xl mx-auto mb-32 animate-fade-in relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/5 border border-accent/20 text-accent text-xs font-black uppercase tracking-[0.2em] mb-8 animate-in fade-in slide-in-from-top-4 duration-1000">
            The Infrastructure Layer for Agentic Memory
          </div>
          
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tighter mb-8 text-foreground leading-[0.9] italic">
            The Hard Drive <br />
            <span className="text-accent underline decoration-accent/10 italic">for AI Agents.</span>
          </h1>
          
          <p className="text-xl sm:text-2xl font-bold text-foreground-muted mb-12 leading-relaxed max-w-3xl mx-auto">
            Partition your agent state. Offload your context window to a neutral storage layer. Partition, persist, and relay artifacts between model generations with O(1) efficiency.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto px-12 py-6 rounded-[2rem] bg-accent text-white font-black text-xl hover:scale-105 transition-all shadow-[0_20px_50px_-10px_rgba(139,92,246,0.5)] flex items-center justify-center gap-3"
            >
              Start for Free <ArrowRight className="w-6 h-6" />
            </Link>
            <Link
              href="/protocol"
              className="w-full sm:w-auto px-12 py-6 rounded-[2rem] bg-white border border-border text-foreground font-black text-xl hover:bg-muted/50 transition-all flex items-center justify-center gap-2"
            >
              View Docs
            </Link>
          </div>

          <div className="mt-16 flex items-center justify-center gap-8 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
             <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest">
               <Cpu className="w-4 h-4" /> LangGraph Compatible
             </div>
             <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest">
               <Database className="w-4 h-4" /> Vector Optimized
             </div>
             <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest">
               <Share2 className="w-4 h-4" /> Multi-Agent Sync
             </div>
          </div>
        </div>

        {/* Feature Grid - Bento Style */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 max-w-7xl mx-auto mb-40 px-4">
          <div className="md:col-span-8 bento-card hover:bento-card-hover group">
            <div className="flex flex-col h-full justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center text-accent mb-6 group-hover:scale-110 transition-transform">
                  <Database className="w-6 h-6" />
                </div>
                <h3 className="text-3xl font-black text-foreground mb-4 uppercase italic">State Partitioning</h3>
                <p className="text-foreground-muted text-lg font-medium leading-relaxed max-w-xl">
                  Mount dedicated partitions for every agent swarm. Drive.io ensures that your AutoGen swarms and LangGraph flows share a consistent, versioned filesystem of state.
                </p>
              </div>
              <div className="mt-12 pt-8 border-t border-border/50">
                 <p className="text-xs font-black text-accent uppercase tracking-widest">Read/Write latency &lt; 50ms • Global Edge Distribution</p>
              </div>
            </div>
          </div>

          <div className="md:col-span-4 bento-card hover:bento-card-hover group bg-accent/5 !border-accent/20">
            <div className="w-12 h-12 rounded-2xl bg-accent text-white flex items-center justify-center mb-6">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-black text-foreground mb-4 uppercase italic leading-none">Hot-Swappable <br/>Memory</h3>
            <p className="text-foreground-muted font-medium leading-relaxed">
              Detach memories from one agent and mount them to another instantly. Seamlessly hand off task context between model tiers.
            </p>
          </div>

          <div className="md:col-span-4 bento-card hover:bento-card-hover group">
            <h3 className="text-2xl font-black text-foreground mb-4 uppercase italic">L1 Context <br/>Caching</h3>
            <p className="text-foreground-muted font-medium leading-relaxed">
              Cache frequently used prompts and agent tool definitions in the storage layer. Reduce cold-start overhead for serverless agent nodes.
            </p>
          </div>

          <div className="md:col-span-8 bento-card hover:bento-card-hover group flex flex-col md:flex-row gap-12 items-center">
             <div className="flex-1">
                <h3 className="text-3xl font-black text-foreground mb-4 uppercase italic">Smart Visibility</h3>
                <p className="text-foreground-muted text-lg font-medium leading-relaxed">
                  Monitor exactly what your agents are storing. Edit, prune, or expand their long-term memory via the Mission Control dashboard.
                </p>
             </div>
             <div className="flex-1 w-full flex justify-center">
                <div className="w-full h-32 bg-muted/50 rounded-2xl border border-dashed border-border flex items-center justify-center text-[10px] font-black text-foreground-muted uppercase tracking-[0.3em]">
                   Dashboard Visualization
                </div>
             </div>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="max-w-7xl mx-auto mb-48 px-4 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div>
            <div className="inline-block px-3 py-1 bg-accent/10 border border-accent/20 rounded-full mb-6">
              <span className="text-[10px] font-black text-accent uppercase tracking-widest leading-none">I/O Lifecycle</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-foreground tracking-tighter uppercase italic mb-8">
              Read. Write. <br/><span className="text-accent underline decoration-accent/10 italic">Remember.</span>
            </h2>
            <p className="text-xl text-foreground-muted font-medium leading-relaxed mb-12">
              Drive.io is the physical storage layer for the agentic web. Standardize your memory I/O and give your agents a filesystem they can finally trust.
            </p>
            <ProcessFlow />
          </div>
          <div className="space-y-8">
            <CodeTabs />
            <div className="p-8 bento-card border-dashed bg-accent/5">
               <h4 className="text-sm font-black text-accent uppercase tracking-widest mb-4">Metric: Context Reduction</h4>
               <div className="flex items-center gap-4">
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                     <div className="h-full bg-accent w-[99%]" />
                  </div>
                  <span className="text-lg font-black text-foreground italic">99.1%</span>
               </div>
               <p className="text-[10px] text-foreground-muted font-bold uppercase tracking-widest mt-4 leading-relaxed">
                 Average reduction in context window usage when using pointers for large artifact relay.
               </p>
            </div>
          </div>
        </div>

        {/* Promo Section */}
        <div className="max-w-5xl mx-auto w-full mb-40">
           <div className="text-center mb-16">
              <h2 className="text-3xl font-black text-foreground mb-4 uppercase tracking-tighter italic">Integrated Experience</h2>
              <div className="h-1 w-20 bg-accent/20 mx-auto rounded-full" />
           </div>
           <PclipPromoBanner />
        </div>

        {/* Final CTA */}
        <div className="max-w-4xl mx-auto w-full text-center py-24 px-8 rounded-[3rem] bg-white border border-border shadow-2xl mb-32 relative overflow-hidden group">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-accent/5 blur-[100px] rounded-full pointer-events-none" />
          <h2 className="text-4xl md:text-6xl font-black text-foreground mb-10 tracking-tighter uppercase italic relative z-10">Ready to Upgrade <br/>Your Agentic Memory?</h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto px-12 py-6 rounded-[2rem] bg-accent text-white font-black text-xl hover:scale-105 transition-all shadow-xl"
            >
              Get Your API Key
            </Link>
            <Link
              href="/pricing"
              className="w-full sm:w-auto px-12 py-6 rounded-[2rem] bg-white border border-border text-foreground font-black text-xl hover:bg-muted/50 transition-all"
            >
              View Pricing
            </Link>
          </div>
          <div className="mt-12 text-foreground-muted text-[10px] font-black tracking-[0.3em] uppercase relative z-10">
            Developer-First • No Credit Card • Open Protocol
          </div>
        </div>

        <div className="max-w-5xl mx-auto w-full flex flex-col gap-12 items-center">
          <div className="flex justify-center opacity-60 hover:opacity-100 transition-opacity">
            <CarbonAd />
          </div>
          <VisitorBadge />
        </div>
      </main>

      <Footer />
    </div>
  );
}
