import { useState, useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  PieChart,
  Loader2,
  Wallet,
  Trophy,
  CheckCircle,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  BarChart3,
} from "lucide-react";
import { useWallet } from "../context/WalletContext";
import { MediaPreview } from "./MediaPreview";
import { mapMarketToPrediction, ApiMarket } from "../lib/marketMapper";
import { Prediction } from "../types/prediction";
import { toast } from "sonner";
import { CallData, Contract, RpcProvider, uint256 } from "starknet";

const API_URL = import.meta.env.VITE_INDEXER_SERVER_URL;
const TOKEN_ADDRESS =
  import.meta.env.VITE_USDC_ADDRESS ||
  "0x033068f6539f8e6e6b131e6b2b814e6c34a5224bc66947c47dab9dfee93b35fb";

interface UserPosition {
  prediction: Prediction;
  marketId: string;
  yesShares: number;
  noShares: number;
  invested: number;
  currentValue: number;
  profitLoss: number;
  status: number;
  outcome?: boolean;
  hasClaimed: boolean;
}

interface PortfolioProps {
  onViewMarket: (id: string) => void;
}

const calculateValue = (
  shares: number,
  price: number,
  totalSideShares: number,
  totalPot: number,
  status: number,
  isWinningSide: boolean,
) => {
  if (shares <= 0) return 0;

  if (status === 3) {
    if (!isWinningSide) return 0;
    if (totalSideShares <= 0) return 0;

    const ownership = shares / totalSideShares;
    const grossPayout = ownership * totalPot;
    return grossPayout * 0.98;
  }

  return shares * price;
};

export function Portfolio({ onViewMarket }: PortfolioProps) {
  const { address, connectWallet, account } = useWallet();
  const [positions, setPositions] = useState<UserPosition[]>([]);
  const [loading, setLoading] = useState(false);
  const [claimingId, setClaimingId] = useState<string | null>(null);
  const [usdcBalance, setUsdcBalance] = useState<string>("0.00");
  const [balanceLoading, setBalanceLoading] = useState(false);

  useEffect(() => {
    if (!address) return;

    const fetchPortfolio = async () => {
      setLoading(true);
      try {
        const marketsRes = await fetch(`${API_URL}/markets`);
        const marketsData: ApiMarket[] = await marketsRes.json();
        const posRes = await fetch(`${API_URL}/positions/${address}`);
        const myBets = await posRes.json();

        const activePositions: UserPosition[] = myBets
          .map((bet: any) => {
            const market = marketsData.find((m) => m.marketId === bet.marketId);
            if (!market) return null;

            // 🟢 FIX: Correctly mapped to your indexer's DB schema
            const poolYes = Number(market.poolYes || 0);
            const poolNo = Number(market.poolNo || 0);
            const totalPot = poolYes + poolNo;

            const totalYesReal = Number(market.yesShares || 0);
            const totalNoReal = Number(market.noShares || 0);

            const formattedPrediction = mapMarketToPrediction(market);
            const yesShares = Number(bet.yesShares);
            const noShares = Number(bet.noShares);

            const claimed = Boolean(bet.hasClaimed || bet.has_claimed || false);
            if (!claimed && yesShares <= 0 && noShares <= 0) return null;

            const realInvested = Number(
              bet.totalInvested || bet.total_invested || 0,
            );
            const costBasis =
              realInvested > 0 ? realInvested : (yesShares + noShares) * 0.5;

            let currentRealValue = 0;

            if (claimed) {
              const isYesWinner = market.outcome === true;
              const winningShares = isYesWinner ? yesShares : noShares;
              const totalWinningReal = isYesWinner ? totalYesReal : totalNoReal;

              if (totalWinningReal > 0 && winningShares > 0) {
                const ownership = winningShares / totalWinningReal;
                const grossPayout = ownership * totalPot;
                currentRealValue = grossPayout * 0.98;
              } else {
                currentRealValue = costBasis + costBasis * 0.1;
              }
            } else {
              const yesIsWinner =
                market.status === 3 ? market.outcome === true : false;
              const valYes = calculateValue(
                yesShares,
                Number(market.yesPrice || 0),
                totalYesReal,
                totalPot,
                market.status || 1,
                yesIsWinner,
              );

              const noIsWinner =
                market.status === 3 ? market.outcome === false : false;
              const valNo = calculateValue(
                noShares,
                Number(market.noPrice || 0),
                totalNoReal,
                totalPot,
                market.status || 1,
                noIsWinner,
              );

              currentRealValue = valYes + valNo;
            }

            return {
              prediction: formattedPrediction,
              marketId: market.marketId.toString(),
              yesShares,
              noShares,
              invested: costBasis,
              currentValue: currentRealValue,
              profitLoss: currentRealValue - costBasis,
              status: market.status || 1,
              outcome: market.outcome,
              hasClaimed: claimed,
            };
          })
          .filter(Boolean);

        setPositions(activePositions);
      } catch (error) {
        console.error("Error fetching portfolio", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, [address]);

  useEffect(() => {
    if (!address || !account) return;

    // const fetchBalance = async () => {
    //   setBalanceLoading(true);
    //   try {
    //     const usdcAddress =
    //       import.meta.env.VITE_USDC_ADDRESS ||
    //       "0x033068f6539f8e6e6b131e6b2b814e6c34a5224bc66947c47dab9dfee93b35fb";
    //     console.log("usdc address", usdcAddress);
    //     console.log("account", account);

    //     const res = await account.callContract({
    //       contractAddress: usdcAddress,
    //       entrypoint: "balanceOf",
    //       calldata: CallData.compile([address]),
    //     });

    //     const balanceStats = {
    //       low: res[0],
    //       high: res[1],
    //     };

    //     const balanceBN = uint256.uint256ToBN(balanceStats);
    //     const balanceString = balanceBN.toString();
    //     const formatted = Number(balanceString) / 1_000_000;

    //     setUsdcBalance(formatted.toFixed(2));
    //   } catch (e) {
    //     console.error("Failed to fetch USDC balance", e);
    //     setUsdcBalance("0.00");
    //   } finally {
    //     setBalanceLoading(false);
    //   }
    // };

    const fetchBalance = async () => {
      // We only need the address to check the balance, we don't need the account object anymore
      if (!address) return;

      setBalanceLoading(true);
      try {
        const usdcAddress =
          import.meta.env.VITE_USDC_ADDRESS ||
          "0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8"; // Mainnet Bridged USDC

        // 🟢 1. Create a dedicated provider using your Alchemy URL
        const alchemyProvider = new RpcProvider({
          nodeUrl:
            import.meta.env.VITE_NODE_URL ||
            "https://starknet-mainnet.g.alchemy.com/v2/EzO62qQ-wC9-OQyeOyL1y",
        });

        // 🟢 2. Call the contract using YOUR provider, not the user's wallet
        const res = await alchemyProvider.callContract({
          contractAddress: usdcAddress,
          entrypoint: "balanceOf",
          calldata: CallData.compile([address]),
        });

        const balanceStats = {
          low: res[0],
          high: res[1],
        };

        const balanceBN = uint256.uint256ToBN(balanceStats);
        const balanceString = balanceBN.toString();
        const formatted = Number(balanceString) / 1_000_000;

        setUsdcBalance(formatted.toFixed(2));
      } catch (e) {
        console.error("Failed to fetch USDC balance", e);
        setUsdcBalance("0.00");
      } finally {
        setBalanceLoading(false);
      }
    };
    fetchBalance();
    const interval = setInterval(fetchBalance, 10000);
    return () => clearInterval(interval);
  }, [address, account]);

  const handleClaim = async (marketId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!account) return;

    setClaimingId(marketId);
    try {
      const tx = await account.execute({
        contractAddress:
          import.meta.env.VITE_HUB_ADDRESS ||
          "0x530a3d485be7ba47ce511cf0da87d805a4d3de3d0828556ec74659d4018952f",
        entrypoint: "claim_winnings",
        calldata: CallData.compile([marketId]),
      });

      toast.success("Winnings Claimed!", {
        description: "Transaction submitted. Your balance will update shortly.",
      });

      setPositions((prev) =>
        prev.map((p) =>
          p.marketId === marketId ? { ...p, hasClaimed: true } : p,
        ),
      );
    } catch (err: any) {
      console.error("Claim Error:", err);
      toast.error("Claim Failed", { description: err.message });
    } finally {
      setClaimingId(null);
    }
  };

  const getPositionStatus = (pos: UserPosition) => {
    if (pos.status === 1) return { type: "active", label: "Active" };
    const userWonYes = pos.outcome === true && pos.yesShares > 0;
    const userWonNo = pos.outcome === false && pos.noShares > 0;

    if (userWonYes || userWonNo) {
      if (pos.hasClaimed) {
        return { type: "claimed", label: "Claimed", canClaim: false };
      }
      return { type: "won", label: "Won", canClaim: true };
    }
    return { type: "lost", label: "Lost" };
  };

  const totalInvested = positions.reduce((sum, p) => sum + p.invested, 0);
  const totalValue = positions.reduce((sum, p) => sum + p.currentValue, 0);
  const totalProfitLoss = positions.reduce((sum, p) => sum + p.profitLoss, 0);
  const profitLossPercent =
    totalInvested > 0
      ? ((totalProfitLoss / totalInvested) * 100).toFixed(2)
      : "0.00";

  // Calculate additional stats
  const activePositions = positions.filter((p) => p.status === 1);
  const resolvedPositions = positions.filter((p) => p.status === 3);
  const wonPositions = resolvedPositions.filter((p) => {
    const status = getPositionStatus(p);
    return status.type === "won" || status.type === "claimed";
  });

  if (!address) {
    return (
      <div className="w-full max-w-2xl mx-auto px-4 py-20">
        <div className="relative bg-gradient-to-br from-[#0f0f1a] via-[#1a1a2e] to-[#0f0f1a] border border-[#1F87FC]/30 rounded-2xl p-12 flex flex-col items-center overflow-hidden">
          {/* Animated background effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#1F87FC]/5 via-transparent to-[#00ff88]/5 animate-pulse" />

          <div className="relative z-10 flex flex-col items-center">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-[#1F87FC]/20 blur-2xl rounded-full animate-pulse" />
              <Wallet className="relative w-16 h-16 text-[#1F87FC]" />
            </div>

            <h2 className="text-2xl font-bold text-white mb-3">
              Connect Your Wallet
            </h2>
            <p className="text-muted-foreground mb-8 text-center max-w-sm">
              Track your predictions, view performance metrics, and claim your
              winnings
            </p>

            <button
              onClick={() => connectWallet()}
              className="group relative bg-gradient-to-r from-[#1F87FC] to-[#1F87FC]/80 text-white px-8 py-3 rounded-xl font-bold transition-all hover:shadow-[0_0_30px_rgba(31,135,252,0.4)] hover:scale-105"
            >
              <span className="relative z-10">Connect Wallet</span>
              <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              Portfolio
              {(loading || balanceLoading) && (
                <Loader2 className="w-6 h-6 text-[#1F87FC] animate-spin" />
              )}
            </h1>
            <p className="text-muted-foreground mt-1">
              Track your prediction investments and performance
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid - Enhanced */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Balance Card */}
        <div className="group relative bg-gradient-to-br from-[#0f0f1a] to-[#1a1a2e] border border-[#1F87FC]/30 rounded-xl p-6 hover:border-[#1F87FC]/60 transition-all hover:shadow-[0_0_20px_rgba(31,135,252,0.1)]">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Wallet className="w-20 h-20 text-[#1F87FC]" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 bg-[#1F87FC]/10 rounded-lg">
                <CreditCard className="w-4 h-4 text-[#1F87FC]" />
              </div>
              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Available Balance
              </div>
            </div>
            <div className="text-3xl font-bold text-foreground mb-1">
              ${usdcBalance}
            </div>
            <div className="text-xs text-[#1F87FC]">USDC</div>
          </div>
        </div>

        {/* Total Invested */}
        <div className="group relative bg-gradient-to-br from-[#0f0f1a] to-[#1a1a2e] border border-[#1F87FC]/30 rounded-xl p-6 hover:border-[#1F87FC]/60 transition-all hover:shadow-[0_0_20px_rgba(31,135,252,0.1)]">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <DollarSign className="w-20 h-20 text-[#1F87FC]" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 bg-[#1F87FC]/10 rounded-lg">
                <DollarSign className="w-4 h-4 text-[#1F87FC]" />
              </div>
              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Total Invested
              </div>
            </div>
            <div className="text-3xl font-bold text-foreground mb-1">
              ${totalInvested.toFixed(2)}
            </div>
            <div className="text-xs text-muted-foreground">
              {positions.length} position{positions.length !== 1 ? "s" : ""}
            </div>
          </div>
        </div>

        {/* Current Value */}
        <div className="group relative bg-gradient-to-br from-[#0f0f1a] to-[#1a1a2e] border border-[#1F87FC]/30 rounded-xl p-6 hover:border-[#1F87FC]/60 transition-all hover:shadow-[0_0_20px_rgba(31,135,252,0.1)]">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <PieChart className="w-20 h-20 text-[#1F87FC]" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 bg-[#1F87FC]/10 rounded-lg">
                <PieChart className="w-4 h-4 text-[#1F87FC]" />
              </div>
              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Current Value
              </div>
            </div>
            <div className="text-3xl font-bold text-foreground mb-1">
              ${totalValue.toFixed(2)}
            </div>
            <div className="text-xs text-muted-foreground">
              {activePositions.length} active
            </div>
          </div>
        </div>

        {/* Win Rate */}
        <div className="group relative bg-gradient-to-br from-[#0f0f1a] to-[#1a1a2e] border border-[#1F87FC]/30 rounded-xl p-6 hover:border-[#1F87FC]/60 transition-all hover:shadow-[0_0_20px_rgba(31,135,252,0.1)]">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <BarChart3 className="w-20 h-20 text-[#00ff88]" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 bg-[#00ff88]/10 rounded-lg">
                <Trophy className="w-4 h-4 text-[#00ff88]" />
              </div>
              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Win Rate
              </div>
            </div>
            <div className="text-3xl font-bold text-foreground mb-1">
              {resolvedPositions.length > 0
                ? (
                    (wonPositions.length / resolvedPositions.length) *
                    100
                  ).toFixed(0)
                : "0"}
              %
            </div>
            <div className="text-xs text-muted-foreground">
              {wonPositions.length}/{resolvedPositions.length} won
            </div>
          </div>
        </div>
      </div>

      {/* P&L Summary - Enhanced */}
      {totalInvested > 0 && (
        <div
          className={`relative overflow-hidden rounded-2xl p-6 mb-8 border backdrop-blur-sm ${
            totalProfitLoss >= 0
              ? "bg-gradient-to-r from-[#00ff88]/10 via-[#00ff88]/5 to-transparent border-[#00ff88]/30"
              : "bg-gradient-to-r from-[#ff3366]/10 via-[#ff3366]/5 to-transparent border-[#ff3366]/30"
          }`}
        >
          <div className="absolute top-0 right-0 w-64 h-64 opacity-10">
            {totalProfitLoss >= 0 ? (
              <TrendingUp className="w-full h-full text-[#00ff88]" />
            ) : (
              <TrendingDown className="w-full h-full text-[#ff3366]" />
            )}
          </div>

          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div
                  className={`p-3 rounded-xl ${
                    totalProfitLoss >= 0 ? "bg-[#00ff88]/20" : "bg-[#ff3366]/20"
                  }`}
                >
                  {totalProfitLoss >= 0 ? (
                    <ArrowUpRight className="w-6 h-6 text-[#00ff88]" />
                  ) : (
                    <ArrowDownRight className="w-6 h-6 text-[#ff3366]" />
                  )}
                </div>
                <div>
                  <div className="text-sm text-muted-foreground font-medium mb-1">
                    Total Profit/Loss
                  </div>
                  <div
                    className={`text-4xl font-bold ${
                      totalProfitLoss >= 0 ? "text-[#00ff88]" : "text-[#ff3366]"
                    }`}
                  >
                    {totalProfitLoss >= 0 ? "+" : ""}$
                    {totalProfitLoss.toFixed(2)}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-sm text-muted-foreground mb-1">Return</div>
                <div
                  className={`text-3xl font-bold ${
                    totalProfitLoss >= 0 ? "text-[#00ff88]" : "text-[#ff3366]"
                  }`}
                >
                  {totalProfitLoss >= 0 ? "+" : ""}
                  {profitLossPercent}%
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Positions List - Enhanced */}
      <div className="mb-4">
        <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
          <Clock className="w-5 h-5 text-[#1F87FC]" />
          Your Positions
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          {positions.length} total position{positions.length !== 1 ? "s" : ""}
        </p>
      </div>

      {!loading && positions.length === 0 ? (
        <div className="relative bg-gradient-to-br from-[#0f0f1a] to-[#1a1a2e] border border-[#1F87FC]/20 rounded-2xl p-16 text-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#1F87FC]/5 to-transparent animate-pulse" />

          <div className="relative z-10">
            <div className="relative inline-block mb-6">
              <div className="absolute inset-0 bg-[#1F87FC]/10 blur-2xl rounded-full" />
              <PieChart className="relative w-16 h-16 mx-auto text-[#1F87FC]/50" />
            </div>

            <h4 className="text-xl font-bold text-foreground mb-2">
              No Active Positions
            </h4>
            <p className="text-muted-foreground max-w-sm mx-auto">
              Start trading predictions to build your portfolio and track your
              performance
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {positions.map((position) => {
            const status = getPositionStatus(position);
            const isWinning =
              status.type === "won" || status.type === "claimed";
            const profitPercent =
              position.invested > 0
                ? ((position.profitLoss / position.invested) * 100).toFixed(1)
                : "0.0";

            return (
              <div
                key={position.marketId}
                className={`group relative bg-gradient-to-br from-[#0f0f1a] to-[#1a1a2e] border rounded-2xl p-6 transition-all hover:scale-[1.01] ${
                  status.type === "won" && !position.hasClaimed
                    ? "border-[#00ff88]/50 shadow-[0_0_25px_rgba(0,255,136,0.15)] hover:shadow-[0_0_35px_rgba(0,255,136,0.25)]"
                    : status.type === "claimed"
                      ? "border-[#00ff88]/30 hover:border-[#00ff88]/50"
                      : status.type === "lost"
                        ? "border-[#ff3366]/30 hover:border-[#ff3366]/50"
                        : "border-[#1F87FC]/30 hover:border-[#1F87FC]/60"
                }`}
              >
                {/* Glow effect for winning positions */}
                {isWinning && !position.hasClaimed && (
                  <div className="absolute inset-0 bg-gradient-to-r from-[#00ff88]/5 via-transparent to-[#00ff88]/5 rounded-2xl animate-pulse" />
                )}

                <div className="relative z-10">
                  {/* Prediction Info */}
                  <div className="flex items-start gap-4 mb-5">
                    <div className="w-20 h-16 flex-shrink-0 rounded-xl overflow-hidden border border-border/50 group-hover:border-border transition-colors">
                      <MediaPreview
                        src={position.prediction.media.url}
                        type={
                          position.prediction.media.type === "video"
                            ? "video"
                            : undefined
                        }
                        alt="prediction"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div
                      className="flex-1 min-w-0 cursor-pointer"
                      onClick={() => onViewMarket(position.marketId)}
                    >
                      <p className="text-foreground font-medium mb-2 line-clamp-2 group-hover:text-[#1F87FC] transition-colors">
                        {position.prediction.question}
                      </p>

                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs text-muted-foreground bg-[#1F87FC]/10 px-2 py-1 rounded-md">
                          {position.prediction.creator.name}
                        </span>

                        {status.type === "active" && (
                          <span className="text-[10px] font-bold text-[#1F87FC] bg-[#1F87FC]/10 px-2 py-1 rounded-md border border-[#1F87FC]/30 flex items-center gap-1">
                            <div className="w-1.5 h-1.5 bg-[#1F87FC] rounded-full animate-pulse" />
                            ACTIVE
                          </span>
                        )}

                        {status.type === "won" && (
                          <span className="text-[10px] font-bold text-[#00ff88] bg-[#00ff88]/10 px-2 py-1 rounded-md border border-[#00ff88]/30 flex items-center gap-1 animate-pulse">
                            <Trophy className="w-3 h-3" />
                            WON
                          </span>
                        )}

                        {status.type === "claimed" && (
                          <span className="text-[10px] font-bold text-[#00ff88] bg-[#00ff88]/10 px-2 py-1 rounded-md border border-[#00ff88]/30 flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            CLAIMED
                          </span>
                        )}

                        {status.type === "lost" && (
                          <span className="text-[10px] font-bold text-[#ff3366] bg-[#ff3366]/10 px-2 py-1 rounded-md border border-[#ff3366]/30">
                            LOST
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Shares Grid */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    {position.yesShares > 0 && (
                      <div className="bg-[#00ff88]/5 border border-[#00ff88]/30 rounded-xl p-4 hover:bg-[#00ff88]/10 transition-colors">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-2 h-2 bg-[#00ff88] rounded-full" />
                          <div className="text-xs text-muted-foreground font-medium">
                            YES Shares
                          </div>
                        </div>
                        <div className="text-[#00ff88] font-mono font-bold text-lg">
                          {position.yesShares.toFixed(4)}
                        </div>
                      </div>
                    )}

                    {position.noShares > 0 && (
                      <div className="bg-[#ff3366]/5 border border-[#ff3366]/30 rounded-xl p-4 hover:bg-[#ff3366]/10 transition-colors">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-2 h-2 bg-[#ff3366] rounded-full" />
                          <div className="text-xs text-muted-foreground font-medium">
                            NO Shares
                          </div>
                        </div>
                        <div className="text-[#ff3366] font-mono font-bold text-lg">
                          {position.noShares.toFixed(4)}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Performance Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-border/50">
                    <div className="flex items-center gap-6">
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">
                          Invested
                        </div>
                        <div className="text-foreground font-bold">
                          ${position.invested.toFixed(2)}
                        </div>
                      </div>

                      {!status.canClaim && (
                        <>
                          <div>
                            <div className="text-xs text-muted-foreground mb-1">
                              Current Value
                            </div>
                            <div className="text-foreground font-bold">
                              ${position.currentValue.toFixed(2)}
                            </div>
                          </div>

                          <div>
                            <div className="text-xs text-muted-foreground mb-1">
                              P&L
                            </div>
                            <div
                              className={`font-bold flex items-center gap-1 ${
                                position.profitLoss >= 0
                                  ? "text-[#00ff88]"
                                  : "text-[#ff3366]"
                              }`}
                            >
                              {position.profitLoss >= 0 ? (
                                <ArrowUpRight className="w-3 h-3" />
                              ) : (
                                <ArrowDownRight className="w-3 h-3" />
                              )}
                              {position.profitLoss >= 0 ? "+" : ""}$
                              {Math.abs(position.profitLoss).toFixed(2)}
                              <span className="text-xs">
                                ({position.profitLoss >= 0 ? "+" : ""}
                                {profitPercent}%)
                              </span>
                            </div>
                          </div>
                        </>
                      )}
                    </div>

                    {status.canClaim && (
                      <button
                        onClick={(e) => handleClaim(position.marketId, e)}
                        disabled={claimingId === position.marketId}
                        className="relative group/btn bg-gradient-to-r from-[#00ff88] to-[#00ff88]/80 text-black px-6 py-3 rounded-xl text-sm font-bold hover:shadow-[0_0_25px_rgba(0,255,136,0.5)] transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-white/20 opacity-0 group-hover/btn:opacity-100 transition-opacity" />

                        <span className="relative z-10 flex items-center gap-2">
                          {claimingId === position.marketId ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Claiming...
                            </>
                          ) : (
                            <>
                              <Trophy className="w-4 h-4" />
                              CLAIM ${position.currentValue.toFixed(2)}
                            </>
                          )}
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
