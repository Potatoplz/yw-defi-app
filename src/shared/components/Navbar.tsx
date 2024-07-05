import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ConnectModal } from "@/app/wallet/components/ConnectModal";
import { useAccount } from "wagmi";

const Navbar: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isConnected } = useAccount();
  const sidebarRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        closeMenu();
      }
    };

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    } else {
      document.removeEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isMenuOpen]);

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white text-lg font-bold">G</div>
        <div className="hidden lg:flex lg:space-x-4 lg:flex-grow lg:justify-center">
          <Link href="/" className="text-white">
            Home
          </Link>
          <Link href="/bbs" className="text-white">
            BBS
          </Link>
          <Link href="/single-deposit" className="text-white">
            Single-Deposit
          </Link>
        </div>
        <div className="hidden lg:flex lg:items-center lg:justify-end">
          {isConnected ? (
            <button
              className="text-white border border-white px-4 py-2"
              onClick={() => setIsModalOpen(true)}
            >
              Connected
            </button>
          ) : (
            <button
              className="text-white border border-white px-4 py-2"
              onClick={() => setIsModalOpen(true)}
            >
              Wallet Connect
            </button>
          )}
        </div>
        <div className="lg:hidden">
          <button
            className="text-white focus:outline-none"
            onClick={toggleMenu}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={
                  isMenuOpen
                    ? "M6 18L18 6M6 6l12 12"
                    : "M4 6h16M4 12h16M4 18h16"
                }
              ></path>
            </svg>
          </button>
        </div>
      </div>
      <div
        ref={sidebarRef}
        className={`fixed top-0 right-0 h-full w-64 bg-gray-800 text-white transform ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 lg:hidden`}
      >
        <div className="p-4 flex flex-col items-start">
          {isConnected ? (
            <button
              className="text-white border border-white px-4 py-2 mb-4"
              onClick={() => {
                setIsModalOpen(true);
                setIsMenuOpen(false);
              }}
            >
              Connected
            </button>
          ) : (
            <button
              className="text-white border border-white px-4 py-2 mb-4"
              onClick={() => {
                setIsModalOpen(true);
                setIsMenuOpen(false);
              }}
            >
              Connect Wallet
            </button>
          )}
          <ul className="flex flex-col space-y-4 mt-4">
            <li>
              <Link
                href="/"
                className="text-white block px-2 py-1"
                onClick={closeMenu}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/single-deposit"
                className="text-white block px-2 py-1"
                onClick={closeMenu}
              >
                Single-Deposit
              </Link>
            </li>
          </ul>
        </div>
      </div>
      {isModalOpen && (
        <ConnectModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </nav>
  );
};

export default Navbar;
