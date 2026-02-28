export interface Prediction {
  id: string;
  creator: {
    name: string;
    username: string;
    avatar: string;
  };
  question: string;
  category: string;
  media: {
    type: 'image' | 'video' | 'audio';
    url: string;
    thumbnail?: string;
  };
  yesPrice: number;
  noPrice: number;
  yesShares: number;
  noShares: number;
  totalVolume: number;
  endsAt: string;
  likes: number;
  comments: number;
  reposts: number;
  isLiked: boolean;
  createdAt: string;
}

export interface UserPosition {
  predictionId: string;
  prediction: Prediction;
  yesShares: number;
  noShares: number;
  invested: number;
  currentValue: number;
  profitLoss: number;
}

export interface PricePoint {
  timestamp: string;
  yesPrice: number;
  noPrice: number;
  volume: number;
}

export interface Comment {
  id: string;
  user: {
    name: string;
    username: string;
    avatar: string;
  };
  text: string;
  timestamp: string;
  likes: number;
  isLiked: boolean;
}
