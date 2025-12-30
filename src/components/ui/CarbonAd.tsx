"use client";

import { useEffect, useRef } from 'react';

export function CarbonAd() {
    const adRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Load Carbon Ads script
        const script = document.createElement('script');
        script.src = '//cdn.carbonads.com/carbon.js?serve=YOUR_CARBON_SERVE_ID&placement=YOUR_PLACEMENT';
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
