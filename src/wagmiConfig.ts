import { configureChains, createConfig } from "wagmi";
import { optimismGoerli } from "wagmi/chains";

import { publicProvider } from "wagmi/providers/public";
import { getDefaultWallets } from "@rainbow-me/rainbowkit";

const walletConnectProjectId = "cec4e73ceb25170b43bd2dbf802a7f95";

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [optimismGoerli],
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
