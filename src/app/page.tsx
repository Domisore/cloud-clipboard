import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";
import Link from "next/link";
import { CarbonAd } from "@/components/ui/CarbonAd";
import { PclipPromoBanner } from "@/components/ui/PclipPromoBanner";
import { VisitorBadge } from "@/components/ui/VisitorBadge";
import { ChatCard, ChatSimulationSection } from "@/components/ui/ChatSimulation";
import { FileText, Search, Zap, Shield, Sparkles, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-accent/30 selection:text-foreground overflow-x-hidden">

      <Header />

      <main className="flex-1 flex flex-col relative">
        
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-32 px-6 overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px] -z-10 animate-pulse"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/10 rounded-full blur-[120px] -z-10"></div>
            
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div className="flex flex-col items-start space-y-8 animate-slide-up">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-bold uppercase tracking-widest">
                        <Sparkles className="w-3 h-3" /> Introducing Semantic Document Search
                    </div>
                    
                    <h1 className="text-5xl sm:text-7xl font-bold tracking-tight text-foreground leading-[1.1]">
                        Every document, <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-purple-400">instantly found.</span>
                    </h1>
                    
                    <p className="text-xl text-foreground-muted leading-relaxed max-w-xl">
                        The smartest way to search and manage your documents. No folders. No digging. Just ask your AI to find, summarize, or send any document in your library.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                        <Link
                            href="/dashboard"
                            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-accent text-background font-bold text-lg hover:bg-accent/90 transition-all shadow-xl shadow-accent/20 hover:translate-y-[-2px] active:translate-y-[0px] flex items-center justify-center gap-2"
                        >
                            Start for Free <ArrowRight className="w-5 h-5" />
                        </Link>
                        <Link
                            href="/infrastructure"
                            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-surface border border-white/10 text-foreground font-bold text-lg hover:bg-white/5 transition-all text-center"
                        >
                            How it works
                        </Link>
                    </div>
                    
                    <div className="flex items-center gap-6 pt-4 grayscale opacity-50">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Trusted for</span>
                        <div className="flex gap-4">
                            <FileText className="w-5 h-5" />
                            <Search className="w-5 h-5" />
                            <Shield className="w-5 h-5" />
                        </div>
                    </div>
                </div>
                
                <div className="relative animate-fade-in delay-200">
                    <div className="absolute inset-0 bg-accent/20 rounded-[3rem] blur-3xl -z-10 scale-90"></div>
                    <ChatCard
                        variant="hero"
                        userRequest="Get me the Q3 2025 sales document and send a copy to Sarah in accounting."
                        agentResponse="I've located the Q3 Sales Report. I am now preparing to forward a copy to Sarah from the Accounting department."
                        attachment={{
                            type: "document",
                            name: "Q3-Sales-Report-2025.pdf",
                            size: "1.4 MB"
                        }}
                    />
                    
                    {/* Floating Detail Elements */}
                    <div className="absolute -top-6 -right-6 p-4 rounded-2xl bg-zinc-900/80 border border-white/10 backdrop-blur-xl shadow-2xl hidden md:block animate-bounce [animation-duration:3s]">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                            <span className="text-xs font-bold text-white uppercase tracking-widest whitespace-nowrap">Semantic Indexing Active</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* Feature Grid */}
        <section className="py-24 px-6 bg-surface border-y border-border-color/50">

            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    <div className="space-y-4">
                        <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center text-accent">
                            <Search className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold">Natural Language Search</h3>
                        <p className="text-foreground-muted leading-relaxed">
                            Stop remembering file names. Search by content, context, or even vague descriptions of what you're looking for.
                        </p>
                    </div>
                    <div className="space-y-4">
                        <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-400">
                            <Zap className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold">Instant Summaries</h3>
                        <p className="text-foreground-muted leading-relaxed">
                            Don't have time to read a 50-page PDF? Ask Drive.io to summarize the key points or pull out specific data.
                        </p>
                    </div>
                    <div className="space-y-4">
                        <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                            <Shield className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold">Secure by Design</h3>
                        <p className="text-foreground-muted leading-relaxed">
                            Your documents are encrypted and processed with the highest privacy standards. We don't train on your data.
                        </p>
                    </div>
                </div>
            </div>
        </section>

        {/* Interaction Examples */}
        <ChatSimulationSection />

        {/* Pclip Chrome Extension CTA */}
        <div className="max-w-4xl mx-auto w-full px-6 mb-32">
            <div className="flex items-center gap-2 mb-6">
              <span className="h-px flex-1 bg-border-color/50"></span>
              <span className="text-[10px] font-bold text-foreground-muted uppercase tracking-[0.2em] whitespace-nowrap px-4">Also by the Drive.io Team</span>
              <span className="h-px flex-1 bg-border-color/50"></span>
            </div>
            <a
              href="https://chromewebstore.google.com/detail/pclip-cloud-clipboard/dcdppgjojehkngjhcdklkdbalegbmkin?hl=en&authuser=0"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col md:flex-row items-center gap-8 p-8 rounded-[2.5rem] bg-gradient-to-br from-indigo-500/5 to-surface border border-accent/20 hover:border-accent/40 transition-all group shadow-xl"
            >

              <div className="w-20 h-20 rounded-[2rem] bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shrink-0">
                  <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                  </svg>
              </div>
              <div className="flex flex-col space-y-2">
                <span className="text-2xl font-bold text-white transition-colors">Install Pclip Extension</span>
                <p className="text-foreground-muted text-lg leading-relaxed max-w-xl group-hover:text-foreground transition-colors">
                    The independent, human-centric way to send text and images instantly to your Pclip cloud clipboard.
                </p>
              </div>
              <div className="ml-auto opacity-40 group-hover:opacity-100 group-hover:translate-x-2 transition-all">
                  <ArrowRight className="w-8 h-8" />
              </div>
            </a>
        </div>

        <div className="flex justify-center pb-20 opacity-80 hover:opacity-100 transition-opacity">
          <CarbonAd />
          <VisitorBadge />
        </div>
      </main>

      <Footer />
    </div>
  );
}
