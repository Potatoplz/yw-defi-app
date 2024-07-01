// src/components/test/ConnectModal.tsx
import React from "react";
import { useAccount } from "wagmi";
import { Modal } from "@/shared/components/ui";
import { Connect } from "@/app/wallet/components/Connect";
import { Account } from "@/app/wallet/components/Account";

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
