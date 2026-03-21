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
            name: "LangChain",
            description: "Built-in compatibility for LangGraph and LangChain artifact persistence.",
            url: "https://langchain.com",
            colorClass: "text-blue-400 bg-blue-500/10",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
            ),
        },
        {
            name: "CrewAI",
            description: "Seamless data handoffs between CrewAI agents using Drive.io as a neutral relay.",
            url: "https://crewai.com",
            colorClass: "text-emerald-400 bg-emerald-500/10",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
            ),
        },
        {
            name: "AutoGen",
            description: "Microsoft AutoGen integration for multi-agent conversational data storage.",
            url: "https://microsoft.github.io/autogen/",
            colorClass: "text-purple-400 bg-purple-500/10",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                    <path d="M12 2v10" />
                    <path d="m16 8-4 4-4-4" />
                    <path d="M4.5 9a9 9 0 1 0 15 0" />
                </svg>
            ),
        },
        {
            name: "OpenAI",
            description: "Compatible with File Search and Code Interpreter outputs for all GPT models.",
            url: "https://openai.com",
            colorClass: "text-white bg-white/10",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                    <path d="M22.28 7.53c-.52-1.3-1.45-2.24-2.73-2.73a.47.47 0 0 0-.25-.03c-.22.03-.43.12-.6.28l-3.23 3.23c-.15.15-.24.36-.26.57v.03c0 .21.08.41.22.56.3.31.81.31 1.12 0l3.03-3.03c.12.12.23.25.33.39.52 1.3.42 2.76-.28 3.96l-3.23 3.23c-.15.15-.24.36-.26.57v.03c0 .21.08.41.22.56.3.31.81.31 1.12 0l3.03-3.03c.51.52.88 1.18 1.05 1.91.52 1.3.42 2.76-.28 3.96l-3.23 3.23c-.15.15-.24.36-.26.57v.03c0 .21.08.41.22.56.3.31.81.31 1.12 0l3.03-3.03c.12.12.23.25.33.39.43.59.7 1.25.82 1.93.52 1.3.42 2.76-.28 3.96l-3.23 3.23c-.15.15-.24.36-.26.57v.03c0 .21.08.41.22.56.3.31.81.31 1.12 0l3.03-3.03c.12.12.23.25.33.39a4.8 4.8 0 0 1 .5 1.57c.52 1.3.42 2.76-.28 3.96l-3.23 3.23a.8.8 0 0 1-1.12-1.12l3.23-3.23c.52-1.3.42-2.76-.28-3.96a4.8 4.8 0 0 0-.33-.39c-.12.12-.23.25-.33.39-.52 1.3-.42 2.76.28 3.96l3.23 3.23a.8.8 0 1 1-1.12 1.12l-3.23-3.23c-.52 1.3-1.45 2.24-2.73 2.73-.13.05-.27.08-.41.08-.14 0-.28-.03-.41-.08-1.3-.52-2.24-1.45-2.73-2.73-.52-1.3-.42-2.76.28-3.96l3.23-3.23a.8.8 0 0 1 1.12 1.12l-3.23 3.23c-.52 1.3-.42 2.76.28 3.96.12.12.23.25.33.39.12-.12.23-.25.33-.39.52-1.3.42-2.76-.28-3.96l-3.23-3.23a.8.8 0 0 1 1.12-1.12l3.23 3.23c.52-1.3.42-2.76-.28-3.96a4.8 4.8 0 0 0-.33-.39c-.12.12-.23.25-.33.39-.52 1.3-.42 2.76.28 3.96l3.23 3.23a.8.8 0 1 1-1.12 1.12l-3.23-3.23c-.52 1.3-1.45 2.24-2.73 2.73-.13.05-.27.08-.41.08-.14 0-.28-.03-.41-.08-1.3-.52-2.24-1.45-2.73-2.73-.52-1.3-.42-2.76.28-3.96l3.23-3.23a.8.8 0 0 1 1.12 1.12l-3.23 3.23c-.52 1.3-.42 2.76.28 3.96.12.12.23.25.33.39.12-.12.23-.25.33-.39.52-1.3.42-2.76-.28-3.96l-3.23-3.23a.8.8 0 0 1 1.12-1.12l3.23 3.23c.52-1.3.42-2.76-.28-3.96a4.8 4.8 0 0 0-.33-.39c-.12.12-.23.25-.33.39-.52 1.3-.42 2.76.28 3.96l3.23 3.23a.8.8 0 1 1-1.12 1.12L1.72 7.53a.8.8 0 1 1 1.12-1.12l3.23 3.23c.52-1.3.42-2.76-.28-3.96-.12-.12-.23-.25-.33-.39-.12.12-.23.25-.33.39-.52 1.3-.42 2.76.28 3.96l3.23 3.23a.8.8 0 0 1-1.12 1.12l-3.23-3.23c-.52 1.3-1.45 2.24-2.73 2.73-.13.05-.27.08-.41.08-.14 0-.28-.03-.41-.08-1.3-.52-2.24-1.45-2.73-2.73-.52-1.3-.42-2.76.28-3.96l3.23-3.23a.8.8 0 0 1 1.12 1.12l-3.23 3.23c-.52 1.3-.42 2.76.28 3.96.12.12.23.25.33.39.12-.12.23-.25.33-.39.52-1.3.42-2.76-.28-3.96l-3.23-3.23a.8.8 0 0 1 1.12-1.12l3.23 3.23c.52-1.3.42-2.76-.28-3.96a4.8 4.8 0 0 0-.33-.39c-.12.12-.23.25-.33.39-.52 1.3-.42 2.76.28 3.96l3.23 3.23a.8.8 0 1 1-1.12 1.12l-3.23-3.23c-.52 1.3-1.45 2.24-2.73 2.73-.13.05-.27.08-.41.08-.14 0-.28-.03-.41-.08-1.3-.52-2.24-1.45-2.73-2.73-.08-.2-.14-.41-.18-.63-.52-1.3-.42-2.76.28-3.96L1.72 4.3a.8.8 0 0 1 1.12-1.12l3.23 3.23c.52-1.3.42-2.76-.28-3.96a4.8 4.8 0 0 0-.33-.39c-.12.12-.23.25-.33.39-.52 1.3-.42 2.76.28 3.96l3.23 3.23a.8.8 0 0 1 1.12 1.12l-3.23-3.23c-.52 1.3-1.45 2.24-2.73 2.73-.13.05-.27.08-.41.08-.14 0-.28-.03-.41-.08-1.3-.52-2.24-1.45-2.73-2.73-.52-1.3-.42-2.76.28-3.96l3.23-3.23a.8.8 0 0 1 1.12 1.12l-3.23 3.23c-.52 1.3-.42 2.76.28 3.96.12.12.23.25.33.39.12-.12.23-.25.33-.39.52-1.3.42-2.76-.28-3.96l-3.23-3.23a.8.8 0 0 1 1.12-1.12l3.23 3.23c.52-1.3.42-2.76-.28-3.96a4.8 4.8 0 0 0-.33-.39c-.12.12-.23.25-.33.39-.52 1.3-.42 2.76.28 3.96l3.23 3.23a.8.8 0 0 1 1.12 1.12L22.28 7.53z" />
                </svg>
            ),
        }
    ];

    return (
        <section className="w-full max-w-5xl mx-auto py-12 mt-12 border-t border-border-color/30">
            <div className="flex flex-col items-center mb-8 opacity-60">
                <h2 className="text-xs font-semibold tracking-widest text-foreground-muted uppercase">
                    Ecosystem Integrations
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
