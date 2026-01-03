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
            Create secure, ephemeral links to share with anyone. No account required.
          </p>
        </div>

        {/* Main Interaction Area */}
        <div className="w-full max-w-5xl mx-auto flex flex-col gap-16">
          <CommandCenter />

          <RecentList />

          <div className="flex justify-center opacity-80 hover:opacity-100 transition-opacity">
            <CarbonAd />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
