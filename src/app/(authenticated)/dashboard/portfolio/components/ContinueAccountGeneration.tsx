import React from 'react';
import { TransactionRequest, TIER_CONFIG, NETWORK_CONFIG, POPULAR_TOKENS } from '@/app/data';

interface ContinueAccountGenerationProps {
  onContinue: () => void;
  onCancel: () => void;
  accountRequest: TransactionRequest | null;
}

const ContinueAccountGeneration: React.FC<ContinueAccountGenerationProps> = ({
  onContinue,
  onCancel,
  accountRequest
}) => {
  const token = accountRequest?.token_type ? POPULAR_TOKENS.find(t => t.id === accountRequest.token_type) : null;
  const network = accountRequest?.network ? NETWORK_CONFIG[accountRequest.network] : null;
  const tier = accountRequest?.wallet_type ? TIER_CONFIG[accountRequest.wallet_type] : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white py-9">
      <div className="max-w-4xl mx-auto p-4 md:p-6">
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50 text-center">
          <div className="text-6xl mb-6">🔍</div>
          <h3 className="text-2xl font-bold mb-4">
            Continue Account Generation
          </h3>
          <p className="text-slate-400 mb-6">
            We found an ongoing account generation process. Would you like to continue?
          </p>

          {accountRequest && (
            <div className="bg-slate-700/50 rounded-xl p-4 mb-6">
              <p className="text-sm text-slate-300">
                <strong>Tier:</strong> {tier?.name || 'N/A'}
              </p>
              <p className="text-sm text-slate-300">
                <strong>Token:</strong> {token?.name || 'N/A'} ({token?.symbol || 'N/A'})
              </p>
              <p className="text-sm text-slate-300">
                <strong>Network:</strong> {network?.name || 'N/A'}
              </p>
              <p className="text-sm text-slate-500 mt-2">
                Started: {new Date(accountRequest.created_at).toLocaleString()}
              </p>
            </div>
          )}

          <div className="flex gap-4 justify-center">
            <button
              onClick={onContinue}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-colors"
            >
              Continue Process
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContinueAccountGeneration;