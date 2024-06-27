import { useState } from "react";
import { Button } from "../ui";
import { ApproveToken } from "./ApproveToken";
import { ethers } from "ethers";
import { useContract } from "@/hooks/useContract";

import {
  SINGLE_DEPOSIT_ABI,
  SINGLE_DEPOSIT_CONTRACT_ADDRESS,
} from "@/contracts/singleDeposit/singleDepositFuji";

function SingleDeposit() {
  const { contract, loading } = useContract(
    SINGLE_DEPOSIT_CONTRACT_ADDRESS,
    SINGLE_DEPOSIT_ABI
  );

  const [selectedToken, setSelectedToken] = useState<`0x${string}` | null>(
    null
  );
  const [amount, setAmount] = useState<string>(""); // 사용자 입력 금액
  const [isApproved, setIsApproved] = useState(false);

  const handleApproved = () => {
    console.log("Approved!");

    setIsApproved(true);
  };

  const handleDeposit = async () => {
    const weiAmount = ethers.parseEther(amount);
    console.log("Deposit amount:", weiAmount.toString());

    if (selectedToken && weiAmount) {
      if (!contract) return;

      try {
        const tokens = await contract.getAllAllowedDepositTokens(); // 함수 호출
        console.log("Allowed tokens:", tokens);

        const tx = await contract.stake(selectedToken, weiAmount);
        console.log("Deposit transaction:", tx);

        const depositResult = await tx.wait();
        console.log("Deposit result:", depositResult);

        console.log("Successfully deposited!");
      } catch (error) {
        console.error("Deposit failed:", error);
      }
    }
  };

  // 토큰 활성화
  const handleAllowedTokens = async () => {
    try {
      if (!contract) return;

      const tx = await contract.enableDepositToken(selectedToken);
      await tx.wait();
      console.log(`Token ${selectedToken} is now allowed.`);
    } catch (error) {
      console.error("Failed to enable deposit token:", error);
    }
  };

  return (
    <div className="bg-black p-4 rounded-lg text-white">
      <ApproveToken
        onApproved={handleApproved}
        selectedToken={selectedToken}
        setSelectedToken={setSelectedToken}
        amount={amount}
        setAmount={setAmount}
        contractAddress={SINGLE_DEPOSIT_CONTRACT_ADDRESS}
      />
      <h2 className="text-lg font-medium mt-4">Enable Token</h2>

      <Button
        color="blue"
        onClick={handleAllowedTokens}
        disabled={!selectedToken}
      >
        Enable Token
      </Button>
      {isApproved && (
        <>
          <h2 className="text-lg font-medium mt-4">Deposit Token</h2>
          <Button
            color="green"
            onClick={handleDeposit}
            disabled={!selectedToken || !amount}
          >
            Deposit
          </Button>
        </>
      )}
    </div>
  );
}

export default SingleDeposit;
