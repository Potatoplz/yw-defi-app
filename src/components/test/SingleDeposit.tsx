import { useEffect, useState } from "react";
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
        console.log(">>> Allowed tokens: ", tokens);
        setAllowedTokens(tokens);
      } catch (error) {
        console.error("Error fetching allowed tokens:", error);
        setAllowedTokens(null); // 오류 발생 시 상태 초기화
      }
    }

    fetchAllowedTokens();
  }, [contract]);

  if (loading) {
    console.log("Loading contract data...");
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
