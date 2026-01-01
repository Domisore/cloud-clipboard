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
  title: "Drive.io | Drop. Toss. Store.",
  description: "High-utility, ephemeral storage PWA designed for maximum speed and zero friction.",
};

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
          </SessionProvider>
        </MonetizationWrapper>
      </body>
    </html>
  );
}
