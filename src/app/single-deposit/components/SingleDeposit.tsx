"use client";

import { useEffect, useState } from "react";
import { Button } from "@/shared/components/ui";
import { ApproveToken } from "./ApproveToken";
import { ethers } from "ethers";
import { useContract } from "@/shared/hooks/useContract";
import { useAsyncState, AsyncState } from "@/shared/hooks/useAsyncState";

import { Token, StakedTokens } from "../types/singleDepositTypes";

import {
  SINGLE_DEPOSIT_ABI,
  SINGLE_DEPOSIT_CONTRACT_ADDRESS,
} from "@/contracts/singleDeposit/singleDepositFuji";

// TODO: 꼭 파싱해서 써야하는지 확인
const allowedTokens: Token[] = JSON.parse(
  process.env.NEXT_PUBLIC_ALLOWED_TOKENS || "[]"
);

function SingleDeposit() {
  const {
    contract,
    state: contractState,
    error: contractError,
    address,
  } = useContract(SINGLE_DEPOSIT_CONTRACT_ADDRESS, SINGLE_DEPOSIT_ABI);

  const [stakedTokens, setStakedTokens] = useState<StakedTokens>({});
  const [rewardTokens, setRewardTokens] = useState<string>("");
  const [selectedToken, setSelectedToken] = useState<`0x${string}` | null>(
    null
  );
  const [amount, setAmount] = useState<string>("");
  const [isApproved, setIsApproved] = useState<boolean>(false);

  const {
    state: depositState,
    error: depositError,
    setLoading: setDepositLoading,
    setSuccess: setDepositSuccess,
    setErrorState: setDepositError,
  } = useAsyncState();

  // TODO: 나중에연결
  const handleApproved = () => {
    console.log("Approved!");
    setIsApproved(true);
  };

  const handleDeposit = async () => {
    if (
      contractState === AsyncState.LOADING ||
      !contract ||
      !selectedToken ||
      !amount
    )
      return;

    const weiAmount = ethers.parseEther(amount);

    try {
      setDepositLoading();

      const tx = await contract.stake(selectedToken, weiAmount);
      const depositResult = await tx.wait();
      // console.log("Deposit result:", depositResult);

      setDepositSuccess();
      await getUserStakedTokens();
    } catch (error: any) {
      setDepositError(error);
    }
  };

  const handleAllowedTokens = async () => {
    if (contractState === AsyncState.LOADING || !contract) return;

    try {
      const tx = await contract.enableDepositToken(selectedToken);
      await tx.wait();
    } catch (error) {
      console.error("Failed to enable deposit token:", error);
    }
  };

  const getUserStakedTokens = async () => {
    if (contractState === AsyncState.LOADING || !contract) return;

    try {
      const stakedData = await Promise.all(
        allowedTokens.map(async (token) => {
          const tokens = await contract.getStakedData(token.address, address);
          const stakedTokensInEther = ethers.formatUnits(tokens, 18);
          return { [token.symbol]: stakedTokensInEther };
        })
      );

      const mergedData = Object.assign({}, ...stakedData);
      setStakedTokens(mergedData);
    } catch (error) {
      console.error("Failed to get staked tokens:", error);
    }
  };

  const getAllAllowedDepositTokens = async () => {
    if (contractState === AsyncState.LOADING || !contract) return;

    try {
      const tokens = await contract.getAllAllowedDepositTokens();
      console.log("Allowed tokens:", tokens);
    } catch (error) {
      console.error("Failed to get allowed tokens:", error);
    }
  };

  const getDepositReward = async () => {
    if (contractState === AsyncState.LOADING || !contract) return;

    try {
      const [userClamiabletAAA, userClamiabletBBB] = await Promise.all([
        contract.estimateReward2(
          allowedTokens[0].address,
          allowedTokens[1].address,
          address
        ),
        contract.estimateReward2(
          allowedTokens[1].address,
          allowedTokens[0].address,
          address
        ),
      ]);

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
    if (contractState !== AsyncState.LOADING) {
      getUserStakedTokens();
      getAllAllowedDepositTokens();
      getDepositReward();
    }
  }, [contractState, contract]);

  return (
    <div className="bg-white p-4 rounded-lg text-black">
      <h1 className="text-xl font-medium">Single Deposit</h1>

      {/* ======================== My rewards ======================== */}
      <h2 className="text-lg font-medium mt-4">My rewards</h2>
      <p>{rewardTokens}</p>

      {/* ======================== Deposit Amount ======================== */}
      <h2 className="text-lg font-medium mt-4">Deposit Amount</h2>
      {Object.entries(stakedTokens).map(([symbol, amount]) => (
        <p key={symbol}>
          {amount} {symbol}
        </p>
      ))}

      {/* ======================== Approve Token ======================== */}
      <ApproveToken
        onApproved={handleApproved}
        selectedToken={selectedToken}
        setSelectedToken={setSelectedToken}
        amount={amount}
        setAmount={setAmount}
        contractAddress={SINGLE_DEPOSIT_CONTRACT_ADDRESS}
      />

      {/* ======================== Enable Token ======================== */}
      <h2 className="text-lg font-medium mt-4">Enable Token</h2>
      <Button
        color="blue"
        onClick={handleAllowedTokens}
        disabled={!selectedToken}
      >
        Enable Token
      </Button>

      {/* ======================== Deposit Token ======================== */}
      <h2 className="text-lg font-medium mt-4">Deposit Token</h2>
      <Button
        color="green"
        onClick={handleDeposit}
        disabled={
          !selectedToken || !amount || depositState === AsyncState.LOADING
        }
      >
        {depositState === AsyncState.LOADING ? "Depositing..." : "Deposit"}
      </Button>
      {depositState === AsyncState.SUCCESS && (
        <div className="text-sm text-green-500 mt-2">
          Successfully deposited {amount}{" "}
          {allowedTokens.find((t) => t.address === selectedToken)?.symbol}!
        </div>
      )}
      {depositError && (
        <div className="text-sm text-red-500 mt-2">{depositError.message}</div>
      )}
    </div>
  );
}

export default SingleDeposit;
