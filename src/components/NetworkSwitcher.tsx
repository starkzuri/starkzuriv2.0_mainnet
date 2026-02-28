import { useState, useRef, useEffect } from "react";
import { ChevronDown, Radio, Zap } from "lucide-react";

const networks = [
  {
    id: "mainnet",
    label: "Mainnet",
    description: "Production network",
    icon: Zap,
    color: "#1F87FC",
    dot: "#22c55e",
  },
  {
    id: "testnet",
    label: "Testnet",
    description: "Test environment",
    icon: Radio,
    color: "#a78bfa",
    dot: "#f59e0b",
  },
];

export default function NetworkSwitcher({ defaultNetwork = "mainnet" }) {
  const [selected, setSelected] = useState(
    networks.find((n) => n.id === defaultNetwork),
  );
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const Icon = selected.icon;

  return (
    <div ref={ref} style={{ position: "relative", width: "100%" }}>
      {/* Trigger Button */}
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          padding: "12px 16px",
          background: "#0f0f1a",
          border: `1px solid ${open ? selected.color : selected.color + "66"}`,
          borderRadius: "8px",
          color: selected.color,
          cursor: "pointer",
          transition: "all 0.2s ease",
          fontSize: "14px",
          fontWeight: 500,
          position: "relative",
          outline: "none",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = selected.color + "1a";
          e.currentTarget.style.borderColor = selected.color;
        }}
        onMouseLeave={(e) => {
          if (!open) {
            e.currentTarget.style.background = "#0f0f1a";
            e.currentTarget.style.borderColor = selected.color + "66";
          }
        }}
      >
        {/* Live dot */}
        <span
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: selected.dot,
              display: "block",
              boxShadow: `0 0 6px ${selected.dot}`,
            }}
          />
          <span
            style={{
              position: "absolute",
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: selected.dot,
              opacity: 0.4,
              animation: "ping 1.5s cubic-bezier(0,0,0.2,1) infinite",
            }}
          />
        </span>

        <Icon style={{ width: 18, height: 18 }} />
        <span style={{ flex: 1, textAlign: "center" }}>{selected.label}</span>
        <ChevronDown
          style={{
            width: 16,
            height: 16,
            transition: "transform 0.2s ease",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            opacity: 0.7,
          }}
        />
      </button>

      {/* Dropdown */}
      <div
        style={{
          position: "absolute",
          bottom: "calc(100% + 6px)",
          left: 0,
          right: 0,
          background: "#0f0f1a",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "10px",
          overflow: "hidden",
          zIndex: 50,
          boxShadow: "0 16px 40px rgba(0,0,0,0.5)",
          opacity: open ? 1 : 0,
          transform: open
            ? "translateY(0) scaleY(1)"
            : "translateY(6px) scaleY(0.96)",
          transformOrigin: "bottom",
          transition: "opacity 0.15s ease, transform 0.15s ease",
          pointerEvents: open ? "all" : "none",
        }}
      >
        <div style={{ padding: "6px" }}>
          {networks.map((network) => {
            const NIcon = network.icon;
            const isActive = network.id === selected.id;
            return (
              <button
                key={network.id}
                onClick={() => {
                  setSelected(network);
                  setOpen(false);
                }}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "10px 12px",
                  background: isActive ? network.color + "18" : "transparent",
                  border: `1px solid ${isActive ? network.color + "44" : "transparent"}`,
                  borderRadius: "7px",
                  color: isActive ? network.color : "rgba(255,255,255,0.6)",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                  textAlign: "left",
                  marginBottom: "2px",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = network.color + "10";
                    e.currentTarget.style.color = network.color;
                    e.currentTarget.style.borderColor = network.color + "33";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "rgba(255,255,255,0.6)";
                    e.currentTarget.style.borderColor = "transparent";
                  }
                }}
              >
                {/* dot */}
                <span
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    background: isActive
                      ? network.dot
                      : "rgba(255,255,255,0.25)",
                    flexShrink: 0,
                    boxShadow: isActive ? `0 0 6px ${network.dot}` : "none",
                    transition: "all 0.15s ease",
                  }}
                />
                <NIcon style={{ width: 16, height: 16, flexShrink: 0 }} />
                <span style={{ flex: 1 }}>
                  <span
                    style={{ display: "block", fontSize: 13, fontWeight: 500 }}
                  >
                    {network.label}
                  </span>
                  <span
                    style={{
                      display: "block",
                      fontSize: 11,
                      opacity: 0.5,
                      marginTop: 1,
                    }}
                  >
                    {network.description}
                  </span>
                </span>
                {isActive && (
                  <span
                    style={{
                      fontSize: 10,
                      padding: "2px 7px",
                      borderRadius: 999,
                      background: network.color + "22",
                      color: network.color,
                      border: `1px solid ${network.color}44`,
                      fontWeight: 600,
                      letterSpacing: "0.04em",
                    }}
                  >
                    ACTIVE
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer hint */}
        <div
          style={{
            padding: "8px 14px",
            borderTop: "1px solid rgba(255,255,255,0.05)",
            fontSize: 11,
            color: "rgba(255,255,255,0.25)",
            textAlign: "center",
          }}
        >
          Select a network to switch
        </div>
      </div>

      <style>{`
        @keyframes ping {
          75%, 100% { transform: scale(2); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
