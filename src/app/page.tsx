import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";
import { CommandCenter } from "@/components/ui/CommandCenter";
import { RecentList } from "@/components/ui/RecentList";
import { CarbonAd } from "@/components/ui/CarbonAd";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-accent/30 selection:text-foreground">
      <Header />

      <main className="flex-1 flex flex-col relative pt-24 pb-12 px-4 sm:px-6">

        {/* Hero Text (Moved from Header) */}
        <div className="text-center max-w-2xl mx-auto mb-12 animate-fade-in">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4 text-foreground">
            Your Universal <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-blue-400">Cloud Clipboard.</span>
          </h1>
          <p className="text-foreground-muted text-sm sm:text-base leading-relaxed">
            Instantly move text, images, and files between your devices.<br className="hidden sm:block" />
            Create secure, ephemeral links to share with anyone. <span className="mx-1 relative inline-block before:absolute before:-inset-1 before:block before:-skew-y-3 before:bg-yellow-400 before:opacity-80 relative inline-block"><span className="relative text-black font-bold px-1">No account required.</span></span>
          </p>
        </div>

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
              <h3 className="text-foreground font-semibold mb-2">Better than Pastebin & Filebin</h3>
              <p className="text-sm text-foreground-muted leading-relaxed">
                Share code snippets with correct formatting or drag & drop generic files. No Captchas, no ads, no clutter.
              </p>
            </div>

            {/* Feature 2: Native Sharing */}
            <div className="p-6 rounded-2xl bg-surface/30 border border-border-color/50 hover:border-accent/30 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" /><polyline points="16 6 12 2 8 6" /><line x1="12" y1="2" x2="12" y2="15" /></svg>
              </div>
              <h3 className="text-foreground font-semibold mb-2">Native Mobile Sharing</h3>
              <p className="text-sm text-foreground-muted leading-relaxed">
                Install as an app to share text, images, and files directly from your system share sheet without opening a browser.
              </p>
            </div>

            {/* Feature 3: Privacy */}
            <div className="p-6 rounded-2xl bg-surface/30 border border-border-color/50 hover:border-accent/30 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-400 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" /><path d="m9 12 2 2 4-4" /></svg>
              </div>
              <h3 className="text-foreground font-semibold mb-2">Secure & Ephemeral</h3>
              <p className="text-sm text-foreground-muted leading-relaxed">
                Your data is encrypted in transit and at rest. Set files to "Burn on Read" for ultimate temporary sharing.
              </p>
            </div>
          </div>

          <div className="flex justify-center opacity-80 hover:opacity-100 transition-opacity">
            <CarbonAd />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
