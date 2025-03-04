// pages/about.tsx
"use client"
import { useState } from 'react';
import Head from 'next/head';
import Navbar from '../../components/NavBar';
import Footer from '../../components/Footer';
import ConnectWallet from '../../components/ConnectWallet';

export default function About() {
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState<string | null>(null);

  const handleConnect = (connectedAccount: string) => {
    setAccount(connectedAccount);
    setIsConnected(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-gray-100">
      <Head>
        <title>About Us - DeFi Insurance</title>
        <meta name="description" content="Learn about our decentralized insurance platform" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar isConnected={isConnected} account={account} />
      
      <main className="container mx-auto px-4 py-8 flex-grow">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8">About DeFi Insurance</h1>
          
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
            <p className="text-gray-700 mb-6">
              DeFi Insurance was founded with a clear mission: to provide users of decentralized finance with 
              accessible, transparent, and reliable insurance coverage. In an ecosystem where smart contract 
              vulnerabilities and protocol risks can lead to significant losses, we believe proper insurance 
              is not just an option—it's a necessity.
            </p>
            <p className="text-gray-700 mb-6">
              Our team of blockchain experts and insurance professionals has built a platform that leverages 
              the transparency and efficiency of blockchain technology to deliver insurance products that 
              users can trust and understand.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold mb-4">How It Works</h2>
            <div className="space-y-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                    <span className="text-xl font-bold">1</span>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Select a Coverage Plan</h3>
                  <p className="mt-2 text-gray-600">
                    Browse our range of insurance plans designed to protect different types of DeFi activities 
                    and assets. Whether you're yield farming, providing liquidity, or simply holding assets, 
                    we have a plan for you.
                  </p>
                </div>
              </div>
              
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                    <span className="text-xl font-bold">2</span>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Pay Premium</h3>
                  <p className="mt-2 text-gray-600">
                    Pay your premium in cryptocurrency. All premiums are held in smart contracts, ensuring 
                    complete transparency and eliminating the need for trust in a centralized entity.
                  </p>
                </div>
              </div>
              
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                    <span className="text-xl font-bold">3</span>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">File Claims</h3>
                  <p className="mt-2 text-gray-600">
                    If an insured event occurs, submit your claim through our platform along with evidence. 
                    Our decentralized verification system will process your claim quickly and fairly.
                  </p>
                </div>
              </div>
              
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                    <span className="text-xl font-bold">4</span>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Receive Payout</h3>
                  <p className="mt-2 text-gray-600">
                    Approved claims are paid out automatically through smart contracts. No lengthy waiting 
                    periods or human intervention required—just fast, reliable coverage when you need it most.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-4">Our Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-32 h-32 mx-auto rounded-full bg-gray-300 mb-4"></div>
                <h3 className="text-lg font-bold">Alex Johnson</h3>
                <p className="text-blue-600">CEO & Founder</p>
                <p className="text-gray-600 mt-2">
                  10+ years in blockchain and insurance technology
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-32 h-32 mx-auto rounded-full bg-gray-300 mb-4"></div>
                <h3 className="text-lg font-bold">Sophia Chen</h3>
                <p className="text-blue-600">CTO</p>
                <p className="text-gray-600 mt-2">
                  Smart contract developer with expertise in DeFi protocols
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-32 h-32 mx-auto rounded-full bg-gray-300 mb-4"></div>
                <h3 className="text-lg font-bold">Michael Santos</h3>
                <p className="text-blue-600">Risk Assessment Lead</p>
                <p className="text-gray-600 mt-2">
                  Former actuary with 15 years of experience in risk modeling
                </p>
              </div>
            </div>
          </div>
          
          {!isConnected && (
            <div className="mt-12 max-w-md mx-auto">
              <ConnectWallet onConnect={handleConnect} />
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}