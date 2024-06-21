import React, { useEffect, useState } from "react";
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

  const [allowedTokens, setAllowedTokens] = useState<string[] | null>(null);

  useEffect(() => {
    async function fetchAllowedTokens() {
      if (!contract) return;

      try {
        const tokens = await contract.getAllAllowedDepositTokens(); // 함수 호출
        setAllowedTokens(tokens);
      } catch (error) {
        console.error("Error fetching allowed tokens:", error);
      }
    }

    fetchAllowedTokens();
  }, [contract]);

  if (loading) {
    return <p>Loading contract data...</p>;
  }

  return (
    <div>
      <h2>Allowed Deposit Tokens</h2>
      {allowedTokens ? (
        <ul>
          {allowedTokens.map((token, index) => (
            <li key={index}>{token}</li>
          ))}
        </ul>
      ) : (
        <p>No data available</p>
      )}
    </div>
  );
}

export default SingleDeposit;
