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

async function connectFreighter(): Promise<string> {
  if (typeof window === "undefined") {
    throw new Error("Not in browser environment");
  }

  // Dynamically import to prevent SSR errors
  const {
    isConnected,
    isAllowed,
    setAllowed,
    getPublicKey,
  } = await import("@stellar/freighter-api");

  const connected = await isConnected();
  if (!connected) {
    throw new Error("Freighter not found. Please install the Freighter extension.");
  }

  const allowed = await isAllowed();
  if (!allowed) {
    await setAllowed();
  }

  const publicKey = await getPublicKey();
  if (!publicKey) {
    throw new Error("Could not get public key from Freighter.");
  }

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
            publicKey = await connectFreighter();
          } else {
            throw new Error(`${walletType} wallet support coming soon.`);
          }

          set({ publicKey, walletType, isConnecting: false });
        } catch (err: unknown) {
          const message =
            err instanceof Error ? err.message : "Failed to connect wallet";
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