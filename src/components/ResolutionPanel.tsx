import { useState } from "react";
import { useWallet } from "../context/WalletContext";
import { useResolution } from "../hooks/useResolution";
import { AlertTriangle, Gavel, CheckCircle, Clock } from "lucide-react";

interface ResolutionPanelProps {
  marketId: string;
  creatorAddress: string;
  status: number; // 1=Active, 2=Proposed, 3=Resolved, 4=Disputed
  outcome?: boolean;
  proposalTimestamp?: number;

  myShares?: {
    yes: number;
    no: number;
    hasClaimed?: boolean; // 🟢 ADDED: New optional flag
  };
}

export function ResolutionPanel({
  marketId,
  creatorAddress,
  status,
  outcome,
  proposalTimestamp,
  myShares = { yes: 0, no: 0, hasClaimed: false }, // 🟢 Default false
}: ResolutionPanelProps) {
  const { address } = useWallet();
  const { proposeOutcome, challengeOutcome, finalizeMarket, claimWinnings } =
    useResolution();

  const [selectedOutcome, setSelectedOutcome] = useState<boolean>(true);

  // --- 1. RESOLVED (Status 3) ---
  if (status === 3) {
    const winningShares = outcome ? myShares.yes : myShares.no;
    const isWinner = winningShares > 0;
    const hasParticipated = myShares.yes > 0 || myShares.no > 0;

    // 🟢 CHECK: Has the user already claimed?
    const alreadyClaimed = myShares.hasClaimed === true;

    return (
      <div className="bg-[#00ff88]/10 border border-[#00ff88]/40 p-6 rounded-xl text-center space-y-4">
        {/* Header */}
        <div>
          <CheckCircle className="w-12 h-12 text-[#00ff88] mx-auto mb-2" />
          <h3 className="text-xl font-bold text-[#00ff88]">Market Resolved</h3>
          <p className="text-gray-400">
            Winning Outcome:{" "}
            <span className="text-white font-bold text-lg">
              {outcome ? "YES" : "NO"}
            </span>
          </p>
        </div>

        {/* 🟢 INTELLIGENT CLAIM SECTION */}
        <div className="pt-4 border-t border-[#00ff88]/20">
          {/* CASE A: ALREADY CLAIMED */}
          {isWinner && alreadyClaimed && (
            <div className="bg-[#00ff88]/20 p-3 rounded-lg border border-[#00ff88]/50">
              <p className="text-[#00ff88] font-bold flex items-center justify-center gap-2">
                <CheckCircle className="w-4 h-4" /> Winnings Claimed
              </p>
            </div>
          )}

          {/* CASE B: WINNER (Needs to Claim) */}
          {isWinner && !alreadyClaimed && (
            <>
              <p className="text-sm text-[#00ff88] mb-3">
                🎉 Congratulations! You hold <b>{winningShares.toFixed(2)}</b>{" "}
                winning shares.
              </p>
              <button
                onClick={() => claimWinnings(marketId)}
                className="w-full bg-[#00ff88] text-black font-bold py-3 rounded-lg hover:bg-[#00ff88]/90 transition shadow-[0_0_20px_rgba(0,255,136,0.2)]"
              >
                💰 Claim Winnings
              </button>
            </>
          )}

          {/* CASE C: LOSER (Participated but lost) */}
          {!isWinner && hasParticipated && (
            <div className="bg-black/20 p-3 rounded-lg border border-red-500/20">
              <p className="text-gray-400 text-sm">
                🥀 You predicted on the wrong side. Better luck next time.
              </p>
            </div>
          )}

          {/* CASE D: SPECTATOR (Did not bet) */}
          {!hasParticipated && (
            <div className="bg-black/20 p-3 rounded-lg">
              <p className="text-gray-500 text-sm">
                You did not participate in this market.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // --- 2. DISPUTED (Status 4) ---
  if (status === 4) {
    return (
      <div className="bg-[#ff3366]/10 border border-[#ff3366]/40 p-6 rounded-xl text-center">
        <Gavel className="w-12 h-12 text-[#ff3366] mx-auto mb-2" />
        <h3 className="text-xl font-bold text-[#ff3366]">Dispute Active</h3>
        <p className="text-gray-400">Under review by Oracle Admin.</p>
      </div>
    );
  }

  // --- 3. PROPOSED (Status 2) ---
  if (status === 2) {
    const now = Math.floor(Date.now() / 1000);
    const disputeEnd = (proposalTimestamp || 0) + 1800; // 30min window (1800s)
    const isFinalizable = now > disputeEnd;

    return (
      <div className="bg-[#1a1a24] border border-[#1F87FC]/30 p-6 rounded-xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-white font-bold text-lg flex items-center gap-2">
            <Clock className="w-5 h-5" /> Review Period
          </h3>
          <span className="text-xs bg-[#1F87FC]/20 text-[#1F87FC] px-3 py-1 rounded-full uppercase tracking-wider">
            Proposed: {outcome ? "YES" : "NO"}
          </span>
        </div>

        {isFinalizable ? (
          <div className="text-center space-y-3">
            <p className="text-[#00ff88] text-sm">
              ✅ Review period ended. Market is ready to finalize.
            </p>
            <button
              onClick={() => finalizeMarket(marketId)}
              className="w-full bg-[#00ff88] text-black font-bold py-3 rounded-lg hover:bg-[#00ff88]/90 transition"
            >
              Finalize Market
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-start gap-2 text-gray-400 text-sm bg-black/20 p-3 rounded">
              <AlertTriangle className="w-4 h-4 text-yellow-500 mt-0.5 shrink-0" />
              <p>
                Disagree with the result? You can challenge it by staking a{" "}
                <span className="text-white">1 USDC</span> bond.
              </p>
            </div>
            <button
              onClick={() => challengeOutcome(marketId)}
              className="w-full border border-[#ff3366] text-[#ff3366] font-bold py-3 rounded-lg hover:bg-[#ff3366]/10 transition"
            >
              Challenge Outcome
            </button>
          </div>
        )}
      </div>
    );
  }

  // --- 4. ACTIVE BUT EXPIRED (Status 1 + Time ended) ---

  // Safety check for address undefined
  const safeAddress = address ? BigInt(address) : BigInt(0);
  const safeCreator = creatorAddress ? BigInt(creatorAddress) : BigInt(0);
  const isCreator = safeAddress === safeCreator && safeAddress !== BigInt(0);

  if (!isCreator) {
    return (
      <div className="bg-[#1a1a24] border border-gray-700 p-6 rounded-xl text-center opacity-80">
        <Clock className="w-10 h-10 text-gray-500 mx-auto mb-2" />
        <h3 className="text-gray-300">Market Ended</h3>
        <p className="text-gray-500 text-sm">
          Waiting for Creator to declare the result.
        </p>
      </div>
    );
  }

  // --- 5. CREATOR INTERFACE ---
  return (
    <div className="bg-[#1a1a24] border border-[#1F87FC]/30 p-6 rounded-xl">
      <h3 className="text-white font-bold text-lg mb-2">📢 Propose Outcome</h3>
      <p className="text-gray-400 text-sm mb-6">
        As the creator, please declare the winning outcome.
        <br />
        <span className="text-[#1F87FC] text-xs">* Requires 10 USDC Bond</span>
      </p>

      <div className="flex gap-4 mb-4">
        <button
          onClick={() => setSelectedOutcome(true)}
          className={`flex-1 py-4 rounded-lg font-bold border transition-all ${
            selectedOutcome
              ? "bg-[#00ff88]/20 border-[#00ff88] text-[#00ff88] shadow-[0_0_15px_rgba(0,255,136,0.3)]"
              : "border-gray-700 text-gray-500 hover:border-gray-500 bg-black/20"
          }`}
        >
          YES Won
        </button>
        <button
          onClick={() => setSelectedOutcome(false)}
          className={`flex-1 py-4 rounded-lg font-bold border transition-all ${
            !selectedOutcome
              ? "bg-[#ff3366]/20 border-[#ff3366] text-[#ff3366] shadow-[0_0_15px_rgba(255,51,102,0.3)]"
              : "border-gray-700 text-gray-500 hover:border-gray-500 bg-black/20"
          }`}
        >
          NO Won
        </button>
      </div>

      <button
        onClick={() => proposeOutcome(marketId, selectedOutcome)}
        className="w-full bg-[#1F87FC] text-white font-bold py-3 rounded-lg hover:bg-[#1F87FC]/90 transition shadow-lg shadow-blue-500/20"
      >
        Propose Result
      </button>
    </div>
  );
}
