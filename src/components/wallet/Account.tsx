"use client";

import {
  useAccount,
  useDisconnect,
  useEnsAvatar,
  useEnsName,
  useBalance,
} from "wagmi";
import { Button } from "../ui";
import { useEffect } from "react";

export function Account() {
  const { address, connector } = useAccount();
  const { disconnect } = useDisconnect();
  const { data: ensName } = useEnsName({ address });
  const { data: ensAvatar } = useEnsAvatar({ name: ensName! });

  // Fetch balance data
  const {
    data: balanceData,
    isError,
    isLoading,
  } = useBalance({
    address,
  });

  const formattedAddress = formatAddress(address);

  // Log balance data when it changes
  useEffect(() => {
    if (balanceData) {
      console.log("Balance Data:", balanceData);
      // JSON.stringify doesn't handle BigInts well, so we need to convert them to strings
      console.log(JSON.stringify(serializeBalanceData(balanceData), null, 2));
    }
  }, [balanceData]);

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

          {isLoading ? (
            <div className="text-xs text-gray-500">Loading balance...</div>
          ) : isError ? (
            <div className="text-xs text-red-500">Failed to fetch balance</div>
          ) : (
            <div className="text-sm font-medium text-white-900">
              Balance: {balanceData?.formatted} {balanceData?.symbol}
            </div>
          )}

          <div className="text-xs text-gray-500">
            Connected to {connector?.name} Connector
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
