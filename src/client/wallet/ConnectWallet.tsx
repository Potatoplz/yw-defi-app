"use client";

import { useAccount } from "wagmi";

import { Account } from "@/components/wallet/Account";
import { Connect } from "@/components/wallet/Connect";
import { ContractInteraction } from "@/components/wallet/ContractInteraction";

export default function ConnectWallet() {
  const { isConnected } = useAccount();
  return (
    <div className="container">
      {isConnected ? (
        <>
          <Account />
          <ContractInteraction />
        </>
      ) : (
        <Connect />
      )}
    </div>
  );
}
