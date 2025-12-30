"use client";

import { useEffect, useRef } from 'react';

export function CarbonAd() {
    const adRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Carbon Ads configuration
        const CARBON_SERVE_ID = 'YOUR_CARBON_SERVE_ID';
        const CARBON_PLACEMENT = 'YOUR_PLACEMENT';

        // Only load if properly configured (not using placeholder values)
        if (CARBON_SERVE_ID === 'YOUR_CARBON_SERVE_ID' || CARBON_PLACEMENT === 'YOUR_PLACEMENT') {
            console.log('Carbon Ads not configured. Update CARBON_SERVE_ID and CARBON_PLACEMENT in CarbonAd.tsx');
            return;
        }

        // Load Carbon Ads script
        const script = document.createElement('script');
        script.src = `//cdn.carbonads.com/carbon.js?serve=${CARBON_SERVE_ID}&placement=${CARBON_PLACEMENT}`;
        script.id = '_carbonads_js';
        script.async = true;

        if (adRef.current) {
            adRef.current.appendChild(script);
        }

        return () => {
            // Cleanup
            const carbonAd = document.getElementById('carbonads');
            if (carbonAd) {
                carbonAd.remove();
            }
        };
    }, []);

    return (
        <div
            ref={adRef}
            className="carbon-ad-wrapper w-full max-w-4xl mx-auto"
        />
    );
}
