import { useState, useEffect } from "react";
import {
  User,
  Grid,
  BarChart3,
  Zap,
  Edit,
  X,
  Camera,
  Settings,
  LogOut,
  Copy,
  ExternalLink,
  Moon,
  Sun,
  Loader2,
  Eye,
  Check,
  TrendingUp,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../hooks/useAuth";
import { useTheme } from "next-themes";
import { MediaPreview } from "./MediaPreview";
import { mapMarketToPrediction, ApiMarket } from "../lib/marketMapper";
import { Prediction } from "../types/prediction";
import { useProfile } from "../hooks/useProfile";

import { INDEXER_URL as API_URL } from "../constants";
import { padAddress, toNum } from "../lib/format";

type ProfileTab = "predictions" | "investments" | "media" | "settings";

interface ProfileProps {
  targetAddress?: string | null;
}

const LEVEL = { level: 5, name: "Oracle", icon: "🔮", color: "#9945FF" };

const inputStyle: React.CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  background: "rgba(0,0,0,0.25)",
  border: "1px solid rgba(31,135,252,0.18)",
  borderRadius: 8,
  padding: "9px 12px",
  fontSize: 13,
  color: "#e2e8f0",
  fontFamily: "inherit",
  outline: "none",
  transition: "border-color 0.15s",
};

export function Profile({ targetAddress }: ProfileProps) {
  const { address, disconnect } = useAuth();
  const { setTheme, theme } = useTheme();
  const { updateProfile } = useProfile();

  const activeAddress = targetAddress || address;
  const isOwnProfile =
    address && activeAddress
      ? BigInt(address) === BigInt(activeAddress)
      : false;

  const [activeTab, setActiveTab] = useState<ProfileTab>("predictions");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  const [createdMarkets, setCreatedMarkets] = useState<Prediction[]>([]);
  const [investments, setInvestments] = useState<any[]>([]);
  const [stats, setStats] = useState({
    predictions: 0,
    investments: 0,
    totalProfit: 0,
    winRate: 0,
    referrals: 0,
  });
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    displayName: "",
    username: "",
    bio: "",
  });

  useEffect(() => {
    if (!activeAddress) return;
    const fetchData = async () => {
      setLoading(true);
      try {
        const createdRes = await fetch(
          `${API_URL}/markets/created/${activeAddress}`,
        );
        const createdData: ApiMarket[] = await createdRes.json();
        const myMarkets = createdData.map(mapMarketToPrediction);
        setCreatedMarkets(myMarkets);

        const [allMarketsRes, posRes] = await Promise.all([
          fetch(`${API_URL}/markets`),
          fetch(`${API_URL}/positions/${activeAddress}`),
        ]);
        const allMarketsData: ApiMarket[] = await allMarketsRes.json();
        const positionsData = await posRes.json();

        let calculatedProfit = 0;
        const myInvestments = positionsData
          .map((pos: any) => {
            const market = allMarketsData.find(
              (m) => m.marketId === pos.marketId,
            );
            if (!market) return null;

            // The /positions endpoint returns these as `yesShares`/`noShares`.
            // The `position*` names are kept as a fallback in case the indexer
            // schema changes back. Bare Number() was used here before, and
            // Number(undefined) is NaN — which slipped past the `=== 0` guard
            // below and rendered as "NaN P&L".
            const yesShares = toNum(pos.yesShares ?? pos.positionYesShares);
            const noShares = toNum(pos.noShares ?? pos.positionNoShares);
            if (yesShares === 0 && noShares === 0) return null;

            const currentValue =
              yesShares * toNum(market.yesPrice) +
              noShares * toNum(market.noPrice);
            const cost = toNum(pos.totalInvested);
            calculatedProfit += currentValue - cost;

            return {
              ...mapMarketToPrediction(market),
              pnl: currentValue - cost,
              currentValue,
            };
          })
          .filter(Boolean);
        console.log(myInvestments);
        setInvestments(myInvestments);

        const userRes = await fetch(`${API_URL}/users/${activeAddress}`);
        const userData = await userRes.json();
        if (userData && !userData.error) {
          setFormData({
            displayName: userData.displayName || "Unknown Trader",
            username: userData.username || "@user",
            bio: userData.bio || "",
          });
          if (userData.avatarUrl) setProfilePic(userData.avatarUrl);
          setStats({
            predictions: myMarkets.length,
            investments: myInvestments.length,
            totalProfit: toNum(calculatedProfit.toFixed(2)),
            winRate: 68,
            referrals: userData.referralCount || 0,
          });
        }
      } catch (e) {
        console.error("Profile fetch error:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [activeAddress]);

  const handleSave = async () => {
    if (!address) return;
    setSaving(true);
    const storedReferrer = localStorage.getItem("starkzuri_referrer");
    const txHash = await updateProfile(
      formData.username,
      formData.displayName,
      formData.bio,
      profilePic || "",
      storedReferrer,
    );
    if (txHash) setIsEditing(false);
    setSaving(false);
  };

  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 500000) {
      toast.error("Image too large. Max 500KB.");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => setProfilePic(reader.result as string);
    reader.readAsDataURL(file);
  };

  const copyAddress = () => {
    if (!activeAddress) return;
    navigator.clipboard.writeText(activeAddress);
    setCopied(true);
    toast.success("Address copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const shortAddr = activeAddress
    ? `${activeAddress.slice(0, 6)}…${activeAddress.slice(-4)}`
    : "Not connected";

  const tabs = [
    { id: "predictions" as ProfileTab, label: "Created", icon: Grid },
    { id: "investments" as ProfileTab, label: "Positions", icon: BarChart3 },
    { id: "media" as ProfileTab, label: "Media", icon: Camera },
    { id: "settings" as ProfileTab, label: "Settings", icon: Settings },
  ].filter((t) => isOwnProfile || t.id !== "settings");

  if (!activeAddress) {
    return (
      <div
        style={{
          width: "100%",
          maxWidth: 480,
          margin: "0 auto",
          padding: "40px 20px",
          fontFamily: "inherit",
        }}
      >
        <div
          style={{
            background: "#12121f",
            border: "1px solid rgba(31,135,252,0.18)",
            borderRadius: 18,
            padding: "60px 32px",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 0,
          }}
        >
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: "50%",
              background: "rgba(31,135,252,0.08)",
              border: "1px solid rgba(31,135,252,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 16,
            }}
          >
            <User style={{ width: 22, height: 22, color: "#1F87FC" }} />
          </div>
          <h2
            style={{
              fontSize: 18,
              fontWeight: 600,
              color: "#e2e8f0",
              margin: "0 0 8px",
            }}
          >
            Connect wallet
          </h2>
          <p style={{ fontSize: 13, color: "#4a5568", margin: 0 }}>
            Connect to view your profile and stats.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 600,
        margin: "0 auto",
        padding: "28px 20px 80px",
        fontFamily: "inherit",
        display: "flex",
        flexDirection: "column",
        gap: 14,
      }}
    >
      {/* ── Profile card ── */}
      <div
        style={{
          background: "#12121f",
          border: "1px solid rgba(31,135,252,0.18)",
          borderRadius: 18,
          padding: "18px 18px 16px",
        }}
      >
        {/* Top row: spectator badge or edit controls */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: 16,
          }}
        >
          {isOwnProfile ? (
            !isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  fontSize: 11,
                  fontWeight: 500,
                  color: "#1F87FC",
                  background: "rgba(31,135,252,0.08)",
                  border: "1px solid rgba(31,135,252,0.22)",
                  borderRadius: 8,
                  padding: "5px 10px",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "rgba(31,135,252,0.14)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "rgba(31,135,252,0.08)")
                }
              >
                <Edit style={{ width: 11, height: 11 }} /> Edit profile
              </button>
            ) : (
              <div style={{ display: "flex", gap: 6 }}>
                <button
                  onClick={() => setIsEditing(false)}
                  disabled={saving}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    fontSize: 11,
                    color: "#64748b",
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 8,
                    padding: "5px 10px",
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  <X style={{ width: 11, height: 11 }} /> Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    fontSize: 11,
                    fontWeight: 600,
                    color: "#fff",
                    background: "#1F87FC",
                    border: "none",
                    borderRadius: 8,
                    padding: "5px 12px",
                    cursor: saving ? "not-allowed" : "pointer",
                    opacity: saving ? 0.7 : 1,
                    fontFamily: "inherit",
                  }}
                >
                  {saving && (
                    <Loader2
                      style={{
                        width: 11,
                        height: 11,
                        animation: "spin 0.8s linear infinite",
                      }}
                    />
                  )}
                  {saving ? "Saving…" : "Save"}
                </button>
              </div>
            )
          ) : (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                fontSize: 11,
                color: "#1F87FC",
                background: "rgba(31,135,252,0.08)",
                border: "1px solid rgba(31,135,252,0.18)",
                borderRadius: 8,
                padding: "4px 10px",
              }}
            >
              <Eye style={{ width: 11, height: 11 }} /> Viewing user
            </div>
          )}
        </div>

        {/* Avatar + info */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 14,
            marginBottom: 20,
          }}
        >
          {/* Avatar */}
          <div style={{ position: "relative", flexShrink: 0 }}>
            <div
              style={{
                width: 68,
                height: 68,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #1F87FC, #00ffcc)",
                border: "2px solid rgba(31,135,252,0.4)",
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {profilePic ? (
                <img
                  src={profilePic}
                  alt="Profile"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <User style={{ width: 28, height: 28, color: "#fff" }} />
              )}
              {isEditing && isOwnProfile && (
                <>
                  <input
                    type="file"
                    id="pfp-input"
                    accept="image/*"
                    onChange={handleProfilePicChange}
                    style={{ display: "none" }}
                  />
                  <label
                    htmlFor="pfp-input"
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: "rgba(0,0,0,0.6)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      borderRadius: "50%",
                    }}
                  >
                    <Camera style={{ width: 18, height: 18, color: "#fff" }} />
                  </label>
                </>
              )}
            </div>
            {/* Level badge */}
            <div
              style={{
                position: "absolute",
                bottom: -2,
                right: -2,
                background: "#0a0a0f",
                border: "1.5px solid rgba(31,135,252,0.4)",
                borderRadius: 99,
                padding: "2px 6px",
                display: "flex",
                alignItems: "center",
                gap: 3,
                zIndex: 1,
              }}
            >
              <Zap style={{ width: 9, height: 9, color: "#1F87FC" }} />
              <span style={{ fontSize: 10, color: "#1F87FC", fontWeight: 600 }}>
                {LEVEL.level}
              </span>
            </div>
          </div>

          {/* Name / bio / edit fields */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {!isEditing ? (
              <>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 4,
                  }}
                >
                  <h2
                    style={{
                      fontSize: 17,
                      fontWeight: 600,
                      color: "#e2e8f0",
                      margin: 0,
                    }}
                  >
                    {formData.displayName || "Anonymous"}
                  </h2>
                  <span
                    style={{
                      fontSize: 10,
                      color: LEVEL.color,
                      background: `${LEVEL.color}18`,
                      border: `1px solid ${LEVEL.color}30`,
                      borderRadius: 5,
                      padding: "2px 7px",
                    }}
                  >
                    {LEVEL.icon} {LEVEL.name}
                  </span>
                </div>
                <p
                  style={{
                    fontSize: 11,
                    color: "#4a5568",
                    margin: "0 0 6px",
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {formData.username || shortAddr}
                </p>
                <p
                  style={{
                    fontSize: 12,
                    color: "#64748b",
                    margin: 0,
                    lineHeight: 1.6,
                  }}
                >
                  {formData.bio || "No bio yet."}
                </p>
              </>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <input
                  type="text"
                  value={formData.displayName}
                  onChange={(e) =>
                    setFormData({ ...formData, displayName: e.target.value })
                  }
                  placeholder="Display name"
                  style={inputStyle}
                  onFocus={(e) =>
                    (e.currentTarget.style.borderColor = "rgba(31,135,252,0.5)")
                  }
                  onBlur={(e) =>
                    (e.currentTarget.style.borderColor =
                      "rgba(31,135,252,0.18)")
                  }
                />
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  placeholder="@username"
                  style={inputStyle}
                  onFocus={(e) =>
                    (e.currentTarget.style.borderColor = "rgba(31,135,252,0.5)")
                  }
                  onBlur={(e) =>
                    (e.currentTarget.style.borderColor =
                      "rgba(31,135,252,0.18)")
                  }
                />
                <textarea
                  value={formData.bio}
                  onChange={(e) =>
                    setFormData({ ...formData, bio: e.target.value })
                  }
                  placeholder="Bio…"
                  rows={2}
                  style={{ ...inputStyle, resize: "none", lineHeight: 1.6 }}
                  onFocus={(e) =>
                    (e.currentTarget.style.borderColor = "rgba(31,135,252,0.5)")
                  }
                  onBlur={(e) =>
                    (e.currentTarget.style.borderColor =
                      "rgba(31,135,252,0.18)")
                  }
                />
              </div>
            )}
          </div>
        </div>

        {/* Stats strip */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 0,
            borderTop: "1px solid rgba(255,255,255,0.04)",
            paddingTop: 14,
          }}
        >
          {[
            { label: "Predictions", value: stats.predictions },
            { label: "Positions", value: stats.investments },
            { label: "Referrals", value: stats.referrals },
            { label: "Following", value: 0 },
          ].map((s, i, arr) => (
            <div
              key={s.label}
              style={{
                textAlign: "center",
                borderRight:
                  i < arr.length - 1
                    ? "1px solid rgba(255,255,255,0.04)"
                    : "none",
              }}
            >
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: "#1F87FC",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {s.value}
              </div>
              <div style={{ fontSize: 10, color: "#3a4a5e", marginTop: 2 }}>
                {s.label}
              </div>
            </div>
          ))}
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
        {tabs.map((tab) => {
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
              <tab.icon style={{ width: 12, height: 12 }} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ── Content ── */}
      {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            padding: "48px 0",
          }}
        >
          <Loader2
            style={{
              width: 20,
              height: 20,
              color: "#1F87FC",
              animation: "spin 0.8s linear infinite",
            }}
          />
        </div>
      ) : (
        <>
          {/* Created markets */}
          {activeTab === "predictions" &&
            (createdMarkets.length > 0 ? (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 10,
                }}
              >
                {createdMarkets.map((p) => (
                  <div
                    key={p.id}
                    style={{
                      background: "#12121f",
                      border: "1px solid rgba(31,135,252,0.15)",
                      borderRadius: 12,
                      overflow: "hidden",
                      cursor: "pointer",
                      transition: "border-color 0.15s",
                    }}
                    onMouseEnter={(e) =>
                      ((e.currentTarget as HTMLDivElement).style.borderColor =
                        "rgba(31,135,252,0.4)")
                    }
                    onMouseLeave={(e) =>
                      ((e.currentTarget as HTMLDivElement).style.borderColor =
                        "rgba(31,135,252,0.15)")
                    }
                  >
                    <div
                      style={{
                        aspectRatio: "4/3",
                        background: "#0d0d18",
                        overflow: "hidden",
                      }}
                    >
                      <MediaPreview
                        src={p.media.url}
                        type={p.media.type === "video" ? "video" : "image"}
                        alt="media"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          display: "block",
                        }}
                      />
                    </div>
                    <div style={{ padding: "10px 12px" }}>
                      <p
                        style={{
                          fontSize: 12,
                          color: "#e2e8f0",
                          margin: "0 0 7px",
                          lineHeight: 1.4,
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {p.question}
                      </p>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          fontSize: 10,
                          fontVariantNumeric: "tabular-nums",
                        }}
                      >
                        <span style={{ color: "#00ff88" }}>
                          YES ${p.yesPrice.toFixed(2)}
                        </span>
                        <span style={{ color: "#ff3366" }}>
                          NO ${p.noPrice.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={<Grid style={{ width: 28, height: 28 }} />}
                message="No markets created yet."
              />
            ))}

          {/* Investments */}
          {activeTab === "investments" &&
            (investments.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {investments.map((pos) => (
                  <div
                    key={pos.id}
                    style={{
                      background: "#12121f",
                      border: "1px solid rgba(31,135,252,0.12)",
                      borderRadius: 12,
                      padding: "12px 14px",
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                    }}
                  >
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        flexShrink: 0,
                        borderRadius: 8,
                        overflow: "hidden",
                        background: "#0d0d18",
                      }}
                    >
                      <MediaPreview
                        src={pos.media.url}
                        alt="img"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          display: "block",
                        }}
                      />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p
                        style={{
                          fontSize: 12,
                          color: "#e2e8f0",
                          margin: "0 0 4px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {pos.question}
                      </p>
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 600,
                          color: toNum(pos.pnl) >= 0 ? "#00ff88" : "#ff3366",
                          fontVariantNumeric: "tabular-nums",
                        }}
                      >
                        {toNum(pos.pnl) >= 0 ? "+" : ""}
                        {toNum(pos.pnl).toFixed(2)} P&L
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={<BarChart3 style={{ width: 28, height: 28 }} />}
                message="No active positions."
              />
            ))}

          {/* Media grid */}
          {activeTab === "media" &&
            (createdMarkets.length > 0 ? (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: 6,
                }}
              >
                {createdMarkets.map((p) => (
                  <div
                    key={p.id}
                    style={{
                      aspectRatio: "1",
                      background: "#0d0d18",
                      borderRadius: 8,
                      overflow: "hidden",
                      border: "1px solid rgba(31,135,252,0.1)",
                    }}
                  >
                    <MediaPreview
                      src={p.media.url}
                      type={p.media.type === "video" ? "video" : "image"}
                      alt="media"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                      }}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={<Camera style={{ width: 28, height: 28 }} />}
                message="No media found."
              />
            ))}

          {/* Settings */}
          {activeTab === "settings" && isOwnProfile && (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {/* Wallet */}
              <SettingsCard label="Wallet">
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    background: "rgba(0,0,0,0.2)",
                    border: "1px solid rgba(31,135,252,0.1)",
                    borderRadius: 10,
                    padding: "10px 12px",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: 10,
                        color: "#3a4a5e",
                        marginBottom: 3,
                      }}
                    >
                      Connected as
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        color: "#1F87FC",
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {shortAddr}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    <IconBtn onClick={copyAddress} title="Copy address">
                      {copied ? (
                        <Check
                          style={{ width: 13, height: 13, color: "#00ff88" }}
                        />
                      ) : (
                        <Copy style={{ width: 13, height: 13 }} />
                      )}
                    </IconBtn>
                    <IconBtn
                      onClick={() =>
                        window.open(
                          `https://voyager.online/contract/${activeAddress}`,
                          "_blank",
                        )
                      }
                      title="View on explorer"
                    >
                      <ExternalLink style={{ width: 13, height: 13 }} />
                    </IconBtn>
                  </div>
                </div>
              </SettingsCard>

              {/* Referral */}
              <SettingsCard label="Referral link">
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    background: "rgba(0,0,0,0.2)",
                    border: "1px solid rgba(31,135,252,0.1)",
                    borderRadius: 10,
                    padding: "10px 12px",
                    gap: 10,
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: 10,
                        color: "#3a4a5e",
                        marginBottom: 3,
                      }}
                    >
                      Share to earn XP
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        color: "#94a3b8",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {window.location.origin}/?ref={activeAddress}
                    </div>
                  </div>
                  <IconBtn
                    onClick={() => {
                      const safeAddr = activeAddress
                        ? padAddress(activeAddress)
                        : "0x0";
                      navigator.clipboard.writeText(
                        `${window.location.origin}/?ref=${safeAddr}`,
                      );
                      toast.success("Referral link copied!");
                    }}
                    title="Copy referral link"
                  >
                    <Copy style={{ width: 13, height: 13 }} />
                  </IconBtn>
                </div>
              </SettingsCard>

              {/* Appearance */}
              <SettingsCard label="Appearance">
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "4px 0",
                  }}
                >
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 10 }}
                  >
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 8,
                        background: "rgba(31,135,252,0.08)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {theme === "dark" ? (
                        <Moon
                          style={{ width: 14, height: 14, color: "#1F87FC" }}
                        />
                      ) : (
                        <Sun
                          style={{ width: 14, height: 14, color: "#1F87FC" }}
                        />
                      )}
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: 500,
                          color: "#e2e8f0",
                        }}
                      >
                        Theme
                      </div>
                      <div style={{ fontSize: 11, color: "#4a5568" }}>
                        {theme === "dark" ? "Dark mode" : "Light mode"}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      setTheme(theme === "dark" ? "light" : "dark")
                    }
                    style={{
                      fontSize: 11,
                      color: "#1F87FC",
                      background: "rgba(31,135,252,0.08)",
                      border: "1px solid rgba(31,135,252,0.22)",
                      borderRadius: 8,
                      padding: "5px 12px",
                      cursor: "pointer",
                      fontFamily: "inherit",
                    }}
                  >
                    Toggle
                  </button>
                </div>
              </SettingsCard>

              {/* Disconnect */}
              <button
                onClick={() => disconnect()}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 7,
                  padding: "12px 0",
                  background: "rgba(255,51,102,0.06)",
                  border: "1px solid rgba(255,51,102,0.2)",
                  borderRadius: 12,
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#ff3366",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "rgba(255,51,102,0.12)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "rgba(255,51,102,0.06)")
                }
              >
                <LogOut style={{ width: 14, height: 14 }} /> Disconnect
              </button>
            </div>
          )}
        </>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function EmptyState({
  icon,
  message,
}: {
  icon: React.ReactNode;
  message: string;
}) {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "48px 24px",
        background: "#12121f",
        border: "1px dashed rgba(255,255,255,0.07)",
        borderRadius: 14,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 10,
      }}
    >
      <span style={{ color: "#3a4a5e" }}>{icon}</span>
      <p style={{ fontSize: 13, color: "#4a5568", margin: 0 }}>{message}</p>
    </div>
  );
}

function SettingsCard({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        background: "#12121f",
        border: "1px solid rgba(31,135,252,0.12)",
        borderRadius: 14,
        padding: "14px 16px",
      }}
    >
      <div
        style={{
          fontSize: 10,
          fontWeight: 600,
          color: "#3a4a5e",
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          marginBottom: 10,
        }}
      >
        {label}
      </div>
      {children}
    </div>
  );
}

function IconBtn({
  onClick,
  title,
  children,
}: {
  onClick: () => void;
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      style={{
        width: 30,
        height: 30,
        borderRadius: 7,
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.07)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        color: "#64748b",
        transition: "background 0.15s, color 0.15s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "rgba(31,135,252,0.1)";
        e.currentTarget.style.color = "#1F87FC";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "rgba(255,255,255,0.04)";
        e.currentTarget.style.color = "#64748b";
      }}
    >
      {children}
    </button>
  );
}
