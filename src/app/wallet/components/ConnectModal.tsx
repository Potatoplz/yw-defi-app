import { useAccount } from "wagmi";
import { Modal } from "@/shared/components/ui";
import { Connect } from "@/app/wallet/components/Connect";
import { Account } from "@/app/wallet/components/Account";
import { ConnectModalProps } from "../types/walletTypes";

export const ConnectModal = ({ isOpen, onClose }: ConnectModalProps) => {
  const { isConnected } = useAccount();

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      {isConnected ? <Account /> : <Connect />}
    </Modal>
  );
};
