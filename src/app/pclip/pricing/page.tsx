import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";
import { Pricing } from "@/components/ui/Pricing";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Pricing | Pclip Cloud Clipboard",
    description: "Simple, transparent pricing for instant cross-device sharing.",
};

export default function PclipPricingPage() {
    return (
        <div className="min-h-screen flex flex-col font-sans selection:bg-accent/30 selection:text-foreground italic-selection">
            <Header />

            <main className="flex-1 flex flex-col relative pt-24 pb-12">
                {/* Background decorative elements */}
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-[120px] -z-10" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-[120px] -z-10" />

                <Pricing />
            </main>

            <Footer />
        </div>
    );
}
