import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";
import { CommandCenter } from "@/components/ui/CommandCenter";
import { RecentList } from "@/components/ui/RecentList";
import { CarbonAd } from "@/components/ui/CarbonAd";
import { PclipUsageGuide } from "@/components/ui/PclipUsageGuide";
import { PWAInstallPopup } from "@/components/ui/PWAInstallPopup";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Pclip | Instant cross-device cloud clipboard",
    description: "Instantly move text, images, and files between your devices. Create secure, ephemeral links to share with anyone. No account required.",
    openGraph: {
        title: "Pclip | Instant cross-device cloud clipboard",
        description: "Instantly move text, images, and files between your devices. No account required.",
        siteName: "Pclip",
        images: [
            {
                url: "/pclip-512x512.png",
                width: 512,
                height: 512,
            },
        ],
    },
    twitter: {
        card: "summary",
        title: "Pclip | Cloud Clipboard",
        description: "Instantly move text, images, and files between your devices.",
        images: ["/pclip-512x512.png"],
    },
    applicationName: "Pclip"
};

export default function ClipboardPage() {
    return (
        <div className="min-h-screen flex flex-col font-sans selection:bg-accent/30 selection:text-foreground">
            <Header />

            <main className="flex-1 flex flex-col relative pt-24 pb-12 px-4 sm:px-6">
                <div className="text-center max-w-2xl mx-auto mb-12 animate-fade-in">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-2 text-foreground">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-blue-400">Pclip</span>
                    </h1>
                    <p className="text-foreground-muted text-base sm:text-lg leading-relaxed">
                        Instantly move text, images, and files between your devices.<br className="hidden sm:block" />
                        Create secure, ephemeral links to share with anyone. <span className="mx-1 relative inline-block before:absolute before:-inset-1 before:block before:-skew-y-3 before:bg-yellow-400 before:opacity-80 relative inline-block"><span className="relative text-black font-bold px-1">No account required.</span></span>
                    </p>
                </div>

                {/* Main Interaction Area */}
                <div className="w-full max-w-5xl mx-auto flex flex-col gap-12">
                    <CommandCenter />
                    <RecentList />

                    <PclipUsageGuide />

                    <div className="flex justify-center opacity-80 hover:opacity-100 transition-opacity">
                        <CarbonAd />
                    </div>
                </div>
            </main>

            <PWAInstallPopup />
            <Footer />
        </div>
    );
}
