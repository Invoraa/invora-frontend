import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Invora – On-chain Invoicing on Stellar",
  description: "Create, send, and settle invoices on the Stellar blockchain. Escrow-backed, milestone-ready, open source.",
  keywords: ["invoice", "stellar", "blockchain", "soroban", "web3", "payments"],
  openGraph: {
    title: "Invora",
    description: "On-chain invoicing and payment platform built on Stellar",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}