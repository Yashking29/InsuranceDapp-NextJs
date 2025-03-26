"use client";
import React, { useState } from "react";
import Link from "next/link";
import { truncateAddress } from "../utils/helpers";
import { ethers } from "ethers";

interface NavbarProps {
  isConnected: boolean;
  account: string | null;
}

const Navbar: React.FC<NavbarProps> = ({ isConnected, account, onConnect }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClick = async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        onConnect(address);
      } else {
        setError("No Ethereum wallet found. Please install MetaMask.");
      }
    } catch (err) {
      console.error("Error connecting wallet:", err);
      setError("Failed to connect wallet. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-blue-600">
              DeFi Insurance
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link href="/about" className="text-gray-700 hover:text-blue-600">
              About
            </Link>
            <Link href="/plans" className="text-gray-700 hover:text-blue-600">
              Plans
            </Link>
            <Link href="/faq" className="text-gray-700 hover:text-blue-600">
              Claims
            </Link>

            {isConnected && account ? (
              <div className="bg-blue-100 px-4 py-2 rounded-full text-blue-800">
                {truncateAddress(account)}
              </div>
            ) : (
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                onClick={handleClick}
              >
                Connect Wallet
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
