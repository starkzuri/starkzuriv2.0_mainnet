import {
  Home,
  TrendingUp,
  PlusCircle,
  Wallet,
  User,
  Award,
  LogIn,
  LogOut,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import Logo from "../assets/ST4.png";
import NetworkSwitcher from "./NetworkSwitcher";
import { PrivyLogin } from "./auth/PrivyLogin";
import { WalletControls } from "./auth/WalletControls";

interface SidebarProps {
  activeScreen: string;
  onNavigate: (screen: string) => void;
}

const PUBLIC_NAV = [
  { id: "home", icon: Home, label: "Home" },
  { id: "market", icon: TrendingUp, label: "Explore" },
];

const AUTH_NAV = [
  { id: "home", icon: Home, label: "Home" },
  { id: "market", icon: TrendingUp, label: "Explore" },
  { id: "create", icon: PlusCircle, label: "Create" },
  { id: "rewards", icon: Award, label: "Rewards" },
  { id: "portfolio", icon: Wallet, label: "Portfolio" },
  { id: "profile", icon: User, label: "Profile" },
];

export function Sidebar({ activeScreen, onNavigate }: SidebarProps) {
  const { isConnected, address, connect, disconnect } = useAuth();

  const navItems = isConnected ? AUTH_NAV : PUBLIC_NAV;
  const shortAddress = address
    ? `${address.slice(0, 6)}…${address.slice(-4)}`
    : "";

  return (
    <div
      className="hidden lg:flex"
      style={{
        width: 220,
        height: "100vh",
        background: "#0a0a0f",
        borderRight: "1px solid rgba(31,135,252,0.12)",
        padding: "20px 12px",
        flexDirection: "column",
        position: "sticky",
        top: 0,
        fontFamily: "inherit",
        flexShrink: 0,
      }}
    >
      {/* ── Logo ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "0 6px 24px",
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            overflow: "hidden",
            flexShrink: 0,
            background: "#12121f",
            border: "1px solid rgba(31,135,252,0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src={Logo}
            alt="StarkZuri"
            style={{ width: 28, height: 28, objectFit: "contain" }}
          />
        </div>
        <div>
          <div
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: "#e2e8f0",
              lineHeight: 1.2,
            }}
          >
            StarkZuri
          </div>
          <div style={{ fontSize: 10, color: "#3a4a5e", marginTop: 1 }}>
            Predict · Trade · Win
          </div>
        </div>
      </div>

      {/* ── Nav ── */}
      <nav
        style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}
      >
        {navItems.map((item) => {
          const active = activeScreen === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "9px 12px",
                borderRadius: 10,
                border: "none",
                cursor: "pointer",
                fontFamily: "inherit",
                fontSize: 13,
                fontWeight: active ? 600 : 400,
                transition: "all 0.15s",
                background: active ? "rgba(31,135,252,0.1)" : "transparent",
                color: active ? "#1F87FC" : "#4a5568",
                boxShadow: active
                  ? "inset 0 0 0 1px rgba(31,135,252,0.3)"
                  : "none",
                textAlign: "left",
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                  e.currentTarget.style.color = "#94a3b8";
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "#4a5568";
                }
              }}
            >
              <item.icon style={{ width: 16, height: 16, flexShrink: 0 }} />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* ── Network switcher ── */}
      <div style={{ marginBottom: 12 }}>
        <NetworkSwitcher defaultNetwork="mainnet" />
      </div>

      {/* ── Auth footer ── */}
      <div
        style={{
          borderTop: "1px solid rgba(255,255,255,0.04)",
          paddingTop: 14,
        }}
      >
        {!isConnected ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {/* Web3 wallet */}
            <button
              onClick={() => connect("web3")}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 7,
                padding: "10px 0",
                background: "#1F87FC",
                border: "none",
                borderRadius: 10,
                fontSize: 13,
                fontWeight: 600,
                color: "#fff",
                cursor: "pointer",
                fontFamily: "inherit",
                transition: "opacity 0.15s",
                boxShadow: "0 0 16px rgba(31,135,252,0.25)",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.88")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              <LogIn style={{ width: 14, height: 14 }} />
              Connect wallet
            </button>

            {/* Privy / social */}
            <PrivyLogin />

            <p
              style={{
                fontSize: 10,
                color: "#3a4a5e",
                textAlign: "center",
                margin: 0,
                paddingTop: 2,
              }}
            >
              Connect your wallet to start
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {/* Connected address row */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "8px 10px",
                background: "rgba(0,255,136,0.04)",
                border: "1px solid rgba(0,255,136,0.12)",
                borderRadius: 10,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <span
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    background: "#00ff88",
                    boxShadow: "0 0 5px rgba(0,255,136,0.5)",
                    display: "inline-block",
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontSize: 11,
                    color: "#64748b",
                    fontVariantNumeric: "tabular-nums",
                    letterSpacing: "0.01em",
                  }}
                >
                  {shortAddress}
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <WalletControls />
                <button
                  onClick={() => disconnect()}
                  title="Disconnect"
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#3a4a5e",
                    display: "flex",
                    alignItems: "center",
                    padding: 2,
                    borderRadius: 4,
                    transition: "color 0.15s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "#ff3366")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "#3a4a5e")
                  }
                >
                  <LogOut style={{ width: 13, height: 13 }} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
