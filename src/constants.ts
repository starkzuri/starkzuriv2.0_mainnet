import {
  ChainId,
  fromAddress,
  sepoliaTokens,
  mainnetTokens,
  type Token,
  type StakingConfig,
} from "starkzap";
import type { NetworkConfig } from "./types";

export const NETWORKS: NetworkConfig[] = [
  {
    name: "Mainnet",
    chainId: ChainId.MAINNET,
    rpcUrl: "https://api.cartridge.gg/x/starknet/mainnet/rpc/v0_9",
  },
  {
    name: "Sepolia",
    chainId: ChainId.SEPOLIA,
    rpcUrl: "https://api.cartridge.gg/x/starknet/sepolia/rpc/v0_9",
  },
  
];

export const PRIVY_SERVER_URL =
  (import.meta as unknown as { env?: Record<string, string> }).env
    ?.VITE_PRIVY_SERVER_URL ?? "http://localhost:3001";

export const PAYMASTER_PROXY_URL = PRIVY_SERVER_URL
  ? `${PRIVY_SERVER_URL.replace(/\/$/, "")}/api/paymaster`
  : "";

/** Tokens available for gifting per network */
export function getGiftTokens(chainId: ChainId): Token[] {
  if (chainId.isSepolia()) {
    return [sepoliaTokens.ETH, sepoliaTokens.STRK, sepoliaTokens.USDC];
  }
  return [
    mainnetTokens.WBTC,
    mainnetTokens.ETH,
    mainnetTokens.STRK,
    mainnetTokens.USDC,
  ];
}

export function getStakingConfig(chainId: ChainId): StakingConfig {
  if (chainId.isMainnet()) {
    return {
      contract: fromAddress(
        "0x00ca1702e64c81d9a07b86bd2c540188d92a2c73cf5cc0e508d949015e7e84a7"
      ),
    };
  }
  return {
    contract: fromAddress(
      "0x03745ab04a431fc02871a139be6b93d9260b0ff3e779ad9c8b377183b23109f1"
    ),
  };
}

export function getExplorerUrl(txHash: string, chainId: ChainId): string {
  const baseUrl = chainId.isSepolia()
    ? "https://sepolia.voyager.online/tx"
    : "https://voyager.online/tx";
  return `${baseUrl}/${txHash}`;
}
