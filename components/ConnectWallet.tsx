import React, { useState } from 'react';
import { ethers } from 'ethers';

interface ConnectWalletProps {
  onConnect: (account: string) => void;
}

const ConnectWallet: React.FC<ConnectWalletProps> = ({ onConnect }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connectWallet = async () => {
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
    <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-lg max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
      <p className="text-gray-600 mb-6 text-center">
        Connect your Ethereum wallet to access insurance plans and manage your policies.
      </p>
      
      <button
        onClick={connectWallet}
        disabled={isLoading}
        className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50"
      >
        {isLoading ? "Connecting..." : "Connect Wallet"}
      </button>
      
      {error && (
        <div className="mt-4 text-red-500 text-center">
          {error}
        </div>
      )}
    </div>
  );
};

export default ConnectWallet;