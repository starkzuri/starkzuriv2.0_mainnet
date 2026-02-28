import { useState, useEffect, useRef, useCallback } from "react";
import {
  TrendingUp,
  TrendingDown,
  Sparkles,
  Search,
  X,
  Loader2,
} from "lucide-react";
import { PredictionCard } from "./PredictionCard";
import { Prediction } from "../types/prediction";
import { mapMarketToPrediction, ApiMarket } from "../lib/marketMapper";
// 🟢 1. NEW IMPORTS
import { useWallet } from "../context/WalletContext";
import { toast } from "sonner";

// CONFIG
const PAGE_SIZE = 6;
const API_URL = import.meta.env.VITE_INDEXER_SERVER_URL;

type MarketView = "all" | "trending" | "rising-yes" | "rising-no" | "new";

interface MarketExploreProps {
  onViewMarket: (id: string) => void;
}

export function MarketExplore({ onViewMarket }: MarketExploreProps) {
  // 🟢 2. GET WALLET ADDRESS
  const { address } = useWallet();

  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(false);

  // Filters
  const [activeView, setActiveView] = useState<MarketView>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Pagination State
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);

  const categories = ["all", "Crypto", "Tech", "Sports", "Space", "Politics"];
  const observer = useRef<IntersectionObserver | null>(null);

  // -------------------------------------------------------------------
  // FETCH FUNCTION
  // -------------------------------------------------------------------
  const fetchMarkets = useCallback(
    async (pageIndex: number, resetList = false) => {
      setLoading(true);
      try {
        const offset = pageIndex * PAGE_SIZE;

        // 🟢 3. INCLUDE USER PARAM (for isLiked status)
        const params = new URLSearchParams({
          limit: PAGE_SIZE.toString(),
          offset: offset.toString(),
          sort: activeView === "all" ? "new" : activeView,
          category: selectedCategory,
          search: searchQuery,
        });

        if (address) {
          params.append("user", address);
        }

        const res = await fetch(`${API_URL}/markets?${params}`);
        const data: ApiMarket[] = await res.json();
        const formattedData = data.map(mapMarketToPrediction);

        setPredictions((prev) => {
          if (resetList) return formattedData;
          const existingIds = new Set(prev.map((p) => p.id));
          const uniqueNew = formattedData.filter((p) => !existingIds.has(p.id));
          return [...prev, ...uniqueNew];
        });

        setHasMore(formattedData.length >= PAGE_SIZE);
      } catch (error) {
        console.error("Failed to fetch markets:", error);
      } finally {
        setLoading(false);
        setInitialLoad(false);
      }
    },
    // 🟢 Add address to dependency array so it refetches on login
    [activeView, selectedCategory, searchQuery, address],
  );

  // -------------------------------------------------------------------
  // EFFECT: Handle Filter Changes & Login
  // -------------------------------------------------------------------
  useEffect(() => {
    setPage(0);
    setHasMore(true);
    const timer = setTimeout(() => {
      fetchMarkets(0, true);
    }, 300);
    return () => clearTimeout(timer);
  }, [activeView, selectedCategory, searchQuery, address, fetchMarkets]);

  // -------------------------------------------------------------------
  // 🟢 4. SOCIAL HANDLERS (Copied from HomeFeed)
  // -------------------------------------------------------------------
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
    } catch (e) {
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
    } catch (e) {
      toast.error("Failed to repost");
    }
  };

  // -------------------------------------------------------------------
  // INFINITE SCROLL
  // -------------------------------------------------------------------
  const lastElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prev) => {
            const nextPage = prev + 1;
            fetchMarkets(nextPage, false);
            return nextPage;
          });
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore, fetchMarkets],
  );

  const clearSearch = () => {
    setSearchQuery("");
  };

  if (initialLoad) {
    return (
      <div className="w-full max-w-4xl mx-auto py-20 text-center">
        <Sparkles className="w-10 h-10 text-[#1F87FC] animate-spin mx-auto mb-4" />
        <p className="text-muted-foreground">Loading markets...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6 space-y-6 pb-20">
      {/* ... (Header, Search, Filters remain exactly the same) ... */}

      {/* Header */}
      <div className="flex items-center gap-3">
        <TrendingUp className="w-6 h-6 md:w-8 md:h-8 text-[#1F87FC]" />
        <div>
          <h1 className="text-foreground text-xl md:text-2xl">
            Explore Markets
          </h1>
          <p className="text-xs md:text-sm text-muted-foreground">
            Discover and trade predictions
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-muted-foreground" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search predictions, creators..."
          className="w-full bg-[#0f0f1a] border border-[#1F87FC]/30 rounded-lg md:rounded-xl pl-10 md:pl-12 pr-10 md:pr-12 py-3 md:py-4 text-sm md:text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#1F87FC] focus:ring-1 focus:ring-[#1F87FC] transition-all"
        />
        {searchQuery && (
          <button
            onClick={clearSearch}
            className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-[#1F87FC] transition-colors"
          >
            <X className="w-4 h-4 md:w-5 md:h-5" />
          </button>
        )}
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-3 md:px-4 py-1.5 md:py-2 rounded-lg text-xs md:text-sm whitespace-nowrap transition-all flex-shrink-0 ${
              selectedCategory === category
                ? "bg-[#1F87FC] text-white shadow-[0_0_15px_rgba(31,135,252,0.5)]"
                : "bg-[#0f0f1a] border border-[#1F87FC]/30 text-muted-foreground hover:border-[#1F87FC]/60 hover:text-foreground"
            }`}
          >
            {category === "all" ? "All" : category}
          </button>
        ))}
      </div>

      {/* View Filters */}
      <div className="grid grid-cols-3 md:grid-cols-5 gap-2 md:gap-3">
        <button
          onClick={() => setActiveView("all")}
          className={`flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2 px-2 md:px-4 py-2 md:py-3 rounded-lg transition-all ${
            activeView === "all"
              ? "bg-[#1F87FC]/20 border-2 border-[#1F87FC] text-[#1F87FC]"
              : "bg-[#0f0f1a] border border-border text-muted-foreground hover:border-[#1F87FC]/40"
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span className="text-xs md:text-sm">All</span>
        </button>

        <button
          onClick={() => setActiveView("trending")}
          className={`flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2 px-2 md:px-4 py-2 md:py-3 rounded-lg transition-all ${
            activeView === "trending"
              ? "bg-[#1F87FC]/20 border-2 border-[#1F87FC] text-[#1F87FC]"
              : "bg-[#0f0f1a] border border-border text-muted-foreground hover:border-[#1F87FC]/40"
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span className="text-xs md:text-sm">Hot</span>
        </button>

        <button
          onClick={() => setActiveView("rising-yes")}
          className={`flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2 px-2 md:px-4 py-2 md:py-3 rounded-lg transition-all ${
            activeView === "rising-yes"
              ? "bg-[#00ff88]/20 border-2 border-[#00ff88] text-[#00ff88]"
              : "bg-[#0f0f1a] border border-border text-muted-foreground hover:border-[#00ff88]/40"
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span className="text-xs md:text-sm">YES</span>
        </button>

        <button
          onClick={() => setActiveView("rising-no")}
          className={`flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2 px-2 md:px-4 py-2 md:py-3 rounded-lg transition-all ${
            activeView === "rising-no"
              ? "bg-[#ff3366]/20 border-2 border-[#ff3366] text-[#ff3366]"
              : "bg-[#0f0f1a] border border-border text-muted-foreground hover:border-[#ff3366]/40"
          }`}
        >
          <TrendingDown className="w-4 h-4" />
          <span className="text-xs md:text-sm">NO</span>
        </button>

        <button
          onClick={() => setActiveView("new")}
          className={`flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2 px-2 md:px-4 py-2 md:py-3 rounded-lg transition-all ${
            activeView === "new"
              ? "bg-[#1F87FC]/20 border-2 border-[#1F87FC] text-[#1F87FC]"
              : "bg-[#0f0f1a] border border-border text-muted-foreground hover:border-[#1F87FC]/40"
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span className="text-xs md:text-sm">New</span>
        </button>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-xs md:text-sm">
        <span className="text-muted-foreground">
          Showing {predictions.length} results
        </span>
        {(searchQuery || selectedCategory !== "all") && (
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("all");
            }}
            className="text-[#1F87FC] hover:text-[#1F87FC]/80 transition-colors"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Predictions Feed */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {predictions.length === 0 && !loading ? (
          <div className="col-span-full bg-[#0f0f1a] border border-[#1F87FC]/30 rounded-xl p-8 md:p-12 text-center">
            <Search className="w-10 h-10 md:w-12 md:h-12 text-muted-foreground mx-auto mb-3 md:mb-4" />
            <h3 className="text-foreground mb-2 text-sm md:text-base">
              No predictions found
            </h3>
            <p className="text-xs md:text-sm text-muted-foreground">
              Try adjusting your search or filters
            </p>
          </div>
        ) : (
          predictions.map((prediction, index) => {
            const isLast = index === predictions.length - 1;
            return (
              <div
                ref={isLast ? lastElementRef : undefined}
                key={prediction.id}
              >
                <PredictionCard
                  prediction={prediction}
                  onClick={() => onViewMarket(prediction.id)}
                  // 🟢 5. PASS HANDLERS
                  onLike={() => handleLike(prediction.id)}
                  onRepost={() => handleRepost(prediction.id)}
                  onComment={() => onViewMarket(prediction.id)}
                />
              </div>
            );
          })
        )}
      </div>

      {/* Loading Spinner */}
      {loading && hasMore && (
        <div className="py-4 flex justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-[#1F87FC]" />
        </div>
      )}

      {/* End of List */}
      {!hasMore && predictions.length > 0 && (
        <div className="py-4 text-center text-xs text-muted-foreground">
          End of results
        </div>
      )}
    </div>
  );
}
