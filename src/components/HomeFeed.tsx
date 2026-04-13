// import { useState, useEffect, useRef, useCallback } from "react";
// import { PredictionCard } from "./PredictionCard";
// import { Sparkles, Users, Loader2, TrendingUp, Zap } from "lucide-react";
// import { Prediction } from "../types/prediction";
// import { mapMarketToPrediction, ApiMarket } from "../lib/marketMapper";
// import { motion, AnimatePresence } from "motion/react";
// import { useAuth } from "../hooks/useAuth";
// import { toast } from "sonner";

// const PAGE_SIZE = 5;

// const API_URL =
//   import.meta.env.VITE_INDEXER_SERVER_URL ||
//   "https://starknet-indexer-apibara-mainnet.onrender.com";

// interface HomeFeedProps {
//   onViewMarket: (id: string) => void;
// }

// type FeedTab = "for-you" | "active";

// export function HomeFeed({ onViewMarket }: HomeFeedProps) {
//   const { address } = useAuth();

//   const [predictions, setPredictions] = useState<Prediction[]>([]);
//   const [activeTab, setActiveTab] = useState<FeedTab>("for-you");

//   const [page, setPage] = useState(0);
//   const [loading, setLoading] = useState(false);
//   const [initialLoading, setInitialLoading] = useState(true);
//   const [hasMore, setHasMore] = useState(true);

//   const observer = useRef<IntersectionObserver | null>(null);

//   const fetchMarkets = async (pageIndex: number) => {
//     setLoading(true);
//     try {
//       const offset = pageIndex * PAGE_SIZE;
//       const userParam = address ? `&user=${address}` : "";
//       const res = await fetch(
//         `${API_URL}/markets?limit=${PAGE_SIZE}&offset=${offset}${userParam}`,
//       );
//       const data: ApiMarket[] = await res.json();
//       const formattedData = data.map(mapMarketToPrediction);

//       setPredictions((prev) => {
//         const existingIds = new Set(prev.map((p) => p.id));
//         const uniqueNew = formattedData.filter((p) => !existingIds.has(p.id));
//         return [...prev, ...uniqueNew];
//       });

//       if (formattedData.length < PAGE_SIZE) {
//         setHasMore(false);
//       }
//     } catch (error) {
//       console.error("Failed to fetch markets:", error);
//     } finally {
//       setLoading(false);
//       setInitialLoading(false);
//     }
//   };

//   useEffect(() => {
//     setPredictions([]);
//     fetchMarkets(0);
//     setPage(0);
//   }, [address]);

//   const lastElementRef = useCallback(
//     (node: HTMLDivElement) => {
//       if (loading) return;
//       if (observer.current) observer.current.disconnect();

//       observer.current = new IntersectionObserver((entries) => {
//         if (entries[0].isIntersecting && hasMore) {
//           setPage((prev) => {
//             const nextPage = prev + 1;
//             fetchMarkets(nextPage);
//             return nextPage;
//           });
//         }
//       });

//       if (node) observer.current.observe(node);
//     },
//     [loading, hasMore],
//   );

//   const handleLike = async (id: string) => {
//     if (!address) return toast.error("Connect wallet to like!");

//     setPredictions((prev) =>
//       prev.map((p) =>
//         p.id === id
//           ? {
//               ...p,
//               isLiked: !p.isLiked,
//               likes: p.isLiked ? p.likes - 1 : p.likes + 1,
//             }
//           : p,
//       ),
//     );

//     try {
//       await fetch(`${API_URL}/social/like`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ user: address, marketId: id }),
//       });
//     } catch (e) {
//       console.error("Like failed", e);
//       toast.error("Failed to save like");
//     }
//   };

//   const handleRepost = async (id: string) => {
//     if (!address) return toast.error("Connect wallet to repost!");

//     setPredictions((prev) =>
//       prev.map((p) => (p.id === id ? { ...p, reposts: p.reposts + 1 } : p)),
//     );

//     try {
//       await fetch(`${API_URL}/social/repost`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ user: address, marketId: id }),
//       });
//       toast.success("Reposted to your profile!");
//     } catch (e) {
//       console.error("Repost failed", e);
//       toast.error("Failed to repost");
//     }
//   };

//   const handleComment = (id: string) => {
//     onViewMarket(id);
//   };

//   const getFilteredPredictions = () => {
//     if (activeTab === "active") return predictions.slice(0, 3);
//     return predictions;
//   };

//   if (initialLoading) {
//     return (
//       <div className="w-full max-w-2xl mx-auto py-20 text-center px-4">
//         <motion.div
//           animate={{ rotate: 360, scale: [1, 1.2, 1] }}
//           transition={{
//             rotate: { duration: 2, repeat: Infinity, ease: "linear" },
//             scale: { duration: 1, repeat: Infinity },
//           }}
//         >
//           <Sparkles className="w-10 h-10 text-[#1F87FC] mx-auto mb-4" />
//         </motion.div>
//         <motion.p
//           className="text-muted-foreground text-sm sm:text-base"
//           animate={{ opacity: [0.5, 1, 0.5] }}
//           transition={{ duration: 1.5, repeat: Infinity }}
//         >
//           Syncing with Starknet...
//         </motion.p>
//       </div>
//     );
//   }

//   return (
//     <div className="w-full max-w-2xl mx-auto px-3 sm:px-4 py-4 sm:py-6 space-y-4 sm:space-y-6 pb-24">
//       {/* Header */}
//       <motion.div
//         className="flex items-center justify-between mb-4 sm:mb-6"
//         initial={{ y: -20, opacity: 0 }}
//         animate={{ y: 0, opacity: 1 }}
//         transition={{ duration: 0.5, type: "spring" }}
//       >
//         <div className="flex items-center gap-2 sm:gap-3">
//           <motion.div
//             animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
//             transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
//           >
//             <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-[#1F87FC]" />
//           </motion.div>
//           <div>
//             <h1 className="text-base sm:text-xl font-semibold text-foreground leading-tight">
//               Home
//             </h1>
//             <p className="text-xs sm:text-sm text-muted-foreground">
//               Your personalized feed
//             </p>
//           </div>
//         </div>

//         <motion.div
//           className="flex items-center gap-2 bg-gradient-to-r from-orange-500/20 to-yellow-500/20 border border-orange-500/40 rounded-full px-3 sm:px-4 py-1.5 sm:py-2"
//           whileHover={{ scale: 1.05 }}
//           whileTap={{ scale: 0.95 }}
//         >
//           <motion.div
//             animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.2, 1] }}
//             transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
//           >
//             <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-400 fill-orange-400" />
//           </motion.div>
//         </motion.div>
//       </motion.div>

//       {/* Tabs */}
//       <div className="flex gap-1 sm:gap-2 border-b border-border relative">
//         <motion.button
//           onClick={() => setActiveTab("for-you")}
//           className={`flex-1 pb-2 sm:pb-3 px-2 sm:px-4 text-sm sm:text-base transition-all relative ${
//             activeTab === "for-you"
//               ? "text-[#1F87FC]"
//               : "text-muted-foreground hover:text-foreground"
//           }`}
//           whileHover={{ scale: 1.02 }}
//           whileTap={{ scale: 0.98 }}
//         >
//           <div className="flex items-center justify-center gap-1.5 sm:gap-2">
//             <motion.div
//               animate={
//                 activeTab === "for-you"
//                   ? { rotate: [0, 360], scale: [1, 1.2, 1] }
//                   : {}
//               }
//               transition={{ duration: 0.6 }}
//             >
//               <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
//             </motion.div>
//             <span>For You</span>
//           </div>
//           {activeTab === "for-you" && (
//             <motion.div
//               className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#1F87FC] to-transparent"
//               layoutId="activeTab"
//               transition={{ type: "spring", stiffness: 500, damping: 30 }}
//             />
//           )}
//         </motion.button>

//         <motion.button
//           onClick={() => setActiveTab("active")}
//           className={`flex-1 pb-2 sm:pb-3 px-2 sm:px-4 text-sm sm:text-base transition-all relative ${
//             activeTab === "active"
//               ? "text-[#1F87FC]"
//               : "text-muted-foreground hover:text-foreground"
//           }`}
//           whileHover={{ scale: 1.02 }}
//           whileTap={{ scale: 0.98 }}
//         >
//           <div className="flex items-center justify-center gap-1.5 sm:gap-2">
//             <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
//             <span>Active</span>
//           </div>
//           {activeTab === "active" && (
//             <motion.div
//               className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#1F87FC] to-transparent"
//               layoutId="activeTab"
//               transition={{ type: "spring", stiffness: 500, damping: 30 }}
//             />
//           )}
//         </motion.button>
//       </div>

//       {/* Cards */}
//       <div className="space-y-4 sm:space-y-6">
//         {getFilteredPredictions().length === 0 ? (
//           <motion.div
//             className="bg-[#0f0f1a] border border-[#1F87FC]/30 rounded-xl p-8 sm:p-12 text-center"
//             initial={{ opacity: 0, scale: 0.9 }}
//             animate={{ opacity: 1, scale: 1 }}
//             transition={{ duration: 0.5 }}
//           >
//             <motion.div
//               animate={{ y: [0, -10, 0] }}
//               transition={{ duration: 2, repeat: Infinity }}
//             >
//               <Users className="w-10 h-10 sm:w-12 sm:h-12 text-muted-foreground mx-auto mb-4" />
//             </motion.div>
//             <h3 className="text-base sm:text-lg text-foreground mb-2">
//               No markets found
//             </h3>
//             <p className="text-xs sm:text-sm text-muted-foreground">
//               Go to "Create" to launch the first market!
//             </p>
//           </motion.div>
//         ) : (
//           getFilteredPredictions().map((prediction, index) => {
//             const isLast = index === getFilteredPredictions().length - 1;

//             return (
//               <motion.div
//                 key={prediction.id}
//                 ref={isLast ? lastElementRef : undefined}
//                 initial={{ opacity: 0, y: 20, scale: 0.95 }}
//                 animate={{ opacity: 1, y: 0, scale: 1 }}
//                 transition={{
//                   duration: 0.4,
//                   delay: Math.min(index * 0.1, 0.3),
//                   type: "spring",
//                   stiffness: 300,
//                   damping: 25,
//                 }}
//                 whileHover={{ scale: 1.01 }}
//                 whileTap={{ scale: 0.99 }}
//               >
//                 <PredictionCard
//                   prediction={prediction}
//                   onLike={() => handleLike(prediction.id)}
//                   onComment={() => handleComment(prediction.id)}
//                   onRepost={() => handleRepost(prediction.id)}
//                   onClick={() => onViewMarket(prediction.id)}
//                 />
//               </motion.div>
//             );
//           })
//         )}

//         {/* Loading more */}
//         <AnimatePresence>
//           {loading && hasMore && (
//             <motion.div
//               className="py-4 flex flex-col items-center gap-2"
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//             >
//               <motion.div
//                 animate={{ rotate: 360 }}
//                 transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
//               >
//                 <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 text-[#1F87FC]" />
//               </motion.div>
//               <motion.p
//                 className="text-xs text-muted-foreground"
//                 animate={{ opacity: [0.5, 1, 0.5] }}
//                 transition={{ duration: 1.5, repeat: Infinity }}
//               >
//                 Loading more predictions...
//               </motion.p>
//             </motion.div>
//           )}
//         </AnimatePresence>

//         {/* End of feed */}
//         <AnimatePresence>
//           {!hasMore && predictions.length > 0 && (
//             <motion.div
//               className="py-6 sm:py-8 text-center"
//               initial={{ opacity: 0, scale: 0.8 }}
//               animate={{ opacity: 1, scale: 1 }}
//               exit={{ opacity: 0 }}
//             >
//               <motion.div
//                 animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.2, 1] }}
//                 transition={{ duration: 0.6 }}
//                 className="inline-block mb-2"
//               >
//                 <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-[#1F87FC] mx-auto" />
//               </motion.div>
//               <p className="text-xs text-muted-foreground">
//                 You're all caught up! 🎉
//               </p>
//               <p className="text-xs text-muted-foreground/60 mt-1">
//                 Come back later for more predictions
//               </p>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </div>
//     </div>
//   );
// }

import { useState, useEffect, useRef, useCallback } from "react";
import { PredictionCard } from "./PredictionCard";
import { Sparkles, Users, Loader2, TrendingUp, Zap } from "lucide-react";
import { Prediction } from "../types/prediction";
import { mapMarketToPrediction, ApiMarket } from "../lib/marketMapper";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../hooks/useAuth";
import { toast } from "sonner";

const PAGE_SIZE = 5;

const API_URL =
  import.meta.env.VITE_INDEXER_SERVER_URL ||
  "https://starknet-indexer-apibara-mainnet.onrender.com";

interface HomeFeedProps {
  onViewMarket: (id: string) => void;
}

type FeedTab = "for-you" | "active";

export function HomeFeed({ onViewMarket }: HomeFeedProps) {
  const { address } = useAuth();

  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [activeTab, setActiveTab] = useState<FeedTab>("for-you");

  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);

  const observer = useRef<IntersectionObserver | null>(null);

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
    setPage(0);
    setHasMore(true);
    fetchMarkets(0);
  }, [address]);

  // Memoize filtered predictions to avoid double-calling in render
  const filteredPredictions =
    activeTab === "active" ? predictions.slice(0, 3) : predictions;

  const lastElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore && activeTab === "for-you") {
          setPage((prev) => {
            const nextPage = prev + 1;
            fetchMarkets(nextPage);
            return nextPage;
          });
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore, activeTab],
  );

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
      console.error("Like failed", e);
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
      toast.success("Reposted to your profile!");
    } catch (e) {
      console.error("Repost failed", e);
      toast.error("Failed to repost");
    }
  };

  const handleComment = (id: string) => {
    onViewMarket(id);
  };

  if (initialLoading) {
    return (
      <div className="w-full max-w-2xl mx-auto py-16 text-center px-4">
        <motion.div
          animate={{ rotate: 360, scale: [1, 1.2, 1] }}
          transition={{
            rotate: { duration: 2, repeat: Infinity, ease: "linear" },
            scale: { duration: 1, repeat: Infinity },
          }}
        >
          <Sparkles className="w-8 h-8 text-[#1F87FC] mx-auto mb-4" />
        </motion.div>
        <motion.p
          className="text-muted-foreground text-sm"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          Syncing with Starknet...
        </motion.p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto px-3 sm:px-4 py-4 sm:py-6 space-y-4 pb-24 overflow-x-hidden">
      {/* Header */}
      <motion.div
        className="flex items-center justify-between"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, type: "spring" }}
      >
        <div className="flex items-center gap-2">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            <Sparkles className="w-6 h-6 text-[#1F87FC]" />
          </motion.div>
          <div>
            <h1 className="text-base sm:text-lg font-semibold text-foreground leading-tight">
              Home
            </h1>
            <p className="text-xs text-muted-foreground">
              Your personalized feed
            </p>
          </div>
        </div>

        <motion.div
          className="flex items-center gap-1.5 bg-gradient-to-r from-orange-500/20 to-yellow-500/20 border border-orange-500/40 rounded-full px-3 py-1.5"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.2, 1] }}
            transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
          >
            <Zap className="w-3.5 h-3.5 text-orange-400 fill-orange-400" />
          </motion.div>
          <span className="text-xs text-orange-400 font-medium hidden sm:inline">
            Live
          </span>
        </motion.div>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-border">
        {(["for-you", "active"] as FeedTab[]).map((tab) => (
          <motion.button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 pb-2.5 px-2 text-sm transition-all relative ${
              activeTab === tab
                ? "text-[#1F87FC]"
                : "text-muted-foreground hover:text-foreground"
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center justify-center gap-1.5">
              {tab === "for-you" ? (
                <motion.div
                  animate={
                    activeTab === "for-you"
                      ? { rotate: [0, 360], scale: [1, 1.2, 1] }
                      : {}
                  }
                  transition={{ duration: 0.6 }}
                >
                  <Sparkles className="w-3.5 h-3.5 flex-shrink-0" />
                </motion.div>
              ) : (
                <Users className="w-3.5 h-3.5 flex-shrink-0" />
              )}
              <span>{tab === "for-you" ? "For You" : "Active"}</span>
            </div>
            {activeTab === tab && (
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#1F87FC] to-transparent"
                layoutId="activeTab"
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
          </motion.button>
        ))}
      </div>

      {/* Cards */}
      <div className="space-y-3 sm:space-y-4">
        {filteredPredictions.length === 0 ? (
          <motion.div
            className="bg-[#0f0f1a] border border-[#1F87FC]/30 rounded-xl p-8 text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Users className="w-10 h-10 text-muted-foreground mx-auto mb-4" />
            </motion.div>
            <h3 className="text-base text-foreground mb-2">No markets found</h3>
            <p className="text-xs text-muted-foreground">
              Go to "Create" to launch the first market!
            </p>
          </motion.div>
        ) : (
          filteredPredictions.map((prediction, index) => {
            const isLast =
              activeTab === "for-you" &&
              index === filteredPredictions.length - 1;

            return (
              <motion.div
                key={prediction.id}
                ref={isLast ? lastElementRef : undefined}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.3,
                  delay: Math.min(index * 0.08, 0.25),
                  type: "spring",
                  stiffness: 300,
                  damping: 25,
                }}
                style={{ willChange: "opacity, transform" }}
              >
                <PredictionCard
                  prediction={prediction}
                  onLike={() => handleLike(prediction.id)}
                  onComment={() => handleComment(prediction.id)}
                  onRepost={() => handleRepost(prediction.id)}
                  onClick={() => onViewMarket(prediction.id)}
                />
              </motion.div>
            );
          })
        )}

        {/* Loading more */}
        <AnimatePresence>
          {loading && hasMore && activeTab === "for-you" && (
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
                <Loader2 className="w-5 h-5 text-[#1F87FC]" />
              </motion.div>
              <p className="text-xs text-muted-foreground">
                Loading more predictions...
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* End of feed */}
        <AnimatePresence>
          {!hasMore && predictions.length > 0 && activeTab === "for-you" && (
            <motion.div
              className="py-6 text-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.2, 1] }}
                transition={{ duration: 0.6 }}
                className="inline-block mb-2"
              >
                <TrendingUp className="w-5 h-5 text-[#1F87FC] mx-auto" />
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
