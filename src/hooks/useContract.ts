import { useEffect, useState } from "react";
import { useAccount, useWalletClient } from "wagmi";
import { ethers } from "ethers";

import { WagmiConfig } from "@/utils/wagmi/WagmiConfig";
import { getChains } from "@wagmi/core";

// useContract hook: Fetches the contract instance using the contract address and ABI.
export function useContract(contractAddress: string, contractABI: any) {
  const { address, isConnected, connector } = useAccount();
  const { data: walletClient } = useWalletClient();
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function initContract() {
      if (isConnected && walletClient) {
        console.log(
          ">>> Init contract: ",
          isConnected,
          contractAddress,
          walletClient,
          address
        );

        console.log(">>> Get chains: ", getChains(WagmiConfig));

        const provider = new ethers.BrowserProvider(walletClient);
        const signer = await provider.getSigner();
        const contractInstance = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        console.log(">>> Contract instance: ", contractInstance);

        setContract(contractInstance);
        setLoading(false);
      }
    }

    initContract();
  }, [isConnected, walletClient, contractAddress, contractABI]);

  return { contract, loading, address, connector };
}