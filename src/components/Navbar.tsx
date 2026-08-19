"use client";
import Link from "next/link";
import { WalletButton } from "./WalletButton";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-gray-100">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-gray-900">
          <span className="text-brand-600">⚡</span>
          Invora
        </Link>
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors"
          >
            Dashboard
          </Link>
          <WalletButton />
        </div>
      </div>
    </nav>
  );
}