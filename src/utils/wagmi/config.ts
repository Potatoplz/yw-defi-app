import { http, createConfig } from "wagmi";
import { base, mainnet, optimism } from "wagmi/chains";
import { injected, metaMask, safe, walletConnect } from "wagmi/connectors";

const projectId = "3fbb6bba6f1de962d911bb5b5c9dba88";
const MetaMaskOptions = {
  dappMetadata: {
    name: "Example Wagmi dapp",
  },
  infuraAPIKey: "YOUR-API-KEY",
  // Other options.
};

export const config = createConfig({
  chains: [mainnet, optimism, base],
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
  },
});
