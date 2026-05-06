import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";
import Link from "next/link";
import { CarbonAd } from "@/components/ui/CarbonAd";
import { PclipPromoBanner } from "@/components/ui/PclipPromoBanner";
import { AgentSplash } from "@/components/moltbot/AgentSplash";
import { VisitorBadge } from "@/components/ui/VisitorBadge";
import { CodeTabs } from "@/components/ui/CodeTabs";
import { ProcessFlow } from "@/components/ui/ProcessFlow";
import { ArrowRight, HardDrive, Zap, ShieldCheck, Database, Share2, Cpu, FileText, FileJson, Search } from "lucide-react";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const { userId } = await auth();
  
  if (userId) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-accent/30 selection:text-foreground">
      <Header />

      <main className="flex-1 flex flex-col relative pt-32 pb-20 px-4 sm:px-6">
        {/* Hero Section */}
        <div className="text-center max-w-5xl mx-auto mb-32 animate-fade-in relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/5 border border-accent/20 text-accent text-xs font-black uppercase tracking-[0.2em] mb-8 animate-in fade-in slide-in-from-top-4 duration-1000">
            Universal Storage for AI Assistants
          </div>
          
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tighter mb-8 text-foreground leading-[0.9] italic">
            The Hard Drive <br />
            <span className="text-accent underline decoration-accent/10 italic">for AI Agents.</span>
          </h1>
          
          <p className="text-xl sm:text-2xl font-bold text-foreground-muted mb-12 leading-relaxed max-w-3xl mx-auto">
            Give your AI agents a secure place to store files, share documents, and remember past conversations. Stop pasting the same text into chat windows—just give your AI a hard drive.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto px-12 py-6 rounded-[2rem] bg-accent text-white font-black text-xl hover:scale-105 transition-all shadow-[0_20px_50px_-10px_rgba(139,92,246,0.5)] flex items-center justify-center gap-3"
            >
              Start for Free <ArrowRight className="w-6 h-6" />
            </Link>
            <Link
              href="/developers"
              className="w-full sm:w-auto px-12 py-6 rounded-[2rem] bg-white border border-border text-foreground font-black text-xl hover:bg-muted/50 transition-all flex items-center justify-center gap-2"
            >
              View Docs
            </Link>
          </div>

          <div className="mt-16 flex items-center justify-center gap-8 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
             <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest">
               <Cpu className="w-4 h-4" /> Works with Cursor
             </div>
             <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest">
               <Database className="w-4 h-4" /> Universal Access
             </div>
             <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest">
               <Share2 className="w-4 h-4" /> Cross-Platform Sync
             </div>
          </div>
        </div>

        {/* Dashboard Screenshot */}
        <div className="max-w-6xl mx-auto mb-40 px-4 relative group animate-fade-in" style={{ animationDelay: '0.2s' }}>
           <div className="absolute inset-0 bg-accent/20 blur-[100px] rounded-[3rem] opacity-50 group-hover:opacity-80 transition-opacity duration-700" />
           <div className="relative rounded-[2rem] overflow-hidden border border-border/50 shadow-2xl bg-[#0c0c0d] p-2 backdrop-blur-sm">
              <img src="/dashboard-screenshot.png" alt="Drive.io Dashboard" className="w-full h-auto rounded-[1.5rem] border border-border/30 opacity-90 group-hover:opacity-100 transition-opacity" />
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
                <h3 className="text-3xl font-black text-foreground mb-4 uppercase italic">Organized Workspaces</h3>
                <p className="text-foreground-muted text-lg font-medium leading-relaxed max-w-xl">
                  Create dedicated folders for different AI agents. Keep your research assistant's files completely separate from your coding assistant's context.
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
            <h3 className="text-2xl font-black text-foreground mb-4 uppercase italic leading-none">Seamless <br/>Sharing</h3>
            <p className="text-foreground-muted font-medium leading-relaxed">
              Instantly transfer files and context from one AI tool to another. Let your data flow freely between platforms.
            </p>
          </div>

          <div className="md:col-span-4 bento-card hover:bento-card-hover group">
            <h3 className="text-2xl font-black text-foreground mb-4 uppercase italic">Long-Term <br/>Memory</h3>
            <p className="text-foreground-muted font-medium leading-relaxed">
              Stop repeating yourself. Let your AI securely store its instructions, brand guidelines, and past work for instant recall.
            </p>
          </div>

          <div className="md:col-span-8 bento-card hover:bento-card-hover group flex flex-col md:flex-row gap-12 items-center">
             <div className="flex-1">
                <h3 className="text-3xl font-black text-foreground mb-4 uppercase italic">Full Control Dashboard</h3>
                <p className="text-foreground-muted text-lg font-medium leading-relaxed">
                  See exactly what your AI is saving, reading, and sharing in a simple, human-readable dashboard. You are always in control of your data.
                </p>
             </div>
             <div className="flex-1 w-full relative">
                {/* Decorative glow */}
                <div className="absolute inset-0 bg-accent/20 blur-3xl rounded-full" />
                
                {/* Mini Dashboard Window */}
                <div className="relative bg-[#0c0c0d] border border-border rounded-xl shadow-2xl overflow-hidden flex flex-col">
                   {/* Mini Header */}
                   <div className="flex items-center justify-between p-3 border-b border-border bg-surface/50">
                      <div className="flex gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
                      </div>
                      <div className="text-[10px] font-mono text-zinc-500 flex items-center gap-2 px-2 py-1 bg-black rounded-md border border-border">
                        <Search size={10} /> Search artifacts...
                      </div>
                   </div>
                   
                   {/* Artifact Rows */}
                   <div className="p-3 space-y-2">
                      <div className="flex items-center gap-3 p-2 bg-surface/40 rounded-lg border border-border/50 hover:border-border transition-colors">
                          <div className="p-1.5 bg-black rounded-lg border border-border">
                              <FileText size={14} className="text-blue-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-0.5">
                                  <span className="text-xs font-bold text-zinc-200 truncate">customer_context.md</span>
                                  <span className="px-1.5 py-0.5 rounded bg-zinc-800 text-[8px] uppercase font-bold text-zinc-400">Support-Agent</span>
                              </div>
                              <div className="text-[10px] text-zinc-500 font-mono flex items-center gap-2">
                                  <span>drive://ptr_8x2j9k</span>
                                  <span>•</span>
                                  <span>2m ago</span>
                              </div>
                          </div>
                      </div>

                      <div className="flex items-center gap-3 p-2 bg-surface/40 rounded-lg border border-border/50 hover:border-border transition-colors">
                          <div className="p-1.5 bg-black rounded-lg border border-border">
                              <FileJson size={14} className="text-yellow-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-0.5">
                                  <span className="text-xs font-bold text-zinc-200 truncate">api_response.json</span>
                                  <span className="px-1.5 py-0.5 rounded bg-zinc-800 text-[8px] uppercase font-bold text-zinc-400">Data-Worker</span>
                              </div>
                              <div className="text-[10px] text-zinc-500 font-mono flex items-center gap-2">
                                  <span>drive://ptr_4m9v2q</span>
                                  <span>•</span>
                                  <span>15m ago</span>
                              </div>
                          </div>
                      </div>
                   </div>
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
              Drive.io acts as a central hub for your AI's files. Instead of cluttering your chat windows, simply point your AI to its dedicated hard drive.
            </p>
            <ProcessFlow />
          </div>
          <div className="space-y-8">
            <CodeTabs />
            <div className="p-8 bento-card border-dashed bg-accent/5">
               <h4 className="text-sm font-black text-accent uppercase tracking-widest mb-4">Metric: Time & Cost Savings</h4>
               <div className="flex items-center gap-4">
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                     <div className="h-full bg-accent w-[99%]" />
                  </div>
                  <span className="text-lg font-black text-foreground italic">99.1%</span>
               </div>
               <p className="text-[10px] text-foreground-muted font-bold uppercase tracking-widest mt-4 leading-relaxed">
                 By giving your AI direct access to files, you drastically reduce token limits, cut costs, and eliminate copy-pasting errors.
               </p>
            </div>
          </div>
        </div>

        {/* Promo Section */}
        <PclipPromoBanner />

        {/* Final CTA */}
        <div className="max-w-4xl mx-auto w-full text-center py-24 px-8 rounded-[3rem] bg-white border border-border shadow-2xl mb-32 relative overflow-hidden group">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-accent/5 blur-[100px] rounded-full pointer-events-none" />
          <h2 className="text-4xl md:text-6xl font-black text-foreground mb-10 tracking-tighter uppercase italic relative z-10">Give Your AI a <br/>Hard Drive Today</h2>
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
            Easy Setup • No Credit Card • Secure Storage
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
