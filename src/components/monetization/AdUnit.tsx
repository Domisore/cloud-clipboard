"use client";

import { useEffect, useRef } from "react";
import { MONETIZATION } from "./MonetizationWrapper";

interface AdUnitProps {
    className?: string;
}

export function AdUnit({ className = "" }: AdUnitProps) {
    if (!MONETIZATION.AADS.ENABLED) return null;

    return (
        <div
            className={`fixed bottom-0 left-0 z-[99998] ${className}`}
            style={{ width: 'auto', maxWidth: '200px' }} // Constrain slightly so it doesn't take full width
        >
            {/* User provided snippet */}
            <div id="frame" style={{ width: '100%', margin: 'auto', position: 'relative', zIndex: 99998 }}>
                <iframe
                    data-aa='2422688'
                    src='//acceptable.a-ads.com/2422688/?size=Adaptive'
                    style={{ border: 0, padding: 0, width: '100%', height: '100%', overflow: 'hidden', display: 'block', margin: 'auto' }}
                ></iframe>
            </div>
        </div>
    );
}
