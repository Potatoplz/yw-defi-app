"use client";

import { useAccount } from "wagmi";
import { Account } from "@/app/wallet/components/Account";
import { Connect } from "@/app/wallet/components/Connect";
import SingleDeposit from "@/app/single-deposit/components/SingleDeposit";
import { useState, useEffect } from "react";

export default function ConnectWallet() {
  const { isConnected, chain } = useAccount();
  // const [networkChanged, setNetworkChanged] = useState(false);

  // // 네트워크 변경 감지 및 상태 업데이트
  // useEffect(() => {
  //   setNetworkChanged((prev) => !prev);
  // }, [chain?.id]);

  return (
    <div className="container">
      {isConnected ? (
        <>
          <Account />
          {/* <SingleDeposit key={networkChanged ? "changed" : "initial"} /> */}
          <SingleDeposit />
        </>
      ) : (
        <Connect />
      )}
    </div>
  );
}
