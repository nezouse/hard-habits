import { optimismGoerli } from "wagmi/chains";

export const addresses = {
  publicPool: {
    [optimismGoerli.id]: "0x751B8218Dd89C9E5F34469b24f44821D49F309D0",
  },
  usdc: {
    [optimismGoerli.id]: "0x5f1C3c9D42F531975EdB397fD4a34754cc8D3b71",
  },
} as const;
