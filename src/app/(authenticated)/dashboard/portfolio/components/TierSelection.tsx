import React from 'react';
import { WalletTier, TIER_CONFIG } from '@/app/data';

interface TierSelectionProps {
  onTierSelect: (tier: WalletTier) => void;
}

const TierSelection: React.FC<TierSelectionProps> = ({ onTierSelect }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white py-9">
      <div className="max-w-4xl mx-auto p-4 md:p-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent mb-4">
            Choose Your Investment Tier
          </h1>
          <p className="text-slate-400 text-lg">Select the wallet tier that matches your investment goals</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(TIER_CONFIG).map(([tier, config]) => (
            <div
              key={tier}
              className={`${config.bgColor} backdrop-blur-sm rounded-2xl p-6 border ${config.borderColor} hover:scale-105 transition-transform cursor-pointer group`}
              onClick={() => onTierSelect(tier as WalletTier)}
            >
              <div className="text-center">
                <div className="text-6xl mb-4">{config.icon}</div>
                <h3 className="text-xl font-bold mb-2">{config.name}</h3>
                <p className="text-slate-400 text-sm mb-4">{config.description}</p>
                <div className="text-2xl font-bold mb-4">
                ${config.minimum.toLocaleString()} minimum
                </div>
                <button className={`w-full bg-gradient-to-r ${config.color} text-white py-3 px-6 rounded-xl font-medium hover:opacity-90 transition-opacity group-hover:shadow-lg`}>
                  Select {config.name}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TierSelection;