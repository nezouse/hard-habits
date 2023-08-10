import { optimismGoerli } from "wagmi/chains";

export const addresses = {
  publicPool: {
    [optimismGoerli.id]: "0xAc5B1dc41185dC18B0690083D4996B6cB9B4deFe",
  },
  usdc: {
    [optimismGoerli.id]: "0x5f1C3c9D42F531975EdB397fD4a34754cc8D3b71",
  },
} as const;
