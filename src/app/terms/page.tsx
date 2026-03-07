"use client";

import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";

export default function TermsPage() {
    return (
        <div className="min-h-screen flex flex-col font-sans selection:bg-accent/30 selection:text-foreground">
            <Header />

            <main className="flex-1 flex flex-col relative pt-24 pb-12 px-4 sm:px-6">
                <div className="w-full max-w-3xl mx-auto animate-fade-in text-foreground/80 leading-relaxed">
                    <h1 className="text-3xl font-bold mb-8 text-foreground">Terms of Service</h1>

                    <div className="space-y-6">
                        <section>
                            <h2 className="text-xl font-bold mb-3 text-foreground">1. Acceptance of Terms</h2>
                            <p>
                                By accessing or using Pclip (powered by drive.io), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold mb-3 text-foreground">2. Acceptable Use</h2>
                            <p>
                                You agree not to use this service to store or transmit any illegal, abusive, or explicitly harmful material. We reserve the right to remove any content or ban any user that violates these terms, disrupts the service, or presents a legal risk to the platform.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold mb-3 text-foreground">3. Service Availability</h2>
                            <p>
                                While we strive for maximum uptime, this service is provided "as is" and "as available". We do not guarantee uninterrupted access or that your ephemeral data will never be lost due to unforeseen technical failures.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold mb-3 text-foreground">4. Limitation of Liability</h2>
                            <p>
                                To the maximum extent permitted by law, Pclip and drive.io shall not be liable for any indirect, incidental, or consequential damages arising out of your use of or inability to use the service.
                            </p>
                        </section>

                        <p className="text-sm text-foreground-muted mt-12">
                            Last Updated: February 2025
                        </p>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
