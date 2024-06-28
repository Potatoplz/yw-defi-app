import {
  useBalance,
  UseBalanceReturnType,
  useReadContracts,
  UseReadContractReturnType,
  useWriteContract,
  useSimulateContract,
} from "wagmi";
import { erc20Abi } from "viem";

// useBalance hook: Fetches the balance of a given address and token. [Deprecated]
export const useTokenBalances = (
  address?: `0x${string}`
): UseBalanceReturnType[] => {
  const tokens: any = [
    "0x538b2B6026D2b23c596677920fFd4b4bD82a0b17", // tAAA
    "0x6b7792E45F9e18CFb358166A7D4523aA75e8867e", // tBBB
    // Add more token addresses here
  ];

  const balances = tokens.map((token: any) =>
    useBalance({
      address,
      token,
    })
  );

  return balances;
};

// useReadContracts hook: Fetches the contract data using the contract address and ABI.
const testTokenContracts = [
  {
    address: "0x538b2B6026D2b23c596677920fFd4b4bD82a0b17", // tAAA
    abi: erc20Abi,
  },
  {
    address: "0x6b7792E45F9e18CFb358166A7D4523aA75e8867e", // tBBB
    abi: erc20Abi,
  },
] as const;

export const useTokenBalances2 = (
  address?: `0x${string}`,
  spender?: any,
  amount?: any
) => {
  const contracts = testTokenContracts.flatMap((testTokenContract) => [
    {
      ...testTokenContract,
      functionName: "balanceOf",
      args: [address],
    },
    {
      ...testTokenContract,
      functionName: "symbol",
    },
  ]);
  const balances = useReadContracts({
    contracts,
  });

  return balances;
};

// This hook returns the native balance of a given address.
// The native balance is the balance of the native token of the chain (e.g., ETH on Ethereum).
export const useNativeBalance = (
  address?: `0x${string}`
): UseBalanceReturnType => {
  return useBalance({
    address,
  });
};
