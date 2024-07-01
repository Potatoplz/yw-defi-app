import { useState } from "react";

export enum AsyncState {
  IDLE = "idle",
  LOADING = "loading",
  SUCCESS = "success",
  ERROR = "error",
}

export const useAsyncState = () => {
  const [state, setState] = useState<AsyncState>(AsyncState.IDLE);
  const [error, setError] = useState<Error | null>(null);

  const setLoading = () => setState(AsyncState.LOADING);
  const setSuccess = () => setState(AsyncState.SUCCESS);
  const setErrorState = (error: Error) => {
    setError(error);
    setState(AsyncState.ERROR);
  };

  return {
    state,
    error,
    setLoading,
    setSuccess,
    setErrorState,
  };
};
