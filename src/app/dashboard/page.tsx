import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ApiKeyDashboard } from "./ApiKeyDashboard";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Developer Dashboard - Drive.io",
    description: "Manage your Agent API Keys and Artifact Relay settings.",
};

export default async function DashboardPage() {
    // Protect the route: if unauthenticated, redirect to sign-in
    const { userId } = await auth();

    if (!userId) {
        redirect("/sign-in?redirect_url=/dashboard");
    }

    return <ApiKeyDashboard />;
}
