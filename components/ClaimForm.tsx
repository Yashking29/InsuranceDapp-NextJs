import { useState, useEffect } from 'react';
import Head from 'next/head';
import { ethers } from 'ethers';
import Navbar from '../components/NavBar';
import ClaimForm from '../components/ClaimForm';
import ClaimsList from '../components/ClaimsList';
import Footer from '../components/Footer';
import ConnectWallet from '../components/ConnectWallet';
import InsuranceContract from '../contractBuild/Insurance.json';

export default function Claims() {
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState<string | null>(null);
  const [claims, setClaims] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '';

  const handleConnect = (connectedAccount: string) => {
    setAccount(connectedAccount);
    setIsConnected(true);
  };

  useEffect(() => {
    const fetchClaims = async () => {
      if (!account || !contractAddress) {
        setLoading(false);
        return;
      }

      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const contract = new ethers.Contract(
          contractAddress,
          InsuranceContract.abi,
          provider
        );
        
        // Example of how to call contract methods
        // const userClaims = await contract.getUserClaims(account);
        // Process userClaims data...
        
        // Sample data for demonstration
        setClaims([
          {
            id: 1,
            policyId: 2,
            date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            amount: "15000",
            reason: "Smart contract exploit",
            evidence: "https://etherscan.io/tx/0x...",
            status: "Pending"
          },
          {
            id: 2,
            policyId: 1,
            date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
            amount: "3000",
            reason: "Protocol hack",
            evidence: "https://etherscan.io/tx/0x...",
            status: "Approved"
          }
        ]);
      } catch (error) {
        console.error("Error fetching claims:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClaims();
  }, [account, contractAddress]);

  const submitClaim = async (formData: any) => {
    if (!account || !contractAddress) return;
    
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        contractAddress,
        InsuranceContract.abi,
        signer
      );
      
      // Example of how to call contract methods
      // const tx = await contract.submitClaim(
      //   formData.policyId,
      //   ethers.utils.parseEther(formData.amount),
      //   formData.reason,
      //   formData.evidence
      // );
      // await tx.wait();
      
      // After successful submission, update claims list
      // const userClaims = await contract.getUserClaims(account);
      // Process userClaims data...
      
      // Adding new claim to the list (for demonstration)
      setClaims([
        {
          id: claims.length + 1,
          policyId: formData.policyId,
          date: new Date(),
          amount: formData.amount,
          reason: formData.reason,
          evidence: formData.evidence,
          status: "Pending"
        },
        ...claims
      ]);
      
      alert("Claim submitted successfully! (Note: This is a simulation)");
    } catch (error) {
      console.error("Error submitting claim:", error);
      alert("Failed to submit claim. See console for details.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Head>
        <title>Claims Management - DeFi Insurance</title>
        <meta name="description" content="Manage your insurance claims" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar isConnected={isConnected} account={account} />
      
      <main className="container mx-auto px-4 py-8">
        {!isConnected ? (
          <div className="my-20">
            <h1 className="text-3xl font-bold text-center mb-6">Claims Management</h1>
            <p className="text-gray-600 text-center mb-8">
              Connect your wallet to view and submit insurance claims.
            </p>
            <ConnectWallet onConnect={handleConnect} />
          </div>
        ) : (
          <div className="my-10">
            <h1 className="text-3xl font-bold text-center mb-8">Claims Management</h1>
            
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <h2 className="text-2xl font-bold mb-4">Submit a New Claim</h2>
              <ClaimForm onSubmit={submitClaim} />
            </div>
            
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-4">Your Claims History</h2>
              {loading ? (
                <div className="text-center py-10">Loading claims...</div>
              ) : (
                <ClaimsList claims={claims} />
              )}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

// components/ClaimForm.tsx
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import InsuranceContract from '../contracts/InsuranceContract.json';

interface ClaimFormProps {
  onSubmit: (formData: any) => void;
}

const ClaimForm: React.FC<ClaimFormProps> = ({ onSubmit }) => {
  const [policies, setPolicies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    policyId: '',
    amount: '',
    reason: '',
    evidence: ''
  });
  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '';

  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        // In a real application, fetch active policies from the contract
        // For demonstration, using sample data
        setPolicies([
          { id: 1, name: "Basic Coverage" },
          { id: 2, name: "Premium Coverage" }
        ]);
      } catch (error) {
        console.error("Error fetching policies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPolicies();
  }, [contractAddress]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    
    // Reset form
    setFormData({
      policyId: '',
      amount: '',
      reason: '',
      evidence: ''
    });
  };

  if (loading) {
    return <div className="text-center py-4">Loading policies...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-gray-700 mb-2" htmlFor="policyId">
          Select Policy
        </label>
        <select
          id="policyId"
          name="policyId"
          value={formData.policyId}
          onChange={handleChange}
          required
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">-- Select Policy --</option>
          {policies.map(policy => (
            <option key={policy.id} value={policy.id}>
              {policy.name} (ID: {policy.id})
            </option>
          ))}
        </select>
      </div>
      
      <div>
        <label className="block text-gray-700 mb-2" htmlFor="amount">
          Claim Amount (USDT)
        </label>
        <input
          type="text"
          id="amount"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          required
          placeholder="Enter amount in USDT"
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      <div>
        <label className="block text-gray-700 mb-2" htmlFor="reason">
          Reason for Claim
        </label>
        <textarea
          id="reason"
          name="reason"
          value={formData.reason}
          onChange={handleChange}
          required
          placeholder="Describe what happened"
          rows={3}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      <div>
        <label className="block text-gray-700 mb-2" htmlFor="evidence">
          Evidence (Transaction hash or link)
        </label>
        <input
          type="text"
          id="evidence"
          name="evidence"
          value={formData.evidence}
          onChange={handleChange}
          required
          placeholder="e.g. https://etherscan.io/tx/0x..."
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Submit Claim
      </button>
    </form>
  );
};

export default ClaimForm;