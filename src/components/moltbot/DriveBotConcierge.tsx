"use client";

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, Zap, Terminal, Loader2 } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function DriveBotConcierge() {
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'assistant', content: "Hello! I'm DriveBot, the Drive.io concierge. How can I help you optimize your agentic workflows today?" }
    ]);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSendMessage = async () => {
        if (!inputValue.trim() || isLoading) return;

        const userMessage = { role: 'user', content: inputValue };
        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsLoading(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: [...messages, userMessage] }),
            });

            if (!response.ok) throw new Error('Failed to fetch response');

            const data = await response.json();
            setMessages(prev => [...prev, data]);
        } catch (error) {
            console.error('Chat error:', error);
            setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I encountered an error. Please try again later." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-[100]">
            <AnimatePresence>
                {!isOpen ? (
                    <motion.button
                        layoutId="chat-window"
                        onClick={() => setIsOpen(true)}
                        className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center shadow-2xl text-white hover:scale-110 transition-transform relative group"
                    >
                        <Bot className="w-8 h-8" />
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-4 border-[#0a0a0a] group-hover:scale-110 transition-transform"></div>
                        <div className="absolute inset-0 rounded-full border-2 border-purple-400 opacity-20 animate-ping"></div>
                    </motion.button>
                ) : (
                    <motion.div
                        layoutId="chat-window"
                        initial={{ opacity: 0, scale: 0.8, y: 50 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 50 }}
                        className="bg-zinc-950/90 backdrop-blur-2xl border border-purple-500/30 rounded-3xl w-[380px] h-[550px] shadow-[0_0_50px_rgba(168,85,247,0.15)] overflow-hidden flex flex-col sm:w-[420px] sm:h-[600px]"
                    >
                        {/* Header */}
                        <div className="p-5 border-b border-purple-500/20 flex items-center justify-between bg-gradient-to-r from-purple-500/10 to-transparent">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400 ring-1 ring-purple-500/30">
                                    <Bot className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-white tracking-tight">DriveBot Concierge</h3>
                                    <div className="flex items-center gap-1.5 leading-none mt-1">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                                        <span className="text-[10px] text-emerald-500/80 font-mono tracking-widest uppercase">System Online</span>
                                    </div>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="p-2 text-zinc-500 hover:text-white hover:bg-white/5 rounded-full transition-all">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div 
                            ref={scrollRef}
                            className="flex-1 overflow-y-auto p-5 space-y-5 no-scrollbar scroll-smooth"
                        >
                            {messages.map((m, i) => (
                                <div key={i} className={cn("flex w-full animate-in fade-in slide-in-from-bottom-2 duration-300", m.role === 'user' ? 'justify-end' : 'justify-start')}>
                                    <div className={cn(
                                        "max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed",
                                        m.role === 'user' 
                                            ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/10 rounded-tr-none' 
                                            : 'bg-zinc-900 text-zinc-300 rounded-tl-none border border-zinc-800 shadow-sm'
                                    )}>
                                        {m.role === 'assistant' && (
                                            <div className="flex items-center gap-2 mb-2">
                                                <Terminal className="w-3.5 h-3.5 text-purple-400/80" />
                                                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">DRIVE.IO_AGENT</span>
                                            </div>
                                        )}
                                        {m.content}
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-start animate-in fade-in duration-300">
                                    <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl rounded-tl-none flex items-center gap-3">
                                        <Loader2 className="w-4 h-4 text-purple-400 animate-spin" />
                                        <span className="text-xs text-zinc-500 font-mono">Agent processing...</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Chat Footer */}
                        <div className="p-5 border-t border-purple-500/20 bg-zinc-950/50">
                            <form 
                                onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
                                className="flex items-center gap-2 bg-zinc-900/50 border border-zinc-800 p-2 rounded-2xl focus-within:border-purple-500/30 transition-colors shadow-inner"
                            >
                                <input 
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    className="bg-transparent border-none text-white text-sm flex-1 outline-none px-3 py-2 placeholder:text-zinc-700"
                                    placeholder="Ask about the Agentic Protocol..."
                                />
                                <button 
                                    type="submit"
                                    disabled={!inputValue.trim() || isLoading}
                                    className="p-2.5 bg-purple-600 text-white rounded-xl hover:bg-purple-500 transition-all disabled:opacity-50 disabled:grayscale transform active:scale-95"
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </form>
                            <div className="mt-4 flex items-center justify-between text-[8px] font-mono uppercase tracking-[0.2em] text-zinc-600 px-1">
                                <span>v1.0.4-beta</span>
                                <span className="flex items-center gap-1"><Zap className="w-2 h-2" /> E2EE Sync</span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
