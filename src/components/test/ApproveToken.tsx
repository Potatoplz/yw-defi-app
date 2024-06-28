import { useState, useEffect } from "react";
import { useApproveToken } from "@/hooks/useApproveToken";
import { Button } from "../ui";

const allowedTokens = [
  { address: "0x538b2B6026D2b23c596677920fFd4b4bD82a0b17", symbol: "tAAA" },
  { address: "0x6b7792E45F9e18CFb358166A7D4523aA75e8867e", symbol: "tBBB" },
];

interface ApproveTokenProps {
  onApproved: () => void;
  selectedToken: `0x${string}` | null;
  setSelectedToken: (token: `0x${string}` | null) => void;
  amount: string;
  setAmount: (amount: string) => void;
  contractAddress: `0x${string}`;
}

export function ApproveToken({
  onApproved,
  selectedToken,
  setSelectedToken,
  amount,
  setAmount,
  contractAddress,
}: ApproveTokenProps) {
  const [spender] = useState<`0x${string}`>(contractAddress); // 스펜더 주소는 계약 주소로 설정

  const { approveToken, removeApproval, isApproving, isApproved, error } =
    useApproveToken(
      selectedToken,
      BigInt(amount ? (parseFloat(amount) * 10 ** 18).toString() : "0"),
      spender
    );

  // 방법 1
  // useEffect(() => {
  //   if (isApproved) {
  //     console.log("ApproveToken.tsx2: Token approved!");
  //     onApproved();
  //   }
  // }, [isApproved, onApproved]);

  // 방법 2
  const handleApprove = async () => {
    if (selectedToken && amount) {
      // 승인 요청
      await approveToken().then(
        () => {
          onApproved();
        },
        (error) => {
          console.error("Approve failed:", error);
        }
      );
    }
  };

  const handleRemoveApproval = async () => {
    if (selectedToken) {
      await removeApproval();
    }
  };

  return (
    <>
      <h2 className="text-lg font-medium mt-4">Approve Deposit Token</h2>
      <select
        className="mt-2 p-2 bg-white text-black border border-gray-300 rounded"
        value={selectedToken || ""}
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
        className="mt-2 p-2 bg-white text-black border border-gray-300 rounded"
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
      {/* <Button
        color="red"
        onClick={handleRemoveApproval}
        disabled={!selectedToken || isApproving}
      >
        Remove Approval
      </Button> */}
      {isApproved && selectedToken && (
        <div className="text-sm text-green-500 mt-2">
          Token {allowedTokens.find((t) => t.address === selectedToken)?.symbol}{" "}
          approved!
        </div>
      )}
      {error && (
        <div className="text-sm text-red-500 mt-2">{error.message}</div>
      )}
    </>
  );
}
