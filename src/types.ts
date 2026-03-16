import type { Token, ChainId } from "starkzap";

export type AuthStrategy = "cartridge" | "privy";

export interface NetworkConfig {
  name: string;
  chainId: ChainId;
  rpcUrl: string;
}