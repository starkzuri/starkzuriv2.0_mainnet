import {
  Heart,
  MessageCircle,
  Repeat2,
  Share2,
  Clock,
  TrendingUp,
  Award,
} from "lucide-react";
import { Prediction } from "../types/prediction";
import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { MediaPreview } from "./MediaPreview";
import { toast } from "sonner";

interface PredictionCardProps {
  prediction: Prediction;
  onLike?: (id: string) => void;
  onComment?: (id: string) => void;
  onRepost?: (id: string) => void;
  onClick?: (id: string) => void;
}

const getStage = (progress: number) => {
  if (progress >= 80) return "critical";
  if (progress >= 60) return "urgent";
  if (progress >= 40) return "hot";
  if (progress >= 20) return "building";
  return "live";
};

const stageConfig = {
  live: {
    from: "#1F87FC",
    to: "#38bdf8",
    tip: "#1F87FC",
    speed: "2s",
    label: "Live",
    pulse: false,
  },
  building: {
    from: "#6366f1",
    to: "#818cf8",
    tip: "#818cf8",
    speed: "1.6s",
    label: "Building",
    pulse: false,
  },
  hot: {
    from: "#9333ea",
    to: "#e879f9",
    tip: "#e879f9",
    speed: "1.1s",
    label: "Hot",
    pulse: false,
  },
  urgent: {
    from: "#ea580c",
    to: "#fbbf24",
    tip: "#fbbf24",
    speed: "0.7s",
    label: "Urgent",
    pulse: true,
  },
  critical: {
    from: "#dc2626",
    to: "#ff3366",
    tip: "#ff3366",
    speed: "0.38s",
    label: "Critical",
    pulse: true,
  },
};

export function PredictionCard({
  prediction,
  onLike,
  onComment,
  onRepost,
  onClick,
}: PredictionCardProps) {
  const [, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const getTimeRemaining = () => {
    const diff = new Date(prediction.endsAt).getTime() - Date.now();
    if (diff <= 0) return "Ended";
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    if (days > 0) return `${days}d ${hours}h`;
    return `${hours}h`;
  };

  const getTimeProgress = () => {
    const now = Date.now();
    const start = new Date(prediction.createdAt).getTime();
    const end = new Date(prediction.endsAt).getTime();
    return Math.min(Math.max(((now - start) / (end - start)) * 100, 0), 100);
  };

  const formatNumber = (num: number) => {
    if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
    if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
    return num.toString();
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const shareUrl = `${window.location.origin}/?marketId=${prediction.id}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: "StarkZuri Prediction", url: shareUrl });
        return;
      } catch {}
    }
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Link copied!", {
        description: "Market link ready to share.",
        icon: <Share2 className="w-4 h-4 text-[#1F87FC]" />,
      });
    } catch {
      toast.error("Failed to copy link");
    }
  };

  const marketComplete = getTimeRemaining() === "Ended";
  const timeProgress = getTimeProgress();
  const yesPercent = Math.round(prediction.yesPrice * 100);
  const noPercent = Math.round(prediction.noPrice * 100);

  return (
    <motion.div
      onClick={() => onClick?.(prediction.id)}
      whileHover={{ y: -3, boxShadow: "0 0 28px rgba(31,135,252,0.12)" }}
      transition={{ type: "spring", stiffness: 400, damping: 28 }}
      style={{
        background: "#12121f",
        border: "1px solid rgba(31,135,252,0.22)",
        borderRadius: 18,
        overflow: "hidden",
        cursor: "pointer",
        fontFamily: "inherit",
      }}
      className="group hover:border-[rgba(31,135,252,0.5)] transition-[border-color] duration-300"
    >
      {/* ── Top bar ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "14px 16px 10px",
        }}
      >
        <img
          src={prediction.creator.avatar}
          alt={prediction.creator.name}
          style={{
            width: 34,
            height: 34,
            borderRadius: "50%",
            border: "1.5px solid rgba(31,135,252,0.35)",
            flexShrink: 0,
            objectFit: "cover",
          }}
        />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 13, fontWeight: 500, color: "#e2e8f0" }}>
              {prediction.creator.name}
            </span>
            {prediction.totalVolume > 10000 && (
              <Award
                style={{
                  width: 12,
                  height: 12,
                  color: "#f6c90e",
                  fill: "#f6c90e",
                  flexShrink: 0,
                }}
              />
            )}
            <span style={{ fontSize: 11, color: "#4a5568" }}>
              {prediction.creator.username}
            </span>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 7,
            flexShrink: 0,
          }}
        >
          <span
            style={{
              fontSize: 10,
              fontWeight: 500,
              color: "#1F87FC",
              background: "rgba(31,135,252,0.1)",
              border: "1px solid rgba(31,135,252,0.25)",
              borderRadius: 5,
              padding: "2px 7px",
              letterSpacing: "0.03em",
            }}
          >
            {prediction.category}
          </span>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 3,
              fontSize: 11,
              color: "#64748b",
            }}
          >
            <Clock style={{ width: 11, height: 11 }} />
            <span>{getTimeRemaining()}</span>
          </div>
        </div>
      </div>

      <div style={{ height: 1, background: "rgba(255,255,255,0.04)" }} />

      {/* ── Featured image ── */}
      <div
        style={{
          position: "relative",
          width: "100%",
          maxHeight: 150,
          overflow: "hidden",
        }}
      >
        <MediaPreview
          src={prediction.media.url}
          alt={prediction.question}
          type={prediction.media.type === "video" ? "video" : undefined}
          style={{
            width: "100%",
            maxHeight: 150,
            objectFit: "cover",
            opacity: 0.75,
            display: "block",
            borderRadius: 0,
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom, transparent 40%, #12121f 100%)",
            pointerEvents: "none",
          }}
        />
        {prediction.totalVolume > 50000 && (
          <div
            style={{
              position: "absolute",
              top: 10,
              right: 12,
              background: "rgba(234,88,12,0.9)",
              borderRadius: 20,
              padding: "3px 9px",
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            <TrendingUp style={{ width: 10, height: 10, color: "#fff" }} />
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: "#fff",
                letterSpacing: "0.05em",
              }}
            >
              HOT
            </span>
          </div>
        )}
      </div>

      {/* ── Body ── */}
      <div style={{ padding: "16px 16px 0" }}>
        {/* Question */}
        <h3
          style={{
            fontSize: 16,
            fontWeight: 600,
            color: "#e2e8f0",
            lineHeight: 1.45,
            margin: "0 0 14px",
            letterSpacing: "-0.01em",
          }}
          className="group-hover:text-[#1F87FC] transition-colors duration-200"
        >
          {prediction.question}
        </h3>

        {/* YES / NO panels */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 8,
            marginBottom: 14,
          }}
        >
          {/* YES */}
          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              onClick?.(prediction.id);
            }}
            disabled={marketComplete}
            whileHover={!marketComplete ? { scale: 1.02 } : {}}
            whileTap={!marketComplete ? { scale: 0.97 } : {}}
            style={{
              textAlign: "left",
              borderRadius: 10,
              padding: "10px 12px",
              background: "rgba(0,255,136,0.06)",
              border: "1px solid rgba(0,255,136,0.22)",
              cursor: marketComplete ? "not-allowed" : "pointer",
              opacity: marketComplete ? 0.6 : 1,
              transition: "background 0.15s, border-color 0.15s",
              fontFamily: "inherit",
            }}
            className={
              !marketComplete
                ? "hover:!bg-[rgba(0,255,136,0.1)] hover:!border-[rgba(0,255,136,0.45)]"
                : ""
            }
          >
            <div
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.08em",
                color: "rgba(0,255,136,0.6)",
                marginBottom: 6,
              }}
            >
              YES
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
              <span
                style={{
                  fontSize: 20,
                  fontWeight: 700,
                  color: "#00ff88",
                  fontVariantNumeric: "tabular-nums",
                  letterSpacing: "-0.02em",
                  lineHeight: 1,
                }}
              >
                ${prediction.yesPrice.toFixed(4)}
              </span>
              <span
                style={{
                  fontSize: 11,
                  color: "rgba(0,255,136,0.65)",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {yesPercent}%
              </span>
            </div>
          </motion.button>

          {/* NO */}
          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              onClick?.(prediction.id);
            }}
            disabled={marketComplete}
            whileHover={!marketComplete ? { scale: 1.02 } : {}}
            whileTap={!marketComplete ? { scale: 0.97 } : {}}
            style={{
              textAlign: "left",
              borderRadius: 10,
              padding: "10px 12px",
              background: "rgba(255,51,102,0.06)",
              border: "1px solid rgba(255,51,102,0.22)",
              cursor: marketComplete ? "not-allowed" : "pointer",
              opacity: marketComplete ? 0.6 : 1,
              transition: "background 0.15s, border-color 0.15s",
              fontFamily: "inherit",
            }}
            className={
              !marketComplete
                ? "hover:!bg-[rgba(255,51,102,0.1)] hover:!border-[rgba(255,51,102,0.45)]"
                : ""
            }
          >
            <div
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.08em",
                color: "rgba(255,51,102,0.6)",
                marginBottom: 6,
              }}
            >
              NO
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
              <span
                style={{
                  fontSize: 20,
                  fontWeight: 700,
                  color: "#ff3366",
                  fontVariantNumeric: "tabular-nums",
                  letterSpacing: "-0.02em",
                  lineHeight: 1,
                }}
              >
                ${prediction.noPrice.toFixed(4)}
              </span>
              <span
                style={{
                  fontSize: 11,
                  color: "rgba(255,51,102,0.65)",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {noPercent}%
              </span>
            </div>
          </motion.button>
        </div>

        {/* Sentiment bar (YES vs NO) */}
        <div style={{ marginBottom: 14 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 10,
              color: "#4a5568",
              marginBottom: 5,
            }}
          >
            <span>YES {yesPercent}%</span>
            <span>NO {noPercent}%</span>
          </div>
          <div
            style={{
              height: 5,
              background: "rgba(255,51,102,0.2)",
              borderRadius: 99,
              overflow: "hidden",
            }}
          >
            <motion.div
              initial={{ width: "50%" }}
              animate={{ width: `${yesPercent}%` }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              style={{
                height: "100%",
                background: "linear-gradient(90deg, #00ff88, #1F87FC)",
                borderRadius: 99,
              }}
            />
          </div>
        </div>
      </div>

      {/* ── Time progress bar ── */}
      {/* Time progress bar */}
      <div style={{ padding: "0 16px" }}>
        <div
          style={{
            height: 8,
            background:
              timeProgress >= 60
                ? "rgba(234,88,12,0.1)"
                : "rgba(255,255,255,0.05)",
            borderRadius: 99,
            overflow: "visible",
            position: "relative",
          }}
        >
          {/* Animated fill */}
          <motion.div
            animate={{ width: `${timeProgress}%` }}
            transition={{ duration: 0.6, type: "spring", bounce: 0.3 }}
            style={{
              height: "100%",
              borderRadius: 99,
              background: `linear-gradient(90deg, ${stageConfig[getStage(timeProgress)].from}, ${stageConfig[getStage(timeProgress)].to})`,
              overflow: "hidden",
              position: "relative",
            }}
          >
            {/* Shimmer stripes */}
            {!marketComplete && (
              <motion.div
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: 99,
                  backgroundImage:
                    "repeating-linear-gradient(60deg, transparent, transparent 12px, rgba(255,255,255,0.12) 12px, rgba(255,255,255,0.12) 24px)",
                }}
                animate={{ backgroundPosition: ["0px 0px", "48px 0px"] }}
                transition={{
                  duration: parseFloat(
                    stageConfig[getStage(timeProgress)].speed,
                  ),
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
            )}
          </motion.div>

          {/* Glowing tip dot */}
          {!marketComplete && (
            <motion.div
              animate={{
                left: `${timeProgress}%`,
                width: timeProgress >= 60 ? [14, 18, 14] : 14,
                height: timeProgress >= 60 ? [14, 18, 14] : 14,
              }}
              transition={{
                left: { duration: 0.6, type: "spring", bounce: 0.3 },
                width: {
                  duration: timeProgress >= 80 ? 0.3 : 0.55,
                  repeat: Infinity,
                },
                height: {
                  duration: timeProgress >= 80 ? 0.3 : 0.55,
                  repeat: Infinity,
                },
              }}
              style={{
                position: "absolute",
                top: "50%",
                translateX: "-50%",
                translateY: "-50%",
                borderRadius: "50%",
                background: stageConfig[getStage(timeProgress)].tip,
                border: "2px solid #12121f",
                boxShadow: `0 0 14px ${stageConfig[getStage(timeProgress)].tip}`,
                pointerEvents: "none",
                zIndex: 2,
              }}
            />
          )}
        </div>

        {/* Meta row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 10,
            color: "#3a4a5e",
            marginTop: 6,
            paddingBottom: 12,
          }}
        >
          <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
            {!marketComplete && (
              <motion.span
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{
                  duration: timeProgress >= 80 ? 0.4 : 1.2,
                  repeat: Infinity,
                }}
                style={{
                  display: "inline-block",
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: stageConfig[getStage(timeProgress)].tip,
                  boxShadow: `0 0 5px ${stageConfig[getStage(timeProgress)].tip}`,
                }}
              />
            )}
            {marketComplete
              ? "Market closed"
              : `${stageConfig[getStage(timeProgress)].label} · ${Math.round(timeProgress)}% elapsed`}
          </span>
          <span>{formatNumber(prediction.traders ?? 0)} traders</span>
        </div>
      </div>

      <div style={{ height: 1, background: "rgba(255,255,255,0.04)" }} />

      {/* ── Footer: actions + volume ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "10px 16px 14px",
          gap: 2,
        }}
      >
        {/* Like */}
        <motion.button
          onClick={(e) => {
            e.stopPropagation();
            onLike?.(prediction.id);
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 1.2 }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            fontSize: 12,
            padding: "6px 8px",
            borderRadius: 7,
            border: "none",
            background: "none",
            cursor: "pointer",
            color: prediction.isLiked ? "#ff3366" : "#4a5568",
            fontFamily: "inherit",
            transition: "color 0.15s, background 0.15s",
          }}
          className={
            !prediction.isLiked
              ? "hover:!text-[#1F87FC] hover:!bg-[rgba(31,135,252,0.08)]"
              : ""
          }
        >
          <Heart
            style={{
              width: 14,
              height: 14,
              fill: prediction.isLiked ? "#ff3366" : "none",
              stroke: "currentColor",
              strokeWidth: 1.5,
            }}
          />
          <span>{formatNumber(prediction.likes)}</span>
        </motion.button>

        {/* Comment */}
        <motion.button
          onClick={(e) => {
            e.stopPropagation();
            onComment?.(prediction.id);
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.92 }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            fontSize: 12,
            padding: "6px 8px",
            borderRadius: 7,
            border: "none",
            background: "none",
            cursor: "pointer",
            color: "#4a5568",
            fontFamily: "inherit",
            transition: "color 0.15s, background 0.15s",
          }}
          className="hover:!text-[#1F87FC] hover:!bg-[rgba(31,135,252,0.08)]"
        >
          <MessageCircle style={{ width: 14, height: 14, strokeWidth: 1.5 }} />
          <span>{formatNumber(prediction.comments)}</span>
        </motion.button>

        {/* Repost */}
        <motion.button
          onClick={(e) => {
            e.stopPropagation();
            onRepost?.(prediction.id);
          }}
          whileHover={{ scale: 1.05, rotate: 90 }}
          whileTap={{ scale: 0.92 }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            fontSize: 12,
            padding: "6px 8px",
            borderRadius: 7,
            border: "none",
            background: "none",
            cursor: "pointer",
            color: "#4a5568",
            fontFamily: "inherit",
            transition: "color 0.15s, background 0.15s",
          }}
          className="hover:!text-[#1F87FC] hover:!bg-[rgba(31,135,252,0.08)]"
        >
          <Repeat2 style={{ width: 14, height: 14, strokeWidth: 1.5 }} />
          <span>{formatNumber(prediction.reposts)}</span>
        </motion.button>

        {/* Share */}
        <motion.button
          onClick={handleShare}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.92 }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            fontSize: 12,
            padding: "6px 8px",
            borderRadius: 7,
            border: "none",
            background: "none",
            cursor: "pointer",
            color: "#4a5568",
            fontFamily: "inherit",
            transition: "color 0.15s, background 0.15s",
          }}
          className="hover:!text-[#1F87FC] hover:!bg-[rgba(31,135,252,0.08)]"
        >
          <Share2 style={{ width: 14, height: 14, strokeWidth: 1.5 }} />
        </motion.button>

        {/* Volume */}
        <div style={{ marginLeft: "auto" }}>
          <span
            style={{
              fontSize: 11,
              color: "#64748b",
              background: "rgba(255,255,255,0.04)",
              borderRadius: 6,
              padding: "4px 8px",
              fontVariantNumeric: "tabular-nums",
              letterSpacing: "0.01em",
            }}
          >
            <span style={{ color: "#3a4a5e" }}>Vol </span>$
            {formatNumber(prediction.totalVolume)}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
