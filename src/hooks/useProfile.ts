import { useCallback } from "react";
import { CallData, shortString, byteArray, RpcProvider } from "starknet";
import { toast } from "sonner";
import { useWallet } from "../context/WalletContext";

const PROFILE_ADDRESS = import.meta.env.VITE_PROFILE_ADDRESS;
// Use your reliable RPC
const ALCHEMY_URL = "import.meta.env.VITE_NODE_URL";

export const useProfile = () => {
  const { account } = useWallet();

  const updateProfile = useCallback(
    async (
      username: string,
      displayName: string,
      bio: string,
      avatarUrl: string,
      referrer: string | null // 🟢 Allow null
    ) => {
      if (!account || !PROFILE_ADDRESS) {
        toast.error("Wallet or Contract missing");
        return;
      }

      try {
        toast.loading("Updating Profile...");

        // 1. Provider Patch (Reliable RPC)
        const alchemyProvider = new RpcProvider({ nodeUrl: ALCHEMY_URL });
        (account as any).provider = alchemyProvider;

        // 2. Data Prep
        // A. Username (Felt)
        const cleanName = username.replace("@", "").substring(0, 30);
        const usernameFelt = shortString.encodeShortString(cleanName);

        // B. ByteArrays (Strings)
        // Ensure we handle empty strings correctly
        const displayBytes = byteArray.byteArrayFromString(displayName || "");
        const bioBytes = byteArray.byteArrayFromString(bio || "");
        const avatarBytes = byteArray.byteArrayFromString(avatarUrl || "");

        // C. Referrer (Address)
        // If null/empty/undefined, use "0" (as integer string) or "0x0"
        const validReferrer =
          referrer && referrer.startsWith("0x") ? referrer : "0x0";

        // 3. Compile Calldata (Strict Order)
        const myCall = {
          contractAddress: PROFILE_ADDRESS,
          entrypoint: "set_profile",
          calldata: CallData.compile([
            usernameFelt, // 1. username (felt252)
            displayBytes, // 2. display_name (ByteArray)
            bioBytes, // 3. bio (ByteArray)
            avatarBytes, // 4. avatar_uri (ByteArray)
            validReferrer, // 5. referrer (ContractAddress)
          ]),
        };

        console.log("🚀 Payload:", myCall);

        // 4. Execute
        const { transaction_hash } = await account.execute([myCall]);

        console.log("✅ Hash:", transaction_hash);
        toast.dismiss();
        toast.success("Sent! Waiting for Indexer...");

        localStorage.removeItem("starkzuri_referrer");
        return transaction_hash;
      } catch (error: any) {
        console.error("❌ Error:", error);
        toast.dismiss();
        toast.error("Update failed: " + error.message);
      }
    },
    [account]
  );

  return { updateProfile };
};
