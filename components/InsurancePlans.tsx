import React, { useState, useEffect } from "react";
import PolicyCard from "./PolicyCard";
import { ethers } from "ethers";
import InsuranceContract from "../contractBuild/Insurance.json";

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
  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "";

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        // Example data - replace with actual contract calls
        setPlans([
          {
            id: 1,
            name: "Basic Coverage",
            description:
              "Protection against smart contract failures for your DeFi investments",
            coverageAmount: "400",
            premium: "50",
            duration: 30,
            icon: "🛡️",
          },
          {
            id: 2,
            name: "Premium Coverage",
            description:
              "Extended protection including hacks and market volatility",
            coverageAmount: "3",
            premium: "200",
            duration: 30,
            icon: "⚔️",
          },
          {
            id: 3,
            name: "Ultimate Protection",
            description: "Comprehensive coverage for all your crypto assets",
            coverageAmount: "100000",
            premium: "500",
            duration: 30,
            icon: "🔰",
          },
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
    console.log("PlanId", planId);
    if (!window.ethereum) {
      alert("MetaMask is not installed. Please install it to continue.");
      return;
    }

    if (!account || !contractAddress) {
      alert("Wallet not connected or contract address is missing.");
      return;
    }

    try {
      console.log("Account:", account);
      console.log("Contract Address:", contractAddress);

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        contractAddress,
        InsuranceContract.abi,
        signer
      );

      const plan = plans.find((p) => p.id === planId);
      if (!plan) {
        alert("Invalid plan selected.");
        return;
      }

      // Convert premium to ETH safely
      let premiumValue;
      //   try {
      //     premiumValue = ethers.utils.parseEther(plan.premium.toString());
      //   } catch (conversionError) {
      //     console.error("Error converting premium to Ether:", conversionError);
      //     alert("Invalid premium amount.");
      //     return;
      //   }

      console.log(
        `Purchasing policy for Plan ID: ${planId}, Amount: ${plan.premium} ETH`
      );

      // Send transaction
      console.log(
        typeof plans[planId].coverageAmount,
        typeof plans[planId].name,
        typeof plans[planId].duration
      );
      console.log(
        plans[planId].coverageAmount,
        plans[planId].name,
        plans[planId].duration
      );

      const tx = await contract.createPolicy(
        Number(plans[planId].coverageAmount),
        1,
        plans[planId].duration,
        { value: plan.premium }
      );
      console.log("Transaction sent:", tx.hash);

      // Wait for confirmation
      const receipt = await tx.wait();
      console.log("Transaction confirmed:", receipt);

      contract.on("PolicyCreated", (policyId, policyHolder, premium, coverage, policyType, event) => {
        console.log("🆕 New Policy Created:");
        console.log("📜 Policy ID:", policyId.toString());
        console.log("👤 Policy Holder:", policyHolder);
        console.log("💰 Premium:",premium, "ETH");
        console.log("🛡️ Coverage:", coverage, "ETH");
        console.log("🏷️ Policy Type:", policyType);
        console.log("🔎 Raw Event Data:", event);
      });

      // Fetch user policies after purchase
      //   const userPoliciesIds = await contract.getUserPolicies(account);
      //   setUserPolicies(
      //     userPoliciesIds.map((id: ethers.BigNumber) => id.toNumber())
      //   );

      alert("Policy purchased successfully!");
    } catch (error: any) {
      console.error("Error purchasing policy:", error);
      alert(`Failed to purchase policy: ${error.message}`);
    }
  };

  if (loading) {
    return <div className="text-center py-10">Loading insurance plans...</div>;
  }

  return (
    <div className="text-gray-500">
      <h2 className="text-2xl font-bold mb-6">Available Insurance Plans</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan) => (
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
              .filter((plan) => userPolicies.includes(plan.id))
              .map((plan) => (
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
