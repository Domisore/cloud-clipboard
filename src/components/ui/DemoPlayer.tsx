"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, Terminal, Zap, ArrowUp, ArrowDown } from 'lucide-react';

interface Payload {
  label: string;
  sizeKB: number;
  rawTokens: number;
}

interface Scenario {
  aRole: string;
  bRole: string;
  aFw: string;
  bFw: string;
}

const PAYLOADS: Record<string, Payload> = {
  json: { label: 'JSON config', sizeKB: 1, rawTokens: 284 },
  csv: { label: 'CSV dataset', sizeKB: 50, rawTokens: 13800 },
  code: { label: 'code module', sizeKB: 10, rawTokens: 2701 },
  log: { label: 'log file', sizeKB: 100, rawTokens: 27431 },
};

const SCENARIOS: Record<string, Scenario> = {
  analysis: { aRole: 'data preprocessing agent', bRole: 'analysis agent', aFw: 'AutoGen', bFw: 'CrewAI' },
  codereview: { aRole: 'code generation agent', bRole: 'code review agent', aFw: 'LangGraph', bFw: 'AutoGen' },
  report: { aRole: 'research agent', bRole: 'report writer', aFw: 'CrewAI', bFw: 'LangGraph' },
};

interface LogLine {
  id: string;
  timestamp: string;
  content: React.ReactNode;
  type?: 'hi' | 'warn' | 'err' | 'dim';
}

export function DemoPlayer() {
  const [payloadKey, setPayloadKey] = useState('csv');
  const [scenarioKey, setScenarioKey] = useState('analysis');
  const [isRunning, setIsRunning] = useState(false);
  const [logsA, setLogsA] = useState<LogLine[]>([]);
  const [logsB, setLogsB] = useState<LogLine[]>([]);
  const [tokensA, setTokensA] = useState<number | string>('—');
  const [tokensB, setTokensB] = useState<number>(7);
  const [relayUrl, setRelayUrl] = useState<string>('—');
  const [isRelayActive, setIsRelayActive] = useState(false);
  const [isArrowUpActive, setIsArrowUpActive] = useState(false);
  const [isArrowDownActive, setIsArrowDownActive] = useState(false);
  const [thoughtA, setThoughtA] = useState<React.ReactNode>('Waiting to run...');
  const [thoughtB, setThoughtB] = useState<React.ReactNode>('Waiting for handoff...');
  const [reduction, setReduction] = useState<string>('—');
  const [savingsText, setSavingsText] = useState('Select a payload and run to see live savings');

  const animationRef = useRef<number | null>(null);

  const generateSlug = () => {
    const c = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    return Array.from({ length: 10 }, () => c[Math.floor(Math.random() * c.length)]).join('');
  };

  const getTimestamp = () => {
    const n = new Date();
    return [n.getHours(), n.getMinutes(), n.getSeconds()].map(x => String(x).padStart(2, '0')).join(':');
  };

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const animateNumber = (target: number, setter: React.Dispatch<React.SetStateAction<number | string>>) => {
    const start = 0;
    const duration = 700;
    const startTime = performance.now();

    const step = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(start + target * ease);
      setter(current);
      if (progress < 1) {
        animationRef.current = requestAnimationFrame(step);
      }
    };
    animationRef.current = requestAnimationFrame(step);
  };

  const runSimulation = async () => {
    if (isRunning) return;
    setIsRunning(true);

    const P = PAYLOADS[payloadKey];
    const S = SCENARIOS[scenarioKey];

    // Reset state
    setLogsA([]);
    setLogsB([]);
    setTokensA('—');
    setRelayUrl('—');
    setIsRelayActive(false);
    setIsArrowUpActive(false);
    setIsArrowDownActive(false);
    setReduction('—');
    setSavingsText('simulating...');
    setThoughtA(<ThinkingDots />);
    setThoughtB(<span className="text-foreground-muted">Waiting for handoff...</span>);

    const addLog = (side: 'A' | 'B', content: React.ReactNode, type?: LogLine['type']) => {
      const newLine = {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: getTimestamp(),
        content,
        type
      };
      if (side === 'A') {
        setLogsA(prev => [...prev, newLine]);
      } else {
        setLogsB(prev => [...prev, newLine]);
      }
    };

    // Agent A sequence
    addLog('A', `initializing ${S.aRole}`, 'dim');
    await sleep(400);
    addLog('A', `processing ${P.label} · ${P.sizeKB}KB`, 'dim');
    await sleep(400);
    animateNumber(P.rawTokens, setTokensA);
    addLog('A', `⚠ raw cost = ${P.rawTokens.toLocaleString()} tokens`, 'err');
    await sleep(400);
    addLog('A', `uploading to drive.io…`, 'dim');

    // Upload animation
    setIsArrowUpActive(true);
    await sleep(600);

    // Relay Hub sequence
    const slug = generateSlug();
    const url = `drive.io/c/${slug}`;
    setRelayUrl(url);
    setIsRelayActive(true);
    await sleep(600);

    addLog('A', <span>✓ stored → <span className="text-accent">{url}</span></span>, 'hi');
    await sleep(300);
    addLog('A', <span>✓ pointer cost: <span className="text-accent">7 tokens</span></span>, 'hi');
    setThoughtA(`Uploaded ${P.sizeKB}KB payload to drive.io, pointer dispatched downstream.`);

    setIsArrowUpActive(false);
    setIsArrowDownActive(true);
    await sleep(600);

    // Agent B sequence
    addLog('B', `initializing ${S.bRole}`, 'dim');
    await sleep(300);
    addLog('B', <span>received: <span className="text-accent">{url}</span></span>, 'hi');
    await sleep(400);
    addLog('B', `fetching L1 tier…`, 'dim');
    await sleep(600);
    addLog('B', <span>✓ fetched · <span className="text-accent">7 tokens</span></span>, 'hi');
    await sleep(300);
    const saved = P.rawTokens - 7;
    addLog('B', <span>✓ saved <span className="text-accent">{saved.toLocaleString()}</span> tokens vs inline</span>, 'hi');

    setIsArrowDownActive(false);

    // Final metrics
    const savingPercent = (((P.rawTokens - 7) / P.rawTokens) * 100).toFixed(1);
    setReduction(`${savingPercent}%`);
    setSavingsText(`${savingPercent}% token reduction · ${saved.toLocaleString()} tokens saved this handoff`);
    setThoughtB(`Received drive.io pointer, fetched ${P.label} at L1 tier for 7 tokens.`);

    setIsRunning(false);
  };

  useEffect(() => {
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <div className="w-full max-w-5xl mx-auto my-12 bg-surface border border-border-color rounded-2xl overflow-hidden shadow-2xl animate-fade-in group relative">
      <div className="absolute top-0 left-0 bg-accent text-black text-[10px] font-bold px-2 py-0.5 z-10 font-mono">
          DEMO.EXE
      </div>

      {/* Header Controls */}
      <div className="bg-black/40 border-b border-border-color p-4 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-foreground-muted uppercase tracking-widest font-mono">Payload</span>
            <select 
              value={payloadKey}
              onChange={(e) => setPayloadKey(e.target.value)}
              disabled={isRunning}
              className="bg-black/60 border border-border-color rounded px-2 py-1 text-xs font-mono text-foreground focus:border-accent outline-none cursor-pointer disabled:opacity-50 appearance-none pr-6 relative bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%23718096%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[position:right_0.5rem_center] bg-[length:1.25rem_1.25rem] bg-no-repeat"
            >
              {Object.entries(PAYLOADS).map(([key, p]) => (
                <option key={key} value={key}>{p.label} · {p.sizeKB}KB</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-foreground-muted uppercase tracking-widest font-mono">Scenario</span>
            <select 
              value={scenarioKey}
              onChange={(e) => setScenarioKey(e.target.value)}
              disabled={isRunning}
              className="bg-black/60 border border-border-color rounded px-2 py-1 text-xs font-mono text-foreground focus:border-accent outline-none cursor-pointer disabled:opacity-50 appearance-none pr-6 relative bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%23718096%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[position:right_0.5rem_center] bg-[length:1.25rem_1.25rem] bg-no-repeat"
            >
              <option value="analysis">Data analysis pipeline</option>
              <option value="codereview">Code review workflow</option>
              <option value="report">Report generation</option>
            </select>
          </div>
        </div>
        <button 
          onClick={runSimulation}
          disabled={isRunning}
          className="flex items-center gap-2 px-6 py-2 bg-accent text-background font-bold rounded-md hover:bg-accent/90 transition-all disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98] font-mono text-xs uppercase tracking-widest"
        >
          {isRunning ? <RotateCcw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
          {isRunning ? 'Running' : 'Run Simulation'}
        </button>
      </div>

      {/* Arena */}
      <div className="p-4 sm:p-8 grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-0 items-stretch bg-gradient-to-b from-surface to-background/50 relative">
        {/* Scanline overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%)] z-20 pointer-events-none bg-[length:100%_4px]"></div>
        
        {/* Agent A */}
        <div className="bg-black/40 border border-border-color rounded-xl overflow-hidden flex flex-col shadow-inner z-10 relative">
          <div className="bg-white/5 px-4 py-2 border-b border-border-color flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="text-[10px] font-bold text-accent uppercase tracking-widest font-mono">Agent · A</span>
            </div>
            <span className="text-[9px] font-mono text-foreground-muted">{SCENARIOS[scenarioKey].aFw}</span>
          </div>
          <div className="p-4 flex-1 flex flex-col min-h-[220px]">
            <div className="inline-flex items-center gap-2 px-2 py-1 rounded bg-red-500/10 border border-red-500/20 text-red-400 font-mono text-[10px] mb-4 w-fit">
              <Zap className="w-3 h-3" />
              {tokensA === '—' ? '—' : (Number(tokensA)).toLocaleString()} tokens raw
            </div>
            <div className="space-y-1 mb-4 flex-1">
              {logsA.map(log => (
                <div key={log.id} className="font-mono text-[10px] flex gap-2 animate-in fade-in slide-in-from-bottom-1 duration-300">
                  <span className="text-foreground-muted/50">{log.timestamp}</span>
                  <span className={log.type === 'err' ? 'text-red-400' : log.type === 'hi' ? 'text-accent' : 'text-foreground-muted'}>
                    {log.content}
                  </span>
                </div>
              ))}
            </div>
            <div className="bg-black/60 border border-border-color p-3 rounded-lg text-xs leading-relaxed italic text-foreground-muted min-h-[3rem] border-dashed font-mono">
              {thoughtA}
            </div>
          </div>
        </div>

        {/* Relay Column */}
        <div className="flex flex-col items-center justify-center px-4 py-8 md:py-0 w-full md:w-[140px] gap-4 z-10 relative">
          <div className={`flex flex-col items-center gap-1 transition-colors duration-300 ${isArrowUpActive ? 'text-accent' : 'text-foreground-muted'}`}>
            <ArrowUp className={`w-5 h-5 ${isArrowUpActive ? 'animate-bounce' : ''}`} />
            <span className="text-[9px] font-bold uppercase tracking-tighter font-mono">upload</span>
          </div>
          
          <div className={`w-full bg-black/40 border rounded-xl p-3 text-center transition-all duration-500 ${isRelayActive ? 'border-accent shadow-[0_0_20px_rgba(0,212,170,0.2)] scale-110 bg-accent/5' : 'border-border-color opacity-50'}`}>
            <div className="text-[9px] font-black text-accent uppercase tracking-widest mb-1 font-mono">drive.io</div>
            <div className={`font-mono text-[8px] break-all leading-tight ${isRelayActive ? 'text-accent animate-pulse' : 'text-foreground-muted'}`}>
              {relayUrl}
            </div>
          </div>

          <div className={`flex flex-col items-center gap-1 transition-colors duration-300 ${isArrowDownActive ? 'text-accent' : 'text-foreground-muted'}`}>
            <span className="text-[9px] font-bold uppercase tracking-tighter font-mono">fetch · L1</span>
            <ArrowDown className={`w-5 h-5 ${isArrowDownActive ? 'animate-bounce' : ''}`} />
          </div>
        </div>

        {/* Agent B */}
        <div className="bg-black/40 border border-border-color rounded-xl overflow-hidden flex flex-col shadow-inner z-10 relative">
          <div className="bg-white/5 px-4 py-2 border-b border-border-color flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest font-mono">Agent · B</span>
            </div>
            <span className="text-[9px] font-mono text-foreground-muted">{SCENARIOS[scenarioKey].bFw}</span>
          </div>
          <div className="p-4 flex-1 flex flex-col min-h-[220px]">
            <div className="inline-flex items-center gap-2 px-2 py-1 rounded bg-accent/10 border border-accent/20 text-accent font-mono text-[10px] mb-4 w-fit">
              <Zap className="w-3 h-3" />
              {tokensB} tokens relay
            </div>
            <div className="space-y-1 mb-4 flex-1">
              {logsB.map(log => (
                <div key={log.id} className="font-mono text-[10px] flex gap-2 animate-in fade-in slide-in-from-bottom-1 duration-300">
                  <span className="text-foreground-muted/50">{log.timestamp}</span>
                  <span className={log.type === 'hi' ? 'text-accent' : 'text-foreground-muted'}>
                    {log.content}
                  </span>
                </div>
              ))}
            </div>
            <div className="bg-black/60 border border-border-color p-3 rounded-lg text-xs leading-relaxed italic text-foreground-muted min-h-[3rem] border-dashed font-mono">
              {thoughtB}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Stats */}
      <div className="bg-black/40 border-t border-border-color p-8 z-10 relative">
        <div className="grid grid-cols-3 divide-x divide-border-color content-center">
          <div className="text-center px-4">
            <div className={`text-2xl sm:text-4xl font-black font-mono leading-none mb-1 transition-colors duration-500 ${reduction === '—' ? 'text-foreground' : 'text-red-400/80'}`}>
              {tokensA === '—' ? '—' : Number(tokensA).toLocaleString()}
            </div>
            <div className="text-[10px] text-foreground-muted uppercase tracking-widest font-bold font-mono">raw inline tokens</div>
          </div>
          <div className="text-center px-4">
            <div className="text-2xl sm:text-4xl font-black font-mono text-accent leading-none mb-1">
              7
            </div>
            <div className="text-[10px] text-foreground-muted uppercase tracking-widest font-bold font-mono">pointer tokens</div>
          </div>
          <div className="text-center px-4">
            <div className={`text-2xl sm:text-4xl font-black font-mono leading-none mb-1 transition-colors duration-500 ${reduction === '—' ? 'text-foreground' : 'text-accent animate-pulse'}`}>
              {reduction}
            </div>
            <div className="text-[10px] text-foreground-muted uppercase tracking-widest font-bold font-mono">token reduction</div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border-color/30">
          <div className="h-1 bg-white/5 rounded-full overflow-hidden mb-2">
            <div 
              className="h-full bg-accent transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(0,212,170,0.5)]" 
              style={{ width: reduction === '—' ? '0%' : reduction }}
            />
          </div>
          <div className="text-right text-[10px] font-mono text-foreground-muted uppercase tracking-widest">
            {savingsText}
          </div>
        </div>
      </div>
    </div>
  );
}

function ThinkingDots() {
  return (
    <div className="flex gap-1 items-center h-4">
      <div className="w-1 h-1 rounded-full bg-foreground-muted animate-bounce [animation-delay:-0.3s]" />
      <div className="w-1 h-1 rounded-full bg-foreground-muted animate-bounce [animation-delay:-0.15s]" />
      <div className="w-1 h-1 rounded-full bg-foreground-muted animate-bounce" />
    </div>
  );
}
