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
import { useAuth } from "../hooks/useAuth";
import { MediaPreview } from "./MediaPreview";
import { mapMarketToPrediction, ApiMarket } from "../lib/marketMapper";
import { Prediction } from "../types/prediction";
import { toast } from "sonner";
import { CallData, RpcProvider, uint256 } from "starknet";

const API_URL = import.meta.env.VITE_INDEXER_SERVER_URL;

interface UserPosition {
  prediction: Prediction;
  marketId: string;
  yesShares: number;
  noShares: number;
  invested: number;
  currentValue: number; // claimable now
  displayValue: number; // shown in UI
  profitLoss: number;
  status: number;
  outcome?: boolean;
  hasClaimed: boolean;
}

interface PortfolioBet {
  marketId: number | string;
  category: string | null;
  creator: string | null;
  question: string | null;
  media: string | null;
  timestamp: number | null;
  transactionHash: string | null;
  endTime: number | null;
  poolYes: number | null;
  poolNo: number | null;
  totalVolume: number | null;
  yesPrice: number | null;
  noPrice: number | null;
  marketYesShares: number | null;
  marketNoShares: number | null;
  status: number | null;
  outcome?: boolean | null;
  proposalTimestamp: number | null;

  positionId: number;
  user: string;
  positionYesShares: number;
  positionNoShares: number;
  totalInvested: number;
  hasClaimed: boolean;
}

interface PortfolioProps {
  onViewMarket: (id: string) => void;
}

const fmt = (n: number, decimals = 2) => n.toFixed(decimals);
const fmtUSD = (n: number) => `$${fmt(n)}`;

const STATUS_STYLES: Record<
  string,
  { color: string; bg: string; border: string }
> = {
  active: {
    color: "#1F87FC",
    bg: "rgba(31,135,252,0.08)",
    border: "rgba(31,135,252,0.25)",
  },
  won: {
    color: "#00ff88",
    bg: "rgba(0,255,136,0.08)",
    border: "rgba(0,255,136,0.25)",
  },
  claimed: {
    color: "#00ff88",
    bg: "rgba(0,255,136,0.05)",
    border: "rgba(0,255,136,0.15)",
  },
  lost: {
    color: "#ff3366",
    bg: "rgba(255,51,102,0.05)",
    border: "rgba(255,51,102,0.15)",
  },
};

export function Portfolio({ onViewMarket }: PortfolioProps) {
  const { address, execute, isConnected, connect } = useAuth();
  const [positions, setPositions] = useState<UserPosition[]>([]);
  const [loading, setLoading] = useState(false);
  const [claimingId, setClaimingId] = useState<string | null>(null);
  const [usdcBalance, setUsdcBalance] = useState("0.00");
  const [balanceLoading, setBalanceLoading] = useState(false);

  // useEffect(() => {
  //   if (!address) return;
  //   const fetchPortfolio = async () => {
  //     setLoading(true);
  //     try {
  //       const [marketsRes, posRes] = await Promise.all([
  //         fetch(`${API_URL}/markets`),
  //         fetch(`${API_URL}/positions/${address}`),
  //       ]);
  //       const marketsData: ApiMarket[] = await marketsRes.json();
  //       const myBets = await posRes.json();

  //       const activePositions: UserPosition[] = myBets
  //         .map((bet: any) => {
  //           const market = marketsData.find((m) => m.marketId === bet.marketId);
  //           if (!market) return null;
  //           const yesShares = Number(bet.yesShares);
  //           const noShares = Number(bet.noShares);
  //           const claimed = Boolean(bet.hasClaimed || bet.has_claimed || false);
  //           if (!claimed && yesShares <= 0 && noShares <= 0) return null;
  //           const realInvested = Number(
  //             bet.totalInvested || bet.total_invested || 0,
  //           );
  //           const costBasis =
  //             realInvested > 0 ? realInvested : (yesShares + noShares) * 0.5;
  //           let currentRealValue = 0;
  //           if (claimed || market.status === 3) {
  //             const isYesWinner = market.outcome === true;
  //             const winningShares = isYesWinner ? yesShares : noShares;
  //             const totalWinningReal = isYesWinner
  //               ? Number(market.yesShares || 0)
  //               : Number(market.noShares || 0);
  //             const totalRealVolume = Number(market.totalVolume || 0);
  //             if (totalWinningReal > 0 && winningShares > 0) {
  //               currentRealValue =
  //                 (winningShares / totalWinningReal) * totalRealVolume * 0.98;
  //             }
  //           } else {
  //             currentRealValue =
  //               yesShares * Number(market.yesPrice || 0) +
  //               noShares * Number(market.noPrice || 0);
  //           }
  //           return {
  //             prediction: mapMarketToPrediction(market),
  //             marketId: market.marketId.toString(),
  //             yesShares,
  //             noShares,
  //             invested: costBasis,
  //             currentValue: currentRealValue,
  //             profitLoss: currentRealValue - costBasis,
  //             status: market.status || 1,
  //             outcome: market.outcome,
  //             hasClaimed: claimed,
  //           };
  //         })
  //         .filter(Boolean);
  //       setPositions(activePositions);
  //     } catch (e) {
  //       console.error("Error fetching portfolio", e);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   fetchPortfolio();
  // }, [address]);

  useEffect(() => {
    if (!address) return;

    const fetchPortfolio = async () => {
      setLoading(true);
      try {
        const posRes = await fetch(`${API_URL}/positions/${address}`);
        if (!posRes.ok) throw new Error("Failed to fetch positions");

        const myBets = await posRes.json();
        console.log(myBets);

        const activePositions: UserPosition[] = myBets
          .map((bet: PortfolioBet) => {
            const yesShares = Number(bet.positionYesShares || 0);
            const noShares = Number(bet.positionNoShares || 0);
            const claimed = Boolean(bet.hasClaimed);

            if (!claimed && yesShares <= 0 && noShares <= 0) return null;

            const realInvested = Number(bet.totalInvested || 0);
            const costBasis =
              realInvested > 0 ? realInvested : (yesShares + noShares) * 0.5;

            const isResolved = bet.status === 3;
            const isYesWinner = bet.outcome === true;
            const winningShares = isYesWinner ? yesShares : noShares;

            const totalWinningShares = isYesWinner
              ? Number(bet.marketYesShares || 0)
              : Number(bet.marketNoShares || 0);

            const totalPot = Number(bet.totalVolume || 0);

            let payoutValue = 0;
            if (
              isResolved &&
              winningShares > 0 &&
              totalWinningShares > 0 &&
              totalPot > 0
            ) {
              payoutValue = (winningShares / totalWinningShares) * totalPot;
            }

            let currentRealValue = 0;
            let displayValue = 0;

            if (isResolved) {
              displayValue = payoutValue;
              currentRealValue = claimed ? 0 : payoutValue;
            } else {
              const markedValue =
                yesShares * Number(bet.yesPrice || 0) +
                noShares * Number(bet.noPrice || 0);

              currentRealValue = markedValue;
              displayValue = markedValue;
            }

            return {
              prediction: mapMarketToPrediction(bet),
              marketId: String(bet.marketId),
              yesShares,
              noShares,
              invested: costBasis,
              currentValue: currentRealValue,
              displayValue,
              profitLoss: displayValue - costBasis,
              status: bet.status || 1,
              outcome: bet.outcome ?? undefined,
              hasClaimed: claimed,
            };
          })
          .filter(Boolean) as UserPosition[];

        setPositions(activePositions);
      } catch (e) {
        console.error("Error fetching portfolio", e);
      } finally {
        setLoading(false);
      }
    };
    fetchPortfolio();
  }, [address]);
  useEffect(() => {
    if (!address || !isConnected) return;
    const fetchBalance = async () => {
      setBalanceLoading(true);
      try {
        const usdcAddress =
          import.meta.env.VITE_USDC_ADDRESS ||
          "0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8";
        const provider = new RpcProvider({
          nodeUrl:
            import.meta.env.VITE_NODE_URL ||
            "https://starknet-mainnet.g.alchemy.com/v2/EzO62qQ-wC9-OQyeOyL1y",
        });
        const res = await provider.callContract({
          contractAddress: usdcAddress,
          entrypoint: "balanceOf",
          calldata: CallData.compile([address]),
        });
        const balanceBN = uint256.uint256ToBN({ low: res[0], high: res[1] });
        setUsdcBalance((Number(balanceBN.toString()) / 1_000_000).toFixed(2));
      } catch {
        setUsdcBalance("0.00");
      } finally {
        setBalanceLoading(false);
      }
    };
    fetchBalance();
    const iv = setInterval(fetchBalance, 10000);
    return () => clearInterval(iv);
  }, [address, isConnected]);

  const handleClaim = async (marketId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isConnected) return;
    setClaimingId(marketId);
    try {
      await execute([
        {
          contractAddress: import.meta.env.VITE_HUB_ADDRESS,
          entrypoint: "claim_winnings",
          calldata: CallData.compile([marketId]),
        },
      ]);
      toast.success("Winnings claimed!");
      setPositions((prev) =>
        prev.map((p) =>
          p.marketId === marketId ? { ...p, hasClaimed: true } : p,
        ),
      );
    } catch (err: any) {
      toast.error("Claim failed", { description: err.message });
    } finally {
      setClaimingId(null);
    }
  };

  const getPositionStatus = (pos: UserPosition) => {
    if (pos.status === 1)
      return { type: "active", label: "Active", canClaim: false };
    const userWon =
      (pos.outcome === true && pos.yesShares > 0) ||
      (pos.outcome === false && pos.noShares > 0);
    if (userWon)
      return pos.hasClaimed
        ? { type: "claimed", label: "Claimed", canClaim: false }
        : { type: "won", label: "Won", canClaim: true };
    return { type: "lost", label: "Lost", canClaim: false };
  };

  const totalInvested = positions.reduce((s, p) => s + p.invested, 0);
  const totalValue = positions.reduce((s, p) => s + p.currentValue, 0);
  const totalPL = positions.reduce((s, p) => s + p.profitLoss, 0);
  const plPercent =
    totalInvested > 0 ? ((totalPL / totalInvested) * 100).toFixed(2) : "0.00";
  const activePositions = positions.filter((p) => p.status === 1);
  const resolvedPositions = positions.filter((p) => p.status === 3);
  const wonPositions = resolvedPositions.filter((p) => {
    const s = getPositionStatus(p);
    return s.type === "won" || s.type === "claimed";
  });

  // ── Not connected ──
  if (!address) {
    return (
      <div className="w-full max-w-lg mx-auto px-4 py-10">
        <div
          style={{
            background: "#12121f",
            border: "1px solid rgba(31,135,252,0.18)",
            borderRadius: 18,
            padding: "48px 24px",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: "50%",
              background: "rgba(31,135,252,0.08)",
              border: "1px solid rgba(31,135,252,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 16,
            }}
          >
            <Wallet style={{ width: 22, height: 22, color: "#1F87FC" }} />
          </div>
          <h2
            style={{
              fontSize: 18,
              fontWeight: 600,
              color: "#e2e8f0",
              margin: "0 0 8px",
            }}
          >
            Connect your wallet
          </h2>
          <p
            style={{
              fontSize: 13,
              color: "#4a5568",
              margin: "0 0 24px",
              maxWidth: 260,
              lineHeight: 1.6,
            }}
          >
            Track your predictions, view performance, and claim winnings.
          </p>
          <button
            onClick={() => connect("web3")}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 22px",
              background: "#1F87FC",
              color: "#fff",
              border: "none",
              borderRadius: 10,
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "inherit",
              boxShadow: "0 0 16px rgba(31,135,252,0.25)",
            }}
          >
            <Wallet style={{ width: 14, height: 14 }} /> Connect wallet
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="w-full max-w-4xl mx-auto px-4 py-6 pb-24 flex flex-col gap-4"
      style={{ fontFamily: "inherit" }}
    >
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      {/* ── Header ── */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: 10,
            background: "rgba(31,135,252,0.08)",
            border: "1px solid rgba(31,135,252,0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <PieChart style={{ width: 15, height: 15, color: "#1F87FC" }} />
        </div>
        <div>
          <h1
            style={{
              fontSize: 17,
              fontWeight: 600,
              color: "#e2e8f0",
              margin: 0,
              lineHeight: 1.2,
              display: "flex",
              alignItems: "center",
              gap: 7,
            }}
          >
            Portfolio
            {(loading || balanceLoading) && (
              <Loader2
                style={{
                  width: 13,
                  height: 13,
                  color: "#1F87FC",
                  animation: "spin 0.8s linear infinite",
                }}
              />
            )}
          </h1>
          <p
            style={{ fontSize: 11, color: "#4a5568", margin: 0, marginTop: 1 }}
          >
            Track your investments and performance
          </p>
        </div>
      </div>

      {/* ── Stats grid — 2 cols on mobile, 4 on md ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
        {[
          {
            icon: <CreditCard style={{ width: 12, height: 12 }} />,
            label: "Balance",
            value: `$${usdcBalance}`,
            sub: "USDC",
            color: "#1F87FC",
          },
          {
            icon: <DollarSign style={{ width: 12, height: 12 }} />,
            label: "Invested",
            value: fmtUSD(totalInvested),
            sub: `${positions.length} position${positions.length !== 1 ? "s" : ""}`,
            color: "#1F87FC",
          },
          {
            icon: <PieChart style={{ width: 12, height: 12 }} />,
            label: "Current value",
            value: fmtUSD(totalValue),
            sub: `${activePositions.length} active`,
            color: "#1F87FC",
          },
          {
            icon: <Trophy style={{ width: 12, height: 12 }} />,
            label: "Win rate",
            value: `${resolvedPositions.length > 0 ? ((wonPositions.length / resolvedPositions.length) * 100).toFixed(0) : 0}%`,
            sub: `${wonPositions.length}/${resolvedPositions.length} won`,
            color: "#00ff88",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            style={{
              background: "rgba(255,255,255,0.03)",
              border: `1px solid ${stat.color}18`,
              borderRadius: 12,
              padding: "12px 12px 10px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                color: stat.color,
                opacity: 0.7,
                marginBottom: 7,
              }}
            >
              {stat.icon}
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 500,
                  letterSpacing: "0.03em",
                }}
              >
                {stat.label}
              </span>
            </div>
            <div
              style={{
                fontSize: 18,
                fontWeight: 700,
                color: "#e2e8f0",
                fontVariantNumeric: "tabular-nums",
                letterSpacing: "-0.02em",
                marginBottom: 2,
              }}
            >
              {stat.value}
            </div>
            <div style={{ fontSize: 10, color: "#3a4a5e" }}>{stat.sub}</div>
          </div>
        ))}
      </div>

      {/* ── P&L banner ── */}
      {totalInvested > 0 && (
        <div
          style={{
            background:
              totalPL >= 0 ? "rgba(0,255,136,0.05)" : "rgba(255,51,102,0.05)",
            border: `1px solid ${totalPL >= 0 ? "rgba(0,255,136,0.2)" : "rgba(255,51,102,0.2)"}`,
            borderRadius: 14,
            padding: "14px 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 9,
                background:
                  totalPL >= 0 ? "rgba(0,255,136,0.1)" : "rgba(255,51,102,0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              {totalPL >= 0 ? (
                <ArrowUpRight
                  style={{ width: 16, height: 16, color: "#00ff88" }}
                />
              ) : (
                <ArrowDownRight
                  style={{ width: 16, height: 16, color: "#ff3366" }}
                />
              )}
            </div>
            <div>
              <div style={{ fontSize: 10, color: "#4a5568", marginBottom: 2 }}>
                Total profit / loss
              </div>
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: totalPL >= 0 ? "#00ff88" : "#ff3366",
                  fontVariantNumeric: "tabular-nums",
                  letterSpacing: "-0.02em",
                }}
              >
                {totalPL >= 0 ? "+" : ""}
                {fmtUSD(totalPL)}
              </div>
            </div>
          </div>
          <div style={{ textAlign: "right", flexShrink: 0 }}>
            <div style={{ fontSize: 10, color: "#4a5568", marginBottom: 2 }}>
              Return
            </div>
            <div
              style={{
                fontSize: 18,
                fontWeight: 700,
                color: totalPL >= 0 ? "#00ff88" : "#ff3366",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {totalPL >= 0 ? "+" : ""}
              {plPercent}%
            </div>
          </div>
        </div>
      )}

      {/* ── Positions ── */}
      <div>
        <div
          style={{
            fontSize: 11,
            fontWeight: 500,
            color: "#64748b",
            letterSpacing: "0.04em",
            marginBottom: 10,
            display: "flex",
            alignItems: "center",
            gap: 5,
          }}
        >
          <Clock style={{ width: 11, height: 11 }} />
          Your positions · {positions.length} total
        </div>

        {!loading && positions.length === 0 ? (
          <div
            style={{
              background: "#12121f",
              border: "1px solid rgba(31,135,252,0.1)",
              borderRadius: 14,
              padding: "48px 20px",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 8,
            }}
          >
            <PieChart style={{ width: 28, height: 28, color: "#3a4a5e" }} />
            <p style={{ fontSize: 13, color: "#64748b", margin: 0 }}>
              No active positions
            </p>
            <p style={{ fontSize: 11, color: "#3a4a5e", margin: 0 }}>
              Start trading predictions to build your portfolio
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {positions.map((position) => {
              const status = getPositionStatus(position);
              const ss = STATUS_STYLES[status.type] || STATUS_STYLES.active;
              const profitPercent =
                position.invested > 0
                  ? ((position.profitLoss / position.invested) * 100).toFixed(1)
                  : "0.0";

              return (
                <div
                  key={position.marketId}
                  style={{
                    background: "#12121f",
                    border: `1px solid ${ss.border}`,
                    borderRadius: 14,
                    padding: "14px 14px",
                    boxShadow:
                      status.type === "won" && !position.hasClaimed
                        ? "0 0 18px rgba(0,255,136,0.07)"
                        : "none",
                  }}
                >
                  {/* Top row: media + question + badge */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 10,
                      marginBottom: 12,
                    }}
                  >
                    <div
                      style={{
                        width: 60,
                        height: 46,
                        flexShrink: 0,
                        borderRadius: 7,
                        overflow: "hidden",
                        border: "1px solid rgba(255,255,255,0.05)",
                        background: "#0d0d18",
                      }}
                    >
                      <MediaPreview
                        src={position.prediction.media.url}
                        type={
                          position.prediction.media.type === "video"
                            ? "video"
                            : undefined
                        }
                        alt="market"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          display: "block",
                        }}
                      />
                    </div>
                    <div
                      style={{ flex: 1, minWidth: 0, cursor: "pointer" }}
                      onClick={() => onViewMarket(position.marketId)}
                    >
                      <p
                        style={{
                          fontSize: 12,
                          fontWeight: 500,
                          color: "#e2e8f0",
                          margin: "0 0 6px",
                          lineHeight: 1.4,
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {position.prediction.question}
                      </p>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 5,
                          flexWrap: "wrap",
                        }}
                      >
                        <span
                          style={{
                            fontSize: 10,
                            color: "#4a5568",
                            background: "rgba(255,255,255,0.04)",
                            borderRadius: 4,
                            padding: "2px 6px",
                          }}
                        >
                          {position.prediction.creator.name}
                        </span>
                        <span
                          style={{
                            fontSize: 9,
                            fontWeight: 700,
                            letterSpacing: "0.06em",
                            textTransform: "uppercase",
                            color: ss.color,
                            background: ss.bg,
                            border: `1px solid ${ss.border}`,
                            borderRadius: 4,
                            padding: "2px 6px",
                            display: "flex",
                            alignItems: "center",
                            gap: 3,
                          }}
                        >
                          {status.type === "active" && (
                            <span
                              style={{
                                width: 4,
                                height: 4,
                                borderRadius: "50%",
                                background: "#1F87FC",
                                display: "inline-block",
                              }}
                            />
                          )}
                          {status.type === "won" && (
                            <Trophy style={{ width: 8, height: 8 }} />
                          )}
                          {status.type === "claimed" && (
                            <CheckCircle style={{ width: 8, height: 8 }} />
                          )}
                          {status.label}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Shares — 2 cols if both, 1 col if only one */}
                  {(position.yesShares > 0 || position.noShares > 0) && (
                    <div
                      className={`grid gap-2 mb-3 ${position.yesShares > 0 && position.noShares > 0 ? "grid-cols-2" : "grid-cols-1"}`}
                    >
                      {position.yesShares > 0 && (
                        <div
                          style={{
                            background: "rgba(0,255,136,0.04)",
                            border: "1px solid rgba(0,255,136,0.18)",
                            borderRadius: 8,
                            padding: "8px 10px",
                          }}
                        >
                          <div
                            style={{
                              fontSize: 9,
                              color: "rgba(0,255,136,0.6)",
                              fontWeight: 700,
                              letterSpacing: "0.07em",
                              marginBottom: 3,
                            }}
                          >
                            YES
                          </div>
                          <div
                            style={{
                              fontSize: 14,
                              fontWeight: 700,
                              color: "#00ff88",
                              fontVariantNumeric: "tabular-nums",
                            }}
                          >
                            {position.yesShares.toFixed(4)}
                          </div>
                        </div>
                      )}
                      {position.noShares > 0 && (
                        <div
                          style={{
                            background: "rgba(255,51,102,0.04)",
                            border: "1px solid rgba(255,51,102,0.18)",
                            borderRadius: 8,
                            padding: "8px 10px",
                          }}
                        >
                          <div
                            style={{
                              fontSize: 9,
                              color: "rgba(255,51,102,0.6)",
                              fontWeight: 700,
                              letterSpacing: "0.07em",
                              marginBottom: 3,
                            }}
                          >
                            NO
                          </div>
                          <div
                            style={{
                              fontSize: 14,
                              fontWeight: 700,
                              color: "#ff3366",
                              fontVariantNumeric: "tabular-nums",
                            }}
                          >
                            {position.noShares.toFixed(4)}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Footer — stacks on mobile */}
                  <div
                    style={{
                      borderTop: "1px solid rgba(255,255,255,0.04)",
                      paddingTop: 10,
                    }}
                  >
                    {status.canClaim ? (
                      /* Claim layout: stats row + full-width button */
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 10,
                        }}
                      >
                        <div style={{ display: "flex", gap: 16 }}>
                          <StatCell
                            label="Invested"
                            value={fmtUSD(position.invested)}
                          />
                          <StatCell
                            label="Payout"
                            value={fmtUSD(position.displayValue)}
                            color="#00ff88"
                          />
                        </div>
                        <button
                          onClick={(e) => handleClaim(position.marketId, e)}
                          disabled={claimingId === position.marketId}
                          style={{
                            width: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 6,
                            padding: "10px 0",
                            background: "#00ff88",
                            color: "#000",
                            border: "none",
                            borderRadius: 9,
                            fontSize: 13,
                            fontWeight: 700,
                            fontFamily: "inherit",
                            cursor:
                              claimingId === position.marketId
                                ? "not-allowed"
                                : "pointer",
                            opacity: claimingId === position.marketId ? 0.6 : 1,
                            boxShadow: "0 0 14px rgba(0,255,136,0.3)",
                            transition: "opacity 0.15s",
                          }}
                          onMouseEnter={(e) => {
                            if (claimingId !== position.marketId)
                              e.currentTarget.style.opacity = "0.85";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.opacity =
                              claimingId === position.marketId ? "0.6" : "1";
                          }}
                        >
                          {claimingId === position.marketId ? (
                            <>
                              <Loader2
                                style={{
                                  width: 13,
                                  height: 13,
                                  animation: "spin 0.8s linear infinite",
                                }}
                              />{" "}
                              Claiming…
                            </>
                          ) : (
                            <>
                              <Trophy style={{ width: 13, height: 13 }} /> Claim{" "}
                              {fmtUSD(position.currentValue)}
                            </>
                          )}
                        </button>
                      </div>
                    ) : (
                      /* Normal layout: 3 stats in a row, wraps gracefully */
                      <div className="flex flex-wrap gap-x-4 gap-y-2">
                        <StatCell
                          label="Invested"
                          value={fmtUSD(position.invested)}
                        />
                        &nbsp;
                        <StatCell
                          label="Claimable"
                          value={fmtUSD(position.currentValue)}
                        />
                        &nbsp;
                        <StatCell
                          label="P&L"
                          value={
                            <span
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 2,
                                color:
                                  position.profitLoss >= 0
                                    ? "#00ff88"
                                    : "#ff3366",
                              }}
                            >
                              {position.profitLoss >= 0 ? (
                                <ArrowUpRight
                                  style={{ width: 11, height: 11 }}
                                />
                              ) : (
                                <ArrowDownRight
                                  style={{ width: 11, height: 11 }}
                                />
                              )}
                              {position.profitLoss >= 0 ? "+" : ""}
                              {fmtUSD(Math.abs(position.profitLoss))}
                              <span style={{ fontSize: 9, opacity: 0.65 }}>
                                ({profitPercent}%)
                              </span>
                            </span>
                          }
                        />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCell({
  label,
  value,
  color,
}: {
  label: string;
  value: React.ReactNode;
  color?: string;
}) {
  return (
    <div>
      <div
        style={{
          fontSize: 9,
          color: "#3a4a5e",
          marginBottom: 2,
          letterSpacing: "0.03em",
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 12,
          fontWeight: 600,
          color: color || "#e2e8f0",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {value}
      </div>
    </div>
  );
}
