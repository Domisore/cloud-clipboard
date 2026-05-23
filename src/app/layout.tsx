import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { JetBrains_Mono, Inter, IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
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

const ibmPlexMono = IBM_Plex_Mono({
  weight: ["400", "700"],
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
});

const ibmPlexSans = IBM_Plex_Sans({
  weight: ["400", "700"],
  variable: "--font-ibm-plex-sans",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#0D0D0D",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "Drive.io | The Hard Drive for AI Agents",
  description: "Give your AI agents a secure place to store files, share documents, and remember past conversations across platforms like Cursor, LangGraph, and AutoGen.",
  applicationName: "Drive.io",
  other: {
    "llms": "/llms.txt",
    "skill": "/skill.md",
    "ai-discovery": "/ai.txt"
  },
  authors: [{ name: "Brane Technologies", url: "https://bigbrane.com" }],
  keywords: ["AI Agents", "Agent Hard Drive", "Agentic Workspace", "Universal Storage", "AI Memory", "Data Persistence", "Autonomous Agents", "Moltbot", "Cursor AI", "LangGraph"],
  metadataBase: new URL(process.env.NEXT_PUBLIC_URL || 'https://drive.io'),
  openGraph: {
    title: "Drive.io | Universal Storage for AI Assistants",
    description: "The fastest way to programmatically move files and context between autonomous agents. Give your AI a dedicated hard drive.",
    url: "https://drive.io",
    siteName: "Drive.io",
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
    title: "Drive.io | The Hard Drive for AI Agents",
    description: "Stop pasting the same text into chat windows—just give your AI a hard drive.",
    images: ["/icon.png"],
  },
  manifest: "/manifest.json",
  icons: {
    icon: "/icon.png",
    apple: "/icon-192x192.png", 
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
        className={`${jetbrainsMono.variable} ${inter.variable} ${ibmPlexMono.variable} ${ibmPlexSans.variable} antialiased bg-background text-foreground font-sans`}
        suppressHydrationWarning
      >
        <ClerkProvider afterSignOutUrl="/">
          <MonetizationWrapper>
            <SessionProvider>
              {children}
              <DriveBotConcierge />
              <AdUnit />
              <Analytics />
            </SessionProvider>
          </MonetizationWrapper>
        </ClerkProvider>
      </body>
    </html>
  );
}
