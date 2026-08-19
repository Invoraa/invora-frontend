"use client";
import { Navbar } from "@/components/Navbar";
import { WalletModal } from "@/components/WalletModal";
import { useWallet } from "@/hooks/useWallet";
import { useStellarAccount } from "@/hooks/useStellarAccount";
import { useState } from "react";

export default function DashboardPage() {
  const { isConnected, publicKey, shortAddress } = useWallet();
  const { xlmBalance, usdcBalance, loading: balancesLoading } = useStellarAccount();
  const [showWallet, setShowWallet] = useState(false);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-5xl mx-auto px-6 py-10">

          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              {isConnected && publicKey ? (
                <p className="text-gray-500 mt-1 font-mono text-sm truncate max-w-xs" title={publicKey}>
                  {publicKey}
                </p>
              ) : (
                <p className="text-gray-500 mt-1">Connect your wallet to get started</p>
              )}
            </div>
            <a
              href="/invoice/new"
              className="px-5 py-2.5 rounded-xl bg-brand-600 text-white font-semibold hover:bg-brand-700 transition-colors"
            >
              + New Invoice
            </a>
          </div>

          {/* Not connected */}
          {!isConnected && (
            <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-12 text-center mb-8">
              <div className="text-4xl mb-3">🔌</div>
              <h2 className="text-lg font-semibold text-gray-700 mb-2">No wallet connected</h2>
              <p className="text-gray-400 text-sm mb-5">
                Connect your Stellar wallet to create and manage invoices
              </p>
              <button
                onClick={() => setShowWallet(true)}
                className="px-5 py-2.5 rounded-xl bg-brand-600 text-white font-semibold hover:bg-brand-700 transition-colors"
              >
                Connect Wallet
              </button>
            </div>
          )}

          {/* Stats */}
          {isConnected && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              {[
                {
                  label: "XLM Balance",
                  value: balancesLoading ? "…" : `${parseFloat(xlmBalance).toFixed(2)} XLM`,
                  color: "text-gray-900",
                },
                {
                  label: "USDC Balance",
                  value: balancesLoading ? "…" : `${parseFloat(usdcBalance).toFixed(2)} USDC`,
                  color: "text-green-700",
                },
                { label: "Pending Invoices", value: "0", color: "text-yellow-600" },
                { label: "Paid Invoices", value: "0", color: "text-brand-600" },
              ].map((stat) => (
                <div key={stat.label} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">{stat.label}</p>
                  <p className={`text-2xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
                </div>
              ))}
            </div>
          )}

          {/* Invoices table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="px-6 py-4 border-b border-gray-50">
              <h2 className="font-semibold text-gray-800">Invoices</h2>
            </div>
            <div className="p-8 text-center">
              <p className="text-gray-400">
                {isConnected ? "No invoices yet. Create your first one!" : "Connect wallet to see your invoices."}
              </p>
            </div>
          </div>
        </div>
      </main>

      <WalletModal open={showWallet} onClose={() => setShowWallet(false)} />
    </>
  );
}