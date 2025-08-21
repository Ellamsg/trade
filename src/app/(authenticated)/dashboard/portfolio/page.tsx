


"use client"
import React, { useState, useEffect, useRef } from 'react';
import { FiTrendingUp, FiTrendingDown, FiDollarSign, FiPieChart, FiActivity, FiPlus, FiCreditCard, FiArrowUpRight, FiArrowDownLeft, FiCheck, FiClock, FiX, FiArrowLeft, FiExternalLink, FiChevronDown } from 'react-icons/fi';
import { createClient } from '@/app/utils/supabase/clients';
import { WalletTier ,
  TokenType ,
  NetworkType,
  UserWallet ,
  TransactionRequest ,
  WithdrawalRequest,
  StockPortfolioItem ,
  TIER_CONFIG,
  NETWORK_CONFIG,
  POPULAR_TOKENS,
  WALLET_TIERS,
  WalletUpgradeRequest
} from '@/app/data';
import Link from 'next/link';
const ContinueAccountGeneration = ({ onContinue, onCancel, accountRequest }: { 
  onContinue: () => void, 
  onCancel: () => void,
  accountRequest: TransactionRequest | null
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
            <button
              onClick={onCancel}
              className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-xl font-medium transition-colors"
            >
              Cancel Process
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const PortfolioPage = () => {
  const [wallet, setWallet] = useState<UserWallet | null>(null);
  const [loading, setLoading] = useState(true);
  const [continueLoading, setContinueLoading] = useState(false); // New loading state for continue process
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
  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  const [withdrawalNetwork, setWithdrawalNetwork] = useState<NetworkType | null>(null);
  const [withdrawalToken, setWithdrawalToken] = useState<TokenType | null>(null);
  const [withdrawalAccount, setWithdrawalAccount] = useState('');
 
  const [withdrawing, setWithdrawing] = useState(false);
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([]);
  const [activeTab, setActiveTab] = useState<'portfolio' | 'withdrawals'>('portfolio');
  const [stockPortfolio, setStockPortfolio] = useState<StockPortfolioItem[]>([]);
  const [portfolioLoading, setPortfolioLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showContinuePrompt, setShowContinuePrompt] = useState(false);
  

// Add these states to the component
const [showUpgradeForm, setShowUpgradeForm] = useState(false);
const [selectedUpgradeTier, setSelectedUpgradeTier] = useState<WalletTier | null>(null);
const [upgrading, setUpgrading] = useState(false);
const [upgradeRequests, setUpgradeRequests] = useState<WalletUpgradeRequest[]>([]);


  const supabase = createClient();
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const walletPollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const withdrawalPollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Check for existing account request in localStorage
    const savedRequest = localStorage.getItem('accountRequest');
    if (savedRequest) {
      const parsedRequest = JSON.parse(savedRequest);
      setAccountRequest(parsedRequest);
      
      if (!parsedRequest.account_number) {
        setShowContinuePrompt(true);
        setLoading(false); // Stop initial loading when showing continue prompt
      } else {
        // If account number exists but wallet wasn't created
        createWallet(
          parsedRequest.wallet_type,
          parsedRequest.account_number,
          parsedRequest.network,
          parsedRequest.token_type
        );
      }
    } else {
      fetchWalletData();
    }

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

  const handleContinue = () => {
    if (!accountRequest) return;
    
    setContinueLoading(true); // Set continue loading state
    setShowContinuePrompt(false);
    setWaitingForAccount(true);
    startAccountNumberPolling(accountRequest.id);
  };

  const handleCancel = () => {
    localStorage.removeItem('accountRequest');
    setAccountRequest(null);
    setShowContinuePrompt(false);
  
    fetchWalletData();
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

  const calculateTotalPortfolioValue = () => {
    return stockPortfolio.reduce((total, item) => total + (item.current_value || 0), 0);
  };

//upgrade account

// Add this useEffect for polling upgrade requests
useEffect(() => {
  if (wallet) {
    fetchUpgradeRequests();
    const interval = setInterval(fetchUpgradeRequests, 10000);
    return () => clearInterval(interval);
  }
}, [wallet]);

// Add this function to fetch upgrade requests
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


// Add this useEffect after the existing fetchUpgradeRequests useEffect
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
        // Check if any upgrade changed from pending to approved
        const hasNewlyApproved = data.some(newRequest => {
          const oldRequest = upgradeRequests.find(old => old.id === newRequest.id);
          return oldRequest && !oldRequest.status && newRequest.status;
        });

        if (hasNewlyApproved) {
          // Refetch wallet data to get updated balance and tier
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
  }, 5000); // Check every 5 seconds

  return () => clearInterval(interval);
}, [wallet, upgradeRequests]);




// Add this function to handle tier upgrade
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
        wallet_number : wallet.wallet_number,
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

  useEffect(() => {
    if (wallet) {
      fetchWithdrawals();
      startWithdrawalPolling();
    }
  }, [wallet]);

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
      
      const { data: { user } } = await supabase.auth.getUser();
      
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
      // Store in localStorage
      localStorage.setItem('accountRequest', JSON.stringify(data));
      
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
          // Update localStorage with latest data
          localStorage.setItem('accountRequest', JSON.stringify(data));
          setAccountRequest(data);
          
          if (data.account_number) {
            clearInterval(pollingIntervalRef.current!);
            pollingIntervalRef.current = null;
            setWaitingForAccount(false);
            setContinueLoading(false); // Stop continue loading
            // Remove from localStorage since we're done
            localStorage.removeItem('accountRequest');
            createWallet(data.wallet_type, data.account_number, data.network, data.token_type);
          }
        }
      } catch (error) {
        console.error('Error polling for account:', error);
        setContinueLoading(false); // Stop continue loading on error
      }
    }, 3000);
  };

  const createWallet = async (tier: WalletTier, accountNumber: string, network: NetworkType, tokenType: TokenType) => {
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
      setContinueLoading(false); // Stop continue loading
      // Clean up localStorage
      localStorage.removeItem('accountRequest');
      
    } catch (error) {
      console.error('Error creating wallet:', error);
      setContinueLoading(false); // Stop continue loading on error
    } finally {
      setCreatingWallet(false);
    }
  };

  const handleWithdrawalSubmit = async () => {
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

    try {
      setWithdrawing(true);

      const { error: walletError } = await supabase
        .from('wallets')
        .update({ balance: wallet.balance - amount })
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
          amount: amount,
          network: withdrawalNetwork,
          token_type: withdrawalToken,
          account_number: withdrawalAccount,
          status: false
        })
        .select()
        .single();

      if (error) throw error;

      setWithdrawals(prev => [data, ...prev]);
      setWallet(prev => prev ? { ...prev, balance: prev.balance - amount } : null);
      
      setWithdrawalAmount('');
      setWithdrawalNetwork(null);
      setWithdrawalToken(null);
      setWithdrawalAccount('');
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

  const resetWalletCreation = () => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
    localStorage.removeItem('accountRequest');
    setAccountRequest(null);
    setGeneratingAccount(false);
    setWaitingForAccount(false);
    setCreatingWallet(false);
    setContinueLoading(false); // Reset continue loading
    resetSelections();
    setShowTierSelection(true);
  };

  const goBackToTierSelection = () => {
    setShowTokenSelection(false);
    setShowNetworkSelection(false);
    setSelectedToken(null);
    setSelectedNetwork(null);
    setShowTierSelection(true);
  };

  const goBackToTokenSelection = () => {
    setShowNetworkSelection(false);
    setSelectedNetwork(null);
    setShowTokenSelection(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTokenById = (tokenId: string) => {
    return POPULAR_TOKENS.find(token => token.id === tokenId);
  };

  if (showContinuePrompt) {
    return <ContinueAccountGeneration onContinue={handleContinue} onCancel={handleCancel} accountRequest={accountRequest} />;
  }

  // Show continue loading state
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
//restrict
  if (showTierSelection) {
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
                onClick={() => handleTierSelection(tier as WalletTier)}
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
  }

  if (showTokenSelection) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white py-9">
        <div className="max-w-6xl mx-auto p-4 md:p-6">
          <div className="text-center mb-8">
            <button
              onClick={goBackToTierSelection}
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
                onClick={() => handleTokenSelection(token.id)}
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
  }

  if (showNetworkSelection && selectedToken) {
    const token = getTokenById(selectedToken);
    if (!token) return null;
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white py-9">
        <div className="max-w-6xl mx-auto p-4 md:p-6">
          <div className="text-center mb-8">
            <button
              onClick={goBackToTokenSelection}
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
                  onClick={() => handleNetworkSelection(network.id)}
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
  }

  if (generatingAccount || waitingForAccount || creatingWallet) {
    const token = selectedToken ? getTokenById(selectedToken) : null;
    
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
            
            {waitingForAccount && !creatingWallet && (
              <button
                onClick={resetWalletCreation}
                className="mt-6 bg-slate-700 hover:bg-slate-600 text-white py-2 px-6 rounded-xl font-medium transition-colors"
              >
                Cancel Request
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (activeTab === 'withdrawals') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white py-9">
        <div className="max-w-7xl mx-auto p-4 md:p-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent mb-2">
                Withdrawal History
              </h1>
              <p className="text-slate-400">View your past withdrawal requests</p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setActiveTab('portfolio')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Back to Portfolio
              </button>
              <button
                onClick={() => setShowWithdrawalForm(true)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <FiArrowUpRight className="w-4 h-4" />
                New Withdrawal
              </button>
            </div>
          </div>

          {withdrawals.length === 0 ? (
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50 text-center">
              <div className="text-slate-400 mb-4">
                <FiExternalLink className="w-12 h-12 mx-auto mb-2" />
                <p>No withdrawal history yet</p>
              </div>
              <button
                onClick={() => setShowWithdrawalForm(true)}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-medium transition-colors flex items-center gap-2 mx-auto"
              >
                <FiArrowUpRight className="w-4 h-4" />
                Request Withdrawal
              </button>
            </div>
          ) : (
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-700/50">
                    <tr>
                      <th className="text-left p-4 text-slate-300 font-medium">Amount</th>
                      <th className="text-left p-4 text-slate-300 font-medium">Token</th>
                      <th className="text-left p-4 text-slate-300 font-medium">Network</th>
                      <th className="text-left p-4 text-slate-300 font-medium">Account</th>
                      <th className="text-left p-4 text-slate-300 font-medium">Status</th>
                      <th className="text-left p-4 text-slate-300 font-medium">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {withdrawals.map((withdrawal) => (
                      <tr key={withdrawal.id} className="border-t border-slate-700/50 hover:bg-slate-700/25">
                        <td className="p-4">
                          <p className="text-white font-medium">${withdrawal.amount.toLocaleString()}</p>
                        </td>
                        <td className="p-4">
                          <p className="text-white font-medium">{withdrawal.token_type.toUpperCase()}</p>
                        </td>
                        <td className="p-4">
                          <p className="text-white font-medium">{NETWORK_CONFIG[withdrawal.network].name}</p>
                        </td>
                        <td className="p-4">
                          <p className="font-mono text-slate-300">{withdrawal.account_number}</p>
                        </td>
                        <td className="p-4">
                          {withdrawal.status ? (
                            <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                              <FiCheck className="w-3 h-3" />
                              Completed
                            </span>
                          ) : (
                            <span className="bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                              <FiClock className="w-3 h-3" />
                              Pending
                            </span>
                          )}
                        </td>
                        <td className="p-4">
                          <p className="text-slate-400 text-sm">{formatDate(withdrawal.created_at)}</p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (showWithdrawalForm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white py-9">
        <div className="max-w-2xl mx-auto p-4 md:p-6">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-slate-700/50">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Request Withdrawal</h2>
              <button
                onClick={() => setShowWithdrawalForm(false)}
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
                  onClick={handleWithdrawalSubmit}
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
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white py-9">
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        {/* Wallet Status Alert */}
        {wallet?.status === false && (
          <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-3">
              <FiClock className="w-5 h-5 text-yellow-400" />
              <div>
                <p className="text-yellow-400 font-medium">
                  Wallet Setup in Progress
                </p>
                <p className="text-sm text-slate-400">
                  Send ${TIER_CONFIG[wallet.tier].minimum.toLocaleString()} to
                  account:
                  <span className="font-mono font-bold text-white ml-2">
                    {wallet.wallet_number}
                  </span>
                </p>
                {wallet.network && wallet.token_type && (
                  <p className="text-sm text-slate-400 mt-1">
                    Network: {NETWORK_CONFIG[wallet.network].name} • Token:{" "}
                    {getTokenById(wallet.token_type)?.name}
                  </p>
                )}
                <p className="text-xs text-yellow-400 mt-2">
                  Waiting for admin to confirm payment...
                </p>
              </div>
            </div>
          </div>
        )}

        {upgradeRequests.some((req) => !req.status) && (
          <div className="bg-purple-500/20 border border-purple-500/30 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-3">
              <FiTrendingUp className="w-5 h-5 text-purple-400" />
              <div>
                <p className="text-purple-400 font-medium">
                  Tier Upgrade Requested
                </p>
                {upgradeRequests
                  .filter((req) => !req.status)
                  .map((req) => (
                    <div key={req.id}>
                      <p className="text-sm text-slate-400">
                        Upgrade to {TIER_CONFIG[req.target_tier].name}: Please
                        send
                        <span className="font-bold text-white">
                          {" "}
                          $
                          {TIER_CONFIG[
                            req.target_tier
                          ].minimum.toLocaleString()}
                        </span>{" "}
                        to account:
                        <span className="font-mono font-bold text-white ml-2">
                          {wallet?.wallet_number}
                        </span>
                      </p>
                      <p className="text-sm text-slate-400 mt-1">
                        Network:{" "}
                        {wallet?.network && NETWORK_CONFIG[wallet.network].name}{" "}
                        • Token:{" "}
                        {wallet?.token_type &&
                          getTokenById(wallet.token_type)?.name}
                      </p>
                      <p className="text-xs text-purple-400 mt-2">
                        Requested on {formatDate(req.created_at)} - Waiting for
                        admin confirmation...
                      </p>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* Portfolio Summary Card */}
        <div className="bg-gradient-to-r from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl p-6 mb-6 md:mb-8 border border-slate-700/50 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-slate-400 text-base md:text-lg mb-2">
                Current Wallet Value
              </p>
              <p className="text-2xl md:text-4xl font-bold text-white mb-2">
                ${wallet?.balance.toLocaleString() || "0"}
              </p>
            </div>

            <div className="p-3 md:p-4 bg-blue-600/20 rounded-xl">
              <FiDollarSign className="w-6 h-6 md:w-8 md:h-8 text-blue-400" />
            </div>
          </div>
          <div className="bg-slate-800/30 my-6 rounded-xl p-3 md:p-4 border border-slate-700/30">
            <p className="text-slate-400 text-xs md:text-sm mb-1">Account</p>
            <p className="text-lg md:text-xl font-bold text-white font-mono">
              {wallet?.wallet_number || "N/A"}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6">
            <div className="bg-slate-800/30 rounded-xl p-3 md:p-4 border border-slate-700/30">
              <p className="text-slate-400 text-xs md:text-sm mb-1">
                Wallet Tier
              </p>
              <p className="text-lg md:text-xl font-bold text-white">
                {wallet ? TIER_CONFIG[wallet.tier].name : "N/A"}
              </p>
            </div>
            <div className="bg-slate-800/30 rounded-xl p-3 md:p-4 border border-slate-700/30">
              <p className="text-slate-400 text-xs md:text-sm mb-1">Network</p>
              <p className="text-lg md:text-xl font-bold text-white">
                {wallet?.network ? NETWORK_CONFIG[wallet.network].name : "N/A"}
              </p>
            </div>
            <div className="bg-slate-800/30 rounded-xl p-3 md:p-4 border border-slate-700/30">
              <p className="text-slate-400 text-xs md:text-sm mb-1">Token</p>
              <p className="text-lg md:text-xl font-bold text-white">
                {wallet?.token_type
                  ? getTokenById(wallet.token_type)?.symbol
                  : "N/A"}
              </p>
              <p>{wallet?.token_type}</p>
            </div>
          </div>
        </div>

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
            View Withdrawal History
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
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 overflow-hidden">
          <div className="p-6 border-b border-slate-700/50">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  Stock Portfolio
                </h2>
                <p className="text-slate-400">Your current stock investments</p>
              </div>
              <div className="flex items-center gap-2">
                <FiPieChart className="w-5 h-5 text-blue-400" />
                <span className="text-sm text-slate-400">
                  Total Assets: {stockPortfolio.length}
                </span>
              </div>
            </div>
          </div>

          {portfolioLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto mb-4"></div>
              <p className="text-slate-400">Loading portfolio...</p>
            </div>
          ) : stockPortfolio.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-slate-400 mb-4">
                <FiActivity className="w-12 h-12 mx-auto mb-2" />
                <p>No stock investments yet</p>
                <p className="text-sm mt-2">
                  Your stock portfolio will appear here once you make
                  investments
                </p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-700/50">
                  <tr>
                    <th className="text-left p-4 text-slate-300 font-medium">
                      Asset
                    </th>
                    <th className="text-left p-4 text-slate-300 font-medium">
                      Symbol
                    </th>
                    <th className="text-left p-4 text-slate-300 font-medium">
                      Amount
                    </th>
                    {/* <th className="text-left p-4 text-slate-300 font-medium">
                      Avg Price
                    </th>
                    <th className="text-left p-4 text-slate-300 font-medium">
                      Current Value
                    </th> */}
                    <th className="text-left p-4 text-slate-300 font-medium">
                      P&L
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {stockPortfolio.map((item) => {
                    const totalInvested = item.amount * item.average_price;
                    const totalCurrentValue = item.amount * item.current_value;
                    const profitLoss = totalCurrentValue - totalInvested;
                    const profitLossPercentage =
                      totalInvested > 0
                        ? (profitLoss / totalInvested) * 100
                        : 0;

                    return (
                      <tr
                        key={item.id}
                        className="border-t border-slate-700/50 hover:bg-slate-700/25"
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            {item.image_url && (
                              <img
                                src={item.image_url}
                                alt={item.asset_name}
                                className="w-8 h-8 rounded-full"
                                onError={(e) => {
                                  e.currentTarget.style.display = "none";
                                }}
                              />
                            )}
                            <div>
                              <p className="text-white font-medium">
                                {item.asset_name}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <p className="text-slate-300 font-mono font-medium">
                            {item.asset}
                          </p>
                        </td>
                        <td className="p-4">
                          <p className="text-white font-medium">
                            {item.amount.toLocaleString()}
                          </p>
                        </td>
                        {/* <td className="p-4">
                          <p className="text-white font-medium">
                            ${item.average_price.toLocaleString()}
                          </p>
                        </td> */}
                        {/* <td className="p-4">
                          <p className="text-white font-medium">
                            ${item.current_value.toLocaleString()}
                          </p>
                        </td> */}

                        <td
                          className={`${
                            item.price_change.includes("+")
                              ? "text-green-700"
                              : "text-red-800"
                          }`}
                        >
                          <p>{item.price_change}</p>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {showUpgradeForm && (
          <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
            <div className="bg-slate-800 rounded-2xl p-6 max-w-md w-full border border-slate-700">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Upgrade Wallet Tier</h3>
                <button
                  onClick={() => setShowUpgradeForm(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>

              <div className="mb-6">
                <p className="text-slate-400 mb-2">
                  Current Tier: {wallet && TIER_CONFIG[wallet.tier].name}
                </p>
                <p className="text-slate-400 mb-4">
                  Minimum for upgrade: $
                  {wallet && TIER_CONFIG[wallet.tier].minimum * 2}
                </p>

                <label className="block text-slate-400 mb-2">
                  Select New Tier
                </label>
                <div className="space-y-2">
                  {WALLET_TIERS.filter(
                    (tier) =>
                      TIER_CONFIG[tier].minimum >
                      TIER_CONFIG[wallet!.tier].minimum
                  ).map((tier) => (
                    <div
                      key={tier}
                      className={`p-3 rounded-lg border cursor-pointer ${
                        selectedUpgradeTier === tier
                          ? "border-purple-500 bg-purple-500/10"
                          : "border-slate-700 hover:bg-slate-700/50"
                      }`}
                      onClick={() => setSelectedUpgradeTier(tier)}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">
                            {TIER_CONFIG[tier].name}
                          </p>
                          <p className="text-sm text-slate-400">
                            Min: ${TIER_CONFIG[tier].minimum.toLocaleString()}
                          </p>
                        </div>
                        {selectedUpgradeTier === tier && (
                          <FiCheck className="text-purple-400" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={handleTierUpgrade}
                disabled={!selectedUpgradeTier || upgrading}
                className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white py-3 rounded-lg font-medium disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {upgrading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <FiTrendingUp className="w-4 h-4" />
                    Request Upgrade
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {upgradeRequests.length > 0 && (
          <div className="mt-8">
            <h3 className="text-xl font-bold mb-4">Pending Tier Upgrades</h3>
            <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 overflow-hidden">
              <table className="w-full">
                <thead className="bg-slate-700/50">
                  <tr>
                    <th className="p-3 text-left text-slate-300">
                      Current Tier
                    </th>
                    <th className="p-3 text-left text-slate-300">
                      Target Tier
                    </th>
                    <th className="p-3 text-left text-slate-300">Requested</th>
                    <th className="p-3 text-left text-slate-300">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {upgradeRequests.map((request) => (
                    <tr
                      key={request.id}
                      className="border-t border-slate-700/50 hover:bg-slate-700/25"
                    >
                      <td className="p-3">
                        {TIER_CONFIG[request.current_tier].name}
                      </td>
                      <td className="p-3">
                        {TIER_CONFIG[request.target_tier].name}
                      </td>
                      <td className="p-3 text-slate-400">
                        {formatDate(request.created_at)}
                      </td>
                      <td className="p-3">
                        {request.status ? (
                          <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm flex items-center gap-1 w-fit">
                            <FiCheck className="w-3 h-3" /> Approved
                          </span>
                        ) : (
                          <span className="bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full text-sm flex items-center gap-1 w-fit">
                            <FiClock className="w-3 h-3" /> Pending
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PortfolioPage;


