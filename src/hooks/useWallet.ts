"use client";
import { useWalletStore } from "@/store/wallet";

export function useWallet() {
  const { publicKey, walletType, isConnecting, error, connect, disconnect, clearError } =
    useWalletStore();

  const isConnected = !!publicKey;
  const shortAddress = publicKey
    ? `${publicKey.slice(0, 4)}...${publicKey.slice(-4)}`
    : null;

  return {
    publicKey,
    walletType,
    isConnecting,
    isConnected,
    shortAddress,
    error,
    connect,
    disconnect,
    clearError,
  };
}