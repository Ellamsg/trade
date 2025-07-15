
// "use client"
// import React, { useState, useEffect } from 'react';
// import { FiUser, FiMail, FiDollarSign, FiClock, FiEdit3, FiSave, FiX, FiCheck, FiEye, FiRefreshCw, FiExternalLink } from 'react-icons/fi';
// import { createClient } from '@/app/utils/supabase/clients';

// type WalletTier = 
//   | 'basic' 
//   | 'standard' 
//   | 'premium' 
//   | 'gold' 
//   | 'platinum' 
//   | 'diamond' 
//   | 'elite';


// type TransactionRequest = {
//   id: string;
//   email: string;
//   amount: number;
//   wallet_type: WalletTier;
//   account_number: string | null;
//   status: boolean;
//   created_at: string;
//   network: string;
//   token_type: string;
// };

// type WithdrawalRequest = {
//   id: string;
//   user_id: string;
//   wallet_id: string;
//   email: string;
//   amount: number;
//   network: string;
//   token_type: string;
//   account_number: string;
//   status: boolean;
//   created_at: string;
//   updated_at: string;
// };

// const TIER_CONFIG = {
//   basic: {
//     name: 'Basic Wallet',
//     minimum: 1000,
//     color: 'from-gray-300 to-gray-400',
//     bgColor: 'bg-gray-400/20',
//     borderColor: 'border-gray-400/30',
//     icon: '🟦',
//     textColor: 'text-gray-400',
//   },
//   standard: {
//     name: 'Standard Wallet',
//     minimum: 10000,
//     color: 'from-blue-400 to-blue-600',
//     bgColor: 'bg-blue-500/20',
//     borderColor: 'border-blue-500/30',
//     icon: '🟪',
//     textColor: 'text-blue-400',
//   },
//   premium: {
//     name: 'Premium Wallet',
//     minimum: 20000,
//     color: 'from-purple-400 to-purple-600',
//     bgColor: 'bg-purple-500/20',
//     borderColor: 'border-purple-500/30',
//     icon: '🟣',
//     textColor: 'text-purple-400',
//   },
//   gold: {
//     name: 'Gold Wallet',
//     minimum: 50000,
//     color: 'from-yellow-400 to-yellow-600',
//     bgColor: 'bg-yellow-500/20',
//     borderColor: 'border-yellow-500/30',
//     icon: '🟨',
//     textColor: 'text-yellow-400',
//   },
//   platinum: {
//     name: 'Platinum Wallet',
//     minimum: 100000,
//     color: 'from-slate-400 to-slate-600',
//     bgColor: 'bg-slate-500/20',
//     borderColor: 'border-slate-500/30',
//     icon: '⬜️',
//     textColor: 'text-slate-400',
//   },
//   diamond: {
//     name: 'Diamond Wallet',
//     minimum: 500000,
//     color: 'from-indigo-400 to-indigo-700',
//     bgColor: 'bg-indigo-500/20',
//     borderColor: 'border-indigo-500/30',
//     icon: '🔷',
//     textColor: 'text-indigo-400',
//   },
//   elite: {
//     name: 'Elite Wallet',
//     minimum: 1000000,
//     color: 'from-emerald-500 to-emerald-700',
//     bgColor: 'bg-emerald-500/20',
//     borderColor: 'border-emerald-500/30',
//     icon: '💎',
//     textColor: 'text-emerald-500',
//   }
// };

// const AdminTransactionsPage = () => {
//   const [transactions, setTransactions] = useState<TransactionRequest[]>([]);
//   const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [editingId, setEditingId] = useState<string | null>(null);
//   const [editAccountNumber, setEditAccountNumber] = useState('');
//   const [updatingId, setUpdatingId] = useState<string | null>(null);
//   const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
//   const [searchEmail, setSearchEmail] = useState('');
//   const [activeTab, setActiveTab] = useState<'deposits' | 'withdrawals'>('deposits');
  
//   const supabase = createClient();

//   useEffect(() => {
//     fetchTransactions();
//     fetchWithdrawals();
//   }, []);

//   const fetchTransactions = async () => {
//     try {
//       setLoading(true);
//       const { data, error } = await supabase
//         .from('transactions')
//         .select('*')
//         .order('created_at', { ascending: false });

//       if (error) throw error;
//       setTransactions(data || []);
//     } catch (error) {
//       console.error('Error fetching transactions:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchWithdrawals = async () => {
//     try {
//       const { data, error } = await supabase
//         .from('withdrawals')
//         .select('*')
//         .order('created_at', { ascending: false });

//       if (error) throw error;
//       setWithdrawals(data || []);
//     } catch (error) {
//       console.error('Error fetching withdrawals:', error);
//     }
//   };

//   const updateAccountNumber = async (transactionId: string, accountNumber: string) => {
//     try {
//       setUpdatingId(transactionId);
      
//       const { data, error } = await supabase
//         .from('transactions')
//         .update({ account_number: accountNumber })
//         .eq('id', transactionId)
//         .select()
//         .single();

//       if (error) throw error;

//       setTransactions(prev => 
//         prev.map(transaction => 
//           transaction.id === transactionId 
//             ? { ...transaction, account_number: accountNumber }
//             : transaction
//         )
//       );

//       setEditingId(null);
//       setEditAccountNumber('');
      
//     } catch (error) {
//       console.error('Error updating account number:', error);
//     } finally {
//       setUpdatingId(null);
//     }
//   };

//   const updateWalletStatus = async (walletNumber: string, status: boolean) => {
//     try {
//       const { data, error } = await supabase
//         .from('wallets')
//         .update({ status, balance: TIER_CONFIG[transactions.find(t => t.account_number === walletNumber)?.wallet_type || 'basic'].minimum })
//         .eq('wallet_number', walletNumber)
//         .select()
//         .single();

//       if (error) throw error;

//       // Also update the transaction status
//       const { error: transactionError } = await supabase
//         .from('transactions')
//         .update({ status })
//         .eq('account_number', walletNumber);

//       if (transactionError) throw transactionError;

//       // Update local state
//       setTransactions(prev =>
//         prev.map(t =>
//           t.account_number === walletNumber ? { ...t, status } : t
//         )
//       );

//       return data;
//     } catch (error) {
//       console.error('Error updating wallet status:', error);
//       throw error;
//     }
//   };

//   const updateWithdrawalStatus = async (withdrawalId: string, status: boolean) => {
//     try {
//       const { data, error } = await supabase
//         .from('withdrawals')
//         .update({ status, updated_at: new Date().toISOString() })
//         .eq('id', withdrawalId)
//         .select()
//         .single();

//       if (error) throw error;

//       setWithdrawals(prev =>
//         prev.map(w =>
//           w.id === withdrawalId ? { ...w, status, updated_at: data.updated_at } : w
//         )
//       );

//       return data;
//     } catch (error) {
//       console.error('Error updating withdrawal status:', error);
//       throw error;
//     }
//   };

//   const startEditing = (transaction: TransactionRequest) => {
//     setEditingId(transaction.id);
//     setEditAccountNumber(transaction.account_number || '');
//   };

//   const cancelEditing = () => {
//     setEditingId(null);
//     setEditAccountNumber('');
//   };

//   const handleSave = (transactionId: string) => {
//     if (editAccountNumber.trim()) {
//       updateAccountNumber(transactionId, editAccountNumber.trim());
//     }
//   };

//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   const filteredTransactions = transactions.filter(transaction => {
//     const matchesFilter = filter === 'all' || 
//       (filter === 'pending' && !transaction.status) ||
//       (filter === 'completed' && transaction.status);
    
//     const matchesSearch = !searchEmail || 
//       transaction.email.toLowerCase().includes(searchEmail.toLowerCase());
    
//     return matchesFilter && matchesSearch;
//   });

//   const filteredWithdrawals = withdrawals.filter(withdrawal => {
//     const matchesFilter = filter === 'all' || 
//       (filter === 'pending' && !withdrawal.status) ||
//       (filter === 'completed' && withdrawal.status);
    
//     const matchesSearch = !searchEmail || 
//       withdrawal.email.toLowerCase().includes(searchEmail.toLowerCase());
    
//     return matchesFilter && matchesSearch;
//   });

//   const pendingDepositCount = transactions.filter(t => !t.status).length;
//   const completedDepositCount = transactions.filter(t => t.status).length;
//   const pendingWithdrawalCount = withdrawals.filter(w => !w.status).length;
//   const completedWithdrawalCount = withdrawals.filter(w => w.status).length;

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
//           <p className="text-slate-400">Loading transactions...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white py-6">
//       <div className="max-w-7xl mx-auto p-4 md:p-6">
//         {/* Header */}
//         <div className="mb-8">
//           <div className="flex items-center justify-between mb-6">
//             <div>
//               <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent mb-2">
//                 Transaction Management
//               </h1>
//               <p className="text-slate-400">Manage wallet creation and withdrawal requests</p>
//             </div>
//             <button
//               onClick={() => {
//                 if (activeTab === 'deposits') fetchTransactions();
//                 else fetchWithdrawals();
//               }}
//               className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
//             >
//               <FiRefreshCw className="w-4 h-4" />
//               Refresh
//             </button>
//           </div>

//           {/* Tabs */}
//           <div className="flex bg-slate-800/50 rounded-lg p-1 border border-slate-700/50 mb-6">
//             <button
//               onClick={() => setActiveTab('deposits')}
//               className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors ${
//                 activeTab === 'deposits'
//                   ? 'bg-blue-600 text-white'
//                   : 'text-slate-400 hover:text-white'
//               }`}
//             >
//               Deposit Requests
//             </button>
//             <button
//               onClick={() => setActiveTab('withdrawals')}
//               className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors ${
//                 activeTab === 'withdrawals'
//                   ? 'bg-blue-600 text-white'
//                   : 'text-slate-400 hover:text-white'
//               }`}
//             >
//               Withdrawal Requests
//             </button>
//           </div>

//           {/* Stats Cards */}
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
//             <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-slate-400 text-sm">Total {activeTab === 'deposits' ? 'Deposits' : 'Withdrawals'}</p>
//                   <p className="text-2xl font-bold text-white">
//                     {activeTab === 'deposits' ? transactions.length : withdrawals.length}
//                   </p>
//                 </div>
//                 <FiDollarSign className="w-8 h-8 text-blue-400" />
//               </div>
//             </div>
//             <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-slate-400 text-sm">Pending</p>
//                   <p className="text-2xl font-bold text-yellow-400">
//                     {activeTab === 'deposits' ? pendingDepositCount : pendingWithdrawalCount}
//                   </p>
//                 </div>
//                 <FiClock className="w-8 h-8 text-yellow-400" />
//               </div>
//             </div>
//             <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-slate-400 text-sm">Completed</p>
//                   <p className="text-2xl font-bold text-green-400">
//                     {activeTab === 'deposits' ? completedDepositCount : completedWithdrawalCount}
//                   </p>
//                 </div>
//                 <FiCheck className="w-8 h-8 text-green-400" />
//               </div>
//             </div>
//             <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-slate-400 text-sm">Total Amount</p>
//                   <p className="text-2xl font-bold text-white">
//                     ${(activeTab === 'deposits' 
//                       ? transactions.reduce((sum, t) => sum + t.amount, 0) 
//                       : withdrawals.reduce((sum, w) => sum + w.amount, 0)
//                     ).toLocaleString()}
//                   </p>
//                 </div>
//                 <FiExternalLink className="w-8 h-8 text-purple-400" />
//               </div>
//             </div>
//           </div>

//           {/* Filters */}
//           <div className="flex flex-col md:flex-row gap-4 mb-6">
//             <div className="flex bg-slate-800/50 rounded-lg p-1 border border-slate-700/50">
//               <button
//                 onClick={() => setFilter('all')}
//                 className={`px-4 py-2 rounded-md font-medium transition-colors ${
//                   filter === 'all'
//                     ? 'bg-blue-600 text-white'
//                     : 'text-slate-400 hover:text-white'
//                 }`}
//               >
//                 All ({activeTab === 'deposits' ? transactions.length : withdrawals.length})
//               </button>
//               <button
//                 onClick={() => setFilter('pending')}
//                 className={`px-4 py-2 rounded-md font-medium transition-colors ${
//                   filter === 'pending'
//                     ? 'bg-yellow-600 text-white'
//                     : 'text-slate-400 hover:text-white'
//                 }`}
//               >
//                 Pending ({activeTab === 'deposits' ? pendingDepositCount : pendingWithdrawalCount})
//               </button>
//               <button
//                 onClick={() => setFilter('completed')}
//                 className={`px-4 py-2 rounded-md font-medium transition-colors ${
//                   filter === 'completed'
//                     ? 'bg-green-600 text-white'
//                     : 'text-slate-400 hover:text-white'
//                 }`}
//               >
//                 Completed ({activeTab === 'deposits' ? completedDepositCount : completedWithdrawalCount})
//               </button>
//             </div>
            
//             <div className="flex-1 max-w-md">
//               <input
//                 type="text"
//                 placeholder="Search by email..."
//                 value={searchEmail}
//                 onChange={(e) => setSearchEmail(e.target.value)}
//                 className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
//               />
//             </div>
//           </div>
//         </div>

//         {activeTab === 'deposits' ? (
//           /* Deposits Table */
//           <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 overflow-hidden">
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead className="bg-slate-700/50">
//                   <tr>
//                     <th className="text-left p-4 text-slate-300 font-medium">User</th>
//                     <th className="text-left p-4 text-slate-300 font-medium">Wallet Type</th>
//                     <th className="text-left p-4 text-slate-300 font-medium">Token Type</th>
//                     <th className="text-left p-4 text-slate-300 font-medium">Network</th>
//                     <th className="text-left p-4 text-slate-300 font-medium">Amount</th>
//                     <th className="text-left p-4 text-slate-300 font-medium">Account Number</th>
//                     <th className="text-left p-4 text-slate-300 font-medium">Status</th>
//                     <th className="text-left p-4 text-slate-300 font-medium">Payment Status</th>
//                     <th className="text-left p-4 text-slate-300 font-medium">Created</th>
//                     <th className="text-left p-4 text-slate-300 font-medium">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {filteredTransactions.map((transaction) => (
//                     <tr key={transaction.id} className="border-t border-slate-700/50 hover:bg-slate-700/25">
//                       <td className="p-4">
//                         <div className="flex items-center gap-3">
//                           <div className="w-10 h-10 bg-slate-600 rounded-full flex items-center justify-center">
//                             <FiUser className="w-5 h-5 text-slate-300" />
//                           </div>
//                           <div>
//                             <p className="text-white font-medium">{transaction.email}</p>
//                             <p className="text-slate-400 text-sm">ID: {transaction.id}</p>
//                           </div>
//                         </div>
//                       </td>
//                       <td className="p-4">
//                         <div className="flex items-center gap-2">
//                           <span className="text-2xl">{TIER_CONFIG[transaction.wallet_type].icon}</span>
//                           <div>
//                             <p className={`font-medium ${TIER_CONFIG[transaction.wallet_type].textColor}`}>
//                               {TIER_CONFIG[transaction.wallet_type].name}
//                             </p>
//                           </div>
//                         </div>
//                       </td>
//                       <td className="p-4">
//                         <p className="text-white font-medium">{transaction.token_type}</p>
//                       </td>
//                       <td className="p-4">
//                         <p className="text-white font-medium">{transaction.network}</p>
//                       </td>
//                       <td className="p-4">
//                         <p className="text-white font-medium">${transaction.amount.toLocaleString()}</p>
//                       </td>
//                       <td className="p-4">
//                         {editingId === transaction.id ? (
//                           <div className="flex items-center gap-2">
//                             <input
//                               type="text"
//                               value={editAccountNumber}
//                               onChange={(e) => setEditAccountNumber(e.target.value)}
//                               placeholder="Enter account number"
//                               className="bg-slate-700 border border-slate-600 rounded px-3 py-1 text-white text-sm focus:outline-none focus:border-blue-500"
//                             />
//                             <button
//                               onClick={() => handleSave(transaction.id)}
//                               disabled={updatingId === transaction.id}
//                               className="bg-green-600 hover:bg-green-700 text-white p-1 rounded disabled:opacity-50"
//                             >
//                               <FiSave className="w-4 h-4" />
//                             </button>
//                             <button
//                               onClick={cancelEditing}
//                               className="bg-slate-600 hover:bg-slate-700 text-white p-1 rounded"
//                             >
//                               <FiX className="w-4 h-4" />
//                             </button>
//                           </div>
//                         ) : (
//                           <div className="flex items-center gap-2">
//                             {transaction.account_number ? (
//                               <span className="font-mono text-green-400 font-medium">
//                                 {transaction.account_number}
//                               </span>
//                             ) : (
//                               <span className="text-slate-400">Not assigned</span>
//                             )}
//                           </div>
//                         )}
//                       </td>
//                       <td className="p-4">
//                         {transaction.account_number ? (
//                           <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded-full text-sm font-medium">
//                             Completed
//                           </span>
//                         ) : (
//                           <span className="bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full text-sm font-medium">
//                             Pending
//                           </span>
//                         )}
//                       </td>
//                       <td className="p-4">
//                         {transaction.account_number ? (
//                           <button
//                             onClick={async () => {
//                               try {
//                                 await updateWalletStatus(
//                                   transaction.account_number!,
//                                   !transaction.status
//                                 );
//                               } catch (error) {
//                                 console.error('Error updating payment status:', error);
//                               }
//                             }}
//                             className={`px-3 py-1 rounded text-sm font-medium transition-colors flex items-center gap-1 ${
//                               transaction.status
//                                 ? 'bg-green-600 hover:bg-green-700 text-white'
//                                 : 'bg-yellow-600 hover:bg-yellow-700 text-white'
//                             }`}
//                           >
//                             {transaction.status ? (
//                               <>
//                                 <FiCheck className="w-3 h-3" />
//                                 Paid
//                               </>
//                             ) : (
//                               <>
//                                 <FiClock className="w-3 h-3" />
//                                 Mark as Paid
//                               </>
//                             )}
//                           </button>
//                         ) : (
//                           <span className="text-slate-400 text-sm">N/A</span>
//                         )}
//                       </td>
//                       <td className="p-4">
//                         <p className="text-slate-400 text-sm">{formatDate(transaction.created_at)}</p>
//                       </td>
//                       <td className="p-4">
//                         {editingId === transaction.id ? (
//                           <div className="text-sm text-slate-400">
//                             {updatingId === transaction.id ? 'Saving...' : 'Editing...'}
//                           </div>
//                         ) : (
//                           <button
//                             onClick={() => startEditing(transaction)}
//                             className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors flex items-center gap-1"
//                           >
//                             <FiEdit3 className="w-3 h-3" />
//                             {transaction.account_number ? 'Edit' : 'Assign'}
//                           </button>
//                         )}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
            
//             {filteredTransactions.length === 0 && (
//               <div className="text-center py-12">
//                 <div className="text-slate-400 mb-4">
//                   <FiEye className="w-12 h-12 mx-auto mb-2" />
//                   <p>No deposit requests found</p>
//                   <p className="text-sm">
//                     {filter === 'pending' && 'No pending requests at the moment'}
//                     {filter === 'completed' && 'No completed requests found'}
//                     {filter === 'all' && searchEmail && `No results for "${searchEmail}"`}
//                   </p>
//                 </div>
//               </div>
//             )}
//           </div>
//         ) : (
//           /* Withdrawals Table */
//           <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 overflow-hidden">
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead className="bg-slate-700/50">
//                   <tr>
//                     <th className="text-left p-4 text-slate-300 font-medium">User</th>
//                     <th className="text-left p-4 text-slate-300 font-medium">Amount</th>
//                     <th className="text-left p-4 text-slate-300 font-medium">Network</th>
//                     <th className="text-left p-4 text-slate-300 font-medium">Token</th>
//                     <th className="text-left p-4 text-slate-300 font-medium">Account</th>
//                     <th className="text-left p-4 text-slate-300 font-medium">Status</th>
//                     <th className="text-left p-4 text-slate-300 font-medium">Created</th>
//                     <th className="text-left p-4 text-slate-300 font-medium">Updated</th>
//                     <th className="text-left p-4 text-slate-300 font-medium">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {filteredWithdrawals.map((withdrawal) => (
//                     <tr key={withdrawal.id} className="border-t border-slate-700/50 hover:bg-slate-700/25">
//                       <td className="p-4">
//                         <div className="flex items-center gap-3">
//                           <div className="w-10 h-10 bg-slate-600 rounded-full flex items-center justify-center">
//                             <FiUser className="w-5 h-5 text-slate-300" />
//                           </div>
//                           <div>
//                             <p className="text-white font-medium">{withdrawal.email}</p>
//                             <p className="text-slate-400 text-sm">ID: {withdrawal.id}</p>
//                           </div>
//                         </div>
//                       </td>
//                       <td className="p-4">
//                         <p className="text-white font-medium">${withdrawal.amount.toLocaleString()}</p>
//                       </td>
//                       <td className="p-4">
//                         <p className="text-white font-medium">{withdrawal.network}</p>
//                       </td>
//                       <td className="p-4">
//                         <p className="text-white font-medium">{withdrawal.token_type}</p>
//                       </td>
//                       <td className="p-4">
//                         <p className="font-mono text-slate-300">{withdrawal.account_number}</p>
//                       </td>
//                       <td className="p-4">
//                         {withdrawal.status ? (
//                           <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded-full text-sm font-medium">
//                             Completed
//                           </span>
//                         ) : (
//                           <span className="bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full text-sm font-medium">
//                             Pending
//                           </span>
//                         )}
//                       </td>
//                       <td className="p-4">
//                         <p className="text-slate-400 text-sm">{formatDate(withdrawal.created_at)}</p>
//                       </td>
//                       <td className="p-4">
//                         <p className="text-slate-400 text-sm">{formatDate(withdrawal.updated_at)}</p>
//                       </td>
//                       <td className="p-4">
//                         <button
//                           onClick={async () => {
//                             try {
//                               await updateWithdrawalStatus(
//                                 withdrawal.id,
//                                 !withdrawal.status
//                               );
//                             } catch (error) {
//                               console.error('Error updating withdrawal status:', error);
//                             }
//                           }}
//                           className={`px-3 py-1 rounded text-sm font-medium transition-colors flex items-center gap-1 ${
//                             withdrawal.status
//                               ? 'bg-green-600 hover:bg-green-700 text-white'
//                               : 'bg-yellow-600 hover:bg-yellow-700 text-white'
//                           }`}
//                         >
//                           {withdrawal.status ? (
//                             <>
//                               <FiCheck className="w-3 h-3" />
//                               Mark as Pending
//                             </>
//                           ) : (
//                             <>
//                               <FiClock className="w-3 h-3" />
//                               Mark as Paid
//                             </>
//                           )}
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
            
//             {filteredWithdrawals.length === 0 && (
//               <div className="text-center py-12">
//                 <div className="text-slate-400 mb-4">
//                   <FiEye className="w-12 h-12 mx-auto mb-2" />
//                   <p>No withdrawal requests found</p>
//                   <p className="text-sm">
//                     {filter === 'pending' && 'No pending withdrawals at the moment'}
//                     {filter === 'completed' && 'No completed withdrawals found'}
//                     {filter === 'all' && searchEmail && `No results for "${searchEmail}"`}
//                   </p>
//                 </div>
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AdminTransactionsPage;


"use client"
import React, { useState, useEffect } from 'react';
import { FiUser, FiMail, FiDollarSign, FiClock, FiEdit3, FiSave, FiX, FiCheck, FiEye, FiRefreshCw, FiExternalLink, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { createClient } from '@/app/utils/supabase/clients';

type WalletTier = 
  | 'basic' 
  | 'standard' 
  | 'premium' 
  | 'gold' 
  | 'platinum' 
  | 'diamond' 
  | 'elite';

type TransactionRequest = {
  id: string;
  email: string;
  amount: number;
  wallet_type: WalletTier;
  account_number: string | null;
  status: boolean;
  created_at: string;
  network: string;
  token_type: string;
};

type WithdrawalRequest = {
  id: string;
  user_id: string;
  wallet_id: string;
  email: string;
  amount: number;
  network: string;
  token_type: string;
  account_number: string;
  status: boolean;
  created_at: string;
  updated_at: string;
};

const TIER_CONFIG = {
  basic: {
    name: 'Basic Wallet',
    minimum: 1000,
    color: 'from-gray-300 to-gray-400',
    bgColor: 'bg-gray-400/20',
    borderColor: 'border-gray-400/30',
    icon: '🟦',
    textColor: 'text-gray-400',
  },
  standard: {
    name: 'Standard Wallet',
    minimum: 10000,
    color: 'from-blue-400 to-blue-600',
    bgColor: 'bg-blue-500/20',
    borderColor: 'border-blue-500/30',
    icon: '🟪',
    textColor: 'text-blue-400',
  },
  premium: {
    name: 'Premium Wallet',
    minimum: 20000,
    color: 'from-purple-400 to-purple-600',
    bgColor: 'bg-purple-500/20',
    borderColor: 'border-purple-500/30',
    icon: '🟣',
    textColor: 'text-purple-400',
  },
  gold: {
    name: 'Gold Wallet',
    minimum: 50000,
    color: 'from-yellow-400 to-yellow-600',
    bgColor: 'bg-yellow-500/20',
    borderColor: 'border-yellow-500/30',
    icon: '🟨',
    textColor: 'text-yellow-400',
  },
  platinum: {
    name: 'Platinum Wallet',
    minimum: 100000,
    color: 'from-slate-400 to-slate-600',
    bgColor: 'bg-slate-500/20',
    borderColor: 'border-slate-500/30',
    icon: '⬜️',
    textColor: 'text-slate-400',
  },
  diamond: {
    name: 'Diamond Wallet',
    minimum: 500000,
    color: 'from-indigo-400 to-indigo-700',
    bgColor: 'bg-indigo-500/20',
    borderColor: 'border-indigo-500/30',
    icon: '🔷',
    textColor: 'text-indigo-400',
  },
  elite: {
    name: 'Elite Wallet',
    minimum: 1000000,
    color: 'from-emerald-500 to-emerald-700',
    bgColor: 'bg-emerald-500/20',
    borderColor: 'border-emerald-500/30',
    icon: '💎',
    textColor: 'text-emerald-500',
  }
};

const AdminTransactionsPage = () => {
  const [transactions, setTransactions] = useState<TransactionRequest[]>([]);
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editAccountNumber, setEditAccountNumber] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [searchEmail, setSearchEmail] = useState('');
  const [activeTab, setActiveTab] = useState<'deposits' | 'withdrawals'>('deposits');
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
  
  const supabase = createClient();

  useEffect(() => {
    fetchTransactions();
    fetchWithdrawals();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTransactions(data || []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchWithdrawals = async () => {
    try {
      const { data, error } = await supabase
        .from('withdrawals')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setWithdrawals(data || []);
    } catch (error) {
      console.error('Error fetching withdrawals:', error);
    }
  };

  const updateAccountNumber = async (transactionId: string, accountNumber: string) => {
    try {
      setUpdatingId(transactionId);
      
      const { data, error } = await supabase
        .from('transactions')
        .update({ account_number: accountNumber })
        .eq('id', transactionId)
        .select()
        .single();

      if (error) throw error;

      setTransactions(prev => 
        prev.map(transaction => 
          transaction.id === transactionId 
            ? { ...transaction, account_number: accountNumber }
            : transaction
        )
      );

      setEditingId(null);
      setEditAccountNumber('');
      
    } catch (error) {
      console.error('Error updating account number:', error);
    } finally {
      setUpdatingId(null);
    }
  };

  const updateWalletStatus = async (walletNumber: string, status: boolean) => {
    try {
      const { data, error } = await supabase
        .from('wallets')
        .update({ status, balance: TIER_CONFIG[transactions.find(t => t.account_number === walletNumber)?.wallet_type || 'basic'].minimum })
        .eq('wallet_number', walletNumber)
        .select()
        .single();

      if (error) throw error;

      const { error: transactionError } = await supabase
        .from('transactions')
        .update({ status })
        .eq('account_number', walletNumber);

      if (transactionError) throw transactionError;

      setTransactions(prev =>
        prev.map(t =>
          t.account_number === walletNumber ? { ...t, status } : t
        )
      );

      return data;
    } catch (error) {
      console.error('Error updating wallet status:', error);
      throw error;
    }
  };

  const updateWithdrawalStatus = async (withdrawalId: string, status: boolean) => {
    try {
      const { data, error } = await supabase
        .from('withdrawals')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', withdrawalId)
        .select()
        .single();

      if (error) throw error;

      setWithdrawals(prev =>
        prev.map(w =>
          w.id === withdrawalId ? { ...w, status, updated_at: data.updated_at } : w
        )
      );

      return data;
    } catch (error) {
      console.error('Error updating withdrawal status:', error);
      throw error;
    }
  };

  const startEditing = (transaction: TransactionRequest) => {
    setEditingId(transaction.id);
    setEditAccountNumber(transaction.account_number || '');
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditAccountNumber('');
  };

  const handleSave = (transactionId: string) => {
    if (editAccountNumber.trim()) {
      updateAccountNumber(transactionId, editAccountNumber.trim());
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
    setExpandedRows(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesFilter = filter === 'all' || 
      (filter === 'pending' && !transaction.status) ||
      (filter === 'completed' && transaction.status);
    
    const matchesSearch = !searchEmail || 
      transaction.email.toLowerCase().includes(searchEmail.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const filteredWithdrawals = withdrawals.filter(withdrawal => {
    const matchesFilter = filter === 'all' || 
      (filter === 'pending' && !withdrawal.status) ||
      (filter === 'completed' && withdrawal.status);
    
    const matchesSearch = !searchEmail || 
      withdrawal.email.toLowerCase().includes(searchEmail.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const pendingDepositCount = transactions.filter(t => !t.status).length;
  const completedDepositCount = transactions.filter(t => t.status).length;
  const pendingWithdrawalCount = withdrawals.filter(w => !w.status).length;
  const completedWithdrawalCount = withdrawals.filter(w => w.status).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading transactions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white py-6">
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent mb-2">
                Transaction Management
              </h1>
              <p className="text-slate-400">Manage wallet creation and withdrawal requests</p>
            </div>
            <button
              onClick={() => {
                if (activeTab === 'deposits') fetchTransactions();
                else fetchWithdrawals();
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <FiRefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>

          {/* Tabs */}
          <div className="flex bg-slate-800/50 rounded-lg p-1 border border-slate-700/50 mb-6">
            <button
              onClick={() => setActiveTab('deposits')}
              className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors ${
                activeTab === 'deposits'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Deposit Requests
            </button>
            <button
              onClick={() => setActiveTab('withdrawals')}
              className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors ${
                activeTab === 'withdrawals'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Withdrawal Requests
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Total {activeTab === 'deposits' ? 'Deposits' : 'Withdrawals'}</p>
                  <p className="text-2xl font-bold text-white">
                    {activeTab === 'deposits' ? transactions.length : withdrawals.length}
                  </p>
                </div>
                <FiDollarSign className="w-8 h-8 text-blue-400" />
              </div>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Pending</p>
                  <p className="text-2xl font-bold text-yellow-400">
                    {activeTab === 'deposits' ? pendingDepositCount : pendingWithdrawalCount}
                  </p>
                </div>
                <FiClock className="w-8 h-8 text-yellow-400" />
              </div>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Completed</p>
                  <p className="text-2xl font-bold text-green-400">
                    {activeTab === 'deposits' ? completedDepositCount : completedWithdrawalCount}
                  </p>
                </div>
                <FiCheck className="w-8 h-8 text-green-400" />
              </div>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Total Amount</p>
                  <p className="text-2xl font-bold text-white">
                    ${(activeTab === 'deposits' 
                      ? transactions.reduce((sum, t) => sum + t.amount, 0) 
                      : withdrawals.reduce((sum, w) => sum + w.amount, 0)
                    ).toLocaleString()}
                  </p>
                </div>
                <FiExternalLink className="w-8 h-8 text-purple-400" />
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex bg-slate-800/50 rounded-lg p-1 border border-slate-700/50">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  filter === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                All ({activeTab === 'deposits' ? transactions.length : withdrawals.length})
              </button>
              <button
                onClick={() => setFilter('pending')}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  filter === 'pending'
                    ? 'bg-yellow-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Pending ({activeTab === 'deposits' ? pendingDepositCount : pendingWithdrawalCount})
              </button>
              <button
                onClick={() => setFilter('completed')}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  filter === 'completed'
                    ? 'bg-green-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Completed ({activeTab === 'deposits' ? completedDepositCount : completedWithdrawalCount})
              </button>
            </div>
            
            <div className="flex-1 max-w-md">
              <input
                type="text"
                placeholder="Search by email..."
                value={searchEmail}
                onChange={(e) => setSearchEmail(e.target.value)}
                className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {activeTab === 'deposits' ? (
          /* Deposits Table - Mobile Friendly */
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 overflow-hidden">
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-700/50">
                  <tr>
                    <th className="text-left p-4 text-slate-300 font-medium">User</th>
                    <th className="text-left p-4 text-slate-300 font-medium">Wallet Type</th>
                    <th className="text-left p-4 text-slate-300 font-medium">Amount</th>
                    <th className="text-left p-4 text-slate-300 font-medium">Account</th>
                    <th className="text-left p-4 text-slate-300 font-medium">Status</th>
                    <th className="text-left p-4 text-slate-300 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map((transaction) => (
                    <React.Fragment key={transaction.id}>
                      <tr className="border-t  items-center border-slate-700/50 hover:bg-slate-700/25">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-slate-600 rounded-full flex items-center justify-center">
                              <FiUser className="w-5 h-5 text-slate-300" />
                            </div>
                            <div>
                              <p className="text-white font-medium">{transaction.email}</p>
                              <p className="text-slate-400 text-sm">ID: {transaction.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex  items-center gap-2">
                            <span className="text-2xl">{TIER_CONFIG[transaction.wallet_type].icon}</span>
                            <div>
                              <p className={`font-medium ${TIER_CONFIG[transaction.wallet_type].textColor}`}>
                                {TIER_CONFIG[transaction.wallet_type].name}
                              </p>
                              <p className="text-slate-400 text-sm">{transaction.token_type} ({transaction.network})</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <p className="text-white font-medium">${transaction.amount.toLocaleString()}</p>
                        </td>
                        <td className="p-4">
                          {editingId === transaction.id ? (
                            <div className="flex  items-center gap-2">
                              <input
                                type="text"
                                value={editAccountNumber}
                                onChange={(e) => setEditAccountNumber(e.target.value)}
                                placeholder="Enter account number"
                                className="bg-slate-700 border border-slate-600 rounded px-3 py-1 text-white text-sm focus:outline-none focus:border-blue-500"
                              />
                              <button
                                onClick={() => handleSave(transaction.id)}
                                disabled={updatingId === transaction.id}
                                className="bg-green-600 hover:bg-green-700 text-white p-1 rounded disabled:opacity-50"
                              >
                                <FiSave className="w-4 h-4" />
                              </button>
                              <button
                                onClick={cancelEditing}
                                className="bg-slate-600 hover:bg-slate-700 text-white p-1 rounded"
                              >
                                <FiX className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              {transaction.account_number ? (
                                <span className="font-mono text-green-400 font-medium">
                                  {transaction.account_number}
                                </span>
                              ) : (
                                <span className="text-slate-400">Not assigned</span>
                              )}
                            </div>
                          )}
                        </td>
                        <td className="p-4">
                          {transaction.account_number ? (
                            <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded-full text-sm font-medium">
                              Completed
                            </span>
                          ) : (
                            <span className="bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full text-sm font-medium">
                              Pending
                            </span>
                          )}
                        </td>
                        <td className="p-4 flex  items-center gap-2">
                          {transaction.account_number && (
                            <button
                              onClick={async () => {
                                try {
                                  await updateWalletStatus(
                                    transaction.account_number!,
                                    !transaction.status
                                  );
                                } catch (error) {
                                  console.error('Error updating payment status:', error);
                                }
                              }}
                              className={`px-3 py-1 rounded cursor-pointer  text-sm font-medium transition-colors flex items-center gap-1 ${
                                transaction.status
                                  ? 'bg-green-600 hover:bg-green-700 text-white'
                                  : 'bg-yellow-600 hover:bg-yellow-700 text-white'
                              }`}
                            >
                              {transaction.status ? (
                                <FiCheck className="w-3 h-3" />
                              ) : (
                                <FiClock className="w-3 h-3" />
                              )}
                            </button>
                          )}
                          {editingId === transaction.id ? (
                            <div className="text-sm text-slate-400">
                              {updatingId === transaction.id ? 'Saving...' : 'Editing...'}
                            </div>
                          ) : (
                            <button
                              onClick={() => startEditing(transaction)}
                              className="bg-blue-600 cursor-pointer hover:bg-blue-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors flex items-center gap-1"
                            >
                              <FiEdit3 className="w-3 h-3" />
                            </button>
                          )}
                        </td>
                      </tr>
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile View */}
            <div className="md:hidden">
              {filteredTransactions.map((transaction) => (
                <div key={transaction.id} className="border-t border-slate-700/50 p-4">
                  <div 
                    className="flex justify-between items-center cursor-pointer"
                    onClick={() => toggleRowExpand(transaction.id)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-600 rounded-full flex items-center justify-center">
                        <FiUser className="w-5 h-5 text-slate-300" />
                      </div>
                      <div>
                        <p className="text-white font-medium">{transaction.email}</p>
                        <p className="text-slate-400 text-sm">${transaction.amount.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {transaction.account_number ? (
                        <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded-full text-xs">
                          Completed
                        </span>
                      ) : (
                        <span className="bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full text-xs">
                          Pending
                        </span>
                      )}
                      {expandedRows[transaction.id] ? (
                        <FiChevronUp className="text-slate-400" />
                      ) : (
                        <FiChevronDown className="text-slate-400" />
                      )}
                    </div>
                  </div>

                  {expandedRows[transaction.id] && (
                    <div className="mt-4 pl-14 space-y-3">
                      <div>
                        <p className="text-slate-400 text-sm">Wallet Type</p>
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{TIER_CONFIG[transaction.wallet_type].icon}</span>
                          <p className={`font-medium ${TIER_CONFIG[transaction.wallet_type].textColor}`}>
                            {TIER_CONFIG[transaction.wallet_type].name}
                          </p>
                        </div>
                      </div>
                      <div>
                        <p className="text-slate-400 text-sm">Token/Network</p>
                        <p className="text-white">{transaction.token_type} ({transaction.network})</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-sm">Account Number</p>
                        {editingId === transaction.id ? (
                          <div className="flex items-center gap-2 mt-1">
                            <input
                              type="text"
                              value={editAccountNumber}
                              onChange={(e) => setEditAccountNumber(e.target.value)}
                              placeholder="Enter account number"
                              className="flex-1 bg-slate-700 border border-slate-600 rounded px-3 py-1 text-white text-sm focus:outline-none focus:border-blue-500"
                            />
                            <button
                              onClick={() => handleSave(transaction.id)}
                              disabled={updatingId === transaction.id}
                              className="bg-green-600 hover:bg-green-700 text-white p-1 rounded disabled:opacity-50"
                            >
                              <FiSave className="w-4 h-4" />
                            </button>
                            <button
                              onClick={cancelEditing}
                              className="bg-slate-600 hover:bg-slate-700 text-white p-1 rounded"
                            >
                              <FiX className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            {transaction.account_number ? (
                              <span className="font-mono text-green-400 font-medium">
                                {transaction.account_number}
                              </span>
                            ) : (
                              <span className="text-slate-400">Not assigned</span>
                            )}
                            <button
                              onClick={() => startEditing(transaction)}
                              className="ml-auto bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-sm"
                            >
                              <FiEdit3 className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2 pt-2">
                        {transaction.account_number && (
                          <button
                            onClick={async () => {
                              try {
                                await updateWalletStatus(
                                  transaction.account_number!,
                                  !transaction.status
                                );
                              } catch (error) {
                                console.error('Error updating payment status:', error);
                              }
                            }}
                            className={`flex-1 px-3 py-2 rounded text-sm font-medium transition-colors flex items-center justify-center gap-1 ${
                              transaction.status
                                ? 'bg-green-600 hover:bg-green-700 text-white'
                                : 'bg-yellow-600 hover:bg-yellow-700 text-white'
                            }`}
                          >
                            {transaction.status ? (
                              <>
                                <FiCheck className="w-3 h-3" />
                                <span>Mark as Pending</span>
                              </>
                            ) : (
                              <>
                                <FiClock className="w-3 h-3" />
                                <span>Mark as Paid</span>
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            {filteredTransactions.length === 0 && (
              <div className="text-center py-12">
                <div className="text-slate-400 mb-4">
                  <FiEye className="w-12 h-12 mx-auto mb-2" />
                  <p>No deposit requests found</p>
                  <p className="text-sm">
                    {filter === 'pending' && 'No pending requests at the moment'}
                    {filter === 'completed' && 'No completed requests found'}
                    {filter === 'all' && searchEmail && `No results for "${searchEmail}"`}
                  </p>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Withdrawals Table - Mobile Friendly */
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 overflow-hidden">
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-700/50">
                  <tr>
                    <th className="text-left p-4 text-slate-300 font-medium">User</th>
                    <th className="text-left p-4 text-slate-300 font-medium">Amount</th>
                    <th className="text-left p-4 text-slate-300 font-medium">Network</th>
                    <th className="text-left p-4 text-slate-300 font-medium">Account</th>
                    <th className="text-left p-4 text-slate-300 font-medium">Status</th>
                    <th className="text-left p-4 text-slate-300 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredWithdrawals.map((withdrawal) => (
                    <React.Fragment key={withdrawal.id}>
                      <tr className="border-t border-slate-700/50 hover:bg-slate-700/25">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-slate-600 rounded-full flex items-center justify-center">
                              <FiUser className="w-5 h-5 text-slate-300" />
                            </div>
                            <div>
                              <p className="text-white font-medium">{withdrawal.email}</p>
                              <p className="text-slate-400 text-sm">ID: {withdrawal.id}</p>
                            </div>
                          </div> 
                        </td> 
                        <td className="p-4">
                          <p className="text-white font-medium">${withdrawal.amount.toLocaleString()}</p>
                          <p className="text-slate-400 text-sm">{withdrawal.token_type}</p>
                        </td>
                        <td className="p-4">
                          <p className="text-white font-medium">{withdrawal.network}</p>
                        </td>
                        <td className="p-4">
                          <p className="font-mono text-slate-300">{withdrawal.account_number}</p>
                        </td>
                        <td className="p-4">
                          {withdrawal.status ? (
                            <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded-full text-sm font-medium">
                              Completed
                            </span>
                          ) : (
                            <span className="bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full text-sm font-medium">
                              Pending
                            </span>
                          )}
                        </td>
                        <td className="p-4">
                          <button
                            onClick={async () => {
                              try {
                                await updateWithdrawalStatus(
                                  withdrawal.id,
                                  !withdrawal.status
                                );
                              } catch (error) {
                                console.error('Error updating withdrawal status:', error);
                              }
                            }}
                            className={`px-3 py-1 rounded text-sm font-medium transition-colors flex items-center gap-1 ${
                              withdrawal.status
                                ? 'bg-green-600 hover:bg-green-700 text-white'
                                : 'bg-yellow-600 hover:bg-yellow-700 text-white'
                            }`}
                          >
                            {withdrawal.status ? (
                              <FiCheck className="w-3 h-3" />
                            ) : (
                              <FiClock className="w-3 h-3" />
                            )}
                          </button>
                        </td>
                      </tr>
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile View */}
            <div className="md:hidden">
              {filteredWithdrawals.map((withdrawal) => (
                <div key={withdrawal.id} className="border-t border-slate-700/50 p-4">
                  <div 
                    className="flex justify-between items-center cursor-pointer"
                    onClick={() => toggleRowExpand(withdrawal.id)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-600 rounded-full flex items-center justify-center">
                        <FiUser className="w-5 h-5 text-slate-300" />
                      </div>
                      <div>
                        <p className="text-white font-medium">{withdrawal.email}</p>
                        <p className="text-slate-400 text-sm">${withdrawal.amount.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {withdrawal.status ? (
                        <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded-full text-xs">
                          Completed
                        </span>
                      ) : (
                        <span className="bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full text-xs">
                          Pending
                        </span>
                      )}
                      {expandedRows[withdrawal.id] ? (
                        <FiChevronUp className="text-slate-400" />
                      ) : (
                        <FiChevronDown className="text-slate-400" />
                      )}
                    </div>
                  </div>

                  {expandedRows[withdrawal.id] && (
                    <div className="mt-4 pl-14 space-y-3">
                      <div>
                        <p className="text-slate-400 text-sm">Token/Network</p>
                        <p className="text-white">{withdrawal.token_type} ({withdrawal.network})</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-sm">Account Number</p>
                        <p className="font-mono text-slate-300">{withdrawal.account_number}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-sm">Created</p>
                        <p className="text-slate-300 text-sm">{formatDate(withdrawal.created_at)}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-sm">Updated</p>
                        <p className="text-slate-300 text-sm">{formatDate(withdrawal.updated_at)}</p>
                      </div>
                      <div className="pt-2">
                        <button
                          onClick={async () => {
                            try {
                              await updateWithdrawalStatus(
                                withdrawal.id,
                                !withdrawal.status
                              );
                            } catch (error) {
                              console.error('Error updating withdrawal status:', error);
                            }
                          }}
                          className={`w-full px-3 py-2 rounded text-sm font-medium transition-colors flex items-center justify-center gap-1 ${
                            withdrawal.status
                              ? 'bg-green-600 hover:bg-green-700 text-white'
                              : 'bg-yellow-600 hover:bg-yellow-700 text-white'
                          }`}
                        >
                          {withdrawal.status ? (
                            <>
                              <FiCheck className="w-3 h-3" />
                              <span>Mark as Pending</span>
                            </>
                          ) : (
                            <>
                              <FiClock className="w-3 h-3" />
                              <span>Mark as Paid</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            {filteredWithdrawals.length === 0 && (
              <div className="text-center py-12">
                <div className="text-slate-400 mb-4">
                  <FiEye className="w-12 h-12 mx-auto mb-2" />
                  <p>No withdrawal requests found</p>
                  <p className="text-sm">
                    {filter === 'pending' && 'No pending withdrawals at the moment'}
                    {filter === 'completed' && 'No completed withdrawals found'}
                    {filter === 'all' && searchEmail && `No results for "${searchEmail}"`}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminTransactionsPage;