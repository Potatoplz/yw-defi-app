"use client";

import { useEffect, useState } from "react";
import { Connector, useChainId, useConnect } from "wagmi";
import { Button } from "../ui";

// Connect component: Displays the available connectors to connect the wallet.
export function Connect() {
  /**
   * useChainId hook: Returns the chain ID of the current network.
   * The current network is determined by the WagmiProvider component.
   */
  const chainId = useChainId();
  const { connectors, connect } = useConnect();

  return (
    <div className="flex flex-wrap space-x-4">
      {connectors.map((connector) => (
        <ConnectorButton
          key={connector.uid}
          connector={connector}
          onClick={() => connect({ connector, chainId })}
        />
      ))}
    </div>
  );
}

function ConnectorButton({
  connector,
  onClick,
}: {
  connector: Connector;
  onClick: () => void;
}) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    (async () => {
      const provider = await connector.getProvider();
      setReady(!!provider);
    })();
  }, [connector, setReady]);

  return (
    <Button color="green" size="large" onClick={onClick} disabled={!ready}>
      {connector.name}
    </Button>
  );
}
