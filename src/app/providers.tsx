"use client";

import * as React from "react";
import { WagmiConfig } from "wagmi";

import { config, chains } from "../wagmiConfig";
import { RainbowKitProvider, lightTheme } from "@rainbow-me/rainbowkit";

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  return (
    <WagmiConfig config={config}>
      <RainbowKitProvider
        chains={chains}
        theme={lightTheme({
          accentColor: "#facc15",
          accentColorForeground: "black",
        })}
      >
        {mounted && children}
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
