# 🔮 StarkZuri v2 — Frontend Client

> **The Frictionless Social Prediction Market on Starknet**

StarkZuri bridges the gap between Web2 UX and Web3 architecture. Users sign in with an email or social account, instantly receive a Starknet wallet, and trade shares on prediction markets — with all gas fees sponsored transparently in the background.

> **Note:** The StarkZuri indexer, database, and Paymaster proxy are hosted in a separate private repository.

---

## ✨ Features

### Frictionless Onboarding
Integrated with [Privy](https://privy.io) for seamless email and social logins. No browser extensions, seed phrases, or crypto knowledge required.

### Zero Gas Fees
Fully integrated with AVNU Paymasters via SNIP-9 Outside Execution. Transaction fees are sponsored for users and routed securely through the StarkZuri backend.

### Optimistic UI
Lightning-fast state updates for social actions (likes, reposts, comments) and market trading — UI responds instantly without waiting for on-chain confirmation.

### Web3 Wallet Support
Native support for Argent X and Braavos via StarknetKit, alongside Privy embedded wallets — both routing through a unified execution layer.

### Starknet Native
Built with `starknet.js` v6, interacting directly with Cairo 1.0 smart contracts on Starknet Mainnet.

---

## 🛠 Tech Stack

| Category | Technology |
|---|---|
| Framework | React + Vite |
| Styling | Tailwind CSS + Lucide Icons |
| Starknet | starknet.js v6 + StarkZap |
| Authentication | Privy React SDK |
| Wallet (Web3) | StarknetKit (Argent, Braavos) |
| Notifications | Sonner |
| Animations | Motion (Framer) |

---

## 🚀 Local Development

### Prerequisites

- Node.js **v18+**
- `npm`, `yarn`, or `pnpm`

### 1. Clone and Install
```bash
git clone https://github.com/starkzuri/starkzuriv2.0_mainnet.git
cd starkzuri-mainnet
npm install
```

### 2. Environment Variables

Create a `.env` file in the project root:
```env
# ── Backend ────────────────────────────────────────────────
# Point to the live StarkZuri API, or localhost if running locally
VITE_INDEXER_SERVER_URL=https://your-starkzuri-backend.onrender.com

# ── Starknet RPC ────────────────────────────────────────────
VITE_NODE_URL=https://starknet-mainnet.g.alchemy.com/v2/YOUR_KEY

# ── Smart Contracts ─────────────────────────────────────────
VITE_PROFILE_ADDRESS=0x01da2336ce...
VITE_HUB_ADDRESS=0x...
VITE_USDC_ADDRESS=0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8

# ── Privy ───────────────────────────────────────────────────
VITE_PRIVY_APP_ID=your-privy-app-id
VITE_PRIVY_SERVER_URL=https://your-privy-signing-server.onrender.com
```

> **Never commit your `.env` file.** It is already included in `.gitignore`.

### 3. Start the Dev Server
```bash
npm run dev
```

The app will be available at `http://localhost:3000`.

---

## 🏗 Architecture Overview
```
src/
├── components/        # UI components (Feed, Market, Portfolio, etc.)
├── hooks/
│   ├── useAuth.ts     # Unified auth hook — web3 + Privy
│   ├── useTrade.ts    # Trade execution (works for all wallet types)
│   └── useProfile.ts  # Profile update transactions
├── stores/
│   └── wallet.ts      # Zustand store — StarkZap wallet state
├── context/
│   └── WalletContext  # Web3 wallet context (Argent, Braavos)
└── constants.ts       # Network config, contract addresses
```

### Wallet Execution Flow

StarkZuri supports two wallet strategies that are unified behind a single `execute()` function:
```
User Action
    │
    ▼
useAuth.execute(calls)
    │
    ├── web3Account (Argent / Braavos)
    │       └── account.execute(calls)       ← standard starknet.js
    │
    └── privyWallet (Privy embedded wallet)
            └── wallet.execute(calls)        ← StarkZap (sponsored via AVNU)
```

This means **no component needs to know which wallet type is connected** — they all just call `execute()`.

---

## 🌍 Deployment

StarkZuri is optimized for deployment on [Vercel](https://vercel.com) or [Netlify](https://netlify.com).

| Setting | Value |
|---|---|
| Build command | `npm run build` |
| Output directory | `dist` |
| Node version | 18+ |

Set all `VITE_*` environment variables in your hosting provider's dashboard before deploying. None of these values are bundled securely — treat contract addresses and API keys as sensitive.

---

## 📄 License

MIT © StarkZuri