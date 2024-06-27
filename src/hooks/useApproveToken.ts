import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { useAccount, useWalletClient } from "wagmi";
import { erc20Abi } from "viem";

export const useApproveToken = (
  // tokenAddress: `0x${string}`,
  tokenAddress: any,
  amount: bigint,
  spender: `0x${string}`
) => {
  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();

  const [isApproving, setIsApproving] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const approveToken = async () => {
    if (!isConnected || !walletClient) {
      setError(new Error("Wallet is not connected"));
      return;
    }

    setIsApproving(true);
    setError(null);

    try {
      const provider = new ethers.BrowserProvider(walletClient);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(tokenAddress, erc20Abi, signer);
      const tx = await contract.approve(spender, amount);
      await tx.wait();
      setIsApproved(true);
    } catch (err) {
      if (err instanceof Error) {
        setError(err);
      } else {
        setError(new Error("An unknown error occurred"));
      }
    } finally {
      setIsApproving(false);
    }
  };

  return { approveToken, isApproving, isApproved, error };
};
