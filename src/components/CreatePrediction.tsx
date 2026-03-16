

import { useState } from "react";
import { Calendar, Tag, Loader2, LogIn } from "lucide-react";
import { toast, Toaster } from "sonner";
import { CallData, RpcProvider, byteArray } from "starknet";

// 🟢 1. Swapped to the unified God Hook
import { useAuth } from "../hooks/useAuth"; 
import { MediaUploader } from "./MediaUploader";

export function CreatePrediction() {
  // 🟢 2. Pulling from useAuth instead of useWallet
  const { execute, address, isConnected, connect } = useAuth();

  const [question, setQuestion] = useState("");
  const [category, setCategory] = useState("");
  const [endDate, setEndDate] = useState("");

  const [mediaUrl, setMediaUrl] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    "Crypto",
    "Tech",
    "Sports",
    "Politics",
    "Entertainment",
    "Science",
    "Space",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected || !address) return;

    if (!question) return toast.error("Please enter a question");
    if (!category) return toast.error("Please select a category");
    if (!endDate) return toast.error("Please select an end date");
    if (!mediaUrl) return toast.error("Please upload an image or video");

    setIsSubmitting(true);

    try {
      console.log("🚀 Initializing Reliable V3 Connection...");

      // 🟢 3. Fixed Bug: Removed quotes so it reads the actual environment variable
      


      // DATA PREP
      const deadlineTimestamp = Math.floor(new Date(endDate).getTime() / 1000);

      const mediaByteArray = byteArray.byteArrayFromString(mediaUrl);
      const questionByteArray = byteArray.byteArrayFromString(question);
      const categoryFelt = category; 

      console.log("🚀 Sending Transaction with Media:", mediaUrl);

      const myCall = {
        
        contractAddress: import.meta.env.VITE_HUB_ADDRESS,
        entrypoint: "create_market",
        calldata: CallData.compile([
          questionByteArray, 
          mediaByteArray, 
          deadlineTimestamp, 
          categoryFelt, 
        ]),
      
      }

      console.log("payload ", myCall);

      // EXECUTE
      const tx = await execute([myCall]);
      console.log(tx)

      // console.log("✅ Tx Hash:", tx.transaction_hash);

      toast.success("Transaction Sent!", {
        description: "Market creation is processing...",
        action: {
          label: "View Explorer",
          onClick: () =>
            window.open(
              `https://voyager.online/tx/${tx.transaction_hash}`,
              "_blank",
            ),
        },
      });

      // Reset Form
      setQuestion("");
      setEndDate("");
      setMediaUrl(""); 
    } catch (err: any) {
      console.error("TRANSACTION FAILED:", err);
      toast.error("Failed", { description: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  // 🟢 4. UI Guard now respects Privy users too!
  if (!isConnected) {
    return (
      <div className="w-full max-w-2xl mx-auto px-4 py-6">
        <div className="bg-[#0f0f1a] border border-[#1F87FC]/30 rounded-xl p-12 text-center flex flex-col items-center">
          <div className="w-20 h-20 bg-[#1F87FC]/10 rounded-full flex items-center justify-center mb-6">
            <Tag className="w-10 h-10 text-[#1F87FC]" />
          </div>
          <h2 className="text-2xl font-bold mb-3">
            Create a Prediction Market
          </h2>
          <p className="text-muted-foreground max-w-sm mb-8">
            You need to connect your wallet to publish new markets.
          </p>
          <button
            onClick={() => connect("web3")} // 🟢 Updated to use unified connect function
            className="flex items-center gap-2 px-8 py-4 bg-[#1F87FC] text-white rounded-lg hover:shadow-[0_0_30px_rgba(31,135,252,0.5)] transition-all font-medium"
          >
            <LogIn className="w-5 h-5" />
            Connect Wallet
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-6 pb-24">
      <Toaster
        position="top-right"
        richColors
        theme="dark" 
      />
      <div className="bg-[#0f0f1a] border border-[#1F87FC]/30 rounded-xl p-6">
        <h2 className="text-foreground mb-6 text-xl font-bold">
          Create Prediction
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* MEDIA UPLOAD SECTION */}
          <div className="space-y-3">
            <label className="text-foreground text-sm font-medium">
              Upload Media
            </label>
            <div className="bg-[#1a1a24]/50 rounded-xl border border-[#1F87FC]/30 p-1">
              <MediaUploader onUploadComplete={(url) => setMediaUrl(url)} />
            </div>
            <p className="text-xs text-muted-foreground">
              Supports: Images (PNG, JPG) and Video (MP4, WEBM)
            </p>
          </div>

          {/* QUESTION */}
          <div className="space-y-3">
            <label
              htmlFor="question"
              className="text-foreground text-sm font-medium"
            >
              Prediction Question
            </label>
            <textarea
              id="question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="What will happen? Make it clear and specific..."
              className="w-full h-32 bg-[#1a1a24] border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#1F87FC] focus:ring-1 focus:ring-[#1F87FC] transition-colors resize-none"
              required
            />
          </div>

          {/* CATEGORY */}
          <div className="space-y-3">
            <label className="text-foreground flex items-center gap-2 text-sm font-medium">
              <Tag className="w-4 h-4" /> Category
            </label>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`px-4 py-2 rounded-lg border text-sm transition-all ${
                    category === cat
                      ? "bg-[#1F87FC]/20 border-[#1F87FC] text-[#1F87FC]"
                      : "border-border text-muted-foreground hover:border-[#1F87FC]/40"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* END DATE */}
          <div className="space-y-3">
            <label
              htmlFor="endDate"
              className="text-foreground flex items-center gap-2 text-sm font-medium"
            >
              <Calendar className="w-4 h-4" /> End Date
            </label>
            <input
              id="endDate"
              type="datetime-local"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full bg-[#1a1a24] border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-[#1F87FC] focus:ring-1 focus:ring-[#1F87FC] transition-colors"
              required
            />
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={isSubmitting || !mediaUrl}
            className={`w-full py-4 rounded-lg flex items-center justify-center font-medium transition-all ${
              isSubmitting || !mediaUrl
                ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                : "bg-[#1F87FC] text-white hover:bg-[#1F87FC]/90 hover:shadow-[0_0_30px_rgba(31,135,252,0.5)]"
            }`}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Confirming
                Transaction...
              </>
            ) : (
              "Publish Prediction"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
