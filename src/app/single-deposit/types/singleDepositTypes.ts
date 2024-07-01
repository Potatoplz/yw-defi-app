export interface Token {
  address: `0x${string}`;
  symbol: string;
}

export interface StakedTokens {
  [symbol: string]: string;
}

export enum PromiseState {
  IDLE = "idle",
  LOADING = "loading",
  ERROR = "error",
  FINISH = "finish",
}

// TODO: Define the Message type
export type Message = {
  type: "success" | "error";
  content: string;
} | null;
