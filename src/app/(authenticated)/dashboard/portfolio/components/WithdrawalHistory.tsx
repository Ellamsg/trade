
import React, { useState, useEffect } from 'react';
import { FiArrowUpRight, FiExternalLink, FiCheck, FiClock, FiDollarSign, FiUser, FiChevronDown, FiChevronUp, FiEye } from 'react-icons/fi';
import { WithdrawalRequest, TransactionRequest, NETWORK_CONFIG, TIER_CONFIG } from '@/app/data';
import { createClient } from '@/app/utils/supabase/clients';

interface WithdrawalHistoryProps {
  withdrawals: WithdrawalRequest[];
  onBackToPortfolio: () => void;
  onNewWithdrawal: () => void;
}

const WithdrawalHistory: React.FC<WithdrawalHistoryProps> = ({
  withdrawals,
  onBackToPortfolio,
  onNewWithdrawal
}) => {
  const [activeTab, setActiveTab] = useState<'withdrawals' | 'deposits' | 'depositsHistory'>('withdrawals');
  const [deposits, setDeposits] = useState<TransactionRequest[]>([]);
  const [depositsHistory, setDepositsHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [searchEmail, setSearchEmail] = useState('');
  
  const supabase = createClient();

  useEffect(() => {
    if (activeTab === 'deposits') {
      fetchDeposits();
    } else if (activeTab === 'depositsHistory') {
      fetchDepositsHistory();
    }
  }, [activeTab]);

  const fetchDeposits = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('email', user.email!)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDeposits(data || []);
    } catch (error) {
      console.error('Error fetching deposits:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDepositsHistory = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('add_new_deposit')
        .select('*')
        .eq('email', user.email!)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDepositsHistory(data || []);
    } catch (error) {
      console.error('Error fetching deposits history:', error);
    } finally {
      setLoading(false);
    }
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

  const toggleRowExpand = (id: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  const filteredWithdrawals = withdrawals.filter(withdrawal => {
    const matchesFilter = filter === 'all' || 
      (filter === 'pending' && !withdrawal.status) ||
      (filter === 'completed' && withdrawal.status);
    
    const matchesSearch = !searchEmail || 
      withdrawal.email.toLowerCase().includes(searchEmail.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const filteredDeposits = deposits.filter(deposit => {
    const matchesFilter = filter === 'all' || 
      (filter === 'pending' && !deposit.status) ||
      (filter === 'completed' && deposit.status);
    
    return matchesFilter;
  });

  const filteredDepositsHistory = depositsHistory.filter(deposit => {
    const matchesFilter = filter === 'all' || 
      (filter === 'pending' && !deposit.status) ||
      (filter === 'completed' && deposit.status);
    
    return matchesFilter;
  });

  const pendingWithdrawals = withdrawals.filter(w => !w.status).length;
  const completedWithdrawals = withdrawals.filter(w => w.status).length;
  const pendingDeposits = deposits.filter(d => !d.status).length;
  const completedDeposits = deposits.filter(d => d.status).length;
  const pendingDepositsHistory = depositsHistory.filter(d => !d.status).length;
  const completedDepositsHistory = depositsHistory.filter(d => d.status).length;

  const getCurrentTabData = () => {
    switch (activeTab) {
      case 'withdrawals': return filteredWithdrawals;
      case 'deposits': return filteredDeposits;
      case 'depositsHistory': return filteredDepositsHistory;
      default: return [];
    }
  };

  const getTotalCount = () => {
    switch (activeTab) {
      case 'withdrawals': return withdrawals.length;
      case 'deposits': return deposits.length;
      case 'depositsHistory': return depositsHistory.length;
      default: return 0;
    }
  };

  const getPendingCount = () => {
    switch (activeTab) {
      case 'withdrawals': return pendingWithdrawals;
      case 'deposits': return pendingDeposits;
      case 'depositsHistory': return pendingDepositsHistory;
      default: return 0;
    }
  };

  const getCompletedCount = () => {
    switch (activeTab) {
      case 'withdrawals': return completedWithdrawals;
      case 'deposits': return completedDeposits;
      case 'depositsHistory': return completedDepositsHistory;
      default: return 0;
    }
  };

  const getTotalAmount = () => {
    switch (activeTab) {
      case 'withdrawals': return withdrawals.reduce((sum, w) => sum + w.amount, 0);
      case 'deposits': return deposits.reduce((sum, d) => sum + d.amount, 0);
      case 'depositsHistory': return depositsHistory.reduce((sum, d) => sum + d.deposit, 0);
      default: return 0;
    }
  };

  const getTabLabel = () => {
    switch (activeTab) {
      case 'withdrawals': return 'Withdrawals';
      case 'deposits': return 'Deposits';
      case 'depositsHistory': return 'Deposits History';
      default: return '';
    }
  };

  const currentData = getCurrentTabData();
  const totalCount = getTotalCount();
  const pendingCount = getPendingCount();
  const completedCount = getCompletedCount();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white py-9">
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent mb-2">
              Transaction History
            </h1>
            <p className="text-slate-400">View your transaction history</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={onBackToPortfolio}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            > 
              Back to Portfolio 
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex bg-slate-800/50 rounded-lg p-1 border border-slate-700/50 mb-6">
          <button
            onClick={() => setActiveTab('withdrawals')}
            className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors ${
              activeTab === 'withdrawals'
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Withdrawals
          </button>
          <button
            onClick={() => setActiveTab('deposits')}
            className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors ${
              activeTab === 'deposits'
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Deposits
          </button>
          <button
            onClick={() => setActiveTab('depositsHistory')}
            className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors ${
              activeTab === 'depositsHistory'
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Deposits History
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Total {getTabLabel()}</p>
                <p className="text-2xl font-bold text-white">{totalCount}</p>
              </div>
              <FiDollarSign className="w-8 h-8 text-blue-400" />
            </div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Pending</p>
                <p className="text-2xl font-bold text-yellow-400">{pendingCount}</p>
              </div>
              <FiClock className="w-8 h-8 text-yellow-400" />
            </div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Completed</p>
                <p className="text-2xl font-bold text-green-400">{completedCount}</p>
              </div>
              <FiCheck className="w-8 h-8 text-green-400" />
            </div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">
                  {activeTab === 'withdrawals' ? 'Total Amount Withdrawn' : 
                   activeTab === 'deposits' ? 'Total Amount Deposited' : 
                   'Total Deposit Amount'}
                </p> 
                <p className="text-2xl font-bold text-white">
                  ${getTotalAmount().toLocaleString()}
                </p>
              </div>
              <FiExternalLink className="w-8 h-8 text-purple-400" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex bg-slate-800/50 rounded-lg p-1 border border-slate-700/50 mb-6">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              filter === 'all'
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All ({totalCount})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              filter === 'pending'
                ? 'bg-yellow-600 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Pending ({pendingCount})
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              filter === 'completed'
                ? 'bg-green-600 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Completed ({completedCount})
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-8 border border-slate-700/50 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto mb-4"></div>
            <p className="text-slate-400">Loading {getTabLabel().toLowerCase()}...</p>
          </div>
        ) : currentData.length === 0 ? (
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50 text-center">
            <div className="text-slate-400 mb-4">
              <FiEye className="w-12 h-12 mx-auto mb-2" />
              <p>No {getTabLabel().toLowerCase()} found</p>
              <p className="text-sm">
                {filter === 'pending' && `No pending ${getTabLabel().toLowerCase()} at the moment`}
                {filter === 'completed' && `No completed ${getTabLabel().toLowerCase()} found`}
                {filter === 'all' && `No ${getTabLabel().toLowerCase()} yet`}
              </p>
            </div>
            {activeTab === 'withdrawals' && (
              <button
                onClick={onBackToPortfolio}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-medium transition-colors flex items-center gap-2 mx-auto"
              >
                <FiArrowUpRight className="w-4 h-4" />
                Request Withdrawal
              </button>
            )}
          </div>
        ) : (
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 overflow-hidden">
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-700/50">
                  <tr>
                    {/* Deposits History columns */}
                    {activeTab === 'depositsHistory' && (
                      <>
                        <th className="text-left p-4 text-slate-300 font-medium">Amount</th>
                        <th className="text-left p-4 text-slate-300 font-medium">Status</th>
                        <th className="text-left p-4 text-slate-300 font-medium">Date</th>
                      </>
                    )}
                    {/* Regular Deposits columns */}
                    {activeTab === 'deposits' && (
                      <>
                        <th className="text-left p-4 text-slate-300 font-medium">User</th>
                        <th className="text-left p-4 text-slate-300 font-medium">Wallet Type</th>
                        <th className="text-left p-4 text-slate-300 font-medium">Amount</th>
                       
                        <th className="text-left p-4 text-slate-300 font-medium">Status</th>
                        <th className="text-left p-4 text-slate-300 font-medium">Date</th>
                        <th className="text-left p-4 text-slate-300 font-medium"></th>
                      </>
                    )}
                    {/* Withdrawals columns */}
                    {activeTab === 'withdrawals' && (
                      <>
                        <th className="text-left p-4 text-slate-300 font-medium">Amount</th>
                        <th className="text-left p-4 text-slate-300 font-medium">Token</th>
                        <th className="text-left p-4 text-slate-300 font-medium">Network</th>
                        <th className="text-left p-4 text-slate-300 font-medium">Account</th>
                        <th className="text-left p-4 text-slate-300 font-medium">Status</th>
                        <th className="text-left p-4 text-slate-300 font-medium">Date</th>
                        <th className="text-left p-4 text-slate-300 font-medium"></th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {currentData.map((item) => {
                    const isExpanded = expandedRows.has(item.id);
                    const isDeposit = activeTab === 'deposits';
                    const isDepositHistory = activeTab === 'depositsHistory';
                    const deposit = isDeposit ? item as TransactionRequest : null;
                    const withdrawal = activeTab === 'withdrawals' ? item as WithdrawalRequest : null;
                    const depositHistory = isDepositHistory ? item as any : null;

                    return (
                      <React.Fragment key={item.id}>
                        <tr className="border-t border-slate-700/50 hover:bg-slate-700/25">
                          {/* Deposits History Row */}
                          {isDepositHistory && depositHistory && (
                            <>
                              <td className="p-4">
                                <p className="text-green-600 font-medium">+${depositHistory.deposit.toLocaleString()}</p>
                              </td>
                              <td className="p-4">
                                {depositHistory.status ? (
                                  <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 w-fit">
                                    <FiCheck className="w-3 h-3" />
                                    Completed
                                  </span>
                                ) : (
                                  <span className="bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 w-fit">
                                    <FiClock className="w-3 h-3" />
                                    Pending
                                  </span>
                                )}
                              </td>
                              <td className="p-4">
                                <p className="text-slate-400 text-sm">{formatDate(depositHistory.created_at)}</p>
                              </td>
                            </>
                          )}
                          
                          {/* Regular Deposits Row */}
                          {isDeposit && deposit && (
                            <>
                              <td className="p-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 bg-slate-600 rounded-full flex items-center justify-center">
                                    <FiUser className="w-5 h-5 text-slate-300" />
                                  </div>
                                  <div>
                                    <p className="text-white font-medium">{deposit.email}</p>
                                    <p className="text-slate-400 text-sm">ID: {deposit.id}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="p-4">
                                <div className="flex items-center gap-2">
                                  <span className="text-2xl">{TIER_CONFIG[deposit.wallet_type].icon}</span>
                                  <div>
                                    <p className="font-medium">{TIER_CONFIG[deposit.wallet_type].name}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="p-4">
                                <p className="text-white font-medium">${deposit.amount.toLocaleString()}</p>
                              </td>
                          
                              <td className="p-4">
                                {deposit.status ? (
                                  <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 w-fit">
                                    <FiCheck className="w-3 h-3" />
                                    Completed
                                  </span>
                                ) : (
                                  <span className="bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 w-fit">
                                    <FiClock className="w-3 h-3" />
                                    Pending
                                  </span>
                                )}
                              </td>
                              <td className="p-4">
                                <p className="text-slate-400 text-sm">{formatDate(deposit.created_at)}</p>
                              </td>
                              <td className="p-4">
                                <button
                                  onClick={() => toggleRowExpand(item.id)}
                                  className="text-slate-400 hover:text-white transition-colors"
                                >
                                  {isExpanded ? (
                                    <FiChevronUp className="w-4 h-4" />
                                  ) : (
                                    <FiChevronDown className="w-4 h-4" />
                                  )}
                                </button>
                              </td>
                            </>
                          )}

                          {/* Withdrawals Row */}
                          {withdrawal && (
                            <>
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
                                <p className="font-mono text-slate-300 text-sm break-all">{withdrawal.account_number}</p>
                              </td>
                              <td className="p-4">
                                {withdrawal.status ? (
                                  <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 w-fit">
                                    <FiCheck className="w-3 h-3" />
                                    Completed
                                  </span>
                                ) : (
                                  <span className="bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 w-fit">
                                    <FiClock className="w-3 h-3" />
                                    Pending
                                  </span>
                                )}
                              </td>
                              <td className="p-4">
                                <p className="text-slate-400 text-sm">{formatDate(withdrawal.created_at)}</p>
                              </td>
                              <td className="p-4">
                                <button
                                  onClick={() => toggleRowExpand(item.id)}
                                  className="text-slate-400 hover:text-white transition-colors"
                                >
                                  {isExpanded ? (
                                    <FiChevronUp className="w-4 h-4" />
                                  ) : (
                                    <FiChevronDown className="w-4 h-4" />
                                  )}
                                </button>
                              </td>
                            </>
                          )}
                        </tr>

                        {/* Expandable Details - Only for regular deposits and withdrawals */}
                        {isExpanded && !isDepositHistory && (
                          <tr className="bg-slate-700/10 border-b border-slate-700/30">
                            <td colSpan={isDeposit ? 7 : 7} className="p-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-16">
                                <div className="space-y-2">
                                  <h4 className="font-medium text-slate-300">
                                    {isDeposit ? 'Deposit' : 'Withdrawal'} Details
                                  </h4>
                                  <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                      <span className="text-slate-400">Token/Network:</span>
                                      <span className="text-white">
                                        {item.token_type} ({item.network})
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <span className="text-slate-400">Created:</span>
                                      <span className="text-slate-300">{formatDate(item.created_at)}</span>
                                    </div>
                                    {item.status && withdrawal && withdrawal.updated_at && (
                                      <div className="flex items-center gap-2">
                                        <span className="text-slate-400">Completed:</span>
                                        <span className="text-slate-300">{formatDate(withdrawal.updated_at)}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <h4 className="font-medium text-slate-300">
                                    {isDeposit ? 'Wallet Assignment' : 'Wallet Address'}
                                  </h4>
                                  <div className="flex items-center gap-2">
                                    {deposit && deposit.account_number ? (
                                      <span className="font-mono text-green-400 break-all">
                                        {deposit.account_number}
                                      </span>
                                    ) : deposit && !deposit.account_number ? (
                                      <span className="text-slate-400">Not assigned</span>
                                    ) : withdrawal ? (
                                      <span className="font-mono text-slate-300 break-all">
                                        {withdrawal.account_number}
                                      </span>
                                    ) : null}
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden">
              {currentData.map((item) => {
                const isExpanded = expandedRows.has(item.id);
                const isDeposit = activeTab === 'deposits';
                const isDepositHistory = activeTab === 'depositsHistory';
                const deposit = isDeposit ? item as TransactionRequest : null;
                const withdrawal = activeTab === 'withdrawals' ? item as WithdrawalRequest : null;
                const depositHistory = isDepositHistory ? item as any : null;

                return (
                  <div key={item.id} className="border-b border-slate-700/50">
                    <div className="p-4">
                      {/* Main Info Row */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center">
                              {isDeposit ? (
                                <span className="text-lg">{deposit && TIER_CONFIG[deposit.wallet_type].icon}</span>
                              ) : (
                                <FiDollarSign className="w-4 h-4 text-slate-300" />
                              )}
                            </div>
                            <div>
                              <p className="text-green-500 font-medium">
                                +${isDepositHistory && depositHistory ? depositHistory.deposit.toLocaleString() : 
                                  (item as any).amount?.toLocaleString()}
                              </p>
                              <p className="text-slate-400 text-xs">{formatDate(item.created_at)}</p>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              {item.status ? (
                                <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit">
                                  <FiCheck className="w-3 h-3" />
                                  Completed
                                </span>
                              ) : (
                                <span className="bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit">
                                  <FiClock className="w-3 h-3" />
                                  Pending
                                </span>
                              )}
                            </div>
                            {/* Only show expand button for deposits and withdrawals, not deposits history */}
                            {!isDepositHistory && (
                              <button
                                onClick={() => toggleRowExpand(item.id)}
                                className="text-slate-400 hover:text-white transition-colors p-1"
                              >
                                {isExpanded ? (
                                  <FiChevronUp className="w-5 h-5" />
                                ) : (
                                  <FiChevronDown className="w-5 h-5" />
                                )}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Expandable Details - Only for regular deposits and withdrawals */}
                    {isExpanded && !isDepositHistory && (
                      <div className="px-4 pb-4 border-t border-slate-700/30 bg-slate-700/10">
                        <div className="pt-4 space-y-4">
                          {/* Deposit specific details */}
                          {isDeposit && deposit && (
                            <>
                              <div className="grid grid-cols-1 gap-3">
                                <div>
                                  <span className="text-slate-400 text-sm">User:</span>
                                  <p className="text-white font-medium">{deposit.email}</p>
                                </div>
                                <div>
                                  <span className="text-slate-400 text-sm">Wallet Type:</span>
                                  <p className="text-white font-medium flex items-center gap-2">
                                    <span className="text-lg">{TIER_CONFIG[deposit.wallet_type].icon}</span>
                                    {TIER_CONFIG[deposit.wallet_type].name}
                                  </p>
                                </div>
                            
                                <div>
                                  <span className="text-slate-400 text-sm">Wallet Assignment:</span>
                                  <p className="text-white font-mono text-sm break-all">
                                    {deposit.account_number || 'Not assigned'}
                                  </p>
                                </div>
                              </div>
                            </>
                          )}

                          {/* Withdrawal specific details */}
                          {withdrawal && (
                            <>
                              <div className="grid grid-cols-1 gap-3">
                                <div>
                                  <span className="text-slate-400 text-sm">Token:</span>
                                  <p className="text-white font-medium">{withdrawal.token_type.toUpperCase()}</p>
                                </div>
                                <div>
                                  <span className="text-slate-400 text-sm">Network:</span>
                                  <p className="text-white font-medium">{NETWORK_CONFIG[withdrawal.network].name}</p>
                                </div>
                                <div>
                                  <span className="text-slate-400 text-sm">Wallet Address:</span>
                                  <p className="text-white font-mono text-sm break-all">{withdrawal.account_number}</p>
                                </div>
                              </div>
                            </>
                          )}

                          {/* Common details */}
                          <div className="grid grid-cols-1 gap-3 pt-2 border-t border-slate-700/30">
                            <div>
                              <span className="text-slate-400 text-sm">Token/Network:</span>
                              <p className="text-white">{item.token_type} ({item.network})</p>
                            </div>
                            <div>
                              <span className="text-slate-400 text-sm">Transaction ID:</span>
                              <p className="text-slate-300 text-sm">{item.id}</p>
                            </div>
                            {item.status && withdrawal && withdrawal.updated_at && (
                              <div>
                                <span className="text-slate-400 text-sm">Completed:</span>
                                <p className="text-slate-300">{formatDate(withdrawal.updated_at)}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WithdrawalHistory;