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
      if (!accessToken)
        throw new Error("Failed to get access token from Privy");
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

  const disabled = isConnecting || !ready;

  // ── Nav-item variant ──
  if (variant === "nav") {
    return (
      <button
        onClick={handleLogin}
        disabled={disabled}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 4,
          padding: "6px 10px",
          borderRadius: 8,
          border: "none",
          background: "none",
          cursor: disabled ? "not-allowed" : "pointer",
          opacity: disabled ? 0.5 : 1,
          color: "#1F87FC",
          fontFamily: "inherit",
          transition: "opacity 0.15s",
        }}
      >
        <div
          style={{
            width: 24,
            height: 24,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #a855f7, #1F87FC)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 0 8px rgba(168,85,247,0.5)",
          }}
        >
          <Key style={{ width: 12, height: 12, color: "#fff" }} />
        </div>
        <span style={{ fontSize: 10, color: "#4a5568" }}>
          {isConnecting ? "…" : "Privy"}
        </span>
      </button>
    );
  }

  // ── Default full-width variant ──
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <button
        onClick={handleLogin}
        disabled={disabled}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "9px 12px",
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: 10,
          fontSize: 13,
          fontWeight: 500,
          color: "#64748b",
          cursor: disabled ? "not-allowed" : "pointer",
          opacity: disabled ? 0.5 : 1,
          fontFamily: "inherit",
          transition: "background 0.15s, border-color 0.15s, color 0.15s",
          boxSizing: "border-box",
        }}
        onMouseEnter={(e) => {
          if (disabled) return;
          e.currentTarget.style.background = "rgba(168,85,247,0.06)";
          e.currentTarget.style.borderColor = "rgba(168,85,247,0.25)";
          e.currentTarget.style.color = "#a855f7";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "rgba(255,255,255,0.03)";
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
          e.currentTarget.style.color = "#64748b";
        }}
      >
        {/* Icon tile */}
        <span
          style={{
            width: 26,
            height: 26,
            borderRadius: 7,
            background:
              "linear-gradient(135deg, rgba(168,85,247,0.2), rgba(31,135,252,0.2))",
            border: "1px solid rgba(168,85,247,0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Key style={{ width: 12, height: 12, color: "#a855f7" }} />
        </span>

        <span style={{ flex: 1, textAlign: "left" }}>
          {isConnecting ? "Connecting…" : "Connect Privy"}
        </span>
      </button>

      {error && (
        <p
          style={{ fontSize: 11, color: "#ff3366", margin: 0, paddingLeft: 2 }}
        >
          {error}
        </p>
      )}
    </div>
  );
}
