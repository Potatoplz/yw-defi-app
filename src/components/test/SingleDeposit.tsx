import { useState } from "react";
import { useApproveToken } from "@/hooks/useApproveToken";
import { Button } from "../ui";

import {
  SINGLE_DEPOSIT_ABI,
  SINGLE_DEPOSIT_CONTRACT_ADDRESS,
} from "@/contracts/singleDeposit/singleDepositFuji";

const allowedTokens = [
  { address: "0x538b2B6026D2b23c596677920fFd4b4bD82a0b17", symbol: "tAAA" },
  { address: "0x6b7792E45F9e18CFb358166A7D4523aA75e8867e", symbol: "tBBB" },
];

function SingleDeposit() {
  const [selectedToken, setSelectedToken] = useState<`0x${string}` | null>(
    null
  );
  const [spender] = useState<`0x${string}`>(SINGLE_DEPOSIT_CONTRACT_ADDRESS); // 스펜더 주소는 계약 주소로 설정
  const [amount, setAmount] = useState<string>(""); // 사용자 입력 금액

  const { approveToken, isApproving, isApproved, error } = useApproveToken(
    selectedToken,
    BigInt(amount ? (parseFloat(amount) * 10 ** 18).toString() : "0"), // ERC20 토큰은 18자리 소수점 이하를 사용하므로 10^18을 곱해준다.
    spender
  );

  const handleApprove = () => {
    if (selectedToken && amount) {
      approveToken();
    }
  };

  return (
    <div className="bg-black p-4 rounded-lg text-white">
      <h2 className="text-lg font-medium">Approve Deposit Token</h2>
      <select
        className="mt-2 p-2 bg-gray-800 text-white rounded"
        onChange={(e) => setSelectedToken(e.target.value as `0x${string}`)}
      >
        <option value="">Select Token</option>
        {allowedTokens.map((token) => (
          <option key={token.address} value={token.address}>
            {token.symbol}
          </option>
        ))}
      </select>
      <input
        type="number"
        className="mt-2 p-2 bg-gray-800 text-white rounded"
        placeholder="Enter amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <Button
        color="blue"
        onClick={handleApprove}
        disabled={!selectedToken || isApproving || !amount}
      >
        {isApproving ? "Approving..." : "Approve"}
      </Button>
      {isApproved && selectedToken && (
        <div className="text-sm text-green-500 mt-2">
          Token {allowedTokens.find((t) => t.address === selectedToken)?.symbol}{" "}
          approved!
        </div>
      )}
      {error && (
        <div className="text-sm text-red-500 mt-2">{error.message}</div>
      )}
    </div>
  );
}

export default SingleDeposit;
