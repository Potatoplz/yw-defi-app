import { useEffect, useRef } from "react";
import { useDisconnect } from "wagmi";

// useWatchNetworkChange hook: Watches for network changes and calls the onNetworkChange callback.
function useWatchNetworkChange(onNetworkChange: () => void) {
  // const { disconnect } = useDisconnect();
  const previousChainId = useRef<string | null>(null);

  useEffect(() => {
    const handleChainChanged = (chainId: string) => {
      console.log("Network changed to chainId:", chainId);
      // alert(`Network changed to chainId: ${parseInt(chainId, 16)}`);
      if (previousChainId.current !== chainId) {
        previousChainId.current = chainId;
        onNetworkChange();
      }
    };

    if (window.ethereum) {
      window.ethereum.on("chainChanged", handleChainChanged);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener("chainChanged", handleChainChanged);
      }
    };
  }, [onNetworkChange]);
}

export default useWatchNetworkChange;
