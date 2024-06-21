import { useEffect, useState } from "react";
import { useAccount, useWalletClient } from "wagmi";
import { ethers } from "ethers";
import { log } from "console";

// useContract hook: Fetches the contract instance using the contract address and ABI.
export function useContract(contractAddress: string, contractABI: any) {
  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function initContract() {
      if (isConnected && walletClient) {
        console.log(">>> Init contract: ", isConnected);
        console.log(">>> Contract address: ", contractAddress);
        console.log(">>> Wallet client: ", walletClient);
        console.log(">>> Wallet address: ", address);

        const provider = new ethers.BrowserProvider(walletClient);
        const signer = await provider.getSigner();
        const contractInstance = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        setContract(contractInstance);
        setLoading(false);
      }
    }

    initContract();
  }, [isConnected, walletClient, contractAddress, contractABI]);

  return { contract, loading };
}
