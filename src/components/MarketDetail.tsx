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
} from "lucide-react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { Prediction, Comment } from "../types/prediction";
import { mockComments } from "../data/mockData";
import { useTrade } from "../hooks/useTrade";
import { useAuth } from "../hooks/useAuth";
import { ResolutionPanel } from "./ResolutionPanel"; // 🟢 Correctly Imported
import { MediaPreview } from "./MediaPreview";
import CommentsSection from "./CommentSection";
import { SellSharesPanel } from "./subcomponents/SellSharesPanel";
import { toast, Toaster } from "sonner";

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
  // 🟢 ADDED: Status fields needed for resolution
  endTime: number;
  status?: number;
  outcome?: boolean;
  proposalTimestamp?: number;
}

const formatAddress = (addr: string) => {
  if (!addr) return "";
  // 1. Force lowercase
  let hex = addr.toLowerCase();
  // 2. Ensure it starts with 0x
  if (!hex.startsWith("0x")) hex = "0x" + hex;
  // 3. Pad with zeros until it is 66 chars long (Standard Starknet format)
  //    (0x + 64 chars)
  while (hex.length < 66) {
    hex = "0x0" + hex.substring(2);
  }
  return hex;
};

const calculatePayout = (investedAmount, price) => {
  if (
    !investedAmount ||
    isNaN(investedAmount) ||
    parseFloat(investedAmount) <= 0
  )
    return null;
  const val = parseFloat(investedAmount);

  // Logic: You buy shares at current price. If you win, each share is worth $1.
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

// Calculate both sides in real-time based on the single 'amount' state

export function MarketDetail({ marketId, onBack }: MarketDetailProps) {
  const { address } = useAuth();
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [loading, setLoading] = useState(true);

  // 🟢 NEW: Store raw API data for resolution props
  const [apiData, setApiData] = useState<ApiMarket | null>(null);

  // Trading State
  const [amount, setAmount] = useState<string>("");
  const { buyShares } = useTrade();

  // Real Data State
  const [chartData, setChartData] = useState<any[]>([]);
  const [myShares, setMyShares] = useState({
    yes: 0,
    no: 0,
    hasClaimed: false,
  });

  // Chart & Comment State
  const [activeChart, setActiveChart] = useState<"yes" | "no" | "both">("both");
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);

  const API_URL = "https://starknet-indexer-apibara-mainnet-19ew.onrender.com";
  console.log("my shares ", myShares);
  // 1. Fetch Market Data & History
  // 1. Fetch Market Data & History (Optimized)
  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        // 🟢 FIX: Fetch ONLY the specific market by ID
        // This solves the "Market not found" issue for older markets
        const res = await fetch(`${API_URL}/markets/${marketId}`);

        if (!res.ok) {
          console.error("Market fetch failed:", res.status);
          setLoading(false);
          return;
        }

        const rawMarket: ApiMarket = await res.json();
        console.log("rawMarket felabs", rawMarket);

        if (rawMarket) {
          setApiData(rawMarket); // Store raw data for resolution panel

          const mediaStr = rawMarket.media || "";
          const isVideo =
            mediaStr.endsWith(".mp4") || mediaStr.endsWith(".webm");

          // Helper to clean IPFS urls
          let mediaUrl = mediaStr.includes("ipfs")
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

        // --- Fetch History (unchanged) ---
        const historyRes = await fetch(
          `${API_URL}/markets/${marketId}/history`,
        );
        if (historyRes.ok) {
          const historyData = await historyRes.json();
          const formattedHistory = historyData.map((item: any) => ({
            ...item,
            timestamp: item.timestamp * 1000,
            yesPrice: Number(item.yesPrice),
            noPrice: Number(item.noPrice),
          }));
          setChartData(formattedHistory);
        }

        // --- Fetch User Position (unchanged) ---
        if (address) {
          try {
            const dbAddress = formatAddress(address);
            const url = `${API_URL}/markets/${marketId}/position/${dbAddress}`;
            const positionRes = await fetch(url);

            if (positionRes.ok) {
              const data = await positionRes.json();
              setMyShares({
                yes: Number(data.yesShares || data.yes_shares || 0),
                no: Number(data.noShares || data.no_shares || 0),
                // 🟢 Capture the claimed status we added to DB earlier
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

  if (loading)
    return <div className="p-10 text-center text-white">Loading Market...</div>;
  if (!prediction)
    return (
      <div className="p-10 text-center text-red-500">Market not found</div>
    );

  console.log("prediction ", prediction);

  const getTimeRemaining = () => {
    const now = new Date();
    const end = new Date(prediction.endsAt);
    const diff = end.getTime() - now.getTime();
    if (diff <= 0) return "Ended";
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    return `${days}d remaining`;
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return "Just now";
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#0f0f1a] border border-[#1F87FC]/40 rounded-lg p-3">
          <div className="text-xs text-muted-foreground mb-1">
            {new Date(payload[0].payload.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full`}
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-sm" style={{ color: entry.color }}>
                {entry.name}: ${entry.value.toFixed(3)}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  // 🟢 LOGIC: Is market active?
  // 1. Time is not up
  // 2. Status is 1 (Active) - Default to 1 if missing
  const isMarketActive =
    new Date(prediction.endsAt) > new Date() &&
    (apiData?.status === 1 || !apiData?.status);

  console.log("prediction ends ", prediction.endsAt);

  const yesData = calculatePayout(amount, prediction.yesPrice);
  const noData = calculatePayout(amount, prediction.noPrice);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-4 md:py-6 space-y-4 md:space-y-6">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-[#1F87FC] hover:text-[#1F87FC]/80 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> <span>Back to Feed</span>
      </button>

      {/* Main Card */}
      <div className="bg-[#0f0f1a] border border-[#1F87FC]/30 rounded-xl overflow-hidden">
        {/* Creator Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <img
              src={prediction.creator.avatar}
              className="w-10 h-10 rounded-full border border-[#1F87FC]/40"
            />
            <div>
              <div className="text-foreground">{prediction.creator.name}</div>
              <div className="text-muted-foreground text-xs">
                {prediction.creator.username}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" /> <span>{getTimeRemaining()}</span>
          </div>
        </div>

        {/* Media */}
        <div className="relative aspect-video bg-black/40 overflow-hidden">
          {/* 🟢 MEDIA PREVIEW: Replaced the manual div with the Component */}
          <div className="w-full">
            <MediaPreview
              src={prediction.media.url}
              // Pass type if known, else let it auto-detect
              type={prediction.media.type === "video" ? "video" : undefined}
              alt={prediction.question}
              className="rounded-none border-b border-[#1F87FC]/10"
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-4 md:p-6 space-y-6">
          <h2 className="text-xl text-foreground">{prediction.question}</h2>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-[#1a1a24] rounded-lg p-3">
              <div className="text-xs text-muted-foreground">Volume</div>
              <div className="text-xl text-[#1F87FC]">
                ${formatNumber(prediction.totalVolume.toFixed(4))}
              </div>
            </div>
            <div className="bg-[#1a1a24] rounded-lg p-3">
              <div className="text-xs text-muted-foreground">total Shares</div>
              <div className="text-xl text-white">
                {formatNumber(
                  Number(prediction.yesShares.toFixed(4)) +
                    Number(prediction.noShares.toFixed(4)),
                )}
              </div>
            </div>
            <div className="bg-[#1a1a24] rounded-lg p-3 border border-[#00ff88]/20">
              <div className="text-xs text-[#00ff88]">YES Shares</div>
              <div className="text-xl text-[#00ff88]">
                {formatNumber(prediction.yesShares.toFixed(4))}
              </div>
            </div>
            <div className="bg-[#1a1a24] rounded-lg p-3 border border-[#ff3366]/20">
              <div className="text-xs text-[#ff3366]">NO Shares</div>
              <div className="text-xl text-[#ff3366]">
                {formatNumber(prediction.noShares.toFixed(4))}
              </div>
            </div>
          </div>

          {/* 🟢 CONDITIONAL RENDER: TRADING VS RESOLUTION */}
          {isMarketActive ? (
            <div className="space-y-4">
              {/* Buy cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-1">
                {/* YES CARD */}
                <div
                  className="bg-[#1a1a24] rounded-lg p-4 flex flex-col gap-3"
                  style={{ border: "1px solid #00ff8830" }}
                >
                  {/* Title row */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TrendingUp
                        className="w-4 h-4"
                        style={{ color: "#00ff88" }}
                      />
                      <span
                        className="font-bold text-sm"
                        style={{ color: "#00ff88" }}
                      >
                        YES
                      </span>
                    </div>
                    <span
                      className="text-xs text-muted-foreground px-2 py-0.5 rounded-full font-mono"
                      style={{
                        background: "#00ff8815",
                        border: "1px solid #00ff8825",
                      }}
                    >
                      ${prediction.yesPrice.toFixed(4)}
                    </span>
                  </div>

                  {/* Input */}
                  <div className="relative">
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="Amount (USDC)"
                      className="w-full bg-black/50 rounded-lg py-2.5 px-2 pl-3 pr-14 text-white text-sm
                 focus:outline-none transition-colors"
                      style={{ border: "1px solid #00ff8830" }}
                      onFocus={(e) =>
                        (e.currentTarget.style.borderColor = "#00ff88")
                      }
                      onBlur={(e) =>
                        (e.currentTarget.style.borderColor = "#00ff8830")
                      }
                    />
                    <div
                      className="absolute right-0 top-0 bottom-0 flex items-center"
                      style={{ borderLeft: "1px solid #00ff8820" }}
                    >
                      <span className="px-2 text-xs text-muted-foreground">
                        USDC
                      </span>
                    </div>
                  </div>

                  {/* Payout estimate */}
                  <div className="min-h-[44px]">
                    {yesData ? (
                      <div
                        className="flex justify-between items-center rounded-lg p-2.5 text-sm"
                        style={{
                          background: "#00ff8810",
                          border: "1px solid #00ff8820",
                        }}
                      >
                        <span className="text-muted-foreground text-xs">
                          Potential Payout
                        </span>
                        <div className="text-right">
                          <span className="text-white font-mono block">
                            ${yesData.payout}
                          </span>
                          <span
                            className="text-[10px]"
                            style={{ color: "#00ff88" }}
                          >
                            +{yesData.profit} ({yesData.roi}%)
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="text-xs text-muted-foreground/50 p-2 text-center">
                        Enter amount to see returns
                      </div>
                    )}
                  </div>

                  {/* Buy button */}
                  <button
                    onClick={() => handleTrade(true)}
                    className="w-full py-2.5 rounded-lg font-bold text-sm transition-all"
                    style={{
                      background: "#00ff88",
                      color: "#000",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "#00ff88cc")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "#00ff88")
                    }
                  >
                    Buy YES
                  </button>
                </div>

                {/* NO CARD */}
                <div
                  className="bg-[#1a1a24] rounded-lg p-4 flex flex-col gap-3"
                  style={{ border: "1px solid #ff336630" }}
                >
                  {/* Title row */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TrendingDown
                        className="w-4 h-4"
                        style={{ color: "#ff3366" }}
                      />
                      <span
                        className="font-bold text-sm"
                        style={{ color: "#ff3366" }}
                      >
                        NO
                      </span>
                    </div>
                    <span
                      className="text-xs text-muted-foreground px-2 py-0.5 rounded-full font-mono"
                      style={{
                        background: "#ff336615",
                        border: "1px solid #ff336625",
                      }}
                    >
                      ${prediction.noPrice.toFixed(4)}
                    </span>
                  </div>

                  {/* Input */}
                  <div className="relative">
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="Amount (USDC)"
                      className="w-full bg-black/50 px-2 rounded-lg py-2.5 pl-3 pr-14 text-white text-sm
                 focus:outline-none transition-colors"
                      style={{ border: "1px solid #ff336630" }}
                      onFocus={(e) =>
                        (e.currentTarget.style.borderColor = "#ff3366")
                      }
                      onBlur={(e) =>
                        (e.currentTarget.style.borderColor = "#ff336630")
                      }
                    />
                    <div
                      className="absolute right-0 top-0 bottom-0 flex items-center"
                      style={{ borderLeft: "1px solid #ff336620" }}
                    >
                      <span className="px-2 text-xs text-muted-foreground">
                        USDC
                      </span>
                    </div>
                  </div>

                  {/* Payout estimate */}
                  <div className="min-h-[44px]">
                    {noData ? (
                      <div
                        className="flex justify-between items-center rounded-lg p-2.5 text-sm"
                        style={{
                          background: "#ff336610",
                          border: "1px solid #ff336620",
                        }}
                      >
                        <span className="text-muted-foreground text-xs">
                          Potential Payout
                        </span>
                        <div className="text-right">
                          <span className="text-white font-mono block">
                            ${noData.payout}
                          </span>
                          <span
                            className="text-[10px]"
                            style={{ color: "#ff3366" }}
                          >
                            +{noData.profit} ({noData.roi}%)
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="text-xs text-muted-foreground/50 p-2 text-center">
                        Enter amount to see returns
                      </div>
                    )}
                  </div>

                  {/* Buy button */}
                  <button
                    onClick={() => handleTrade(false)}
                    className="w-full py-2.5 rounded-lg font-bold text-sm transition-all"
                    style={{
                      background: "#ff3366",
                      color: "#fff",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "#ff3366cc")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "#ff3366")
                    }
                  >
                    Buy NO
                  </button>
                </div>
              </div>

              {/* Sell panel — full width, SellSharesPanel self-hides when no shares */}
              <SellSharesPanel
                marketId={marketId}
                myShares={myShares}
                yesPrice={prediction.yesPrice}
                noPrice={prediction.noPrice}
              />
            </div>
          ) : (
            <ResolutionPanel
              marketId={marketId}
              creatorAddress={apiData?.creator || ""}
              status={apiData?.status || 1}
              outcome={apiData?.outcome}
              proposalTimestamp={apiData?.proposalTimestamp}
              myShares={myShares}
            />
          )}

          {/* Price Chart */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-foreground text-sm md:text-base">
                Price History
              </h3>
              <div className="flex gap-1.5 md:gap-2">
                <button
                  onClick={() => setActiveChart("both")}
                  className={`px-2 py-1 rounded text-xs ${
                    activeChart === "both"
                      ? "bg-[#1F87FC]/20 text-[#1F87FC]"
                      : "border border-border text-muted-foreground"
                  }`}
                >
                  Both
                </button>
                <button
                  onClick={() => setActiveChart("yes")}
                  className={`px-2 py-1 rounded text-xs ${
                    activeChart === "yes"
                      ? "bg-[#00ff88]/20 text-[#00ff88]"
                      : "border border-border text-muted-foreground"
                  }`}
                >
                  YES
                </button>
                <button
                  onClick={() => setActiveChart("no")}
                  className={`px-2 py-1 rounded text-xs ${
                    activeChart === "no"
                      ? "bg-[#ff3366]/20 text-[#ff3366]"
                      : "border border-border text-muted-foreground"
                  }`}
                >
                  NO
                </button>
              </div>
            </div>

            <div className="bg-[#1a1a24] border border-border rounded-lg p-2 md:p-4">
              <ResponsiveContainer width="100%" height={250}>
                {/* <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorYes" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00ff88" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#00ff88" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorNo" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ff3366" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#ff3366" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(31, 135, 252, 0.1)"
                  />
                  <XAxis
                    dataKey="timestamp"
                    stroke="#6b6b7f"
                    tick={{ fill: "#6b6b7f", fontSize: 12 }}
                    tickFormatter={(value) =>
                      new Date(value).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    }
                  />
                  <YAxis
                    stroke="#6b6b7f"
                    tick={{ fill: "#6b6b7f", fontSize: 12 }}
                    domain={[0, 1]}
                    tickFormatter={(value) => `$${value.toFixed(2)}`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  {(activeChart === "both" || activeChart === "yes") && (
                    <Area
                      type="monotone"
                      dataKey="yesPrice"
                      stroke="#00ff88"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorYes)"
                      name="YES"
                    />
                  )}
                  {(activeChart === "both" || activeChart === "no") && (
                    <Area
                      type="monotone"
                      dataKey="noPrice"
                      stroke="#ff3366"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorNo)"
                      name="NO"
                    />
                  )}
                </AreaChart> */}

                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorYes" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00ff88" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#00ff88" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorNo" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ff3366" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#ff3366" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(31, 135, 252, 0.1)"
                  />
                  <XAxis
                    dataKey="timestamp"
                    stroke="#6b6b7f"
                    tick={{ fill: "#6b6b7f", fontSize: 12 }}
                    tickFormatter={(value) =>
                      new Date(value).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    }
                  />
                  {/* 🟢 FIXED Y-AXIS */}
                  <YAxis
                    stroke="#6b6b7f"
                    tick={{ fill: "#6b6b7f", fontSize: 12 }}
                    // This zooms the chart in to fit the data boundaries
                    domain={["auto", "auto"]}
                    tickFormatter={(value) => `$${value.toFixed(4)}`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  {(activeChart === "both" || activeChart === "yes") && (
                    <Area
                      type="monotone"
                      dataKey="yesPrice"
                      stroke="#00ff88"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorYes)"
                      name="YES"
                      // 🟢 OPTIONAL: Add dots so you can see individual trades clearly
                      activeDot={{ r: 6 }}
                    />
                  )}
                  {(activeChart === "both" || activeChart === "no") && (
                    <Area
                      type="monotone"
                      dataKey="noPrice"
                      stroke="#ff3366"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorNo)"
                      name="NO"
                      activeDot={{ r: 6 }}
                    />
                  )}
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Social Actions */}
          <div className="flex items-center gap-6 pt-4 border-t border-border">
            <button
              className={`flex items-center gap-2 ${
                prediction.isLiked ? "text-[#ff3366]" : "text-muted-foreground"
              }`}
            >
              <Heart
                className={`w-4 h-4 ${
                  prediction.isLiked ? "fill-current" : ""
                }`}
              />{" "}
              <span>{formatNumber(prediction.likes)}</span>
            </button>
            <button className="flex items-center gap-2 text-muted-foreground">
              <MessageCircle className="w-4 h-4" />{" "}
              <span>{formatNumber(prediction.comments)}</span>
            </button>
            <button className="flex items-center gap-2 text-muted-foreground">
              <Repeat2 className="w-4 h-4" />{" "}
              <span>{formatNumber(prediction.reposts)}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <div className="bg-[#0f0f1a] border border-[#1F87FC]/30 rounded-xl p-4 md:p-6">
        <CommentsSection marketId={Number(prediction.id)} />
      </div>
    </div>
  );
}
