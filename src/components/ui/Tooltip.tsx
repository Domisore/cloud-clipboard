"use client";

import React, { ReactNode } from 'react';

interface TooltipProps {
    children: ReactNode;
    content: string;
}

export function Tooltip({ children, content }: TooltipProps) {
    return (
        <div className="relative flex items-center justify-center group">
            {children}
            {/* Tooltip Popup */}
            <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-max max-w-[200px] 
                          hidden group-hover:block z-50">
                <div className="bg-surface border border-accent/20 text-gray-200 text-xs px-3 py-2 
                              rounded shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] relative">
                    {/* Tiny arrow pointing up */}
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-surface border-t border-l border-accent/20 rotate-45"></div>
                    {content}
                </div>
            </div>
        </div>
    );
}
