import { configureChains, createConfig } from "wagmi";
import { optimismGoerli, zoraTestnet, baseGoerli } from "wagmi/chains";

import { publicProvider } from "wagmi/providers/public";
import { getDefaultWallets } from "@rainbow-me/rainbowkit";

const walletConnectProjectId = "cec4e73ceb25170b43bd2dbf802a7f95";

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [
    optimismGoerli,
    baseGoerli,
    zoraTestnet,
    {
      id: 919,
      name: "Mode Testnet",
      network: "mode-testnet",
      nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
      rpcUrls: {
        default: {
          http: ["https://sepolia.mode.network"],
        },
        public: {
          http: ["https://sepolia.mode.network"],
        },
      },
      blockExplorers: {
        default: {
          name: "Blockscout",
          url: "https://sepolia.explorer.mode.network",
        },
      },
      testnet: true,
    },
  ],
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: "Hard habits",
  projectId: walletConnectProjectId,
  chains,
});

export const config = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});

export { chains, publicClient };
