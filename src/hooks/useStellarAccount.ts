"use client";
import { useEffect, useState } from "react";
import { useWallet } from "./useWallet";

export interface StellarBalance {
  asset_type: string;
  asset_code?: string;
  asset_issuer?: string;
  balance: string;
}

export function useStellarAccount() {
  const { publicKey, isConnected } = useWallet();
  const [balances, setBalances] = useState<StellarBalance[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isConnected || !publicKey) {
      setBalances([]);
      return;
    }

    async function fetchBalances() {
      setLoading(true);
      setError(null);
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "";
        const res = await fetch(`${apiUrl}/api/stellar/account/${publicKey}`);
        if (!res.ok) throw new Error("Failed to fetch account");
        const data = await res.json();
        setBalances(data.balances ?? []);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to load balances");
      } finally {
        setLoading(false);
      }
    }

    fetchBalances();
  }, [publicKey, isConnected]);

  const xlmBalance = balances.find((b) => b.asset_type === "native")?.balance ?? "0";
  const usdcBalance =
    balances.find((b) => b.asset_code === "USDC")?.balance ?? "0";

  return { balances, xlmBalance, usdcBalance, loading, error };
}