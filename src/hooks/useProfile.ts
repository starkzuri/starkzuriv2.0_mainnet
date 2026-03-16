import { useCallback } from "react";
import { CallData, shortString, byteArray, RpcProvider } from "starknet";
import { toast } from "sonner";
import { useAuth } from "./useAuth"; // 🟢 1. Swapped to your unified God Hook

const PROFILE_ADDRESS = import.meta.env.VITE_PROFILE_ADDRESS;





// useProfile.ts
export const useProfile = () => {
  const { execute, isConnected } = useAuth();  // ← no more account

  const updateProfile = useCallback(
    async (username, displayName, bio, avatarUrl, referrer) => {
      if (!isConnected || !PROFILE_ADDRESS) {
        toast.error("Wallet or Contract missing");
        return;
      }

      try {
        toast.loading("Updating Profile...");

        const cleanName = username.replace("@", "").substring(0, 30);
        const usernameFelt = shortString.encodeShortString(cleanName);
        const displayBytes = byteArray.byteArrayFromString(displayName || "");
        const bioBytes = byteArray.byteArrayFromString(bio || "");
        const avatarBytes = byteArray.byteArrayFromString(avatarUrl || "");
        const validReferrer = referrer?.startsWith("0x") ? referrer : "0x0";

        const myCall = {
          contractAddress: PROFILE_ADDRESS,
          entrypoint: "set_profile",
          calldata: CallData.compile([
            usernameFelt,
            displayBytes,
            bioBytes,
            avatarBytes,
            validReferrer,
          ]),
        };

        // ✅ works for both Privy and web3 wallets
        const { transaction_hash } = await execute([myCall]);

        toast.dismiss();
        toast.success("Sent! Waiting for Indexer...");
        localStorage.removeItem("starkzuri_referrer");
        return transaction_hash;
      } catch (error: any) {
        toast.dismiss();
        toast.error("Update failed: " + error.message);
      }
    },
    [execute, isConnected]
  );

  return { updateProfile };
};