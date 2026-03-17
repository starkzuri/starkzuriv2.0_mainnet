

// BottomNav.tsx
import { Home, TrendingUp, PlusCircle, User, Award, LogIn, Wallet } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { PrivyLogin } from "./auth/PrivyLogin";

interface BottomNavProps {
  activeScreen: string;
  onNavigate: (screen: string) => void;
}

export function BottomNav({ activeScreen, onNavigate }: BottomNavProps) {
  const { address, connect } = useAuth();
  const isLoggedIn = !!address;

  const publicNavItems = [
    { id: "home", icon: Home, label: "Home" },
    { id: "market", icon: TrendingUp, label: "Explore" },
  ];

  const authenticatedNavItems = [
    { id: "home", icon: Home, label: "Home" },
    { id: "market", icon: TrendingUp, label: "Explore" },
    { id: "create", icon: PlusCircle, label: "Create" },
    { id: "rewards", icon: Award, label: "Rewards" },
    { id: "portfolio", icon: Wallet, label: "Portfolio" },
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
              activeScreen === item.id ? "text-[#1F87FC]" : "text-muted-foreground"
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

        {!isLoggedIn && (
          <>
            {/* Web3 wallet connect */}
            <button
              onClick={() => connect("web3")}
              className="flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-all text-[#1F87FC]"
            >
              <div className="w-6 h-6 rounded-full bg-gradient-to-r from-[#1F87FC] to-[#00ffcc] flex items-center justify-center drop-shadow-[0_0_8px_rgba(31,135,252,0.8)]">
                <LogIn className="w-4 h-4 text-white" />
              </div>
              <span className="text-xs">Wallet</span>
            </button>

            {/* Privy — key icon nav variant */}
            <PrivyLogin variant="nav" />
          </>
        )}

      </div>
    </div>
  );
}
