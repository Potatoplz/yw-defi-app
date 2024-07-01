import { http, createConfig } from "wagmi";
import { base, mainnet, optimism, avalancheFuji } from "wagmi/chains";
import { injected, metaMask, safe, walletConnect } from "wagmi/connectors";

// wallet connect cloud project ID
const projectId = "3fbb6bba6f1de962d911bb5b5c9dba88";
const MetaMaskOptions = {
  dappMetadata: {
    name: "Example Wagmi dapp",
  },
  infuraAPIKey: "YOUR-API-KEY",
  // Other options.
};

export const WagmiConfig = createConfig({
  chains: [mainnet, optimism, base, avalancheFuji],
  ssr: true,
  connectors: [
    injected(),
    walletConnect({ projectId }),
    metaMask(MetaMaskOptions),
    safe(),
  ],
  transports: {
    [mainnet.id]: http(),
    [optimism.id]: http(),
    [base.id]: http(),
    [avalancheFuji.id]: http("https://api.avax-test.network/ext/bc/C/rpc"), // Avalanche Fuji testnet RPC URL
  },
});
