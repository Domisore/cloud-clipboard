"use client";

import { Check, Zap, Shield, Globe, Clock, HardDrive, Infinity } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";

const tiers = [
    {
        name: "Free",
        price: "$0",
        description: "Free forever for individual developers — no credit card required. We'd rather you use it and tell us what's broken than not use it at all.",
        features: [
            { icon: HardDrive, text: "100 MB Storage" },
            { icon: Clock, text: "24-Hour Link Expiry" },
            { icon: Infinity, text: "10 Parallel Clips" },
            { icon: Shield, text: "5 MB Max File Size" },
            { icon: Globe, text: "Community Support" },
        ],
        buttonText: "Get Started",
        href: "/clipboard",
        featured: false,
    },
    {
        name: "Developer",
        price: "$19",
        unit: "/month",
        description: "Early access rate. Includes direct access to the founding team — bug reports, feature requests, and integration questions get a real response.",
        features: [
            { icon: HardDrive, text: "10 GB Storage" },
            { icon: Clock, text: "30-Day Link Expiry" },
            { icon: Infinity, text: "Unlimited Clips" },
            { icon: Shield, text: "100 MB Max File Size" },
            { icon: Zap, text: "Priority Founding Team Access" },
        ],
        buttonText: "Upgrade to Developer",
        href: "#",
        featured: true,
        priceId: "price_1TC7nU2au3jtvYgfJgEcRumO",
    },
];

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export function Pricing() {
    const [isLoading, setIsLoading] = useState<string | null>(null);
    const pathname = usePathname();
    const isPclip = pathname?.startsWith('/pclip') || pathname?.startsWith('/clipboard');

    const { userId } = useAuth();
    const router = useRouter();

    const handleCheckout = async (priceId: string) => {
        if (!userId) {
            // Redirect to sign-in if not authenticated
            // We use window.location to ensure a full reload/redirect to Clerk's hosted UI if needed
            window.location.href = `/sign-in?redirect_url=${encodeURIComponent(window.location.href)}`;
            return;
        }

        try {
            setIsLoading(priceId);
            const successUrl = isPclip ? "/clipboard?success=true" : "/dashboard?success=true";

            const response = await fetch("/api/checkout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ priceId, successUrl }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || `Checkout failed with status ${response.status}`);
            }

            const data = await response.json();
            if (data.url) {
                window.location.assign(data.url);
            }
        } catch (error: any) {
            console.error("Checkout error:", error);
            // You might want to show a toast here in a real app
        } finally {
            setIsLoading(null);
        }
    };
    return (
        <section className="py-20 px-4">
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl sm:text-5xl font-bold tracking-tight mb-4 text-foreground leading-tight">
                        Early access <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-blue-400">
                             pricing.
                        </span>
                    </h2>
                    <p className="text-foreground-muted text-lg max-w-2xl mx-auto italic border-l-2 border-accent/30 pl-6 py-2 bg-accent/5 rounded-r-xl">
                        Drive.io is in active development. Early access pricing locks in your rate permanently &mdash; pricing increases as the product matures. You&apos;re not just getting access, you&apos;re helping shape what gets built next.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {tiers.map((tier, idx) => (
                        <motion.div
                            key={tier.name}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            viewport={{ once: true }}
                            className={`
                                relative p-8 rounded-3xl border transition-all duration-300
                                ${tier.featured
                                    ? "bg-gradient-to-br from-accent/10 via-surface to-surface border-accent/30 shadow-2xl shadow-accent/10 scale-105 z-10"
                                    : "bg-surface border-border-color hover:border-border-color-hover shadow-xl"
                                }
                            `}
                        >
                            {tier.featured && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-accent text-background text-xs font-bold uppercase tracking-widest">
                                    Most Popular
                                </div>
                            )}

                            <div className="mb-8">
                                <h3 className="text-2xl font-bold mb-2 text-foreground">{tier.name}</h3>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl font-black text-foreground">{tier.price}</span>
                                    {tier.unit && <span className="text-foreground-muted font-medium">{tier.unit}</span>}
                                </div>
                                <p className="mt-4 text-foreground-muted text-sm leading-relaxed">
                                    {tier.description}
                                </p>
                            </div>

                            <ul className="space-y-4 mb-8">
                                {tier.features.map((feature, fIdx) => (
                                    <li key={fIdx} className="flex items-center gap-3 text-foreground-muted text-sm">
                                        <div className={`
                                            p-1 rounded-md 
                                            ${tier.featured ? "bg-accent/20 text-accent" : "bg-white/5 text-foreground-muted"}
                                        `}>
                                            <feature.icon className="w-4 h-4" />
                                        </div>
                                        <span>{feature.text}</span>
                                    </li>
                                ))}
                            </ul>

                            {tier.name === "Developer" ? (
                                <button
                                    onClick={() => handleCheckout(tier.priceId!)}
                                    disabled={isLoading !== null}
                                    className={`
                                        w-full py-4 rounded-xl font-bold flex items-center justify-center transition-all
                                        ${tier.featured
                                            ? "bg-accent text-background hover:bg-accent/90 shadow-lg shadow-accent/20 active:translate-y-[2px]"
                                            : "bg-surface border border-border-color text-foreground hover:bg-white/10 active:translate-y-[2px]"
                                        }
                                        ${isLoading === tier.priceId ? "opacity-50 cursor-not-allowed" : ""}
                                    `}
                                >
                                    {isLoading === tier.priceId ? "Loading..." : tier.buttonText}
                                </button>
                            ) : (
                                <Link
                                    href={tier.href}
                                    className={`
                                        w-full py-4 rounded-xl font-bold flex items-center justify-center transition-all
                                        ${tier.featured
                                            ? "bg-accent text-background hover:bg-accent/90 shadow-lg shadow-accent/20 active:translate-y-[2px]"
                                            : "bg-surface border border-border-color text-foreground hover:bg-white/10 active:translate-y-[2px]"
                                        }
                                    `}
                                >
                                    {tier.buttonText}
                                </Link>
                            )}
                        </motion.div>
                    ))}
                </div>

                <div className="mt-16 text-center text-foreground-muted text-sm border-t border-border-color/50 pt-8">
                    <p>Have questions? <Link href="/contact" className="text-accent hover:underline">Contact our support team</Link></p>
                </div>
            </div>
        </section>
    );
}
