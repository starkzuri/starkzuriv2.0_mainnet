

import { useState, useEffect } from "react";
import { useWallet } from "./context/WalletContext";

import { Sidebar } from "./components/Sidebar";
import { BottomNav } from "./components/BottomNav";
import { HomeFeed } from "./components/HomeFeed";
import { CreatePrediction } from "./components/CreatePrediction";
import { MarketExplore } from "./components/MarketExplore";
import { Portfolio } from "./components/Portfolio";
import { Profile } from "./components/Profile";
import { MarketDetail } from "./components/MarketDetail";
import { Rewards } from "./components/Rewards";
import { LoginModal } from "./components/LoginModal";
import { toast, Toaster } from "sonner";
// import { LiveActionFeed } from "./components/LiveActionFeed";

type Screen =
  | "home"
  | "market"
  | "create"
  | "portfolio"
  | "profile"
  | "rewards"
  | "market-detail";

export default function App() {
  const [activeScreen, setActiveScreen] = useState<Screen>("home");
  const [selectedMarketId, setSelectedMarketId] = useState<string | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [selectedProfileAddress, setSelectedProfileAddress] = useState<
    string | null
  >(null);

  // 🟢 FIX: Use your existing context state
  const { address, account, disconnectWallet } = useWallet(); // removed connectWallet if unused
  const isConnected = !!account; // If account exists, we are connected

  const handleLogin = async () => {
    // Your WalletProvider handles the logic, we just trigger it here if needed
    // But usually, LoginModal calls connectWallet directly.
    setShowLoginModal(false);
  };

  useEffect(() => {
    // 1. Get URL params
    const params = new URLSearchParams(window.location.search);
    const refParam = params.get("ref");
    const marketIdParam = params.get("marketId"); // 🟢 NEW: Check for marketId

    // 2. If ref exists, save it to Local Storage
    if (refParam) {
      if (refParam.startsWith("0x")) {
        console.log("🔗 Referral detected:", refParam);
        localStorage.setItem("starkzuri_referrer", refParam);
      }
    }

    // 3. 🟢 NEW: If marketId exists, deep link to it immediately
    if (marketIdParam) {
      console.log("🔗 Market Link detected:", marketIdParam);
      setSelectedMarketId(marketIdParam);
      setActiveScreen("market-detail");
    }
  }, []);

  const handleOpenLogin = () => {
    if (isConnected) {
      disconnectWallet();
      toast.info("Wallet disconnected");
    } else {
      setShowLoginModal(true);
    }
  };

  const handleViewMarket = (id: string) => {
    setSelectedMarketId(id);
    setActiveScreen("market-detail");

    // 🟢 NEW: Update URL without reloading page
    // This allows the user to copy/paste the link to a friend
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set("marketId", id);
    window.history.pushState({}, "", newUrl);
  };

  const handleViewProfile = (addr: string) => {
    setSelectedProfileAddress(addr);
    setActiveScreen("profile");
  };

  // Wrapper to clean state when changing screens via menu
  const handleMenuNavigate = (screen: Screen) => {
    if (screen === "profile") {
      setSelectedProfileAddress(null);
    }
    setActiveScreen(screen);

    // 🟢 OPTIONAL: Clear URL params when going to main tabs
    // so the user doesn't get stuck on a market if they refresh
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.delete("marketId");
    window.history.pushState({}, "", newUrl);
  };

  const handleBackToFeed = () => {
    setActiveScreen("home");
    setSelectedMarketId(null);

    // 🟢 NEW: Clean URL on back
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.delete("marketId");
    window.history.pushState({}, "", newUrl);
  };

  const renderScreen = () => {
    switch (activeScreen) {
      case "home":
        return <HomeFeed onViewMarket={handleViewMarket} />;
      case "market":
        return <MarketExplore onViewMarket={handleViewMarket} />;
      case "create":
        return <CreatePrediction />;
      case "rewards":
        return <Rewards onViewProfile={handleViewProfile} />;
      case "portfolio":
        return <Portfolio onViewMarket={handleViewMarket} />;
      case "profile":
        return <Profile targetAddress={selectedProfileAddress} />;

      case "market-detail":
        if (selectedMarketId) {
          return (
            <MarketDetail
              marketId={selectedMarketId}
              onBack={handleBackToFeed}
            />
          );
        }
        return <HomeFeed onViewMarket={handleViewMarket} />;

      default:
        return <HomeFeed onViewMarket={handleViewMarket} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-foreground">
      <div className="flex">
        <Sidebar
          activeScreen={activeScreen}
          onNavigate={(screen) => handleMenuNavigate(screen as Screen)} // 🟢 Use wrapper to clean URL
          isLoggedIn={isConnected}
          onLogin={handleOpenLogin}
        />

        <main className="flex-1 min-h-screen pb-20 lg:pb-0">
          <Toaster
            position="top-right"
            richColors
            theme="dark" // or "light" depending on your theme
          />
          <div className="max-w-7xl mx-auto">{renderScreen()}</div>
        </main>
      </div>

      <BottomNav
        activeScreen={activeScreen}
        onNavigate={(screen) => handleMenuNavigate(screen as Screen)} // 🟢 Use wrapper here too
      />

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={handleLogin}
      />
    </div>
  );
}
