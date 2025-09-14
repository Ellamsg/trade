import React from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import { WalletTier, TokenType, TIER_CONFIG, POPULAR_TOKENS } from '@/app/data';

interface TokenSelectionProps {
  selectedTier: WalletTier | null;
  onTokenSelect: (tokenId: string) => void;
  onBack: () => void;
}

const TokenSelection: React.FC<TokenSelectionProps> = ({ 
  selectedTier, 
  onTokenSelect, 
  onBack 
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white py-9">
      <div className="max-w-6xl mx-auto p-4 md:p-6">
        <div className="text-center mb-8">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-4 transition-colors"
          >
            <FiArrowLeft className="w-4 h-4" />
            Back to Tier Selection
          </button>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent mb-4">
            Choose Your Token
          </h1>
          <p className="text-slate-400 text-lg">
            Selected: {selectedTier && TIER_CONFIG[selectedTier].name}
          </p>
          <p className="text-slate-400">Select the cryptocurrency for your wallet</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {POPULAR_TOKENS.map((token) => (
            <div
              key={token.id}
              className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 hover:scale-105 transition-transform cursor-pointer group hover:border-slate-600"
              onClick={() => onTokenSelect(token.id)}
            >
              <div className="text-center">
                <div className="text-4xl mb-4">{token.icon}</div>
                <h3 className="text-lg font-bold mb-2">{token.name}</h3>
                <p className="text-slate-400 text-sm mb-4">Cryptocurrency token</p>
                <div className="text-lg font-bold mb-4 text-slate-300">
                  {token.symbol}
                </div>
                <button className={`w-full bg-gradient-to-r ${token.color} text-white py-3 px-6 rounded-xl font-medium hover:opacity-90 transition-opacity group-hover:shadow-lg`}>
                  Select {token.symbol}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TokenSelection;