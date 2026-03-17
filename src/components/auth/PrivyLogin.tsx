
// PrivyLogin.tsx
import { useCallback, useEffect, useRef, useState } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { useAuth } from "../../hooks/useAuth";
import { Key } from "lucide-react";

interface PrivyLoginProps {
  variant?: "default" | "nav";
}

export function PrivyLogin({ variant = "default" }: PrivyLoginProps) {
  const { connect, isConnecting } = useAuth();
  const { login, authenticated, ready, getAccessToken } = usePrivy();
  const [error, setError] = useState<string | null>(null);
  const connectingRef = useRef(false);

  const onboardWithToken = useCallback(async () => {
    if (connectingRef.current) return;
    connectingRef.current = true;
    try {
      const accessToken = await getAccessToken();
      if (!accessToken) throw new Error("Failed to get access token from Privy");
      await connect("privy", accessToken);
    } catch (err) {
      setError(String(err));
      connectingRef.current = false;
    }
  }, [getAccessToken, connect]);

  useEffect(() => {
    if (ready && authenticated) onboardWithToken();
  }, [ready, authenticated, onboardWithToken]);

  const handleLogin = () => {
    setError(null);
    if (authenticated) {
      onboardWithToken();
    } else {
      login({
        onComplete: () => onboardWithToken(),
        onError: (err) => setError(String(err)),
      });
    }
  };

  // ── Nav-item variant ──────────────────────────────────────────────────
  if (variant === "nav") {
    return (
      <button
        onClick={handleLogin}
        disabled={isConnecting || !ready}
        className={`flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-all
          ${isConnecting || !ready
            ? "opacity-50 cursor-not-allowed text-muted-foreground"
            : "text-[#1F87FC]"
          }`}
      >
        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-[#a855f7] to-[#1F87FC] flex items-center justify-center drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]">
          <Key className="w-3.5 h-3.5 text-white" />
        </div>
        <span className="text-xs">
          {isConnecting ? "..." : "Privy"}
        </span>
      </button>
    );
  }

  // ── Default full-width variant ────────────────────────────────────────
  return (
    <>
      <button
        onClick={handleLogin}
        disabled={isConnecting || !ready}
        style={{
          width: "100%",
          padding: "12px 16px",
          background: "rgba(255, 255, 255, 0.06)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          color: "#ffffff",
          border: "1px solid rgba(255, 255, 255, 0.12)",
          borderRadius: "12px",
          fontSize: 15,
          fontWeight: 500,
          cursor: isConnecting || !ready ? "not-allowed" : "pointer",
          opacity: isConnecting || !ready ? 0.5 : 1,
          display: "flex",
          alignItems: "center",
          gap: 12,
          transition: "background 0.2s, border-color 0.2s",
        }}
        onMouseEnter={e => {
          if (isConnecting || !ready) return;
          const btn = e.currentTarget as HTMLButtonElement;
          btn.style.background = "rgba(255, 255, 255, 0.1)";
          btn.style.borderColor = "rgba(255, 255, 255, 0.22)";
        }}
        onMouseLeave={e => {
          const btn = e.currentTarget as HTMLButtonElement;
          btn.style.background = "rgba(255, 255, 255, 0.06)";
          btn.style.borderColor = "rgba(255, 255, 255, 0.12)";
        }}
      >
        <span style={{
          width: 32, height: 32, borderRadius: "8px",
          background: "rgba(255,255,255,0.1)",
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="4" width="20" height="16" rx="3" stroke="white" strokeWidth="1.8"/>
            <path d="M2 8l9.293 5.707a1 1 0 001.414 0L22 8" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
        </span>
        <span style={{ flex: 1, textAlign: "center", marginRight: 32 }}>
          {isConnecting ? "Connecting..." : "Connect Privy"}
        </span>
      </button>

      {error && (
        <p style={{ color: "var(--error, #f87171)", fontSize: 13, marginTop: 8 }}>
          {error}
        </p>
      )}
    </>
  );
}