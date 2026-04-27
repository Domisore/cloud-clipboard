import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";
import { HowItWorks } from "@/components/ui/HowItWorks";
import { TokenBenchmark } from "@/components/ui/TokenBenchmark";
import { InstallationGuide } from "@/components/ui/InstallationGuide";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ProtocolPage() {
  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-accent/30 selection:text-foreground">
      <Header />

      <main className="flex-1 flex flex-col relative pt-24 pb-12 px-4 sm:px-6 max-w-5xl mx-auto w-full">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-foreground-muted hover:text-foreground mb-12 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          BACK TO HOME
        </Link>

        <section className="mb-20">
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight mb-6 text-foreground">
            The Agentic <span className="text-accent">Protocol.</span>
          </h1>
          <p className="text-xl text-foreground-muted leading-relaxed max-w-3xl">
            Detailed technical specifications, benchmarks, and integration guides for the Drive.io persistence and storage system.
          </p>
        </section>

        {/* Differentiation Callout Section */}
        <div className="w-full mb-32 py-16 px-6 rounded-3xl bg-surface/20 border border-border-color/30 backdrop-blur-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl -z-10 group-hover:bg-accent/10 transition-colors"></div>
          
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <div className="flex-1 space-y-6">
              <h2 className="text-3xl font-bold text-foreground leading-tight">
                Not a memory layer. <br />A <span className="text-accent">persistent hard drive.</span>
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
                      <td className="px-4 py-4 font-bold text-accent">Knowledge Graph</td>
                      <td className="px-4 py-4 text-accent/90 text-xs font-semibold">Agents lose the "connective tissue" between scattered artifacts</td>
                      <td className="px-4 py-4 text-accent/90 text-xs font-bold">Drive.io (Relational)</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-4 font-bold text-foreground">Hard Drive</td>
                      <td className="px-4 py-4 text-foreground-muted text-xs font-semibold">Passing large files mid-run blows up token budgets</td>
                      <td className="px-4 py-4 text-foreground-muted text-xs font-bold">Drive.io (L0)</td>
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
                Drive.io's lane is specifically <strong>intra-pipeline persistence</strong>: the moment one agent needs to park something large for another to retrieve later, without either agent's context window paying the price.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-32">
          <section id="how-it-works">
            <h2 className="text-3xl font-bold mb-8">System Architecture</h2>
            <HowItWorks />
          </section>

          <section id="benchmarks">
            <h2 className="text-3xl font-bold mb-8">Performance Benchmarks</h2>
            <TokenBenchmark />
          </section>

          <section id="knowledge-graph">
            <h2 className="text-3xl font-bold mb-8">Knowledge Graph Protocol</h2>
            <div className="p-8 rounded-3xl bg-surface/30 border border-border-color/50 backdrop-blur-sm space-y-6">
              <p className="text-foreground-muted leading-relaxed">
                Drive.io implements a relational metadata layer that treats stored artifacts as nodes in a graph. This allows agents to perform <strong>"Semantic Traversal"</strong>—finding related information based on project context rather than keyword search.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <h4 className="font-bold text-accent text-sm uppercase tracking-widest">Structural RAG</h4>
                  <p className="text-sm text-foreground-muted">Uses Tree-sitter and AST analysis to map code repositories. Agents can query neighbors, call-sites, and implementation details through a single graph pointer.</p>
                </div>
                <div className="space-y-3">
                  <h4 className="font-bold text-accent text-sm uppercase tracking-widest">Multi-Modal Linking</h4>
                  <p className="text-sm text-foreground-muted">Automatically links prose (READMEs), visuals (Diagrams), and code. The protocol supports bi-directional mapping between disparate file types.</p>
                </div>
              </div>
            </div>
          </section>

          <section id="integration">
             <div className="bg-surface/50 border-y border-border-color py-24 my-16 backdrop-blur-sm relative overflow-hidden rounded-3xl">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent to-transparent"></div>
              <div className="max-w-4xl mx-auto px-6 text-center">
                <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-8 leading-tight">
                  The Cross-Framework Storage Layer
                </h2>
                <p className="text-foreground text-lg mb-10 leading-relaxed max-w-2xl mx-auto">
                  Drive.io defines a neutral standard for artifact persistence. Whether your swarm is built on LangGraph, CrewAI, or AutoGen, our protocol ensures that data remains accessible and context windows remain clean.
                </p>
                <div className="flex flex-wrap justify-center gap-6 opacity-60">
                    <span className="text-sm font-bold tracking-widest uppercase">LangGraph</span>
                    <span className="text-sm font-bold tracking-widest uppercase">CrewAI</span>
                    <span className="text-sm font-bold tracking-widest uppercase">AutoGen</span>
                    <span className="text-sm font-bold tracking-widest uppercase">Semantic Kernel</span>
                </div>
              </div>
            </div>
            <h2 className="text-3xl font-bold mb-8">Implementation Guide</h2>
            <InstallationGuide />
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
