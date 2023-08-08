import { configureChains, createConfig } from "wagmi";
import { optimism, optimismGoerli } from "wagmi/chains";

import { publicProvider } from "wagmi/providers/public";
import { infuraProvider } from "wagmi/providers/infura";
import { getDefaultWallets } from "@rainbow-me/rainbowkit";

const walletConnectProjectId = "cec4e73ceb25170b43bd2dbf802a7f95";

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [optimism, optimismGoerli],
  [
    infuraProvider({ apiKey: "b8ed6f629b514a4fa5d9503c5798451f" }),
    publicProvider(),
  ]
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
