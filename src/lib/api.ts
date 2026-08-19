import axios from "axios";
import type { Invoice } from "@/types/invoice";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

// ── Invoices ────────────────────────────────────────────────────

export async function fetchInvoices(address: string): Promise<Invoice[]> {
  const { data } = await apiClient.get(`/api/invoices?address=${address}`);
  return data.invoices ?? [];
}

export async function fetchInvoiceById(id: string): Promise<Invoice> {
  const { data } = await apiClient.get(`/api/invoices/${id}`);
  return data.invoice;
}

export async function createInvoice(
  payload: Omit<Invoice, "id" | "invoiceNumber" | "createdAt" | "status">
): Promise<Invoice> {
  const { data } = await apiClient.post("/api/invoices", payload);
  return data.invoice;
}

export async function updateInvoiceStatus(
  id: string,
  status: string,
  txHash?: string,
  contractAddress?: string
): Promise<Invoice> {
  const { data } = await apiClient.patch(`/api/invoices/${id}`, {
    status,
    txHash,
    contractAddress,
  });
  return data.invoice;
}

// ── Escrow ──────────────────────────────────────────────────────

export async function fundEscrow(payload: {
  invoiceId: string;
  payerAddress: string;
  amount: string;
  currency: "USDC" | "XLM";
  txHash: string;
  contractAddress?: string;
}) {
  const { data } = await apiClient.post("/api/escrow/fund", payload);
  return data;
}

export async function releaseEscrow(payload: {
  invoiceId: string;
  milestoneId?: string;
  senderAddress: string;
  txHash: string;
}) {
  const { data } = await apiClient.post("/api/escrow/release", payload);
  return data;
}

// ── Stellar ─────────────────────────────────────────────────────

export async function fetchStellarAccount(address: string) {
  const { data } = await apiClient.get(`/api/stellar/account/${address}`);
  return data;
}