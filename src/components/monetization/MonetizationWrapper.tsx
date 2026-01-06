"use client";

import { ReactNode } from "react";

export const MONETIZATION = {
    AADS: {
        ENABLED: false, // process.env.NEXT_PUBLIC_AADS_ENABLED === 'true',
        UNIT_ID: process.env.NEXT_PUBLIC_AADS_UNIT_ID || ''
    },
    BMC: {
        ENABLED: process.env.NEXT_PUBLIC_BMC_ENABLED === 'true',
        USER_ID: process.env.NEXT_PUBLIC_BMC_USER_ID || 'drive_io'
    },
    AFFILIATES: {
        ENABLED: process.env.NEXT_PUBLIC_AFFILIATES_ENABLED === 'true',
        VPN_URL: process.env.NEXT_PUBLIC_VPN_AFFILIATE_URL || '#'
    },
    CARBON: {
        ENABLED: process.env.NEXT_PUBLIC_CARBON_ADS_ENABLED === 'true'
    }
};

export function MonetizationWrapper({ children }: { children: ReactNode }) {
    return (
        <>
            {children}
        </>
    );
}
