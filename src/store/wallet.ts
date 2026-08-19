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
  // Dynamically import to avoid SSR issues
  const freighter = await import("@stellar/freighter-api");
  const connected = await freighter.isConnected();
  if (!connected) throw new Error("Freighter extension not found. Please install it.");
  const allowed = await freighter.isAllowed();
  if (!allowed) {
    await freighter.setAllowed();
  }
  const result = await freighter.getPublicKey();
  if (!result) throw new Error("Could not retrieve public key from Freighter.");
  return result;
}

export const useWalletStore = create<WalletState>()(
  persist(
    (set, get) => ({
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

      disconnect: () => {
        set({ publicKey: null, walletType: null, error: null });
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: "invora-wallet",
      partialState: (state: WalletState) => ({
        publicKey: state.publicKey,
        walletType: state.walletType,
      }),
    }
  )
);