import { optimismGoerli } from "wagmi/chains";

export const addresses = {
  publicPool: {
    [optimismGoerli.id]: "0x47A79023f381593e0bed8320d6b457bc08a57d2b",
  },
  usdc: {
    [optimismGoerli.id]: "0x5f1C3c9D42F531975EdB397fD4a34754cc8D3b71",
  },
} as const;
