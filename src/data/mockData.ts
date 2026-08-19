import { Comment } from "../types/prediction";

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