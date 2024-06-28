import clsx from "clsx";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  className,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black opacity-50"
        onClick={onClose}
      ></div>
      <div
        className={clsx("bg-white p-6 rounded-lg shadow-lg z-10", className)}
      >
        <button onClick={onClose} className="text-black mb-4">
          Close
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
