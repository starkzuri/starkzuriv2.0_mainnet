import { createRoot } from "react-dom/client";
import React from "react";
import App from "./App.tsx";
import "./index.css";
import { WalletProvider } from "./context/WalletContext.tsx";
import { PrivyProvider } from "@privy-io/react-auth";

const privyAppId = import.meta.env.VITE_PRIVY_APP_ID;
if (!privyAppId || privyAppId === "your-privy-app-id") {
  throw new Error(
    "Set VITE_PRIVY_APP_ID in examples/gift-app/.env to your Privy App ID (same one used by the server)"
  );
}

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <PrivyProvider
      appId={privyAppId}
      config={{
        loginMethods: ["google", "wallet"],
        appearance: { theme: "dark" },
      }}
    >
    <WalletProvider>
      <App />
    </WalletProvider>
    </PrivyProvider>
  </React.StrictMode>
);
