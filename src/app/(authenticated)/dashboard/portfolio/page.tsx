


"use client"
import React, { useState, useEffect, useRef } from 'react';
import { FiTrendingUp, FiTrendingDown, FiDollarSign, FiPieChart, FiActivity, FiPlus, FiCreditCard, FiArrowUpRight, FiArrowDownLeft, FiCheck, FiClock, FiX, FiArrowLeft, FiExternalLink } from 'react-icons/fi';
import { createClient } from '@/app/utils/supabase/clients';

type WalletTier = 
  | 'basic' 
  | 'standard' 
  | 'premium' 
  | 'gold' 
  | 'platinum' 
  | 'diamond' 
  | 'elite';

type NetworkType = 'bitcoin' | 'ethereum' | 'binance' | 'polygon' | 'solana' | 'cardano';
type TokenType = 'btc' | 'eth' | 'usdt' | 'usdc' | 'bnb' | 'ada' | 'sol' | 'matic' | 'busd' | 'dai';

type UserWallet = {
  id: string;
  user_id: string;
  tier: WalletTier;
  wallet_number: string;
  status: boolean;
  balance: number;
  email: string;
  created_at: string;
  current_value: number;
  profit_loss: number;
  performance_percentage: number;
  network?: NetworkType;
  token_type?: TokenType;
};

type TransactionRequest = {
  id: string;
  email: string;
  amount: number;
  wallet_type: WalletTier;
  account_number: string | null;
  status: boolean;
  created_at: string;
  network?: NetworkType;
  token_type?: TokenType;
};

type WithdrawalRequest = {
  id: string;
  user_id: string;
  wallet_id: string;
  email: string;
  amount: number;
  network: NetworkType;
  token_type: TokenType;
  account_number: string;
  status: boolean;
  created_at: string;
  updated_at: string;
};

type StockPortfolioItem = {
  id: string;
  user_id: string;
  asset: string;
  asset_name: string;
  amount: number;
  average_price: number;
  current_value: number;
  image_url?: string;
};

const TIER_CONFIG = {
  basic: {
    name: 'Basic Wallet',
    minimum: 1000,
    color: 'from-gray-300 to-gray-400',
    bgColor: 'bg-gray-400/20',
    borderColor: 'border-gray-400/30',
    icon: '🟦',
    description: 'Entry-level access',
  },
  standard: {
    name: 'Standard Wallet',
    minimum: 10000,
    color: 'from-blue-400 to-blue-600',
    bgColor: 'bg-blue-500/20',
    borderColor: 'border-blue-500/30',
    icon: '🟪',
    description: 'Ideal for consistent growth',
  },
  premium: {
    name: 'Premium Wallet',
    minimum: 20000,
    color: 'from-purple-400 to-purple-600',
    bgColor: 'bg-purple-500/20',
    borderColor: 'border-purple-500/30',
    icon: '🟣',
    description: 'Advanced investor access',
  },
  gold: {
    name: 'Gold Wallet',
    minimum: 50000,
    color: 'from-yellow-400 to-yellow-600',
    bgColor: 'bg-yellow-500/20',
    borderColor: 'border-yellow-500/30',
    icon: '🟨',
    description: 'High-value investments',
  },
  platinum: {
    name: 'Platinum Wallet',
    minimum: 100000,
    color: 'from-slate-400 to-slate-600',
    bgColor: 'bg-slate-500/20',
    borderColor: 'border-slate-500/30',
    icon: '⬜️',
    description: 'Exclusive investor tier',
  },
  diamond: {
    name: 'Diamond Wallet',
    minimum: 500000,
    color: 'from-indigo-400 to-indigo-700',
    bgColor: 'bg-indigo-500/20',
    borderColor: 'border-indigo-500/30',
    icon: '🔷',
    description: 'Elite wealth package',
  },
  elite: {
    name: 'Elite Wallet',
    minimum: 1000000,
    color: 'from-emerald-500 to-emerald-700',
    bgColor: 'bg-emerald-500/20',
    borderColor: 'border-emerald-500/30',
    icon: '💎',
    description: 'Top 1% wealth access',
  },
  
};

const NETWORK_CONFIG = {
  bitcoin: {
    name: 'Bitcoin Network',
    symbol: 'BTC',
    icon: '₿',
    color: 'from-orange-400 to-orange-600',
    bgColor: 'bg-orange-500/20',
    borderColor: 'border-orange-500/30',
    description: 'Original cryptocurrency network'
  },
  ethereum: {
    name: 'Ethereum Network',
    symbol: 'ETH',
    icon: '⟠',
    color: 'from-blue-400 to-blue-600',
    bgColor: 'bg-blue-500/20',
    borderColor: 'border-blue-500/30',
    description: 'Smart contract platform'
  },
  binance: {
    name: 'Binance Smart Chain',
    symbol: 'BSC',
    icon: '🔶',
    color: 'from-yellow-400 to-yellow-600',
    bgColor: 'bg-yellow-500/20',
    borderColor: 'border-yellow-500/30',
    description: 'Fast and low-cost transactions'
  },
  polygon: {
    name: 'Polygon Network',
    symbol: 'MATIC',
    icon: '🔷',
    color: 'from-purple-400 to-purple-600',
    bgColor: 'bg-purple-500/20',
    borderColor: 'border-purple-500/30',
    description: 'Ethereum scaling solution'
  },
  solana: {
    name: 'Solana Network',
    symbol: 'SOL',
    icon: '☀️',
    color: 'from-purple-400 to-pink-600',
    bgColor: 'bg-purple-500/20',
    borderColor: 'border-purple-500/30',
    description: 'High-performance blockchain'
  },
  cardano: {
    name: 'Cardano Network',
    symbol: 'ADA',
    icon: '🔵',
    color: 'from-blue-400 to-cyan-600',
    bgColor: 'bg-blue-500/20',
    borderColor: 'border-blue-500/30',
    description: 'Research-driven blockchain'
  }
};

const TOKEN_CONFIG = {
  btc: {
    name: 'Bitcoin',
    symbol: 'BTC',
    icon: '₿',
    networks: ['bitcoin'],
    color: 'from-orange-400 to-orange-600',
    description: 'Digital gold'
  },
  eth: {
    name: 'Ethereum',
    symbol: 'ETH',
    icon: '⟠',
    networks: ['ethereum'],
    color: 'from-blue-400 to-blue-600',
    description: 'Smart contract platform token'
  },
  usdt: {
    name: 'Tether USD',
    symbol: 'USDT',
    icon: '💵',
    networks: ['ethereum', 'binance', 'polygon'],
    color: 'from-green-400 to-green-600',
    description: 'USD stablecoin'
  },
  usdc: {
    name: 'USD Coin',
    symbol: 'USDC',
    icon: '🪙',
    networks: ['ethereum', 'binance', 'polygon'],
    color: 'from-blue-400 to-blue-600',
    description: 'Regulated USD stablecoin'
  },
  bnb: {
    name: 'Binance Coin',
    symbol: 'BNB',
    icon: '🔶',
    networks: ['binance'],
    color: 'from-yellow-400 to-yellow-600',
    description: 'Binance exchange token'
  },
  ada: {
    name: 'Cardano',
    symbol: 'ADA',
    icon: '🔵',
    networks: ['cardano'],
    color: 'from-blue-400 to-cyan-600',
    description: 'Cardano native token'
  },
  sol: {
    name: 'Solana',
    symbol: 'SOL',
    icon: '☀️',
    networks: ['solana'],
    color: 'from-purple-400 to-pink-600',
    description: 'Solana native token'
  },
  matic: {
    name: 'Polygon',
    symbol: 'MATIC',
    icon: '🔷',
    networks: ['polygon'],
    color: 'from-purple-400 to-purple-600',
    description: 'Polygon native token'
  },
  busd: {
    name: 'Binance USD',
    symbol: 'BUSD',
    icon: '💰',
    networks: ['binance'],
    color: 'from-yellow-400 to-yellow-600',
    description: 'Binance USD stablecoin'
  },
  dai: {
    name: 'Dai Stablecoin',
    symbol: 'DAI',
    icon: '🏦',
    networks: ['ethereum'],
    color: 'from-orange-400 to-orange-600',
    description: 'Decentralized stablecoin'
  }
};

const PortfolioPage = () => {
  const [wallet, setWallet] = useState<UserWallet | null>(null);
  const [loading, setLoading] = useState(true);
  const [showTierSelection, setShowTierSelection] = useState(false);
  const [showNetworkSelection, setShowNetworkSelection] = useState(false);
  const [showTokenSelection, setShowTokenSelection] = useState(false);
  const [creatingWallet, setCreatingWallet] = useState(false);
  const [selectedTier, setSelectedTier] = useState<WalletTier | null>(null);
  const [selectedNetwork, setSelectedNetwork] = useState<NetworkType | null>(null);
  const [selectedToken, setSelectedToken] = useState<TokenType | null>(null);
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
  
  const supabase = createClient();
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const walletPollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const withdrawalPollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetchWalletData();
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
      // You might want to add error handling here
    } finally {
      setPortfolioLoading(false);
    }
  };
   // Calculate total portfolio value
   const calculateTotalPortfolioValue = () => {
    return stockPortfolio.reduce((total, item) => total + (item.current_value || 0), 0);
  };




  useEffect(() => {
    if (!wallet || wallet.status) return;

    // Start polling for wallet status updates
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
    }, 5000); // Poll every 5 seconds

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
    }, 10000); // Poll every 10 seconds
  };

  const handleTierSelection = (tier: WalletTier) => {
    setSelectedTier(tier);
    setShowTierSelection(false);
    setShowNetworkSelection(true);
  };

  const handleNetworkSelection = (network: NetworkType) => {
    setSelectedNetwork(network);
    setShowNetworkSelection(false);
    setShowTokenSelection(true);
  };

  const handleTokenSelection = (token: TokenType) => {
    setSelectedToken(token);
    setShowTokenSelection(false);
    if (selectedTier && selectedNetwork) {
      requestWalletAccount(selectedTier, selectedNetwork, token);
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
            createWallet(data.wallet_type, data.account_number, data.network, data.token_type);
          }
        }
      } catch (error) {
        console.error('Error polling for account :', error);
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
      
    } catch (error) {
      console.error('Error creating wallet:', error);
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

      // First subtract from wallet balance
      const { error: walletError } = await supabase
        .from('wallets')
        .update({ balance: wallet.balance - amount })
        .eq('id', wallet.id);

      if (walletError) throw walletError;

      // Create withdrawal record
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

      // Update local state
      setWithdrawals(prev => [data, ...prev]);
      setWallet(prev => prev ? { ...prev, balance: prev.balance - amount } : null);
      
      // Reset form
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
    setShowNetworkSelection(false);
    setShowTokenSelection(false);
    setSelectedTier(null);
    setSelectedNetwork(null);
    setSelectedToken(null);
  };

  const resetWalletCreation = () => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
    setAccountRequest(null);
    setGeneratingAccount(false);
    setWaitingForAccount(false);
    setCreatingWallet(false);
    resetSelections();
    setShowTierSelection(true);
  };

  const goBackToTierSelection = () => {
    setShowNetworkSelection(false);
    setShowTokenSelection(false);
    setSelectedNetwork(null);
    setSelectedToken(null);
    setShowTierSelection(true);
  };

  const goBackToNetworkSelection = () => {
    setShowTokenSelection(false);
    setSelectedToken(null);
    setShowNetworkSelection(true);
  };

  const getAvailableTokens = (network: NetworkType) => {
    return Object.entries(TOKEN_CONFIG).filter(([_, config]) => 
      config.networks.includes(network)
    );
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

  
  

  if (showNetworkSelection) {
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
              Choose Your Network
            </h1>
            <p className="text-slate-400 text-lg">
              Selected: {selectedTier && TIER_CONFIG[selectedTier].name}
            </p>
            <p className="text-slate-400">Select the blockchain network for your wallet</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.entries(NETWORK_CONFIG).map(([network, config]) => (
              <div
                key={network}
                className={`${config.bgColor} backdrop-blur-sm rounded-2xl p-6 border ${config.borderColor} hover:scale-105 transition-transform cursor-pointer group`}
                onClick={() => handleNetworkSelection(network as NetworkType)}
              >
                <div className="text-center">
                  <div className="text-6xl mb-4">{config.icon}</div>
                  <h3 className="text-xl font-bold mb-2">{config.name}</h3>
                  <p className="text-slate-400 text-sm mb-4">{config.description}</p>
                  <div className="text-lg font-bold mb-4 text-slate-300">
                    {config.symbol}
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
    const availableTokens = getAvailableTokens(selectedNetwork!);
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white py-9">
        <div className="max-w-6xl mx-auto p-4 md:p-6">
          <div className="text-center mb-8">
            <button
              onClick={goBackToNetworkSelection}
              className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-4 transition-colors"
            >
              <FiArrowLeft className="w-4 h-4" />
              Back to Network Selection
            </button>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent mb-4">
              Choose Your Token
            </h1>
            <p className="text-slate-400 text-lg">
              Tier: {selectedTier && TIER_CONFIG[selectedTier].name} • Network: {selectedNetwork && NETWORK_CONFIG[selectedNetwork].name}
            </p>
            <p className="text-slate-400">Select the token/cryptocurrency for your wallet</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {availableTokens.map(([token, config]) => (
              <div
                key={token}
                className={`bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 hover:scale-105 transition-transform cursor-pointer group hover:border-slate-600`}
                onClick={() => handleTokenSelection(token as TokenType)}
              > 
                <div className="text-center">
                  <div className="text-4xl mb-4">{config.icon}</div>
                  <h3 className="text-lg font-bold mb-2">{config.name}</h3>
                  <p className="text-slate-400 text-sm mb-4">{config.description}</p>
                  <div className="text-lg font-bold mb-4 text-slate-300">
                    {config.symbol}
                  </div>
                  <button className={`w-full bg-gradient-to-r ${config.color} text-white py-3 px-6 rounded-xl font-medium
                   hover:opacity-90 transition-opacity group-hover:shadow-lg`}>
                    Select {config.symbol}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (generatingAccount || waitingForAccount || creatingWallet) {
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
                    <strong>Network:</strong> {selectedNetwork && NETWORK_CONFIG[selectedNetwork].name}
                  </p>
                  <p className="text-sm text-slate-300">
                    <strong>Token:</strong> {selectedToken && TOKEN_CONFIG[selectedToken].name} ({selectedToken && TOKEN_CONFIG[selectedToken].symbol})
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
                      <th className="text-left p-4 text-slate-300 font-medium">Network</th>
                      <th className="text-left p-4 text-slate-300 font-medium">Token</th>
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
                          <p className="text-white font-medium">{NETWORK_CONFIG[withdrawal.network].name}</p>
                        </td>
                        <td className="p-4">
                          <p className="text-white font-medium">{TOKEN_CONFIG[withdrawal.token_type].symbol}</p>
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

              <div>
                <label className="block text-slate-400 mb-2">Network</label>
                <select
                  value={withdrawalNetwork || ''}
                  onChange={(e) => setWithdrawalNetwork(e.target.value as NetworkType)}
                  className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="">Select Network</option>
                  {Object.entries(NETWORK_CONFIG).map(([network, config]) => (
                    <option key={network} value={network}>
                      {config.name} ({config.symbol})
                    </option>
                  ))}
                </select>
              </div>

              {withdrawalNetwork && (
                <div>
                  <label className="block text-slate-400 mb-2">Token</label>
                  <select
                    value={withdrawalToken || ''}
                    onChange={(e) => setWithdrawalToken(e.target.value as TokenType)}
                    className="w-full bg-slate-700/50 border border-slate-600/50 
                    rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="">Select Token</option>
                    {getAvailableTokens(withdrawalNetwork).map(([token, config]) => (
                      <option key={token} value={token}>
                        {config.name} ({config.symbol})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-slate-400 mb-2">Account</label>
                <input
                  type="text"
                  value={withdrawalAccount}
                  onChange={(e) => setWithdrawalAccount(e.target.value)}
                  placeholder="Enter destination account "
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
                <p className="text-yellow-400 font-medium">Wallet Setup in Progress</p>
                <p className="text-sm text-slate-400">
                  Send ${TIER_CONFIG[wallet.tier].minimum.toLocaleString()} to account : 
                  <span className="font-mono font-bold text-white ml-2">{wallet.wallet_number}</span>
                </p>
                {wallet.network && wallet.token_type && (
                  <p className="text-sm text-slate-400 mt-1">
                    Network: {NETWORK_CONFIG[wallet.network].name} • Token: {TOKEN_CONFIG[wallet.token_type].name}
                  </p>
                )}
                <p className="text-xs text-yellow-400 mt-2">
                  Waiting for admin to confirm payment...
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Portfolio Summary Card */}
        <div className="bg-gradient-to-r from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl p-6 mb-6 md:mb-8 border border-slate-700/50 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-slate-400 text-base md:text-lg mb-2">Current Portfolio Value</p>
              <p className="text-2xl md:text-4xl font-bold text-white mb-2">
              ${calculateTotalPortfolioValue().toLocaleString()}
              </p>
              
              <div className={`flex items-center text-base md:text-lg ${
                (wallet?.performance_percentage || 0) >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {(wallet?.performance_percentage || 0) >= 0 ? (
                  <FiTrendingUp className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                ) : (
                  <FiTrendingDown className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                )}
                {(wallet?.performance_percentage || 0) >= 0 ? '+' : ''}
                {wallet?.performance_percentage?.toFixed(2) || '0.00'}%
                <span className="text-sm text-slate-400 ml-2">
                  (${wallet?.profit_loss.toLocaleString() || '0'})
                </span>
              </div>
            </div>
           
            <div className="p-3 md:p-4 bg-blue-600/20 rounded-xl">
              <FiDollarSign className="w-6 h-6 md:w-8 md:h-8 text-blue-400" />
            </div>
          </div>
          <div className="bg-slate-800/30 my-6 rounded-xl p-3 md:p-4 border border-slate-700/30">
              <p className="text-slate-400 text-xs md:text-sm mb-1">Account</p>
              <p className="text-lg md:text-xl font-bold text-white font-mono">
                {wallet?.wallet_number || 'N/A'}
              </p>
            </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6">
            <div className="bg-slate-800/30 rounded-xl p-3 md:p-4 border border-slate-700/30">
              <p className="text-slate-400 text-xs md:text-sm mb-1">Wallet Tier</p>
              <p className="text-lg md:text-xl font-bold text-white">
                {wallet ? TIER_CONFIG[wallet.tier].name : 'N/A'}
              </p>
            </div>
            <div className="bg-slate-800/30 rounded-xl p-3 md:p-4 border border-slate-700/30">
              <p className="text-slate-400 text-xs md:text-sm mb-1">Network</p>
              <p className="text-lg md:text-xl font-bold text-white">
                {wallet?.network ? NETWORK_CONFIG[wallet.network].name : 'N/A'}
              </p>
            </div>
            <div className="bg-slate-800/30 rounded-xl p-3 md:p-4 border border-slate-700/30">
              <p className="text-slate-400 text-xs md:text-sm mb-1">Token</p>
              <p className="text-lg md:text-xl font-bold text-white">
                {wallet?.token_type ? TOKEN_CONFIG[wallet.token_type].symbol : 'N/A'}
              </p>
            </div>
          
            <div className="bg-slate-800/30 rounded-xl p-3 md:p-4 border border-slate-700/30">
              <p className="text-slate-400 text-xs md:text-sm mb-1">Balance</p>
              <p className="text-lg md:text-xl font-bold text-white">
              ${wallet?.balance.toLocaleString() || '0'}
              </p>
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
            onClick={() => setActiveTab('withdrawals')}
            className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-xl font-medium transition-colors flex items-center gap-2"
          >
            <FiExternalLink className="w-4 h-4" />
            View Withdrawal History
          </button>
        </div>
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 overflow-hidden">
  <div className="p-6 border-b border-slate-700/50">
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Stock Portfolio</h2>
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
        <p className="text-sm mt-2">Your stock portfolio will appear here once you make investments</p>
      </div>
    </div>
  ) : (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-slate-700/50">
          <tr>
            <th className="text-left p-4 text-slate-300 font-medium">Asset</th>
            <th className="text-left p-4 text-slate-300 font-medium">Symbol</th>
            <th className="text-left p-4 text-slate-300 font-medium">Amount</th>
            <th className="text-left p-4 text-slate-300 font-medium">Avg Price</th>
            <th className="text-left p-4 text-slate-300 font-medium">Current Value</th>
            <th className="text-left p-4 text-slate-300 font-medium">Total Value</th>
            <th className="text-left p-4 text-slate-300 font-medium">P&L</th>
            <th className="text-left p-4 text-slate-300 font-medium">P&L %</th>
          </tr>
        </thead>
        <tbody>
          {stockPortfolio.map((item) => {
            const totalInvested = item.amount * item.average_price;
            const totalCurrentValue = item.amount * item.current_value;
            const profitLoss = totalCurrentValue - totalInvested;
            const profitLossPercentage = totalInvested > 0 ? (profitLoss / totalInvested) * 100 : 0;
            
            return (
              <tr key={item.id} className="border-t border-slate-700/50 hover:bg-slate-700/25">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    {item.image_url && (
                      <img 
                        src={item.image_url} 
                        alt={item.asset_name}
                        className="w-8 h-8 rounded-full"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    )}
                    <div>
                      <p className="text-white font-medium">{item.asset_name}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <p className="text-slate-300 font-mono font-medium">{item.asset}</p>
                </td>
                <td className="p-4">
                  <p className="text-white font-medium">{item.amount.toLocaleString()}</p>
                </td>
                <td className="p-4">
                  <p className="text-white font-medium">${item.average_price.toLocaleString()}</p>
                </td>
                <td className="p-4">
                  <p className="text-white font-medium">${item.current_value.toLocaleString()}</p>
                </td>
                <td className="p-4">
                  <p className="text-white font-medium">${totalCurrentValue.toLocaleString()}</p>
                </td>
                <td className="p-4">
                  <p className={`font-medium ${profitLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {profitLoss >= 0 ? '+' : ''}${profitLoss.toLocaleString()}
                  </p>
                </td>
                <td className="p-4">
                  <div className={`flex items-center gap-1 ${profitLossPercentage >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {profitLossPercentage >= 0 ? (
                      <FiTrendingUp className="w-4 h-4" />
                    ) : (
                      <FiTrendingDown className="w-4 h-4" />
                    )}
                    <span className="font-medium">
                      {profitLossPercentage >= 0 ? '+' : ''}{profitLossPercentage.toFixed(2)}%
                    </span>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  )}
</div>
        
      </div>
      


      
    </div>

    
  );

  
};

export default PortfolioPage;