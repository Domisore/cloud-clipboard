"use client";

import { MONETIZATION } from "./MonetizationWrapper";

export function BMCWidget() {
    if (!MONETIZATION.BMC.ENABLED) return null;

    return (
        <a
            href={`https://www.buymeacoffee.com/${MONETIZATION.BMC.USER_ID}`}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-10 right-4 z-50 hover:scale-105 transition-transform"
            style={{
                lineHeight: 0 // Prevent extra height from text baseline
            }}
        >
            <img
                src={`https://img.buymeacoffee.com/button-api/?text=Buy me a coffee&emoji=&slug=${MONETIZATION.BMC.USER_ID}&button_colour=FFDD00&font_colour=000000&font_family=Cookie&outline_colour=000000&coffee_colour=ffffff`}
                alt="Buy Me a Coffee"
                style={{ height: '40px' }}
            />
        </a>
    );
}
