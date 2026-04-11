import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Heart,
  MessageCircle,
  Repeat2,
  Clock,
  TrendingUp,
  TrendingDown,
  Share2,
  BarChart2,
  Users,
} from "lucide-react";
import { PriceChart } from "./subcomponents/PriceChart";
import { Prediction, Comment } from "../types/prediction";
import { mockComments } from "../data/mockData";
import { useTrade } from "../hooks/useTrade";
import { useAuth } from "../hooks/useAuth";
import { ResolutionPanel } from "./ResolutionPanel";
import { MediaPreview } from "./MediaPreview";
import CommentsSection from "./CommentSection";
import { SellSharesPanel } from "./subcomponents/SellSharesPanel";
import { toast } from "sonner";

interface MarketDetailProps {
  marketId: string;
  onBack: () => void;
}

interface ApiMarket {
  marketId: number;
  creator: string;
  category: string;
  question: string;
  media: string | null;
  timestamp: number;
  transactionHash: string;
  yesPrice: number;
  noPrice: number;
  totalVolume: number;
  yesShares: number;
  noShares: number;
  endTime: number;
  status?: number;
  outcome?: boolean;
  proposalTimestamp?: number;
}

function aggregateChartData(rawData: any[], bucketCount = 60) {
  if (!rawData || rawData.length === 0) return [];
  if (rawData.length <= bucketCount) return rawData;
  const minTime = rawData[0].timestamp;
  const maxTime = rawData[rawData.length - 1].timestamp;
  const bucketSize = (maxTime - minTime) / bucketCount;
  const buckets: Record<number, { yesPrice: number[]; noPrice: number[] }> = {};
  for (const point of rawData) {
    const idx = Math.floor((point.timestamp - minTime) / bucketSize);
    if (!buckets[idx]) buckets[idx] = { yesPrice: [], noPrice: [] };
    buckets[idx].yesPrice.push(point.yesPrice);
    buckets[idx].noPrice.push(point.noPrice);
  }
  return Object.entries(buckets).map(([index, data]) => ({
    timestamp: minTime + Number(index) * bucketSize,
    yesPrice: data.yesPrice.reduce((a, b) => a + b, 0) / data.yesPrice.length,
    noPrice: data.noPrice.reduce((a, b) => a + b, 0) / data.noPrice.length,
  }));
}

const formatAddress = (addr: string) => {
  if (!addr) return "";
  let hex = addr.toLowerCase();
  if (!hex.startsWith("0x")) hex = "0x" + hex;
  while (hex.length < 66) hex = "0x0" + hex.substring(2);
  return hex;
};

const calculatePayout = (investedAmount: string, price: number) => {
  if (
    !investedAmount ||
    isNaN(+investedAmount) ||
    parseFloat(investedAmount) <= 0
  )
    return null;
  const val = parseFloat(investedAmount);
  const shares = val / price;
  const totalPayout = shares * 1;
  const netProfit = totalPayout - val;
  const roi = (netProfit / val) * 100;
  return {
    payout: totalPayout.toFixed(2),
    profit: netProfit.toFixed(2),
    roi: roi.toFixed(0),
  };
};

const API_URL = "https://starknet-indexer-apibara-mainnet-19ew.onrender.com";

export function MarketDetail({ marketId, onBack }: MarketDetailProps) {
  const { address } = useAuth();
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [loading, setLoading] = useState(true);
  const [apiData, setApiData] = useState<ApiMarket | null>(null);
  const [amount, setAmount] = useState<string>("");
  const { buyShares } = useTrade();
  const [chartData, setChartData] = useState<any[]>([]);
  const [myShares, setMyShares] = useState({
    yes: 0,
    no: 0,
    hasClaimed: false,
  });
  const [activeChart, setActiveChart] = useState<"yes" | "no" | "both">("both");
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const res = await fetch(`${API_URL}/markets/${marketId}`);
        if (!res.ok) {
          setLoading(false);
          return;
        }
        const rawMarket: ApiMarket = await res.json();

        if (rawMarket) {
          setApiData(rawMarket);
          const mediaStr = rawMarket.media || "";
          const isVideo =
            mediaStr.endsWith(".mp4") || mediaStr.endsWith(".webm");
          const mediaUrl = mediaStr.includes("ipfs")
            ? mediaStr.replace("ipfs://", "https://gateway.pinata.cloud/ipfs/")
            : "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=1000&q=80";

          const formatted: Prediction = {
            id: rawMarket.marketId.toString(),
            type: "binary",
            creator: {
              name: `User ${rawMarket.creator.slice(0, 4)}`,
              username: `@${rawMarket.creator.slice(0, 6)}...`,
              avatar: `https://api.dicebear.com/7.x/identicon/svg?seed=${rawMarket.creator}`,
            },
            question: rawMarket.question,
            category: rawMarket.category || "General",
            media: {
              type: isVideo ? "video" : "image",
              url: mediaUrl,
              thumbnail: isVideo
                ? "https://placehold.co/600x400/000000/FFF?text=Video"
                : undefined,
            },
            yesPrice: rawMarket.yesPrice ?? 0.5,
            noPrice: rawMarket.noPrice ?? 0.5,
            totalVolume: rawMarket.totalVolume ?? 0,
            yesShares: rawMarket.yesShares ?? 0,
            noShares: rawMarket.noShares ?? 0,
            createdAt: new Date(rawMarket.timestamp * 1000).toISOString(),
            endsAt: new Date(rawMarket.endTime * 1000).toISOString(),
            likes: 0,
            comments: 0,
            reposts: 0,
            isLiked: false,
          };
          setPrediction(formatted);
          setComments(mockComments["1"] || []);
        }

        const historyRes = await fetch(
          `${API_URL}/markets/${marketId}/history`,
        );
        if (historyRes.ok) {
          const historyData = await historyRes.json();
          const formattedHistory = historyData
            .map((item: any) => ({
              ...item,
              timestamp: item.timestamp * 1000,
              yesPrice: Number(item.yesPrice),
              noPrice: Number(item.noPrice),
            }))
            .sort((a: any, b: any) => a.timestamp - b.timestamp)
            .filter(
              (item: any, index: number, arr: any[]) =>
                index === 0 || item.timestamp !== arr[index - 1].timestamp,
            );
          setChartData(formattedHistory);
        }

        if (address) {
          try {
            const dbAddress = formatAddress(address);
            const positionRes = await fetch(
              `${API_URL}/markets/${marketId}/position/${dbAddress}`,
            );
            if (positionRes.ok) {
              const data = await positionRes.json();
              setMyShares({
                yes: Number(data.yesShares || data.yes_shares || 0),
                no: Number(data.noShares || data.no_shares || 0),
                hasClaimed: Boolean(
                  data.hasClaimed || data.has_claimed || false,
                ),
              });
            } else {
              setMyShares({ yes: 0, no: 0, hasClaimed: false });
            }
          } catch (e) {
            console.error("Failed to load position:", e);
          }
        }
      } catch (e) {
        console.error("Error fetching detail:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchMarketData();
    const interval = setInterval(fetchMarketData, 5000);
    return () => clearInterval(interval);
  }, [marketId, address]);

  const handleTrade = async (isYes: boolean) => {
    if (!amount || parseFloat(amount) <= 0)
      return alert("Enter a valid amount");
    await buyShares(marketId, isYes, parseFloat(amount));
  };

  const formatNumber = (num: number | string) => {
    const n = typeof num === "string" ? parseFloat(num) : num;
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
    return n.toString();
  };

  const getTimeRemaining = () => {
    if (!prediction) return "";
    const diff = new Date(prediction.endsAt).getTime() - Date.now();
    if (diff <= 0) return "Ended";
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    if (days > 0) return `${days}d ${hours}h left`;
    return `${hours}h left`;
  };

  // ── Loading ──
  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "80px 24px",
          gap: 10,
        }}
      >
        <div
          style={{
            width: 20,
            height: 20,
            borderRadius: "50%",
            border: "2px solid rgba(31,135,252,0.2)",
            borderTopColor: "#1F87FC",
            animation: "spin 0.8s linear infinite",
          }}
        />
        <span style={{ fontSize: 13, color: "#4a5568" }}>Loading market…</span>
        <style>{`@keyframes spin { to { transform: rotate(360deg); }}`}</style>
      </div>
    );
  }

  if (!prediction) {
    return (
      <div
        style={{
          padding: "80px 24px",
          textAlign: "center",
          fontSize: 13,
          color: "#ff3366",
        }}
      >
        Market not found
      </div>
    );
  }

  const isMarketActive =
    new Date(prediction.endsAt) > new Date() &&
    (apiData?.status === 1 || !apiData?.status);

  const yesData = calculatePayout(amount, prediction.yesPrice);
  const noData = calculatePayout(amount, prediction.noPrice);
  const yesPercent = Math.round(prediction.yesPrice * 100);
  const noPercent = Math.round(prediction.noPrice * 100);
  const totalShares =
    Number(prediction.yesShares) + Number(prediction.noShares);

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 800,
        margin: "0 auto",
        padding: "24px 20px 80px",
        display: "flex",
        flexDirection: "column",
        gap: 16,
        fontFamily: "inherit",
      }}
    >
      {/* ── Back button ── */}
      <button
        onClick={onBack}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          fontSize: 13,
          color: "#1F87FC",
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: 0,
          fontFamily: "inherit",
          width: "fit-content",
        }}
      >
        <ArrowLeft style={{ width: 14, height: 14 }} />
        Back to feed
      </button>

      {/* ── Main card ── */}
      <div
        style={{
          background: "#12121f",
          border: "1px solid rgba(31,135,252,0.2)",
          borderRadius: 18,
          overflow: "hidden",
        }}
      >
        {/* Creator header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "14px 16px",
            borderBottom: "1px solid rgba(255,255,255,0.04)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <img
              src={prediction.creator.avatar}
              alt={prediction.creator.name}
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                border: "1.5px solid rgba(31,135,252,0.3)",
                objectFit: "cover",
              }}
            />
            <div>
              <div style={{ fontSize: 13, fontWeight: 500, color: "#e2e8f0" }}>
                {prediction.creator.name}
              </div>
              <div style={{ fontSize: 11, color: "#4a5568", marginTop: 1 }}>
                {prediction.creator.username}
              </div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span
              style={{
                fontSize: 10,
                fontWeight: 500,
                color: "#1F87FC",
                background: "rgba(31,135,252,0.1)",
                border: "1px solid rgba(31,135,252,0.22)",
                borderRadius: 5,
                padding: "2px 8px",
              }}
            >
              {prediction.category}
            </span>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                fontSize: 11,
                color: isMarketActive ? "#00ff88" : "#4a5568",
              }}
            >
              {isMarketActive && (
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "#00ff88",
                    boxShadow: "0 0 5px rgba(0,255,136,0.6)",
                    display: "inline-block",
                  }}
                />
              )}
              <Clock style={{ width: 11, height: 11 }} />
              <span>{getTimeRemaining()}</span>
            </div>
          </div>
        </div>

        {/* Media */}
        <div
          style={{
            position: "relative",
            width: "100%",
            maxHeight: 340,
            overflow: "hidden",
            background: "#0d0d18",
          }}
        >
          <MediaPreview
            src={prediction.media.url}
            type={prediction.media.type === "video" ? "video" : undefined}
            alt={prediction.question}
            style={{
              width: "100%",
              maxHeight: 340,
              objectFit: "cover",
              display: "block",
              borderRadius: 0,
              opacity: 0.85,
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to bottom, transparent 50%, #12121f 100%)",
              pointerEvents: "none",
            }}
          />
        </div>

        <div style={{ padding: "20px 20px 0" }}>
          {/* Question */}
          <h2
            style={{
              fontSize: 20,
              fontWeight: 600,
              color: "#e2e8f0",
              lineHeight: 1.4,
              margin: "0 0 20px",
              letterSpacing: "-0.02em",
            }}
          >
            {prediction.question}
          </h2>

          {/* ── Stats strip ── */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 8,
              marginBottom: 20,
            }}
          >
            {[
              {
                label: "Volume",
                value: `$${formatNumber(prediction.totalVolume.toFixed(4))}`,
                color: "#1F87FC",
                icon: <BarChart2 style={{ width: 12, height: 12 }} />,
              },
              {
                label: "Total shares",
                value: formatNumber(totalShares.toFixed(4)),
                color: "#94a3b8",
                icon: <Users style={{ width: 12, height: 12 }} />,
              },
              {
                label: "YES shares",
                value: formatNumber(prediction.yesShares.toFixed(4)),
                color: "#00ff88",
                icon: <TrendingUp style={{ width: 12, height: 12 }} />,
              },
              {
                label: "NO shares",
                value: formatNumber(prediction.noShares.toFixed(4)),
                color: "#ff3366",
                icon: <TrendingDown style={{ width: 12, height: 12 }} />,
              },
            ].map((stat) => (
              <div
                key={stat.label}
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: `1px solid ${stat.color}18`,
                  borderRadius: 10,
                  padding: "10px 12px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    color: stat.color,
                    marginBottom: 6,
                    opacity: 0.7,
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
                    fontSize: 16,
                    fontWeight: 700,
                    color: stat.color,
                    fontVariantNumeric: "tabular-nums",
                    letterSpacing: "-0.02em",
                  }}
                >
                  {stat.value}
                </div>
              </div>
            ))}
          </div>

          {/* Sentiment bar */}
          <div style={{ marginBottom: 24 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 11,
                color: "#4a5568",
                marginBottom: 6,
              }}
            >
              <span style={{ color: "#00ff88" }}>YES {yesPercent}%</span>
              <span style={{ color: "#ff3366" }}>NO {noPercent}%</span>
            </div>
            <div
              style={{
                height: 6,
                background: "rgba(255,51,102,0.2)",
                borderRadius: 99,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${yesPercent}%`,
                  background: "linear-gradient(90deg, #00ff88, #1F87FC)",
                  borderRadius: 99,
                  transition: "width 0.6s ease",
                }}
              />
            </div>
          </div>

          {/* ── Trading / Resolution ── */}
          {isMarketActive ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 12,
                marginBottom: 24,
              }}
            >
              {/* YES / NO trade panels */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 10,
                }}
              >
                {/* YES panel */}
                <div
                  style={{
                    background: "rgba(0,255,136,0.04)",
                    border: "1px solid rgba(0,255,136,0.2)",
                    borderRadius: 12,
                    padding: 14,
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 6 }}
                    >
                      <TrendingUp
                        style={{ width: 14, height: 14, color: "#00ff88" }}
                      />
                      <span
                        style={{
                          fontSize: 13,
                          fontWeight: 700,
                          color: "#00ff88",
                        }}
                      >
                        YES
                      </span>
                    </div>
                    <span
                      style={{
                        fontSize: 11,
                        color: "rgba(0,255,136,0.7)",
                        background: "rgba(0,255,136,0.08)",
                        border: "1px solid rgba(0,255,136,0.18)",
                        borderRadius: 6,
                        padding: "2px 8px",
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      ${prediction.yesPrice.toFixed(4)}
                    </span>
                  </div>

                  <div style={{ position: "relative" }}>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="Amount (USDC)"
                      style={{
                        width: "100%",
                        boxSizing: "border-box",
                        background: "rgba(0,0,0,0.3)",
                        border: "1px solid rgba(0,255,136,0.2)",
                        borderRadius: 8,
                        padding: "9px 52px 9px 10px",
                        fontSize: 13,
                        color: "#e2e8f0",
                        outline: "none",
                        fontFamily: "inherit",
                        transition: "border-color 0.15s",
                      }}
                      onFocus={(e) =>
                        (e.currentTarget.style.borderColor = "#00ff88")
                      }
                      onBlur={(e) =>
                        (e.currentTarget.style.borderColor =
                          "rgba(0,255,136,0.2)")
                      }
                    />
                    <span
                      style={{
                        position: "absolute",
                        right: 10,
                        top: "50%",
                        transform: "translateY(-50%)",
                        fontSize: 10,
                        color: "#4a5568",
                        pointerEvents: "none",
                      }}
                    >
                      USDC
                    </span>
                  </div>

                  <div style={{ minHeight: 40 }}>
                    {yesData ? (
                      <div
                        style={{
                          background: "rgba(0,255,136,0.06)",
                          border: "1px solid rgba(0,255,136,0.15)",
                          borderRadius: 8,
                          padding: "8px 10px",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <span style={{ fontSize: 11, color: "#4a5568" }}>
                          Payout
                        </span>
                        <div style={{ textAlign: "right" }}>
                          <div
                            style={{
                              fontSize: 13,
                              fontWeight: 600,
                              color: "#e2e8f0",
                              fontVariantNumeric: "tabular-nums",
                            }}
                          >
                            ${yesData.payout}
                          </div>
                          <div style={{ fontSize: 10, color: "#00ff88" }}>
                            +{yesData.profit} ({yesData.roi}%)
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div
                        style={{
                          fontSize: 11,
                          color: "#3a4a5e",
                          textAlign: "center",
                          paddingTop: 10,
                        }}
                      >
                        Enter amount to see returns
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => handleTrade(true)}
                    style={{
                      background: "#00ff88",
                      color: "#000",
                      border: "none",
                      borderRadius: 8,
                      padding: "10px 0",
                      fontSize: 13,
                      fontWeight: 700,
                      cursor: "pointer",
                      fontFamily: "inherit",
                      transition: "opacity 0.15s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.opacity = "0.85")
                    }
                    onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                  >
                    Buy YES
                  </button>
                </div>

                {/* NO panel */}
                <div
                  style={{
                    background: "rgba(255,51,102,0.04)",
                    border: "1px solid rgba(255,51,102,0.2)",
                    borderRadius: 12,
                    padding: 14,
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 6 }}
                    >
                      <TrendingDown
                        style={{ width: 14, height: 14, color: "#ff3366" }}
                      />
                      <span
                        style={{
                          fontSize: 13,
                          fontWeight: 700,
                          color: "#ff3366",
                        }}
                      >
                        NO
                      </span>
                    </div>
                    <span
                      style={{
                        fontSize: 11,
                        color: "rgba(255,51,102,0.7)",
                        background: "rgba(255,51,102,0.08)",
                        border: "1px solid rgba(255,51,102,0.18)",
                        borderRadius: 6,
                        padding: "2px 8px",
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      ${prediction.noPrice.toFixed(4)}
                    </span>
                  </div>

                  <div style={{ position: "relative" }}>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="Amount (USDC)"
                      style={{
                        width: "100%",
                        boxSizing: "border-box",
                        background: "rgba(0,0,0,0.3)",
                        border: "1px solid rgba(255,51,102,0.2)",
                        borderRadius: 8,
                        padding: "9px 52px 9px 10px",
                        fontSize: 13,
                        color: "#e2e8f0",
                        outline: "none",
                        fontFamily: "inherit",
                        transition: "border-color 0.15s",
                      }}
                      onFocus={(e) =>
                        (e.currentTarget.style.borderColor = "#ff3366")
                      }
                      onBlur={(e) =>
                        (e.currentTarget.style.borderColor =
                          "rgba(255,51,102,0.2)")
                      }
                    />
                    <span
                      style={{
                        position: "absolute",
                        right: 10,
                        top: "50%",
                        transform: "translateY(-50%)",
                        fontSize: 10,
                        color: "#4a5568",
                        pointerEvents: "none",
                      }}
                    >
                      USDC
                    </span>
                  </div>

                  <div style={{ minHeight: 40 }}>
                    {noData ? (
                      <div
                        style={{
                          background: "rgba(255,51,102,0.06)",
                          border: "1px solid rgba(255,51,102,0.15)",
                          borderRadius: 8,
                          padding: "8px 10px",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <span style={{ fontSize: 11, color: "#4a5568" }}>
                          Payout
                        </span>
                        <div style={{ textAlign: "right" }}>
                          <div
                            style={{
                              fontSize: 13,
                              fontWeight: 600,
                              color: "#e2e8f0",
                              fontVariantNumeric: "tabular-nums",
                            }}
                          >
                            ${noData.payout}
                          </div>
                          <div style={{ fontSize: 10, color: "#ff3366" }}>
                            +{noData.profit} ({noData.roi}%)
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div
                        style={{
                          fontSize: 11,
                          color: "#3a4a5e",
                          textAlign: "center",
                          paddingTop: 10,
                        }}
                      >
                        Enter amount to see returns
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => handleTrade(false)}
                    style={{
                      background: "#ff3366",
                      color: "#fff",
                      border: "none",
                      borderRadius: 8,
                      padding: "10px 0",
                      fontSize: 13,
                      fontWeight: 700,
                      cursor: "pointer",
                      fontFamily: "inherit",
                      transition: "opacity 0.15s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.opacity = "0.85")
                    }
                    onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                  >
                    Buy NO
                  </button>
                </div>
              </div>

              {/* Sell panel */}
              <SellSharesPanel
                marketId={marketId}
                myShares={myShares}
                yesPrice={prediction.yesPrice}
                noPrice={prediction.noPrice}
              />
            </div>
          ) : (
            <div style={{ marginBottom: 24 }}>
              <ResolutionPanel
                marketId={marketId}
                creatorAddress={apiData?.creator || ""}
                status={apiData?.status || 1}
                outcome={apiData?.outcome}
                proposalTimestamp={apiData?.proposalTimestamp}
                myShares={myShares}
              />
            </div>
          )}

          {/* ── Price chart ── */}
          <div style={{ marginBottom: 24 }}>
            <div
              style={{
                fontSize: 13,
                fontWeight: 500,
                color: "#64748b",
                marginBottom: 12,
                letterSpacing: "0.03em",
              }}
            >
              Price history
            </div>
            <PriceChart data={chartData} />
          </div>

          {/* ── Social actions ── */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              paddingTop: 14,
              paddingBottom: 20,
              borderTop: "1px solid rgba(255,255,255,0.04)",
            }}
          >
            {[
              {
                icon: (
                  <Heart
                    style={{
                      width: 14,
                      height: 14,
                      fill: prediction.isLiked ? "#ff3366" : "none",
                      stroke: "currentColor",
                      strokeWidth: 1.5,
                    }}
                  />
                ),
                count: prediction.likes,
                active: prediction.isLiked,
                activeColor: "#ff3366",
              },
              {
                icon: (
                  <MessageCircle
                    style={{ width: 14, height: 14, strokeWidth: 1.5 }}
                  />
                ),
                count: prediction.comments,
                active: false,
                activeColor: "#1F87FC",
              },
              {
                icon: (
                  <Repeat2
                    style={{ width: 14, height: 14, strokeWidth: 1.5 }}
                  />
                ),
                count: prediction.reposts,
                active: false,
                activeColor: "#1F87FC",
              },
              {
                icon: (
                  <Share2 style={{ width: 14, height: 14, strokeWidth: 1.5 }} />
                ),
                count: null,
                active: false,
                activeColor: "#1F87FC",
              },
            ].map((action, i) => (
              <button
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  fontSize: 12,
                  padding: "6px 8px",
                  borderRadius: 7,
                  border: "none",
                  background: "none",
                  cursor: "pointer",
                  color: action.active ? action.activeColor : "#4a5568",
                  fontFamily: "inherit",
                  transition: "color 0.15s, background 0.15s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#1F87FC";
                  e.currentTarget.style.background = "rgba(31,135,252,0.08)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = action.active
                    ? action.activeColor
                    : "#4a5568";
                  e.currentTarget.style.background = "none";
                }}
              >
                {action.icon}
                {action.count !== null && (
                  <span>{formatNumber(action.count)}</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Comments ── */}
      <div
        style={{
          background: "#12121f",
          border: "1px solid rgba(31,135,252,0.15)",
          borderRadius: 18,
          padding: "20px",
        }}
      >
        <div
          style={{
            fontSize: 13,
            fontWeight: 500,
            color: "#64748b",
            marginBottom: 16,
            letterSpacing: "0.03em",
          }}
        >
          Comments
        </div>
        <CommentsSection marketId={Number(prediction.id)} />
      </div>
    </div>
  );
}
