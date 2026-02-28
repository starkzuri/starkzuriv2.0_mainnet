import {
  Home,
  TrendingUp,
  PlusCircle,
  Wallet,
  User,
  Award,
  LogIn,
  UserPlus,
  LogOut,
} from "lucide-react";
import { useWallet } from "../context/WalletContext";
import Logo from "../assets/ST4.png";
import NetworkSwitcher from "./NetworkSwitcher";

interface SidebarProps {
  activeScreen: string;
  onNavigate: (screen: string) => void;
}

export function Sidebar({ activeScreen, onNavigate }: SidebarProps) {
  // 1. Get Real Blockchain State
  const { account, connectWallet, disconnectWallet, address } = useWallet();
  const isLoggedIn = !!account;

  // 2. Navigation Items
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
  console.log(isLoggedIn);

  // Helper to format address
  const shortAddress = address
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : "";

  return (
    <div className="hidden lg:flex flex-col w-64 h-screen bg-[#0a0a0f] border-r border-[#1F87FC]/20 p-4 sticky top-0">
      {/* Logo */}
      <div className="flex items-center gap-3 mb-8 px-2">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br  flex items-center justify-center">
          {/* <Award className="w-6 h-6 text-white" /> */}
          <img src={Logo} />
        </div>
        <div>
          <h2 className="text-foreground font-bold">StarkZuri</h2>
          <p className="text-xs text-muted-foreground">Predict · Trade · Win</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              activeScreen === item.id
                ? "bg-[#1F87FC]/20 border border-[#1F87FC] text-[#1F87FC] shadow-[0_0_20px_rgba(31,135,252,0.3)]"
                : "text-muted-foreground hover:text-foreground hover:bg-[#1a1a24] border border-transparent"
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
      <NetworkSwitcher defaultNetwork="mainnet" />

      {/* Footer: Auth Logic */}
      {!isLoggedIn ? (
        <div className="space-y-3 pt-4 border-t border-border">
          <button
            onClick={() => connectWallet()}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-[#1F87FC] to-[#00ffcc] rounded-lg transition-all hover:shadow-[0_0_20px_rgba(31,135,252,0.5)] border border-[#1F87FC]"
          >
            <LogIn className="w-5 h-5 text-white" />
            <span className="text-white font-medium">Connect Wallet</span>
          </button>
          <p className="text-xs text-center text-muted-foreground px-2 pt-2">
            Connect your wallet to start
          </p>
        </div>
      ) : (
        <div className="space-y-4 pt-4 border-t border-border">
          {/* User Profile & Disconnect */}
          <div className="px-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm font-mono text-muted-foreground">
                {shortAddress}
              </span>
            </div>
            <button
              onClick={() => disconnectWallet()}
              className="text-muted-foreground hover:text-red-500 transition-colors"
              title="Disconnect"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          {/* Stats (Your original design) */}
          {/* <div className="px-2 text-xs text-muted-foreground bg-[#1a1a24] p-3 rounded-lg border border-[#1F87FC]/10">
            <div className="flex justify-between mb-1">
              <span>Active Markets</span>
              <span className="text-[#1F87FC]">1,248</span>
            </div>
            <div className="flex justify-between">
              <span>24h Volume</span>
              <span className="text-[#1F87FC]">$2.4M</span>
            </div>
          </div> */}
        </div>
      )}
    </div>
  );
}
