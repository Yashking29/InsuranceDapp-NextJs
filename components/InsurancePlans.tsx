import React, { useState, useEffect } from 'react';
import PolicyCard from './PolicyCard';
import { ethers } from 'ethers';
import InsuranceContract from '../contractBuild/Insurance.json';

interface InsurancePlan {
  id: number;
  name: string;
  description: string;
  coverageAmount: string;
  premium: string;
  duration: number;
  icon: string;
}

interface InsurancePlansProps {
  account: string | null;
}

const InsurancePlans: React.FC<InsurancePlansProps> = ({ account }) => {
  const [plans, setPlans] = useState<InsurancePlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [userPolicies, setUserPolicies] = useState<number[]>([]);
  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '';

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        // Example data - replace with actual contract calls
        setPlans([
          {
            id: 1,
            name: "Basic Coverage",
            description: "Protection against smart contract failures for your DeFi investments",
            coverageAmount: "5000",
            premium: "50",
            duration: 30,
            icon: "🛡️"
          },
          {
            id: 2,
            name: "Premium Coverage",
            description: "Extended protection including hacks and market volatility",
            coverageAmount: "25000",
            premium: "200",
            duration: 30,
            icon: "⚔️"
          },
          {
            id: 3,
            name: "Ultimate Protection",
            description: "Comprehensive coverage for all your crypto assets",
            coverageAmount: "100000",
            premium: "500",
            duration: 30,
            icon: "🔰"
          }
        ]);

        if (account && contractAddress) {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const contract = new ethers.Contract(
            contractAddress,
            InsuranceContract.abi,
            provider
          );
          
          // Example of how to call contract methods
          // const userPoliciesIds = await contract.getUserPolicies(account);
          // setUserPolicies(userPoliciesIds.map((id: ethers.BigNumber) => id.toNumber()));
          
          // Simulating user policies
          setUserPolicies([]);
        }
      } catch (error) {
        console.error("Error fetching insurance plans:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, [account, contractAddress]);


  const purchasePolicy = async (planId: number) => {
    if (!account || !contractAddress) return;
    
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        contractAddress,
        InsuranceContract.abi,
        signer
      );
      
      const plan = plans.find(p => p.id === planId);
      if (!plan) return;
      
      // Example of how to call contract methods
      // const tx = await contract.purchasePolicy(planId, {
      //   value: ethers.utils.parseEther(plan.premium)
      // });
      // await tx.wait();
      
      // After successful purchase, update user policies
      // const userPoliciesIds = await contract.getUserPolicies(account);
      // setUserPolicies(userPoliciesIds.map((id: ethers.BigNumber) => id.toNumber()));
      
      alert("Policy purchased successfully! (Note: This is a simulation)");
    } catch (error) {
      console.error("Error purchasing policy:", error);
      alert("Failed to purchase policy. See console for details.");
    }
  };

  if (loading) {
    return <div className="text-center py-10">Loading insurance plans...</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Available Insurance Plans</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map(plan => (
          <PolicyCard
            key={plan.id}
            plan={plan}
            onPurchase={() => purchasePolicy(plan.id)}
            isPurchased={userPolicies.includes(plan.id)}
          />
        ))}
      </div>
      
      {userPolicies.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Your Active Policies</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans
              .filter(plan => userPolicies.includes(plan.id))
              .map(plan => (
                <PolicyCard
                  key={`active-${plan.id}`}
                  plan={plan}
                  onPurchase={() => {}}
                  isPurchased={true}
                />
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default InsurancePlans;