"use client"
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Navbar from '../components/NavBar';
import HeroSection from '../components/HeroSection';
import InsurancePlans from '../components/InsurancePlans';
import ConnectWallet from '../components/ConnectWallet';
import Footer from '../components/Footer';

export default function Home() {
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState<string | null>(null);

  const handleConnect = (connectedAccount: string) => {
    setAccount(connectedAccount);
    setIsConnected(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-gray-100">
      <Head>
        <title>DeFi Insurance - Protect Your Digital Assets</title>
        <meta name="description" content="Decentralized insurance for your digital assets" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar isConnected={isConnected} account={account} onConnect={handleConnect} />
      
      <main className="container mx-auto px-4 py-8 flex-grow">
        {!isConnected ? (
          <div className="my-20">
            <HeroSection />
            <ConnectWallet onConnect={handleConnect} />
          </div>
        ) : (
          <div className="my-10">
            <h1 className="text-3xl font-bold text-center mb-8">Welcome to DeFi Insurance</h1>
            <InsurancePlans account={account} />
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}