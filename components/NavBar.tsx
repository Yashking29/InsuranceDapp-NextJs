"use client"
import React from 'react';
import Link from 'next/link';
import { truncateAddress } from '../utils/helpers';

interface NavbarProps {
  isConnected: boolean;
  account: string | null;
}

const Navbar: React.FC<NavbarProps> = ({ isConnected, account }) => {
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
            <Link href="/claims" className="text-gray-700 hover:text-blue-600">
              Claims
            </Link>
            
            {isConnected && account ? (
              <div className="bg-blue-100 px-4 py-2 rounded-full text-blue-800">
                {truncateAddress(account)}
              </div>
            ) : (
              <Link href="/connect" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                Connect Wallet
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;