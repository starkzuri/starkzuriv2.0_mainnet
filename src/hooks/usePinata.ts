import { useState } from "react";
import { PinataSDK } from "pinata";
import { toast } from "sonner";

// 🟢 Initialize SDK with the Key directly in the frontend
const pinata = new PinataSDK({
  pinataJwt: import.meta.env.VITE_JWT_SECRET,
  pinataGateway: import.meta.env.VITE_PINATA_GATEWAY_URL,
});

export const usePinata = () => {
  const [uploading, setUploading] = useState(false);

  const uploadFile = async (file: File): Promise<string | null> => {
    setUploading(true);

    try {
      // 🟢 DIRECT UPLOAD (No Server needed)
      // "public" means we use the public upload endpoint, not that the file is public immediately
      const upload = await pinata.upload.public.file(file);

      // Construct the final URL using your Gateway
      // This helper ensures it uses your fast/cached Gateway URL
      const finalUrl = await pinata.gateways.public.convert(upload.cid);

      return finalUrl;
    } catch (error) {
      console.error("Upload Error:", error);
      toast.error("Upload failed");
      return null;
    } finally {
      setUploading(false);
    }
  };

  return { uploadFile, uploading };
};
