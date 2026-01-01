import type { Metadata, Viewport } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "@/context/SessionContext";
import { MonetizationWrapper } from "@/components/monetization/MonetizationWrapper";
import { AdUnit } from "@/components/monetization/AdUnit";
import { BMCWidget } from "@/components/monetization/BMCWidget";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#0D0D0D",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "Drive.io | Cloud Clipboard & Anonymous File Sharing",
  description: "Secure, anonymous file sharing with burn-on-read protection. No accounts, no logs, instant sync across devices using QR codes.",
  applicationName: "Drive.io",
  authors: [{ name: "Brane Technologies", url: "https://bigbrane.com" }],
  keywords: ["file sharing", "anonymous upload", "cloud clipboard", "burn on read", "secure storage", "p2p transfer", "ephemeral storage"],
  metadataBase: new URL(process.env.NEXT_PUBLIC_URL || 'https://drive.io'),
  openGraph: {
    title: "Drive.io | Drop. Toss. Store.",
    description: "The fastest way to move files between devices. No login required.",
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
    title: "Drive.io | Anonymous Cloud Clipboard",
    description: "Drop files here, pick them up there. Zero friction encryption.",
    images: ["/icon.png"], // Using the new favicon/icon as a basic twitter image
  },
};

import { Analytics } from "@vercel/analytics/next";
import { InstallPrompt } from "@/components/ui/InstallPrompt";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${jetbrainsMono.variable} antialiased bg-background text-foreground font-mono`}
        suppressHydrationWarning
      >
        <MonetizationWrapper>
          <SessionProvider>
            {children}
            <AdUnit />
            <BMCWidget />
            <Analytics />
            <InstallPrompt />
          </SessionProvider>
        </MonetizationWrapper>
      </body>
    </html>
  );
}
