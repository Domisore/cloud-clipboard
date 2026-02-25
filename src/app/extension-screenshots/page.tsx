"use client";

import React from 'react';
import { Download, CloudUpload, Link as LinkIcon, Sparkles } from 'lucide-react';

// A perfectly styled replica of the Chrome Extension Popup for the screenshots
function PopupMockup({ mode = 'idle', filename = '', text = '' }: { mode?: 'idle' | 'file' | 'success', filename?: string, text?: string }) {
    return (
        <div className="w-[300px] bg-[#0D0D0D] rounded-xl border border-[#333] shadow-2xl shadow-black/50 p-4 text-[#E2E2E2] font-sans mx-auto text-left relative z-10">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-base font-bold m-0 flex items-center gap-2">
                    <img src="/pclip-192x192.png" width="16" height="16" alt="logo" className="rounded-sm" />
                    Pclip
                </h1>
                <div className="text-[12px] text-[#4ade80]">
                    Signed in as User
                </div>
            </div>

            {/* Content Area */}
            {mode === 'success' ? (
                <>
                    <textarea
                        className="w-full h-[100px] p-2 mb-3 bg-[#1A1A1A] text-white border border-[#333] rounded-md resize-none font-mono text-sm opacity-50"
                        readOnly
                        placeholder="Paste text or code here to save to your cloud clipboard..."
                    />
                    <div className="border-2 border-dashed border-[#444] rounded-md p-4 text-center mb-3 text-[#888] text-sm opacity-50">
                        Drag & drop a file here<br />or click to browse
                    </div>
                </>
            ) : mode === 'file' ? (
                <>
                    <textarea
                        className="w-full h-[100px] p-2 mb-3 bg-[#1A1A1A] text-white border border-[#333] rounded-md resize-none font-mono text-sm opacity-50"
                        readOnly
                        placeholder="File selected. Text will be ignored."
                    />
                    <div className="border-2 border-dashed border-[#3b82f6] bg-blue-500/10 rounded-md p-4 text-center mb-3 text-white text-sm">
                        <strong>Selected:</strong> {filename}<br />
                        <small className="text-gray-400">Click to change</small>
                    </div>
                </>
            ) : (
                <>
                    <textarea
                        className="w-full h-[100px] p-2 mb-3 bg-[#1A1A1A] text-white border border-[#333] rounded-md resize-none font-mono text-sm focus:outline-none focus:border-purple-500"
                        defaultValue={text}
                        placeholder="Paste text or code here to save to your cloud clipboard..."
                    />
                    <div className="border-2 border-dashed border-[#444] rounded-md p-4 text-center mb-3 text-[#888] text-sm">
                        Drag & drop a file here<br />or click to browse
                    </div>
                </>
            )}

            {/* Button */}
            <button className="w-full py-2.5 bg-white text-black font-bold rounded-md hover:bg-gray-100 transition-colors">
                Save to Pclip
            </button>

            {/* Status */}
            {mode === 'success' && (
                <>
                    <div className="text-center text-[13px] text-[#4ade80] mt-3 font-medium">
                        Saved successfully! Check your clipboard.
                    </div>
                    <div className="text-center text-[12px] text-blue-400 mt-2 hover:underline cursor-pointer">
                        URL: https://drive.io/c/A7X9F2P
                    </div>
                </>
            )}

            {/* Footer Link */}
            {mode !== 'success' && (
                <div className="text-center text-[12px] text-blue-400 mt-3 hover:underline cursor-pointer">
                    Open My Clipboard &rarr;
                </div>
            )}
        </div>
    );
}

// 1280x800 Screenshot Canvas
function ScreenshotFrame({ title, subtitle, bgGradient, children }: { title: string, subtitle: string, bgGradient: string, children: React.ReactNode }) {
    return (
        <div className={`w-[1280px] h-[800px] ${bgGradient} relative overflow-hidden flex items-center px-24 shrink-0 rounded-2xl shadow-2xl`}>
            {/* Background Decorations */}
            <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-white/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-black/20 rounded-full blur-3xl pointer-events-none" />

            <div className="flex-1 z-10 pr-16 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white font-semibold text-sm mb-8 backdrop-blur-md">
                    <img src="/pclip-192x192.png" className="w-4 h-4 rounded-sm" alt="Icon" />
                    Pclip for Chrome
                </div>
                <h1 className="text-6xl font-bold text-white mb-6 leading-[1.15] tracking-tight drop-shadow-lg">
                    {title}
                </h1>
                <p className="text-2xl text-white/80 leading-relaxed font-medium">
                    {subtitle}
                </p>
            </div>

            <div className="flex-1 relative z-10 flex justify-center items-center">
                {/* Browser/Popup Context Frame */}
                <div className="relative">
                    {/* Glowing Accent Behind Popup */}
                    <div className="absolute inset-[-40px] bg-white/10 rounded-full blur-2xl" />
                    <div className="transform scale-[1.5] origin-center shadow-[0_0_50px_rgba(0,0,0,0.5)] rounded-xl">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function ExtensionScreenshots() {
    return (
        <div className="min-h-screen bg-neutral-900 p-12 flex flex-col items-center gap-12 font-sans selection:bg-purple-500/30">
            <div className="text-center max-w-2xl mb-8">
                <h1 className="text-3xl font-bold text-white mb-4">Chrome Web Store Assets</h1>
                <p className="text-neutral-400">
                    These are perfectly sized 1280x800 screenshot frames. <br />
                    Use your Mac's precise screenshot tool (<kbd className="bg-neutral-800 px-2 rounded">Cmd</kbd> + <kbd className="bg-neutral-800 px-2 rounded">Shift</kbd> + <kbd className="bg-neutral-800 px-2 rounded">4</kbd>) and drag a box exactly to the edges of each colored frame.
                </p>
            </div>

            {/* Screenshot 1: Text Snippets */}
            <ScreenshotFrame
                title="Your Cloud Clipboard, Just a Click Away."
                subtitle="Instantly save text snippets, links, or code blocks right from your browser without opening a new tab."
                bgGradient="bg-gradient-to-br from-purple-900 via-[#1c1236] to-black"
            >
                <PopupMockup
                    mode="idle"
                    text="const handleUpload = async (file) => {&#10;  const res = await uploadFile(file);&#10;  console.log(res);&#10;};"
                />
            </ScreenshotFrame>

            {/* Screenshot 2: File Upload */}
            <ScreenshotFrame
                title="Bypass The File Size Limit."
                subtitle="Drag and drop multi-gigabyte files directly into the extension to generate secure share links in seconds."
                bgGradient="bg-gradient-to-br from-blue-900 via-[#0e172a] to-black"
            >
                <PopupMockup
                    mode="file"
                    filename="Q3_Financial_Review.pdf"
                />
            </ScreenshotFrame>

            {/* Screenshot 3: Instant URLs */}
            <ScreenshotFrame
                title="Zero-Friction. Instant Sharing."
                subtitle="No accounts. No sign-ups required. Get instantly accessible URLs that you can paste anywhere."
                bgGradient="bg-gradient-to-br from-indigo-900 via-purple-900 to-black"
            >
                <PopupMockup
                    mode="success"
                />
            </ScreenshotFrame>

            <div className="h-24"></div>
        </div>
    );
}
