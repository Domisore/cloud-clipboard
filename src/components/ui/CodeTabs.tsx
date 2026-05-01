"use client";

import React, { useState } from 'react';
import { Terminal, Copy, Check } from 'lucide-react';

const snippets = {
  python: `from drive_io import DriveAgent

# Initialize connection to the Storage Layer
agent = DriveAgent(api_key="your_key")

# Write complex state to a new partition
pointer = agent.write({
    "context": "Customer wants to refund order #1234",
    "attachments": ["refund_policy.pdf", "chat_log.json"],
    "priority": "high"
})

print(f"Mounted at: {pointer}") 
# Output: drive://ptr_8x2j9k`,
  nodejs: `import { DriveAgent } from 'drive-io';

const agent = new DriveAgent({ apiKey: 'your_key' });

// Read state using a 7-token hardware pointer
const state = await agent.read('drive://ptr_8x2j9k');

console.log('Retrieved from Drive:', state.context);
// Output: Customer wants to refund order #1234`
};

export function CodeTabs() {
  const [activeTab, setActiveTab] = useState<'python' | 'nodejs'>('python');
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(snippets[activeTab]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-2xl mx-auto bento-card overflow-hidden !p-0 border-border">
      <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-surface/50">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setActiveTab('python')}
            className={`text-xs font-black uppercase tracking-widest transition-colors ${activeTab === 'python' ? 'text-accent' : 'text-foreground-muted hover:text-foreground'}`}
          >
            Python SDK
          </button>
          <button
            onClick={() => setActiveTab('nodejs')}
            className={`text-xs font-black uppercase tracking-widest transition-colors ${activeTab === 'nodejs' ? 'text-accent' : 'text-foreground-muted hover:text-foreground'}`}
          >
            Node.js
          </button>
        </div>
        <button
          onClick={copyToClipboard}
          className="p-2 hover:bg-black/5 rounded-lg transition-colors text-foreground-muted"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>
      <div className="p-6 bg-[#0c0c0d] overflow-x-auto">
        <pre className="text-sm font-mono leading-relaxed">
          <code className="text-zinc-300">
            {snippets[activeTab].split('\n').map((line, i) => (
              <div key={i} className="table-row">
                <span className="table-cell pr-4 text-zinc-600 text-right select-none w-8">{i + 1}</span>
                <span className={line.trim().startsWith('#') || line.trim().startsWith('//') ? 'text-zinc-500 italic' : line.includes('"') || line.includes("'") ? 'text-emerald-400' : 'text-zinc-300'}>
                  {line}
                </span>
              </div>
            ))}
          </code>
        </pre>
      </div>
    </div>
  );
}
