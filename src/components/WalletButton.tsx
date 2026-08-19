"use client";
import { useState } from "react";
import { useWallet } from "@/hooks/useWallet";
import { WalletModal } from "./WalletModal";

export function WalletButton() {
  const { isConnected, shortAddress, disconnect, isConnecting } = useWallet();
  const [showModal, setShowModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  if (isConnecting) {
    return (
      <button
        disabled
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-50 text-brand-600 text-sm font-medium animate-pulse"
      >
        <span className="w-2 h-2 rounded-full bg-brand-400 animate-ping" />
        Connecting…
      </button>
    );
  }

  if (isConnected && shortAddress) {
    return (
      <div className="relative">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-50 border border-brand-100 text-brand-700 text-sm font-medium hover:bg-brand-100 transition-colors"
        >
          <span className="w-2 h-2 rounded-full bg-green-400" />
          {shortAddress}
        </button>

        {showMenu && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
            <div className="absolute right-0 top-full mt-2 z-20 bg-white rounded-xl shadow-lg border border-gray-100 py-1 min-w-[160px]">
              <button
                onClick={() => { navigator.clipboard.writeText(shortAddress); setShowMenu(false); }}
                className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-50"
              >
                Copy address
              </button>
              <button
                onClick={() => { disconnect(); setShowMenu(false); }}
                className="w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-red-50"
              >
                Disconnect
              </button>
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="px-4 py-2 rounded-xl bg-brand-600 text-white text-sm font-semibold hover:bg-brand-700 transition-colors"
      >
        Connect Wallet
      </button>
      <WalletModal open={showModal} onClose={() => setShowModal(false)} />
    </>
  );
}