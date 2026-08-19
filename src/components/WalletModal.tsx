"use client";
import { useState } from "react";
import { useWallet } from "@/hooks/useWallet";
import type { WalletType } from "@/store/wallet";

const WALLETS: { id: WalletType; name: string; icon: string; description: string }[] = [
  {
    id: "freighter",
    name: "Freighter",
    icon: "🚀",
    description: "Browser extension by Stellar Development Foundation",
  },
  {
    id: "albedo",
    name: "Albedo",
    icon: "🔑",
    description: "Web-based Stellar wallet — no install needed",
  },
  {
    id: "xbull",
    name: "xBull",
    icon: "🐂",
    description: "Feature-rich Stellar wallet",
  },
];

interface WalletModalProps {
  open: boolean;
  onClose: () => void;
}

export function WalletModal({ open, onClose }: WalletModalProps) {
  const { connect, isConnecting, error, clearError } = useWallet();
  const [connecting, setConnecting] = useState<WalletType>(null);

  if (!open) return null;

  async function handleConnect(walletId: WalletType) {
    setConnecting(walletId);
    clearError();
    await connect(walletId);
    setConnecting(null);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-gray-900">Connect Wallet</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-100 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="space-y-2">
          {WALLETS.map((wallet) => (
            <button
              key={wallet.id}
              onClick={() => handleConnect(wallet.id)}
              disabled={isConnecting}
              className="w-full flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-brand-200 hover:bg-brand-50 transition-all text-left disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="text-2xl">{wallet.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900">{wallet.name}</p>
                <p className="text-xs text-gray-500 truncate">{wallet.description}</p>
              </div>
              {connecting === wallet.id && (
                <span className="text-sm text-brand-600 animate-pulse">Connecting…</span>
              )}
            </button>
          ))}
        </div>

        <p className="mt-4 text-xs text-gray-400 text-center">
          By connecting, you agree to use this app on Stellar{" "}
          {process.env.NEXT_PUBLIC_STELLAR_NETWORK ?? "testnet"}.
        </p>
      </div>
    </div>
  );
}