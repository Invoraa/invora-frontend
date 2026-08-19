import { create } from "zustand";
import type { Invoice } from "@/types/invoice";
import {
  fetchInvoices,
  fetchInvoiceById,
  createInvoice as apiCreateInvoice,
  updateInvoiceStatus,
  type CreateInvoicePayload,
} from "@/lib/api";

interface InvoiceStore {
  invoices: Invoice[];
  currentInvoice: Invoice | null;
  loading: boolean;
  error: string | null;
  loadInvoices: (address: string) => Promise<void>;
  loadInvoice: (id: string) => Promise<void>;
  addInvoice: (payload: CreateInvoicePayload) => Promise<Invoice>;
  patchStatus: (id: string, status: string, txHash?: string, contractAddress?: string) => Promise<void>;
  clearCurrent: () => void;
  clearError: () => void;
}

export const useInvoiceStore = create<InvoiceStore>((set) => ({
  invoices: [],
  currentInvoice: null,
  loading: false,
  error: null,

  loadInvoices: async (address) => {
    set({ loading: true, error: null });
    try {
      const invoices = await fetchInvoices(address);
      set({ invoices, loading: false });
    } catch (err: unknown) {
      set({ error: err instanceof Error ? err.message : "Failed to load invoices", loading: false });
    }
  },

  loadInvoice: async (id) => {
    set({ loading: true, error: null });
    try {
      const invoice = await fetchInvoiceById(id);
      set({ currentInvoice: invoice, loading: false });
    } catch (err: unknown) {
      set({ error: err instanceof Error ? err.message : "Failed to load invoice", loading: false });
    }
  },

  addInvoice: async (payload: CreateInvoicePayload) => {
    set({ loading: true, error: null });
    try {
      const invoice = await apiCreateInvoice(payload);
      set((s) => ({ invoices: [invoice, ...s.invoices], loading: false }));
      return invoice;
    } catch (err: unknown) {
      set({ error: err instanceof Error ? err.message : "Failed to create invoice", loading: false });
      throw err;
    }
  },

  patchStatus: async (id, status, txHash, contractAddress) => {
    try {
      const updated = await updateInvoiceStatus(id, status, txHash, contractAddress);
      set((s) => ({
        invoices: s.invoices.map((inv) => (inv.id === id ? updated : inv)),
        currentInvoice: s.currentInvoice?.id === id ? updated : s.currentInvoice,
      }));
    } catch (err: unknown) {
      set({ error: err instanceof Error ? err.message : "Failed to update invoice" });
    }
  },

  clearCurrent: () => set({ currentInvoice: null }),
  clearError: () => set({ error: null }),
}));