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
import { useWallet } from "../context/WalletContext";

const API_URL = import.meta.env.VITE_INDEXER_SERVER_URL;

type RewardsTab = "overview" | "achievements" | "leaderboard";

// 🟢 STATIC DATA: Level Thresholds & Achievement Definitions
const LEVEL_THRESHOLDS = [
  { level: 1, min: 0, max: 100, name: "Novice", color: "#6b7280" },
  { level: 2, min: 100, max: 400, name: "Apprentice", color: "#1F87FC" },
  { level: 3, min: 400, max: 900, name: "Trader", color: "#00ff88" },
  { level: 4, min: 900, max: 1600, name: "Pro", color: "#ff3366" },
  { level: 5, min: 1600, max: 2500, name: "Whale", color: "#9945FF" },
  { level: 6, min: 2500, max: 10000, name: "Oracle", color: "#ffd700" },
];

const ACHIEVEMENT_DEFS = [
  {
    id: "first_trade",
    name: "First Blood",
    description: "Place your first prediction",
    xp: 50,
    icon: "🗡️",
    rarity: "common",
    condition: (s: any) => s.tradesCount >= 1,
  },
  {
    id: "trader",
    name: "Market Mover",
    description: "Place 10 trades",
    xp: 150,
    icon: "📈",
    rarity: "rare",
    condition: (s: any) => s.tradesCount >= 10,
  },
  {
    id: "streak_3",
    name: "Heating Up",
    description: "Maintain a 3-day streak",
    xp: 100,
    icon: "🔥",
    rarity: "rare",
    condition: (s: any) => s.streak >= 3,
  },
  {
    id: "streak_7",
    name: "On Fire",
    description: "Maintain a 7-day streak",
    xp: 300,
    icon: "⚡",
    rarity: "epic",
    condition: (s: any) => s.streak >= 7,
  },
  {
    id: "whale",
    name: "High Roller",
    description: "Reach Level 5",
    xp: 500,
    icon: "🐋",
    rarity: "legendary",
    condition: (s: any) => s.level >= 5,
  },
];

const areAddressesEqual = (a: string | undefined, b: string | undefined) => {
  if (!a || !b) return false;
  try {
    // Converts both to Big Integers (0x00abc == 0xabc)
    return BigInt(a) === BigInt(b);
  } catch (e) {
    return false;
  }
};

interface RewardsProps {
  onViewProfile?: (address: string) => void; // Optional callback
}

export function Rewards({ onViewProfile }: RewardsProps) {
  const { address } = useWallet();
  const [activeTab, setActiveTab] = useState<RewardsTab>("overview");
  const [loading, setLoading] = useState(false);

  // 🟢 REAL STATE
  const [userStats, setUserStats] = useState({
    xp: 0,
    level: 1,
    streak: 0,
    tradesCount: 0,
  });

  // 🟢 FIX: Initialize as empty array explicitly
  const [leaderboard, setLeaderboard] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // 1. Fetch Leaderboard (Safe Check)
        const lbRes = await fetch(`${API_URL}/users/leaderboard`);
        const lbData = await lbRes.json();

        // 🟢 FIX: Only set if it is actually an array
        if (Array.isArray(lbData)) {
          setLeaderboard(lbData);
        } else {
          console.warn("Leaderboard API returned invalid format:", lbData);
          setLeaderboard([]); // Fallback
        }

        // 2. Fetch User Stats (If connected)
        if (address) {
          const userRes = await fetch(`${API_URL}/users/${address}`);
          const userData = await userRes.json();
          // Safety check for user data too
          if (!userData.error) {
            setUserStats(userData);
          }
        }
      } catch (err) {
        console.error("Error fetching rewards data:", err);
        setLeaderboard([]); // Ensure it doesn't crash on network error
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [address]);

  // --- CALCULATIONS ---
  const currentLevelInfo =
    LEVEL_THRESHOLDS.find((l) => userStats.level === l.level) ||
    LEVEL_THRESHOLDS[0];
  const nextLevelInfo = LEVEL_THRESHOLDS.find(
    (l) => l.level === userStats.level + 1
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
    progress: def.condition(userStats) ? 100 : 0,
  }));

  const completedCount = achievements.filter((a) => a.completed).length;

  // 🟢 FIX: Safe Find Index Function
  const getUserRank = () => {
    if (!Array.isArray(leaderboard) || leaderboard.length === 0) return "-";
    if (!address) return "-";

    const index = leaderboard.findIndex(
      (u) => u.address?.toLowerCase() === address.toLowerCase()
    );
    return index !== -1 ? `#${index + 1}` : "-";
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "#6b6b7f";
      case "rare":
        return "#1F87FC";
      case "epic":
        return "#9333ea";
      case "legendary":
        return "#ffd700";
      default:
        return "#6b6b7f";
    }
  };

  const getRarityBorder = (rarity: string) => {
    const color = getRarityColor(rarity);
    return { borderColor: `${color}40` };
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toLocaleString();
  };

  if (loading && !userStats.xp) {
    return (
      <div className="flex justify-center p-20">
        <Loader2 className="w-8 h-8 animate-spin text-[#1F87FC]" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 space-y-4 md:space-y-6 mb-20">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Trophy className="w-6 h-6 md:w-8 md:h-8 text-[#ffd700]" />
        <div>
          <h1 className="text-foreground text-xl md:text-2xl font-bold">
            Rewards & Ranks
          </h1>
          <p className="text-xs md:text-sm text-muted-foreground">
            Level up and earn achievements
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border overflow-x-auto scrollbar-hide -mx-4 px-4">
        {["overview", "achievements", "leaderboard"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as RewardsTab)}
            className={`flex items-center gap-2 px-3 md:px-4 py-2 md:py-3 transition-all relative whitespace-nowrap flex-shrink-0 capitalize ${
              activeTab === tab
                ? "text-[#1F87FC]"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab === "overview" && <Star className="w-4 h-4" />}
            {tab === "achievements" && <Award className="w-4 h-4" />}
            {tab === "leaderboard" && <Trophy className="w-4 h-4" />}
            <span className="text-xs md:text-sm">{tab}</span>
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1F87FC] shadow-[0_0_8px_rgba(31,135,252,0.8)]" />
            )}
          </button>
        ))}
      </div>

      {/* 🟢 OVERVIEW TAB */}
      {activeTab === "overview" && (
        <div className="space-y-4 md:space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
          {/* Level Card */}
          <div className="bg-gradient-to-br from-[#1F87FC]/10 to-[#0f0f1a] border border-[#1F87FC]/40 rounded-xl p-4 md:p-6 shadow-lg shadow-[#1F87FC]/5">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-[#1F87FC]/20 flex items-center justify-center border border-[#1F87FC]/50 text-2xl md:text-3xl">
                  {userStats.level >= 5
                    ? "🔮"
                    : userStats.level >= 3
                    ? "⚡"
                    : "🌱"}
                </div>
                <div>
                  <div className="text-lg md:text-2xl text-foreground font-bold">
                    Level {userStats.level}
                  </div>
                  <div
                    className="text-sm md:text-base font-bold"
                    style={{ color: currentLevelInfo.color }}
                  >
                    {currentLevelInfo.name}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl md:text-2xl text-[#1F87FC] font-mono">
                  {formatNumber(userStats.xp)} XP
                </div>
                <div className="text-xs text-muted-foreground">
                  {nextLevelInfo
                    ? `${formatNumber(xpToNext)} to next level`
                    : "Max Level Reached!"}
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div>
              <div className="flex items-center justify-between mb-2 text-xs md:text-sm text-muted-foreground">
                <span>Progress</span>
                <span>{Math.floor(progressPercent)}%</span>
              </div>
              <div className="w-full h-3 bg-[#1a1a24] rounded-full overflow-hidden border border-[#1F87FC]/30">
                <div
                  className="h-full bg-gradient-to-r from-[#1F87FC] to-[#00ffcc] transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(31,135,252,0.5)]"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            <div className="bg-[#0f0f1a] border border-[#ff3366]/40 rounded-xl p-4 flex flex-col justify-center items-center text-center">
              <Flame className="w-6 h-6 text-[#ff3366] mb-2" />
              <div className="text-2xl font-bold text-white">
                {userStats.streak}
              </div>
              <div className="text-xs text-muted-foreground">Day Streak</div>
            </div>
            <div className="bg-[#0f0f1a] border border-[#00ff88]/40 rounded-xl p-4 flex flex-col justify-center items-center text-center">
              <Target className="w-6 h-6 text-[#00ff88] mb-2" />
              <div className="text-2xl font-bold text-white">
                {completedCount}
              </div>
              <div className="text-xs text-muted-foreground">Achievements</div>
            </div>
            <div className="bg-[#0f0f1a] border border-[#1F87FC]/40 rounded-xl p-4 flex flex-col justify-center items-center text-center">
              <TrendingUp className="w-6 h-6 text-[#1F87FC] mb-2" />
              <div className="text-2xl font-bold text-white">
                {userStats.tradesCount}
              </div>
              <div className="text-xs text-muted-foreground">Trades Placed</div>
            </div>
            {/* 🟢 FIX: Safe Rank Display */}
            <div className="bg-[#0f0f1a] border border-[#ffd700]/40 rounded-xl p-4 flex flex-col justify-center items-center text-center">
              <Crown className="w-6 h-6 text-[#ffd700] mb-2" />
              <div className="text-2xl font-bold text-white">
                {getUserRank()}
              </div>
              <div className="text-xs text-muted-foreground">Rank</div>
            </div>
          </div>
        </div>
      )}

      {/* 🟢 ACHIEVEMENTS TAB */}
      {activeTab === "achievements" && (
        <div className="space-y-3 md:space-y-4 animate-in fade-in duration-300">
          {achievements
            // 🟢 Sort: Unlocked First
            .sort((a, b) =>
              a.completed === b.completed ? 0 : a.completed ? -1 : 1
            )
            .map((achievement) => (
              <div
                key={achievement.id}
                className={`bg-[#0f0f1a] border rounded-xl p-4 md:p-6 transition-all relative overflow-hidden ${
                  achievement.completed
                    ? "opacity-100 bg-[#1F87FC]/5 shadow-[0_0_15px_rgba(31,135,252,0.1)]"
                    : "opacity-75 bg-[#0a0a0f]" // Darker background for locked
                }`}
                style={getRarityBorder(achievement.rarity)}
              >
                {/* Visual Flair for Unlocked */}
                {achievement.completed && (
                  <div className="absolute top-0 right-0 p-2 opacity-10">
                    <Trophy className="w-24 h-24 rotate-12" />
                  </div>
                )}

                <div className="flex items-start gap-4 relative z-10">
                  {/* Icon: Grayscale if locked, Color if unlocked */}
                  <div
                    className={`text-3xl md:text-4xl transition-all duration-500 ${
                      !achievement.completed
                        ? "grayscale opacity-50"
                        : "grayscale-0 scale-110"
                    }`}
                  >
                    {achievement.icon}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3
                        className={`font-bold ${
                          achievement.completed ? "text-white" : "text-gray-400"
                        }`}
                      >
                        {achievement.name}
                      </h3>

                      {/* Rarity Badge */}
                      <span
                        className="text-[10px] uppercase font-bold px-2 py-0.5 rounded border"
                        style={{
                          color: getRarityColor(achievement.rarity),
                          borderColor: `${getRarityColor(
                            achievement.rarity
                          )}40`,
                          backgroundColor: `${getRarityColor(
                            achievement.rarity
                          )}10`,
                        }}
                      >
                        {achievement.rarity}
                      </span>

                      {/* 🟢 STATUS BADGE */}
                      {achievement.completed ? (
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 bg-[#00ff88]/20 text-[#00ff88] border border-[#00ff88]/40 rounded flex items-center gap-1 shadow-[0_0_10px_rgba(0,255,136,0.2)]">
                          <Zap className="w-3 h-3 fill-current" /> Unlocked
                        </span>
                      ) : (
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 bg-gray-800 text-gray-400 border border-gray-700 rounded flex items-center gap-1">
                          <div className="w-3 h-3 rounded-full border border-gray-500 flex items-center justify-center">
                            <div className="w-1.5 h-1.5 bg-gray-500 rounded-full" />
                          </div>
                          Locked
                        </span>
                      )}
                    </div>

                    <p className="text-sm text-muted-foreground mb-3">
                      {achievement.description}
                    </p>

                    {/* 🟢 PROGRESS BAR (Only for locked items) */}
                    {!achievement.completed && (
                      <div className="w-full max-w-[200px]">
                        <div className="flex justify-between text-[10px] text-gray-500 mb-1 uppercase font-bold">
                          <span>Progress</span>
                          <span>{Math.floor(achievement.progress)}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-[#1a1a24] rounded-full overflow-hidden border border-white/10">
                          <div
                            className="h-full bg-gray-600 rounded-full"
                            style={{ width: `${achievement.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="text-right">
                    <div
                      className={`font-bold ${
                        achievement.completed
                          ? "text-[#1F87FC]"
                          : "text-gray-600"
                      }`}
                    >
                      +{achievement.xp} XP
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}

      {/* LEADERBOARD TAB */}

      {/* LEADERBOARD TAB */}
      {activeTab === "leaderboard" && (
        <div className="space-y-3 animate-in fade-in duration-300">
          {!leaderboard || leaderboard.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              No data yet. Be the first to trade!
            </div>
          ) : (
            leaderboard.map((user, index) => {
              const isCurrentUser = areAddressesEqual(user.address, address);
              const rank = index + 1;

              // 🟢 LOGIC: Use Profile Data if available, else default to Address
              const hasProfile = user.displayName || user.username;

              const displayName = user.displayName
                ? user.displayName
                : user.username
                ? user.username
                : `${user.address.slice(0, 6)}...${user.address.slice(-4)}`;

              const subText =
                user.username && user.displayName
                  ? user.username // If display name exists, show @username below
                  : !hasProfile
                  ? "No Profile Set"
                  : `${user.address.slice(0, 6)}...${user.address.slice(-4)}`; // Else show address

              // Use custom avatar if set, otherwise generate one
              const avatarUrl = user.avatarUrl
                ? user.avatarUrl
                : "https://api.dicebear.com/7.x/identicon/svg?seed=" +
                  user.address;

              return (
                <div
                  key={user.address}
                  onClick={() => {
                    if (onViewProfile) onViewProfile(user.address);
                  }}
                  className={`bg-[#0f0f1a] border rounded-lg p-3 md:p-4 flex items-center gap-3 md:gap-4 transition-all hover:border-[#1F87FC]/60 ${
                    isCurrentUser
                      ? "border-[#1F87FC] border-2 bg-[#1F87FC]/20 shadow-[0_0_20px_rgba(31,135,252,0.2)]"
                      : "border-white/10"
                  }`}
                >
                  {/* Rank Badge */}
                  <div className="flex-shrink-0 w-8 text-center font-bold">
                    {rank === 1 && <span className="text-2xl">🥇</span>}
                    {rank === 2 && <span className="text-2xl">🥈</span>}
                    {rank === 3 && <span className="text-2xl">🥉</span>}
                    {rank > 3 && <span className="text-gray-500">#{rank}</span>}
                  </div>

                  {/* Avatar */}
                  <img
                    src={avatarUrl}
                    alt="avatar"
                    className="w-10 h-10 rounded-full border border-white/20 bg-black object-cover"
                  />

                  {/* Name & Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-sm font-bold truncate ${
                          isCurrentUser ? "text-[#1F87FC]" : "text-white"
                        }`}
                      >
                        {displayName}
                      </span>
                      {isCurrentUser && (
                        <span className="text-[10px] bg-[#1F87FC] text-white px-1.5 py-0.5 rounded font-bold">
                          YOU
                        </span>
                      )}
                    </div>

                    {/* Subtext: Username or Address */}
                    <div className="text-xs text-muted-foreground mb-1 truncate">
                      {subText}
                    </div>

                    {/* Stats Row */}
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5 border-t border-white/5 pt-1">
                      <span className="flex items-center gap-1 text-[#00ff88]">
                        <Zap className="w-3 h-3" /> Lvl {user.level}
                      </span>
                      <span className="flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />{" "}
                        {user.tradesCount || 0} Trades
                      </span>
                    </div>
                  </div>

                  {/* XP */}
                  <div className="text-right">
                    <div className="text-[#1F87FC] font-mono font-bold text-sm md:text-base">
                      {formatNumber(user.xp)} XP
                    </div>
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
