import { Horizon } from "@stellar/stellar-sdk";

export const STELLAR_NETWORK = process.env.NEXT_PUBLIC_STELLAR_NETWORK ?? "testnet";

export const horizonUrl =
  STELLAR_NETWORK === "mainnet"
    ? "https://horizon.stellar.org"
    : "https://horizon-testnet.stellar.org";

export const server = new Horizon.Server(horizonUrl);

export const USDC_ASSET_CODE = "USDC";
export const USDC_ISSUER_TESTNET = "GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5";

export async function getAccountBalances(publicKey: string) {
  const account = await server.loadAccount(publicKey);
  return account.balances;
}

export function formatStellarAmount(amount: string): string {
  return parseFloat(amount).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 7,
  });
}