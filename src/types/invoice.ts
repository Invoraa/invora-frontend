export type InvoiceStatus =
  | "draft"
  | "pending"
  | "in_escrow"
  | "partially_paid"
  | "paid"
  | "disputed"
  | "cancelled";

export type MilestoneStatus = "pending" | "completed" | "released";

export interface Milestone {
  id: string;
  title: string;
  description?: string;
  amount: string;
  dueDate: string;
  status: MilestoneStatus;
  txHash?: string;
}

export interface InvoiceItem {
  id?: string;
  description: string;
  quantity: number;
  unitPrice: string;
  total: string;
}

export interface InvoiceParty {
  name?: string;
  stellarAddress: string;
  email?: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  createdAt: string;
  dueDate: string;
  status: InvoiceStatus;
  // Flattened fields from DB
  senderAddress?: string;
  senderName?: string;
  senderEmail?: string;
  recipientAddress?: string;
  recipientName?: string;
  recipientEmail?: string;
  // Nested party objects (for display)
  sender?: InvoiceParty;
  recipient?: InvoiceParty;
  items?: InvoiceItem[];
  currency: "USDC" | "XLM";
  totalAmount: string;
  milestones?: Milestone[];
  contractAddress?: string;
  txHash?: string;
  notes?: string;
}