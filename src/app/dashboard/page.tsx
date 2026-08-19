"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { WalletModal } from "@/components/WalletModal";
import { InvoiceList } from "@/components/InvoiceList";
import { useWallet } from "@/hooks/useWallet";
import { useStellarAccount } from "@/hooks/useStellarAccount";
import { useInvoiceStore } from "@/store/invoices";

export default function DashboardPage() {
  const { isConnected, publicKey } = useWallet();
  const { xlmBalance, usdcBalance, loading: balancesLoading } = useStellarAccount();
  const { invoices, loading: invoicesLoading, loadInvoices } = useInvoiceStore();
  const [showWallet, setShowWallet] = useState(false);
  const [filter, setFilter] = useState<"all" | "pending" | "in_escrow" | "paid">("all");

  useEffect(() => {
    if (publicKey) loadInvoices(publicKey);
  }, [publicKey, loadInvoices]);

  const filtered = invoices.filter((inv) => filter === "all" || inv.status === filter);

  const stats = {
    total: invoices.reduce((s, inv) => s + parseFloat(inv.totalAmount || "0"), 0),
    pending: invoices.filter((i) => i.status === "pending").length,
    inEscrow: invoices.filter((i) => i.status === "in_escrow").length,
    paid: invoices.filter((i) => i.status === "paid").length,
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-5xl mx-auto px-6 py-10">

          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              {isConnected && publicKey ? (
                <p className="text-gray-500 mt-1 font-mono text-xs truncate max-w-xs" title={publicKey}>{publicKey}</p>
              ) : (
                <p className="text-gray-500 mt-1">Connect your Stellar wallet to manage invoices</p>
              )}
            </div>
            <Link href="/invoice/new" className="px-5 py-2.5 rounded-xl bg-brand-600 text-white font-semibold hover:bg-brand-700 transition-colors text-sm">
              + New Invoice
            </Link>
          </div>

          {!isConnected ? (
            <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-16 text-center mb-8">
              <div className="text-5xl mb-4">🔌</div>
              <h2 className="text-xl font-semibold text-gray-700 mb-2">No wallet connected</h2>
              <p className="text-gray-400 text-sm mb-6">Connect your Stellar wallet to create invoices and track payments</p>
              <button onClick={() => setShowWallet(true)} className="px-6 py-3 rounded-xl bg-brand-600 text-white font-semibold hover:bg-brand-700 transition-colors">
                Connect Wallet
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                {[
                  { label: "XLM Balance", value: balancesLoading ? "…" : `${parseFloat(xlmBalance).toFixed(2)} XLM`, color: "text-gray-900" },
                  { label: "USDC Balance", value: balancesLoading ? "…" : `${parseFloat(usdcBalance).toFixed(2)} USDC`, color: "text-green-700" },
                  { label: "Pending", value: String(stats.pending), color: "text-yellow-600" },
                  { label: "Paid", value: String(stats.paid), color: "text-brand-600" },
                ].map((stat) => (
                  <div key={stat.label} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                    <p className="text-xs text-gray-400 uppercase tracking-wide">{stat.label}</p>
                    <p className={`text-2xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
                  <h2 className="font-semibold text-gray-800">Invoices</h2>
                  <div className="flex gap-1">
                    {(["all", "pending", "in_escrow", "paid"] as const).map((f) => (
                      <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${filter === f ? "bg-brand-100 text-brand-700" : "text-gray-500 hover:bg-gray-100"}`}>
                        {f === "in_escrow" ? "Escrow" : f.charAt(0).toUpperCase() + f.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
                <InvoiceList invoices={filtered} loading={invoicesLoading} emptyMessage={filter === "all" ? "No invoices yet. Create your first one!" : `No ${filter} invoices.`} />
              </div>
            </>
          )}
        </div>
      </main>
      <WalletModal open={showWallet} onClose={() => setShowWallet(false)} />
    </>
  );
}