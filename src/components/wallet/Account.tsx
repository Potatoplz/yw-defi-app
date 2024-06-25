"use client";

import { useEffect } from "react";
import {
  useAccount,
  useDisconnect,
  useEnsAvatar,
  useEnsName,
  UseBalanceReturnType,
  UseReadContractReturnType,
} from "wagmi";
import { Button } from "../ui";
import {
  useNativeBalance,
  useTokenBalances,
  useTokenBalances2,
} from "@/hooks/useBalances";

export function Account() {
  const { address, connector } = useAccount();
  const { disconnect } = useDisconnect();
  const { data: ensName } = useEnsName({ address });
  const { data: ensAvatar } = useEnsAvatar({ name: ensName! });

  const nativeBalance: UseBalanceReturnType = useNativeBalance(address);
  const tokenBalances: UseBalanceReturnType[] = useTokenBalances(address);
  const tokenBalances2: UseReadContractReturnType = useTokenBalances2(address);

  const formattedAddress = formatAddress(address);

  // Log the balance data to the console
  useEffect(() => {
    if (nativeBalance.data) {
      console.log("Native Balance:", serializeBalanceData(nativeBalance.data));
    }

    tokenBalances.forEach(({ data }, index) => {
      if (data) {
        console.log(`Token Balance ${index}:`, serializeBalanceData(data));
      }
    });

    console.log(">>>> Token Balances 2:", tokenBalances2.data);
  }, [nativeBalance.data, tokenBalances]);

  // Serialize the balance data to log BigInt values
  const serializeBalanceData = (data: any) => {
    if (!data) return null;
    return {
      ...data,
      value: data.value.toString(), // Convert BigInt to string
    };
  };

  return (
    <div className="flex flex-row items-center space-x-4">
      <div className="flex items-center space-x-4">
        {ensAvatar ? (
          <img
            alt="ENS Avatar"
            className="w-10 h-10 rounded-full"
            src={ensAvatar}
          />
        ) : (
          <div className="w-10 h-10 bg-gray-200 rounded-full" />
        )}
        <div className="flex flex-col">
          {address && (
            <div className="text-sm font-medium text-white-900">
              {ensName ? `${ensName} (${formattedAddress})` : formattedAddress}
            </div>
          )}
          <div className="text-xs text-gray-500">
            Connected to {connector?.name} Connector
          </div>
          {nativeBalance.isLoading ? (
            <div className="text-xs text-gray-500">Loading balance...</div>
          ) : nativeBalance.isError ? (
            <div className="text-xs text-red-500">Failed to fetch balance</div>
          ) : (
            <div className="text-sm font-medium text-white-900">
              Native Balance: {nativeBalance.data?.formatted}{" "}
              {nativeBalance.data?.symbol}
            </div>
          )}

          <div className="text-sm font-medium text-white-900 mt-4">
            Token Balances:
            {tokenBalances.map(({ data, isLoading, isError }, index) => (
              <div key={index}>
                {isLoading ? (
                  <div>Loading balance for token...</div>
                ) : isError ? (
                  <div>Failed to fetch balance for token </div>
                ) : (
                  <div>
                    Token{[index]} Balance: {data?.formatted} {data?.symbol}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      <Button color="red" onClick={() => disconnect()}>
        Disconnect
      </Button>
    </div>
  );
}

function formatAddress(address?: string) {
  if (!address) return null;
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}
