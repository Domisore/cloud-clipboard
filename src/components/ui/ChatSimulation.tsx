import { Terminal, FileCode, Image as ImageIcon, Database, Download, Bot } from "lucide-react";

interface ChatProps {
    userRequest: string;
    agentResponse: string;
    attachment: {
        type: "code" | "image" | "data";
        name: string;
        size: string;
        imageUrl?: string;
    };
    delay?: number;
}

const generateMockId = () => Math.random().toString(36).substring(2, 8);

export function ChatCard({ userRequest, agentResponse, attachment, delay = 0 }: ChatProps) {
    const mockLink = `https://drive.io/c/${generateMockId()}`;
    const getIcon = () => {
        switch (attachment.type) {
            case "code": return <FileCode className="w-5 h-5 text-blue-400" />;
            case "image": return <ImageIcon className="w-5 h-5 text-purple-400" />;
            case "data": return <Database className="w-5 h-5 text-green-400" />;
        }
    };

    const getColor = () => {
        switch (attachment.type) {
            case "code": return "border-blue-500/30 bg-blue-500/5 hover:bg-blue-500/10";
            case "image": return "border-purple-500/30 bg-purple-500/5 hover:bg-purple-500/10";
            case "data": return "border-green-500/30 bg-green-500/5 hover:bg-green-500/10";
        }
    };

    return (
        <div className="flex flex-col gap-6 p-6 rounded-xl border border-zinc-800 bg-zinc-900/40 text-sm font-mono">
            {/* User Message (Right - iMessage blue style) */}
            <div className="flex justify-end mb-4">
                <div className="max-w-[85%] flex flex-col items-end gap-1">
                    <div className="bg-[#007AFF] text-white px-4 py-2.5 rounded-2xl rounded-tr-sm text-sm">
                        <p>{userRequest}</p>
                    </div>
                    <span className="text-[10px] text-zinc-500 font-medium mr-1">User</span>
                </div>
            </div>

            {/* Agent Message (Left - Gray style) */}
            <div className="flex justify-start">
                <div className="flex gap-3 max-w-[90%]">
                    <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center shrink-0 border border-indigo-500/50 mt-auto">
                        <Bot className="w-4 h-4 text-indigo-400" />
                    </div>

                    <div className="flex flex-col gap-1 items-start">
                        <div className="flex flex-col gap-3 bg-zinc-800 text-zinc-200 px-4 py-3 rounded-2xl rounded-tl-sm text-sm border border-zinc-700/50">
                            <p className="leading-relaxed">{agentResponse}</p>

                            {/* Fake Link */}
                            <div className="flex items-center gap-2 text-xs bg-black/20 p-2 rounded border border-white/5 w-full">
                                <span className="text-blue-400 underline decoration-blue-400/30 truncate">{mockLink}</span>
                            </div>

                            {/* Drive.io Attachment Card */}
                            <div className={`flex flex-col p-3 rounded-xl border transition-colors cursor-pointer group ${getColor()} mt-1`}>
                                {attachment.imageUrl && (
                                    <div className="w-full aspect-video rounded-lg overflow-hidden bg-black/50 border border-zinc-800/50 mb-3 relative">
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10" />
                                        <img src={attachment.imageUrl} alt={attachment.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    </div>
                                )}
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-black/40 rounded-lg border border-white/10 group-hover:border-white/20 transition-colors backdrop-blur-sm">
                                        {getIcon()}
                                    </div>
                                    <div className="flex flex-col overflow-hidden">
                                        <span className="font-semibold text-zinc-100 truncate text-[13px]">{attachment.name}</span>
                                        <span className="text-[11px] text-zinc-400 font-medium">{attachment.size} • drive.io</span>
                                    </div>
                                    <div className="ml-auto pl-2">
                                        <Download className="w-3.5 h-3.5 text-zinc-500 group-hover:text-zinc-300" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <span className="text-[10px] text-zinc-500 font-medium ml-1 flex items-center gap-1">
                            OpenClaw <span className="bg-zinc-800 text-zinc-400 px-1 rounded text-[9px]">BOT</span>
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
            <div className="flex items-center justify-between mb-12">
                <h2 className="text-sm font-bold text-zinc-500 uppercase tracking-widest border-b border-zinc-900 pb-4">
                    Interaction Examples
                </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <ChatCard
                    userRequest="Can you refactor the auth middleware and show me the diff?"
                    agentResponse="I've refactored the session validation logic. Here is the diff patch."
                    attachment={{
                        type: "code",
                        name: "auth-refactor.patch",
                        size: "4.2 KB"
                    }}
                />

                <ChatCard
                    userRequest="Export the last 10k users who haven't logged in since Jan 1st."
                    agentResponse="Query complete. I've exported the user list to CSV."
                    attachment={{
                        type: "data",
                        name: "inactive_users_2025.csv",
                        size: "1.8 MB"
                    }}
                />

                <ChatCard
                    userRequest="Generate a high-res marketing banner for the new 'Dark Mode' feature."
                    agentResponse="Here is 4k render standard social media aspect ratios."
                    attachment={{
                        type: "image",
                        name: "dark-mode-social-pack.zip",
                        size: "24 MB",
                        imageUrl: "/dark-mode-banner.png"
                    }}
                />
            </div>
        </section>
    );
}
