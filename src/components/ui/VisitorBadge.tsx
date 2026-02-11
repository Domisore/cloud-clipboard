"use client";

import { Users } from 'lucide-react';

export function VisitorBadge() {
    return (
        <div className="flex justify-center items-center py-8 animate-fade-in">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-surface/50 border border-border-color/50 backdrop-blur-sm shadow-sm hover:bg-surface/80 transition-colors">
                <div className="flex -space-x-2">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className={`w-6 h-6 rounded-full border-2 border-background bg-gradient-to-br from-gray-200 to-gray-400 dark:from-gray-700 dark:to-gray-900 flex items-center justify-center text-[8px] font-bold text-white overflow-hidden`}>
                            {/* Placeholder avatars or gradients */}
                            <div className="w-full h-full bg-accent/20"></div>
                        </div>
                    ))}
                </div>
                <div className="h-4 w-px bg-border-color/50 mx-1"></div>
                <div className="flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-accent" />
                    <span className="text-xs font-medium text-foreground-muted">
                        Join <span className="text-foreground font-bold">6,700+</span> visitors sharing securely
                    </span>
                </div>
            </div>
        </div>
    );
}
