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

import { INDEXER_URL as API_URL } from "../constants";
import { avatarFor, formatNumber as formatNum } from "../lib/format";

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

const formatNumber = (num: number) => formatNum(num, { locale: true });

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
                avatarFor(user.address);

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
