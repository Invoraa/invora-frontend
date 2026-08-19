export type InvoiceStatus = "draft" | "pending" | "in_escrow" | "released" | "disputed" | "cancelled";

export interface Milestone {
  id: string;
  title: string;
  description: string;
  amount: string;
  dueDate: string;
  status: "pending" | "completed" | "released";
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  createdAt: string;
  dueDate: string;
  status: InvoiceStatus;
  sender: {
    name: string;
    stellarAddress: string;
    email?: string;
  };
  recipient: {
    name: string;
    stellarAddress: string;
    email?: string;
  };
  items: Array<{
    description: string;
    quantity: number;
    unitPrice: string;
    total: string;
  }>;
  currency: "USDC" | "XLM";
  totalAmount: string;
  milestones?: Milestone[];
  contractAddress?: string;
  txHash?: string;
  notes?: string;
}