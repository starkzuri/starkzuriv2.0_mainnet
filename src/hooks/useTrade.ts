// src/hooks/useTrade.ts
import { useCallback } from "react";
import { CallData, uint256 } from "starknet";
import { toast } from "sonner";
import { useAuth } from "./useAuth";

// 🔴 REPLACE WITH REAL ADDRESSES
const HUB_ADDRESS = import.meta.env.VITE_HUB_ADDRESS;
const USDC_ADDRESS = import.meta.env.VITE_USDC_ADDRESS;

export const useTrade = () => {
  // 🟢 CHANGE: Get account from your WalletContext, not starknet-react
  const { execute, address, isConnected } = useAuth();

  const buyShares = useCallback(
    async (marketId: string, isYes: boolean, amount: number) => {
      if (!isConnected || !address) {
        toast.error("Please connect your wallet first!");
        return;
      }

      try {
        toast.loading("Preparing transaction...");

        const decimals = 6;
        const rawAmount = BigInt(Math.floor(amount * 10 ** decimals));
        const uintAmount = uint256.bnToUint256(rawAmount);

        const calls = [
          {
            contractAddress: USDC_ADDRESS,
            entrypoint: "approve",
            calldata: CallData.compile({
              spender: HUB_ADDRESS,
              amount: uintAmount,
            }),
          },
          {
            contractAddress: HUB_ADDRESS,
            entrypoint: "buy_shares",
            calldata: CallData.compile({
              market_id: marketId,
              is_yes: isYes ? 1 : 0,
              investment_amount: uintAmount,
            }),
          },
        ];

        console.log("🚀 Sending transaction...", calls);

        // 🟢 NOTE: starknetkit accounts act just like standard accounts
        const { transaction_hash } = await execute(calls);

        console.log("✅ Tx Hash:", transaction_hash);
        toast.success("Transaction Sent!");
        console.log(`Voyager: https://voyager.online/tx/${transaction_hash}`);

        return transaction_hash;
      } catch (error: any) {
        console.error("❌ Trade Failed:", error);
        const msg = error.message.includes("User rejected")
          ? "Transaction rejected by user"
          : "Trade failed. Check console.";
        toast.error(msg);
      }
    },
    [execute, address, isConnected],
  );

  return { buyShares };
};
