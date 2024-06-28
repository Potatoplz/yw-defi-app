import { useEffect, useState } from "react";
import { Button } from "../ui";
import { ApproveToken } from "./ApproveToken";
import { ethers } from "ethers";
import { useContract } from "@/hooks/useContract";
import { useAccount } from "wagmi";

import {
  SINGLE_DEPOSIT_ABI,
  SINGLE_DEPOSIT_CONTRACT_ADDRESS,
} from "@/contracts/singleDeposit/singleDepositFuji";

const allowedTokens = [
  { address: "0x538b2B6026D2b23c596677920fFd4b4bD82a0b17", symbol: "tAAA" },
  { address: "0x6b7792E45F9e18CFb358166A7D4523aA75e8867e", symbol: "tBBB" },
];

type StakedTokens = {
  [symbol: string]: string;
};

function SingleDeposit() {
  const { contract, loading, address } = useContract(
    SINGLE_DEPOSIT_CONTRACT_ADDRESS,
    SINGLE_DEPOSIT_ABI
  );

  const [stakedTokens, setStakedTokens] = useState<StakedTokens>({});
  const [rewardTokens, setRewardTokens] = useState("");
  const [selectedToken, setSelectedToken] = useState<`0x${string}` | null>(
    null
  );
  const [amount, setAmount] = useState(""); // 사용자 입력 금액
  const [isApproved, setIsApproved] = useState(false);
  const [isDepositing, setIsDepositing] = useState(false); // 디파짓 중 상태
  const [successMessage, setSuccessMessage] = useState(""); // 성공 메시지 상태
  const [errorMessage, setErrorMessage] = useState(""); // 오류 메시지 상태

  const handleApproved = () => {
    console.log("Approved!");
    setIsApproved(true);
  };

  const handleDeposit = async () => {
    if (loading || !contract || !selectedToken || !amount) return;

    const weiAmount = ethers.parseEther(amount);
    console.log("Deposit amount:", weiAmount.toString());

    try {
      setIsDepositing(true);
      setSuccessMessage("");
      setErrorMessage("");

      const tokens = await contract.getAllAllowedDepositTokens();
      console.log("Allowed tokens:", tokens);

      const tx = await contract.stake(selectedToken, weiAmount);
      console.log("Deposit transaction:", tx);

      const depositResult = await tx.wait();
      console.log("Deposit result:", depositResult);

      console.log("Successfully deposited!");

      // 디파짓 성공 메시지 설정
      const tokenSymbol = allowedTokens.find(
        (t) => t.address === selectedToken
      )?.symbol;
      setSuccessMessage(`Successfully deposited ${amount} ${tokenSymbol}!`);

      // 디파짓 완료 후 스테이킹 데이터 업데이트
      await getUserStakedTokens();
    } catch (error: any) {
      console.error("Deposit failed:", error);
      setErrorMessage(error.message);
    } finally {
      setIsDepositing(false); // 디파짓 중 상태 해제
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

  // Add
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
    <div className="bg-black p-4 rounded-lg text-white">
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
          disabled={!selectedToken || !amount || isDepositing}
        >
          {isDepositing ? "Depositing..." : "Deposit"}
        </Button>
        {successMessage && (
          <div className="text-sm text-green-500 mt-2">{successMessage}</div>
        )}
        {errorMessage && (
          <div className="text-sm text-red-500 mt-2">{errorMessage}</div>
        )}
      </>
    </div>
  );
}

export default SingleDeposit;
