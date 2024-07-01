import { useEffect, useState } from "react";
import { useAccount, useWalletClient } from "wagmi";
import { ethers } from "ethers";
import { useAsyncState } from "@/shared/hooks/useAsyncState";

export function useContract(contractAddress: any, contractABI: any) {
  const { address, isConnected, connector, chain } = useAccount();
  const { data: walletClient } = useWalletClient();
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const { state, error, setLoading, setSuccess, setErrorState } =
    useAsyncState();

  useEffect(() => {
    async function initContract() {
      if (isConnected && walletClient) {
        try {
          setLoading();

          console.log(">>> Connected Chain: ", chain);

          const provider = new ethers.BrowserProvider(walletClient);
          const signer = await provider.getSigner();
          const contractInstance = new ethers.Contract(
            contractAddress,
            contractABI,
            signer
          );

          // console.log(">>> Contract instance: ", contractInstance);

          setContract(contractInstance);
          setSuccess();
        } catch (err) {
          setErrorState(new Error("An unknown error occurred"));
        }
      }
    }

    initContract();
  }, [isConnected, walletClient, contractAddress, contractABI, chain?.id]);

  return { contract, state, error, address, connector };
}
