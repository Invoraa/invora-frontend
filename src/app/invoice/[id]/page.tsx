"use client";
import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { StatusBadge } from "@/components/StatusBadge";
import { useInvoiceStore } from "@/store/invoices";
import { useWallet } from "@/hooks/useWallet";
import { format } from "date-fns";

export default function InvoiceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { loadInvoice, currentInvoice: invoice, loading, error } = useInvoiceStore();
  const { publicKey } = useWallet();

  useEffect(() => {
    if (id) loadInvoice(id);
  }, [id, loadInvoice]);

  const isSender = publicKey && invoice?.sender?.stellarAddress === publicKey;

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-pulse text-gray-400">Loading invoice…</div>
        </main>
      </>
    );
  }

  if (error || !invoice) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-500 mb-4">{error ?? "Invoice not found"}</p>
            <button onClick={() => router.push("/dashboard")} className="text-brand-600 hover:underline text-sm">← Back to dashboard</button>
          </div>
        </main>
      </>
    );
  }

  const formatDate = (d: string) => {
    try { return format(new Date(d), "MMM d, yyyy"); } catch { return d; }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 pb-16">
        <div className="max-w-3xl mx-auto px-6 py-10">

          {/* Header */}
          <div className="flex items-start justify-between mb-8">
            <div>
              <button onClick={() => router.push("/dashboard")} className="text-sm text-gray-500 hover:text-gray-700 mb-2 flex items-center gap-1">← Dashboard</button>
              <h1 className="text-3xl font-bold text-gray-900">{invoice.invoiceNumber}</h1>
              <p className="text-gray-500 text-sm mt-1">Created {formatDate(invoice.createdAt)}</p>
            </div>
            <StatusBadge status={invoice.status} />
          </div>

          {/* Parties */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {[
              { label: "From", party: invoice.sender },
              { label: "To", party: invoice.recipient },
            ].map(({ label, party }) => (
              <div key={label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">{label}</p>
                <p className="font-semibold text-gray-900">{party?.name || "—"}</p>
                <p className="text-xs font-mono text-gray-500 truncate mt-1" title={party?.stellarAddress}>{party?.stellarAddress}</p>
                {party?.email && <p className="text-xs text-gray-400 mt-1">{party.email}</p>}
              </div>
            ))}
          </div>

          {/* Payment info */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-6">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide">Amount</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{parseFloat(invoice.totalAmount).toFixed(2)}</p>
                <p className="text-sm text-gray-500">{invoice.currency}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide">Due Date</p>
                <p className="text-lg font-semibold text-gray-800 mt-1">{formatDate(invoice.dueDate)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide">Status</p>
                <div className="mt-2 flex justify-center"><StatusBadge status={invoice.status} /></div>
              </div>
            </div>
          </div>

          {/* Line items */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-6 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-50">
              <h2 className="font-semibold text-gray-800">Line Items</h2>
            </div>
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-6 py-3 text-xs text-gray-500 font-medium">Description</th>
                  <th className="text-right px-4 py-3 text-xs text-gray-500 font-medium">Qty</th>
                  <th className="text-right px-4 py-3 text-xs text-gray-500 font-medium">Unit Price</th>
                  <th className="text-right px-6 py-3 text-xs text-gray-500 font-medium">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {invoice.items?.map((item, i) => (
                  <tr key={i}>
                    <td className="px-6 py-3 text-gray-800">{item.description}</td>
                    <td className="px-4 py-3 text-right text-gray-600">{item.quantity}</td>
                    <td className="px-4 py-3 text-right text-gray-600">{parseFloat(item.unitPrice).toFixed(2)} {invoice.currency}</td>
                    <td className="px-6 py-3 text-right font-medium text-gray-900">{parseFloat(item.total).toFixed(2)} {invoice.currency}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50">
                <tr>
                  <td colSpan={3} className="px-6 py-3 text-right font-semibold text-gray-700">Total</td>
                  <td className="px-6 py-3 text-right font-bold text-gray-900">{parseFloat(invoice.totalAmount).toFixed(2)} {invoice.currency}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Milestones */}
          {invoice.milestones && invoice.milestones.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-6 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-50">
                <h2 className="font-semibold text-gray-800">Milestones</h2>
              </div>
              <div className="divide-y divide-gray-50">
                {invoice.milestones.map((m, i) => (
                  <div key={i} className="px-6 py-4 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-800">{m.title}</p>
                      {m.description && <p className="text-xs text-gray-500 mt-0.5">{m.description}</p>}
                      <p className="text-xs text-gray-400 mt-1">Due {formatDate(m.dueDate)}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{parseFloat(m.amount).toFixed(2)} {invoice.currency}</p>
                      <StatusBadge status={m.status} size="sm" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          {invoice.notes && (
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-6">
              <h2 className="font-semibold text-gray-800 mb-2">Notes</h2>
              <p className="text-sm text-gray-600 whitespace-pre-wrap">{invoice.notes}</p>
            </div>
          )}

          {/* On-chain info */}
          {(invoice.txHash || invoice.contractAddress) && (
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-6">
              <h2 className="font-semibold text-gray-800 mb-3">On-chain Details</h2>
              {invoice.txHash && (
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-500">Transaction</span>
                  <a href={`https://stellar.expert/explorer/testnet/tx/${invoice.txHash}`} target="_blank" rel="noopener noreferrer" className="font-mono text-brand-600 hover:underline truncate max-w-xs">{invoice.txHash.slice(0, 20)}…</a>
                </div>
              )}
              {invoice.contractAddress && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Contract</span>
                  <span className="font-mono text-gray-700 truncate max-w-xs">{invoice.contractAddress}</span>
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          {isSender && invoice.status === "draft" && (
            <div className="flex gap-3 justify-end">
              <button className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors">
                Edit
              </button>
              <button className="px-5 py-2.5 rounded-xl bg-brand-600 text-white font-semibold hover:bg-brand-700 transition-colors">
                Send to Client
              </button>
            </div>
          )}
          {invoice.status === "pending" && !isSender && (
            <div className="flex justify-end">
              <button className="px-6 py-3 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors">
                Pay & Fund Escrow
              </button>
            </div>
          )}
          {isSender && invoice.status === "in_escrow" && (
            <div className="flex justify-end">
              <button className="px-6 py-3 rounded-xl bg-brand-600 text-white font-semibold hover:bg-brand-700 transition-colors">
                Release Payment
              </button>
            </div>
          )}
        </div>
      </main>
    </>
  );
}