import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";
import { CommandCenter } from "@/components/ui/CommandCenter";
import { RecentList } from "@/components/ui/RecentList";
import { CarbonAd } from "@/components/ui/CarbonAd";
import { HowItWorks } from "@/components/ui/HowItWorks";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-accent/30 selection:text-foreground">
      <Header />

      <main className="flex-1 flex flex-col relative pt-24 pb-12 px-4 sm:px-6">

        {/* Hero Text (Moved from Header) */}
        {/* Hero Text (Moved from Header) */}
        <div className="text-center max-w-2xl mx-auto mb-12 animate-fade-in">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4 text-foreground">
            Your Universal <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-blue-400">Cloud Clipboard.</span>
          </h1>
          <p className="text-foreground-muted text-base sm:text-lg leading-relaxed">
            Instantly move text, images, and files between your devices.<br className="hidden sm:block" />
            Create secure, ephemeral links to share with anyone. <span className="mx-1 relative inline-block before:absolute before:-inset-1 before:block before:-skew-y-3 before:bg-yellow-400 before:opacity-80 relative inline-block"><span className="relative text-black font-bold px-1">No account required.</span></span>
          </p>
        </div>

        {/* How It Works Steps */}
        <HowItWorks />

        {/* Main Interaction Area */}
        <div className="w-full max-w-5xl mx-auto flex flex-col gap-16">
          <CommandCenter />

          <RecentList />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12 pb-4 border-t border-border-color/50">
            {/* Feature 1: Simpler than Competitors */}
            <div className="p-6 rounded-2xl bg-surface/30 border border-border-color/50 hover:border-accent/30 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 16 4-4-4-4" /><path d="m6 8-4 4 4 4" /><path d="m14.5 4-5 16" /></svg>
              </div>
              <h3 className="text-foreground font-semibold mb-2 text-lg">Better than Pastebin & Filebin</h3>
              <p className="text-base text-foreground-muted leading-relaxed">
                Share code snippets with correct formatting or drag & drop generic files. No Captchas, no ads, no clutter.
              </p>
            </div>

            {/* Feature 2: Native Sharing */}
            <div className="p-6 rounded-2xl bg-surface/30 border border-border-color/50 hover:border-accent/30 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" /><polyline points="16 6 12 2 8 6" /><line x1="12" y1="2" x2="12" y2="15" /></svg>
              </div>
              <h3 className="text-foreground font-semibold mb-2 text-lg">Native Mobile Sharing</h3>
              <p className="text-base text-foreground-muted leading-relaxed">
                Install as an app to share text, images, and files directly from your system share sheet without opening a browser.
              </p>
            </div>

            {/* Feature 3: Privacy */}
            <div className="p-6 rounded-2xl bg-surface/30 border border-border-color/50 hover:border-accent/30 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-400 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" /><path d="m9 12 2 2 4-4" /></svg>
              </div>
              <h3 className="text-foreground font-semibold mb-2 text-lg">Secure & Ephemeral</h3>
              <p className="text-base text-foreground-muted leading-relaxed">
                Your data is encrypted in transit and at rest. Set files to "Burn on Read" for ultimate temporary sharing.
              </p>
            </div>
          </div>


          {/* Discord CTA */}
          <a
            href="https://discord.gg/PTtKGCmg"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center p-8 rounded-2xl bg-[#5865F2] hover:bg-[#4752C4] text-white transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-xl group"
          >
            <div className="flex items-center gap-3 mb-2">
              <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1892.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.1023.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.690.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.419-2.1568 2.419zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.419-2.1568 2.419z" />
              </svg>
              <span className="text-xl font-bold tracking-tight">Join the Community</span>
            </div>
            <p className="text-white/80 text-sm font-medium">
              Discuss features, report bugs, and chat with other users.
            </p>
          </a>

          <div className="flex justify-center opacity-80 hover:opacity-100 transition-opacity">
            <CarbonAd />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
