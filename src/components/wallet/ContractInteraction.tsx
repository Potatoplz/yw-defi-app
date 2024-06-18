// components/wallet/ContractInteraction.tsx
"use client";

import { useState } from "react";
import { useAccount, useWalletClient } from "wagmi";
import { ethers } from "ethers";

const CONTRACT_ADDRESS = "your_contract_address";
const CONTRACT_ABI = [{}];

export function ContractInteraction() {
  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  const [contractValue, setContractValue] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  async function readContract() {
    if (!walletClient) return;

    setLoading(true);
    try {
      const provider = new ethers.BrowserProvider(walletClient);
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        CONTRACT_ABI,
        provider
      );
      const value = await contract.yourReadFunction(); // 여기에 읽기 함수 추가
      setContractValue(value.toString());
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function writeContract() {
    if (!walletClient) return;

    setLoading(true);
    try {
      const provider = new ethers.BrowserProvider(walletClient);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        CONTRACT_ABI,
        signer
      );
      const tx = await contract.yourWriteFunction(); // 여기에 쓰기 함수 추가
      await tx.wait();
      readContract(); // 쓰기 후 계약 값을 읽음 (선택 사항)
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  if (!isConnected) return <div>Please connect your wallet</div>;

  return (
    <div>
      <div>Connected Wallet: {address}</div>
      <div>
        <button onClick={readContract} disabled={loading}>
          {loading ? "Reading..." : "Read Contract"}
        </button>
        <button onClick={writeContract} disabled={loading}>
          {loading ? "Writing..." : "Write to Contract"}
        </button>
      </div>
      {contractValue && <div>Contract Value: {contractValue}</div>}
    </div>
  );
}
