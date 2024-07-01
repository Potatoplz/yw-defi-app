import { ethers } from "ethers";
import { useAccount, useWalletClient } from "wagmi";
import { erc20Abi } from "viem";
import { useContract } from "@/shared/hooks/useContract";
import { useAsyncState, AsyncState } from "@/shared/hooks/useAsyncState";

export const useApproveToken = (
  tokenAddress: `0x${string}` | null,
  amount: bigint,
  spender: `0x${string}`
) => {
  const { isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();

  const {
    contract,
    state: contractState,
    error: contractError,
  } = useContract(tokenAddress, erc20Abi);
  const { state, error, setLoading, setSuccess, setErrorState } =
    useAsyncState();

  const approveToken = async () => {
    if (!isConnected || !walletClient) {
      setErrorState(new Error("Wallet is not connected"));
      return;
    }

    if (contractState === AsyncState.LOADING || !contract) {
      setErrorState(new Error("Contract is not ready"));
      return;
    }

    setLoading();

    try {
      const tx = await contract.approve(spender, amount);
      await tx.wait();
      setSuccess();
    } catch (err) {
      if (err instanceof Error) {
        setErrorState(err);
      } else {
        setErrorState(new Error("An unknown error occurred"));
      }
    }
  };

  return { approveToken, state, error };
};
