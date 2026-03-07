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
  title: "Drive.io | The Cloud Drive for AI Agents",
  description: "Give your AI agents their own persistent file system. Instantly sync files, code, and context between your devices and AI assistants.",
  applicationName: "Drive.io",
  authors: [{ name: "Brane Technologies", url: "https://bigbrane.com" }],
  keywords: ["file sharing", "ai agents", "universal drive", "cloud clipboard", "burn on read", "secure storage", "p2p transfer", "ephemeral storage", "agent context"],
  metadataBase: new URL(process.env.NEXT_PUBLIC_URL || 'https://drive.io'),
  openGraph: {
    title: "Drive.io | The Cloud Drive for AI Agents",
    description: "Give your AI agents their own persistent file system. Instantly sync files, code, and context between your devices and AI assistants.",
    url: "https://drive.io",
    siteName: "Drive.io",
    images: [
      {
        url: "/icon.png", // Fallback to icon for now, or a specific OG image if we had one
        width: 192,
        height: 192,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Drive.io | The Cloud Drive for AI Agents",
    description: "Give your AI agents their own persistent file system. Instantly sync files, code, and context between your devices and AI assistants.",
    images: ["/icon.png"], // Using the new favicon/icon as a basic twitter image
  },
  manifest: "/manifest.json",
  icons: {
    icon: "/icon.png",
    apple: "/icon-192x192.png", // Explicit Apple Touch Icon
  },
};

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
