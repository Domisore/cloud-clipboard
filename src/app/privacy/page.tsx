"use client";

import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";

export default function PrivacyPage() {
    return (
        <div className="min-h-screen flex flex-col font-sans selection:bg-accent/30 selection:text-foreground">
            <Header />

            <main className="flex-1 flex flex-col relative pt-24 pb-12 px-4 sm:px-6">
                <div className="w-full max-w-3xl mx-auto animate-fade-in text-foreground/80 leading-relaxed">
                    <h1 className="text-3xl font-bold mb-8 text-foreground">Privacy Policy</h1>

                    <div className="space-y-6">
                        <section>
                            <h2 className="text-xl font-bold mb-3 text-foreground">1. Minimal Data Collection</h2>
                            <p>
                                At Pclip (powered by drive.io), we believe your data is yours. We collect only the absolute minimum amount of information necessary to provide you with our basic services. We do not require you to create an account, provide an email address, or share personally identifiable information to use the core clipboard functionality.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold mb-3 text-foreground">2. Ephemeral Storage</h2>
                            <p>
                                The files and text you upload to our service are strictly ephemeral. We employ strict time-to-live (TTL) policies, ensuring that your data is automatically deleted from our servers after it expires. By default, all uploaded clips and files are permanently purged after <strong>24 hours</strong>. If the <code>burnAfterReading</code> flag is enabled, data is destroyed immediately after its first successful download.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold mb-3 text-foreground">3. Analytics and Cookies</h2>
                            <p>
                                We may use basic, privacy-respecting analytics tools to understand aggregate website traffic and usage patterns. These tools do not track you across the web or sell your browsing history. We use essential cookies required for the functioning of the application.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold mb-3 text-foreground">4. Third-Party Services</h2>
                            <p>
                                Some aspects of our service relies on third-party infrastructure (such as Vercel, Neon, and AWS). We ensure these partners maintain strict security standards. However, we do not share, sell, or rent any of your personal data to advertisers or data brokers.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold mb-3 text-foreground">5. Changes to This Policy</h2>
                            <p>
                                We reserve the right to update this Privacy Policy at any time. Significant changes will be communicated through the website. Contact us if you have any questions or concerns regarding your privacy.
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
