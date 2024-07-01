import { useState } from "react";
import { useApproveToken } from "@/shared/hooks/useApproveToken";
import { Button } from "@/shared/components/ui";
import { Token, ApproveTokenProps } from "../types/singleDepositTypes";
import { AsyncState } from "@/shared/hooks/useAsyncState";

const allowedTokens: Token[] = JSON.parse(
  process.env.NEXT_PUBLIC_ALLOWED_TOKENS || "[]"
);

export function ApproveToken({
  onApproved,
  selectedToken,
  setSelectedToken,
  amount,
  setAmount,
  contractAddress,
}: ApproveTokenProps) {
  const [spender] = useState<`0x${string}`>(contractAddress);

  const { approveToken, state, error } = useApproveToken(
    selectedToken,
    BigInt(amount ? (parseFloat(amount) * 10 ** 18).toString() : "0"),
    spender
  );

  const handleApprove = async () => {
    if (selectedToken && amount) {
      await approveToken().then(
        () => {
          if (state === AsyncState.SUCCESS) {
            onApproved();
          }
        },
        (error) => {
          console.error("Approve failed:", error);
        }
      );
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
        disabled={!selectedToken || state === AsyncState.LOADING || !amount}
      >
        {state === AsyncState.LOADING ? "Approving..." : "Approve"}
      </Button>
      {state === AsyncState.SUCCESS && selectedToken && (
        <div className="text-sm text-green-500 mt-2">
          Token {allowedTokens.find((t) => t.address === selectedToken)?.symbol}{" "}
          approved!
        </div>
      )}
      {state === AsyncState.ERROR && error && (
        <div className="text-sm text-red-500 mt-2">{error.message}</div>
      )}
    </>
  );
}
