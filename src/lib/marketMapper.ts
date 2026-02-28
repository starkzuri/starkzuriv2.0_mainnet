import { Prediction } from "../types/prediction";

// 🟢 NEW: Define ApiMarket interface here so it's shared
export interface ApiMarket {
  marketId: number;
  creator: string;
  category: string;
  question: string;
  media: string | null;
  timestamp: number;
  transactionHash: string;
  yesPrice: number;
  noPrice: number;
  yesShares: number;
  noShares: number;
  totalVolume: number;
  endTime: number; // Changed to number
  creatorUsername?: string | null;
  creatorDisplayName?: string | null;
  creatorAvatar?: string | null;
  commentCount?: number;
  likeCount?: number;
  repostCount?: number;
  isLikedByCurrentUser?: boolean;
}

// 🟢 NEW: Centralized Logic (The "Brain")
export function mapMarketToPrediction(market: ApiMarket): Prediction {
  const mediaStr = market.media || "";

  // 1. IPFS Gateway Resolver
  let mediaUrl = mediaStr;
  if (mediaStr.includes("ipfs://")) {
    // Uses your dedicated gateway or fallback
    mediaUrl = mediaStr.replace(
      "ipfs://",
      import.meta.env.VITE_PINATA_GATEWAY_URL ||
        "https://gateway.pinata.cloud/ipfs/",
    );
  } else if (!mediaStr) {
    mediaUrl =
      "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=1000&q=80";
  }

  // 2. Video Detection (Simple check)
  // Pinata URLs usually don't end in .mp4, so we might need to rely on the uploader to set this.
  // Ideally, your DB would store "mediaType". For now, we assume if it's not empty, let MediaPreview handle it.
  const isVideo = mediaStr.endsWith(".mp4") || mediaStr.endsWith(".webm");

  const displayName = market.creatorDisplayName
    ? market.creatorDisplayName
    : `User ${market.creator.slice(0, 4)}...${market.creator.slice(-4)}`;

  // 🟢 LOGIC: Use DB Username -> Fallback to "@0x..."
  const username = market.creatorUsername
    ? `@${market.creatorUsername}`
    : `@${market.creator.slice(0, 6)}...${market.creator.slice(-4)}`;

  // 🟢 LOGIC: Use DB Avatar -> Fallback to DiceBear
  const avatar = market.creatorAvatar
    ? market.creatorAvatar
    : `https://api.dicebear.com/7.x/identicon/svg?seed=${market.creator}`;

  return {
    id: market.marketId.toString(),
    creator: {
      name: displayName,
      username: username,
      avatar: avatar,
    },
    question: market.question,
    category: market.category || "General",
    media: {
      type: "image", // ⚠️ Important: Let the UI component decide if it renders <video> or <img> based on props or error handling?
      // Actually, since we can't know for sure without metadata, defaulting to "image" is risky.
      // BETTER: If your DB doesn't save "type", we might have to just pass the URL.
      // BUT, for now let's assume if the extension is missing, we try our best.
      url: mediaUrl,
      // If we flagged it as video above:
      ...(isVideo && { type: "video" }),
    } as any, // Cast to any to bypass strict type check for this hack

    yesPrice: market.yesPrice ?? 0.5,
    noPrice: market.noPrice ?? 0.5,
    totalVolume: market.totalVolume ?? 0,
    yesShares: 0,
    noShares: 0,
    createdAt: new Date(market.timestamp * 1000).toISOString(),
    endsAt: new Date(market.endTime * 1000).toISOString(),
    likes: Number(market.likeCount || 0),
    comments: Number(market.commentCount || 0),
    reposts: Number(market.repostCount || 0),
    isLiked: Boolean(market.isLikedByCurrentUser || false),
  };
}
