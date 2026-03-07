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
        {
            name: "Proton Pass",
            description: "Securely manage your passwords and identity with end-to-end encryption.",
            url: "https://go.getproton.me/aff_c?offer_id=38&aff_id=16028",
            colorClass: "text-purple-400 bg-purple-500/10",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
            ),
        },
        {
            name: "Proton VPN",
            description: "High-speed Swiss VPN that protects your privacy and unblocks content.",
            url: "https://go.getproton.me/aff_c?offer_id=26&aff_id=16028",
            colorClass: "text-purple-400 bg-purple-500/10",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                    <path d="m9 12 2 2 4-4" />
                </svg>
            ),
        }
    ];

    return (
        <section className="w-full max-w-5xl mx-auto py-12 mt-12 border-t border-border-color/30">
            <div className="flex flex-col items-center mb-8 opacity-60">
                <h2 className="text-xs font-semibold tracking-widest text-foreground-muted uppercase">
                    Ecosystem Partners
                </h2>
            </div>

            <div className="flex flex-wrap justify-center gap-3">
                {tools.map((tool) => (
                    <a
                        key={tool.name}
                        href={tool.url}
                        target="_blank"
                        rel="noopener noreferrer nofollow"
                        className="group flex items-center gap-3 px-4 py-2 rounded-lg bg-surface/20 border border-border-color/30 hover:bg-surface/40 transition-colors duration-200 grayscale hover:grayscale-0 opacity-60 hover:opacity-100"
                    >
                        <div className={`w-5 h-5 flex items-center justify-center ${tool.colorClass.split(' ')[0]}`}>
                            {tool.icon}
                        </div>

                        <span className="text-sm text-foreground-muted group-hover:text-foreground transition-colors font-medium">
                            {tool.name}
                        </span>
                    </a>
                ))}
            </div>
        </section>
    );
}
