import { create } from "zustand";
import {
  type WalletInterface,
  type ChainId,
  OnboardStrategy,
  ArgentPreset,
  type StarkSDK,
} from "starkzap";
import type { AuthStrategy } from "../types";
import { NETWORKS } from "../constants";
import { createSDK } from "../sdk";
import { PRIVY_SERVER_URL } from "../constants";

interface WalletState {
  sdk: StarkSDK | null;
  wallet: WalletInterface | null;
  chainId: ChainId;
  authStrategy: AuthStrategy | null;
  isConnecting: boolean;
  isDeployed: boolean | null;
  logs: string[];

  initialize: (chainId: ChainId) => void;
  connectCartridge: () => Promise<void>;
  connectPrivy: (accessToken: string) => Promise<void>;
  disconnect: () => void;
  checkDeploymentStatus: () => Promise<void>;
  deploy: () => Promise<void>;
  switchNetwork: (chainId: ChainId) => void;
  addLog: (message: string) => void;
}

const STRK_CONTRACT =
  "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d";

const defaultChainId = NETWORKS[0].chainId;

export const useWalletStore = create<WalletState>((set, get) => ({
  sdk: null,
  wallet: null,
  chainId: defaultChainId,
  authStrategy: null,
  isConnecting: false,
  isDeployed: null,
  logs: [],

  initialize: (chainId) => {
    const sdk = createSDK(chainId);
    set({ sdk, chainId, logs: [`SDK initialized for ${chainId.toLiteral()}`] });
  },

  connectCartridge: async () => {
    const { chainId, addLog } = get();
    let { sdk } = get();
    if (!sdk) {
      sdk = createSDK(chainId);
      set({ sdk });
    }

    set({ isConnecting: true });
    addLog("Connecting via Cartridge...");

    try {
      const onboard = await sdk.onboard({
        strategy: OnboardStrategy.Cartridge,
        deploy: "never",
        feeMode: "user_pays",
        cartridge: {
          policies: [{ target: STRK_CONTRACT, method: "transfer" }],
        },
      });

      set({
        wallet: onboard.wallet,
        authStrategy: "cartridge",
      });
      addLog(
        `Connected: ${onboard.wallet.address.slice(0, 6)}...${onboard.wallet.address.slice(-4)}`
      );
      await get().checkDeploymentStatus();
    } catch (err) {
      addLog(`Cartridge connection failed: ${err}`);
      throw err;
    } finally {
      set({ isConnecting: false });
    }
  },

  connectPrivy: async (accessToken) => {
    const { chainId, addLog } = get();
    let { sdk } = get();
    if (!sdk) {
      sdk = createSDK(chainId);
      set({ sdk });
    }

    set({ isConnecting: true });
    addLog("Connecting via Privy...");

    try {
      // Check server health (proxied via Vite to localhost:3001)
      const healthRes = await fetch(PRIVY_SERVER_URL + "/api/health");
      if (!healthRes.ok)
        throw new Error(
          "Privy server not running. Start it with: cd examples/server && npx tsx server.ts"
        );

      // Get or create wallet via authenticated endpoint
      const walletRes = await fetch(PRIVY_SERVER_URL + "/api/wallet/starknet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!walletRes.ok) {
        const err = await walletRes.json();
        throw new Error(err.details || err.error || "Failed to get wallet");
      }

      const { wallet: walletData } = await walletRes.json();

      const authHeaders = { Authorization: `Bearer ${accessToken}` };

      console.log(PRIVY_SERVER_URL)
      const onboard = await sdk.onboard({
        strategy: OnboardStrategy.Privy,
        deploy: "never",
        feeMode: "sponsored",
        accountPreset: ArgentPreset,
        privy: {
          resolve: async () => ({
            walletId: walletData.id,
            publicKey: walletData.publicKey,
            serverUrl: `${PRIVY_SERVER_URL}/api/wallet/sign`,
            headers: authHeaders,
          }),
        },
      });

      set({
        wallet: onboard.wallet,
        authStrategy: "privy",
      });
      addLog(
        `Connected: ${onboard.wallet.address.slice(0, 6)}...${onboard.wallet.address.slice(-4)}`
      );
      await get().checkDeploymentStatus();
    } catch (err) {
      addLog(`Privy connection failed: ${err}`);
      throw err;
    } finally {
      set({ isConnecting: false });
    }
  },

  disconnect: () => {
    set({
      wallet: null,
      authStrategy: null,
      isDeployed: null,
      logs: [],
    });
  },

  checkDeploymentStatus: async () => {
    const { wallet, addLog } = get();
    if (!wallet) return;

    try {
      const deployed = await wallet.isDeployed();
      set({ isDeployed: deployed });
      addLog(`Account ${deployed ? "deployed" : "not deployed"}`);
    } catch (err) {
      addLog(`Failed to check status: ${err}`);
    }
  },

  deploy: async () => {
    const { wallet, addLog } = get();
    if (!wallet) return;

    set({ isConnecting: true });
    addLog("Deploying account...");

    try {
      const tx = await wallet.deploy();
      addLog(`Deploy tx: ${tx.hash.slice(0, 10)}...`);
      await tx.wait();
      addLog("Account deployed!");
      set({ isDeployed: true });
    } catch (err) {
      addLog(`Deploy failed: ${err}`);
      throw err;
    } finally {
      set({ isConnecting: false });
    }
  },

  switchNetwork: (chainId) => {
    const sdk = createSDK(chainId);
    set({
      sdk,
      chainId,
      wallet: null,
      authStrategy: null,
      isDeployed: null,
      logs: [`Switched to ${chainId.isSepolia() ? "Sepolia" : "Mainnet"}`],
    });
  },

  addLog: (message) =>
    set((state) => ({
      logs: [...state.logs, `[${new Date().toLocaleTimeString()}] ${message}`],
    })),
}));
