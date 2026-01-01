import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";
import { DemoPlayer } from "@/components/ui/DemoPlayer";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function HowItWorks() {
    return (
        <div className="min-h-screen flex flex-col font-mono selection:bg-accent selection:text-black">
            {/* We reuse header but maybe simplify it? For now, full header is fine for consistency */}
            <Header />

            <main className="flex-1 flex flex-col items-center justify-start p-4 sm:p-8 gap-8 relative z-10">
                <div className="w-full max-w-4xl">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-white mb-8 transition-colors group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        RETURN TO HOMEPAGE
                    </Link>

                    <h2 className="text-3xl font-bold mb-4">How it Works</h2>
                    <p className="text-gray-400 mb-8 max-w-2xl">
                        See how Drive.io allows you to instantly share files between devices anonymously, securely, and without any accounts.
                    </p>

                    <DemoPlayer />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 text-sm">
                        <div className="bg-surface/50 border border-border-color p-4">
                            <h3 className="font-bold text-white mb-2">1. DROP</h3>
                            <p className="text-gray-400">Drag and drop any file or paste text/images directly from your clipboard.</p>
                        </div>
                        <div className="bg-surface/50 border border-border-color p-4">
                            <h3 className="font-bold text-white mb-2">2. SYNC</h3>
                            <p className="text-gray-400">Use the Sync button to pair devices instantly via QR code or OTP.</p>
                        </div>
                        <div className="bg-surface/50 border border-border-color p-4">
                            <h3 className="font-bold text-white mb-2">3. TOSS</h3>
                            <p className="text-gray-400">Files appear instantly on paired devices. No logs, no traces left behind.</p>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
