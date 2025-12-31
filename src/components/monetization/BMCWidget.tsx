"use client";

import { useEffect } from "react";
import { MONETIZATION } from "./MonetizationWrapper";

export function BMCWidget() {
    useEffect(() => {
        if (!MONETIZATION.BMC.ENABLED) return;

        // Prevent duplicate scripts based on ID or source
        if (document.querySelector('script[src*="buymeacoffee"]')) return;

        const script = document.createElement('script');
        script.src = "https://cdnjs.buymeacoffee.com/1.0.0/widget.prod.min.js";
        script.setAttribute('data-name', 'BMC-Widget');
        script.setAttribute('data-cfasync', 'false');
        script.setAttribute('data-id', MONETIZATION.BMC.USER_ID);
        script.setAttribute('data-description', 'Support me on Buy me a coffee!');
        script.setAttribute('data-message', 'Thank you for visiting.  I like my coffee with 3 creams and 3 sugars, with the occasional extra espresso shot.');
        script.setAttribute('data-color', '#5F7FFF');
        script.setAttribute('data-position', 'Right');
        script.setAttribute('data-x_margin', '18');
        script.setAttribute('data-y_margin', '18');

        script.async = true;

        script.onload = () => {
            // Force widget initialization since DOMContentLoaded likely already fired
            const evt = new Event('DOMContentLoaded', {
                bubbles: true,
                cancelable: true
            });
            window.dispatchEvent(evt);
        };

        document.body.appendChild(script);

    }, []);

    return null;
}
