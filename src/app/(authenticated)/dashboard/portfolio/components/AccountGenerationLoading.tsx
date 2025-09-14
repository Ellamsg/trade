import React from 'react';
import { WalletTier, TokenType, NetworkType, TIER_CONFIG, NETWORK_CONFIG, POPULAR_TOKENS } from '@/app/data';

interface AccountGenerationLoadingProps {
  generatingAccount: boolean;
  waitingForAccount: boolean;
  creatingWallet: boolean;
  selectedTier: WalletTier | null;
  selectedToken: TokenType | null;
  selectedNetwork: NetworkType | null;
  onCancel?: () => void;
}

const AccountGenerationLoading: React.FC<AccountGenerationLoadingProps> = ({
  generatingAccount,
  waitingForAccount,
  creatingWallet,
  selectedTier,
  selectedToken,
  selectedNetwork,
  onCancel
}) => {
  const token = selectedToken ? POPULAR_TOKENS.find(t => t.id === selectedToken) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white py-9">
      <div className="max-w-4xl mx-auto p-4 md:p-6">
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-400 mx-auto mb-6"></div>

          {generatingAccount && (
            <>
              <h3 className="text-2xl font-bold mb-4">
                Submitting Your Request...
              </h3>
              <p className="text-slate-400">Creating your wallet request</p>
            </>
          )}

          {waitingForAccount && !generatingAccount && (
            <>
              <h3 className="text-2xl font-bold mb-4">
                Generating Account...
              </h3>
              <p className="text-slate-400 mb-2">
                Please wait while our admin generates your account
              </p>
              <div className="bg-slate-700/50 rounded-xl p-4 mb-4">
                <p className="text-sm text-slate-300">
                  <strong>Tier:</strong> {selectedTier && TIER_CONFIG[selectedTier].name}
                </p>
                <p className="text-sm text-slate-300">
                  <strong>Token:</strong> {token?.name} ({token?.symbol})
                </p>
                <p className="text-sm text-slate-300">
                  <strong>Network:</strong> {selectedNetwork && NETWORK_CONFIG[selectedNetwork].name}
                </p>
              </div>
              <p className="text-sm text-slate-500">
                This may take a few minutes. You can close this page and come back later.
              </p>
            </>
          )}

          {creatingWallet && (
            <>
              <h3 className="text-2xl font-bold mb-4">
                Creating Your Wallet...
              </h3>
              <p className="text-slate-400">Setting up your investment wallet</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountGenerationLoading;