import {
  Home,
  TrendingUp,
  PlusCircle,
  User,
  Award,
  LogIn,
  Wallet,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { PrivyLogin } from "./auth/PrivyLogin";

interface BottomNavProps {
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
  { id: "portfolio", icon: Wallet, label: "Portfolio" },
  { id: "rewards", icon: Award, label: "Rewards" },
  { id: "profile", icon: User, label: "Profile" },
];

export function BottomNav({ activeScreen, onNavigate }: BottomNavProps) {
  const { address, connect } = useAuth();
  const isLoggedIn = !!address;

  const navItems = isLoggedIn ? AUTH_NAV : PUBLIC_NAV;

  return (
    <nav
      className="lg:hidden"
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        paddingBottom: "env(safe-area-inset-bottom)",
        background: "#0a0a0f",
        borderTop: "1px solid rgba(31,135,252,0.1)",
        zIndex: 50,
        fontFamily: "inherit",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "stretch",
          height: 56,
          width: "100%",
          overflow: "hidden",
        }}
      >
        {navItems.map((item) => {
          const active = activeScreen === item.id;
          const isCreate = item.id === "create";

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              style={{
                flex: 1,
                minWidth: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 2,
                border: "none",
                background: "none",
                cursor: "pointer",
                fontFamily: "inherit",
                color: active ? "#1F87FC" : "#3a4a5e",
                position: "relative",
                transition: "color 0.15s",
                padding: "0 4px",
              }}
            >
              {isCreate ? (
                <>
                  <div
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: "50%",
                      background: "#1F87FC",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 0 12px rgba(31,135,252,0.4)",
                      flexShrink: 0,
                    }}
                  >
                    <item.icon
                      style={{ width: 16, height: 16, color: "#fff" }}
                    />
                  </div>
                  <span
                    style={{
                      fontSize: 9,
                      fontWeight: 600,
                      color: "#1F87FC",
                      lineHeight: 1,
                      whiteSpace: "nowrap",
                    }}
                  >
                    Create
                  </span>
                </>
              ) : (
                <>
                  {active && (
                    <span
                      style={{
                        position: "absolute",
                        top: 4,
                        left: "50%",
                        transform: "translateX(-50%)",
                        width: 3,
                        height: 3,
                        borderRadius: "50%",
                        background: "#1F87FC",
                        boxShadow: "0 0 5px rgba(31,135,252,0.8)",
                      }}
                    />
                  )}
                  <item.icon style={{ width: 18, height: 18, flexShrink: 0 }} />
                  <span
                    style={{
                      fontSize: 9,
                      fontWeight: active ? 600 : 400,
                      lineHeight: 1,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      maxWidth: "100%",
                    }}
                  >
                    {item.label}
                  </span>
                </>
              )}
            </button>
          );
        })}

        {!isLoggedIn && (
          <>
            <button
              onClick={() => connect("web3")}
              style={{
                flex: 1,
                minWidth: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 2,
                border: "none",
                background: "none",
                cursor: "pointer",
                fontFamily: "inherit",
                color: "#1F87FC",
                padding: "0 4px",
              }}
            >
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: "50%",
                  background: "rgba(31,135,252,0.1)",
                  border: "1px solid rgba(31,135,252,0.3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <LogIn style={{ width: 14, height: 14 }} />
              </div>
              <span
                style={{
                  fontSize: 9,
                  fontWeight: 600,
                  lineHeight: 1,
                  whiteSpace: "nowrap",
                }}
              >
                Wallet
              </span>
            </button>

            <div
              style={{
                flex: 1,
                minWidth: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
              }}
            >
              <PrivyLogin variant="nav" />
            </div>
          </>
        )}
      </div>
    </nav>
  );
}
