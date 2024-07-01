export interface Token {
  address: `0x${string}`;
  symbol: string;
}

export interface StakedTokens {
  [symbol: string]: string;
}
export interface ApproveTokenProps {
  onApproved: () => void;
  selectedToken: `0x${string}` | null;
  setSelectedToken: (token: `0x${string}` | null) => void;
  amount: string;
  setAmount: (amount: string) => void;
  contractAddress: `0x${string}`;
}
