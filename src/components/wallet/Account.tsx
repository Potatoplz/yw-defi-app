"use client";

import { useEffect } from "react";
import { useAccount, useDisconnect, UseBalanceReturnType } from "wagmi";
import { Button } from "../ui";
import {
  useNativeBalance,
  useTokenBalances,
  useTokenBalances2,
} from "@/hooks/useBalances";

export function Account() {
  const { address, connector } = useAccount();
  const { disconnect } = useDisconnect();

  const nativeBalance: UseBalanceReturnType = useNativeBalance(address);
  const tokenBalances: UseBalanceReturnType[] = useTokenBalances(address);
  const { data: tokenBalances2Data } = useTokenBalances2(address);

  // useEffect(() => {
  //   if (nativeBalance.data) {
  //     console.log("Native Balance:", serializeBalanceData(nativeBalance.data));
  //   }

  //   tokenBalances.forEach(({ data }, index) => {
  //     if (data) {
  //       console.log(`Token Balance ${index}:`, serializeBalanceData(data));
  //     }
  //   });

  //   console.log(">>>> Token Balances 2:", tokenBalances2Data);
  // }, [nativeBalance.data, tokenBalances, tokenBalances2Data]);

  const serializeBalanceData = (data: any) => {
    if (!data) return null;
    return {
      ...data,
      value: data.value.toString(),
    };
  };

  return (
    <div className="flex flex-col items-start space-y-4 bg-black p-4 rounded-lg text-white">
      <div className="flex items-center space-x-4">
        <div className="flex flex-col">
          {address && (
            <div className="text-sm font-medium text-white">{address}</div>
          )}
          <div className="text-xs text-gray-500">
            Connected to {connector?.name} Connector
          </div>
        </div>
      </div>
      {nativeBalance.isLoading ? (
        <div className="text-xs text-gray-500">Loading balance...</div>
      ) : nativeBalance.isError ? (
        <div className="text-xs text-red-500">Failed to fetch balance</div>
      ) : (
        <div className="text-sm font-medium text-white">
          Native Balance: {nativeBalance.data?.formatted}{" "}
          {nativeBalance.data?.symbol}
        </div>
      )}
      <div className="text-sm font-medium text-white mt-4">
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
      <div className="text-sm font-medium text-white mt-4">
        Token Balances 2:
        {!tokenBalances2Data || tokenBalances2Data.length === 0 ? (
          <div>Loading token balances...</div>
        ) : (
          tokenBalances2Data.map((balance: any, index: number) =>
            index % 2 === 0 ? (
              <div key={index}>
                {balance.status === "failure" && (
                  <div>Failed to fetch token balances</div>
                )}
                {balance.status === "success" && (
                  <div>
                    Token{[index]} Balance:{" "}
                    {balance.result
                      ? balance.result.toString()
                      : "Invalid data"}{" "}
                    {tokenBalances2Data[index + 1]?.result || "Unknown"}
                  </div>
                )}
              </div>
            ) : null
          )
        )}
      </div>
      <Button color="red" onClick={() => disconnect()}>
        Disconnect
      </Button>
    </div>
  );
}
