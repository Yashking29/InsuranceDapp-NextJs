// pages/plans.tsx
"use client"
import { useState } from 'react';
import Head from 'next/head';
import Navbar from '../../components/NavBar';
import Footer from '../../components/Footer';
import InsurancePlans from '../../components/InsurancePlans';
import ConnectWallet from '../../components/ConnectWallet';

export default function Plans() {
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState<string | null>(null);

  const handleConnect = (connectedAccount: string) => {
    setAccount(connectedAccount);
    setIsConnected(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-gray-100">
      <Head>
        <title>Insurance Plans - DeFi Insurance</title>
        <meta name="description" content="Explore our range of insurance plans for your digital assets" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar isConnected={isConnected} account={account} />
      
      <main className="container mx-auto px-4 py-8 flex-grow">
        <h1 className="text-4xl font-bold text-center mb-8">Insurance Plans</h1>
        
        {!isConnected ? (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-8 mb-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Connect Your Wallet to View Plans</h2>
              <p className="text-gray-600 mb-6">
                Please connect your Ethereum wallet to browse, purchase, and manage insurance plans.
              </p>
              <ConnectWallet onConnect={handleConnect} />
            </div>
            
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold mb-4">Why Choose Our Insurance?</h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-medium">Fully On-Chain Protection</h3>
                    <p className="mt-1 text-gray-600">
                      All our policies and claims processing are managed by smart contracts, ensuring complete transparency.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-medium">Instant Claims Processing</h3>
                    <p className="mt-1 text-gray-600">
                      No more waiting for weeks to receive your payout. Our system processes claims quickly and efficiently.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-medium">Customizable Coverage</h3>
                    <p className="mt-1 text-gray-600">
                      Choose the coverage amount and duration that best fits your needs and budget.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-medium">Community-Governed</h3>
                    <p className="mt-1 text-gray-600">
                      Policy holders participate in governance decisions, ensuring the protocol evolves to meet user needs.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <InsurancePlans account={account} />
        )}
      </main>

      <Footer />
    </div>
  );
}