import { useState } from "react";
import { Button } from "../ui";
import { ApproveToken } from "./ApproveToken";
import { ethers } from "ethers";
import { useWalletClient } from "wagmi";

import {
  SINGLE_DEPOSIT_ABI,
  SINGLE_DEPOSIT_CONTRACT_ADDRESS,
} from "@/contracts/singleDeposit/singleDepositFuji";

function SingleDeposit() {
  const [selectedToken, setSelectedToken] = useState<`0x${string}` | null>(
    null
  );
  const [amount, setAmount] = useState<string>(""); // 사용자 입력 금액
  const [isApproved, setIsApproved] = useState(false);
  const { data: walletClient } = useWalletClient();

  const handleApproved = () => {
    console.log("Approved!");

    setIsApproved(true);
  };

  const handleDeposit = async () => {
    const weiAmount = ethers.parseEther(amount);
    console.log("Deposit amount:", weiAmount.toString());

    if (selectedToken && weiAmount && isApproved && walletClient) {
      const provider = new ethers.BrowserProvider(walletClient);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        SINGLE_DEPOSIT_CONTRACT_ADDRESS,
        SINGLE_DEPOSIT_ABI,
        signer
      );

      try {
        const tx = await contract.stake(selectedToken, weiAmount);
        const depositResult = await tx.wait();
        console.log("Deposit result:", depositResult);

        console.log("Successfully deposited!");
      } catch (error) {
        console.error("Deposit failed:", error);
      }
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
