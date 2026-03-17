"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, Terminal, Zap, ArrowUp, ArrowDown, Database, Cpu, User, Layout, Activity } from 'lucide-react';

const CTX_WINDOW = 128000;

const TURN_STATE: Record<string, any> = {
  '1': { historyTokens: 0,    systemTokens: 820,  toolTokens: 0     },
  '3': { historyTokens: 3200, systemTokens: 820,  toolTokens: 1400  },
  '7': { historyTokens: 9800, systemTokens: 820,  toolTokens: 4200  },
  '15': { historyTokens: 28000,systemTokens: 820,  toolTokens: 11000 },
  '25': { historyTokens: 61000,systemTokens: 820,  toolTokens: 24000 },
};

const ATTACHMENTS: Record<string, any> = {
  none: { label: 'none',          rawTokens: 0     },
  doc:  { label: 'document',      rawTokens: 3200  },
  code: { label: 'codebase',      rawTokens: 11500 },
  data: { label: 'dataset',       rawTokens: 25600 },
};

const SWATCHES = {
  system:   '#a78bfa',
  history:  '#f59e0b',
  tool:     '#60a5fa',
  attach:   '#f43f5e',
  pointer:  '#00c9a7',
  message:  '#94a3b8',
};

interface LogLine {
  id: string;
  timestamp: string;
  content: React.ReactNode;
}

export function ContextWindowDemo() {
  const [turn, setTurn] = useState('7');
  const [attachment, setAttachment] = useState('doc');
  const [userMsg, setUserMsg] = useState('Summarize the key findings');
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<LogLine[]>([]);
  const [storeItems, setStoreItems] = useState<{id: string, tier: string, label: string, size?: string}[]>([]);
  
  // Results
  const [stats, setStats] = useState({
    without: 0,
    with: 0,
    saved: 0,
    pct: '0',
    pctWithout: 0,
    pctWith: 0
  });

  const [showResults, setShowResults] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const getTimestamp = () => {
    const n = new Date();
    return [n.getHours(), n.getMinutes(), n.getSeconds()].map(x => String(x).padStart(2, '0')).join(':');
  };

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const addLog = (content: React.ReactNode) => {
    setLogs(prev => [...prev, {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: getTimestamp(),
      content
    }]);
  };

  const runSimulation = async () => {
    if (isRunning) return;
    setIsRunning(true);
    setShowResults(false);
    setLogs([]);
    setStoreItems([]);
    
    const state = TURN_STATE[turn];
    const attach = ATTACHMENTS[attachment];
    const msgTokens = Math.ceil(userMsg.length / 4) + 5;

    // Simulation Sequence
    addLog(<span><span className="text-purple-400">user &rarr;</span> <span className="text-zinc-500 italic">&quot;{userMsg}&quot;</span></span>);
    await sleep(400);
    addLog(<span><span className="text-accent">agent</span> <span className="text-zinc-500">assembling context payload...</span></span>);
    await sleep(400);
    addLog(<span><span className="text-zinc-500 pl-4">&middot; system prompt</span> <span className="text-purple-400">+{state.systemTokens} tokens</span></span>);
    await sleep(300);

    if (state.historyTokens > 0) {
      addLog(<span><span className="text-zinc-500 pl-4">&middot; conversation history</span> <span className="text-amber-500">+{state.historyTokens.toLocaleString()} tokens</span></span>);
      await sleep(300);
    }

    if (state.toolTokens > 0) {
      addLog(<span><span className="text-zinc-500 pl-4">&middot; previous tool outputs</span> <span className="text-amber-500">+{state.toolTokens.toLocaleString()} tokens inline</span></span>);
      await sleep(400);
      addLog(<span><span className="text-accent pl-4">&rarr; drive.io: offloading tool outputs to store</span></span>);
      
      const slug = () => Math.random().toString(36).substr(2, 8).toUpperCase();
      const numTools = Math.ceil(state.toolTokens/1000);
      for(let i=0; i<Math.min(numTools, 3); i++) {
        const id = slug();
        setStoreItems(prev => [...prev, { id, tier: 'L1', label: `drive.io/c/${id}`, size: `${Math.round(state.toolTokens/numTools/1024)}KB` }]);
        await sleep(150);
      }
      addLog(<span><span className="text-accent pl-4">&checkmark; replaced {state.toolTokens.toLocaleString()} tokens with {Math.min(numTools,3)*7} token pointers</span></span>);
      await sleep(400);
    }

    if (attach.rawTokens > 0) {
      addLog(<span><span className="text-zinc-500 pl-4">&middot; attachment: {attach.label}</span> <span className="text-red-400">+{attach.rawTokens.toLocaleString()} tokens inline</span></span>);
      await sleep(400);
      const id = Math.random().toString(36).substr(2, 8).toUpperCase();
      setStoreItems(prev => [...prev, { id, tier: 'L0', label: attach.label }]);
      addLog(<span><span className="text-accent pl-4">&rarr; drive.io: stored {attach.label}, pointer = 7 tokens</span></span>);
      await sleep(400);
    }

    addLog(<span><span className="text-zinc-500 pl-4">&middot; user message</span> <span className="text-zinc-500">+{msgTokens} tokens</span></span>);
    await sleep(500);

    // Calculate final stats
    const withoutTotal = state.systemTokens + state.historyTokens + state.toolTokens + attach.rawTokens + msgTokens;
    const withTotal = state.systemTokens + state.historyTokens + (state.toolTokens > 0 ? 7 * Math.ceil(state.toolTokens/1000) : 0) + (attach.rawTokens > 0 ? 7 : 0) + msgTokens;
    const saved = withoutTotal - withTotal;
    const pct = ((saved / withoutTotal) * 100).toFixed(1);

    setStats({
      without: withoutTotal,
      with: withTotal,
      saved: saved,
      pct: pct,
      pctWithout: (withoutTotal / CTX_WINDOW) * 100,
      pctWith: (withTotal / CTX_WINDOW) * 100
    });

    addLog(<span><span className="text-amber-500">without drive.io &rarr;</span> <span className="text-red-400 font-bold">{withoutTotal.toLocaleString()} tokens</span> to LLM</span>);
    await sleep(400);
    addLog(<span><span className="text-accent">with drive.io &rarr;</span> <span className="text-accent font-bold">{withTotal.toLocaleString()} tokens</span> to LLM</span>);
    await sleep(500);
    
    setShowResults(true);
    setIsRunning(false);
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="w-full max-w-5xl mx-auto my-12 bg-surface/50 border border-border-color rounded-2xl overflow-hidden shadow-2xl relative animate-fade-in mb-12">
      <div className="absolute top-0 left-0 bg-accent text-zinc-950 text-[10px] font-bold px-3 py-1 z-10 font-mono tracking-widest uppercase">
        Context.io Simulation
      </div>

      {/* Settings Row */}
      <div className="bg-black/40 border-b border-border-color p-4 pt-10 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-bold text-foreground-muted uppercase tracking-widest font-mono">Turn</span>
            <select 
              value={turn}
              onChange={(e) => setTurn(e.target.value)}
              disabled={isRunning}
              className="bg-black/60 border border-border-color rounded-lg px-3 py-1.5 text-xs font-mono text-white focus:border-accent outline-none cursor-pointer disabled:opacity-50 transition-colors"
            >
              <option value="1">Turn 1 (Fresh)</option>
              <option value="3">Turn 3</option>
              <option value="7">Turn 7 (Warming)</option>
              <option value="15">Turn 15 (Heavy)</option>
              <option value="25">Turn 25 (Critical)</option>
            </select>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-bold text-foreground-muted uppercase tracking-widest font-mono">Attachment</span>
            <select 
              value={attachment}
              onChange={(e) => setAttachment(e.target.value)}
              disabled={isRunning}
              className="bg-black/60 border border-border-color rounded-lg px-3 py-1.5 text-xs font-mono text-white focus:border-accent outline-none cursor-pointer disabled:opacity-50 transition-colors"
            >
              <option value="none">None</option>
              <option value="doc">Document (12KB)</option>
              <option value="code">Codebase (45KB)</option>
              <option value="data">Dataset (100KB)</option>
            </select>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <span className="text-[10px] font-bold text-foreground-muted uppercase tracking-widest font-mono">Query</span>
            <input 
              type="text"
              value={userMsg}
              onChange={(e) => setUserMsg(e.target.value)}
              disabled={isRunning}
              className="bg-black/60 border border-border-color rounded-lg px-3 py-1.5 text-xs font-mono text-white focus:border-accent outline-none w-48 disabled:opacity-50"
            />
          </div>
        </div>
        <button 
          onClick={runSimulation}
          disabled={isRunning}
          className="flex items-center gap-2 px-8 py-2.5 bg-accent text-zinc-950 font-bold rounded-lg hover:bg-white transition-all disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98] font-mono text-xs uppercase tracking-widest group shadow-lg shadow-accent/20"
        >
          {isRunning ? <RotateCcw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current group-hover:translate-x-0.5 transition-transform" />}
          {isRunning ? 'RUNNING...' : 'SEND REQUEST'}
        </button>
      </div>

      {/* Comparison Arena */}
      <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-6 bg-gradient-to-b from-surface/30 to-background/50 relative">
        {/* Without Drive.io */}
        <div className="glass-panel p-6 rounded-2xl border border-border-color/50 flex flex-col group/panel">
           <div className="flex items-center justify-between mb-6">
             <div className="flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
               <span className="text-[10px] font-bold text-red-400 uppercase tracking-widest font-mono">Without Drive.io</span>
             </div>
             {showResults && <span className="text-[10px] font-mono text-red-400 bg-red-400/10 px-2 py-0.5 rounded border border-red-400/20">{stats.without.toLocaleString()} TOK</span>}
           </div>

           <div className="mb-6">
             <div className="flex justify-between text-[10px] font-mono text-foreground-muted mb-2">
               <span>Context Window Consumption</span>
               <span>{showResults ? stats.pctWithout.toFixed(1) : 0}%</span>
             </div>
             <div className="h-2 bg-black/40 rounded-full overflow-hidden border border-white/5">
                <div 
                  className={`h-full transition-all duration-1000 ease-out ${stats.pctWithout > 60 ? 'bg-red-500' : 'bg-amber-500'}`}
                  style={{ width: `${showResults ? stats.pctWithout : 0}%` }}
                />
             </div>
           </div>

           <div className="space-y-3 flex-1">
              {[
                { label: 'System Prompt', color: SWATCHES.system, val: TURN_STATE[turn].systemTokens },
                { label: 'History', color: SWATCHES.history, val: TURN_STATE[turn].historyTokens },
                { label: 'Tool Logs', color: SWATCHES.tool, val: TURN_STATE[turn].toolTokens },
                { label: 'Attachments', color: SWATCHES.attach, val: ATTACHMENTS[attachment].rawTokens },
              ].filter(i => i.val > 0).map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 text-[10px] font-mono animate-in fade-in slide-in-from-left-2" style={{ animationDelay: `${idx * 100}ms` }}>
                  <div className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="text-foreground-muted grow">{item.label}</span>
                  <span className="text-white">{showResults ? item.val.toLocaleString() : '—'}</span>
                </div>
              ))}
           </div>
        </div>

        {/* With Drive.io */}
        <div className="glass-panel p-6 rounded-2xl border border-accent/30 bg-accent/[0.02] flex flex-col group/panel">
           <div className="flex items-center justify-between mb-6">
             <div className="flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
               <span className="text-[10px] font-bold text-accent uppercase tracking-widest font-mono">With Drive.io</span>
             </div>
             {showResults && <span className="text-[10px] font-mono text-accent bg-accent/10 px-2 py-0.5 rounded border border-accent/20">{stats.with.toLocaleString()} TOK</span>}
           </div>

           <div className="mb-6">
             <div className="flex justify-between text-[10px] font-mono text-foreground-muted mb-2">
               <span>Context Window Consumption</span>
               <span>{showResults ? stats.pctWith.toFixed(1) : 0}%</span>
             </div>
             <div className="h-2 bg-black/40 rounded-full overflow-hidden border border-white/5">
                <div 
                  className="h-full bg-accent transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(0,212,170,0.5)]"
                  style={{ width: `${showResults ? stats.pctWith : 0}%` }}
                />
             </div>
           </div>

           <div className="space-y-3 flex-1">
              {[
                { label: 'System Prompt', color: SWATCHES.system, val: TURN_STATE[turn].systemTokens },
                { label: 'History', color: SWATCHES.history, val: TURN_STATE[turn].historyTokens },
                { label: 'Drive.io Pointers', color: SWATCHES.pointer, val: (TURN_STATE[turn].toolTokens > 0 ? 21 : 0) + (ATTACHMENTS[attachment].rawTokens > 0 ? 7 : 0) || 7, isPointer: true },
              ].filter(i => i.val > 0).map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 text-[10px] font-mono animate-in fade-in slide-in-from-right-2" style={{ animationDelay: `${idx * 100}ms` }}>
                  <div className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="text-foreground-muted grow">{item.label}</span>
                  <span className={item.isPointer ? "text-accent font-bold" : "text-white"}>
                    {showResults ? item.val.toLocaleString() : '—'}
                  </span>
                </div>
              ))}
           </div>
        </div>
      </div>

      {/* Agent Log & Store Area */}
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] border-y border-border-color">
        {/* Log */}
        <div className="p-6 border-r border-border-color/50 min-h-[160px] flex flex-col font-sans">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-3 h-3 text-accent" />
            <span className="text-[10px] font-bold text-foreground-muted uppercase tracking-widest font-mono">Agent Logic Relay</span>
          </div>
          <div ref={scrollRef} className="flex-1 font-mono text-[11px] space-y-2 overflow-y-auto max-h-[120px] pr-4 custom-scrollbar">
            {logs.length === 0 && <span className="text-zinc-600 italic">Waiting for simulation trigger...</span>}
            {logs.map((log) => (
              <div key={log.id} className="flex gap-4 animate-in fade-in slide-in-from-bottom-1 duration-300">
                <span className="text-zinc-700 shrink-0">{log.timestamp}</span>
                <span className="text-zinc-300">{log.content}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Store */}
        <div className="p-6 bg-black/20 font-sans">
          <div className="flex items-center gap-2 mb-4">
            <Database className="w-3 h-3 text-blue-400" />
            <span className="text-[10px] font-bold text-foreground-muted uppercase tracking-widest font-mono">Drive.io Store</span>
          </div>
          <div className="space-y-2">
            {storeItems.length === 0 && <span className="text-[10px] font-mono text-zinc-700">No offloaded artifacts.</span>}
            {storeItems.map((item, idx) => (
              <div key={item.id} className="bg-black/40 border border-white/5 rounded-lg px-3 py-2 flex items-center justify-between animate-in zoom-in-95 duration-300" style={{ animationDelay: `${idx * 100}ms` }}>
                <div className="flex flex-col">
                  <span className="text-[9px] font-black text-blue-400 leading-none mb-1 uppercase">{item.tier}</span>
                  <span className="text-[10px] font-mono text-blue-300 truncate max-w-[120px]">{item.label}</span>
                </div>
                {item.size && <span className="text-[9px] font-mono text-zinc-600">{item.size}</span>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Result Metrics */}
      <div className="p-8 bg-black/40 relative font-sans">
         <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center md:text-left">
              <div className={`text-3xl font-black font-mono leading-none mb-1 transition-all duration-500 ${showResults ? 'text-red-400' : 'text-zinc-700'}`}>
                {showResults ? stats.without.toLocaleString() : '0'}
              </div>
              <div className="text-[9px] font-bold text-foreground-muted uppercase tracking-widest font-mono">Raw Inline Tokens</div>
            </div>
            <div className="text-center md:text-left">
              <div className={`text-3xl font-black font-mono leading-none mb-1 transition-all duration-500 ${showResults ? 'text-accent' : 'text-zinc-700'}`}>
                {showResults ? stats.with.toLocaleString() : '0'}
              </div>
              <div className="text-[9px] font-bold text-foreground-muted uppercase tracking-widest font-mono">Managed Tokens</div>
            </div>
            <div className="text-center md:text-left">
              <div className={`text-3xl font-black font-mono leading-none mb-1 transition-all duration-500 ${showResults ? 'text-accent' : 'text-zinc-700'}`}>
                {showResults ? stats.saved.toLocaleString() : '0'}
              </div>
              <div className="text-[9px] font-bold text-foreground-muted uppercase tracking-widest font-mono">Tokens Saved</div>
            </div>
            <div className="text-center md:text-left">
              <div className={`text-4xl font-black font-mono leading-none mb-1 transition-all duration-700 ${showResults ? 'text-accent animate-pulse' : 'text-zinc-700'}`}>
                {showResults ? stats.pct : '0.0'}%
              </div>
              <div className="text-[9px] font-bold text-accent uppercase tracking-widest font-mono">Efficiency Gain</div>
            </div>
         </div>

         {showResults && (
           <div className="mt-8 pt-8 border-t border-border-color/30 animate-in fade-in slide-in-from-top-4 duration-1000">
             <div className="flex items-center justify-between text-[10px] font-bold text-foreground-muted uppercase tracking-widest mb-3 px-1">
               <span>Token Compression Ratio</span>
               <span className="text-accent underline decoration-accent/30 underline-offset-4 font-mono">Pointer Logic vs. Inline Payload</span>
             </div>
             <div className="relative h-6 bg-black/60 rounded-xl overflow-hidden border border-white/5 p-1">
                <div 
                  className="h-full bg-gradient-to-r from-accent to-blue-500 rounded-lg transition-all duration-1000 ease-out shadow-[0_0_20px_rgba(0,212,170,0.3)]"
                  style={{ width: `${stats.pct}%` }}
                />
             </div>
             <p className="mt-4 text-[11px] text-zinc-500 font-medium italic text-center max-w-2xl mx-auto">
                &quot;Drive.io offloads context pressure, allowing smaller, faster models to handle complex data without performance degradation.&quot;
             </p>
           </div>
         )}
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.1);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(88, 166, 255, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(88, 166, 255, 0.4);
        }
      `}</style>
    </div>
  );
}
