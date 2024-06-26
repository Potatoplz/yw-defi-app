import { useEffect, useState } from "react";
import { useContract } from "@/hooks/useContract";
import {
  SINGLE_DEPOSIT_ABI,
  SINGLE_DEPOSIT_CONTRACT_ADDRESS,
} from "@/contracts/singleDeposit/singleDepositFuji";
import { useApproveToken } from "@/hooks/useApproveToken";
import { Button } from "../ui";

function SingleDeposit() {
  const { contract, loading } = useContract(
    SINGLE_DEPOSIT_CONTRACT_ADDRESS,
    SINGLE_DEPOSIT_ABI
  );
  const [allowedTokens, setAllowedTokens] = useState<string[] | null>(null);
  const [selectedToken, setSelectedToken] = useState<`0x${string}` | null>(
    null
  );
  const [spender] = useState<`0x${string}`>(SINGLE_DEPOSIT_CONTRACT_ADDRESS); // 스펜더 주소는 계약 주소로 설정
  const [amount] = useState<bigint>(BigInt(1000000000000000000)); // 예시 금액 (1 토큰, 18 소수점)

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

  const { approveToken, isApproving, isApproved, error } = useApproveToken(
    selectedToken as `0x${string}`,
    amount,
    spender
  );

  const handleApprove = (token: `0x${string}`) => {
    setSelectedToken(token);
    approveToken();
  };

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
            <li key={index}>
              {token}
              <Button
                color="blue"
                onClick={() =>
                  handleApprove(
                    "0x538b2B6026D2b23c596677920fFd4b4bD82a0b17" as `0x${string}`
                  )
                }
                disabled={isApproving}
              >
                {isApproving ? "Approving..." : "Approve"}
              </Button>
              {selectedToken === token && isApproved && (
                <div className="text-sm text-green-500">Token approved!</div>
              )}
              {selectedToken === token && error && (
                <div className="text-sm text-red-500">{error.message}</div>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No data available</p>
      )}
    </div>
  );
}

export default SingleDeposit;
