import {
  Home,
  TrendingUp,
  PlusCircle,
  User,
  Award,
  LogIn,
  Wallet,
} from "lucide-react";
import { useWallet } from "../context/WalletContext"; // <--- IMPORT HOOK

interface BottomNavProps {
  activeScreen: string;
  onNavigate: (screen: string) => void;
  // Removed isLoggedIn/onLogin props (Component handles this internally now)
}

export function BottomNav({ activeScreen, onNavigate }: BottomNavProps) {
  // 1. Get Real Blockchain State
  const { account, connectWallet } = useWallet();
  const isLoggedIn = !!account;

  const publicNavItems = [
    { id: "home", icon: Home, label: "Home" },
    { id: "market", icon: TrendingUp, label: "Explore" },
  ];

  const authenticatedNavItems = [
    { id: "home", icon: Home, label: "Home" },
    { id: "market", icon: TrendingUp, label: "Explore" },
    { id: "create", icon: PlusCircle, label: "Create" },
    { id: "rewards", icon: Award, label: "Rewards" },
    // Added Portfolio since you are logged in
    { id: "portfolio", icon: Wallet, label: "portfolio" },
    { id: "profile", icon: User, label: "Profile" },
  ];

  const navItems = isLoggedIn ? authenticatedNavItems : publicNavItems;

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#0a0a0f] border-t border-[#1F87FC]/20 px-2 py-2 z-50">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-all ${
              activeScreen === item.id
                ? "text-[#1F87FC]"
                : "text-muted-foreground"
            }`}
          >
            <item.icon
              className={`w-6 h-6 ${
                activeScreen === item.id
                  ? "drop-shadow-[0_0_8px_rgba(31,135,252,0.8)]"
                  : ""
              }`}
            />
            <span className="text-xs">{item.label}</span>
          </button>
        ))}

        {/* Connect Button (Only visible if NOT logged in) */}
        {!isLoggedIn && (
          <button
            onClick={() => connectWallet()} // <--- WIRED TO CONTEXT
            className="flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-all text-[#1F87FC]"
          >
            <div className="w-6 h-6 rounded-full bg-gradient-to-r from-[#1F87FC] to-[#00ffcc] flex items-center justify-center drop-shadow-[0_0_8px_rgba(31,135,252,0.8)]">
              <LogIn className="w-4 h-4 text-white" />
            </div>
            <span className="text-xs">Connect</span>
          </button>
        )}
      </div>
    </div>
  );
}
