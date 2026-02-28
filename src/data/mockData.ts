import { Prediction, UserPosition, PricePoint, Comment } from '../types/prediction';

export const mockPredictions: Prediction[] = [
  {
    id: '1',
    creator: {
      name: 'CyberOracle',
      username: '@cyberoracle',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=CyberOracle',
    },
    question: 'Will Bitcoin reach $150K by end of Q1 2026?',
    category: 'Crypto',
    media: {
      type: 'image',
      url: 'https://images.unsplash.com/photo-1659010878130-ae8b703bd3ee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcnlwdG9jdXJyZW5jeSUyMGJpdGNvaW58ZW58MXx8fHwxNzY1Mjg2OTEyfDA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    yesPrice: 0.67,
    noPrice: 0.33,
    yesShares: 45200,
    noShares: 22100,
    totalVolume: 67300,
    endsAt: '2026-03-31T23:59:59Z',
    likes: 3420,
    comments: 892,
    reposts: 567,
    isLiked: false,
    createdAt: '2025-12-08T10:30:00Z',
  },
  {
    id: '2',
    creator: {
      name: 'NeonPredictor',
      username: '@neonpred',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=NeonPredictor',
    },
    question: 'Will AGI be achieved before 2028?',
    category: 'Tech',
    media: {
      type: 'image',
      url: 'https://images.unsplash.com/photo-1697577418970-95d99b5a55cf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnRpZmljaWFsJTIwaW50ZWxsaWdlbmNlfGVufDF8fHx8MTc2NTI2MDI3OHww&ixlib=rb-4.1.0&q=80&w=1080',
    },
    yesPrice: 0.42,
    noPrice: 0.58,
    yesShares: 28900,
    noShares: 39800,
    totalVolume: 68700,
    endsAt: '2027-12-31T23:59:59Z',
    likes: 5680,
    comments: 1234,
    reposts: 892,
    isLiked: true,
    createdAt: '2025-12-07T15:20:00Z',
  },
  {
    id: '3',
    creator: {
      name: 'FutureVision',
      username: '@futurevision',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=FutureVision',
    },
    question: 'Will SpaceX land humans on Mars in 2026?',
    category: 'Space',
    media: {
      type: 'video',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1526666923127-b2970f64b422?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcGFjZSUyMHRlY2hub2xvZ3l8ZW58MXx8fHwxNzY1MzAzNzI4fDA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    yesPrice: 0.18,
    noPrice: 0.82,
    yesShares: 12300,
    noShares: 56200,
    totalVolume: 68500,
    endsAt: '2026-12-31T23:59:59Z',
    likes: 4230,
    comments: 987,
    reposts: 445,
    isLiked: false,
    createdAt: '2025-12-06T09:15:00Z',
  },
  {
    id: '4',
    creator: {
      name: 'QuantumBets',
      username: '@quantumbets',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=QuantumBets',
    },
    question: 'Lakers to win NBA Championship 2026?',
    category: 'Sports',
    media: {
      type: 'video',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1650805174015-53ceeec12c40?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcG9ydHMlMjBhY3Rpb258ZW58MXx8fHwxNzY1MjE4NzU2fDA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    yesPrice: 0.55,
    noPrice: 0.45,
    yesShares: 38700,
    noShares: 31600,
    totalVolume: 70300,
    endsAt: '2026-06-30T23:59:59Z',
    likes: 2890,
    comments: 567,
    reposts: 334,
    isLiked: false,
    createdAt: '2025-12-05T14:45:00Z',
  },
  {
    id: '5',
    creator: {
      name: 'TechSeer',
      username: '@techseer',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=TechSeer',
    },
    question: 'Will Apple release AR glasses in 2026?',
    category: 'Tech',
    media: {
      type: 'image',
      url: 'https://images.unsplash.com/photo-1689443111384-1cf214df988a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWNobm9sb2d5JTIwZnV0dXJlJTIwYWJzdHJhY3R8ZW58MXx8fHwxNzY1MzA1NjIzfDA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    yesPrice: 0.73,
    noPrice: 0.27,
    yesShares: 52100,
    noShares: 19300,
    totalVolume: 71400,
    endsAt: '2026-12-31T23:59:59Z',
    likes: 4567,
    comments: 1089,
    reposts: 678,
    isLiked: true,
    createdAt: '2025-12-04T11:00:00Z',
  },
  {
    id: '6',
    creator: {
      name: 'MetaMarket',
      username: '@metamarkets',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=MetaMarket',
    },
    question: 'Will Ethereum flip Bitcoin by market cap in 2026?',
    category: 'Crypto',
    media: {
      type: 'image',
      url: 'https://images.unsplash.com/photo-1688377051459-aebb99b42bff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjeWJlcnB1bmslMjBjaXR5JTIwbmVvbnxlbnwxfHx8fDE3NjUyNTA5NjN8MA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    yesPrice: 0.31,
    noPrice: 0.69,
    yesShares: 21400,
    noShares: 47600,
    totalVolume: 69000,
    endsAt: '2026-12-31T23:59:59Z',
    likes: 3890,
    comments: 945,
    reposts: 512,
    isLiked: false,
    createdAt: '2025-12-03T16:30:00Z',
  },
];

export const mockUserPositions: UserPosition[] = [
  {
    predictionId: '1',
    prediction: mockPredictions[0],
    yesShares: 150,
    noShares: 0,
    invested: 100.50,
    currentValue: 120.75,
    profitLoss: 20.25,
  },
  {
    predictionId: '2',
    prediction: mockPredictions[1],
    yesShares: 0,
    noShares: 200,
    invested: 116.00,
    currentValue: 89.25,
    profitLoss: -26.75,
  },
  {
    predictionId: '5',
    prediction: mockPredictions[4],
    yesShares: 300,
    noShares: 0,
    invested: 219.00,
    currentValue: 267.80,
    profitLoss: 48.80,
  },
];

// Generate realistic price history
export const generatePriceHistory = (predictionId: string): PricePoint[] => {
  const points: PricePoint[] = [];
  const now = new Date();
  const prediction = mockPredictions.find(p => p.id === predictionId);
  
  if (!prediction) return [];

  let currentYes = 0.5;
  let currentNo = 0.5;

  // Generate 30 data points over the last 7 days
  for (let i = 30; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * 6 * 60 * 60 * 1000); // 6 hour intervals
    
    // Add some realistic price movement
    const change = (Math.random() - 0.5) * 0.08;
    currentYes = Math.max(0.05, Math.min(0.95, currentYes + change));
    currentNo = 1 - currentYes;

    points.push({
      timestamp: timestamp.toISOString(),
      yesPrice: currentYes,
      noPrice: currentNo,
      volume: Math.floor(Math.random() * 5000) + 1000,
    });
  }

  // Set the last point to match current prices
  if (points.length > 0) {
    points[points.length - 1].yesPrice = prediction.yesPrice;
    points[points.length - 1].noPrice = prediction.noPrice;
  }

  return points;
};

export const mockComments: { [key: string]: Comment[] } = {
  '1': [
    {
      id: 'c1',
      user: {
        name: 'CryptoWhale',
        username: '@cryptowhale',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=CryptoWhale',
      },
      text: 'Just went all in on YES. Bitcoin to the moon! 🚀',
      timestamp: '2025-12-09T10:30:00Z',
      likes: 234,
      isLiked: false,
    },
    {
      id: 'c2',
      user: {
        name: 'DataAnalyst',
        username: '@dataanalyst',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=DataAnalyst',
      },
      text: 'Based on historical patterns and current market conditions, I think NO is undervalued here. The timeframe is too aggressive.',
      timestamp: '2025-12-09T09:15:00Z',
      likes: 156,
      isLiked: true,
    },
    {
      id: 'c3',
      user: {
        name: 'MarketMaker',
        username: '@marketmaker',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=MarketMaker',
      },
      text: 'The momentum is clearly shifting towards YES. Volume has increased 300% in the last 24h.',
      timestamp: '2025-12-09T08:45:00Z',
      likes: 89,
      isLiked: false,
    },
    {
      id: 'c4',
      user: {
        name: 'BlockchainBob',
        username: '@blockchainbob',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=BlockchainBob',
      },
      text: 'Interesting market dynamics. I&apos;m staying neutral and watching the price action.',
      timestamp: '2025-12-09T07:20:00Z',
      likes: 45,
      isLiked: false,
    },
    {
      id: 'c5',
      user: {
        name: 'TechOracle',
        username: '@techoracle',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=TechOracle',
      },
      text: 'With the upcoming halving and institutional adoption, $150K seems reasonable. Bought YES at $0.62!',
      timestamp: '2025-12-09T06:00:00Z',
      likes: 178,
      isLiked: true,
    },
  ],
  '2': [
    {
      id: 'c6',
      user: {
        name: 'AIResearcher',
        username: '@airesearcher',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=AIResearcher',
      },
      text: 'As someone working in AI, I think 2028 is too optimistic for true AGI. Buying NO.',
      timestamp: '2025-12-09T11:00:00Z',
      likes: 312,
      isLiked: true,
    },
    {
      id: 'c7',
      user: {
        name: 'FutureTech',
        username: '@futuretech',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=FutureTech',
      },
      text: 'The progress in the last year has been exponential. YES all the way!',
      timestamp: '2025-12-09T10:15:00Z',
      likes: 198,
      isLiked: false,
    },
  ],
};