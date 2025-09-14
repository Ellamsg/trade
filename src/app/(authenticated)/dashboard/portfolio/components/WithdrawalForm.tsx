import React, { useState } from 'react';
import { FiX, FiArrowUpRight, FiChevronDown } from 'react-icons/fi';
import { UserWallet, TokenType, NetworkType, POPULAR_TOKENS, NETWORK_CONFIG } from '@/app/data';

interface WithdrawalFormProps {
  wallet: UserWallet | null;
  onClose: () => void;
  onSubmit: (amount: string, network: NetworkType, token: TokenType, account: string) => Promise<void>;
  withdrawing: boolean;
}

const WithdrawalForm: React.FC<WithdrawalFormProps> = ({
  wallet,
  onClose,
  onSubmit,
  withdrawing
}) => {
  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  const [withdrawalNetwork, setWithdrawalNetwork] = useState<NetworkType | null>(null);
  const [withdrawalToken, setWithdrawalToken] = useState<TokenType | null>(null);
  const [withdrawalAccount, setWithdrawalAccount] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const getTokenById = (tokenId: string) => {
    return POPULAR_TOKENS.find(token => token.id === tokenId);
  };

  const handleSubmit = async () => {
    if (!wallet || !withdrawalNetwork || !withdrawalToken || !withdrawalAccount || !withdrawalAmount) {
      alert('Please fill all fields');
      return;
    }

    const amount = parseFloat(withdrawalAmount);
    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    if (amount > wallet.balance) {
      alert('Insufficient balance');
      return;
    }

    await onSubmit(withdrawalAmount, withdrawalNetwork, withdrawalToken, withdrawalAccount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white py-9">
      <div className="max-w-2xl mx-auto p-4 md:p-6">
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-slate-700/50">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Request Withdrawal</h2>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-slate-400 mb-2">Amount ($)</label>
              <input
                type="number"
                value={withdrawalAmount}
                onChange={(e) => setWithdrawalAmount(e.target.value)}
                placeholder="Enter amount to withdraw"
                className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
              />
              <p className="text-sm text-slate-500 mt-1">
                Available balance: ${wallet?.balance.toLocaleString() || '0'}
              </p>
            </div>

            <div className="relative">
              <label className="block text-slate-400 mb-2">Token</label>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-3 text-white flex items-center justify-between"
              >
                {withdrawalToken ? (
                  <div className="flex items-center gap-2">
                    <span>{getTokenById(withdrawalToken)?.icon}</span>
                    <span>{getTokenById(withdrawalToken)?.name} ({getTokenById(withdrawalToken)?.symbol})</span>
                  </div>
                ) : (
                  <span className="text-slate-400">Select Token</span>
                )}
                <FiChevronDown className={`w-4 h-4 transition-transform ${dropdownOpen ? 'transform rotate-180' : ''}`} />
              </button>
              {dropdownOpen && (
                <div className="absolute z-10 mt-1 w-full bg-slate-800 border border-slate-700 rounded-lg shadow-lg max-h-60 overflow-auto">
                  {POPULAR_TOKENS.map((token) => (
                    <div
                      key={token.id}
                      className="px-4 py-2 hover:bg-slate-700 cursor-pointer flex items-center gap-2"
                      onClick={() => {
                        setWithdrawalToken(token.id);
                        setWithdrawalNetwork(null);
                        setDropdownOpen(false);
                      }}
                    >
                      <span>{token.icon}</span>
                      <span>{token.name} ({token.symbol})</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {withdrawalToken && (
              <div className="relative">
                <label className="block text-slate-400 mb-2">Network</label>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-3 text-white flex items-center justify-between"
                  disabled={!withdrawalToken}
                >
                  {withdrawalNetwork ? (
                    <div className="flex items-center gap-2">
                      <span>{NETWORK_CONFIG[withdrawalNetwork].icon}</span>
                      <span>{NETWORK_CONFIG[withdrawalNetwork].name}</span>
                    </div>
                  ) : (
                    <span className="text-slate-400">Select Network</span>
                  )}
                  <FiChevronDown className={`w-4 h-4 transition-transform ${dropdownOpen ? 'transform rotate-180' : ''}`} />
                </button>
                {dropdownOpen && (
                  <div className="absolute z-10 mt-1 w-full bg-slate-800 border border-slate-700 rounded-lg shadow-lg max-h-60 overflow-auto">
                    {getTokenById(withdrawalToken)?.supportedNetworks.map((networkId) => {
                      const network = NETWORK_CONFIG[networkId];
                      return (
                        <div
                          key={network.id}
                          className="px-4 py-2 hover:bg-slate-700 cursor-pointer flex items-center gap-2"
                          onClick={() => {
                            setWithdrawalNetwork(network.id);
                            setDropdownOpen(false);
                          }}
                        >
                          <span>{network.icon}</span>
                          <span>{network.name}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            <div>
              <label className="block text-slate-400 mb-2">Account</label>
              <input
                type="text"
                value={withdrawalAccount}
                onChange={(e) => setWithdrawalAccount(e.target.value)}
                placeholder="Enter destination account"
                className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="pt-4">
              <button
                onClick={handleSubmit}
                disabled={withdrawing}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-6 rounded-xl font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {withdrawing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <FiArrowUpRight className="w-4 h-4" />
                    Request Withdrawal
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WithdrawalForm;