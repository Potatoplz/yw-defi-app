// src/components/test/ConnectModal.tsx
import React from "react";
import { useAccount } from "wagmi";
import { Modal } from "../ui";
import { Connect } from "../wallet/Connect";
import { Account } from "../wallet/Account";

interface ConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Update the wallet connection modal
export const ConnectModal: React.FC<ConnectModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { isConnected } = useAccount();

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      {isConnected ? <Account /> : <Connect />}
    </Modal>
  );
};
