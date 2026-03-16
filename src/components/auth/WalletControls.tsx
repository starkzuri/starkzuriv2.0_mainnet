import { ChainId } from "starkzap";
import { useAuth } from "../../hooks/useAuth";
import { useWalletStore } from "../../stores/wallet";
import { TruncatedAddress } from "../common/TruncatedAddress";

export function WalletControls() {
  const { wallet, disconnect, chainId, isDeployed } = useAuth();
  const { switchNetwork } = useWalletStore();

  if (!wallet) return null;

  const toggleNetwork = () => {
    switchNetwork(chainId.isSepolia() ? ChainId.MAINNET : ChainId.SEPOLIA);
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <button
        onClick={toggleNetwork}
        style={{
          padding: "6px 12px",
          background: chainId.isSepolia() ? "var(--warning)" : "var(--success)",
          color: "#000",
          borderRadius: "var(--radius-sm)",
          fontSize: 12,
          fontWeight: 600,
        }}
      >
        {chainId.isSepolia() ? "Sepolia" : "Mainnet"}
      </button>

      {isDeployed === false && (
        <span
          style={{
            padding: "6px 12px",
            background: "var(--error-bg)",
            color: "var(--error)",
            borderRadius: "var(--radius-sm)",
            fontSize: 12,
          }}
        >
          Not Deployed
        </span>
      )}

      <TruncatedAddress address={wallet.address} />

      <button
        onClick={disconnect}
        style={{
          padding: "6px 16px",
          background: "var(--bg-hover)",
          border: "1px solid var(--border)",
          color: "var(--text-muted)",
          borderRadius: "var(--radius-sm)",
          fontSize: 13,
        }}
      >
        Disconnect
      </button>
    </div>
  );
}