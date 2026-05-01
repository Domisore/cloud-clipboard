"use client";

import React from 'react';
import { PlusCircle, RefreshCw, Search, ArrowDown } from 'lucide-react';

const steps = [
  {
    id: 'add',
    title: 'Write Block',
    desc: 'Agents commit raw state or artifacts to a dedicated storage partition.',
    icon: PlusCircle,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10'
  },
  {
    id: 'sync',
    title: 'Storage Indexing',
    desc: 'Drive.io performs semantic indexing and automatic versioning of all committed blocks.',
    icon: RefreshCw,
    color: 'text-accent',
    bgColor: 'bg-accent/10'
  },
  {
    id: 'retrieve',
    title: 'Read Cycle',
    desc: 'Instantly pull memories using low-latency pointers, bypassing context window limits.',
    icon: Search,
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-500/10'
  }
];

export function ProcessFlow() {
  return (
    <div className="relative space-y-12 max-w-lg mx-auto py-10">
      {/* Vertical Line */}
      <div className="absolute left-6 top-10 bottom-10 w-[2px] bg-gradient-to-b from-blue-500 via-accent to-emerald-500 opacity-20" />

      {steps.map((step, i) => (
        <div key={step.id} className="relative flex items-start gap-8 group">
          <div className={`flex-shrink-0 w-12 h-12 rounded-full ${step.bgColor} border border-border flex items-center justify-center transition-transform group-hover:scale-110 z-10`}>
            <step.icon className={`w-6 h-6 ${step.color}`} />
          </div>
          <div className="space-y-1 pt-1">
            <h4 className="text-lg font-black text-foreground uppercase tracking-tight italic">{step.title}</h4>
            <p className="text-foreground-muted text-sm font-medium leading-relaxed">
              {step.desc}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
