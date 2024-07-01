"use client";

import { useEffect, useState } from "react";
import { Button } from "@/shared/components/ui";
import { ApproveToken } from "./ApproveToken";
import { ethers } from "ethers";
import { useContract } from "@/shared/hooks/useContract";

import {
  Token,
  StakedTokens,
  PromiseState,
  Message,
} from "../types/singleDepositTypes";

import {
  SINGLE_DEPOSIT_ABI,
  SINGLE_DEPOSIT_CONTRACT_ADDRESS,
} from "@/contracts/singleDeposit/singleDepositFuji";

const allowedTokens: Token[] = JSON.parse(
  process.env.NEXT_PUBLIC_ALLOWED_TOKENS || "[]"
);

function SingleDeposit() {
  const { contract, loading, address } = useContract(
    SINGLE_DEPOSIT_CONTRACT_ADDRESS,
    SINGLE_DEPOSIT_ABI
  );

  const [stakedTokens, setStakedTokens] = useState<StakedTokens>({});
  const [rewardTokens, setRewardTokens] = useState<string>("");
  const [selectedToken, setSelectedToken] = useState<`0x${string}` | null>(
    null
  );
  const [amount, setAmount] = useState<string>(""); // 사용자 입력 금액
  const [isApproved, setIsApproved] = useState<boolean>(false);
  const [depositState, setDepositState] = useState<PromiseState>(
    PromiseState.IDLE
  );
  const [message, setMessage] = useState<Message>(null);

  const handleApproved = () => {
    console.log("Approved!");
    setIsApproved(true);
  };

  const handleDeposit = async () => {
    if (loading || !contract || !selectedToken || !amount) return;

    const weiAmount = ethers.parseEther(amount);
    console.log("Deposit amount:", weiAmount.toString());

    try {
      setDepositState(PromiseState.LOADING);
      setMessage(null);

      const tx = await contract.stake(selectedToken, weiAmount);
      console.log("Deposit transaction:", tx);

      const depositResult = await tx.wait();
      console.log("Deposit result:", depositResult);

      console.log("Successfully deposited!");

      const tokenSymbol = allowedTokens.find(
        (t) => t.address === selectedToken
      )?.symbol;
      setMessage({
        type: "success",
        content: `Successfully deposited ${amount} ${tokenSymbol}!`,
      });

      // 디파짓 완료 후 스테이킹 데이터 업데이트
      await getUserStakedTokens();
      setDepositState(PromiseState.FINISH);
    } catch (error: any) {
      console.error("Deposit failed:", error);
      setMessage({ type: "error", content: error.message });
      setDepositState(PromiseState.ERROR);
    }
  };

  // 토큰 활성화
  const handleAllowedTokens = async () => {
    if (loading || !contract) return;

    try {
      const tx = await contract.enableDepositToken(selectedToken);
      await tx.wait();
      console.log(`Token ${selectedToken} is now allowed.`);
    } catch (error) {
      console.error("Failed to enable deposit token:", error);
    }
  };

  const getUserStakedTokens = async () => {
    if (loading || !contract) return;

    try {
      const stakedData = await Promise.all(
        allowedTokens.map(async (token) => {
          const tokens = await contract.getStakedData(token.address, address);
          const stakedTokensInEther = ethers.formatUnits(tokens, 18);
          return { [token.symbol]: stakedTokensInEther };
        })
      );

      const mergedData = Object.assign({}, ...stakedData);
      console.log("Staked tokens:", mergedData);
      setStakedTokens(mergedData);
    } catch (error) {
      console.error("Failed to get staked tokens:", error);
    }
  };

  const getAllAllowedDepositTokens = async () => {
    if (loading || !contract) return;

    try {
      const tokens = await contract.getAllAllowedDepositTokens();
      console.log("Allowed tokens:", tokens);
    } catch (error) {
      console.error("Failed to get allowed tokens:", error);
    }
  };

  const getDepositReward = async () => {
    if (loading || !contract) return;

    try {
      const userClamiabletAAA = await contract.estimateReward2(
        allowedTokens[0].address,
        allowedTokens[1].address,
        address
      );
      const userClamiabletBBB = await contract.estimateReward2(
        allowedTokens[1].address,
        allowedTokens[0].address,
        address
      );

      const userClamiabletAAAInEther = ethers.formatUnits(
        userClamiabletAAA,
        18
      );
      const userClamiabletBBBInEther = ethers.formatUnits(
        userClamiabletBBB,
        18
      );
      const totalClaimable =
        parseFloat(userClamiabletAAAInEther) +
        parseFloat(userClamiabletBBBInEther);

      setRewardTokens(totalClaimable.toString());
    } catch (error) {
      console.error("Failed to get rewards:", error);
    }
  };

  useEffect(() => {
    if (!loading) {
      getUserStakedTokens();
      getAllAllowedDepositTokens();
      getDepositReward();
    }
  }, [loading, contract]);

  return (
    <div className="bg-white p-4 rounded-lg text-black">
      <h1 className="text-xl font-medium">Single Deposit</h1>
      <h2 className="text-lg font-medium mt-4">My rewards</h2>
      <p>{rewardTokens}</p>
      <h2 className="text-lg font-medium mt-4">Deposit Amount</h2>
      {Object.entries(stakedTokens).map(([symbol, amount]) => (
        <p key={symbol}>
          {amount} {symbol}
        </p>
      ))}
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
      <>
        <h2 className="text-lg font-medium mt-4">Deposit Token</h2>
        <Button
          color="green"
          onClick={handleDeposit}
          disabled={
            !selectedToken || !amount || depositState === PromiseState.LOADING
          }
        >
          {depositState === PromiseState.LOADING ? "Depositing..." : "Deposit"}
        </Button>
        {message && (
          <div
            className={`text-sm mt-2 ${
              message.type === "success" ? "text-green-500" : "text-red-500"
            }`}
          >
            {message.content}
          </div>
        )}
      </>
    </div>
  );
}

export default SingleDeposit;
