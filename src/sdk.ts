import { StarkSDK, type ChainId } from "starkzap";
import { NETWORKS, getStakingConfig } from "./constants";

const sdkCache = new Map<string, StarkSDK>();

export function createSDK(chainId: ChainId): StarkSDK {
  const key = chainId.toLiteral();
  const cached = sdkCache.get(key);
  if (cached) return cached;

  const network = NETWORKS.find((n) => n.chainId.toLiteral() === key);
  if (!network) throw new Error(`Unsupported network: ${key}`);

  // Use relative URL so Vite proxy forwards to the backend
  const paymasterNodeUrl =
    import.meta.env.VITE_PRIVY_SERVER_URL + "/api/paymaster";

  const sdk = new StarkSDK({
    rpcUrl: network.rpcUrl,
    chainId: network.chainId,
    paymaster: { nodeUrl: paymasterNodeUrl },
    staking: getStakingConfig(chainId),
  });

  sdkCache.set(key, sdk);
  return sdk;
}
