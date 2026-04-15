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

// // 🟢 1. Added "live" to the FeedTab types
// type FeedTab = "for-you" | "active" | "live";

// export function HomeFeed({ onViewMarket }: HomeFeedProps) {
//   const { address } = useAuth();

//   const [predictions, setPredictions] = useState<Prediction[]>([]);
//   const [activeTab, setActiveTab] = useState<FeedTab>("for-you");

//   const [page, setPage] = useState(0);
//   const [loading, setLoading] = useState(false);
//   const [initialLoading, setInitialLoading] = useState(true);
//   const [hasMore, setHasMore] = useState(true);

//   const observer = useRef<IntersectionObserver | null>(null);

//   // 🟢 2. Pass currentTab into the fetcher so it knows what URL to build
//   const fetchMarkets = async (pageIndex: number, currentTab: FeedTab) => {
//     setLoading(true);
//     try {
//       const offset = pageIndex * PAGE_SIZE;
//       const userParam = address ? `&user=${address}` : "";

//       // Build the base URL
//       let url = `${API_URL}/markets?limit=${PAGE_SIZE}&offset=${offset}${userParam}`;

//       // Append specific filters based on the tab
//       if (currentTab === "live") {
//         url += "&category=live";
//       } else if (currentTab === "active") {
//         url += "&sort=trending"; // Example: sort active by trending
//       }

//       const res = await fetch(url);
//       const data: ApiMarket[] = await res.json();
//       const formattedData = data.map(mapMarketToPrediction);

//       setPredictions((prev) => {
//         // If we are on page 0, completely replace the feed. Otherwise, append.
//         const baseArray = pageIndex === 0 ? [] : prev;
//         const existingIds = new Set(baseArray.map((p) => p.id));
//         const uniqueNew = formattedData.filter((p) => !existingIds.has(p.id));
//         return [...baseArray, ...uniqueNew];
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

//   // 🟢 3. Trigger re-fetch whenever the tab changes
//   useEffect(() => {
//     setInitialLoading(true); // Show the big spinner when switching major views
//     setPredictions([]);
//     setPage(0);
//     setHasMore(true);
//     fetchMarkets(0, activeTab);
//   }, [address, activeTab]);

//   const filteredPredictions =
//     activeTab === "active" ? predictions.slice(0, 3) : predictions;

//   const lastElementRef = useCallback(
//     (node: HTMLDivElement | null) => {
//       if (loading) return;
//       if (observer.current) observer.current.disconnect();

//       observer.current = new IntersectionObserver((entries) => {
//         // 🟢 4. Allow pagination for both "for-you" and "live" feeds
//         if (entries[0].isIntersecting && hasMore && activeTab !== "active") {
//           setPage((prev) => {
//             const nextPage = prev + 1;
//             fetchMarkets(nextPage, activeTab);
//             return nextPage;
//           });
//         }
//       });

//       if (node) observer.current.observe(node);
//     },
//     [loading, hasMore, activeTab],
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

//   if (initialLoading) {
//     return (
//       <div className="w-full max-w-2xl mx-auto py-16 text-center px-4">
//         <motion.div
//           animate={{ rotate: 360, scale: [1, 1.2, 1] }}
//           transition={{
//             rotate: { duration: 2, repeat: Infinity, ease: "linear" },
//             scale: { duration: 1, repeat: Infinity },
//           }}
//         >
//           <Sparkles className="w-8 h-8 text-[#1F87FC] mx-auto mb-4" />
//         </motion.div>
//         <motion.p
//           className="text-muted-foreground text-sm"
//           animate={{ opacity: [0.5, 1, 0.5] }}
//           transition={{ duration: 1.5, repeat: Infinity }}
//         >
//           {activeTab === "live"
//             ? "Connecting to Live Markets..."
//             : "Syncing with Starknet..."}
//         </motion.p>
//       </div>
//     );
//   }

//   return (
//     <div className="w-full max-w-2xl mx-auto px-3 sm:px-4 py-4 sm:py-6 space-y-4 pb-24 overflow-x-hidden">
//       {/* Header */}
//       <motion.div
//         className="flex items-center justify-between"
//         initial={{ y: -20, opacity: 0 }}
//         animate={{ y: 0, opacity: 1 }}
//         transition={{ duration: 0.5, type: "spring" }}
//       >
//         <div className="flex items-center gap-2">
//           <motion.div
//             animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
//             transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
//           >
//             <Sparkles className="w-6 h-6 text-[#1F87FC]" />
//           </motion.div>
//           <div>
//             <h1 className="text-base sm:text-lg font-semibold text-foreground leading-tight">
//               {activeTab === "live" ? "Live Trading" : "Home"}
//             </h1>
//             <p className="text-xs text-muted-foreground">
//               {activeTab === "live"
//                 ? "High-speed crypto markets"
//                 : "Your personalized feed"}
//             </p>
//           </div>
//         </div>

//         {/* 🟢 The Live Terminal Toggle with attention-grabbing pulse */}
//         <motion.button
//           onClick={() =>
//             setActiveTab(activeTab === "live" ? "for-you" : "live")
//           }
//           className={`relative flex items-center gap-1.5 sm:gap-2 rounded-full px-3 sm:px-4 py-1.5 transition-all ${
//             activeTab === "live"
//               ? "bg-orange-500/30 border border-orange-500/60 shadow-[0_0_15px_rgba(249,115,22,0.3)]"
//               : "bg-gradient-to-r from-orange-500/10 to-yellow-500/10 border border-orange-500/30 hover:border-orange-500/50"
//           }`}
//           whileHover={{ scale: 1.05 }}
//           whileTap={{ scale: 0.95 }}
//         >
//           {/* Pulsing Dot: Only shows when they AREN'T on the live tab */}
//           {activeTab !== "live" && (
//             <span className="absolute -top-1 -right-1 flex h-3 w-3">
//               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
//               <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500 border-2 border-[#0a0b0f]"></span>
//             </span>
//           )}

//           <motion.div
//             animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.2, 1] }}
//             transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
//           >
//             <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-400 fill-orange-400" />
//           </motion.div>
//           <span className="text-xs sm:text-sm text-orange-400 font-bold tracking-wider">
//             LIVE
//           </span>
//         </motion.button>
//       </motion.div>

//       {/* Tabs */}
//       <div className="flex gap-1 border-b border-border">
//         {(["for-you", "active"] as FeedTab[]).map((tab) => (
//           <motion.button
//             key={tab}
//             onClick={() => setActiveTab(tab)}
//             className={`flex-1 pb-2.5 px-2 text-sm transition-all relative ${
//               activeTab === tab
//                 ? "text-[#1F87FC]"
//                 : "text-muted-foreground hover:text-foreground"
//             }`}
//             whileHover={{ scale: 1.02 }}
//             whileTap={{ scale: 0.98 }}
//           >
//             <div className="flex items-center justify-center gap-1.5">
//               {tab === "for-you" ? (
//                 <motion.div
//                   animate={
//                     activeTab === "for-you"
//                       ? { rotate: [0, 360], scale: [1, 1.2, 1] }
//                       : {}
//                   }
//                   transition={{ duration: 0.6 }}
//                 >
//                   <Sparkles className="w-3.5 h-3.5 flex-shrink-0" />
//                 </motion.div>
//               ) : (
//                 <Users className="w-3.5 h-3.5 flex-shrink-0" />
//               )}
//               <span>{tab === "for-you" ? "For You" : "Active"}</span>
//             </div>
//             {activeTab === tab && (
//               <motion.div
//                 className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#1F87FC] to-transparent"
//                 layoutId="activeTab"
//                 transition={{ type: "spring", stiffness: 500, damping: 30 }}
//               />
//             )}
//           </motion.button>
//         ))}
//       </div>

//       {/* Cards */}
//       <div className="space-y-3 sm:space-y-4">
//         {filteredPredictions.length === 0 ? (
//           <motion.div
//             className="bg-[#0f0f1a] border border-[#1F87FC]/30 rounded-xl p-8 text-center"
//             initial={{ opacity: 0, scale: 0.9 }}
//             animate={{ opacity: 1, scale: 1 }}
//             transition={{ duration: 0.5 }}
//           >
//             <motion.div
//               animate={{ y: [0, -10, 0] }}
//               transition={{ duration: 2, repeat: Infinity }}
//             >
//               <Users className="w-10 h-10 text-muted-foreground mx-auto mb-4" />
//             </motion.div>
//             <h3 className="text-base text-foreground mb-2">No markets found</h3>
//             <p className="text-xs text-muted-foreground">
//               {activeTab === "live"
//                 ? "Waiting for the Oracle to deploy..."
//                 : "Go to 'Create' to launch the first market!"}
//             </p>
//           </motion.div>
//         ) : (
//           filteredPredictions.map((prediction, index) => {
//             const isLast = index === filteredPredictions.length - 1;

//             return (
//               <motion.div
//                 key={prediction.id}
//                 ref={isLast ? lastElementRef : undefined}
//                 initial={{ opacity: 0, y: 16 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{
//                   duration: 0.3,
//                   delay: Math.min(index * 0.08, 0.25),
//                   type: "spring",
//                   stiffness: 300,
//                   damping: 25,
//                 }}
//                 style={{ willChange: "opacity, transform" }}
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
//           {loading && hasMore && activeTab !== "active" && (
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
//                 <Loader2 className="w-5 h-5 text-[#1F87FC]" />
//               </motion.div>
//               <p className="text-xs text-muted-foreground">
//                 Loading more predictions...
//               </p>
//             </motion.div>
//           )}
//         </AnimatePresence>

//         {/* End of feed */}
//         <AnimatePresence>
//           {!hasMore && predictions.length > 0 && activeTab !== "active" && (
//             <motion.div
//               className="py-6 text-center"
//               initial={{ opacity: 0, scale: 0.8 }}
//               animate={{ opacity: 1, scale: 1 }}
//               exit={{ opacity: 0 }}
//             >
//               <motion.div
//                 animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.2, 1] }}
//                 transition={{ duration: 0.6 }}
//                 className="inline-block mb-2"
//               >
//                 <TrendingUp className="w-5 h-5 text-[#1F87FC] mx-auto" />
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

type FeedTab = "for-you" | "active" | "live";

const TABS: { id: FeedTab; label: string; icon: React.ReactNode }[] = [
  {
    id: "for-you",
    label: "For you",
    icon: <Sparkles style={{ width: 12, height: 12 }} />,
  },
  {
    id: "active",
    label: "Active",
    icon: <Users style={{ width: 12, height: 12 }} />,
  },
];

export function HomeFeed({ onViewMarket }: HomeFeedProps) {
  const { address } = useAuth();
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [activeTab, setActiveTab] = useState<FeedTab>("for-you");
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver | null>(null);

  const fetchMarkets = async (pageIndex: number, currentTab: FeedTab) => {
    setLoading(true);
    try {
      const offset = pageIndex * PAGE_SIZE;
      const userParam = address ? `&user=${address}` : "";
      let url = `${API_URL}/markets?limit=${PAGE_SIZE}&offset=${offset}${userParam}`;
      if (currentTab === "live") url += "&category=live";
      else if (currentTab === "active") url += "&sort=trending";

      const res = await fetch(url);
      const data: ApiMarket[] = await res.json();
      const formattedData = data.map(mapMarketToPrediction);

      setPredictions((prev) => {
        const baseArray = pageIndex === 0 ? [] : prev;
        const existingIds = new Set(baseArray.map((p) => p.id));
        const uniqueNew = formattedData.filter((p) => !existingIds.has(p.id));
        return [...baseArray, ...uniqueNew];
      });
      if (formattedData.length < PAGE_SIZE) setHasMore(false);
    } catch (error) {
      console.error("Failed to fetch markets:", error);
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    setInitialLoading(true);
    setPredictions([]);
    setPage(0);
    setHasMore(true);
    fetchMarkets(0, activeTab);
  }, [address, activeTab]);

  const filteredPredictions =
    activeTab === "active" ? predictions.slice(0, 3) : predictions;

  const lastElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore && activeTab !== "active") {
          setPage((prev) => {
            const nextPage = prev + 1;
            fetchMarkets(nextPage, activeTab);
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

  // ── Initial loading state ──
  if (initialLoading) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "80px 24px",
          gap: 12,
          fontFamily: "inherit",
        }}
      >
        <Sparkles
          style={{
            width: 22,
            height: 22,
            color: "#1F87FC",
            animation: "spin 2s linear infinite",
          }}
        />
        <span style={{ fontSize: 13, color: "#4a5568" }}>
          {activeTab === "live"
            ? "Connecting to live markets…"
            : "Syncing with Starknet…"}
        </span>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div
      className="w-full max-w-2xl mx-auto px-3 sm:px-4 py-4 pb-24"
      style={{
        fontFamily: "inherit",
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      <style>{`@keyframes spin { to { transform: rotate(360deg); } } @keyframes ping { 0%,100%{transform:scale(1);opacity:1} 75%{transform:scale(1.8);opacity:0} }`}</style>

      {/* ── Header ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
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
            <Sparkles style={{ width: 15, height: 15, color: "#1F87FC" }} />
          </div>
          <div>
            <h1
              style={{
                fontSize: 17,
                fontWeight: 600,
                color: "#e2e8f0",
                margin: 0,
                lineHeight: 1.2,
              }}
            >
              {activeTab === "live" ? "Live trading" : "Home"}
            </h1>
            <p
              style={{
                fontSize: 11,
                color: "#4a5568",
                margin: 0,
                marginTop: 1,
              }}
            >
              {activeTab === "live"
                ? "High-speed crypto markets"
                : "Your personalised feed"}
            </p>
          </div>
        </div>

        {/* Live toggle */}
        <button
          onClick={() =>
            setActiveTab(activeTab === "live" ? "for-you" : "live")
          }
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "7px 12px",
            borderRadius: 99,
            border:
              activeTab === "live"
                ? "1px solid rgba(249,115,22,0.6)"
                : "1px solid rgba(249,115,22,0.3)",
            background:
              activeTab === "live"
                ? "rgba(249,115,22,0.15)"
                : "rgba(249,115,22,0.06)",
            cursor: "pointer",
            fontFamily: "inherit",
            transition: "all 0.15s",
          }}
        >
          {/* Ping dot — only when NOT on live tab */}
          {activeTab !== "live" && (
            <span
              style={{
                position: "absolute",
                top: -3,
                right: -3,
                width: 10,
                height: 10,
              }}
            >
              <span
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: "50%",
                  background: "rgba(249,115,22,0.7)",
                  animation: "ping 1.2s ease-in-out infinite",
                }}
              />
              <span
                style={{
                  position: "absolute",
                  inset: "2px",
                  borderRadius: "50%",
                  background: "#f97316",
                }}
              />
            </span>
          )}
          <Zap
            style={{ width: 13, height: 13, color: "#fb923c", fill: "#fb923c" }}
          />
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "#fb923c",
              letterSpacing: "0.06em",
            }}
          >
            GO LIVE
          </span>
        </button>
      </div>

      {/* ── Tabs ── */}
      <div
        style={{
          display: "flex",
          gap: 4,
          background: "#12121f",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: 12,
          padding: 4,
        }}
      >
        {TABS.map((tab) => {
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 5,
                padding: "8px 6px",
                borderRadius: 8,
                border: "none",
                fontSize: 12,
                fontWeight: active ? 600 : 400,
                fontFamily: "inherit",
                cursor: "pointer",
                transition: "all 0.15s",
                background: active ? "rgba(31,135,252,0.12)" : "transparent",
                color: active ? "#1F87FC" : "#4a5568",
                boxShadow: active
                  ? "inset 0 0 0 1px rgba(31,135,252,0.3)"
                  : "none",
              }}
            >
              <span
                style={{
                  color: active ? "#1F87FC" : "#4a5568",
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

      {/* ── Feed ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {filteredPredictions.length === 0 ? (
          <div
            style={{
              background: "#12121f",
              border: "1px solid rgba(31,135,252,0.12)",
              borderRadius: 16,
              padding: "48px 24px",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 10,
            }}
          >
            <Users style={{ width: 28, height: 28, color: "#3a4a5e" }} />
            <p style={{ fontSize: 14, color: "#64748b", margin: 0 }}>
              No markets found
            </p>
            <p style={{ fontSize: 12, color: "#3a4a5e", margin: 0 }}>
              {activeTab === "live"
                ? "Waiting for the oracle to deploy…"
                : "Go to Create to launch the first market!"}
            </p>
          </div>
        ) : (
          filteredPredictions.map((prediction, index) => {
            const isLast = index === filteredPredictions.length - 1;
            return (
              <motion.div
                key={prediction.id}
                ref={isLast ? lastElementRef : undefined}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.28,
                  delay: Math.min(index * 0.06, 0.2),
                  type: "spring",
                  stiffness: 320,
                  damping: 28,
                }}
                style={{ willChange: "opacity, transform" }}
              >
                <PredictionCard
                  prediction={prediction}
                  onLike={() => handleLike(prediction.id)}
                  onComment={() => onViewMarket(prediction.id)}
                  onRepost={() => handleRepost(prediction.id)}
                  onClick={() => onViewMarket(prediction.id)}
                />
              </motion.div>
            );
          })
        )}

        {/* Loading more */}
        <AnimatePresence>
          {loading && hasMore && activeTab !== "active" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 8,
                padding: "16px 0",
              }}
            >
              <Loader2
                style={{
                  width: 18,
                  height: 18,
                  color: "#1F87FC",
                  animation: "spin 0.8s linear infinite",
                }}
              />
              <span style={{ fontSize: 11, color: "#3a4a5e" }}>
                Loading more…
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* End of feed */}
        <AnimatePresence>
          {!hasMore && predictions.length > 0 && activeTab !== "active" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                padding: "16px 0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
              }}
            >
              <div
                style={{
                  flex: 1,
                  height: 1,
                  background: "rgba(255,255,255,0.04)",
                }}
              />
              <span
                style={{ fontSize: 11, color: "#3a4a5e", whiteSpace: "nowrap" }}
              >
                You're all caught up
              </span>
              <div
                style={{
                  flex: 1,
                  height: 1,
                  background: "rgba(255,255,255,0.04)",
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
