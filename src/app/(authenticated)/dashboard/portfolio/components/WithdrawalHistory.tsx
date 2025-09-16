

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
  const [activeTab, setActiveTab] = useState<'withdrawals' | 'deposits'>('withdrawals');
  const [deposits, setDeposits] = useState<TransactionRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [searchEmail, setSearchEmail] = useState('');
  
  const supabase = createClient();

  useEffect(() => {
    if (activeTab === 'deposits') {
      fetchDeposits();
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

  const pendingWithdrawals = withdrawals.filter(w => !w.status).length;
  const completedWithdrawals = withdrawals.filter(w => w.status).length;
  const pendingDeposits = deposits.filter(d => !d.status).length;
  const completedDeposits = deposits.filter(d => d.status).length;

  const currentData = activeTab === 'withdrawals' ? filteredWithdrawals : filteredDeposits;
  const totalCount = activeTab === 'withdrawals' ? withdrawals.length : deposits.length;
  const pendingCount = activeTab === 'withdrawals' ? pendingWithdrawals : pendingDeposits;
  const completedCount = activeTab === 'withdrawals' ? completedWithdrawals : completedDeposits;

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
            {/* <button
              onClick={onNewWithdrawal}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <FiArrowUpRight className="w-4 h-4" />
              New Withdrawal
            </button> */}
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
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Total {activeTab === 'withdrawals' ? 'Withdrawals' : 'Deposits'}</p>
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

                <p className="text-slate-400 text-sm">{(activeTab === 'withdrawals' ? 'Total Amount withdrawn' : 'Total Amount Deposited ')}</p> 
                <p className="text-2xl font-bold text-white">
                  ${(activeTab === 'withdrawals' 
                    ? withdrawals.reduce((sum, w) => sum + w.amount, 0) 
                    : deposits.reduce((sum, d) => sum + d.amount, 0)
                  ).toLocaleString()}
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
            <p className="text-slate-400">Loading {activeTab}...</p>
          </div>
        ) : currentData.length === 0 ? (
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50 text-center">
            <div className="text-slate-400 mb-4">
              <FiEye className="w-12 h-12 mx-auto mb-2" />
              <p>No {activeTab} found</p>
              <p className="text-sm">
                {filter === 'pending' && `No pending ${activeTab} at the moment`}
                {filter === 'completed' && `No completed ${activeTab} found`}
                {filter === 'all' && `No ${activeTab} history yet`}
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
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-700/50">
                  <tr>
                    {activeTab === 'deposits' && (
                      <>
                        <th className="text-left p-4 text-slate-300 font-medium">User</th>
                        <th className="text-left p-4 text-slate-300 font-medium">Wallet Type</th>
                      
                      </>
                    )}
                                        <th className="text-left p-4 text-slate-300 font-medium">Amount</th>
                      {activeTab === 'deposits' && (
                      <>
                          <th className="text-left p-4 text-slate-300 font-medium">Amount Gain</th>
                      </>
                    )}

                   
                    {activeTab === 'withdrawals' && (
                      <>
                        <th className="text-left p-4 text-slate-300 font-medium">Token</th>
                        <th className="text-left p-4 text-slate-300 font-medium">Network</th>
                        <th className="text-left p-4 text-slate-300 font-medium">Account</th>
                      
                      </>
                    )}
                    <th className="text-left p-4 text-slate-300 font-medium">Status</th>
                    <th className="text-left p-4 text-slate-300 font-medium">Date</th>
                    <th className="text-left p-4 text-slate-300 font-medium"></th>
                  </tr>
                </thead>
                <tbody>
                  {currentData.map((item) => {
                    const isExpanded = expandedRows.has(item.id);
                    const isDeposit = activeTab === 'deposits';
                    const deposit = isDeposit ? item as TransactionRequest : null;
                    const withdrawal = !isDeposit ? item as WithdrawalRequest : null;

                    return (
                      <React.Fragment key={item.id}>
                        <tr className="border-t border-slate-700/50 hover:bg-slate-700/25">
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
                            </>
                          )}
                          <td className="p-4">
                            <p className="text-white font-medium">${item.amount.toLocaleString()}</p>
                            
                          </td>
                             {isDeposit && deposit && (
                           <td className="p-4">
   
                            <p className="text-green-600 font-medium">+${deposit.added_amount?.toLocaleString()}</p>
                            
                          </td>
                             )}
                          {withdrawal && (
                            <>
                              <td className="p-4">
                                <p className="text-white font-medium">{withdrawal.token_type.toUpperCase()}</p>
                              </td>
                              <td className="p-4">
                                <p className="text-white font-medium">{NETWORK_CONFIG[withdrawal.network].name}</p>
                              </td>
                              <td className="p-4">
                                <p className="font-mono text-slate-300 text-sm break-all">{withdrawal.account_number}</p>
                              </td>
                            </>
                          )}
                          <td className="p-4">
                            {item.status ? (
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
                            <p className="text-slate-400 text-sm">{formatDate(item.created_at)}</p>
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
                        </tr>
                        {isExpanded && (
                          <tr className="bg-slate-700/10 border-b border-slate-700/30">
                            <td colSpan={isDeposit ? 7 : 6} className="p-4">
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
          </div>
        )}
      </div>
    </div>
  );
};

export default WithdrawalHistory;