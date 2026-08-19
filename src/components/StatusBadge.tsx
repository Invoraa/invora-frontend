import { clsx } from "clsx";
import type { InvoiceStatus } from "@/types/invoice";

const STATUS_CONFIG: Record<string, { label: string; classes: string }> = {
  draft:           { label: "Draft",          classes: "bg-gray-100 text-gray-600" },
  pending:         { label: "Pending",        classes: "bg-yellow-100 text-yellow-700" },
  in_escrow:       { label: "In Escrow",      classes: "bg-blue-100 text-blue-700" },
  partially_paid:  { label: "Partial",        classes: "bg-purple-100 text-purple-700" },
  paid:            { label: "Paid",           classes: "bg-green-100 text-green-700" },
  released:        { label: "Released",       classes: "bg-green-100 text-green-700" },
  disputed:        { label: "Disputed",       classes: "bg-red-100 text-red-700" },
  cancelled:       { label: "Cancelled",      classes: "bg-gray-100 text-gray-400" },
  completed:       { label: "Completed",      classes: "bg-green-100 text-green-700" },
};

interface StatusBadgeProps {
  status: string;
  size?: "sm" | "md";
}

export function StatusBadge({ status, size = "md" }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status] ?? { label: status, classes: "bg-gray-100 text-gray-600" };
  return (
    <span className={clsx(
      "inline-flex items-center rounded-full font-medium",
      size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm",
      config.classes
    )}>
      {config.label}
    </span>
  );
}