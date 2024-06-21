"use client";

import { useAccount } from "wagmi";
import { Account } from "@/components/wallet/Account";
import { Connect } from "@/components/wallet/Connect";
import SingleDeposit from "@/components/test/SingleDeposit";

export default function ConnectWallet() {
  const { isConnected } = useAccount();
  return (
    <div className="container">
      {isConnected ? (
        <>
          <Account />
          <SingleDeposit />
        </>
      ) : (
        <Connect />
      )}
    </div>
  );
}
