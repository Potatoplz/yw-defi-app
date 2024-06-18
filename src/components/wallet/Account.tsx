"use client";

import { useAccount, useDisconnect, useEnsAvatar, useEnsName } from "wagmi";
import { Button } from "../ui";

export function Account() {
  const { address, connector } = useAccount();
  const { disconnect } = useDisconnect();
  const { data: ensName } = useEnsName({ address });
  const { data: ensAvatar } = useEnsAvatar({ name: ensName! });

  const formattedAddress = formatAddress(address);

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
            <div className="text-sm font-medium text-gray-900">
              {ensName ? `${ensName} (${formattedAddress})` : formattedAddress}
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
  return `${address.slice(0, 6)}…${address.slice(38, 42)}`;
}
