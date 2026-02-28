import { useState, useEffect } from "react";
import {
  User,
  TrendingUp,
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
  Users,
  Eye, // 🟢 Added Eye icon for spectator mode
} from "lucide-react";
import { toast } from "sonner";
import { useWallet } from "../context/WalletContext";
import { useTheme } from "next-themes";
import { MediaPreview } from "./MediaPreview";
import { mapMarketToPrediction, ApiMarket } from "../lib/marketMapper";
import { Prediction } from "../types/prediction";
import { useProfile } from "../hooks/useProfile";

const API_URL = import.meta.env.VITE_INDEXER_SERVER_URL;

type ProfileTab = "predictions" | "investments" | "media" | "settings";

interface ProfileProps {
  targetAddress?: string | null;
}

export function Profile({ targetAddress }: ProfileProps) {
  const { address, disconnectWallet } = useWallet();
  const { setTheme, theme } = useTheme();
  const { updateProfile } = useProfile();

  // 🟢 1. LOGIC: WHO ARE WE LOOKING AT?
  // If targetAddress exists, use it. Otherwise, fallback to connected wallet.
  const activeAddress = targetAddress || address;

  // 🟢 2. LOGIC: AM I LOOKING AT MYSELF?
  // We use BigInt to ensure 0x0abc equals 0xabc
  const isOwnProfile =
    address && activeAddress
      ? BigInt(address) === BigInt(activeAddress)
      : false;

  const [activeTab, setActiveTab] = useState<ProfileTab>("predictions");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Data State
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

  // --- FETCH DATA ---
  useEffect(() => {
    // 🟢 3. FIX FETCH LOGIC:
    // Don't return if !address. Return if !activeAddress (we might be viewing someone while logged out)
    if (!activeAddress) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        // 🟢 CRITICAL: Use `activeAddress` in all fetch calls, NOT `address`

        // A. Markets
        const createdRes = await fetch(
          `${API_URL}/markets/created/${activeAddress}`,
        );
        const createdData: ApiMarket[] = await createdRes.json();
        const myMarkets = createdData.map(mapMarketToPrediction);
        setCreatedMarkets(myMarkets);

        // B. Investments
        const allMarketsRes = await fetch(`${API_URL}/markets`);
        const allMarketsData: ApiMarket[] = await allMarketsRes.json();
        const posRes = await fetch(`${API_URL}/positions/${activeAddress}`);
        const positionsData = await posRes.json();

        let calculatedProfit = 0;
        const myInvestments = positionsData
          .map((pos: any) => {
            const market = allMarketsData.find(
              (m) => m.marketId === pos.marketId,
            );
            if (!market) return null;
            const yesShares = Number(pos.yesShares);
            const noShares = Number(pos.noShares);
            if (yesShares === 0 && noShares === 0) return null;
            const currentValue =
              yesShares * market.yesPrice + noShares * market.noPrice;
            const cost = Number(pos.totalInvested || 0);
            calculatedProfit += currentValue - cost;
            return {
              ...mapMarketToPrediction(market),
              pnl: currentValue - cost,
              currentValue,
            };
          })
          .filter(Boolean);

        setInvestments(myInvestments);

        // C. Profile & Referrals
        const userRes = await fetch(`${API_URL}/users/${activeAddress}`);
        const userData = await userRes.json();

        if (userData && !userData.error) {
          setFormData({
            displayName: userData.displayName || "Unknown Trader",
            username: userData.username || "@user",
            bio: userData.bio || "No bio yet.",
          });
          if (userData.avatarUrl) setProfilePic(userData.avatarUrl);

          setStats({
            predictions: myMarkets.length,
            investments: myInvestments.length,
            totalProfit: Number(calculatedProfit.toFixed(2)),
            winRate: 68,
            referrals: userData.referralCount || 0,
          });
        }
      } catch (error) {
        console.error("Profile fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [activeAddress]); // 🟢 Depend on activeAddress

  // --- HANDLE SAVE ---
  const handleSave = async () => {
    if (!address) return; // Must be logged in to save
    setSaving(true);

    const storedReferrer = localStorage.getItem("starkzuri_referrer");
    const finalAvatarUrl = profilePic || "";

    const txHash = await updateProfile(
      formData.username,
      formData.displayName,
      formData.bio,
      finalAvatarUrl,
      storedReferrer,
    );

    if (txHash) {
      setIsEditing(false);
    }
    setSaving(false);
  };

  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 500000) {
        toast.error("Image too large. Please use an image under 500KB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => setProfilePic(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const copyToClipboard = () => {
    if (activeAddress) {
      navigator.clipboard.writeText(activeAddress);
      toast.success("Address copied!");
    }
  };

  const openExplorer = () => {
    if (activeAddress) {
      const baseUrl = "https://voyager.online/contract/";
      window.open(`${baseUrl}${activeAddress}`, "_blank");
    }
  };

  const shortAddr = activeAddress
    ? `${activeAddress.slice(0, 6)}...${activeAddress.slice(-4)}`
    : "Not Connected";

  const currentLevel = {
    level: 5,
    name: "Oracle",
    icon: "🔮",
    color: "#9945FF",
  };

  const tabs = [
    { id: "predictions" as ProfileTab, label: "Created", icon: Grid },
    { id: "investments" as ProfileTab, label: "Positions", icon: BarChart3 },
    { id: "media" as ProfileTab, label: "Media", icon: Camera },
    { id: "settings" as ProfileTab, label: "Settings", icon: Settings },
  ];

  // 🟢 4. UI GUARD: If no activeAddress is determined (and not connected), show prompt
  if (!activeAddress) {
    return (
      <div className="w-full max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="bg-[#0f0f1a] border border-[#1F87FC]/30 rounded-xl p-10 flex flex-col items-center">
          <Settings className="w-12 h-12 text-[#1F87FC] mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Connect Wallet</h2>
          <p className="text-gray-400 mb-6">
            Connect to view your profile and stats.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-6 mb-20">
      {/* HEADER */}
      <div className="bg-[#0f0f1a] border border-[#1F87FC]/30 rounded-xl p-4 md:p-6 mb-4 md:mb-6">
        <div className="flex justify-end mb-4">
          {/* 🟢 UI LOGIC: SHOW EDIT BUTTONS ONLY IF OWNING PROFILE */}
          {isOwnProfile ? (
            !isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-3 py-1.5 bg-[#1F87FC]/10 border border-[#1F87FC]/40 rounded-lg text-[#1F87FC] hover:bg-[#1F87FC]/20 transition-all text-xs md:text-sm"
              >
                <Edit className="w-3.5 h-3.5" />
                Edit Profile
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => setIsEditing(false)}
                  disabled={saving}
                  className="flex items-center gap-2 px-3 py-1.5 bg-[#0a0a0f] border border-border rounded-lg text-muted-foreground hover:text-foreground transition-all text-xs md:text-sm"
                >
                  <X className="w-3.5 h-3.5" /> Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 px-3 py-1.5 bg-[#1F87FC] border border-[#1F87FC] rounded-lg text-white hover:bg-[#1F87FC]/90 transition-all text-xs md:text-sm disabled:opacity-50"
                >
                  {saving && <Loader2 className="w-3 h-3 animate-spin" />}
                  {saving ? "Saving..." : "Save"}
                </button>
              </div>
            )
          ) : (
            // 🟢 UI LOGIC: SHOW 'SPECTATOR' BADGE IF VIEWING SOMEONE ELSE
            <div className="flex items-center gap-2 px-3 py-1.5 bg-[#1F87FC]/10 border border-[#1F87FC]/20 rounded-lg text-[#1F87FC] text-xs">
              <Eye className="w-3.5 h-3.5" /> Viewing User
            </div>
          )}
        </div>

        <div className="flex items-start gap-3 md:gap-4 mb-4 md:mb-6">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-[#1F87FC] to-[#00ffcc] flex items-center justify-center border-2 border-[#1F87FC] flex-shrink-0 relative group overflow-hidden">
            {profilePic ? (
              <img
                src={profilePic}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-8 h-8 md:w-10 md:h-10 text-white" />
            )}

            {/* 🟢 UI LOGIC: Only allow photo upload if editing AND owning profile */}
            {isEditing && isOwnProfile && (
              <>
                <input
                  type="file"
                  id="profile-pic-input"
                  accept="image/*"
                  onChange={handleProfilePicChange}
                  className="hidden"
                />
                <label
                  htmlFor="profile-pic-input"
                  className="absolute inset-0 bg-black/60 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Camera className="w-5 h-5 text-white" />
                </label>
              </>
            )}

            {/* Level Badge (Unchanged) */}
            <div className="absolute -bottom-1 -right-1 bg-[#0a0a0f] border-2 border-[#1F87FC] rounded-full px-2 py-0.5 flex items-center gap-1 z-10">
              <Zap className="w-3 h-3 text-[#1F87FC]" />
              <span className="text-xs text-[#1F87FC]">
                {currentLevel.level}
              </span>
            </div>
          </div>

          <div className="flex-1 min-w-0">
            {/* 🟢 UI LOGIC: Only show Inputs if editing AND owning profile */}
            {!isEditing ? (
              <>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-foreground text-lg md:text-xl font-bold">
                    {formData.displayName || "Anonymous"}
                  </h2>
                  {/* Badge */}
                  <div className="px-2 py-0.5 bg-gradient-to-r from-[#1F87FC]/20 to-[#00ff88]/20 border border-[#1F87FC]/40 rounded text-xs flex items-center gap-1">
                    <span>{currentLevel.icon}</span>
                    <span style={{ color: currentLevel.color }}>
                      {currentLevel.name}
                    </span>
                  </div>
                </div>
                <p className="text-muted-foreground text-xs md:text-sm mb-2 font-mono">
                  {formData.username || shortAddr}
                </p>
                <p className="text-foreground text-xs md:text-sm leading-relaxed">
                  {formData.bio || "No bio yet."}
                </p>
              </>
            ) : (
              // EDIT MODE INPUTS
              <div className="space-y-3">
                <input
                  type="text"
                  value={formData.displayName}
                  onChange={(e) =>
                    setFormData({ ...formData, displayName: e.target.value })
                  }
                  className="w-full bg-[#0a0a0f] border border-[#1F87FC]/30 rounded-lg px-3 py-2 text-white text-sm focus:border-[#1F87FC] focus:outline-none"
                  placeholder="Display Name"
                />
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  className="w-full bg-[#0a0a0f] border border-[#1F87FC]/30 rounded-lg px-3 py-2 text-white text-sm focus:border-[#1F87FC] focus:outline-none"
                  placeholder="@username"
                />
                <textarea
                  value={formData.bio}
                  onChange={(e) =>
                    setFormData({ ...formData, bio: e.target.value })
                  }
                  rows={2}
                  className="w-full bg-[#0a0a0f] border border-[#1F87FC]/30 rounded-lg px-3 py-2 text-white text-sm focus:border-[#1F87FC] focus:outline-none resize-none"
                  placeholder="Bio..."
                />
              </div>
            )}
          </div>
        </div>

        {/* Stats (Unchanged) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 border-t border-white/5 pt-4">
          <div className="text-center">
            <div className="text-xl md:text-2xl text-[#1F87FC] font-mono">
              {stats.predictions}
            </div>
            <div className="text-xs text-muted-foreground">Predictions</div>
          </div>
          <div className="text-center">
            <div className="text-xl md:text-2xl text-[#1F87FC] font-mono">
              {stats.investments}
            </div>
            <div className="text-xs text-muted-foreground">Investments</div>
          </div>
          <div className="text-center">
            <div className="text-xl md:text-2xl text-[#1F87FC] font-mono">
              {stats.referrals}
            </div>
            <div className="text-xs text-muted-foreground">Referrals</div>
          </div>
          <div className="text-center">
            <div className="text-xl md:text-2xl text-[#1F87FC] font-mono">
              0
            </div>
            <div className="text-xs text-muted-foreground">Following</div>
          </div>
        </div>
      </div>

      {/* Financials (Unchanged) */}

      {/* Tabs */}
      <div className="flex gap-2 mb-4 md:mb-6 border-b border-border overflow-x-auto scrollbar-hide -mx-4 px-4">
        {tabs
          // 🟢 UI LOGIC: HIDE SETTINGS TAB IF VIEWING SOMEONE ELSE
          .filter((tab) => isOwnProfile || tab.id !== "settings")
          .map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3 md:px-4 py-2 md:py-3 border-b-2 transition-colors whitespace-nowrap flex-shrink-0 ${
                activeTab === tab.id
                  ? "border-[#1F87FC] text-[#1F87FC]"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="text-xs md:text-sm">{tab.label}</span>
            </button>
          ))}
      </div>

      {/* CONTENT */}
      <div>
        {loading ? (
          <div className="py-12 flex justify-center">
            <Loader2 className="w-8 h-8 text-[#1F87FC] animate-spin" />
          </div>
        ) : (
          <>
            {/* 1. CREATED MARKETS (Unchanged) */}
            {activeTab === "predictions" &&
              (createdMarkets.length > 0 ? (
                <div className="grid grid-cols-2 gap-3 md:gap-4">
                  {createdMarkets.map((prediction) => (
                    <div
                      key={prediction.id}
                      className="bg-[#0f0f1a] border border-[#1F87FC]/30 rounded-lg overflow-hidden hover:border-[#1F87FC]/60 transition-all cursor-pointer group"
                    >
                      <div className="aspect-[4/3]">
                        <MediaPreview
                          src={prediction.media.url}
                          type={
                            prediction.media.type === "video"
                              ? "video"
                              : "image"
                          }
                          alt="media"
                          className="w-full h-full"
                        />
                      </div>
                      <div className="p-3">
                        <p className="text-xs md:text-sm text-white line-clamp-2 mb-2 group-hover:text-[#1F87FC] transition-colors">
                          {prediction.question}
                        </p>
                        <div className="flex items-center justify-between text-[10px] text-muted-foreground font-mono">
                          <span className="text-[#00ff88]">
                            YES: ${prediction.yesPrice.toFixed(2)}
                          </span>
                          <span className="text-[#ff3366]">
                            NO: ${prediction.noPrice.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground border border-dashed border-gray-800 rounded-xl">
                  <Grid className="w-10 h-10 mx-auto mb-3 opacity-50" />
                  <p>No markets created yet.</p>
                </div>
              ))}

            {/* 2. INVESTMENTS (Unchanged) */}
            {activeTab === "investments" &&
              (investments.length > 0 ? (
                <div className="space-y-3">
                  {investments.map((pos) => (
                    <div
                      key={pos.id}
                      className="bg-[#0f0f1a] border border-[#1F87FC]/30 rounded-lg p-3 flex gap-3 items-center"
                    >
                      <div className="w-12 h-12 flex-shrink-0">
                        <MediaPreview
                          src={pos.media.url}
                          alt="img"
                          className="w-full h-full rounded"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white line-clamp-1">
                          {pos.question}
                        </p>
                        <div
                          className={`text-xs font-mono ${
                            pos.pnl >= 0 ? "text-[#00ff88]" : "text-[#ff3366]"
                          }`}
                        >
                          {pos.pnl >= 0 ? "+" : ""}
                          {pos.pnl.toFixed(2)} P&L
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground border border-dashed border-gray-800 rounded-xl">
                  <BarChart3 className="w-10 h-10 mx-auto mb-3 opacity-50" />
                  <p>No active investments.</p>
                </div>
              ))}

            {/* 3. MEDIA GRID (Unchanged) */}
            {activeTab === "media" &&
              (createdMarkets.length > 0 ? (
                <div className="grid grid-cols-3 gap-2">
                  {createdMarkets.map((prediction) => (
                    <div
                      key={prediction.id}
                      className="aspect-square bg-black/40 rounded-lg overflow-hidden border border-[#1F87FC]/30"
                    >
                      <MediaPreview
                        src={prediction.media.url}
                        type={
                          prediction.media.type === "video" ? "video" : "image"
                        }
                        alt="media"
                        className="w-full h-full"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground border border-dashed border-gray-800 rounded-xl">
                  <Camera className="w-10 h-10 mx-auto mb-3 opacity-50" />
                  <p>No media found.</p>
                </div>
              ))}

            {/* 4. SETTINGS */}
            {/* 🟢 UI LOGIC: DEFENSIVE CODING - ONLY RENDER SETTINGS IF OWNING PROFILE */}
            {activeTab === "settings" && isOwnProfile && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="bg-[#0f0f1a] border border-[#1F87FC]/30 rounded-xl p-4">
                  <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">
                    Wallet
                  </h3>
                  <div className="flex items-center justify-between bg-black/20 p-3 rounded-lg border border-[#1F87FC]/10">
                    <div className="flex flex-col">
                      <span className="text-xs text-muted-foreground">
                        Connected As
                      </span>
                      <span className="font-mono text-sm text-[#1F87FC]">
                        {shortAddr}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={copyToClipboard}
                        className="p-2 hover:bg-[#1F87FC]/20 rounded transition-colors text-gray-400 hover:text-white"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button
                        onClick={openExplorer}
                        className="p-2 hover:bg-[#1F87FC]/20 rounded transition-colors text-gray-400 hover:text-white"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Referral Link Section */}
                <div className="bg-[#0f0f1a] border border-[#1F87FC]/30 rounded-xl p-4">
                  <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">
                    Referral Link
                  </h3>
                  <div className="flex items-center justify-between bg-black/20 p-3 rounded-lg border border-[#1F87FC]/10">
                    <div className="flex flex-col truncate mr-2">
                      <span className="text-xs text-muted-foreground mb-1">
                        Share this link to earn XP
                      </span>
                      <span className="font-mono text-xs text-white truncate">
                        {window.location.origin}/?ref={activeAddress}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(
                          `${window.location.origin}/?ref=${activeAddress}`,
                        );
                        toast.success("Referral link copied!");
                      }}
                      className="p-2 bg-[#1F87FC]/20 text-[#1F87FC] rounded hover:bg-[#1F87FC] hover:text-white transition-all"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="bg-[#0f0f1a] border border-[#1F87FC]/30 rounded-xl p-4">
                  <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">
                    Appearance
                  </h3>
                  <div className="flex items-center justify-between p-3 rounded-lg hover:bg-[#1F87FC]/5 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-[#1F87FC]/10 text-[#1F87FC]">
                        {theme === "dark" ? (
                          <Moon className="w-5 h-5" />
                        ) : (
                          <Sun className="w-5 h-5" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-sm text-white">Theme</p>
                        <p className="text-xs text-muted-foreground">
                          {theme === "dark" ? "Dark Mode" : "Light Mode"}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        setTheme(theme === "dark" ? "light" : "dark")
                      }
                      className="px-3 py-1.5 bg-[#1F87FC]/10 border border-[#1F87FC]/30 rounded-lg text-xs text-[#1F87FC]"
                    >
                      Toggle
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => disconnectWallet()}
                  className="w-full flex items-center justify-center gap-2 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-500 hover:bg-red-500/20 transition-all font-bold"
                >
                  <LogOut className="w-4 h-4" /> Disconnect
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
