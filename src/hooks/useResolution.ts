import { useCallback } from "react";
import { CallData, uint256 } from "starknet";
import { toast } from "sonner";
import { useAuth } from "./useAuth";

const HUB_ADDRESS = import.meta.env.VITE_HUB_ADDRESS;
const USDC_ADDRESS = import.meta.env.VITE_USDC_ADDRESS;

export const useResolution = () => {
  const { execute, address, isConnected } = useAuth();

  // 1. PROPOSE OUTCOME (Creator Only)
  const proposeOutcome = useCallback(
    async (marketId: string, outcome: boolean) => {
      if (!address) return toast.error("Connect wallet");
      try {
        toast.loading("Proposing outcome...");

        // Hardcoded 10 USDC Bond (Adjust if your config changes)
        const bondAmount = uint256.bnToUint256(1_000_000n);

        const calls = [
          // 1. Approve Bond
          {
            contractAddress: USDC_ADDRESS,
            entrypoint: "approve",
            calldata: CallData.compile({
              spender: HUB_ADDRESS,
              amount: bondAmount,
            }),
          },
          // 2. Propose
          {
            contractAddress: HUB_ADDRESS,
            entrypoint: "propose_outcome",
            calldata: CallData.compile({
              market_id: marketId,
              outcome: outcome ? 1 : 0, // 1=YES, 0=NO
            }),
          },
        ];

        const { transaction_hash } = await execute(calls);
        toast.success("Outcome Proposed!");
        return transaction_hash;
      } catch (e: any) {
        console.error(e);
        toast.error("Proposal failed: " + e.message);
      }
    },
    [address]
  );

  // 2. CHALLENGE OUTCOME (Anyone)
  const challengeOutcome = useCallback(
    async (marketId: string) => {
      if (!address) return toast.error("Connect wallet");
      try {
        toast.loading("Submitting challenge...");

        // Hardcoded 20 USDC Bond
        const bondAmount = uint256.bnToUint256(1_000_000n);

        const calls = [
          {
            contractAddress: USDC_ADDRESS,
            entrypoint: "approve",
            calldata: CallData.compile({
              spender: HUB_ADDRESS,
              amount: bondAmount,
            }),
          },
          {
            contractAddress: HUB_ADDRESS,
            entrypoint: "challenge_outcome",
            calldata: CallData.compile({ market_id: marketId }),
          },
        ];

        const { transaction_hash } = await execute(calls);
        toast.success("Challenge Submitted!");
        return transaction_hash;
      } catch (e: any) {
        console.error(e);
        toast.error("Challenge failed: " + e.message);
      }
    },
    [address]
  );

  // 3. FINALIZE MARKET (Anyone)
  const finalizeMarket = useCallback(
    async (marketId: string) => {
      if (!address) return toast.error("Connect wallet");
      try {
        toast.loading("Finalizing market...");

        const calls = [
          {
            contractAddress: HUB_ADDRESS,
            entrypoint: "finalize_market",
            calldata: CallData.compile({ market_id: marketId }),
          },
        ];

        const { transaction_hash } = await execute(calls);
        toast.success("Market Finalized!");
        return transaction_hash;
      } catch (e: any) {
        console.error(e);
        toast.error("Finalization failed: " + e.message);
      }
    },
    [address]
  );

  const claimWinnings = useCallback(
    async (marketId: string) => {
      if (!address) return toast.error("connect wallet");
      try {
        toast.loading("claiming winnings");

        const calls = [
          {
            contractAddress: HUB_ADDRESS,
            entrypoint: "claim_winnings",
            calldata: CallData.compile({ market_id: marketId }),
          },
        ];

        // const { transaction_hash } = await account.execute(calls);
        const { transaction_hash } = await execute(calls);
        toast.success("winnings claimed");
      } catch (e) {
        console.error(e);
        toast.error("Claim failed: " + e.message);
      }
    },
    [address]
  );

  return { proposeOutcome, challengeOutcome, finalizeMarket, claimWinnings };
};
