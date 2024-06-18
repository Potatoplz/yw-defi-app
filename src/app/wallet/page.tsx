"use client";
// import ConnectWallet from "@/client/wallet/ConnectWallet";

// export default function ConnectWalletPage() {
//   return <ConnectWallet />;
// }
import { useAccount } from "wagmi";

import { Account } from "@/components/wallet/Account";
import { Connect } from "@/components/wallet/Connect";

export default function ConnectWallet() {
  const { isConnected } = useAccount();
  return (
    <div className="container">{isConnected ? <Account /> : <Connect />}</div>
  );
}
