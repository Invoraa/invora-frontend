"use client";
import Link from "next/link";
import { format } from "date-fns";
import { StatusBadge } from "./StatusBadge";
import type { Invoice } from "@/types/invoice";

interface InvoiceListProps {
  invoices: Invoice[];
  loading?: boolean;
  emptyMessage?: string;
}

export function InvoiceList({ invoices, loading, emptyMessage = "No invoices yet." }: InvoiceListProps) {
  if (loading) {
    return (
      <div className="divide-y divide-gray-50">
        {[1, 2, 3].map((i) => (
          <div key={i} className="px-6 py-4 flex items-center justify-between animate-pulse">
            <div className="space-y-2">
              <div className="h-4 w-32 bg-gray-100 rounded" />
              <div className="h-3 w-48 bg-gray-100 rounded" />
            </div>
            <div className="h-6 w-16 bg-gray-100 rounded-full" />
          </div>
        ))}
      </div>
    );
  }

  if (invoices.length === 0) {
    return (
      <div className="px-6 py-12 text-center">
        <p className="text-gray-400">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-50">
      {invoices.map((invoice) => (
        <Link key={invoice.id} href={`/invoice/${invoice.id}`} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors group">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3">
              <span className="font-semibold text-gray-900 group-hover:text-brand-600 transition-colors">{invoice.invoiceNumber}</span>
              <StatusBadge status={invoice.status} size="sm" />
            </div>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-sm text-gray-500 truncate">
                To: {invoice.recipient?.name || invoice.recipient?.stellarAddress?.slice(0, 8) + "…"}
              </span>
              <span className="text-gray-300">·</span>
              <span className="text-xs text-gray-400">
                Due {format(new Date(invoice.dueDate), "MMM d, yyyy")}
              </span>
            </div>
          </div>
          <div className="text-right ml-4 shrink-0">
            <p className="font-bold text-gray-900">{parseFloat(invoice.totalAmount).toFixed(2)}</p>
            <p className="text-xs text-gray-400">{invoice.currency}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}