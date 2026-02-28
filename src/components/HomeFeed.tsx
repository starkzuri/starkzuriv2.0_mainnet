import { useState, useEffect, useRef, useCallback } from "react";
import { PredictionCard } from "./PredictionCard";
import { Sparkles, Users, Loader2, TrendingUp, Zap } from "lucide-react";
import { Prediction } from "../types/prediction";
import { mapMarketToPrediction, ApiMarket } from "../lib/marketMapper";
import { motion, AnimatePresence } from "motion/react";
// 🟢 1. Add these imports
import { useWallet } from "../context/WalletContext";
import { toast } from "sonner";

// 🟢 CONFIG
const PAGE_SIZE = 5;
// const API_URL = "https://starknet-indexer-apibara-d7ss.onrender.com";
// Better to use env var so it works with your local server too:
const API_URL =
  import.meta.env.VITE_INDEXER_SERVER_URL ||
  "https://starknet-indexer-apibara-mainnet.onrender.com";

interface HomeFeedProps {
  onViewMarket: (id: string) => void;
}

type FeedTab = "for-you" | "active";

export function HomeFeed({ onViewMarket }: HomeFeedProps) {
  // 🟢 2. Get Wallet Address for social actions
  const { address } = useWallet();

  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [activeTab, setActiveTab] = useState<FeedTab>("for-you");
  const [streakCount, setStreakCount] = useState(7);

  // Pagination State
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);

  // Observer Ref
  const observer = useRef<IntersectionObserver | null>(null);

  // Fetch Function (Unchanged)
  const fetchMarkets = async (pageIndex: number) => {
    setLoading(true);
    try {
      const offset = pageIndex * PAGE_SIZE;
      const userParam = address ? `&user=${address}` : "";
      const res = await fetch(
        `${API_URL}/markets?limit=${PAGE_SIZE}&offset=${offset}${userParam}`,
      );
      const data: ApiMarket[] = await res.json();
      const formattedData = data.map(mapMarketToPrediction);
      console.log(formattedData);

      setPredictions((prev) => {
        const existingIds = new Set(prev.map((p) => p.id));
        const uniqueNew = formattedData.filter((p) => !existingIds.has(p.id));
        return [...prev, ...uniqueNew];
      });

      if (formattedData.length < PAGE_SIZE) {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Failed to fetch markets:", error);
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    setPredictions([]);

    fetchMarkets(0);
    setPage(0);
  }, [address]);

  const lastElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prev) => {
            const nextPage = prev + 1;
            fetchMarkets(nextPage);
            return nextPage;
          });
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore],
  );

  // 🟢 3. REAL SOCIAL HANDLERS

  // LIKE
  const handleLike = async (id: string) => {
    if (!address) return toast.error("Connect wallet to like!");

    // Optimistic Update
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

    // API Call
    try {
      await fetch(`${API_URL}/social/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user: address, marketId: id }),
      });
    } catch (e) {
      console.error("Like failed", e);
      toast.error("Failed to save like");
    }
  };

  // REPOST
  const handleRepost = async (id: string) => {
    if (!address) return toast.error("Connect wallet to repost!");

    // Optimistic Update
    setPredictions((prev) =>
      prev.map((p) => (p.id === id ? { ...p, reposts: p.reposts + 1 } : p)),
    );

    try {
      await fetch(`${API_URL}/social/repost`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user: address, marketId: id }),
      });
      toast.success("Reposted to your profile!");
    } catch (e) {
      console.error("Repost failed", e);
      toast.error("Failed to repost");
    }
  };

  // COMMENT
  const handleComment = (id: string) => {
    // Navigate to Market Detail (Comments section is usually there)
    onViewMarket(id);
  };

  // Filter Logic
  const getFilteredPredictions = () => {
    if (activeTab === "active") return predictions.slice(0, 3);
    return predictions;
  };

  // ... (Render Logic remains the same) ...
  if (initialLoading) {
    // ... (Your existing loading spinner) ...
    return (
      <div className="w-full max-w-2xl mx-auto py-20 text-center">
        <motion.div
          animate={{ rotate: 360, scale: [1, 1.2, 1] }}
          transition={{
            rotate: { duration: 2, repeat: Infinity, ease: "linear" },
            scale: { duration: 1, repeat: Infinity },
          }}
        >
          <Sparkles className="w-10 h-10 text-[#1F87FC] mx-auto mb-4" />
        </motion.div>
        <motion.p
          className="text-muted-foreground"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          Syncing with Starknet...
        </motion.p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-6 space-y-6 pb-20">
      {/* ... (Your Header and Tabs code remains exactly the same) ... */}
      <motion.div
        className="flex items-center justify-between mb-6"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, type: "spring" }}
      >
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            <Sparkles className="w-8 h-8 text-[#1F87FC]" />
          </motion.div>
          <div>
            <h1 className="text-foreground">Home</h1>
            <p className="text-sm text-muted-foreground">
              Your personalized feed
            </p>
          </div>
        </div>
        <motion.div
          className="flex items-center gap-2 bg-gradient-to-r from-orange-500/20 to-yellow-500/20 border border-orange-500/40 rounded-full px-4 py-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.2, 1] }}
            transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
          >
            <Zap className="w-4 h-4 text-orange-400 fill-orange-400" />
          </motion.div>
        </motion.div>
      </motion.div>

      <div className="flex gap-2 border-b border-border relative">
        <motion.button
          onClick={() => setActiveTab("for-you")}
          className={`flex-1 pb-3 px-4 transition-all relative ${activeTab === "for-you" ? "text-[#1F87FC]" : "text-muted-foreground hover:text-foreground"}`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center justify-center gap-2">
            <motion.div
              animate={
                activeTab === "for-you"
                  ? { rotate: [0, 360], scale: [1, 1.2, 1] }
                  : {}
              }
              transition={{ duration: 0.6 }}
            >
              <Sparkles className="w-4 h-4" />
            </motion.div>
            <span>For You</span>
          </div>
          {activeTab === "for-you" && (
            <motion.div
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#1F87FC] to-transparent"
              layoutId="activeTab"
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          )}
        </motion.button>
        <motion.button
          onClick={() => setActiveTab("active")}
          className={`flex-1 pb-3 px-4 transition-all relative ${activeTab === "active" ? "text-[#1F87FC]" : "text-muted-foreground hover:text-foreground"}`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center justify-center gap-2">
            <Users className="w-4 h-4" />
            <span>active</span>
          </div>
          {activeTab === "active" && (
            <motion.div
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#1F87FC] to-transparent"
              layoutId="activeTab"
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          )}
        </motion.button>
      </div>

      <div className="space-y-6">
        {getFilteredPredictions().length === 0 ? (
          <motion.div
            className="bg-[#0f0f1a] border border-[#1F87FC]/30 rounded-xl p-12 text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            </motion.div>
            <h3 className="text-foreground mb-2">No markets found</h3>
            <p className="text-sm text-muted-foreground">
              Go to "Create" to launch the first market!
            </p>
          </motion.div>
        ) : (
          getFilteredPredictions().map((prediction, index) => {
            const isLast = index === getFilteredPredictions().length - 1;

            return (
              <motion.div
                key={prediction.id}
                ref={isLast ? lastElementRef : undefined}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  duration: 0.4,
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 300,
                  damping: 25,
                }}
                whileHover={{ scale: 1.02 }}
              >
                <PredictionCard
                  prediction={prediction}
                  onLike={() => handleLike(prediction.id)} // ✅ Updated
                  onComment={() => handleComment(prediction.id)} // ✅ Updated
                  onRepost={() => handleRepost(prediction.id)} // ✅ Updated
                  onClick={() => onViewMarket(prediction.id)}
                />
              </motion.div>
            );
          })
        )}

        {/* ... (Loaders/End of Feed remain same) ... */}
        <AnimatePresence>
          {loading && hasMore && (
            <motion.div
              className="py-4 flex flex-col items-center gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Loader2 className="w-6 h-6 text-[#1F87FC]" />
              </motion.div>
              <motion.p
                className="text-xs text-muted-foreground"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                Loading more predictions...
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {!hasMore && predictions.length > 0 && (
            <motion.div
              className="py-8 text-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.2, 1] }}
                transition={{ duration: 0.6 }}
                className="inline-block mb-2"
              >
                <TrendingUp className="w-6 h-6 text-[#1F87FC] mx-auto" />
              </motion.div>
              <p className="text-xs text-muted-foreground">
                You're all caught up! 🎉
              </p>
              <p className="text-xs text-muted-foreground/60 mt-1">
                Come back later for more predictions
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
