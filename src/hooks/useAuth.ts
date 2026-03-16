


// useAuth.ts
import { useCallback } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { useWallet } from "../context/WalletContext";
import { useWalletStore } from "../stores/wallet";

export type AuthStrategy = "web3" | "privy" | "none";

export function useAuth() {
  const {
    account: web3Account,
    address: web3Address,
    connectWallet: connectWeb3,
    disconnectWallet: disconnectWeb3,
    chainId: web3ChainId
  } = useWallet();

  const { logout: privyLogout } = usePrivy();
  const {
    wallet: privyWallet,
    isDeployed,
    deploy,
    connectPrivy,
    disconnect: disconnectStore
  } = useWalletStore();

  const activeAddress = web3Address || privyWallet?.address;
  const activeChainId = web3ChainId || privyWallet?.chainId;
  const isConnected = !!activeAddress;

  const authStrategy: AuthStrategy = web3Account
    ? "web3"
    : (privyWallet ? "privy" : "none");

  // ✅ THE FIX: unified execute that routes correctly per strategy
  const execute = useCallback(
  async (calls: any[]) => {
    console.log("=== execute called ===");
    console.log("authStrategy:", authStrategy);
    console.log("web3Account:", web3Account);
    console.log("privyWallet:", privyWallet);
    console.log("privyWallet.execute:", typeof privyWallet?.execute);
    console.log("calls:", calls);

    if (web3Account) {
      console.log("→ routing to web3Account.execute");
      return web3Account.execute(calls);
    }

    if (privyWallet) {
      console.log("→ routing to privyWallet.execute");
      return privyWallet.execute(calls);
    }

    throw new Error("No wallet connected");
  },
  [web3Account, privyWallet]
);

  const connect = useCallback(
    async (strategy: "web3" | "privy", accessToken?: string) => {
      if (strategy === "web3") {
        await connectWeb3();
      } else if (strategy === "privy") {
        if (!accessToken) throw new Error("Access token required for Privy login");
        await connectPrivy(accessToken);
      }
    },
    [connectWeb3, connectPrivy]
  );

  const disconnect = useCallback(async () => {
    try {
      await disconnectWeb3();
      await privyLogout();
      disconnectStore();
    } catch (error) {
      console.error("Disconnect cleanup error:", error);
    }
  }, [disconnectWeb3, privyLogout, disconnectStore]);

  return {
    isConnected,
    address: activeAddress,
    chainId: activeChainId,
    authStrategy,
    isDeployed,
    connect,
    disconnect,
    deploy,
    execute,           // ✅ use this everywhere instead of account.execute()
    // account is intentionally NOT exported — it was causing the bug
  };
}