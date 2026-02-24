import type React from "react";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import { Suspense } from "react";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://nwc-tester.vercel.app"),
  title: {
    default: "NWC Tester - Advanced NWC Testing Platform",
    template: "%s | NWC Tester",
  },
  description:
    "Professional-grade Nostr Wallet Connect testing platform. Execute NWC commands, manage Lightning payments, and test wallet integrations with real-time analytics and comprehensive transaction monitoring.",
  keywords: [
    "Nostr Wallet Connect",
    "NWC Testing",
    "Lightning Network",
    "Bitcoin Lightning",
    "Lightning Wallet Testing",
    "Bitcoin Connect",
    "WebLN",
    "Lightning Payments",
    "Nostr Protocol",
    "NIP-47",
    "Lightning Invoice",
    "Keysend Payments",
    "Bitcoin Development",
    "Wallet Integration",
    "Lightning Network Tools",
  ],
  creator: "NWC Tester",
  publisher: "NWC Tester",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://nwc-tester.vercel.app",
    title: "NWC Tester - Advanced NWC Testing Platform",
    description:
      "Professional Nostr Wallet Connect testing platform with real-time command execution, transaction analytics, and comprehensive wallet integration testing.",
    siteName: "NWC Tester",
  },
  twitter: {
    card: "summary_large_image",
    title: "NWC Tester - Advanced NWC Testing Platform",
    description:
      "Professional NWC testing platform with real-time analytics and comprehensive wallet integration testing.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable} antialiased`}
      suppressHydrationWarning
    >
      <body className="font-sans">
        <Suspense fallback={null}>{children}</Suspense>
        <Analytics />
      </body>
    </html>
  );
}
