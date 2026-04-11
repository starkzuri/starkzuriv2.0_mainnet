import { useState, useEffect, useRef, useCallback } from "react";
import {
  TrendingUp,
  TrendingDown,
  Sparkles,
  Search,
  X,
  Loader2,
  Compass,
} from "lucide-react";
import { PredictionCard } from "./PredictionCard";
import { Prediction } from "../types/prediction";
import { mapMarketToPrediction, ApiMarket } from "../lib/marketMapper";
import { useAuth } from "../hooks/useAuth";
import { toast } from "sonner";

const PAGE_SIZE = 6;
const API_URL = import.meta.env.VITE_INDEXER_SERVER_URL;

type MarketView = "all" | "trending" | "rising-yes" | "rising-no" | "new";

interface MarketExploreProps {
  onViewMarket: (id: string) => void;
}

const VIEW_TABS: {
  id: MarketView;
  label: string;
  icon: React.ReactNode;
  accent: string;
}[] = [
  {
    id: "all",
    label: "All",
    icon: <Sparkles style={{ width: 13, height: 13 }} />,
    accent: "#1F87FC",
  },
  {
    id: "trending",
    label: "Hot",
    icon: <TrendingUp style={{ width: 13, height: 13 }} />,
    accent: "#1F87FC",
  },
  {
    id: "rising-yes",
    label: "YES",
    icon: <TrendingUp style={{ width: 13, height: 13 }} />,
    accent: "#00ff88",
  },
  {
    id: "rising-no",
    label: "NO",
    icon: <TrendingDown style={{ width: 13, height: 13 }} />,
    accent: "#ff3366",
  },
  {
    id: "new",
    label: "New",
    icon: <Sparkles style={{ width: 13, height: 13 }} />,
    accent: "#1F87FC",
  },
];

const CATEGORIES = ["all", "Crypto", "Tech", "Sports", "Space", "Politics"];

export function MarketExplore({ onViewMarket }: MarketExploreProps) {
  const { address } = useAuth();

  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeView, setActiveView] = useState<MarketView>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);

  const observer = useRef<IntersectionObserver | null>(null);

  const fetchMarkets = useCallback(
    async (pageIndex: number, resetList = false) => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          limit: PAGE_SIZE.toString(),
          offset: (pageIndex * PAGE_SIZE).toString(),
          sort: activeView === "all" ? "new" : activeView,
          category: selectedCategory,
          search: searchQuery,
        });
        if (address) params.append("user", address);

        const res = await fetch(`${API_URL}/markets?${params}`);
        const data: ApiMarket[] = await res.json();
        const formatted = data.map(mapMarketToPrediction);

        setPredictions((prev) => {
          if (resetList) return formatted;
          const seen = new Set(prev.map((p) => p.id));
          return [...prev, ...formatted.filter((p) => !seen.has(p.id))];
        });
        setHasMore(formatted.length >= PAGE_SIZE);
      } catch (err) {
        console.error("Failed to fetch markets:", err);
      } finally {
        setLoading(false);
        setInitialLoad(false);
      }
    },
    [activeView, selectedCategory, searchQuery, address],
  );

  useEffect(() => {
    setPage(0);
    setHasMore(true);
    const t = setTimeout(() => fetchMarkets(0, true), 300);
    return () => clearTimeout(t);
  }, [activeView, selectedCategory, searchQuery, address, fetchMarkets]);

  const handleLike = async (id: string) => {
    if (!address) return toast.error("Connect wallet to like!");
    setPredictions((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              isLiked: !p.isLiked,
              likes: p.isLiked ? p.likes - 1 : p.likes + 1,
            }
          : p,
      ),
    );
    try {
      await fetch(`${API_URL}/social/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user: address, marketId: id }),
      });
    } catch {
      toast.error("Failed to save like");
    }
  };

  const handleRepost = async (id: string) => {
    if (!address) return toast.error("Connect wallet to repost!");
    setPredictions((prev) =>
      prev.map((p) => (p.id === id ? { ...p, reposts: p.reposts + 1 } : p)),
    );
    try {
      await fetch(`${API_URL}/social/repost`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user: address, marketId: id }),
      });
      toast.success("Reposted!");
    } catch {
      toast.error("Failed to repost");
    }
  };

  const lastElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prev) => {
            const next = prev + 1;
            fetchMarkets(next, false);
            return next;
          });
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore, fetchMarkets],
  );

  const activeTab = VIEW_TABS.find((t) => t.id === activeView)!;

  // ── Initial loading state ──
  if (initialLoad) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "80px 24px",
          gap: 12,
        }}
      >
        <Sparkles
          style={{ width: 28, height: 28, color: "#1F87FC" }}
          className="animate-spin"
        />
        <span style={{ fontSize: 13, color: "#4a5568" }}>Loading markets…</span>
      </div>
    );
  }

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 1200,
        margin: "0 auto",
        padding: "28px 24px 80px",
        display: "flex",
        flexDirection: "column",
        gap: 20,
      }}
    >
      {/* ── Page header ── */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div
          style={{
            width: 38,
            height: 38,
            borderRadius: 10,
            background: "rgba(31,135,252,0.1)",
            border: "1px solid rgba(31,135,252,0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Compass style={{ width: 18, height: 18, color: "#1F87FC" }} />
        </div>
        <div>
          <h1
            style={{
              fontSize: 18,
              fontWeight: 600,
              color: "#e2e8f0",
              margin: 0,
              lineHeight: 1.2,
            }}
          >
            Explore markets
          </h1>
          <p
            style={{ fontSize: 12, color: "#4a5568", margin: 0, marginTop: 2 }}
          >
            Discover and trade predictions
          </p>
        </div>
      </div>

      {/* ── Search bar ── */}
      <div style={{ position: "relative" }}>
        <Search
          style={{
            position: "absolute",
            left: 14,
            top: "50%",
            transform: "translateY(-50%)",
            width: 15,
            height: 15,
            color: "#4a5568",
            pointerEvents: "none",
          }}
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search predictions, creators…"
          style={{
            width: "100%",
            background: "#12121f",
            border: "1px solid rgba(31,135,252,0.2)",
            borderRadius: 10,
            padding: "11px 40px",
            fontSize: 13,
            color: "#e2e8f0",
            outline: "none",
            fontFamily: "inherit",
            transition: "border-color 0.2s",
            boxSizing: "border-box",
          }}
          onFocus={(e) =>
            (e.currentTarget.style.borderColor = "rgba(31,135,252,0.6)")
          }
          onBlur={(e) =>
            (e.currentTarget.style.borderColor = "rgba(31,135,252,0.2)")
          }
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            style={{
              position: "absolute",
              right: 12,
              top: "50%",
              transform: "translateY(-50%)",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#4a5568",
              display: "flex",
              alignItems: "center",
              padding: 2,
            }}
          >
            <X style={{ width: 14, height: 14 }} />
          </button>
        )}
      </div>

      {/* ── Category pills ── */}
      <div
        style={{
          display: "flex",
          gap: 6,
          overflowX: "auto",
          paddingBottom: 2,
          scrollbarWidth: "none",
        }}
      >
        {CATEGORIES.map((cat) => {
          const active = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                flexShrink: 0,
                padding: "5px 12px",
                borderRadius: 99,
                fontSize: 12,
                fontWeight: active ? 600 : 400,
                fontFamily: "inherit",
                cursor: "pointer",
                transition: "all 0.15s",
                background: active ? "#1F87FC" : "rgba(31,135,252,0.06)",
                border: active
                  ? "1px solid #1F87FC"
                  : "1px solid rgba(31,135,252,0.18)",
                color: active ? "#fff" : "#64748b",
                boxShadow: active ? "0 0 12px rgba(31,135,252,0.35)" : "none",
              }}
            >
              {cat === "all" ? "All" : cat}
            </button>
          );
        })}
      </div>

      {/* ── View tabs ── */}
      <div
        style={{
          display: "flex",
          gap: 6,
          background: "#12121f",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: 12,
          padding: 4,
        }}
      >
        {VIEW_TABS.map((tab) => {
          const active = activeView === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveView(tab.id)}
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 5,
                padding: "8px 6px",
                borderRadius: 8,
                fontSize: 12,
                fontWeight: active ? 600 : 400,
                fontFamily: "inherit",
                cursor: "pointer",
                transition: "all 0.15s",
                border: "none",
                background: active ? `${tab.accent}18` : "transparent",
                color: active ? tab.accent : "#4a5568",
                boxShadow: active ? `inset 0 0 0 1px ${tab.accent}40` : "none",
              }}
            >
              <span
                style={{
                  color: active ? tab.accent : "#4a5568",
                  display: "flex",
                }}
              >
                {tab.icon}
              </span>
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ── Results count + clear ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: -8,
        }}
      >
        <span style={{ fontSize: 11, color: "#3a4a5e" }}>
          {predictions.length} result{predictions.length !== 1 ? "s" : ""}
          {selectedCategory !== "all" ? ` in ${selectedCategory}` : ""}
          {searchQuery ? ` for "${searchQuery}"` : ""}
        </span>
        {(searchQuery || selectedCategory !== "all") && (
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("all");
            }}
            style={{
              fontSize: 11,
              color: "#1F87FC",
              background: "none",
              border: "none",
              cursor: "pointer",
              fontFamily: "inherit",
              padding: 0,
            }}
          >
            Clear filters
          </button>
        )}
      </div>

      {/* ── Cards grid ── */}
      {predictions.length === 0 && !loading ? (
        <div
          style={{
            background: "#12121f",
            border: "1px solid rgba(31,135,252,0.12)",
            borderRadius: 16,
            padding: "60px 24px",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 10,
          }}
        >
          <Search style={{ width: 32, height: 32, color: "#3a4a5e" }} />
          <p style={{ fontSize: 14, color: "#64748b", margin: 0 }}>
            No predictions found
          </p>
          <p style={{ fontSize: 12, color: "#3a4a5e", margin: 0 }}>
            Try adjusting your search or filters
          </p>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
            gap: 16,
          }}
        >
          {predictions.map((prediction, index) => {
            const isLast = index === predictions.length - 1;
            return (
              <div
                ref={isLast ? lastElementRef : undefined}
                key={prediction.id}
              >
                <PredictionCard
                  prediction={prediction}
                  onClick={() => onViewMarket(prediction.id)}
                  onLike={() => handleLike(prediction.id)}
                  onRepost={() => handleRepost(prediction.id)}
                  onComment={() => onViewMarket(prediction.id)}
                />
              </div>
            );
          })}
        </div>
      )}

      {/* ── Loading spinner ── */}
      {loading && hasMore && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            padding: "16px 0",
          }}
        >
          <Loader2
            style={{ width: 20, height: 20, color: "#1F87FC" }}
            className="animate-spin"
          />
        </div>
      )}

      {/* ── End of list ── */}
      {!hasMore && predictions.length > 0 && (
        <div
          style={{
            textAlign: "center",
            fontSize: 11,
            color: "#3a4a5e",
            padding: "8px 0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          }}
        >
          <div
            style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.04)" }}
          />
          End of results
          <div
            style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.04)" }}
          />
        </div>
      )}
    </div>
  );
}
