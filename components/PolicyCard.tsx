import React from 'react';

interface PolicyCardProps {
  plan: {
    id: number;
    name: string;
    description: string;
    coverageAmount: string;
    premium: string;
    duration: number;
    icon: string;
  };
  onPurchase: () => void;
  isPurchased: boolean;
}

const PolicyCard: React.FC<PolicyCardProps> = ({ plan, onPurchase, isPurchased }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform hover:transform hover:scale-105">
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-8 text-white">
        <div className="text-4xl mb-2">{plan.icon}</div>
        <h3 className="text-xl font-bold">{plan.name}</h3>
        <p className="text-blue-100 mt-1">{plan.description}</p>
      </div>
      
      <div className="p-6">
        <div className="mb-4">
          <div className="text-gray-500 text-sm">Coverage Amount</div>
          <div className="text-2xl font-bold">{plan.coverageAmount} USDT</div>
        </div>
        
        <div className="mb-4">
          <div className="text-gray-500 text-sm">Premium</div>
          <div className="text-2xl font-bold">{plan.premium} USDT</div>
        </div>
        
        <div className="mb-6">
          <div className="text-gray-500 text-sm">Duration</div>
          <div className="text-2xl font-bold">{plan.duration} days</div>
        </div>
        
        {isPurchased ? (
          <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg text-center">
            Active Policy
          </div>
        ) : (
          <button
            onClick={onPurchase}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Purchase Policy
          </button>
        )}
      </div>
    </div>
  );
};

export default PolicyCard;