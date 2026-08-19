import { useState } from "react";
import {
  Calendar,
  Tag,
  Loader2,
  LogIn,
  ImagePlus,
  HelpCircle,
  Sparkles,
} from "lucide-react";
import { toast, Toaster } from "sonner";
import { CallData, byteArray } from "starknet";
import { useAuth } from "../hooks/useAuth";
import { MediaUploader } from "./MediaUploader";

const CATEGORIES = [
  "Crypto",
  "Tech",
  "Sports",
  "Politics",
  "Entertainment",
  "Science",
  "Space",
];

const sectionLabel = (icon: React.ReactNode, text: string) => (
  <div
    style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 10 }}
  >
    <span style={{ color: "#1F87FC", display: "flex" }}>{icon}</span>
    <span
      style={{
        fontSize: 12,
        fontWeight: 500,
        color: "#64748b",
        letterSpacing: "0.04em",
      }}
    >
      {text}
    </span>
  </div>
);

export function CreatePrediction() {
  const { execute, address, isConnected, connect } = useAuth();

  const [question, setQuestion] = useState("");
  const [category, setCategory] = useState("");
  const [endDate, setEndDate] = useState("");
  const [mediaUrl, setMediaUrl] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected || !address) return;
    if (!question) return toast.error("Please enter a question");
    if (!category) return toast.error("Please select a category");
    if (!endDate) return toast.error("Please select an end date");
    if (!mediaUrl) return toast.error("Please upload an image or video");

    setIsSubmitting(true);
    try {
      const deadlineTimestamp = Math.floor(new Date(endDate).getTime() / 1000);
      const mediaByteArray = byteArray.byteArrayFromString(mediaUrl);
      const questionByteArray = byteArray.byteArrayFromString(question);

      const myCall = {
        contractAddress: import.meta.env.VITE_HUB_ADDRESS,
        entrypoint: "create_market",
        calldata: CallData.compile([
          questionByteArray,
          mediaByteArray,
          deadlineTimestamp,
          category,
        ]),
      };

      const tx = await execute([myCall]);

      toast.success("Transaction sent!", {
        description: "Market creation is processing…",
        action: {
          label: "View explorer",
          onClick: () =>
            window.open(
              `https://voyager.online/tx/${tx.transaction_hash}`,
              "_blank",
            ),
        },
      });

      setQuestion("");
      setEndDate("");
      setMediaUrl("");
      setCategory("");
    } catch (err: any) {
      console.error("TRANSACTION FAILED:", err);
      toast.error("Failed", { description: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Not connected ──
  if (!isConnected) {
    return (
      <div
        style={{
          width: "100%",
          maxWidth: 560,
          margin: "0 auto",
          padding: "40px 20px",
          fontFamily: "inherit",
        }}
      >
        <div
          style={{
            background: "#12121f",
            border: "1px solid rgba(31,135,252,0.2)",
            borderRadius: 18,
            padding: "60px 32px",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 0,
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              background: "rgba(31,135,252,0.08)",
              border: "1px solid rgba(31,135,252,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 20,
            }}
          >
            <Sparkles style={{ width: 26, height: 26, color: "#1F87FC" }} />
          </div>
          <h2
            style={{
              fontSize: 20,
              fontWeight: 600,
              color: "#e2e8f0",
              margin: "0 0 8px",
            }}
          >
            Create a prediction market
          </h2>
          <p
            style={{
              fontSize: 13,
              color: "#4a5568",
              margin: "0 0 28px",
              maxWidth: 300,
              lineHeight: 1.6,
            }}
          >
            Connect your wallet to publish new markets and start trading.
          </p>
          <button
            onClick={() => connect("web3")}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "11px 24px",
              background: "#1F87FC",
              color: "#fff",
              border: "none",
              borderRadius: 10,
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "inherit",
              transition: "opacity 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            <LogIn style={{ width: 15, height: 15 }} />
            Connect wallet
          </button>
        </div>
      </div>
    );
  }

  const canSubmit =
    !isSubmitting && !!mediaUrl && !!question && !!category && !!endDate;

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 560,
        margin: "0 auto",
        padding: "28px 20px 80px",
        fontFamily: "inherit",
      }}
    >
      <Toaster position="top-right" richColors theme="dark" />

      {/* Page header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 20,
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: "rgba(31,135,252,0.08)",
            border: "1px solid rgba(31,135,252,0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Sparkles style={{ width: 16, height: 16, color: "#1F87FC" }} />
        </div>
        <div>
          <h1
            style={{
              fontSize: 18,
              fontWeight: 600,
              color: "#e2e8f0",
              margin: 0,
              lineHeight: 1.2,
            }}
          >
            Create prediction
          </h1>
          <p
            style={{ fontSize: 12, color: "#4a5568", margin: 0, marginTop: 2 }}
          >
            Publish a new market for the community to trade
          </p>
        </div>
      </div>

      {/* Form card */}
      <div
        style={{
          background: "#12121f",
          border: "1px solid rgba(31,135,252,0.18)",
          borderRadius: 18,
          padding: "24px 20px",
          display: "flex",
          flexDirection: "column",
          gap: 24,
        }}
      >
        {/* Media upload */}
        <div>
          {sectionLabel(
            <ImagePlus style={{ width: 13, height: 13 }} />,
            "Cover image or video",
          )}
          <div
            style={{
              background: "rgba(0,0,0,0.2)",
              border: "1px solid rgba(31,135,252,0.15)",
              borderRadius: 12,
              overflow: "hidden",
            }}
          >
            <MediaUploader onUploadComplete={(url) => setMediaUrl(url)} />
          </div>
          <p style={{ fontSize: 11, color: "#3a4a5e", marginTop: 6 }}>
            Supports PNG, JPG, MP4, WEBM
          </p>
        </div>

        <div style={{ height: 1, background: "rgba(255,255,255,0.04)" }} />

        {/* Question */}
        <div>
          {sectionLabel(
            <HelpCircle style={{ width: 13, height: 13 }} />,
            "Prediction question",
          )}
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="What will happen? Make it clear and specific…"
            rows={4}
            style={{
              width: "100%",
              boxSizing: "border-box",
              background: "rgba(0,0,0,0.25)",
              border: "1px solid rgba(31,135,252,0.15)",
              borderRadius: 10,
              padding: "12px 14px",
              fontSize: 13,
              color: "#e2e8f0",
              fontFamily: "inherit",
              lineHeight: 1.6,
              resize: "none",
              outline: "none",
              transition: "border-color 0.15s",
            }}
            onFocus={(e) =>
              (e.currentTarget.style.borderColor = "rgba(31,135,252,0.5)")
            }
            onBlur={(e) =>
              (e.currentTarget.style.borderColor = "rgba(31,135,252,0.15)")
            }
          />
        </div>

        <div style={{ height: 1, background: "rgba(255,255,255,0.04)" }} />

        {/* Category */}
        <div>
          {sectionLabel(<Tag style={{ width: 13, height: 13 }} />, "Category")}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
            {CATEGORIES.map((cat) => {
              const active = category === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  style={{
                    padding: "6px 14px",
                    borderRadius: 99,
                    fontSize: 12,
                    fontWeight: active ? 600 : 400,
                    fontFamily: "inherit",
                    cursor: "pointer",
                    transition: "all 0.15s",
                    background: active
                      ? "rgba(31,135,252,0.15)"
                      : "rgba(255,255,255,0.03)",
                    border: active
                      ? "1px solid rgba(31,135,252,0.5)"
                      : "1px solid rgba(255,255,255,0.07)",
                    color: active ? "#1F87FC" : "#64748b",
                    boxShadow: active
                      ? "0 0 10px rgba(31,135,252,0.2)"
                      : "none",
                  }}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ height: 1, background: "rgba(255,255,255,0.04)" }} />

        {/* End date */}
        <div>
          {sectionLabel(
            <Calendar style={{ width: 13, height: 13 }} />,
            "Market end date",
          )}
          <input
            type="datetime-local"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            style={{
              width: "100%",
              boxSizing: "border-box",
              background: "rgba(0,0,0,0.25)",
              border: "1px solid rgba(31,135,252,0.15)",
              borderRadius: 10,
              padding: "11px 14px",
              fontSize: 13,
              color: "#e2e8f0",
              fontFamily: "inherit",
              outline: "none",
              transition: "border-color 0.15s",
              colorScheme: "dark",
            }}
            onFocus={(e) =>
              (e.currentTarget.style.borderColor = "rgba(31,135,252,0.5)")
            }
            onBlur={(e) =>
              (e.currentTarget.style.borderColor = "rgba(31,135,252,0.15)")
            }
          />
        </div>

        {/* Progress indicator */}
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 10,
              color: "#3a4a5e",
              marginBottom: 6,
            }}
          >
            <span>Completeness</span>
            <span>
              {
                [!!mediaUrl, !!question, !!category, !!endDate].filter(Boolean)
                  .length
              }{" "}
              / 4
            </span>
          </div>
          <div
            style={{
              height: 3,
              background: "rgba(255,255,255,0.05)",
              borderRadius: 99,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${[!!mediaUrl, !!question, !!category, !!endDate].filter(Boolean).length * 25}%`,
                background: "linear-gradient(90deg, #1F87FC, #00ff88)",
                borderRadius: 99,
                transition: "width 0.4s ease",
              }}
            />
          </div>
        </div>

        {/* Submit */}
        <button
          type="button"
          onClick={handleSubmit as any}
          disabled={!canSubmit}
          style={{
            width: "100%",
            padding: "13px 0",
            borderRadius: 10,
            fontSize: 13,
            fontWeight: 700,
            fontFamily: "inherit",
            border: "none",
            cursor: canSubmit ? "pointer" : "not-allowed",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            transition: "opacity 0.15s, box-shadow 0.15s",
            background: canSubmit ? "#1F87FC" : "rgba(255,255,255,0.05)",
            color: canSubmit ? "#fff" : "#3a4a5e",
            boxShadow: canSubmit ? "0 0 20px rgba(31,135,252,0.3)" : "none",
          }}
          onMouseEnter={(e) => {
            if (canSubmit) e.currentTarget.style.opacity = "0.88";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = "1";
          }}
        >
          {isSubmitting ? (
            <>
              <Loader2
                style={{
                  width: 15,
                  height: 15,
                  animation: "spin 0.8s linear infinite",
                }}
              />
              Confirming transaction…
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </>
          ) : (
            "Publish prediction"
          )}
        </button>
      </div>
    </div>
  );
}
