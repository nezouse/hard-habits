import { defineConfig } from "@wagmi/cli";
import { etherscan, react } from "@wagmi/cli/plugins";

export default defineConfig({
  out: "src/generated.ts",
  contracts: [],
  plugins: [
    etherscan({
      apiKey: "RPKYAHCE6R2YI7TRV51WS5N8R885RRNXG3",
      chainId: 420,
      contracts: [
        {
          name: "AttestationStation",
          address: "0x4200000000000000000000000000000000000021",
        },
      ],
    }),
    react(),
  ],
});
