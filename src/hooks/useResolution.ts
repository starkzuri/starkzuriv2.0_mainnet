import { useCallback } from "react";
import { CallData, uint256 } from "starknet";
import { toast } from "sonner";
import { useWallet } from "../context/WalletContext";

const HUB_ADDRESS = import.meta.env.VITE_HUB_ADDRESS;
const USDC_ADDRESS = import.meta.env.VITE_USDC_ADDRESS;

export const useResolution = () => {
  const { account } = useWallet();

  // 1. PROPOSE OUTCOME (Creator Only)
  const proposeOutcome = useCallback(
    async (marketId: string, outcome: boolean) => {
      if (!account) return toast.error("Connect wallet");
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

        const { transaction_hash } = await account.execute(calls);
        toast.success("Outcome Proposed!");
        return transaction_hash;
      } catch (e: any) {
        console.error(e);
        toast.error("Proposal failed: " + e.message);
      }
    },
    [account]
  );

  // 2. CHALLENGE OUTCOME (Anyone)
  const challengeOutcome = useCallback(
    async (marketId: string) => {
      if (!account) return toast.error("Connect wallet");
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

        const { transaction_hash } = await account.execute(calls);
        toast.success("Challenge Submitted!");
        return transaction_hash;
      } catch (e: any) {
        console.error(e);
        toast.error("Challenge failed: " + e.message);
      }
    },
    [account]
  );

  // 3. FINALIZE MARKET (Anyone)
  const finalizeMarket = useCallback(
    async (marketId: string) => {
      if (!account) return toast.error("Connect wallet");
      try {
        toast.loading("Finalizing market...");

        const calls = [
          {
            contractAddress: HUB_ADDRESS,
            entrypoint: "finalize_market",
            calldata: CallData.compile({ market_id: marketId }),
          },
        ];

        const { transaction_hash } = await account.execute(calls);
        toast.success("Market Finalized!");
        return transaction_hash;
      } catch (e: any) {
        console.error(e);
        toast.error("Finalization failed: " + e.message);
      }
    },
    [account]
  );

  const claimWinnings = useCallback(
    async (marketId: string) => {
      if (!account) return toast.error("connect wallet");
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
        const { transaction_hash } = await account.execute(calls);
        toast.success("winnings claimed");
      } catch (e) {
        console.error(e);
        toast.error("Claim failed: " + e.message);
      }
    },
    [account]
  );

  return { proposeOutcome, challengeOutcome, finalizeMarket, claimWinnings };
};
