

"use client"
import React, { useState, useEffect, useRef } from 'react';
import { FiArrowUpRight, FiExternalLink, FiTrendingUp } from 'react-icons/fi';
import { createClient } from '@/app/utils/supabase/clients';
import { 
  WalletTier,
  TokenType,
  NetworkType,
  UserWallet,
  TransactionRequest,
  WithdrawalRequest,
  StockPortfolioItem,
  TIER_CONFIG,
  NETWORK_CONFIG,
  POPULAR_TOKENS,
  WALLET_TIERS,
  WalletUpgradeRequest
} from '@/app/data';
import Link from 'next/link';

// Component imports
import ContinueAccountGeneration from './components/ContinueAccountGeneration';
import TierSelection from './components/TierSelection';
import TokenSelection from './components/TokenSelection';
import NetworkSelection from './components/NetworkSelection';
import AccountGenerationLoading from './components/AccountGenerationLoading';
import WithdrawalForm from './components/WithdrawalForm';
import WithdrawalHistory from './components/WithdrawalHistory';
import UpgradeForm from './components/UpgradeForm';
import PortfolioSummary from './components/PortfolioSummary';
import StockPortfolioTable from './components/StockPortfolioTable';
import WalletStatusAlerts from './components/WalletStatusAlerts';
import UpgradeRequestsTable from './components/UpgradeRequestsTable';

const PortfolioPage = () => {
  const [wallet, setWallet] = useState<UserWallet | null>(null);
  const [loading, setLoading] = useState(true);
  const [continueLoading, setContinueLoading] = useState(false);
  const [showTierSelection, setShowTierSelection] = useState(false);
  const [showTokenSelection, setShowTokenSelection] = useState(false);
  const [showNetworkSelection, setShowNetworkSelection] = useState(false);

  const [creatingWallet, setCreatingWallet] = useState(false);
  const [selectedTier, setSelectedTier] = useState<WalletTier | null>(null);
  const [selectedToken, setSelectedToken] = useState<TokenType | null>(null);
  const [selectedNetwork, setSelectedNetwork] = useState<NetworkType | null>(null);
  const [accountRequest, setAccountRequest] = useState<TransactionRequest | null>(null);
  const [generatingAccount, setGeneratingAccount] = useState(false);

  const [waitingForAccount, setWaitingForAccount] = useState(false);
  const [showWithdrawalForm, setShowWithdrawalForm] = useState(false);
  const [withdrawing, setWithdrawing] = useState(false);
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([]);
  const [activeTab, setActiveTab] = useState<'portfolio' | 'withdrawals'>('portfolio');
  const [stockPortfolio, setStockPortfolio] = useState<StockPortfolioItem[]>([]);
  const [portfolioLoading, setPortfolioLoading] = useState(true);
  const [showContinuePrompt, setShowContinuePrompt] = useState(false);

  // Upgrade states
  const [showUpgradeForm, setShowUpgradeForm] = useState(false);
  const [selectedUpgradeTier, setSelectedUpgradeTier] = useState<WalletTier | null>(null);
  const [upgrading, setUpgrading] = useState(false);
  const [upgradeRequests, setUpgradeRequests] = useState<WalletUpgradeRequest[]>([]);

  const supabase = createClient();
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const walletPollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const withdrawalPollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const checkWalletStatus = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const { data: walletData, error: walletError } = await supabase
        .from('wallets')
        .select('*')
        .eq('user_id', user.id)
        .limit(1);

      if (walletError) {
        console.error('Error fetching wallet data:', walletError);
      }

      if (walletData && walletData.length > 0) {
        setWallet(walletData[0]);
        setLoading(false);
      } else {
        const { data: requestData, error: requestError } = await supabase
          .from('transactions')
          .select('*')
          .eq('email', user.email!)
          .eq('status', false)
          .order('created_at', { ascending: false })
          .limit(1);

        if (!requestError && requestData && requestData.length > 0) {
          const request = requestData[0];
          setAccountRequest(request);

          if (request.account_number) {
            createWallet(request.wallet_type, request.account_number, request.network, request.token_type, request.id);
          } else {
            setWaitingForAccount(true);
            startAccountNumberPolling(request.id);
          }
        } else {
          setShowTierSelection(true);
        }
        setLoading(false);
      }
    };

    checkWalletStatus();
    fetchStockPortfolio();

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
      if (walletPollingIntervalRef.current) {
        clearInterval(walletPollingIntervalRef.current);
      }
      if (withdrawalPollingIntervalRef.current) {
        clearInterval(withdrawalPollingIntervalRef.current);
      }
    };
  }, []);

  // Upgrade requests polling
  useEffect(() => {
    if (wallet) {
      fetchUpgradeRequests();
      const interval = setInterval(fetchUpgradeRequests, 10000);
      return () => clearInterval(interval);
    }
  }, [wallet]);

  // Upgrade status polling
  useEffect(() => {
    if (!wallet || upgradeRequests.length === 0) return;

    const interval = setInterval(async () => {
      try {
        const { data, error } = await supabase
          .from('wallet_upgrades')
          .select('*')
          .eq('wallet_id', wallet.id)
          .order('created_at', { ascending: false });

        if (!error && data) {
          const hasNewlyApproved = data.some(newRequest => {
            const oldRequest = upgradeRequests.find(old => old.id === newRequest.id);
            return oldRequest && !oldRequest.status && newRequest.status;
          });

          if (hasNewlyApproved) {
            const { data: walletData, error: walletError } = await supabase
              .from('wallets')
              .select('*')
              .eq('id', wallet.id)
              .single();

            if (!walletError && walletData) {
              setWallet(walletData);
            }
          }

          setUpgradeRequests(data);
        }
      } catch (error) {
        console.error('Error checking upgrade status:', error);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [wallet, upgradeRequests]);

  // Wallet status polling
  useEffect(() => {
    if (!wallet || wallet.status) return;

    walletPollingIntervalRef.current = setInterval(async () => {
      try {
        const { data, error } = await supabase
          .from('wallets')
          .select('*')
          .eq('wallet_number', wallet.wallet_number)
          .single();

        if (!error && data && data.status !== wallet.status) {
          setWallet(data);
          clearInterval(walletPollingIntervalRef.current!);
        }
      } catch (error) {
        console.error('Error polling wallet status:', error);
      }
    }, 5000);

    return () => {
      if (walletPollingIntervalRef.current) {
        clearInterval(walletPollingIntervalRef.current);
      }
    };
  }, [wallet]);

  // Withdrawal polling
  useEffect(() => {
    if (wallet) {
      fetchWithdrawals();
      startWithdrawalPolling();
    }
  }, [wallet]);

  const handleContinue = () => {
    if (!accountRequest) return;
    setContinueLoading(true);
    setShowContinuePrompt(false);
    setWaitingForAccount(true);
    startAccountNumberPolling(accountRequest.id);
  };

  const handleCancel = async () => {
    if (!accountRequest) return;
    try {
      setAccountRequest(null);
      setShowContinuePrompt(false);
      setLoading(true);
      fetchWalletData();
    } catch (error) {
      console.error('Error canceling request:', error);
    }
  };

  const fetchStockPortfolio = async () => {
    try {
      setPortfolioLoading(true);
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setPortfolioLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('stock_portfolio')
        .select('*')
        .eq('user_id', user.id)
        .order('current_value', { ascending: false });

      if (error) throw error;

      setStockPortfolio(data || []);
    } catch (error) {
      console.error('Error fetching stock portfolio:', error);
    } finally {
      setPortfolioLoading(false);
    }
  };

  const fetchUpgradeRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('wallet_upgrades')
        .select('*')
        .eq('wallet_id', wallet!.id)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setUpgradeRequests(data);
      }
    } catch (error) {
      console.error('Error fetching upgrade requests:', error);
    }
  };

  const handleTierUpgrade = async () => {
    if (!wallet || !selectedUpgradeTier) return;

    try {
      setUpgrading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('wallet_upgrades')
        .insert({
          user_id: user.id,
          email: user.email!,
          wallet_id: wallet.id,
          balance: wallet.balance,
          wallet_number: wallet.wallet_number,
          current_tier: wallet.tier,
          target_tier: selectedUpgradeTier,
          status: false
        })
        .select()
        .single();

      if (error) throw error;

      setUpgradeRequests(prev => [data, ...prev]);
      setShowUpgradeForm(false);
      setSelectedUpgradeTier(null);

    } catch (error) {
      console.error('Error requesting tier upgrade:', error);
      alert('Failed to request upgrade. Please try again.');
    } finally {
      setUpgrading(false);
    }
  };

  const fetchWalletData = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      const { data: walletData, error: walletError } = await supabase
        .from('wallets')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (walletError && !walletData) {
        setShowTierSelection(true);
      } else if (walletData) {
        setWallet(walletData);
      }
    } catch (error) {
      console.error('Error fetching wallet data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchWithdrawals = async () => {
    try {
      const { data, error } = await supabase
        .from('withdrawals')
        .select('*')
        .eq('wallet_id', wallet!.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setWithdrawals(data || []);
    } catch (error) {
      console.error('Error fetching withdrawals:', error);
    }
  };

  const startWithdrawalPolling = () => {
    if (withdrawalPollingIntervalRef.current) {
      clearInterval(withdrawalPollingIntervalRef.current);
    }

    withdrawalPollingIntervalRef.current = setInterval(async () => {
      try {
        const { data, error } = await supabase
          .from('withdrawals')
          .select('*')
          .eq('wallet_id', wallet!.id)
          .order('created_at', { ascending: false });

        if (!error && data) {
          setWithdrawals(data);
        }
      } catch (error) {
        console.error('Error polling withdrawals:', error);
      }
    }, 50000);
  };

  const handleTierSelection = (tier: WalletTier) => {
    setSelectedTier(tier);
    setShowTierSelection(false);
    setShowTokenSelection(true);
  };

  const handleTokenSelection = (tokenId: string) => {
    setSelectedToken(tokenId);
    setShowTokenSelection(false);
    setShowNetworkSelection(true);
  };

  const handleNetworkSelection = (network: NetworkType) => {
    setSelectedNetwork(network);
    setShowNetworkSelection(false);
    if (selectedTier && selectedToken) {
      requestWalletAccount(selectedTier, network, selectedToken);
    }
  };

  const requestWalletAccount = async (tier: WalletTier, network: NetworkType, token: TokenType) => {
    try {
      setGeneratingAccount(true);
      setWaitingForAccount(true);

      const { data: { user } = {} } = await supabase.auth.getUser();

      if (!user) throw new Error('User not authenticated');

      const transactionData = {
        email: user.email!,
        amount: TIER_CONFIG[tier].minimum,
        wallet_type: tier,
        account_number: null,
        status: false,
        network: network,
        token_type: token
      };

      const { data, error } = await supabase
        .from('transactions')
        .insert(transactionData)
        .select()
        .single();

      if (error) throw error;

      setAccountRequest(data);
      setGeneratingAccount(false);
      startAccountNumberPolling(data.id);

    } catch (error) {
      console.error('Error creating transaction:', error);
      setGeneratingAccount(false);
      setWaitingForAccount(false);
      resetSelections();
    }
  };

  const startAccountNumberPolling = (transactionId: string) => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
    }

    pollingIntervalRef.current = setInterval(async () => {
      try {
        const { data, error } = await supabase
          .from('transactions')
          .select('*')
          .eq('id', transactionId)
          .single();

        if (!error && data) {
          setAccountRequest(data);

          if (data.account_number) {
            clearInterval(pollingIntervalRef.current!);
            pollingIntervalRef.current = null;
            setWaitingForAccount(false);
            setContinueLoading(false);
            createWallet(data.wallet_type, data.account_number, data.network, data.token_type, data.id);
          }
        }
      } catch (error) {
        console.error('Error polling for account:', error);
        setContinueLoading(false);
      }
    }, 3000);
  };

  const createWallet = async (tier: WalletTier, accountNumber: string, network: NetworkType, tokenType: TokenType, transactionId: string) => {
    try {
      setCreatingWallet(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const walletData = {
        user_id: user.id,
        tier: tier,
        email: user.email!,
        wallet_number: accountNumber,
        status: false,
        balance: 0,
        current_value: 0,
        profit_loss: 0,
        performance_percentage: 0,
        network: network,
        token_type: tokenType
      };

      const { data, error } = await supabase
        .from('wallets')
        .insert(walletData)
        .select()
        .single();

      if (error) throw error;

      setWallet(data);
      resetSelections();
      setAccountRequest(null);
      setContinueLoading(false);

    } catch (error) {
      console.error('Error creating wallet:', error);
      setContinueLoading(false);
    } finally {
      setCreatingWallet(false);
    }
  };

  const handleWithdrawalSubmit = async (amount: string, network: NetworkType, token: TokenType, account: string) => {
    if (!wallet) return;

    const amountNum = parseFloat(amount);

    try {
      setWithdrawing(true);

      const { error: walletError } = await supabase
        .from('wallets')
        .update({ balance: wallet.balance - amountNum })
        .eq('id', wallet.id);

      if (walletError) throw walletError;

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('withdrawals')
        .insert({
          user_id: user.id,
          wallet_id: wallet.id,
          email: wallet.email,
          amount: amountNum,
          network: network,
          token_type: token,
          account_number: account,
          status: false
        })
        .select()
        .single();

      if (error) throw error;

      setWithdrawals(prev => [data, ...prev]);
      setWallet(prev => prev ? { ...prev, balance: prev.balance - amountNum } : null);
      setShowWithdrawalForm(false);

    } catch (error) {
      console.error('Error processing withdrawal:', error);
      alert('Failed to process withdrawal. Please try again.');
    } finally {
      setWithdrawing(false);
    }
  };

  const resetSelections = () => {
    setShowTierSelection(false);
    setShowTokenSelection(false);
    setShowNetworkSelection(false);
    setSelectedTier(null);
    setSelectedToken(null);
    setSelectedNetwork(null);
  };

  const resetWalletCreation = async () => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
    setAccountRequest(null);
    setGeneratingAccount(false);
    setWaitingForAccount(false);
    setCreatingWallet(false);
    setContinueLoading(false);
    resetSelections();
    setLoading(true);
    fetchWalletData();
  };

  // Component render conditions
  if (showContinuePrompt) {
    return <ContinueAccountGeneration 
      onContinue={handleContinue} 
      onCancel={handleCancel} 
      accountRequest={accountRequest} 
    />;
  }

  if (continueLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-slate-400 mb-2">Continuing account generation...</p>
          <p className="text-sm text-slate-500">Please wait while we process your request</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading portfolio...</p>
        </div>
      </div>
    );
  }

  if (showTierSelection) {
    return <TierSelection onTierSelect={handleTierSelection} />;
  }

  if (showTokenSelection) {
    return <TokenSelection 
      selectedTier={selectedTier}
      onTokenSelect={handleTokenSelection}
      onBack={() => {
        setShowTokenSelection(false);
        setSelectedToken(null);
        setShowTierSelection(true);
      }}
    />;
  }

  if (showNetworkSelection && selectedToken) {
    return <NetworkSelection
      selectedTier={selectedTier}
      selectedToken={selectedToken}
      onNetworkSelect={handleNetworkSelection}
      onBack={() => {
        setShowNetworkSelection(false);
        setSelectedNetwork(null);
        setShowTokenSelection(true);
      }}
    />;
  }

  if (generatingAccount || waitingForAccount || creatingWallet) {
    return <AccountGenerationLoading
      generatingAccount={generatingAccount}
      waitingForAccount={waitingForAccount}
      creatingWallet={creatingWallet}
      selectedTier={selectedTier}
      selectedToken={selectedToken}
      selectedNetwork={selectedNetwork}
      onCancel={resetWalletCreation}
    />;
  }

  if (activeTab === 'withdrawals') {
    return <WithdrawalHistory
      withdrawals={withdrawals}
      onBackToPortfolio={() => setActiveTab('portfolio')}
      onNewWithdrawal={() => setShowWithdrawalForm(true)}
    />;
  }

  if (showWithdrawalForm) {
    return <WithdrawalForm
      wallet={wallet}
      onClose={() => setShowWithdrawalForm(false)}
      onSubmit={handleWithdrawalSubmit}
      withdrawing={withdrawing}
    />;
  }

  // Main Portfolio Dashboard
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white py-9">
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        {/* Status Alerts */}
        <WalletStatusAlerts wallet={wallet} upgradeRequests={upgradeRequests} />

        {/* Portfolio Summary */}
        <PortfolioSummary wallet={wallet} />

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mb-8">
          <button
            onClick={() => setShowWithdrawalForm(true)}
            className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-xl font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            <FiArrowUpRight className="w-4 h-4" />
            Withdraw Funds
          </button>
          <button
            onClick={() => setActiveTab("withdrawals")}
            className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-xl font-medium transition-colors flex items-center gap-2"
          >
            <FiExternalLink className="w-4 h-4" />
            View Transaction History
          </button>
          <button
            onClick={() => setShowUpgradeForm(true)}
            className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
            disabled={!wallet}
          >
            <FiTrendingUp className="w-4 h-4" />
            Upgrade Tier
          </button>
          <Link href="/dashboard/trade-transactions">
            <button
              className="bg-green-700 cursor-pointer text-white px-6 py-3 rounded-xl font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
              disabled={!wallet}
            >
              Go to trade History
            </button>
          </Link>
        </div>

        {/* Stock Portfolio Table */}
        <StockPortfolioTable 
          stockPortfolio={stockPortfolio} 
          portfolioLoading={portfolioLoading} 
        />

        {/* Upgrade Form Modal */}
        {showUpgradeForm && (
          <UpgradeForm
            wallet={wallet}
            selectedUpgradeTier={selectedUpgradeTier}
            upgrading={upgrading}
            onClose={() => setShowUpgradeForm(false)}
            onTierSelect={setSelectedUpgradeTier}
            onUpgrade={handleTierUpgrade}
          />
        )}

        {/* Upgrade Requests Table */}
        <UpgradeRequestsTable upgradeRequests={upgradeRequests} />
      </div>
    </div>
  );
};

export default PortfolioPage;