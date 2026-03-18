import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { JetBrains_Mono, Inter } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "@/context/SessionContext";
import { MonetizationWrapper } from "@/components/monetization/MonetizationWrapper";
import { AdUnit } from "@/components/monetization/AdUnit";
import { BMCWidget } from "@/components/monetization/BMCWidget";
import { ClerkProvider } from "@clerk/nextjs";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#0D0D0D",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "drive.io | The Data Persistence Layer for AI Agents",
  description: "Programmatically move datasets, context windows, and files between autonomous agents. Secure, ephemeral storage built for the Agent Swarm.",
  applicationName: "Pclip",
  other: {
    "llms": "/llms.txt",
    "skill": "/skill.md",
    "ai-discovery": "/ai.txt"
  },
  authors: [{ name: "Brane Technologies", url: "https://bigbrane.com" }],
  keywords: ["AI Agents", "Agent Swarm", "LLM Storage", "Agentic Workflow", "Programmatic File Sharing", "Data Persistence Layer", "Y Combinator", "Autonomous Agents", "Moltbot", "OpenClaw"],
  metadataBase: new URL(process.env.NEXT_PUBLIC_URL || 'https://drive.io'),
  openGraph: {
    title: "drive.io | Data Persistence for the Agent Swarm",
    description: "The fastest way to programmatically move files and context between autonomous agents. Neutral, cross-framework artifact relay.",
    url: "https://drive.io",
    siteName: "drive.io",
    images: [
      {
        url: "/icon.png",
        width: 192,
        height: 192,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "drive.io | S3 for AI Agents",
    description: "Bypass human-centric rate limits. Generate instantly accessible storage URLs directly from standard agent outputs.",
    images: ["/icon.png"],
  },
  manifest: "/manifest.json",
  icons: {
    icon: "/icon.png",
    apple: "/pclip-192x192.png", // Explicit Apple Touch Icon for iOS PWA defaults
  },
};

import { DriveBotConcierge } from "@/components/moltbot/DriveBotConcierge";
import { Analytics } from "@vercel/analytics/next";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-LN27GX1JSV"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-LN27GX1JSV');
        `}
      </Script>
      <body
        className={`${jetbrainsMono.variable} ${inter.variable} antialiased bg-background text-foreground font-sans`}
        suppressHydrationWarning
      >
        <ClerkProvider>
          <MonetizationWrapper>
            <SessionProvider>
              {children}
              <DriveBotConcierge />
              <AdUnit />
              <BMCWidget />
              <Analytics />
            </SessionProvider>
          </MonetizationWrapper>
        </ClerkProvider>
      </body>
    </html>
  );
}
