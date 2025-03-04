import React from 'react';

const HeroSection: React.FC = () => {
  return (
    <div className="text-center mb-16">
      <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800">
        Secure Your Digital Assets with DeFi Insurance
      </h1>
      <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
        Protect your crypto investments against hacks, smart contract failures, and market volatility with our decentralized insurance protocols.
      </p>
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        <div className="flex items-center bg-green-100 px-4 py-2 rounded-full">
          <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
          <span className="text-green-800">100% On-Chain</span>
        </div>
        <div className="flex items-center bg-blue-100 px-4 py-2 rounded-full">
          <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
          <span className="text-blue-800">Instant Claims</span>
        </div>
        <div className="flex items-center bg-purple-100 px-4 py-2 rounded-full">
          <span className="w-3 h-3 bg-purple-500 rounded-full mr-2"></span>
          <span className="text-purple-800">Community Governed</span>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;