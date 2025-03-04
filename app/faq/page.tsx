// pages/faq.tsx
"use client"
import { useState } from 'react';
import Head from 'next/head';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function FAQ() {
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleConnect = (connectedAccount: string) => {
    setAccount(connectedAccount);
    setIsConnected(true);
  };

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      question: "What types of risks are covered by your insurance plans?",
      answer: "Our insurance plans cover a variety of risks in the DeFi space, including smart contract vulnerabilities, protocol hacks, oracle failures, and market volatility events. Each plan has specific coverage details, so be sure to review the terms of the policy you're interested in."
    },
    {
      question: "How do I file a claim?",
      answer: "Filing a claim is simple. After connecting your wallet, navigate to the Claims page and fill out the claim form. You'll need to provide details about the incident, including transaction hashes or other evidence. Our smart contracts will automatically verify eligible claims and process payouts."
    },
    {
      question: "How quickly are claims processed?",
      answer: "Many claims can be processed automatically within minutes if they meet certain verifiable conditions. For more complex claims that require manual review, our decentralized claims committee aims to process them within 72 hours. You can check the status of your claim at any time on the Claims page."
    },
    {
      question: "What cryptocurrencies can I use to pay premiums?",
      answer: "Currently, we accept premium payments in USDT. In the future, we plan to expand payment options to include other stablecoins and major cryptocurrencies."
    },
    {
      question: "Are there any deductibles on the insurance policies?",
      answer: "Yes, most of our policies include deductibles, which vary based on the plan and coverage amount. Deductibles are clearly stated when you're reviewing a plan before purchase. The deductible amount will be subtracted from any claim payout."
    },
    {
      question: "Can I cancel my policy and get a refund?",
      answer: "Yes, you can cancel your policy at any time. Refunds are prorated based on the remaining coverage period, minus a small cancellation fee. The specific details are outlined in each policy's terms and conditions."
    },
    {
      question: "Is my personal information secure?",
      answer: "We prioritize user privacy and security. Because we operate on blockchain technology, we collect minimal personal information. The information we do collect is encrypted and secured according to industry best practices. We never sell or share your data with third parties."
    },
    {
      question: "How is the claims fund managed?",
      answer: "All premiums are pooled into a smart contract-controlled claims fund. This fund is transparent and auditable by anyone on the blockchain. The funds are diversified across various stable investments to ensure there's always sufficient capital to pay out claims."
    },
    {
      question: "What happens if there's a catastrophic event affecting many users?",
      answer: "We maintain a catastrophe reserve fund specifically designed to handle large-scale events. Additionally, we have reinsurance agreements in place to provide extra protection in extreme circumstances. Our protocol is designed to remain solvent even during major market disruptions."
    },
    {
      question: "Do you offer multi-policy discounts?",
      answer: "Yes, users who purchase multiple policies receive automatic discounts. Additionally, long-term policyholders earn loyalty rewards that can be applied to future premium payments or withdrawn as tokens."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-gray-100">
      <Head>
        <title>Frequently Asked Questions - DeFi Insurance</title>
        <meta name="description" content="Find answers to common questions about our insurance platform" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar isConnected={isConnected} account={account} />
      
      <main className="container mx-auto px-4 py-8 flex-grow">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8">Frequently Asked Questions</h1>
          
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0 last:pb-0">
                  <button
                    onClick={() => toggleFaq(index)}
                    className="flex justify-between items-center w-full text-left font-medium text-lg py-2 focus:outline-none"
                  >
                    <span>{faq.question}</span>
                    <svg
                      className={`w-5 h-5 transition-transform ${openFaq === index ? 'transform rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {openFaq === index && (
                    <div className="mt-2 text-gray-600">
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-8 bg-blue-50 p-6 rounded-lg border border-blue-200">
            <h2 className="text-xl font-semibold text-blue-800 mb-2">Still have questions?</h2>
            <p className="text-blue-600 mb-4">
              Our support team is available to help you with any questions or concerns you may have about our insurance products.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="mailto:support@defi-insurance.example"
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Email Support
              </a>
              <a
                href="https://discord.example"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                </svg>
                Join Discord
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}