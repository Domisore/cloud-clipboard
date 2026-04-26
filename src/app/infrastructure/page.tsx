import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";
import { HowItWorks } from "@/components/ui/HowItWorks";
import { TokenBenchmark } from "@/components/ui/TokenBenchmark";
import { InstallationGuide } from "@/components/ui/InstallationGuide";
import { PclipPromoBanner } from "@/components/ui/PclipPromoBanner";
import { CarbonAd } from "@/components/ui/CarbonAd";
import { RecommendedTools } from "@/components/monetization/RecommendedTools";
import { Sparkles, Activity, Layers, Zap } from "lucide-react";
import { VisitorBadge } from "@/components/ui/VisitorBadge";

export default function InfrastructurePage() {
  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-accent/30 selection:text-foreground bg-white">
      <Header />

      <main className="flex-1 flex flex-col relative pt-32 pb-20">
        
        {/* Hero Section for Infrastructure */}
        <div className="max-w-7xl mx-auto px-6 w-full mb-24">
          <div className="flex flex-col items-center text-center space-y-6 max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-bold uppercase tracking-widest">
                <Activity className="w-3 h-3" /> Core Infrastructure
            </div>
            <h1 className="text-4xl md:text-7xl font-bold tracking-tight text-foreground leading-tight">
              The Engine behind <br />
              <span className="text-accent underline underline-offset-8 decoration-accent/20">Agentic Workflows</span>
            </h1>
            <p className="text-xl text-foreground-muted max-w-3xl leading-relaxed">
              While Drive.io provides a simple document management interface for humans, under the hood it is a high-performance handoff layer for AI agents.
            </p>
          </div>
        </div>

        {/* Comparison Table Section */}
        <div className="max-w-7xl mx-auto px-6 w-full mb-32">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start py-20 px-8 md:px-12 rounded-[2.5rem] bg-surface border border-border-color shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-[100px] -z-10"></div>
            
            <div className="lg:col-span-7 space-y-8">
              <div className="space-y-4">
                <h2 className="text-3xl md:text-5xl font-bold text-foreground leading-tight">
                  Not memory. <br /><span className="text-accent">A handoff layer.</span>
                </h2>
                <p className="text-foreground-muted text-lg leading-relaxed max-w-xl">
                  Infrastructure for AI agents is evolving. Drive.io solves the specific bottleneck of passing heavy data between steps.
                </p>
              </div>
              
              <div className="overflow-hidden rounded-2xl border border-border-color bg-white shadow-xl">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="bg-surface border-b border-border-color">
                      <th className="px-6 py-4 font-bold text-foreground uppercase tracking-widest text-[10px]">What it is</th>
                      <th className="px-6 py-4 font-bold text-foreground uppercase tracking-widest text-[10px]">What it solves</th>
                      <th className="px-6 py-4 font-bold text-foreground uppercase tracking-widest text-[10px]">Example</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-color">
                    <tr className="hover:bg-surface/50 transition-colors">
                      <td className="px-6 py-5 font-bold text-foreground flex items-center gap-2">
                        <Activity className="w-4 h-4 text-zinc-400" /> Memory
                      </td>
                      <td className="px-6 py-5 text-foreground-muted leading-relaxed">Remembers past sessions and users</td>
                      <td className="px-6 py-5 text-foreground-muted font-mono text-[10px]">Mem0</td>
                    </tr>
                    <tr className="bg-accent/5 hover:bg-accent/10 transition-colors">
                      <td className="px-6 py-5 font-bold text-accent flex items-center gap-2 text-base">
                        <Zap className="w-4 h-4" /> Handoffs
                      </td>
                      <td className="px-6 py-5 text-accent/80 font-medium leading-relaxed">Passing large files without blowing up tokens</td>
                      <td className="px-6 py-5 text-accent/90 font-bold font-mono text-[11px]">Drive.io</td>
                    </tr>
                    <tr className="hover:bg-surface/50 transition-colors">
                      <td className="px-6 py-5 font-bold text-foreground flex items-center gap-2">
                        <Layers className="w-4 h-4 text-zinc-400" /> Orchestration
                      </td>
                      <td className="px-6 py-5 text-foreground-muted leading-relaxed">Coordinating agent tasks and dependencies</td>
                      <td className="px-6 py-5 text-foreground-muted font-mono text-[10px]">LangGraph, CrewAI</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="lg:col-span-5 flex flex-col gap-8 h-full justify-center">
              <div className="p-8 rounded-3xl bg-white border border-border-color shadow-lg space-y-4">
                <p className="text-foreground-muted text-base leading-relaxed">
                  These layers work together. Use <strong>Mem0</strong> to remember your user's name, <strong>Drive.io</strong> to pass them a 50MB PDF, and <strong>LangGraph</strong> to coordinate the workflow.
                </p>
                <div className="pt-4 border-t border-border-color">
                   <p className="text-foreground text-sm leading-relaxed border-l-4 border-accent pl-6 italic bg-accent/5 py-6 rounded-r-2xl font-medium">
                    &quot;Drive.io's job is simple: <strong>intra-pipeline efficiency</strong>. The moment one agent needs to hand something heavy to another, we handle the lift.&quot;
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Research Quote Section */}
        <section className="py-24 px-6 bg-slate-900 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-[50%] h-full bg-accent/20 blur-[120px] -z-0"></div>
            <div className="max-w-4xl mx-auto text-center relative z-10">
                <p className="text-3xl md:text-4xl font-medium mb-10 italic leading-tight">
                    &quot;Passing raw data between agents consumes an average of 6,411 tokens per run versus 841 tokens with a pointer-based relay.&quot;
                </p>
                <div className="flex items-center justify-center gap-3 text-sm">
                    <span className="font-bold px-3 py-1 rounded bg-white/10 border border-white/20 text-white tracking-widest uppercase text-[10px]">Research Study</span>
                    <span className="opacity-60">— Arxiv (Nov 2024)</span>
                </div>
            </div>
        </section>

        <div className="max-w-7xl mx-auto px-6 w-full">
            <HowItWorks />
            
            <div className="my-32">
                <TokenBenchmark />
            </div>

            <div className="my-32">
                <InstallationGuide />
            </div>

            <div className="max-w-4xl mx-auto w-full mb-24">
                <PclipPromoBanner />
            </div>

            <RecommendedTools />

            <div className="flex flex-col items-center justify-center mt-32 gap-6 pb-20">
                <CarbonAd />
                <VisitorBadge />
            </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
