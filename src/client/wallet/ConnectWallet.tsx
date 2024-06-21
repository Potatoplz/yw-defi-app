"use client";

import { useAccount } from "wagmi";
import { Account } from "@/components/wallet/Account";
import { Connect } from "@/components/wallet/Connect";
import SingleDeposit from "@/components/test/SingleDeposit";
import useWatchNetworkChange from "@/hooks/useWatchNetworkChange";
import { useState } from "react";

export default function ConnectWallet() {
  const { isConnected } = useAccount();
  const [networkChanged, setNetworkChanged] = useState(false);

  useWatchNetworkChange(() => {
    setNetworkChanged((prev) => !prev);
  });

  return (
    <div className="container">
      {isConnected ? (
        <>
          <Account />
          <SingleDeposit key={networkChanged ? "changed" : "initial"} />
        </>
      ) : (
        <Connect />
      )}
    </div>
  );
}
