"use client";

import { SignIn } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";

export default function Page() {
    const searchParams = useSearchParams();
    const redirectUrl = searchParams.get("redirect_url") || "/dashboard";

    return (
        <div className="flex justify-center items-center min-h-screen">
            <SignIn fallbackRedirectUrl={redirectUrl} />
        </div>
    );
}
