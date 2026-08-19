import { useCallback } from "react";
import { CallData, uint256 } from "starknet";
import { toast } from "sonner";
import { useAuth } from "./useAuth";

const HUB_ADDRESS = import.meta.env.VITE_HUB_ADDRESS;
const USDC_ADDRESS = import.meta.env.VITE_USDC_ADDRESS;

export const useTrade = () => {
  const { execute, address, isConnected } = useAuth();

  const buyShares = useCallback(
    async (marketId: string, isYes: boolean, amount: number) => {
      if (!isConnected || !address) {
        toast.error("Please connect your wallet first!");
        return;
      }

      const toastId = toast.loading("Preparing transaction...");

      try {
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
        const { transaction_hash } = await execute(calls);
        console.log("✅ Tx Hash:", transaction_hash);
        console.log(`Voyager: https://voyager.online/tx/${transaction_hash}`);

        toast.success("Transaction sent!", { id: toastId });
        return transaction_hash;
      } catch (error: any) {
        console.error("❌ Trade Failed:", error);

        let msg = "Trade failed. Check console.";
        if (error.message?.includes("User rejected")) {
          msg = "Transaction rejected by user";
        } else if (error.message?.includes("below the required threshold")) {
          // 🟢 THE FIX: Handle the Starknet gas spike gracefully
          msg = "Network gas spiked! Please try again to recalculate fees.";
        }

        toast.error(msg, { id: toastId });
      }
    },
    [execute, address, isConnected],
  );

  const sellShares = useCallback(
    async (marketId: string, isYes: boolean, amountToSell: string | number) => {
      console.log(
        "marketid",
        marketId,
        "isyes",
        isYes,
        "amount to sell",
        amountToSell,
      );

      if (!isConnected || !address) {
        toast.error("Please connect your wallet first!");
        return;
      }

      const toastId = toast.loading("Preparing sell transaction...");

      try {
        const finalBigIntAmount = BigInt(amountToSell.toString().split(".")[0]);
        const uintAmount = uint256.bnToUint256(finalBigIntAmount);

        const calls = [
          {
            contractAddress: HUB_ADDRESS,
            entrypoint: "sell_shares",
            calldata: CallData.compile({
              market_id: marketId,
              is_yes: isYes ? 1 : 0,
              share_amount: uintAmount,
            }),
          },
        ];

        const { transaction_hash } = await execute(calls);
        toast.success("Shares sold successfully!", { id: toastId });
        return transaction_hash;
      } catch (error: any) {
        console.error("❌ Sell Failed:", error);

        let msg = "Sell failed. Check console.";
        if (error.message?.includes("User rejected")) {
          msg = "Transaction rejected by user";
        } else if (error.message?.includes("Insufficient")) {
          msg = "Insufficient shares to sell";
        } else if (error.message?.includes("below the required threshold")) {
          // 🟢 THE FIX: Handle the Starknet gas spike gracefully
          msg = "Network gas spiked! Please try again to recalculate fees.";
        }

        toast.error(msg, { id: toastId });
      }
    },
    [execute, address, isConnected],
  );

  return { buyShares, sellShares };
};
