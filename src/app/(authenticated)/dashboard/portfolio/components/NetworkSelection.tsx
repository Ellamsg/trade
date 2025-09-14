import React from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import { WalletTier, TokenType, NetworkType, TIER_CONFIG, NETWORK_CONFIG, POPULAR_TOKENS } from '@/app/data';

interface NetworkSelectionProps {
  selectedTier: WalletTier | null;
  selectedToken: TokenType | null;
  onNetworkSelect: (network: NetworkType) => void;
  onBack: () => void;
}

const NetworkSelection: React.FC<NetworkSelectionProps> = ({ 
  selectedTier, 
  selectedToken, 
  onNetworkSelect, 
  onBack 
}) => {
  const token = selectedToken ? POPULAR_TOKENS.find(t => t.id === selectedToken) : null;

  if (!token) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white py-9">
      <div className="max-w-6xl mx-auto p-4 md:p-6">
        <div className="text-center mb-8">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-4 transition-colors"
          >
            <FiArrowLeft className="w-4 h-4" />
            Back to Token Selection
          </button>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent mb-4">
            Choose Your Network
          </h1>
          <p className="text-slate-400 text-lg">
            Tier: {selectedTier && TIER_CONFIG[selectedTier].name} • Token: {token.name} ({token.symbol})
          </p>
          <p className="text-slate-400">Select the blockchain network for your wallet</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {token.supportedNetworks.map((networkId) => {
            const network = NETWORK_CONFIG[networkId];
            return (
              <div
                key={network.id}
                className={`${network.bgColor} backdrop-blur-sm rounded-2xl p-6 border ${network.borderColor} hover:scale-105 transition-transform cursor-pointer group`}
                onClick={() => onNetworkSelect(network.id)}
              >
                <div className="text-center">
                  <div className="text-6xl mb-4">{network.icon}</div>
                  <h3 className="text-xl font-bold mb-2">{network.name}</h3>
                  <p className="text-slate-400 text-sm mb-4">{network.description}</p>
                  <div className="text-lg font-bold mb-4 text-slate-300">
                    {network.symbol}
                  </div>
                  <button className={`w-full bg-gradient-to-r ${network.color} text-white py-3 px-6 rounded-xl font-medium hover:opacity-90 transition-opacity group-hover:shadow-lg`}>
                    Select {network.name}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default NetworkSelection;