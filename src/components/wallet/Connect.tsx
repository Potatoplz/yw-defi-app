"use client";

import { useEffect, useState } from "react";
import { Connector, useChainId, useConnect } from "wagmi";
import { Button } from "../ui";

export function Connect() {
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
