import { Terminal, FileCode, Image as ImageIcon, Database, Download, Bot, FileText, FileSpreadsheet, Paperclip } from "lucide-react";

interface ChatProps {
    userRequest: string;
    agentResponse: string;
    attachment: {
        type: "code" | "image" | "data" | "document" | "spreadsheet";
        name: string;
        size: string;
        imageUrl?: string;
    };
    delay?: number;
    customLink?: string;
    variant?: "default" | "hero";
}

const generateMockId = () => Math.random().toString(36).substring(2, 8);

export function ChatCard({ userRequest, agentResponse, attachment, delay = 0, customLink, variant = "default" }: ChatProps) {
    const mockLink = customLink || `https://drive.io/c/${generateMockId()}`;
    const getIcon = () => {
        switch (attachment.type) {
            case "code": return <FileCode className="w-5 h-5 text-blue-400" />;
            case "image": return <ImageIcon className="w-5 h-5 text-purple-400" />;
            case "data": return <Database className="w-5 h-5 text-green-400" />;
            case "document": return <FileText className="w-5 h-5 text-blue-300" />;
            case "spreadsheet": return <FileSpreadsheet className="w-5 h-5 text-emerald-400" />;
            default: return <Paperclip className="w-5 h-5 text-zinc-400" />;
        }
    };

    const getColor = () => {
        switch (attachment.type) {
            case "code": return "border-blue-500/30 bg-blue-500/5 hover:bg-blue-500/10";
            case "image": return "border-purple-500/30 bg-purple-500/5 hover:bg-purple-500/10";
            case "data": return "border-green-500/30 bg-green-500/5 hover:bg-green-500/10";
            case "document": return "border-blue-400/30 bg-blue-400/5 hover:bg-blue-400/10";
            case "spreadsheet": return "border-emerald-500/30 bg-emerald-500/5 hover:bg-emerald-500/10";
            default: return "border-zinc-500/30 bg-zinc-500/5 hover:bg-zinc-500/10";
        }
    };

    const isHero = variant === "hero";

    return (
        <div className={`flex flex-col gap-6 p-6 rounded-3xl border border-white/10 bg-zinc-950/90 backdrop-blur-xl shadow-2xl transition-all duration-500 ${isHero ? "scale-105 border-white/20 bg-zinc-950 shadow-accent/10" : ""}`}>
            {/* User Message */}
            <div className="flex justify-end mb-2">
                <div className="max-w-[85%] flex flex-col items-end gap-2 text-right">
                    <div className={`bg-accent text-white px-5 py-3 rounded-2xl rounded-tr-sm shadow-lg ${isHero ? "text-lg" : "text-sm"}`}>
                        <p>{userRequest}</p>
                    </div>
                </div>
            </div>

            {/* Agent Message */}
            <div className="flex justify-start">
                <div className="flex gap-4 max-w-[95%]">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shrink-0 border border-white/20 shadow-lg mt-auto">
                        <Bot className="w-5 h-5 text-white" />
                    </div>

                    <div className="flex flex-col gap-2 items-start">
                        <div className={`flex flex-col gap-4 bg-zinc-800/80 text-zinc-100 px-5 py-4 rounded-3xl rounded-tl-sm border border-white/5 backdrop-blur-md shadow-xl ${isHero ? "text-base" : "text-sm"}`}>
                            <p className="leading-relaxed">{agentResponse}</p>

                            {/* Drive.io Attachment Card */}
                            <div className={`flex flex-col p-4 rounded-2xl border transition-all cursor-pointer group ${getColor()} mt-1 hover:translate-y-[-2px] active:translate-y-[0px] shadow-sm hover:shadow-lg`}>
                                {attachment.imageUrl && (
                                    <div className="w-full aspect-[16/9] rounded-xl overflow-hidden bg-black/50 border border-white/5 mb-4 relative">
                                        <img src={attachment.imageUrl} alt={attachment.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                    </div>
                                )}
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-black/60 rounded-xl border border-white/10 group-hover:border-white/30 transition-all backdrop-blur-xl shadow-inner">
                                        {getIcon()}
                                    </div>
                                    <div className="flex flex-col overflow-hidden">
                                        <span className="font-bold text-zinc-100 truncate text-[14px] tracking-tight">{attachment.name}</span>
                                        <span className="text-[12px] text-zinc-400 font-medium opacity-80 uppercase tracking-widest">{attachment.size} • DRIVE.IO</span>
                                    </div>
                                    <div className="ml-auto pl-2 opacity-40 group-hover:opacity-100 transition-opacity">
                                        <Download className="w-4 h-4 text-zinc-100" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest ml-1 flex items-center gap-2">
                             DRIVE.IO <span className="bg-white/10 text-zinc-300 px-1.5 py-0.5 rounded text-[9px]">DOCS</span>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export function ChatSimulationSection() {
    return (
        <section className="px-6 max-w-6xl mx-auto mb-32">
            <div className="flex flex-col items-center mb-16 text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                    Your entire library, <span className="text-accent">one text away.</span>
                </h2>
                <p className="text-foreground-muted max-w-2xl text-lg">
                    Drive.io semantically indexes every document you upload, making them instantly searchable and actionable through chat.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <ChatCard
                    userRequest="Get me the Q3 2025 sales document and send a copy to Sarah."
                    agentResponse="I've located the Q3 Sales Report. Preparing to forward a copy to Sarah in Accounting."
                    attachment={{
                        type: "spreadsheet",
                        name: "Q3-2025-Sales-Final.xlsx",
                        size: "1.2 MB"
                    }}
                />

                <ChatCard
                    userRequest="Summarize the tax documents I uploaded yesterday."
                    agentResponse="Analyzing your recent tax filings. Here is a 1-page summary of your write-offs and total liabilities."
                    attachment={{
                        type: "document",
                        name: "Tax-Summary-2025.pdf",
                        size: "450 KB"
                    }}
                />

                <ChatCard
                    userRequest="Find the contract document for the Acme Corp project."
                    agentResponse="Found the executed Master Service Agreement with Acme Corp from Nov 2024."
                    attachment={{
                        type: "document",
                        name: "Acme-Master-Contract.pdf",
                        size: "2.4 MB"
                    }}
                />
            </div>
        </section>
    );
}
