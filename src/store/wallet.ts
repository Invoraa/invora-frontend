import { create } from "zustand";
import { persist } from "zustand/middleware";

export type WalletType = "freighter" | "albedo" | "xbull" | null;

export interface WalletState {
  publicKey: string | null;
  walletType: WalletType;
  isConnecting: boolean;
  error: string | null;
  connect: (walletType: WalletType) => Promise<void>;
  disconnect: () => void;
  clearError: () => void;
}

async function getFreighterPublicKey(): Promise<string> {
  if (typeof window === "undefined") throw new Error("Not in browser");
  // dynamic import avoids SSR breakage
  const freighter = await import("@stellar/freighter-api");
  const { isConnected } = await freighter.isConnected();
  if (!isConnected) throw new Error("Freighter extension not found. Please install it.");
  const { isAllowed } = await freighter.isAllowed();
  if (!isAllowed) {
    await freighter.setAllowed();
  }
  const { publicKey, error } = await freighter.getPublicKey();
  if (error) throw new Error(error);
  if (!publicKey) throw new Error("Could not retrieve public key from Freighter.");
  return publicKey;
}

export const useWalletStore = create<WalletState>()(
  persist(
    (set) => ({
      publicKey: null,
      walletType: null,
      isConnecting: false,
      error: null,

      connect: async (walletType: WalletType) => {
        if (!walletType) return;
        set({ isConnecting: true, error: null });
        try {
          let publicKey: string;
          if (walletType === "freighter") {
            publicKey = await getFreighterPublicKey();
          } else {
            throw new Error(`${walletType} wallet support coming soon.`);
          }
          set({ publicKey, walletType, isConnecting: false });
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : "Failed to connect wallet";
          set({ error: message, isConnecting: false, publicKey: null, walletType: null });
        }
      },

      disconnect: () => set({ publicKey: null, walletType: null, error: null }),
      clearError: () => set({ error: null }),
    }),
    {
      name: "invora-wallet",
      partialize: (state) => ({
        publicKey: state.publicKey,
        walletType: state.walletType,
      }),
    }
  )
);