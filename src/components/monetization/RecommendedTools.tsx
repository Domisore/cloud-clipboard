import Link from "next/link";

interface Tool {
    name: string;
    description: string;
    url: string;
    icon: React.ReactNode;
    colorClass: string;
    buttonText?: string;
}

export function RecommendedTools() {
    const tools: Tool[] = [
        {
            name: "pCloud",
            description: "Secure, encrypted cloud storage with lifetime plans. The best permanent extension to drive.io.",
            url: "https://partner.pcloud.com/r/153485",
            colorClass: "text-blue-400 bg-blue-500/10",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                    <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM19 18H6c-2.21 0-4-1.79-4-4 0-2.05 1.53-3.76 3.56-3.97l1.07-.11.5-.95C8.08 7.14 9.94 6 12 6c2.62 0 4.88 1.86 5.39 4.43l.3 1.5 1.53.11c1.56.1 2.78 1.41 2.78 2.96 0 1.65-1.35 3-3 3z" />
                </svg>
            ),
        },
        // {
        //     name: "Sync.com",
        //     description: "Zero-knowledge encryption for your files. Guaranteed privacy that even they can't access.",
        //     url: "https://www.sync.com/?_yap_id=YOUR_REF_ID", // TODO: Replace with real affiliate link
        //     colorClass: "text-red-400 bg-red-500/10",
        //     buttonText: "Get 5GB Free",
        //     icon: (
        //         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        //             <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
        //             <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
        //             <ellipse cx="12" cy="5" rx="9" ry="3" />
        //         </svg>
        //     ),
        // },
        {
            name: "NordVPN",
            description: "Protect your connection while sharing. Fast, secure, and keeps no logs of your activity.",
            url: "https://go.nordvpn.net/aff_c?offer_id=15&aff_id=139873&url_id=902",
            colorClass: "text-emerald-400 bg-emerald-500/10",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    <path d="m9 12 2 2 4-4" />
                </svg>
            ),
        },
        // {
        //    name: "Proton",
        //    description: "Complete privacy ecosystem: Email, Calendar, Drive, and VPN from CERN scientists.",
        //    url: "https://proton.me/mail/pricing?ref=YOUR_REF_ID",
        //    colorClass: "text-purple-400 bg-purple-500/10",
        //    icon: (
        //      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        //        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
        //        <circle cx="12" cy="12" r="3" />
        //      </svg>
        //    )
        // }
    ];

    return (
        <section className="w-full max-w-5xl mx-auto py-8">
            <div className="flex flex-col items-center mb-8">
                <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                    Recommended Privacy Tools
                </h2>
                <p className="text-foreground-muted mt-2 text-center max-w-xl">
                    We love privacy as much as you do. Here are trusted tools we recommend for long-term storage and security.
                </p>
            </div>

            <div className="flex flex-wrap justify-center gap-4">
                {tools.map((tool) => (
                    <a
                        key={tool.name}
                        href={tool.url}
                        target="_blank"
                        rel="noopener noreferrer nofollow"
                        className="group flex flex-col p-5 rounded-2xl bg-surface/30 border border-border-color/50 hover:border-accent/30 hover:bg-surface/50 transition-all duration-300 relative overflow-hidden w-full sm:max-w-[16rem]"
                    >
                        {/* Hover Glow Effect */}
                        <div className="absolute inset-0 bg-gradient-to-br from-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity" />

                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 ${tool.colorClass}`}>
                            {tool.icon}
                        </div>

                        <h3 className="text-foreground font-semibold mb-2 flex items-center gap-2">
                            {tool.name}
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="opacity-0 group-hover:opacity-50 transition-opacity"><path d="M7 17l9.2-9.2M17 17V7H7" /></svg>
                        </h3>

                        <p className="text-sm text-foreground-muted leading-relaxed mb-4 flex-grow">
                            {tool.description}
                        </p>

                        <div className="text-xs font-medium text-accent opacity-80 group-hover:opacity-100 transition-opacity mt-auto uppercase tracking-wider">
                            {tool.buttonText || "Check it out"}
                        </div>
                    </a>
                ))}
            </div>
            <div className="mt-4 text-center">
                <p className="text-[10px] text-foreground-muted/40 uppercase tracking-widest">
                    Affiliate Disclosure: We may earn a commission from these links at no extra cost to you.
                </p>
            </div>
        </section>
    );
}
