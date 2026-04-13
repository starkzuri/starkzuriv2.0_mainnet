// import { useState, useEffect } from "react";
// import {
//   Trophy,
//   Award,
//   Zap,
//   TrendingUp,
//   Target,
//   Flame,
//   Crown,
//   Star,
//   Loader2,
// } from "lucide-react";
// import { useAuth } from "../hooks/useAuth";

// const API_URL = import.meta.env.VITE_INDEXER_SERVER_URL;

// type RewardsTab = "overview" | "achievements" | "leaderboard";

// // 🟢 STATIC DATA: Level Thresholds & Achievement Definitions
// const LEVEL_THRESHOLDS = [
//   { level: 1, min: 0, max: 100, name: "Novice", color: "#6b7280" },
//   { level: 2, min: 100, max: 400, name: "Apprentice", color: "#1F87FC" },
//   { level: 3, min: 400, max: 900, name: "Trader", color: "#00ff88" },
//   { level: 4, min: 900, max: 1600, name: "Pro", color: "#ff3366" },
//   { level: 5, min: 1600, max: 2500, name: "Whale", color: "#9945FF" },
//   { level: 6, min: 2500, max: 10000, name: "Oracle", color: "#ffd700" },
// ];

// const ACHIEVEMENT_DEFS = [
//   {
//     id: "first_trade",
//     name: "First Blood",
//     description: "Place your first prediction",
//     xp: 50,
//     icon: "🗡️",
//     rarity: "common",
//     condition: (s: any) => s.tradesCount >= 1,
//   },
//   {
//     id: "trader",
//     name: "Market Mover",
//     description: "Place 10 trades",
//     xp: 150,
//     icon: "📈",
//     rarity: "rare",
//     condition: (s: any) => s.tradesCount >= 10,
//   },
//   {
//     id: "streak_3",
//     name: "Heating Up",
//     description: "Maintain a 3-day streak",
//     xp: 100,
//     icon: "🔥",
//     rarity: "rare",
//     condition: (s: any) => s.streak >= 3,
//   },
//   {
//     id: "streak_7",
//     name: "On Fire",
//     description: "Maintain a 7-day streak",
//     xp: 300,
//     icon: "⚡",
//     rarity: "epic",
//     condition: (s: any) => s.streak >= 7,
//   },
//   {
//     id: "whale",
//     name: "High Roller",
//     description: "Reach Level 5",
//     xp: 500,
//     icon: "🐋",
//     rarity: "legendary",
//     condition: (s: any) => s.level >= 5,
//   },
// ];

// const areAddressesEqual = (a: string | undefined, b: string | undefined) => {
//   if (!a || !b) return false;
//   try {
//     // Converts both to Big Integers (0x00abc == 0xabc)
//     return BigInt(a) === BigInt(b);
//   } catch (e) {
//     return false;
//   }
// };

// interface RewardsProps {
//   onViewProfile?: (address: string) => void; // Optional callback
// }

// export function Rewards({ onViewProfile }: RewardsProps) {
//   const { address } = useAuth();
//   const [activeTab, setActiveTab] = useState<RewardsTab>("overview");
//   const [loading, setLoading] = useState(false);

//   // 🟢 REAL STATE
//   const [userStats, setUserStats] = useState({
//     xp: 0,
//     level: 1,
//     streak: 0,
//     tradesCount: 0,
//   });

//   // 🟢 FIX: Initialize as empty array explicitly
//   const [leaderboard, setLeaderboard] = useState<any[]>([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       try {
//         // 1. Fetch Leaderboard (Safe Check)
//         const lbRes = await fetch(`${API_URL}/users/leaderboard`);
//         const lbData = await lbRes.json();

//         // 🟢 FIX: Only set if it is actually an array
//         if (Array.isArray(lbData)) {
//           setLeaderboard(lbData);
//         } else {
//           console.warn("Leaderboard API returned invalid format:", lbData);
//           setLeaderboard([]); // Fallback
//         }

//         // 2. Fetch User Stats (If connected)
//         if (address) {
//           const userRes = await fetch(`${API_URL}/users/${address}`);
//           const userData = await userRes.json();
//           // Safety check for user data too
//           if (!userData.error) {
//             setUserStats(userData);
//           }
//         }
//       } catch (err) {
//         console.error("Error fetching rewards data:", err);
//         setLeaderboard([]); // Ensure it doesn't crash on network error
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, [address]);

//   // --- CALCULATIONS ---
//   const currentLevelInfo =
//     LEVEL_THRESHOLDS.find((l) => userStats.level === l.level) ||
//     LEVEL_THRESHOLDS[0];
//   const nextLevelInfo = LEVEL_THRESHOLDS.find(
//     (l) => l.level === userStats.level + 1
//   );

//   let progressPercent = 100;
//   let xpToNext = 0;
//   if (nextLevelInfo) {
//     const range = nextLevelInfo.min - currentLevelInfo.min;
//     const progress = userStats.xp - currentLevelInfo.min;
//     progressPercent = Math.min(100, Math.max(0, (progress / range) * 100));
//     xpToNext = nextLevelInfo.min - userStats.xp;
//   }

//   const achievements = ACHIEVEMENT_DEFS.map((def) => ({
//     ...def,
//     completed: def.condition(userStats),
//     progress: def.condition(userStats) ? 100 : 0,
//   }));

//   const completedCount = achievements.filter((a) => a.completed).length;

//   // 🟢 FIX: Safe Find Index Function
//   const getUserRank = () => {
//     if (!Array.isArray(leaderboard) || leaderboard.length === 0) return "-";
//     if (!address) return "-";

//     const index = leaderboard.findIndex(
//       (u) => u.address?.toLowerCase() === address.toLowerCase()
//     );
//     return index !== -1 ? `#${index + 1}` : "-";
//   };

//   const getRarityColor = (rarity: string) => {
//     switch (rarity) {
//       case "common":
//         return "#6b6b7f";
//       case "rare":
//         return "#1F87FC";
//       case "epic":
//         return "#9333ea";
//       case "legendary":
//         return "#ffd700";
//       default:
//         return "#6b6b7f";
//     }
//   };

//   const getRarityBorder = (rarity: string) => {
//     const color = getRarityColor(rarity);
//     return { borderColor: `${color}40` };
//   };

//   const formatNumber = (num: number) => {
//     if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
//     if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
//     return num.toLocaleString();
//   };

//   if (loading && !userStats.xp) {
//     return (
//       <div className="flex justify-center p-20">
//         <Loader2 className="w-8 h-8 animate-spin text-[#1F87FC]" />
//       </div>
//     );
//   }

//   return (
//     <div className="w-full max-w-4xl mx-auto px-4 py-6 space-y-4 md:space-y-6 mb-20">
//       {/* Header */}
//       <div className="flex items-center gap-3">
//         <Trophy className="w-6 h-6 md:w-8 md:h-8 text-[#ffd700]" />
//         <div>
//           <h1 className="text-foreground text-xl md:text-2xl font-bold">
//             Rewards & Ranks
//           </h1>
//           <p className="text-xs md:text-sm text-muted-foreground">
//             Level up and earn achievements
//           </p>
//         </div>
//       </div>

//       {/* Tabs */}
//       <div className="flex gap-2 border-b border-border overflow-x-auto scrollbar-hide -mx-4 px-4">
//         {["overview", "achievements", "leaderboard"].map((tab) => (
//           <button
//             key={tab}
//             onClick={() => setActiveTab(tab as RewardsTab)}
//             className={`flex items-center gap-2 px-3 md:px-4 py-2 md:py-3 transition-all relative whitespace-nowrap flex-shrink-0 capitalize ${
//               activeTab === tab
//                 ? "text-[#1F87FC]"
//                 : "text-muted-foreground hover:text-foreground"
//             }`}
//           >
//             {tab === "overview" && <Star className="w-4 h-4" />}
//             {tab === "achievements" && <Award className="w-4 h-4" />}
//             {tab === "leaderboard" && <Trophy className="w-4 h-4" />}
//             <span className="text-xs md:text-sm">{tab}</span>
//             {activeTab === tab && (
//               <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1F87FC] shadow-[0_0_8px_rgba(31,135,252,0.8)]" />
//             )}
//           </button>
//         ))}
//       </div>

//       {/* 🟢 OVERVIEW TAB */}
//       {activeTab === "overview" && (
//         <div className="space-y-4 md:space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
//           {/* Level Card */}
//           <div className="bg-gradient-to-br from-[#1F87FC]/10 to-[#0f0f1a] border border-[#1F87FC]/40 rounded-xl p-4 md:p-6 shadow-lg shadow-[#1F87FC]/5">
//             <div className="flex items-start justify-between mb-4">
//               <div className="flex items-center gap-3">
//                 <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-[#1F87FC]/20 flex items-center justify-center border border-[#1F87FC]/50 text-2xl md:text-3xl">
//                   {userStats.level >= 5
//                     ? "🔮"
//                     : userStats.level >= 3
//                     ? "⚡"
//                     : "🌱"}
//                 </div>
//                 <div>
//                   <div className="text-lg md:text-2xl text-foreground font-bold">
//                     Level {userStats.level}
//                   </div>
//                   <div
//                     className="text-sm md:text-base font-bold"
//                     style={{ color: currentLevelInfo.color }}
//                   >
//                     {currentLevelInfo.name}
//                   </div>
//                 </div>
//               </div>
//               <div className="text-right">
//                 <div className="text-xl md:text-2xl text-[#1F87FC] font-mono">
//                   {formatNumber(userStats.xp)} XP
//                 </div>
//                 <div className="text-xs text-muted-foreground">
//                   {nextLevelInfo
//                     ? `${formatNumber(xpToNext)} to next level`
//                     : "Max Level Reached!"}
//                 </div>
//               </div>
//             </div>

//             {/* Progress Bar */}
//             <div>
//               <div className="flex items-center justify-between mb-2 text-xs md:text-sm text-muted-foreground">
//                 <span>Progress</span>
//                 <span>{Math.floor(progressPercent)}%</span>
//               </div>
//               <div className="w-full h-3 bg-[#1a1a24] rounded-full overflow-hidden border border-[#1F87FC]/30">
//                 <div
//                   className="h-full bg-gradient-to-r from-[#1F87FC] to-[#00ffcc] transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(31,135,252,0.5)]"
//                   style={{ width: `${progressPercent}%` }}
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Stats Grid */}
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
//             <div className="bg-[#0f0f1a] border border-[#ff3366]/40 rounded-xl p-4 flex flex-col justify-center items-center text-center">
//               <Flame className="w-6 h-6 text-[#ff3366] mb-2" />
//               <div className="text-2xl font-bold text-white">
//                 {userStats.streak}
//               </div>
//               <div className="text-xs text-muted-foreground">Day Streak</div>
//             </div>
//             <div className="bg-[#0f0f1a] border border-[#00ff88]/40 rounded-xl p-4 flex flex-col justify-center items-center text-center">
//               <Target className="w-6 h-6 text-[#00ff88] mb-2" />
//               <div className="text-2xl font-bold text-white">
//                 {completedCount}
//               </div>
//               <div className="text-xs text-muted-foreground">Achievements</div>
//             </div>
//             <div className="bg-[#0f0f1a] border border-[#1F87FC]/40 rounded-xl p-4 flex flex-col justify-center items-center text-center">
//               <TrendingUp className="w-6 h-6 text-[#1F87FC] mb-2" />
//               <div className="text-2xl font-bold text-white">
//                 {userStats.tradesCount}
//               </div>
//               <div className="text-xs text-muted-foreground">Trades Placed</div>
//             </div>
//             {/* 🟢 FIX: Safe Rank Display */}
//             <div className="bg-[#0f0f1a] border border-[#ffd700]/40 rounded-xl p-4 flex flex-col justify-center items-center text-center">
//               <Crown className="w-6 h-6 text-[#ffd700] mb-2" />
//               <div className="text-2xl font-bold text-white">
//                 {getUserRank()}
//               </div>
//               <div className="text-xs text-muted-foreground">Rank</div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* 🟢 ACHIEVEMENTS TAB */}
//       {activeTab === "achievements" && (
//         <div className="space-y-3 md:space-y-4 animate-in fade-in duration-300">
//           {achievements
//             // 🟢 Sort: Unlocked First
//             .sort((a, b) =>
//               a.completed === b.completed ? 0 : a.completed ? -1 : 1
//             )
//             .map((achievement) => (
//               <div
//                 key={achievement.id}
//                 className={`bg-[#0f0f1a] border rounded-xl p-4 md:p-6 transition-all relative overflow-hidden ${
//                   achievement.completed
//                     ? "opacity-100 bg-[#1F87FC]/5 shadow-[0_0_15px_rgba(31,135,252,0.1)]"
//                     : "opacity-75 bg-[#0a0a0f]" // Darker background for locked
//                 }`}
//                 style={getRarityBorder(achievement.rarity)}
//               >
//                 {/* Visual Flair for Unlocked */}
//                 {achievement.completed && (
//                   <div className="absolute top-0 right-0 p-2 opacity-10">
//                     <Trophy className="w-24 h-24 rotate-12" />
//                   </div>
//                 )}

//                 <div className="flex items-start gap-4 relative z-10">
//                   {/* Icon: Grayscale if locked, Color if unlocked */}
//                   <div
//                     className={`text-3xl md:text-4xl transition-all duration-500 ${
//                       !achievement.completed
//                         ? "grayscale opacity-50"
//                         : "grayscale-0 scale-110"
//                     }`}
//                   >
//                     {achievement.icon}
//                   </div>

//                   <div className="flex-1 min-w-0">
//                     <div className="flex flex-wrap items-center gap-2 mb-1">
//                       <h3
//                         className={`font-bold ${
//                           achievement.completed ? "text-white" : "text-gray-400"
//                         }`}
//                       >
//                         {achievement.name}
//                       </h3>

//                       {/* Rarity Badge */}
//                       <span
//                         className="text-[10px] uppercase font-bold px-2 py-0.5 rounded border"
//                         style={{
//                           color: getRarityColor(achievement.rarity),
//                           borderColor: `${getRarityColor(
//                             achievement.rarity
//                           )}40`,
//                           backgroundColor: `${getRarityColor(
//                             achievement.rarity
//                           )}10`,
//                         }}
//                       >
//                         {achievement.rarity}
//                       </span>

//                       {/* 🟢 STATUS BADGE */}
//                       {achievement.completed ? (
//                         <span className="text-[10px] uppercase font-bold px-2 py-0.5 bg-[#00ff88]/20 text-[#00ff88] border border-[#00ff88]/40 rounded flex items-center gap-1 shadow-[0_0_10px_rgba(0,255,136,0.2)]">
//                           <Zap className="w-3 h-3 fill-current" /> Unlocked
//                         </span>
//                       ) : (
//                         <span className="text-[10px] uppercase font-bold px-2 py-0.5 bg-gray-800 text-gray-400 border border-gray-700 rounded flex items-center gap-1">
//                           <div className="w-3 h-3 rounded-full border border-gray-500 flex items-center justify-center">
//                             <div className="w-1.5 h-1.5 bg-gray-500 rounded-full" />
//                           </div>
//                           Locked
//                         </span>
//                       )}
//                     </div>

//                     <p className="text-sm text-muted-foreground mb-3">
//                       {achievement.description}
//                     </p>

//                     {/* 🟢 PROGRESS BAR (Only for locked items) */}
//                     {!achievement.completed && (
//                       <div className="w-full max-w-[200px]">
//                         <div className="flex justify-between text-[10px] text-gray-500 mb-1 uppercase font-bold">
//                           <span>Progress</span>
//                           <span>{Math.floor(achievement.progress)}%</span>
//                         </div>
//                         <div className="h-1.5 w-full bg-[#1a1a24] rounded-full overflow-hidden border border-white/10">
//                           <div
//                             className="h-full bg-gray-600 rounded-full"
//                             style={{ width: `${achievement.progress}%` }}
//                           ></div>
//                         </div>
//                       </div>
//                     )}
//                   </div>

//                   <div className="text-right">
//                     <div
//                       className={`font-bold ${
//                         achievement.completed
//                           ? "text-[#1F87FC]"
//                           : "text-gray-600"
//                       }`}
//                     >
//                       +{achievement.xp} XP
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//         </div>
//       )}

//       {/* LEADERBOARD TAB */}

//       {/* LEADERBOARD TAB */}
//       {activeTab === "leaderboard" && (
//         <div className="space-y-3 animate-in fade-in duration-300">
//           {!leaderboard || leaderboard.length === 0 ? (
//             <div className="text-center py-10 text-muted-foreground">
//               No data yet. Be the first to trade!
//             </div>
//           ) : (
//             leaderboard.map((user, index) => {
//               const isCurrentUser = areAddressesEqual(user.address, address);
//               const rank = index + 1;

//               // 🟢 LOGIC: Use Profile Data if available, else default to Address
//               const hasProfile = user.displayName || user.username;

//               const displayName = user.displayName
//                 ? user.displayName
//                 : user.username
//                 ? user.username
//                 : `${user.address.slice(0, 6)}...${user.address.slice(-4)}`;

//               const subText =
//                 user.username && user.displayName
//                   ? user.username // If display name exists, show @username below
//                   : !hasProfile
//                   ? "No Profile Set"
//                   : `${user.address.slice(0, 6)}...${user.address.slice(-4)}`; // Else show address

//               // Use custom avatar if set, otherwise generate one
//               const avatarUrl = user.avatarUrl
//                 ? user.avatarUrl
//                 : "https://api.dicebear.com/7.x/identicon/svg?seed=" +
//                   user.address;

//               return (
//                 <div
//                   key={user.address}
//                   onClick={() => {
//                     if (onViewProfile) onViewProfile(user.address);
//                   }}
//                   className={`bg-[#0f0f1a] border rounded-lg p-3 md:p-4 flex items-center gap-3 md:gap-4 transition-all hover:border-[#1F87FC]/60 ${
//                     isCurrentUser
//                       ? "border-[#1F87FC] border-2 bg-[#1F87FC]/20 shadow-[0_0_20px_rgba(31,135,252,0.2)]"
//                       : "border-white/10"
//                   }`}
//                 >
//                   {/* Rank Badge */}
//                   <div className="flex-shrink-0 w-8 text-center font-bold">
//                     {rank === 1 && <span className="text-2xl">🥇</span>}
//                     {rank === 2 && <span className="text-2xl">🥈</span>}
//                     {rank === 3 && <span className="text-2xl">🥉</span>}
//                     {rank > 3 && <span className="text-gray-500">#{rank}</span>}
//                   </div>

//                   {/* Avatar */}
//                   <img
//                     src={avatarUrl}
//                     alt="avatar"
//                     className="w-10 h-10 rounded-full border border-white/20 bg-black object-cover"
//                   />

//                   {/* Name & Info */}
//                   <div className="flex-1 min-w-0">
//                     <div className="flex items-center gap-2">
//                       <span
//                         className={`text-sm font-bold truncate ${
//                           isCurrentUser ? "text-[#1F87FC]" : "text-white"
//                         }`}
//                       >
//                         {displayName}
//                       </span>
//                       {isCurrentUser && (
//                         <span className="text-[10px] bg-[#1F87FC] text-white px-1.5 py-0.5 rounded font-bold">
//                           YOU
//                         </span>
//                       )}
//                     </div>

//                     {/* Subtext: Username or Address */}
//                     <div className="text-xs text-muted-foreground mb-1 truncate">
//                       {subText}
//                     </div>

//                     {/* Stats Row */}
//                     <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5 border-t border-white/5 pt-1">
//                       <span className="flex items-center gap-1 text-[#00ff88]">
//                         <Zap className="w-3 h-3" /> Lvl {user.level}
//                       </span>
//                       <span className="flex items-center gap-1">
//                         <TrendingUp className="w-3 h-3" />{" "}
//                         {user.tradesCount || 0} Trades
//                       </span>
//                     </div>
//                   </div>

//                   {/* XP */}
//                   <div className="text-right">
//                     <div className="text-[#1F87FC] font-mono font-bold text-sm md:text-base">
//                       {formatNumber(user.xp)} XP
//                     </div>
//                   </div>
//                 </div>
//               );
//             })
//           )}
//         </div>
//       )}
//     </div>
//   );
// }

import { useState, useEffect } from "react";
import {
  Trophy,
  Award,
  Zap,
  TrendingUp,
  Target,
  Flame,
  Crown,
  Star,
  Loader2,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";

const API_URL = import.meta.env.VITE_INDEXER_SERVER_URL;

type RewardsTab = "overview" | "achievements" | "leaderboard";

const LEVEL_THRESHOLDS = [
  { level: 1, min: 0, max: 100, name: "Novice", color: "#64748b" },
  { level: 2, min: 100, max: 400, name: "Apprentice", color: "#1F87FC" },
  { level: 3, min: 400, max: 900, name: "Trader", color: "#00ff88" },
  { level: 4, min: 900, max: 1600, name: "Pro", color: "#ff3366" },
  { level: 5, min: 1600, max: 2500, name: "Whale", color: "#9945FF" },
  { level: 6, min: 2500, max: 10000, name: "Oracle", color: "#ffd700" },
];

const ACHIEVEMENT_DEFS = [
  {
    id: "first_trade",
    name: "First blood",
    description: "Place your first prediction",
    xp: 50,
    icon: "🗡️",
    rarity: "common",
    condition: (s: any) => s.tradesCount >= 1,
  },
  {
    id: "trader",
    name: "Market mover",
    description: "Place 10 trades",
    xp: 150,
    icon: "📈",
    rarity: "rare",
    condition: (s: any) => s.tradesCount >= 10,
  },
  {
    id: "streak_3",
    name: "Heating up",
    description: "Maintain a 3-day streak",
    xp: 100,
    icon: "🔥",
    rarity: "rare",
    condition: (s: any) => s.streak >= 3,
  },
  {
    id: "streak_7",
    name: "On fire",
    description: "Maintain a 7-day streak",
    xp: 300,
    icon: "⚡",
    rarity: "epic",
    condition: (s: any) => s.streak >= 7,
  },
  {
    id: "whale",
    name: "High roller",
    description: "Reach Level 5",
    xp: 500,
    icon: "🐋",
    rarity: "legendary",
    condition: (s: any) => s.level >= 5,
  },
];

const RARITY_COLORS: Record<string, string> = {
  common: "#64748b",
  rare: "#1F87FC",
  epic: "#9333ea",
  legendary: "#ffd700",
};

const areAddressesEqual = (a?: string, b?: string) => {
  if (!a || !b) return false;
  try {
    return BigInt(a) === BigInt(b);
  } catch {
    return false;
  }
};

const formatNumber = (num: number) => {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return num.toLocaleString();
};

interface RewardsProps {
  onViewProfile?: (address: string) => void;
}

const TABS: { id: RewardsTab; label: string; icon: React.ReactNode }[] = [
  {
    id: "overview",
    label: "Overview",
    icon: <Star style={{ width: 13, height: 13 }} />,
  },
  {
    id: "achievements",
    label: "Achievements",
    icon: <Award style={{ width: 13, height: 13 }} />,
  },
  {
    id: "leaderboard",
    label: "Leaderboard",
    icon: <Trophy style={{ width: 13, height: 13 }} />,
  },
];

export function Rewards({ onViewProfile }: RewardsProps) {
  const { address } = useAuth();
  const [activeTab, setActiveTab] = useState<RewardsTab>("overview");
  const [loading, setLoading] = useState(false);
  const [userStats, setUserStats] = useState({
    xp: 0,
    level: 1,
    streak: 0,
    tradesCount: 0,
  });
  const [leaderboard, setLeaderboard] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const lbRes = await fetch(`${API_URL}/users/leaderboard`);
        const lbData = await lbRes.json();
        if (Array.isArray(lbData)) setLeaderboard(lbData);
        else setLeaderboard([]);

        if (address) {
          const userRes = await fetch(`${API_URL}/users/${address}`);
          const userData = await userRes.json();
          if (!userData.error) setUserStats(userData);
        }
      } catch (err) {
        console.error("Error fetching rewards data:", err);
        setLeaderboard([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [address]);

  const currentLevelInfo =
    LEVEL_THRESHOLDS.find((l) => userStats.level === l.level) ||
    LEVEL_THRESHOLDS[0];
  const nextLevelInfo = LEVEL_THRESHOLDS.find(
    (l) => l.level === userStats.level + 1,
  );

  let progressPercent = 100;
  let xpToNext = 0;
  if (nextLevelInfo) {
    const range = nextLevelInfo.min - currentLevelInfo.min;
    const progress = userStats.xp - currentLevelInfo.min;
    progressPercent = Math.min(100, Math.max(0, (progress / range) * 100));
    xpToNext = nextLevelInfo.min - userStats.xp;
  }

  const achievements = ACHIEVEMENT_DEFS.map((def) => ({
    ...def,
    completed: def.condition(userStats),
  })).sort((a, b) => (a.completed === b.completed ? 0 : a.completed ? -1 : 1));

  const completedCount = achievements.filter((a) => a.completed).length;

  const getUserRank = () => {
    if (!Array.isArray(leaderboard) || !address) return "-";
    const idx = leaderboard.findIndex((u) =>
      areAddressesEqual(u.address, address),
    );
    return idx !== -1 ? `#${idx + 1}` : "-";
  };

  const levelEmoji =
    userStats.level >= 5 ? "🔮" : userStats.level >= 3 ? "⚡" : "🌱";

  if (loading && !userStats.xp) {
    return (
      <div
        style={{ display: "flex", justifyContent: "center", padding: "80px 0" }}
      >
        <Loader2
          style={{
            width: 22,
            height: 22,
            color: "#1F87FC",
            animation: "spin 0.8s linear infinite",
          }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 720,
        margin: "0 auto",
        padding: "28px 20px 80px",
        fontFamily: "inherit",
        display: "flex",
        flexDirection: "column",
        gap: 20,
      }}
    >
      {/* ── Page header ── */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: "rgba(255,215,0,0.08)",
            border: "1px solid rgba(255,215,0,0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Trophy style={{ width: 16, height: 16, color: "#ffd700" }} />
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
            Rewards & ranks
          </h1>
          <p
            style={{ fontSize: 12, color: "#4a5568", margin: 0, marginTop: 2 }}
          >
            Level up and earn achievements
          </p>
        </div>
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

      {/* ══════════════════════════════════════════
          OVERVIEW TAB
      ══════════════════════════════════════════ */}
      {activeTab === "overview" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {/* Level card */}
          <div
            style={{
              background: "#12121f",
              border: `1px solid ${currentLevelInfo.color}30`,
              borderRadius: 16,
              padding: "20px 20px 18px",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Subtle color wash */}
            <div
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                width: 160,
                height: 160,
                borderRadius: "50%",
                background: `${currentLevelInfo.color}08`,
                transform: "translate(40px, -40px)",
                pointerEvents: "none",
              }}
            />

            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                marginBottom: 18,
                position: "relative",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: "50%",
                    background: `${currentLevelInfo.color}15`,
                    border: `1.5px solid ${currentLevelInfo.color}40`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 24,
                  }}
                >
                  {levelEmoji}
                </div>
                <div>
                  <div
                    style={{
                      fontSize: 20,
                      fontWeight: 700,
                      color: "#e2e8f0",
                      lineHeight: 1,
                    }}
                  >
                    Level {userStats.level}
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: currentLevelInfo.color,
                      marginTop: 3,
                    }}
                  >
                    {currentLevelInfo.name}
                  </div>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div
                  style={{
                    fontSize: 20,
                    fontWeight: 700,
                    color: "#1F87FC",
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {formatNumber(userStats.xp)} XP
                </div>
                <div style={{ fontSize: 11, color: "#3a4a5e", marginTop: 2 }}>
                  {nextLevelInfo
                    ? `${formatNumber(xpToNext)} to next level`
                    : "Max level reached"}
                </div>
              </div>
            </div>

            {/* Progress bar */}
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 10,
                  color: "#3a4a5e",
                  marginBottom: 6,
                }}
              >
                <span>Progress to level {userStats.level + 1}</span>
                <span>{Math.floor(progressPercent)}%</span>
              </div>
              <div
                style={{
                  height: 6,
                  background: "rgba(255,255,255,0.05)",
                  borderRadius: 99,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${progressPercent}%`,
                    background: `linear-gradient(90deg, ${currentLevelInfo.color}, ${nextLevelInfo?.color || currentLevelInfo.color})`,
                    borderRadius: 99,
                    transition: "width 1s ease",
                    boxShadow: `0 0 8px ${currentLevelInfo.color}60`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Stats grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 10,
            }}
          >
            {[
              {
                icon: <Flame style={{ width: 16, height: 16 }} />,
                value: userStats.streak,
                label: "Day streak",
                color: "#ff3366",
              },
              {
                icon: <Target style={{ width: 16, height: 16 }} />,
                value: completedCount,
                label: "Achievements",
                color: "#00ff88",
              },
              {
                icon: <TrendingUp style={{ width: 16, height: 16 }} />,
                value: userStats.tradesCount,
                label: "Trades",
                color: "#1F87FC",
              },
              {
                icon: <Crown style={{ width: 16, height: 16 }} />,
                value: getUserRank(),
                label: "Rank",
                color: "#ffd700",
              },
            ].map((stat) => (
              <div
                key={stat.label}
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: `1px solid ${stat.color}18`,
                  borderRadius: 12,
                  padding: "14px 12px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <span
                  style={{ color: stat.color, opacity: 0.8, display: "flex" }}
                >
                  {stat.icon}
                </span>
                <span
                  style={{
                    fontSize: 20,
                    fontWeight: 700,
                    color: "#e2e8f0",
                    fontVariantNumeric: "tabular-nums",
                    lineHeight: 1,
                  }}
                >
                  {stat.value}
                </span>
                <span
                  style={{
                    fontSize: 10,
                    color: "#3a4a5e",
                    textAlign: "center",
                  }}
                >
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════
          ACHIEVEMENTS TAB
      ══════════════════════════════════════════ */}
      {activeTab === "achievements" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {achievements.map((a) => {
            const rarityColor = RARITY_COLORS[a.rarity] || "#64748b";
            return (
              <div
                key={a.id}
                style={{
                  background: a.completed
                    ? "rgba(31,135,252,0.04)"
                    : "rgba(255,255,255,0.02)",
                  border: `1px solid ${rarityColor}${a.completed ? "35" : "18"}`,
                  borderRadius: 14,
                  padding: "14px 16px",
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  opacity: a.completed ? 1 : 0.65,
                  transition: "opacity 0.2s",
                }}
              >
                {/* Icon */}
                <div
                  style={{
                    fontSize: 26,
                    width: 46,
                    height: 46,
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: `${rarityColor}12`,
                    border: `1px solid ${rarityColor}25`,
                    borderRadius: 10,
                    filter: a.completed ? "none" : "grayscale(1)",
                  }}
                >
                  {a.icon}
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 7,
                      flexWrap: "wrap",
                      marginBottom: 3,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: a.completed ? "#e2e8f0" : "#64748b",
                      }}
                    >
                      {a.name}
                    </span>

                    {/* Rarity pill */}
                    <span
                      style={{
                        fontSize: 9,
                        fontWeight: 700,
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                        color: rarityColor,
                        background: `${rarityColor}12`,
                        border: `1px solid ${rarityColor}30`,
                        borderRadius: 4,
                        padding: "1px 6px",
                      }}
                    >
                      {a.rarity}
                    </span>

                    {/* Status */}
                    {a.completed ? (
                      <span
                        style={{
                          fontSize: 9,
                          fontWeight: 700,
                          letterSpacing: "0.06em",
                          textTransform: "uppercase",
                          color: "#00ff88",
                          background: "rgba(0,255,136,0.1)",
                          border: "1px solid rgba(0,255,136,0.25)",
                          borderRadius: 4,
                          padding: "1px 6px",
                          display: "flex",
                          alignItems: "center",
                          gap: 3,
                        }}
                      >
                        <Zap style={{ width: 9, height: 9 }} /> Unlocked
                      </span>
                    ) : (
                      <span
                        style={{
                          fontSize: 9,
                          fontWeight: 700,
                          letterSpacing: "0.06em",
                          textTransform: "uppercase",
                          color: "#3a4a5e",
                          background: "rgba(255,255,255,0.04)",
                          border: "1px solid rgba(255,255,255,0.07)",
                          borderRadius: 4,
                          padding: "1px 6px",
                        }}
                      >
                        Locked
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: 12, color: "#4a5568", margin: 0 }}>
                    {a.description}
                  </p>
                </div>

                {/* XP */}
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: a.completed ? "#1F87FC" : "#3a4a5e",
                    fontVariantNumeric: "tabular-nums",
                    flexShrink: 0,
                  }}
                >
                  +{a.xp} XP
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ══════════════════════════════════════════
          LEADERBOARD TAB
      ══════════════════════════════════════════ */}
      {activeTab === "leaderboard" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {leaderboard.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "60px 24px",
                fontSize: 13,
                color: "#3a4a5e",
              }}
            >
              No data yet — be the first to trade!
            </div>
          ) : (
            leaderboard.map((user, index) => {
              const isMe = areAddressesEqual(user.address, address);
              const rank = index + 1;
              const displayName =
                user.displayName ||
                user.username ||
                `${user.address.slice(0, 6)}…${user.address.slice(-4)}`;
              const subText =
                user.username && user.displayName
                  ? user.username
                  : !user.displayName && !user.username
                    ? "No profile set"
                    : `${user.address.slice(0, 6)}…${user.address.slice(-4)}`;
              const avatarUrl =
                user.avatarUrl ||
                `https://api.dicebear.com/7.x/identicon/svg?seed=${user.address}`;

              const rankLabel =
                rank === 1
                  ? "🥇"
                  : rank === 2
                    ? "🥈"
                    : rank === 3
                      ? "🥉"
                      : null;

              return (
                <div
                  key={user.address}
                  onClick={() => onViewProfile?.(user.address)}
                  style={{
                    background: isMe
                      ? "rgba(31,135,252,0.07)"
                      : "rgba(255,255,255,0.02)",
                    border: isMe
                      ? "1px solid rgba(31,135,252,0.4)"
                      : "1px solid rgba(255,255,255,0.06)",
                    borderRadius: 12,
                    padding: "12px 14px",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    cursor: onViewProfile ? "pointer" : "default",
                    transition: "border-color 0.15s, background 0.15s",
                    boxShadow: isMe ? "0 0 18px rgba(31,135,252,0.08)" : "none",
                  }}
                  onMouseEnter={(e) => {
                    if (!isMe) {
                      (e.currentTarget as HTMLDivElement).style.borderColor =
                        "rgba(31,135,252,0.25)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isMe) {
                      (e.currentTarget as HTMLDivElement).style.borderColor =
                        "rgba(255,255,255,0.06)";
                    }
                  }}
                >
                  {/* Rank */}
                  <div
                    style={{
                      width: 30,
                      flexShrink: 0,
                      textAlign: "center",
                      fontSize: rankLabel ? 20 : 12,
                      color: "#3a4a5e",
                      fontWeight: 600,
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {rankLabel ?? `#${rank}`}
                  </div>

                  {/* Avatar */}
                  <img
                    src={avatarUrl}
                    alt="avatar"
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      border: "1px solid rgba(255,255,255,0.1)",
                      objectFit: "cover",
                      flexShrink: 0,
                      background: "#0d0d18",
                    }}
                  />

                  {/* Name */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 6 }}
                    >
                      <span
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: isMe ? "#1F87FC" : "#e2e8f0",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {displayName}
                      </span>
                      {isMe && (
                        <span
                          style={{
                            fontSize: 9,
                            fontWeight: 700,
                            color: "#fff",
                            background: "#1F87FC",
                            borderRadius: 4,
                            padding: "1px 5px",
                            letterSpacing: "0.04em",
                            flexShrink: 0,
                          }}
                        >
                          YOU
                        </span>
                      )}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        marginTop: 3,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 11,
                          color: "#3a4a5e",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {subText}
                      </span>
                      <span
                        style={{
                          fontSize: 10,
                          color: "#00ff88",
                          display: "flex",
                          alignItems: "center",
                          gap: 3,
                          flexShrink: 0,
                        }}
                      >
                        <Zap style={{ width: 9, height: 9 }} /> Lvl {user.level}
                      </span>
                      <span
                        style={{
                          fontSize: 10,
                          color: "#4a5568",
                          display: "flex",
                          alignItems: "center",
                          gap: 3,
                          flexShrink: 0,
                        }}
                      >
                        <TrendingUp style={{ width: 9, height: 9 }} />{" "}
                        {user.tradesCount || 0}
                      </span>
                    </div>
                  </div>

                  {/* XP */}
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: "#1F87FC",
                      fontVariantNumeric: "tabular-nums",
                      flexShrink: 0,
                    }}
                  >
                    {formatNumber(user.xp)} XP
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
