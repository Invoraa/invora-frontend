"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Navbar } from "@/components/Navbar";
import { useWallet } from "@/hooks/useWallet";
import { useInvoiceStore } from "@/store/invoices";

const ItemSchema = z.object({
  description: z.string().min(1, "Description required"),
  quantity: z.coerce.number().positive("Must be > 0"),
  unitPrice: z.string().min(1, "Price required"),
});

const MilestoneSchema = z.object({
  title: z.string().min(1, "Title required"),
  description: z.string().optional(),
  amount: z.string().min(1, "Amount required"),
  dueDate: z.string().min(1, "Due date required"),
});

const FormSchema = z.object({
  recipientAddress: z.string().length(56, "Must be a valid 56-character Stellar address"),
  recipientName: z.string().min(1, "Recipient name required"),
  recipientEmail: z.string().email("Invalid email").optional().or(z.literal("")),
  currency: z.enum(["USDC", "XLM"]),
  dueDate: z.string().min(1, "Due date required"),
  notes: z.string().optional(),
  items: z.array(ItemSchema).min(1, "Add at least one line item"),
  milestones: z.array(MilestoneSchema).optional(),
});

type FormValues = z.infer<typeof FormSchema>;

export default function NewInvoicePage() {
  const router = useRouter();
  const { publicKey, isConnected } = useWallet();
  const { addInvoice } = useInvoiceStore();
  const [submitting, setSubmitting] = useState(false);
  const [useMilestones, setUseMilestones] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const { register, control, handleSubmit, watch, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      currency: "USDC",
      items: [{ description: "", quantity: 1, unitPrice: "" }],
      milestones: [],
    },
  });

  const { fields: itemFields, append: addItem, remove: removeItem } = useFieldArray({ control, name: "items" });
  const { fields: milestoneFields, append: addMilestone, remove: removeMilestone } = useFieldArray({ control, name: "milestones" });

  const watchedItems = watch("items");
  const currency = watch("currency");
  const totalAmount = watchedItems.reduce((sum, item) => sum + (Number(item.quantity) || 0) * (parseFloat(item.unitPrice) || 0), 0);

  async function onSubmit(values: FormValues) {
    if (!publicKey) { setServerError("Connect your wallet first"); return; }
    setSubmitting(true);
    setServerError(null);
    try {
      const items = values.items.map((item) => ({
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        total: (item.quantity * parseFloat(item.unitPrice)).toFixed(7),
      }));
      const invoice = await addInvoice({
        senderAddress: publicKey,
        recipientAddress: values.recipientAddress,
        recipientName: values.recipientName,
        recipientEmail: values.recipientEmail || undefined,
        currency: values.currency,
        dueDate: new Date(values.dueDate).toISOString(),
        notes: values.notes,
        items,
        milestones: useMilestones ? values.milestones : undefined,
        totalAmount: totalAmount.toFixed(7),
      });
      router.push(`/invoice/${invoice.id}`);
    } catch {
      setServerError("Failed to create invoice. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 pb-16">
        <div className="max-w-3xl mx-auto px-6 py-10">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">New Invoice</h1>
            <p className="text-gray-500 mt-1">Fill in the details below to create an on-chain invoice</p>
          </div>

          {!isConnected && (
            <div className="mb-6 p-4 rounded-xl bg-yellow-50 border border-yellow-100 text-yellow-800 text-sm">
              ⚠️ Connect your Stellar wallet before creating an invoice.
            </div>
          )}
          {serverError && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-700 text-sm">{serverError}</div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="font-semibold text-gray-800 mb-4">Recipient</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stellar Address *</label>
                  <input {...register("recipientAddress")} placeholder="G..." className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 font-mono" />
                  {errors.recipientAddress && <p className="text-red-500 text-xs mt-1">{errors.recipientAddress.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                  <input {...register("recipientName")} placeholder="Acme Corp" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
                  {errors.recipientName && <p className="text-red-500 text-xs mt-1">{errors.recipientName.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email (optional)</label>
                  <input {...register("recipientEmail")} type="email" placeholder="client@example.com" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
                </div>
              </div>
            </section>

            <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="font-semibold text-gray-800 mb-4">Payment Details</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                  <select {...register("currency")} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white">
                    <option value="USDC">USDC</option>
                    <option value="XLM">XLM</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Due Date *</label>
                  <input {...register("dueDate")} type="date" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
                  {errors.dueDate && <p className="text-red-500 text-xs mt-1">{errors.dueDate.message}</p>}
                </div>
              </div>
            </section>

            <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-gray-800">Line Items</h2>
                <button type="button" onClick={() => addItem({ description: "", quantity: 1, unitPrice: "" })} className="text-sm text-brand-600 hover:text-brand-700 font-medium">+ Add item</button>
              </div>
              <div className="space-y-3">
                {itemFields.map((field, index) => (
                  <div key={field.id} className="grid grid-cols-12 gap-2 items-start">
                    <div className="col-span-6">
                      {index === 0 && <label className="block text-xs text-gray-500 mb-1">Description</label>}
                      <input {...register(`items.${index}.description`)} placeholder="Design work" className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
                    </div>
                    <div className="col-span-2">
                      {index === 0 && <label className="block text-xs text-gray-500 mb-1">Qty</label>}
                      <input {...register(`items.${index}.quantity`)} type="number" min="1" placeholder="1" className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
                    </div>
                    <div className="col-span-3">
                      {index === 0 && <label className="block text-xs text-gray-500 mb-1">Unit Price ({currency})</label>}
                      <input {...register(`items.${index}.unitPrice`)} placeholder="0.00" className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
                    </div>
                    <div className="col-span-1 flex items-end">
                      {itemFields.length > 1 && (
                        <button type="button" onClick={() => removeItem(index)} className="p-2 text-gray-400 hover:text-red-500 transition-colors">✕</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end">
                <span className="text-sm text-gray-500 mr-2">Total:</span>
                <span className="text-xl font-bold text-gray-900">{totalAmount.toFixed(2)} {currency}</span>
              </div>
            </section>

            <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h2 className="font-semibold text-gray-800">Milestones</h2>
                  <p className="text-xs text-gray-500 mt-0.5">Break payment into stages</p>
                </div>
                <button type="button" onClick={() => setUseMilestones(!useMilestones)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${useMilestones ? "bg-brand-600" : "bg-gray-200"}`}>
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${useMilestones ? "translate-x-6" : "translate-x-1"}`} />
                </button>
              </div>
              {useMilestones && (
                <div className="mt-4 space-y-3">
                  {milestoneFields.map((field, index) => (
                    <div key={field.id} className="p-4 rounded-xl bg-gray-50 border border-gray-100 space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Title</label>
                          <input {...register(`milestones.${index}.title`)} placeholder="Phase 1" className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Amount ({currency})</label>
                          <input {...register(`milestones.${index}.amount`)} placeholder="500" className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Due Date</label>
                          <input {...register(`milestones.${index}.dueDate`)} type="date" className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Description</label>
                          <input {...register(`milestones.${index}.description`)} placeholder="Deliverables..." className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
                        </div>
                      </div>
                      <button type="button" onClick={() => removeMilestone(index)} className="text-xs text-red-400 hover:text-red-600">Remove</button>
                    </div>
                  ))}
                  <button type="button" onClick={() => addMilestone({ title: "", description: "", amount: "", dueDate: "" })} className="w-full py-2 rounded-xl border border-dashed border-brand-300 text-brand-600 text-sm hover:bg-brand-50 transition-colors">
                    + Add milestone
                  </button>
                </div>
              )}
            </section>

            <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="font-semibold text-gray-800 mb-4">Notes</h2>
              <textarea {...register("notes")} rows={3} placeholder="Payment terms, project scope..." className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none" />
            </section>

            <div className="flex items-center justify-between">
              <button type="button" onClick={() => router.back()} className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors">Cancel</button>
              <button type="submit" disabled={submitting || !isConnected} className="px-6 py-2.5 rounded-xl bg-brand-600 text-white font-semibold hover:bg-brand-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                {submitting ? "Creating…" : "Create Invoice"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </>
  );
}