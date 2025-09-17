

// "use client"
// import React, { useState, useEffect } from 'react';
// import { FiUser, FiMail, FiDollarSign, FiClock, FiEdit3, FiSave, FiX, FiCheck, FiEye, FiRefreshCw, FiExternalLink, FiChevronDown, FiChevronUp, FiTrash2, FiPlusCircle } from 'react-icons/fi';
// import { createClient } from '@/app/utils/supabase/clients';
// import { TIER_CONFIG, TransactionRequest, WithdrawalRequest } from '@/app/data';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';

// // Type for the new table
// interface AddedDeposit {
//   id: string;
//   email: string;
//   user_id: string;
//   deposit: number;
//   status: boolean;
//   created_at: string;
// }

// // Reusable components
// const StatusPill = ({ status, type }: { status: boolean; type: 'deposit' | 'withdrawal' }) => (
//   <span className={`px-2 py-1 rounded-full text-xs font-medium ${
//     status ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
//   }`}>
//     {status ? 'Completed' : 'Pending'}
//   </span>
// );

// const UserInfo = ({ email, id }: { email: string; id: string }) => (
//   <div className="flex items-center gap-3">
//     <div className="w-10 h-10 bg-slate-600 rounded-full flex items-center justify-center">
//       <FiUser className="w-5 h-5 text-slate-300" />
//     </div>
//     <div>
//       <p className="text-white font-medium">{email}</p>
//       <p className="text-slate-400 text-sm">ID: {id}</p>
//     </div>
//   </div>
// );

// const ActionsMenu = ({ item, activeTab, onConfirm, onDelete, onEditWalletAddress }: any) => (
//   <div className="flex items-center gap-2">
//     {activeTab === 'deposits' ? (
//       item.account_number ? (
//         item.status ? (
//           <span className="text-green-500 p-2 rounded-full"><FiCheck className="w-4 h-4" /></span>
//         ) : (
//           <button
//             onClick={() => onConfirm(item.id)}
//             className="bg-yellow-600 hover:bg-yellow-700 text-white p-2 rounded-full cursor-pointer transition-colors"
//             aria-label="Confirm deposit"
//           >
//             <FiCheck className="w-4 h-4" />
//           </button>
//         )
//       ) : (
//         <button
//           onClick={() => onEditWalletAddress(item.id, item.account_number || "")}
//           className="bg-blue-600 cursor-pointer hover:bg-blue-700 text-white p-2 rounded-full transition-colors"
//           aria-label="Edit wallet address"
//         >
//           <FiEdit3 className="w-4 h-4" />
//         </button>
//       )
//     ) : activeTab === 'withdrawals' ? (
//       !item.status ? (
//         <button
//           onClick={() => onConfirm(item.id)}
//           className="bg-yellow-600 hover:bg-yellow-700 text-white p-2 rounded-full cursor-pointer transition-colors"
//           aria-label="Confirm withdrawal"
//         >
//           <FiCheck className="w-4 h-4" />
//         </button>
//       ) : (
//         <span className="text-green-500 p-2 rounded-full"><FiCheck className="w-4 h-4" /></span>
//       )
//     ) : (
//       // Actions for 'added_deposits'
//       <div className="flex items-center gap-2">
//         <span className="text-green-500 p-2 rounded-full"><FiCheck className="w-4 h-4" /></span>
//       </div>
//     )}
//     <button
//       onClick={() => onDelete(item.id)}
//       className="flex cursor-pointer items-center gap-1 p-2 bg-red-600/90 hover:bg-red-600 text-white rounded-full transition-colors border border-red-500/30"
//       aria-label="Delete item"
//     >
//       <FiTrash2 className="w-4 h-4" />
//     </button>
//   </div>
// );


// const AdminTransactionsPage = () => {
//   const [transactions, setTransactions] = useState<TransactionRequest[]>([]);
//   const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([]);
//   const [addedDeposits, setAddedDeposits] = useState<AddedDeposit[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [editingId, setEditingId] = useState<string | null>(null);
//   const [editAccountNumber, setEditAccountNumber] = useState('');
//   const [updatingId, setUpdatingId] = useState<string | null>(null);
//   const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
//   const [searchEmail, setSearchEmail] = useState('');
//   const [activeTab, setActiveTab] = useState<'deposits' | 'withdrawals' | 'added_deposits'>('deposits');
//   const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
//   const [showConfirmationModal, setShowConfirmationModal] = useState(false);
//   const [currentTransactionId, setCurrentTransactionId] = useState<string | null>(null);
//   const [isConfirming, setIsConfirming] = useState(false);
//   const [editingAmountId, setEditingAmountId] = useState<string | null>(null);
//   const [editAmount, setEditAmount] = useState<number>(0);
//   const [editingAddedAmountId, setEditingAddedAmountId] = useState<string | null>(null);
//   const [editAddedAmount, setEditAddedAmount] = useState<number>(0);
//   const [editingDateId, setEditingDateId] = useState<string | null>(null);
//   const [editDate, setEditDate] = useState<Date | null>(null);
  
//   // New state for adding a new deposit
//   const [showAddDepositModal, setShowAddDepositModal] = useState(false);
//   const [newDepositEmail, setNewDepositEmail] = useState('');
//   const [newDepositAmount, setNewDepositAmount] = useState<number>(0);
//   const [isAddingDeposit, setIsAddingDeposit] = useState(false);

//   // New states for editing added deposits
//   const [editingAddedDepositAmountId, setEditingAddedDepositAmountId] = useState<string | null>(null);
//   const [editAddedDepositAmount, setEditAddedDepositAmount] = useState<number>(0);
//   const [editingAddedDepositDateId, setEditingAddedDepositDateId] = useState<string | null>(null);
//   const [editAddedDepositDate, setEditAddedDepositDate] = useState<Date | null>(null);
  
//   const supabase = createClient();

//   useEffect(() => {
//     fetchTransactions();
//     fetchWithdrawals();
//     fetchAddedDeposits();
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

//   const fetchAddedDeposits = async () => {
//     try {
//       const { data, error } = await supabase
//         .from('add_new_deposit')
//         .select('*')
//         .order('created_at', { ascending: false });

//       if (error) throw error;
//       setAddedDeposits(data || []);
//     } catch (error) {
//       console.error('Error fetching added deposits:', error);
//     }
//   };

//   const addDeposit = async () => {
//     setIsAddingDeposit(true);
//     try {
//       const { data, error } = await supabase
//         .from('add_new_deposit')
//         .insert([{ 
//           email: newDepositEmail,
//           deposit: newDepositAmount,
//           status: true,
//           created_at: new Date().toISOString()
//         }])
//         .select();

//       if (error) throw error;
      
//       setAddedDeposits(prev => [data[0], ...prev]);
//       setShowAddDepositModal(false);
//       setNewDepositEmail('');
//       setNewDepositAmount(0);
//     } catch (error) {
//       console.error('Error adding new deposit:', error);
//     } finally {
//       setIsAddingDeposit(false);
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

//   const updateWithdrawalAccountNumber = async (withdrawalId: string, accountNumber: string) => {
//     try {
//       setUpdatingId(withdrawalId);
      
//       const { data, error } = await supabase
//         .from('withdrawals')
//         .update({ account_number: accountNumber })
//         .eq('id', withdrawalId)
//         .select()
//         .single();

//       if (error) throw error;

//       setWithdrawals(prev => 
//         prev.map(withdrawal => 
//           withdrawal.id === withdrawalId 
//             ? { ...withdrawal, account_number: accountNumber }
//             : withdrawal
//         )
//       );

//       setEditingId(null);
//       setEditAccountNumber('');
      
//     } catch (error) {
//       console.error('Error updating withdrawal account number:', error);
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

//       const { error: transactionError } = await supabase
//         .from('transactions')
//         .update({ status })
//         .eq('account_number', walletNumber);

//       if (transactionError) throw transactionError;

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

//   const updateTransactionAmount = async (transactionId: string, newAmount: number) => {
//     try {
//       const { data, error } = await supabase
//         .from('transactions')
//         .update({ amount: newAmount })
//         .eq('id', transactionId)
//         .select()
//         .single();

//       if (error) throw error;

//       setTransactions(prev => 
//         prev.map(transaction => 
//           transaction.id === transactionId 
//             ? { ...transaction, amount: newAmount }
//             : transaction
//         )
//       );
//       cancelEditingAmount();
//     } catch (error) {
//       console.error('Error updating transaction amount:', error);
//     }
//   };

//   const updateAddedDepositAmount = async (depositId: string, newAmount: number) => {
//     try {
//       const { data, error } = await supabase
//         .from('add_new_deposit')
//         .update({ deposit: newAmount })
//         .eq('id', depositId)
//         .select()
//         .single();

//       if (error) throw error;

//       setAddedDeposits(prev =>
//         prev.map(deposit =>
//           deposit.id === depositId
//             ? { ...deposit, deposit: newAmount }
//             : deposit
//         )
//       );
//       cancelEditingAddedDepositAmount();
//     } catch (error) {
//       console.error('Error updating added deposit amount:', error);
//     }
//   };

//   const updateTransactionAddedAmount = async (transactionId: string, newAddedAmount: number) => {
//     try {
//       const { data, error } = await supabase
//         .from('transactions')
//         .update({ added_amount: newAddedAmount })
//         .eq('id', transactionId)
//         .select()
//         .single();

//       if (error) throw error;

//       setTransactions(prev => 
//         prev.map(transaction => 
//           transaction.id === transactionId 
//             ? { ...transaction, added_amount: newAddedAmount }
//             : transaction
//         )
//       );
//       cancelEditingAddedAmount();
//     } catch (error) {
//       console.error('Error updating add amount:', error);
//     }
//   };

//   const updateWithdrawalAmount = async (withdrawalId: string, newAmount: number) => {
//     try {
//       const { data, error } = await supabase
//         .from('withdrawals')
//         .update({ amount: newAmount })
//         .eq('id', withdrawalId)
//         .select()
//         .single();

//       if (error) throw error;

//       setWithdrawals(prev => 
//         prev.map(withdrawal => 
//           withdrawal.id === withdrawalId 
//             ? { ...withdrawal, amount: newAmount }
//             : withdrawal
//         )
//       );
//       cancelEditingAmount();
//     } catch (error) {
//       console.error('Error updating withdrawal amount:', error);
//     }
//   };

//   const updateTransactionDate = async (transactionId: string, newDate: Date) => {
//     try {
//       const { data, error } = await supabase
//         .from('transactions')
//         .update({ created_at: newDate.toISOString() })
//         .eq('id', transactionId)
//         .select()
//         .single();

//       if (error) throw error;

//       setTransactions(prev => 
//         prev.map(transaction => 
//           transaction.id === transactionId 
//             ? { ...transaction, created_at: newDate.toISOString() }
//             : transaction
//         )
//       );
//       cancelEditingDate();
//     } catch (error) {
//       console.error('Error updating transaction date:', error);
//     }
//   };

//   const updateAddedDepositDate = async (depositId: string, newDate: Date) => {
//     try {
//       const { data, error } = await supabase
//         .from('add_new_deposit')
//         .update({ created_at: newDate.toISOString() })
//         .eq('id', depositId)
//         .select()
//         .single();

//       if (error) throw error;

//       setAddedDeposits(prev =>
//         prev.map(deposit =>
//           deposit.id === depositId
//             ? { ...deposit, created_at: newDate.toISOString() }
//             : deposit
//         )
//       );
//       cancelEditingAddedDepositDate();
//     } catch (error) {
//       console.error('Error updating added deposit date:', error);
//     }
//   };

//   const deleteItem = async (id: string) => {
//     if (!confirm(`Are you sure you want to delete this ${activeTab.slice(0, -1)}?`)) return;

//     try {
//       setLoading(true);
//       if (activeTab === 'deposits') {
//         const { error } = await supabase.from('transactions').delete().eq('id', id);
//         if (error) throw error;
//         setTransactions(prev => prev.filter(transaction => transaction.id !== id));
//       } else if (activeTab === 'withdrawals') {
//         const { error } = await supabase.from('withdrawals').delete().eq('id', id);
//         if (error) throw error;
//         setWithdrawals(prev => prev.filter(withdrawal => withdrawal.id !== id));
//       } else if (activeTab === 'added_deposits') {
//         const { error } = await supabase.from('add_new_deposit').delete().eq('id', id);
//         if (error) throw error;
//         setAddedDeposits(prev => prev.filter(deposit => deposit.id !== id));
//       }
//     } catch (error) {
//       console.error(`Error deleting ${activeTab.slice(0, -1)}:`, error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const startEditingAmount = (id: string, currentAmount: number) => {
//     setEditingAmountId(id);
//     setEditAmount(currentAmount);
//   };

//   const handleSaveAmount = (id: string) => {
//     if (editAmount > 0) {
//       if (activeTab === 'deposits') {
//         updateTransactionAmount(id, editAmount);
//       } else {
//         updateWithdrawalAmount(id, editAmount);
//       }
//     }
//   };

//   const cancelEditingAmount = () => {
//     setEditingAmountId(null);
//     setEditAmount(0);
//   };

//   const startEditingAddedAmount = (id: string, currentAddedAmount: number) => {
//     setEditingAddedAmountId(id);
//     setEditAddedAmount(currentAddedAmount);
//   };

//   const handleSaveAddedAmount = (id: string) => {
//     if (editAddedAmount > 0) {
//       updateTransactionAddedAmount(id, editAddedAmount);
//     }
//   };

//   const cancelEditingAddedAmount = () => {
//     setEditingAddedAmountId(null);
//     setEditAddedAmount(0);
//   };

//   const startEditingDate = (id: string, currentDate: string) => {
//     setEditingDateId(id);
//     setEditDate(new Date(currentDate));
//   };

//   const handleSaveDate = (id: string) => {
//     if (editDate) {
//       updateTransactionDate(id, editDate);
//     }
//   };

//   const cancelEditingDate = () => {
//     setEditingDateId(null);
//     setEditDate(null);
//   };

//   // New functions for Added Deposits
//   const startEditingAddedDepositAmount = (id: string, currentAmount: number) => {
//     setEditingAddedDepositAmountId(id);
//     setEditAddedDepositAmount(currentAmount);
//   };

//   const handleSaveAddedDepositAmount = (id: string) => {
//     if (editAddedDepositAmount > 0) {
//       updateAddedDepositAmount(id, editAddedDepositAmount);
//     }
//   };

//   const cancelEditingAddedDepositAmount = () => {
//     setEditingAddedDepositAmountId(null);
//     setEditAddedDepositAmount(0);
//   };

//   const startEditingAddedDepositDate = (id: string, currentDate: string) => {
//     setEditingAddedDepositDateId(id);
//     setEditAddedDepositDate(new Date(currentDate));
//   };

//   const handleSaveAddedDepositDate = (id: string) => {
//     if (editAddedDepositDate) {
//       updateAddedDepositDate(id, editAddedDepositDate);
//     }
//   };

//   const cancelEditingAddedDepositDate = () => {
//     setEditingAddedDepositDateId(null);
//     setEditAddedDepositDate(null);
//   };

//   const startEditingWalletAddress = (id: string, currentAddress: string) => {
//     setEditingId(id);
//     setEditAccountNumber(currentAddress);
//   };

//   const handleSaveWalletAddress = (id: string) => {
//     if (editAccountNumber.trim()) {
//       if (activeTab === 'deposits') {
//         updateAccountNumber(id, editAccountNumber.trim());
//       } else {
//         updateWithdrawalAccountNumber(id, editAccountNumber.trim());
//       }
//     }
//   };

//   const cancelEditingWalletAddress = () => {
//     setEditingId(null);
//     setEditAccountNumber('');
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

//   const toggleRowExpand = (id: string) => {
//     const newExpanded = new Set(expandedRows);
//     if (newExpanded.has(id)) {
//       newExpanded.delete(id);
//     } else {
//       newExpanded.add(id);
//     }
//     setExpandedRows(newExpanded);
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

//   const filteredAddedDeposits = addedDeposits.filter(deposit => {
//     const matchesFilter = filter === 'all' || 
//       (filter === 'pending' && !deposit.status) ||
//       (filter === 'completed' && deposit.status);
    
//     const matchesSearch = !searchEmail || 
//       deposit.email.toLowerCase().includes(searchEmail.toLowerCase());
    
//     return matchesFilter && matchesSearch;
//   });

//   const pendingDepositCount = transactions.filter(t => !t.status).length;
//   const completedDepositCount = transactions.filter(t => t.status).length;
//   const pendingWithdrawalCount = withdrawals.filter(w => !w.status).length;
//   const completedWithdrawalCount = withdrawals.filter(w => w.status).length;
//   const addedDepositCount = addedDeposits.length;

//   const renderDepositStatus = (accountNumber: string | null) => (
//     accountNumber ? (
//       <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded-full text-xs font-medium">
//         Completed
//       </span>
//     ) : (
//       <span className="bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full text-xs font-medium">
//         Pending
//       </span>
//     )
//   );

//   const getFilteredItems = () => {
//     if (activeTab === 'deposits') return filteredTransactions;
//     if (activeTab === 'withdrawals') return filteredWithdrawals;
//     return filteredAddedDeposits;
//   };

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
//                 else if (activeTab === 'withdrawals') fetchWithdrawals();
//                 else fetchAddedDeposits();
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
//             <button
//               onClick={() => setActiveTab('added_deposits')}
//               className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors ${
//                 activeTab === 'added_deposits'
//                   ? 'bg-blue-600 text-white'
//                   : 'text-slate-400 hover:text-white'
//               }`}
//             >
//               Added Deposits
//             </button>
//           </div>

//           {/* Stats Cards */}
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
//             <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-slate-400 text-sm">Total {activeTab === 'deposits' ? 'Deposits' : activeTab === 'withdrawals' ? 'Withdrawals' : 'Added Deposits'}</p>
//                   <p className="text-2xl font-bold text-white">
//                     {activeTab === 'deposits' ? transactions.length : activeTab === 'withdrawals' ? withdrawals.length : addedDeposits.length}
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
//                     {activeTab === 'deposits' ? pendingDepositCount : activeTab === 'withdrawals' ? pendingWithdrawalCount : 0}
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
//                     {activeTab === 'deposits' ? completedDepositCount : activeTab === 'withdrawals' ? completedWithdrawalCount : addedDepositCount}
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
//                       : activeTab === 'withdrawals'
//                       ? withdrawals.reduce((sum, w) => sum + w.amount, 0)
//                       : addedDeposits.reduce((sum, d) => sum + d.deposit, 0)
//                     ).toLocaleString()}
//                   </p>
//                 </div>
//                 <FiExternalLink className="w-8 h-8 text-purple-400" />
//               </div>
//             </div>
//           </div>

//           {/* Filters and Add Deposit button */}
//           <div className="flex flex-col md:flex-row gap-4 mb-6 items-center justify-between">
//             <div className="flex bg-slate-800/50 rounded-lg p-1 border border-slate-700/50">
//               <button
//                 onClick={() => setFilter('all')}
//                 className={`px-4 py-2 rounded-md font-medium transition-colors ${
//                   filter === 'all'
//                     ? 'bg-blue-600 text-white'
//                     : 'text-slate-400 hover:text-white'
//                 }`}
//               >
//                 All ({getFilteredItems().length})
//               </button>
//               <button
//                 onClick={() => setFilter('pending')}
//                 className={`px-4 py-2 rounded-md font-medium transition-colors ${
//                   filter === 'pending'
//                     ? 'bg-yellow-600 text-white'
//                     : 'text-slate-400 hover:text-white'
//                 }`}
//               >
//                 Pending ({activeTab === 'deposits' ? pendingDepositCount : activeTab === 'withdrawals' ? pendingWithdrawalCount : 0})
//               </button>
//               <button
//                 onClick={() => setFilter('completed')}
//                 className={`px-4 py-2 rounded-md font-medium transition-colors ${
//                   filter === 'completed'
//                     ? 'bg-green-600 text-white'
//                     : 'text-slate-400 hover:text-white'
//                 }`}
//               >
//                 Completed ({activeTab === 'deposits' ? completedDepositCount : activeTab === 'withdrawals' ? completedWithdrawalCount : addedDepositCount})
//               </button>
//             </div>
            
//             <div className="flex-1 max-w-md flex gap-4">
//               <input
//                 type="text"
//                 placeholder="Search by email..."
//                 value={searchEmail}
//                 onChange={(e) => setSearchEmail(e.target.value)}
//                 className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
//               />
//               {activeTab === 'added_deposits' && (
//                 <button
//                   onClick={() => setShowAddDepositModal(true)}
//                   className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
//                 >
//                   <FiPlusCircle className="w-4 h-4" />
//                   Add Deposit
//                 </button>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Responsive Table/List View */}
//         <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50">
//           <div className="hidden md:block">
//             {/* Desktop Table View */}
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead className="bg-slate-700/50">
//                   <tr>
//                     <th className="text-left p-4 text-slate-300 font-medium">User</th>
//                     {activeTab === 'deposits' && <th className="text-left p-4 text-slate-300 font-medium">Wallet Type</th>}
//                     <th className="text-left p-4 text-slate-300 font-medium">Amount</th>
//                     <th className="text-left p-4 text-slate-300 font-medium">Status</th>
//                     <th className="text-left p-4 text-slate-300 font-medium">Actions</th>
//                     <th className="text-left p-4 text-slate-300 font-medium"></th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {activeTab === 'deposits' ? (
//                     filteredTransactions.map((transaction) => {
//                       const isExpanded = expandedRows.has(transaction.id);
//                       return (
//                         <React.Fragment key={transaction.id}>
//                           <tr className="border-t border-slate-700/50 hover:bg-slate-700/25">
//                             <td className="p-4"><UserInfo email={transaction.email} id={transaction.id} /></td>
//                             <td className="p-4">
//                               <div className="flex items-center gap-2">
//                                 <span className="text-2xl">{TIER_CONFIG[transaction.wallet_type].icon}</span>
//                                 <div>
//                                   <p className={`font-medium`}>{TIER_CONFIG[transaction.wallet_type].name}</p>
//                                 </div>
//                               </div>
//                             </td>
//                             <td className="p-4">
//                               {editingAmountId === transaction.id ? (
//                                 <div className="flex items-center gap-2">
//                                   <input type="number" value={editAmount} onChange={(e) => setEditAmount(parseFloat(e.target.value))} className="w-24 bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white text-sm focus:outline-none focus:border-blue-500"/>
//                                   <button onClick={() => handleSaveAmount(transaction.id)} className="bg-green-600 hover:bg-green-700 text-white p-1 rounded transition-colors"><FiSave className="w-4 h-4" /></button>
//                                   <button onClick={cancelEditingAmount} className="bg-slate-600 hover:bg-slate-700 text-white p-1 rounded transition-colors"><FiX className="w-4 h-4" /></button>
//                                 </div>
//                               ) : (
//                                 <div className="flex items-center gap-2">
//                                   <p className="text-white font-medium">${transaction.amount.toLocaleString()}</p>
//                                   <button onClick={() => startEditingAmount(transaction.id, transaction.amount)} className="text-slate-400 hover:text-white transition-colors"><FiEdit3 className="w-4 h-4" /></button>
//                                 </div>
//                               )}
//                             </td>
                            
//                             <td className="p-4">{renderDepositStatus(transaction.account_number)}</td>
//                             <td className="p-4">
//                               <ActionsMenu
//                                 item={transaction}
//                                 activeTab={activeTab}
//                                 onConfirm={() => {
//                                   setCurrentTransactionId(transaction.id);
//                                   setShowConfirmationModal(true);
//                                 }}
//                                 onDelete={deleteItem}
//                                 onEditWalletAddress={startEditingWalletAddress}
//                               />
//                             </td>
//                             <td className="p-4">
//                               <button onClick={() => toggleRowExpand(transaction.id)} className="text-slate-400 hover:text-white cursor-pointer transition-colors">
//                                 {isExpanded ? (<FiChevronUp className="w-4 h-4" />) : (<FiChevronDown className="w-4 h-4" />)}
//                               </button>
//                             </td>
//                           </tr>
//                           {isExpanded && (
//                             <tr className="bg-slate-700/10 border-b border-slate-700/30">
//                               <td colSpan={8} className="p-4">
//                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-16">
//                                   <div className="space-y-2">
//                                     <h4 className="font-medium text-slate-300">Transaction Details</h4>
//                                     <div className="space-y-1">
//                                       <div className="flex items-center gap-2">
//                                         <span className="text-slate-400">Token/Network:</span>
//                                         <span className="text-white">{transaction.token_type} ({transaction.network})</span>
//                                       </div>
//                                       <div>
//                                         <div className="font-medium text-slate-300 mt-2">Wallet Address:</div>
//                                         {editingId === transaction.id ? (
//                                           <div className="flex items-center gap-2 mt-1">
//                                             <input type="text" value={editAccountNumber} onChange={(e) => setEditAccountNumber(e.target.value)} placeholder="Enter wallet address" className="flex-1 bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white text-sm"/>
//                                             <button onClick={() => handleSaveWalletAddress(transaction.id)} disabled={updatingId === transaction.id} className="bg-green-600 hover:bg-green-700 text-white p-1 rounded disabled:opacity-50"><FiSave className="w-4 h-4" /></button>
//                                             <button onClick={cancelEditingWalletAddress} className="bg-slate-600 hover:bg-slate-700 text-white p-1 rounded transition-colors"><FiX className="w-4 h-4" /></button>
//                                           </div>
//                                         ) : (
//                                           <div className="flex items-center gap-2 mt-1">
//                                             <span className="font-mono text-slate-300 break-all">{transaction.account_number || "Not assigned"}</span>
//                                             <button onClick={() => startEditingWalletAddress(transaction.id, transaction.account_number || "")} className="text-slate-400 hover:text-white transition-colors"><FiEdit3 className="w-4 h-4" /></button>
//                                           </div>
//                                         )}
//                                       </div>
//                                       <div>
//                                         <div className="font-medium text-slate-300 mt-2">Created Date:</div>
//                                         {editingDateId === transaction.id ? (
//                                           <div className="flex items-center gap-2 mt-1">
//                                             <DatePicker selected={editDate} onChange={(date: Date | null) => setEditDate(date)} showTimeSelect timeFormat="HH:mm" timeIntervals={15} dateFormat="MMM d, yyyy h:mm aa" className="w-full bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white text-sm focus:outline-none focus:border-blue-500"/>
//                                             <button onClick={() => handleSaveDate(transaction.id)} className="bg-green-600 hover:bg-green-700 text-white p-1 rounded transition-colors"><FiSave className="w-4 h-4" /></button>
//                                             <button onClick={cancelEditingDate} className="bg-slate-600 hover:bg-slate-700 text-white p-1 rounded transition-colors"><FiX className="w-4 h-4" /></button>
//                                           </div>
//                                         ) : (
//                                           <div className="flex items-center gap-2 mt-1">
//                                             <span className="font-mono text-slate-300">{formatDate(transaction.created_at)}</span>
//                                             <button onClick={() => startEditingDate(transaction.id, transaction.created_at)} className="text-slate-400 hover:text-white transition-colors"><FiEdit3 className="w-4 h-4" /></button>
//                                           </div>
//                                         )}
//                                       </div>
//                                     </div>
//                                   </div>
//                                 </div>
//                               </td>
//                             </tr>
//                           )}
//                         </React.Fragment>
//                       );
//                     })
//                   ) : activeTab === 'withdrawals' ? (
//                     filteredWithdrawals.map((withdrawal) => {
//                       const isExpanded = expandedRows.has(withdrawal.id);
//                       return (
//                         <React.Fragment key={withdrawal.id}>
//                           <tr className="border-t border-slate-700/50 hover:bg-slate-700/25">
//                             <td className="p-4"><UserInfo email={withdrawal.email} id={withdrawal.id} /></td>
//                             <td className="p-4">
//                               <div className="flex items-center gap-2">
//                                 {editingAmountId === withdrawal.id ? (
//                                   <input type="number" value={editAmount} onChange={(e) => setEditAmount(parseFloat(e.target.value))} className="w-24 bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white text-sm focus:outline-none focus:border-blue-500"/>
//                                 ) : (
//                                   <p className="text-white font-medium">${withdrawal.amount.toLocaleString()}</p>
//                                 )}
//                                 <button onClick={editingAmountId === withdrawal.id ? () => handleSaveAmount(withdrawal.id) : () => startEditingAmount(withdrawal.id, withdrawal.amount)} className="text-slate-400 hover:text-white transition-colors">
//                                   {editingAmountId === withdrawal.id ? <FiSave className="w-4 h-4" /> : <FiEdit3 className="w-4 h-4" />}
//                                 </button>
//                                 {editingAmountId === withdrawal.id && (<button onClick={cancelEditingAmount} className="bg-slate-600 hover:bg-slate-700 text-white p-1 rounded transition-colors"><FiX className="w-4 h-4" /></button>)}
//                               </div>
//                             </td>
//                             <td className="p-4">
//                               <StatusPill status={withdrawal.status} type="withdrawal" />
//                             </td>
//                             <td className="p-4">
//                               <ActionsMenu
//                                 item={withdrawal}
//                                 activeTab={activeTab}
//                                 onConfirm={() => {
//                                   setCurrentTransactionId(withdrawal.id);
//                                   setShowConfirmationModal(true);
//                                 }}
//                                 onDelete={deleteItem}
//                               />
//                             </td>
//                             <td className="p-4">
//                               <button onClick={() => toggleRowExpand(withdrawal.id)} className="text-slate-400 hover:text-white transition-colors">
//                                 {isExpanded ? (<FiChevronUp className="w-4 h-4" />) : (<FiChevronDown className="w-4 h-4" />)}
//                               </button>
//                             </td>
//                           </tr>
//                           {isExpanded && (
//                             <tr className="bg-slate-700/10 border-b border-slate-700/30">
//                               <td colSpan={6} className="p-4">
//                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-16">
//                                   <div className="space-y-2">
//                                     <h4 className="font-medium text-slate-300">Withdrawal Details</h4>
//                                     <div className="space-y-1">
//                                       <div className="flex items-center gap-2">
//                                         <span className="text-slate-400">Token/Network:</span>
//                                         <span className="text-white">{withdrawal.token_type} ({withdrawal.network})</span>
//                                       </div>
//                                       {withdrawal.status && (
//                                         <div className="flex items-center gap-2">
//                                           <span className="text-slate-400">Completed:</span>
//                                           <span className="text-slate-300">{formatDate(withdrawal.updated_at)}</span>
//                                         </div>
//                                       )}
//                                       <div>
//                                         <div className="font-medium text-slate-300 mt-2">Wallet Address:</div>
//                                         {editingId === withdrawal.id ? (
//                                           <div className="flex items-center gap-2 mt-1">
//                                             <input type="text" value={editAccountNumber} onChange={(e) => setEditAccountNumber(e.target.value)} placeholder="Enter wallet address" className="flex-1 bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white text-sm"/>
//                                             <button onClick={() => handleSaveWalletAddress(withdrawal.id)} disabled={updatingId === withdrawal.id} className="bg-green-600 hover:bg-green-700 text-white p-1 rounded disabled:opacity-50"><FiSave className="w-4 h-4" /></button>
//                                             <button onClick={cancelEditingWalletAddress} className="bg-slate-600 hover:bg-slate-700 text-white p-1 rounded transition-colors"><FiX className="w-4 h-4" /></button>
//                                           </div>
//                                         ) : (
//                                           <div className="flex items-center gap-2 mt-1">
//                                             <span className="font-mono text-slate-300 break-all">{withdrawal.account_number}</span>
//                                             <button onClick={() => startEditingWalletAddress(withdrawal.id, withdrawal.account_number || "")} className="text-slate-400 hover:text-white transition-colors"><FiEdit3 className="w-4 h-4" /></button>
//                                           </div>
//                                         )}
//                                       </div>
//                                       <div>
//                                         <div className="font-medium text-slate-300 mt-2">Created Date:</div>
//                                         {editingDateId === withdrawal.id ? (
//                                           <div className="flex items-center gap-2 mt-1">
//                                             <DatePicker selected={editDate} onChange={(date: Date | null) => setEditDate(date)} showTimeSelect timeFormat="HH:mm" timeIntervals={15} dateFormat="MMM d, yyyy h:mm aa" className="w-full bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white text-sm focus:outline-none focus:border-blue-500"/>
//                                             <button onClick={() => handleSaveDate(withdrawal.id)} className="bg-green-600 hover:bg-green-700 text-white p-1 rounded transition-colors"><FiSave className="w-4 h-4" /></button>
//                                             <button onClick={cancelEditingDate} className="bg-slate-600 hover:bg-slate-700 text-white p-1 rounded transition-colors"><FiX className="w-4 h-4" /></button>
//                                           </div>
//                                         ) : (
//                                           <div className="flex items-center gap-2 mt-1">
//                                             <span className="font-mono text-slate-300">{formatDate(withdrawal.created_at)}</span>
//                                             <button onClick={() => startEditingDate(withdrawal.id, withdrawal.created_at)} className="text-slate-400 hover:text-white transition-colors"><FiEdit3 className="w-4 h-4" /></button>
//                                           </div>
//                                         )}
//                                       </div>
//                                     </div>
//                                   </div>
//                                 </div>
//                               </td>
//                             </tr>
//                           )}
//                         </React.Fragment>
//                       );
//                     })
//                   ) : (
//                     // Added Deposits table view
//                     filteredAddedDeposits.map((deposit) => {
//                       const isExpanded = expandedRows.has(deposit.id);
//                       return (
//                         <React.Fragment key={deposit.id}>
//                           <tr className="border-t border-slate-700/50 hover:bg-slate-700/25">
//                             <td className="p-4"><UserInfo email={deposit.email} id={deposit.id} /></td>
                            
//                             <td className="p-4">
//                               {editingAddedDepositAmountId === deposit.id ? (
//                                 <div className="flex items-center gap-2">
//                                   <input type="number" value={editAddedDepositAmount} onChange={(e) => setEditAddedDepositAmount(parseFloat(e.target.value))} className="w-24 bg-slate-700 border
//                                    border-slate-600 rounded px-2 py-1 text-white text-sm focus:outline-none focus:border-blue-500"/>
//                                   <button onClick={() => handleSaveAddedDepositAmount(deposit.id)} className="bg-green-600 hover:bg-green-700
//                                    text-white p-1 rounded transition-colors"><FiSave className="w-4 h-4" /></button>
//                                   <button onClick={cancelEditingAddedDepositAmount} className="bg-slate-600 hover:bg-slate-700 text-white p-1 
//                                   rounded transition-colors"><FiX className="w-4 h-4" /></button>
//                                 </div>
//                               ) : (
//                                 <div className="flex items-center gap-2">
//                                   <p className="text-white font-medium">${deposit.deposit.toLocaleString()}</p>
//                                   <button onClick={() => startEditingAddedDepositAmount(deposit.id, deposit.deposit)} className="text-slate-400
//                                    hover:text-white transition-colors"><FiEdit3 className="w-4 h-4" /></button>
//                                 </div>
//                               )}
//                             </td>
//                             <td className="p-4">
//                               <StatusPill status={deposit.status} type="deposit" />
//                             </td>
                           
//                             <td className="p-4">
//                               <ActionsMenu
//                                 item={deposit}
//                                 activeTab={activeTab}
//                                 onDelete={deleteItem}
//                                 onConfirm={() => {}} // No confirmation needed for already added deposits
//                               />
//                             </td>
//                             <td className="p-4">
//                               <button onClick={() => toggleRowExpand(deposit.id)} className="text-slate-400 hover:text-white transition-colors">
//                                 {isExpanded ? (<FiChevronUp className="w-4 h-4" />) : (<FiChevronDown className="w-4 h-4" />)}
//                               </button>
//                             </td>
//                           </tr>
//                           {isExpanded && (
//                             <tr className="bg-slate-700/10 border-b border-slate-700/30">
//                               <td colSpan={6} className="p-4">
//                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-16">
//                                   <div className="space-y-2">
//                                     <h4 className="font-medium text-slate-300">Deposit Details</h4>
//                                     <div className="space-y-1">
//                                       <div className="flex items-center gap-2">
//                                         <span className="text-slate-400">Created Date:</span>
//                                         <span className="text-white">

//                                           <div className="">
//                               {editingAddedDepositDateId === deposit.id ? (
//                                 <div className="flex items-center gap-2">
//                                   <DatePicker selected={editAddedDepositDate} onChange={(date: Date | null) => setEditAddedDepositDate(date)} showTimeSelect timeFormat="HH:mm" timeIntervals={15} dateFormat="MMM d, yyyy h:mm aa" className="w-40 bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white text-sm focus:outline-none focus:border-blue-500"/>
//                                   <button onClick={() => handleSaveAddedDepositDate(deposit.id)} className="bg-green-600 hover:bg-green-700 text-white p-1 rounded transition-colors"><FiSave className="w-4 h-4" /></button>
//                                   <button onClick={cancelEditingAddedDepositDate} className="bg-slate-600 hover:bg-slate-700 text-white p-1 rounded transition-colors"><FiX className="w-4 h-4" /></button>
//                                 </div>
//                               ) : (
//                                 <div className="flex items-center gap-2">
//                                   <p className="text-white font-medium">{formatDate(deposit.created_at)}</p>
//                                   <button onClick={() => startEditingAddedDepositDate(deposit.id, deposit.created_at)} className="text-slate-400 hover:text-white transition-colors"><FiEdit3 className="w-4 h-4" /></button>
//                                 </div>
//                               )}
//                             </div>
//                                         </span>
//                                       </div>
                                       
//                                     </div>
//                                   </div>
//                                 </div>
//                               </td>
//                             </tr>
//                           )}
//                         </React.Fragment>
//                       );
//                     })
//                   )}
//                 </tbody>
//               </table>
//             </div>
//             {getFilteredItems().length === 0 && (
//               <div className="text-center py-12">
//                 <div className="text-slate-400 mb-4">
//                   <FiEye className="w-12 h-12 mx-auto mb-2" />
//                   <p>No {activeTab.replace('_', ' ')} requests found</p>
//                   <p className="text-sm">
//                     {filter === 'pending' && `No pending ${activeTab.replace('_', ' ')} at the moment`}
//                     {filter === 'completed' && `No completed ${activeTab.replace('_', ' ')} found`}
//                     {filter === 'all' && searchEmail && `No results for "${searchEmail}"`}
//                   </p>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Mobile Card View */}
//           <div className="md:hidden p-4 space-y-4">
//             {getFilteredItems().length > 0 ? (
//               getFilteredItems().map((item) => {
//                 const isExpanded = expandedRows.has(item.id);
//                 return (
//                   <div key={item.id} className="bg-slate-700/30 rounded-lg border border-slate-600/50 p-4">
//                     <div className="flex items-center justify-between" onClick={() => toggleRowExpand(item.id)}>
//                       <div className="flex items-center gap-3">
//                         <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center">
//                           <FiUser className="w-4 h-4 text-slate-300" />
//                         </div>
//                         <div>
//                           <p className="text-white font-medium text-sm">{item.email}</p>
//                           <p className="text-slate-400 text-xs">{formatDate(item.created_at)}</p>
//                         </div>
//                       </div>
//                       <div className="flex items-center gap-2">
//                         <span className="text-white font-bold text-sm">
//                           ${('amount' in item ? item.amount : item.deposit).toLocaleString()}
//                         </span>
//                         <button className="text-slate-400">
//                           {isExpanded ? <FiChevronUp /> : <FiChevronDown />}
//                         </button>
//                       </div>
//                     </div>
//                     {isExpanded && (
//                       <div className="mt-4 border-t border-slate-600/50 pt-4 space-y-3 text-sm">
//                         <div className="flex items-center gap-2">
//                           <FiMail className="text-slate-400" />
//                           <span className="text-slate-300 break-all">{item.email}</span>
//                         </div>
//                         {/* <div className="flex items-center gap-2">
//                           <FiClock className="text-slate-400" />
//                           <StatusPill status={'status' in item ? item.status : !!item.account_number} type={activeTab === 'withdrawals' ? 'withdrawal' : 'deposit'} />
//                         </div> */}
//                         {'wallet_type' in item && (
//                           <div className="flex items-center gap-2">
//                             <span className="text-2xl">{TIER_CONFIG[item.wallet_type].icon}</span>
//                             <span className="text-white">{TIER_CONFIG[item.wallet_type].name}</span>
//                           </div>
//                         )}
//                         <div>
//                           <div className="font-medium text-slate-300">Amount:</div>
//                           <div className="flex items-center gap-2 mt-1">
//                             {editingAmountId === item.id ? (
//                                 <>
//                                   <input type="number" value={editAmount} onChange={(e) => setEditAmount(parseFloat(e.target.value))} className="w-20 bg-slate-700 border border-slate-600 rounded px-1 text-white text-xs"/>
//                                   <button onClick={() => handleSaveAmount(item.id)} className="bg-green-600 hover:bg-green-700 text-white p-1 rounded transition-colors"><FiSave className="w-4 h-4" /></button>
//                                   <button onClick={cancelEditingAmount} className="bg-slate-600 hover:bg-slate-700 text-white p-1 rounded transition-colors"><FiX className="w-4 h-4" /></button>
//                                 </>
//                             ) : (
//                                 <>
//                                   <span className="text-white">${('amount' in item ? item.amount : item.deposit).toLocaleString()}</span>
//                                   {activeTab !== 'added_deposits' && (
//                                     <button onClick={() => startEditingAmount(item.id, ('amount' in item ? item.amount : item.deposit))} className="text-slate-400 hover:text-white transition-colors"><FiEdit3 className="w-4 h-4" /> Edit Amount</button>
//                                   )}
//                                 </>
//                             )}
//                           </div>
//                         </div>
                        
//                         <div>
//                           <div className="font-medium text-slate-300">Date:</div>
//                           <div className="flex items-center gap-2 mt-1">
//                             {editingDateId === item.id ? (
//                                 <>
//                                   <DatePicker selected={editDate} onChange={(date: Date | null) => setEditDate(date)} showTimeSelect timeFormat="HH:mm" timeIntervals={15} dateFormat="MMM d, yyyy h:mm aa" className="w-full bg-slate-700 border border-slate-600 rounded px-1 text-white text-xs"/>
//                                   <button onClick={() => handleSaveDate(item.id)} className="bg-green-600 hover:bg-green-700 text-white p-1 rounded transition-colors"><FiSave className="w-4 h-4" /></button>
//                                   <button onClick={cancelEditingDate} className="bg-slate-600 hover:bg-slate-700 text-white p-1 rounded transition-colors"><FiX className="w-4 h-4" /></button>
//                                 </>
//                             ) : (
//                                 <>
//                                   <span className="text-white">{formatDate(item.created_at)}</span>
//                                   <button onClick={() => startEditingDate(item.id, item.created_at)} className="text-slate-400 hover:text-white transition-colors"><FiEdit3 className="w-4 h-4" /></button>
//                                 </>
//                             )}
//                           </div>
//                         </div>
//                         {'account_number' in item && activeTab !== 'added_deposits' && (
//                           <div>
//                             <div className="font-medium text-slate-300">Wallet Assignment:</div>
//                             {editingId === item.id ? (
//                                 <div className="flex items-center gap-2 mt-1">
//                                   <input type="text" value={editAccountNumber} onChange={(e) => setEditAccountNumber(e.target.value)} placeholder="Enter wallet address" className="flex-1 bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white text-sm"/>
//                                   <button onClick={() => handleSaveWalletAddress(item.id)} disabled={updatingId === item.id} className="bg-green-600 hover:bg-green-700 text-white p-1 rounded disabled:opacity-50"><FiSave className="w-4 h-4" /></button>
//                                   <button onClick={cancelEditingWalletAddress} className="bg-slate-600 hover:bg-slate-700 text-white p-1 rounded transition-colors"><FiX className="w-4 h-4" /></button>
//                                 </div>
//                             ) : (
//                                 <div className="flex items-center gap-2 mt-1">
//                                   <span className="font-mono text-slate-300 break-all">{item.account_number || "Not assigned"}</span>
//                                   <button onClick={() => startEditingWalletAddress(item.id, item.account_number || "")} className="text-slate-400 hover:text-white transition-colors"><FiEdit3 className="w-4 h-4" /></button>
//                                 </div>
//                             )}
//                           </div>
//                         )}
//                         <div className="mt-4">
//                           <ActionsMenu
//                             item={item}
//                             activeTab={activeTab}
//                             onConfirm={() => {
//                               setCurrentTransactionId(item.id);
//                               setShowConfirmationModal(true);
//                             }}
//                             onDelete={deleteItem}
//                             onEditWalletAddress={startEditingWalletAddress}
//                           />
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 );
//               })
//             ) : (
//               <div className="text-center py-12">
//                 <div className="text-slate-400 mb-4">
//                   <FiEye className="w-12 h-12 mx-auto mb-2" />
//                   <p>No {activeTab.replace('_', ' ')} requests found</p>
//                   <p className="text-sm">
//                     {filter === 'pending' && `No pending ${activeTab.replace('_', ' ')} at the moment`}
//                     {filter === 'completed' && `No completed ${activeTab.replace('_', ' ')} found`}
//                     {filter === 'all' && searchEmail && `No results for "${searchEmail}"`}
//                   </p>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Confirmation Modal */}
//         {showConfirmationModal && (
//           <div className="fixed inset-0 bg-opacity-40 backdrop-blur-md flex items-center justify-center z-50 p-4">
//             <div className="bg-slate-800 rounded-xl p-6 max-w-md w-full border border-slate-700">
//               <h3 className="text-xl font-bold text-white mb-4">Confirm Payment</h3>
//               <p className="text-slate-300 mb-6">
//                 Are you sure you want to confirm this {activeTab === 'deposits' ? 'deposit' : 'withdrawal'}?
//               </p>
//               <div className="flex justify-end gap-3">
//                 <button
//                   onClick={() => {
//                     setShowConfirmationModal(false);
//                     setCurrentTransactionId(null);
//                   }}
//                   className="px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-colors"
//                   disabled={isConfirming}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={async () => {
//                     if (!currentTransactionId) return;
//                     setIsConfirming(true);
//                     try {
//                       if (activeTab === 'deposits') {
//                         const transaction = transactions.find(t => t.id === currentTransactionId);
//                         if (transaction && transaction.account_number) {
//                           await updateWalletStatus(transaction.account_number, true);
//                         }
//                       } else {
//                         await updateWithdrawalStatus(currentTransactionId, true);
//                       }
//                       setShowConfirmationModal(false);
//                     } catch (error) {
//                       console.error('Error confirming payment:', error);
//                     } finally {
//                       setIsConfirming(false);
//                       setCurrentTransactionId(null);
//                     }
//                   }}
//                   className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center justify-center min-w-24"
//                   disabled={isConfirming}
//                 >
//                   {isConfirming ? (
//                     <FiRefreshCw className="animate-spin cursor-pointer h-5 w-5" />
//                   ) : (
//                     'Confirm'
//                   )}
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
        
//         {/* Add New Deposit Modal */}
//         {showAddDepositModal && (
//           <div className="fixed inset-0 bg-opacity-40 backdrop-blur-md flex items-center justify-center z-50 p-4">
//             <div className="bg-slate-800 rounded-xl p-6 max-w-md w-full border border-slate-700">
//               <h3 className="text-xl font-bold text-white mb-4">Add New Client Deposit</h3>
//               <div className="space-y-4">
//                 <div>
//                   <label htmlFor="deposit-email" className="block text-slate-300 text-sm font-medium mb-1">Client Email</label>
//                   <input
//                     id="deposit-email"
//                     type="email"
//                     value={newDepositEmail}
//                     onChange={(e) => setNewDepositEmail(e.target.value)}
//                     className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
//                     placeholder="Enter client email"
//                   />
//                 </div>
//                 <div>
//                   <label htmlFor="deposit-amount" className="block text-slate-300 text-sm font-medium mb-1">Deposit Amount</label>
//                   <input
//                     id="deposit-amount"
//                     type="number"
//                     value={newDepositAmount}
//                     onChange={(e) => setNewDepositAmount(parseFloat(e.target.value))}
//                     className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
//                     placeholder="Enter amount"
//                   />
//                 </div>
//               </div>
//               <div className="flex justify-end gap-3 mt-6">
//                 <button
//                   onClick={() => setShowAddDepositModal(false)}
//                   className="px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-colors"
//                   disabled={isAddingDeposit}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={addDeposit}
//                   className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center justify-center min-w-24"
//                   disabled={isAddingDeposit || !newDepositEmail || newDepositAmount <= 0}
//                 >
//                   {isAddingDeposit ? (
//                     <FiRefreshCw className="animate-spin cursor-pointer h-5 w-5" />
//                   ) : (
//                     'Add Deposit'
//                   )}
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AdminTransactionsPage;

"use client"
import React, { useState, useEffect } from 'react';
import { FiUser, FiMail, FiDollarSign, FiClock, FiEdit3, FiSave, FiX, FiCheck, FiEye, FiRefreshCw, FiExternalLink, FiChevronDown, FiChevronUp, FiTrash2, FiPlusCircle } from 'react-icons/fi';
import { createClient } from '@/app/utils/supabase/clients';
import { TIER_CONFIG, TransactionRequest, WithdrawalRequest } from '@/app/data';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

// Type for the new table
interface AddedDeposit {
  id: string;
  email: string;
  user_id: string;
  deposit: number;
  status: boolean;
  created_at: string;
}

// Reusable components
const StatusPill = ({ status, type }: { status: boolean; type: 'deposit' | 'withdrawal' }) => (
  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
    status ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
  }`}>
    {status ? 'Completed' : 'Pending'}
  </span>
);

const UserInfo = ({ email, id }: { email: string; id: string }) => (
  <div className="flex items-center gap-3">
    <div className="w-10 h-10 bg-slate-600 rounded-full flex items-center justify-center">
      <FiUser className="w-5 h-5 text-slate-300" />
    </div>
    <div>
      <p className="text-white font-medium">{email}</p>
      <p className="text-slate-400 text-sm">ID: {id}</p>
    </div>
  </div>
);

const ActionsMenu = ({ item, activeTab, onConfirm, onDelete, onEditWalletAddress }: any) => (
  <div className="flex items-center gap-2">
    {activeTab === 'deposits' ? (
      item.account_number ? (
        item.status ? (
          <span className="text-green-500 p-2 rounded-full"><FiCheck className="w-4 h-4" /></span>
        ) : (
          <button
            onClick={() => onConfirm(item.id)}
            className="bg-yellow-600 hover:bg-yellow-700 text-white p-2 rounded-full cursor-pointer transition-colors"
            aria-label="Confirm deposit"
          >
            <FiCheck className="w-4 h-4" />
          </button>
        )
      ) : (
        <button
          onClick={() => onEditWalletAddress(item.id, item.account_number || "")}
          className="bg-blue-600 cursor-pointer hover:bg-blue-700 text-white p-2 rounded-full transition-colors"
          aria-label="Edit wallet address"
        >
          <FiEdit3 className="w-4 h-4" />
        </button>
      )
    ) : activeTab === 'withdrawals' ? (
      !item.status ? (
        <button
          onClick={() => onConfirm(item.id)}
          className="bg-yellow-600 hover:bg-yellow-700 text-white p-2 rounded-full cursor-pointer transition-colors"
          aria-label="Confirm withdrawal"
        >
          <FiCheck className="w-4 h-4" />
        </button>
      ) : (
        <span className="text-green-500 p-2 rounded-full"><FiCheck className="w-4 h-4" /></span>
      )
    ) : (
      // Actions for 'added_deposits'
      <div className="flex items-center gap-2">
        <span className="text-green-500 p-2 rounded-full"><FiCheck className="w-4 h-4" /></span>
      </div>
    )}
    <button
      onClick={() => onDelete(item.id)}
      className="flex cursor-pointer items-center gap-1 p-2 bg-red-600/90 hover:bg-red-600 text-white rounded-full transition-colors border border-red-500/30"
      aria-label="Delete item"
    >
      <FiTrash2 className="w-4 h-4" />
    </button>
  </div>
);


const AdminTransactionsPage = () => {
  const [transactions, setTransactions] = useState<TransactionRequest[]>([]);
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([]);
  const [addedDeposits, setAddedDeposits] = useState<AddedDeposit[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editAccountNumber, setEditAccountNumber] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [searchEmail, setSearchEmail] = useState('');
  const [activeTab, setActiveTab] = useState<'deposits' | 'withdrawals' | 'added_deposits'>('deposits');
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [currentTransactionId, setCurrentTransactionId] = useState<string | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const [editingAmountId, setEditingAmountId] = useState<string | null>(null);
  const [editAmount, setEditAmount] = useState<number>(0);
  const [editingAddedAmountId, setEditingAddedAmountId] = useState<string | null>(null);
  const [editAddedAmount, setEditAddedAmount] = useState<number>(0);
  const [editingDateId, setEditingDateId] = useState<string | null>(null);
  const [editDate, setEditDate] = useState<Date | null>(null);
  
  // New state for adding a new deposit
  const [showAddDepositModal, setShowAddDepositModal] = useState(false);
  const [newDepositEmail, setNewDepositEmail] = useState('');
  const [newDepositAmount, setNewDepositAmount] = useState<number>(0);
  const [isAddingDeposit, setIsAddingDeposit] = useState(false);

  // New states for editing added deposits
  const [editingAddedDepositAmountId, setEditingAddedDepositAmountId] = useState<string | null>(null);
  const [editAddedDepositAmount, setEditAddedDepositAmount] = useState<number>(0);
  const [editingAddedDepositDateId, setEditingAddedDepositDateId] = useState<string | null>(null);
  const [editAddedDepositDate, setEditAddedDepositDate] = useState<Date | null>(null);
  
  const supabase = createClient();

  useEffect(() => {
    fetchTransactions();
    fetchWithdrawals();
    fetchAddedDeposits();
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

  const fetchAddedDeposits = async () => {
    try {
      const { data, error } = await supabase
        .from('add_new_deposit')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAddedDeposits(data || []);
    } catch (error) {
      console.error('Error fetching added deposits:', error);
    }
  };

  const addDeposit = async () => {
    setIsAddingDeposit(true);
    try {
      const { data, error } = await supabase
        .from('add_new_deposit')
        .insert([{ 
          email: newDepositEmail,
          deposit: newDepositAmount,
          status: true,
          created_at: new Date().toISOString()
        }])
        .select();

      if (error) throw error;
      
      setAddedDeposits(prev => [data[0], ...prev]);
      setShowAddDepositModal(false);
      setNewDepositEmail('');
      setNewDepositAmount(0);
    } catch (error) {
      console.error('Error adding new deposit:', error);
    } finally {
      setIsAddingDeposit(false);
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

  const updateWithdrawalAccountNumber = async (withdrawalId: string, accountNumber: string) => {
    try {
      setUpdatingId(withdrawalId);
      
      const { data, error } = await supabase
        .from('withdrawals')
        .update({ account_number: accountNumber })
        .eq('id', withdrawalId)
        .select()
        .single();

      if (error) throw error;

      setWithdrawals(prev => 
        prev.map(withdrawal => 
          withdrawal.id === withdrawalId 
            ? { ...withdrawal, account_number: accountNumber }
            : withdrawal
        )
      );

      setEditingId(null);
      setEditAccountNumber('');
      
    } catch (error) {
      console.error('Error updating withdrawal account number:', error);
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

  const updateTransactionAmount = async (transactionId: string, newAmount: number) => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .update({ amount: newAmount })
        .eq('id', transactionId)
        .select()
        .single();

      if (error) throw error;

      setTransactions(prev => 
        prev.map(transaction => 
          transaction.id === transactionId 
            ? { ...transaction, amount: newAmount }
            : transaction
        )
      );
      cancelEditingAmount();
    } catch (error) {
      console.error('Error updating transaction amount:', error);
    }
  };

  const updateAddedDepositAmount = async (depositId: string, newAmount: number) => {
    try {
      const { data, error } = await supabase
        .from('add_new_deposit')
        .update({ deposit: newAmount })
        .eq('id', depositId)
        .select()
        .single();

      if (error) throw error;

      setAddedDeposits(prev =>
        prev.map(deposit =>
          deposit.id === depositId
            ? { ...deposit, deposit: newAmount }
            : deposit
        )
      );
      cancelEditingAddedDepositAmount();
    } catch (error) {
      console.error('Error updating added deposit amount:', error);
    }
  };

  const updateTransactionAddedAmount = async (transactionId: string, newAddedAmount: number) => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .update({ added_amount: newAddedAmount })
        .eq('id', transactionId)
        .select()
        .single();

      if (error) throw error;

      setTransactions(prev => 
        prev.map(transaction => 
          transaction.id === transactionId 
            ? { ...transaction, added_amount: newAddedAmount }
            : transaction
        )
      );
      cancelEditingAddedAmount();
    } catch (error) {
      console.error('Error updating add amount:', error);
    }
  };

  const updateWithdrawalAmount = async (withdrawalId: string, newAmount: number) => {
    try {
      const { data, error } = await supabase
        .from('withdrawals')
        .update({ amount: newAmount })
        .eq('id', withdrawalId)
        .select()
        .single();

      if (error) throw error;

      setWithdrawals(prev => 
        prev.map(withdrawal => 
          withdrawal.id === withdrawalId 
            ? { ...withdrawal, amount: newAmount }
            : withdrawal
        )
      );
      cancelEditingAmount();
    } catch (error) {
      console.error('Error updating withdrawal amount:', error);
    }
  };

  const updateTransactionDate = async (transactionId: string, newDate: Date) => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .update({ created_at: newDate.toISOString() })
        .eq('id', transactionId)
        .select()
        .single();

      if (error) throw error;

      setTransactions(prev => 
        prev.map(transaction => 
          transaction.id === transactionId 
            ? { ...transaction, created_at: newDate.toISOString() }
            : transaction
        )
      );
      cancelEditingDate();
    } catch (error) {
      console.error('Error updating transaction date:', error);
    }
  };

  const updateAddedDepositDate = async (depositId: string, newDate: Date) => {
    try {
      const { data, error } = await supabase
        .from('add_new_deposit')
        .update({ created_at: newDate.toISOString() })
        .eq('id', depositId)
        .select()
        .single();

      if (error) throw error;

      setAddedDeposits(prev =>
        prev.map(deposit =>
          deposit.id === depositId
            ? { ...deposit, created_at: newDate.toISOString() }
            : deposit
        )
      );
      cancelEditingAddedDepositDate();
    } catch (error) {
      console.error('Error updating added deposit date:', error);
    }
  };

  const deleteItem = async (id: string) => {
    if (!confirm(`Are you sure you want to delete this ${activeTab.slice(0, -1)}?`)) return;

    try {
      setLoading(true);
      if (activeTab === 'deposits') {
        const { error } = await supabase.from('transactions').delete().eq('id', id);
        if (error) throw error;
        setTransactions(prev => prev.filter(transaction => transaction.id !== id));
      } else if (activeTab === 'withdrawals') {
        const { error } = await supabase.from('withdrawals').delete().eq('id', id);
        if (error) throw error;
        setWithdrawals(prev => prev.filter(withdrawal => withdrawal.id !== id));
      } else if (activeTab === 'added_deposits') {
        const { error } = await supabase.from('add_new_deposit').delete().eq('id', id);
        if (error) throw error;
        setAddedDeposits(prev => prev.filter(deposit => deposit.id !== id));
      }
    } catch (error) {
      console.error(`Error deleting ${activeTab.slice(0, -1)}:`, error);
    } finally {
      setLoading(false);
    }
  };

  const startEditingAmount = (id: string, currentAmount: number) => {
    setEditingAmountId(id);
    setEditAmount(currentAmount);
  };

  const handleSaveAmount = (id: string) => {
    if (editAmount > 0) {
      if (activeTab === 'deposits') {
        updateTransactionAmount(id, editAmount);
      } else {
        updateWithdrawalAmount(id, editAmount);
      }
    }
  };

  const cancelEditingAmount = () => {
    setEditingAmountId(null);
    setEditAmount(0);
  };

  const startEditingAddedAmount = (id: string, currentAddedAmount: number) => {
    setEditingAddedAmountId(id);
    setEditAddedAmount(currentAddedAmount);
  };

  const handleSaveAddedAmount = (id: string) => {
    if (editAddedAmount > 0) {
      updateTransactionAddedAmount(id, editAddedAmount);
    }
  };

  const cancelEditingAddedAmount = () => {
    setEditingAddedAmountId(null);
    setEditAddedAmount(0);
  };

  const startEditingDate = (id: string, currentDate: string) => {
    setEditingDateId(id);
    setEditDate(new Date(currentDate));
  };

  const handleSaveDate = (id: string) => {
    if (editDate) {
      updateTransactionDate(id, editDate);
    }
  };

  const cancelEditingDate = () => {
    setEditingDateId(null);
    setEditDate(null);
  };

  // New functions for Added Deposits
  const startEditingAddedDepositAmount = (id: string, currentAmount: number) => {
    setEditingAddedDepositAmountId(id);
    setEditAddedDepositAmount(currentAmount);
  };

  const handleSaveAddedDepositAmount = (id: string) => {
    if (editAddedDepositAmount > 0) {
      updateAddedDepositAmount(id, editAddedDepositAmount);
    }
  };

  const cancelEditingAddedDepositAmount = () => {
    setEditingAddedDepositAmountId(null);
    setEditAddedDepositAmount(0);
  };

  const startEditingAddedDepositDate = (id: string, currentDate: string) => {
    setEditingAddedDepositDateId(id);
    setEditAddedDepositDate(new Date(currentDate));
  };

  const handleSaveAddedDepositDate = (id: string) => {
    if (editAddedDepositDate) {
      updateAddedDepositDate(id, editAddedDepositDate);
    }
  };

  const cancelEditingAddedDepositDate = () => {
    setEditingAddedDepositDateId(null);
    setEditAddedDepositDate(null);
  };

  const startEditingWalletAddress = (id: string, currentAddress: string) => {
    setEditingId(id);
    setEditAccountNumber(currentAddress);
  };

  const handleSaveWalletAddress = (id: string) => {
    if (editAccountNumber.trim()) {
      if (activeTab === 'deposits') {
        updateAccountNumber(id, editAccountNumber.trim());
      } else {
        updateWithdrawalAccountNumber(id, editAccountNumber.trim());
      }
    }
  };

  const cancelEditingWalletAddress = () => {
    setEditingId(null);
    setEditAccountNumber('');
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

  const filteredAddedDeposits = addedDeposits.filter(deposit => {
    const matchesFilter = filter === 'all' || 
      (filter === 'pending' && !deposit.status) ||
      (filter === 'completed' && deposit.status);
    
    const matchesSearch = !searchEmail || 
      deposit.email.toLowerCase().includes(searchEmail.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const pendingDepositCount = transactions.filter(t => !t.status).length;
  const completedDepositCount = transactions.filter(t => t.status).length;
  const pendingWithdrawalCount = withdrawals.filter(w => !w.status).length;
  const completedWithdrawalCount = withdrawals.filter(w => w.status).length;
  const addedDepositCount = addedDeposits.length;

  const renderDepositStatus = (accountNumber: string | null) => (
    accountNumber ? (
      <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded-full text-xs font-medium">
        Completed
      </span>
    ) : (
      <span className="bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full text-xs font-medium">
        Pending
      </span>
    )
  );

  const getFilteredItems = () => {
    if (activeTab === 'deposits') return filteredTransactions;
    if (activeTab === 'withdrawals') return filteredWithdrawals;
    return filteredAddedDeposits;
  };
  
  // Get unique emails from all transactions and withdrawals
  const allEmails = [...new Set([
    ...transactions.map(t => t.email),
    ...withdrawals.map(w => w.email)
  ])];


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
                else if (activeTab === 'withdrawals') fetchWithdrawals();
                else fetchAddedDeposits();
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
            <button
              onClick={() => setActiveTab('added_deposits')}
              className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors ${
                activeTab === 'added_deposits'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Added Deposits
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Total {activeTab === 'deposits' ? 'Deposits' : activeTab === 'withdrawals' ? 'Withdrawals' : 'Added Deposits'}</p>
                  <p className="text-2xl font-bold text-white">
                    {activeTab === 'deposits' ? transactions.length : activeTab === 'withdrawals' ? withdrawals.length : addedDeposits.length}
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
                    {activeTab === 'deposits' ? pendingDepositCount : activeTab === 'withdrawals' ? pendingWithdrawalCount : 0}
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
                    {activeTab === 'deposits' ? completedDepositCount : activeTab === 'withdrawals' ? completedWithdrawalCount : addedDepositCount}
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
                      : activeTab === 'withdrawals'
                      ? withdrawals.reduce((sum, w) => sum + w.amount, 0)
                      : addedDeposits.reduce((sum, d) => sum + d.deposit, 0)
                    ).toLocaleString()}
                  </p>
                </div>
                <FiExternalLink className="w-8 h-8 text-purple-400" />
              </div>
            </div>
          </div>

          {/* Filters and Add Deposit button */}
          <div className="flex flex-col md:flex-row gap-4 mb-6 items-center justify-between">
            <div className="flex bg-slate-800/50 rounded-lg p-1 border border-slate-700/50">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  filter === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                All ({getFilteredItems().length})
              </button>
              <button
                onClick={() => setFilter('pending')}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  filter === 'pending'
                    ? 'bg-yellow-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Pending ({activeTab === 'deposits' ? pendingDepositCount : activeTab === 'withdrawals' ? pendingWithdrawalCount : 0})
              </button>
              <button
                onClick={() => setFilter('completed')}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  filter === 'completed'
                    ? 'bg-green-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Completed ({activeTab === 'deposits' ? completedDepositCount : activeTab === 'withdrawals' ? completedWithdrawalCount : addedDepositCount})
              </button>
            </div>
            
            <div className="flex-1 max-w-md flex gap-4">
              <input
                type="text"
                placeholder="Search by email..."
                value={searchEmail}
                onChange={(e) => setSearchEmail(e.target.value)}
                className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
              />
              {activeTab === 'added_deposits' && (
                <button
                  onClick={() => setShowAddDepositModal(true)}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  <FiPlusCircle className="w-4 h-4" />
                  Add Deposit
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Responsive Table/List View */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50">
          <div className="hidden md:block">
            {/* Desktop Table View */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-700/50">
                  <tr>
                    <th className="text-left p-4 text-slate-300 font-medium">User</th>
                    {activeTab === 'deposits' && <th className="text-left p-4 text-slate-300 font-medium">Wallet Type</th>}
                    <th className="text-left p-4 text-slate-300 font-medium">Amount</th>
                    <th className="text-left p-4 text-slate-300 font-medium">Status</th>
                    <th className="text-left p-4 text-slate-300 font-medium">Actions</th>
                    <th className="text-left p-4 text-slate-300 font-medium"></th>
                  </tr>
                </thead>
                <tbody>
                  {activeTab === 'deposits' ? (
                    filteredTransactions.map((transaction) => {
                      const isExpanded = expandedRows.has(transaction.id);
                      return (
                        <React.Fragment key={transaction.id}>
                          <tr className="border-t border-slate-700/50 hover:bg-slate-700/25">
                            <td className="p-4"><UserInfo email={transaction.email} id={transaction.id} /></td>
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                <span className="text-2xl">{TIER_CONFIG[transaction.wallet_type].icon}</span>
                                <div>
                                  <p className={`font-medium`}>{TIER_CONFIG[transaction.wallet_type].name}</p>
                                </div>
                              </div>
                            </td>
                            <td className="p-4">
                              {editingAmountId === transaction.id ? (
                                <div className="flex items-center gap-2">
                                  <input type="number" value={editAmount} onChange={(e) => setEditAmount(parseFloat(e.target.value))} className="w-24 bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white text-sm focus:outline-none focus:border-blue-500"/>
                                  <button onClick={() => handleSaveAmount(transaction.id)} className="bg-green-600 hover:bg-green-700 text-white p-1 rounded transition-colors"><FiSave className="w-4 h-4" /></button>
                                  <button onClick={cancelEditingAmount} className="bg-slate-600 hover:bg-slate-700 text-white p-1 rounded transition-colors"><FiX className="w-4 h-4" /></button>
                                </div>
                              ) : (
                                <div className="flex items-center gap-2">
                                  <p className="text-white font-medium">${transaction.amount.toLocaleString()}</p>
                                  <button onClick={() => startEditingAmount(transaction.id, transaction.amount)} className="text-slate-400 hover:text-white transition-colors"><FiEdit3 className="w-4 h-4" /></button>
                                </div>
                              )}
                            </td>
                            
                            <td className="p-4">{renderDepositStatus(transaction.account_number)}</td>
                            <td className="p-4">
                              <ActionsMenu
                                item={transaction}
                                activeTab={activeTab}
                                onConfirm={() => {
                                  setCurrentTransactionId(transaction.id);
                                  setShowConfirmationModal(true);
                                }}
                                onDelete={deleteItem}
                                onEditWalletAddress={startEditingWalletAddress}
                              />
                            </td>
                            <td className="p-4">
                              <button onClick={() => toggleRowExpand(transaction.id)} className="text-slate-400 hover:text-white cursor-pointer transition-colors">
                                {isExpanded ? (<FiChevronUp className="w-4 h-4" />) : (<FiChevronDown className="w-4 h-4" />)}
                              </button>
                            </td>
                          </tr>
                          {isExpanded && (
                            <tr className="bg-slate-700/10 border-b border-slate-700/30">
                              <td colSpan={8} className="p-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-16">
                                  <div className="space-y-2">
                                    <h4 className="font-medium text-slate-300">Transaction Details</h4>
                                    <div className="space-y-1">
                                      <div className="flex items-center gap-2">
                                        <span className="text-slate-400">Token/Network:</span>
                                        <span className="text-white">{transaction.token_type} ({transaction.network})</span>
                                      </div>
                                      <div>
                                        <div className="font-medium text-slate-300 mt-2">Wallet Address:</div>
                                        {editingId === transaction.id ? (
                                          <div className="flex items-center gap-2 mt-1">
                                            <input type="text" value={editAccountNumber} onChange={(e) => setEditAccountNumber(e.target.value)} placeholder="Enter wallet address" className="flex-1 bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white text-sm"/>
                                            <button onClick={() => handleSaveWalletAddress(transaction.id)} disabled={updatingId === transaction.id} className="bg-green-600 hover:bg-green-700 text-white p-1 rounded disabled:opacity-50"><FiSave className="w-4 h-4" /></button>
                                            <button onClick={cancelEditingWalletAddress} className="bg-slate-600 hover:bg-slate-700 text-white p-1 rounded transition-colors"><FiX className="w-4 h-4" /></button>
                                          </div>
                                        ) : (
                                          <div className="flex items-center gap-2 mt-1">
                                            <span className="font-mono text-slate-300 break-all">{transaction.account_number || "Not assigned"}</span>
                                            <button onClick={() => startEditingWalletAddress(transaction.id, transaction.account_number || "")} className="text-slate-400 hover:text-white transition-colors"><FiEdit3 className="w-4 h-4" /></button>
                                          </div>
                                        )}
                                      </div>
                                      <div>
                                        <div className="font-medium text-slate-300 mt-2">Created Date:</div>
                                        {editingDateId === transaction.id ? (
                                          <div className="flex items-center gap-2 mt-1">
                                            <DatePicker selected={editDate} onChange={(date: Date | null) => setEditDate(date)} showTimeSelect timeFormat="HH:mm" timeIntervals={15} dateFormat="MMM d, yyyy h:mm aa" className="w-full bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white text-sm focus:outline-none focus:border-blue-500"/>
                                            <button onClick={() => handleSaveDate(transaction.id)} className="bg-green-600 hover:bg-green-700 text-white p-1 rounded transition-colors"><FiSave className="w-4 h-4" /></button>
                                            <button onClick={cancelEditingDate} className="bg-slate-600 hover:bg-slate-700 text-white p-1 rounded transition-colors"><FiX className="w-4 h-4" /></button>
                                          </div>
                                        ) : (
                                          <div className="flex items-center gap-2 mt-1">
                                            <span className="font-mono text-slate-300">{formatDate(transaction.created_at)}</span>
                                            <button onClick={() => startEditingDate(transaction.id, transaction.created_at)} className="text-slate-400 hover:text-white transition-colors"><FiEdit3 className="w-4 h-4" /></button>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })
                  ) : activeTab === 'withdrawals' ? (
                    filteredWithdrawals.map((withdrawal) => {
                      const isExpanded = expandedRows.has(withdrawal.id);
                      return (
                        <React.Fragment key={withdrawal.id}>
                          <tr className="border-t border-slate-700/50 hover:bg-slate-700/25">
                            <td className="p-4"><UserInfo email={withdrawal.email} id={withdrawal.id} /></td>
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                {editingAmountId === withdrawal.id ? (
                                  <input type="number" value={editAmount} onChange={(e) => setEditAmount(parseFloat(e.target.value))} className="w-24 bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white text-sm focus:outline-none focus:border-blue-500"/>
                                ) : (
                                  <p className="text-white font-medium">${withdrawal.amount.toLocaleString()}</p>
                                )}
                                <button onClick={editingAmountId === withdrawal.id ? () => handleSaveAmount(withdrawal.id) : () => startEditingAmount(withdrawal.id, withdrawal.amount)} className="text-slate-400 hover:text-white transition-colors">
                                  {editingAmountId === withdrawal.id ? <FiSave className="w-4 h-4" /> : <FiEdit3 className="w-4 h-4" />}
                                </button>
                                {editingAmountId === withdrawal.id && (<button onClick={cancelEditingAmount} className="bg-slate-600 hover:bg-slate-700 text-white p-1 rounded transition-colors"><FiX className="w-4 h-4" /></button>)}
                              </div>
                            </td>
                            <td className="p-4">
                              <StatusPill status={withdrawal.status} type="withdrawal" />
                            </td>
                            <td className="p-4">
                              <ActionsMenu
                                item={withdrawal}
                                activeTab={activeTab}
                                onConfirm={() => {
                                  setCurrentTransactionId(withdrawal.id);
                                  setShowConfirmationModal(true);
                                }}
                                onDelete={deleteItem}
                              />
                            </td>
                            <td className="p-4">
                              <button onClick={() => toggleRowExpand(withdrawal.id)} className="text-slate-400 hover:text-white transition-colors">
                                {isExpanded ? (<FiChevronUp className="w-4 h-4" />) : (<FiChevronDown className="w-4 h-4" />)}
                              </button>
                            </td>
                          </tr>
                          {isExpanded && (
                            <tr className="bg-slate-700/10 border-b border-slate-700/30">
                              <td colSpan={6} className="p-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-16">
                                  <div className="space-y-2">
                                    <h4 className="font-medium text-slate-300">Withdrawal Details</h4>
                                    <div className="space-y-1">
                                      <div className="flex items-center gap-2">
                                        <span className="text-slate-400">Token/Network:</span>
                                        <span className="text-white">{withdrawal.token_type} ({withdrawal.network})</span>
                                      </div>
                                      {withdrawal.status && (
                                        <div className="flex items-center gap-2">
                                          <span className="text-slate-400">Completed:</span>
                                          <span className="text-slate-300">{formatDate(withdrawal.updated_at)}</span>
                                        </div>
                                      )}
                                      <div>
                                        <div className="font-medium text-slate-300 mt-2">Wallet Address:</div>
                                        {editingId === withdrawal.id ? (
                                          <div className="flex items-center gap-2 mt-1">
                                            <input type="text" value={editAccountNumber} onChange={(e) => setEditAccountNumber(e.target.value)} placeholder="Enter wallet address" className="flex-1 bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white text-sm"/>
                                            <button onClick={() => handleSaveWalletAddress(withdrawal.id)} disabled={updatingId === withdrawal.id} className="bg-green-600 hover:bg-green-700 text-white p-1 rounded disabled:opacity-50"><FiSave className="w-4 h-4" /></button>
                                            <button onClick={cancelEditingWalletAddress} className="bg-slate-600 hover:bg-slate-700 text-white p-1 rounded transition-colors"><FiX className="w-4 h-4" /></button>
                                          </div>
                                        ) : (
                                          <div className="flex items-center gap-2 mt-1">
                                            <span className="font-mono text-slate-300 break-all">{withdrawal.account_number}</span>
                                            <button onClick={() => startEditingWalletAddress(withdrawal.id, withdrawal.account_number || "")} className="text-slate-400 hover:text-white transition-colors"><FiEdit3 className="w-4 h-4" /></button>
                                          </div>
                                        )}
                                      </div>
                                      <div>
                                        <div className="font-medium text-slate-300 mt-2">Created Date:</div>
                                        {editingDateId === withdrawal.id ? (
                                          <div className="flex items-center gap-2 mt-1">
                                            <DatePicker selected={editDate} onChange={(date: Date | null) => setEditDate(date)} showTimeSelect timeFormat="HH:mm" timeIntervals={15} dateFormat="MMM d, yyyy h:mm aa" className="w-full bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white text-sm focus:outline-none focus:border-blue-500"/>
                                            <button onClick={() => handleSaveDate(withdrawal.id)} className="bg-green-600 hover:bg-green-700 text-white p-1 rounded transition-colors"><FiSave className="w-4 h-4" /></button>
                                            <button onClick={cancelEditingDate} className="bg-slate-600 hover:bg-slate-700 text-white p-1 rounded transition-colors"><FiX className="w-4 h-4" /></button>
                                          </div>
                                        ) : (
                                          <div className="flex items-center gap-2 mt-1">
                                            <span className="font-mono text-slate-300">{formatDate(withdrawal.created_at)}</span>
                                            <button onClick={() => startEditingDate(withdrawal.id, withdrawal.created_at)} className="text-slate-400 hover:text-white transition-colors"><FiEdit3 className="w-4 h-4" /></button>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })
                  ) : (
                    // Added Deposits table view
                    filteredAddedDeposits.map((deposit) => {
                      const isExpanded = expandedRows.has(deposit.id);
                      return (
                        <React.Fragment key={deposit.id}>
                          <tr className="border-t border-slate-700/50 hover:bg-slate-700/25">
                            <td className="p-4"><UserInfo email={deposit.email} id={deposit.id} /></td>
                            
                            <td className="p-4">
                              {editingAddedDepositAmountId === deposit.id ? (
                                <div className="flex items-center gap-2">
                                  <input type="number" value={editAddedDepositAmount} onChange={(e) => setEditAddedDepositAmount(parseFloat(e.target.value))} className="w-24 bg-slate-700 border
                                   border-slate-600 rounded px-2 py-1 text-white text-sm focus:outline-none focus:border-blue-500"/>
                                  <button onClick={() => handleSaveAddedDepositAmount(deposit.id)} className="bg-green-600 hover:bg-green-700
                                   text-white p-1 rounded transition-colors"><FiSave className="w-4 h-4" /></button>
                                  <button onClick={cancelEditingAddedDepositAmount} className="bg-slate-600 hover:bg-slate-700 text-white p-1 
                                  rounded transition-colors"><FiX className="w-4 h-4" /></button>
                                </div>
                              ) : (
                                <div className="flex items-center gap-2">
                                  <p className="text-white font-medium">${deposit.deposit.toLocaleString()}</p>
                                  <button onClick={() => startEditingAddedDepositAmount(deposit.id, deposit.deposit)} className="text-slate-400
                                   hover:text-white transition-colors"><FiEdit3 className="w-4 h-4" /></button>
                                </div>
                              )}
                            </td>
                            <td className="p-4">
                              <StatusPill status={deposit.status} type="deposit" />
                            </td>
                           
                            <td className="p-4">
                              <ActionsMenu
                                item={deposit}
                                activeTab={activeTab}
                                onDelete={deleteItem}
                                onConfirm={() => {}} // No confirmation needed for already added deposits
                              />
                            </td>
                            <td className="p-4">
                              <button onClick={() => toggleRowExpand(deposit.id)} className="text-slate-400 hover:text-white transition-colors">
                                {isExpanded ? (<FiChevronUp className="w-4 h-4" />) : (<FiChevronDown className="w-4 h-4" />)}
                              </button>
                            </td>
                          </tr>
                          {isExpanded && (
                            <tr className="bg-slate-700/10 border-b border-slate-700/30">
                              <td colSpan={6} className="p-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-16">
                                  <div className="space-y-2">
                                    <h4 className="font-medium text-slate-300">Deposit Details</h4>
                                    <div className="space-y-1">
                                      <div className="flex items-center gap-2">
                                        <span className="text-slate-400">Created Date:</span>
                                        <span className="text-white">

                                          <div className="">
                              {editingAddedDepositDateId === deposit.id ? (
                                <div className="flex items-center gap-2">
                                  <DatePicker selected={editAddedDepositDate} onChange={(date: Date | null) => setEditAddedDepositDate(date)} showTimeSelect timeFormat="HH:mm" timeIntervals={15} dateFormat="MMM d, yyyy h:mm aa" className="w-40 bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white text-sm focus:outline-none focus:border-blue-500"/>
                                  <button onClick={() => handleSaveAddedDepositDate(deposit.id)} className="bg-green-600 hover:bg-green-700 text-white p-1 rounded transition-colors"><FiSave className="w-4 h-4" /></button>
                                  <button onClick={cancelEditingAddedDepositDate} className="bg-slate-600 hover:bg-slate-700 text-white p-1 rounded transition-colors"><FiX className="w-4 h-4" /></button>
                                </div>
                              ) : (
                                <div className="flex items-center gap-2">
                                  <p className="text-white font-medium">{formatDate(deposit.created_at)}</p>
                                  <button onClick={() => startEditingAddedDepositDate(deposit.id, deposit.created_at)} className="text-slate-400 hover:text-white transition-colors"><FiEdit3 className="w-4 h-4" /></button>
                                </div>
                              )}
                            </div>
                                        </span>
                                      </div>
                                       
                                    </div>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
            {getFilteredItems().length === 0 && (
              <div className="text-center py-12">
                <div className="text-slate-400 mb-4">
                  <FiEye className="w-12 h-12 mx-auto mb-2" />
                  <p>No {activeTab.replace('_', ' ')} requests found</p>
                  <p className="text-sm">
                    {filter === 'pending' && `No pending ${activeTab.replace('_', ' ')} at the moment`}
                    {filter === 'completed' && `No completed ${activeTab.replace('_', ' ')} found`}
                    {filter === 'all' && searchEmail && `No results for "${searchEmail}"`}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden p-4 space-y-4">
            {getFilteredItems().length > 0 ? (
              getFilteredItems().map((item) => {
                const isExpanded = expandedRows.has(item.id);
                return (
                  <div key={item.id} className="bg-slate-700/30 rounded-lg border border-slate-600/50 p-4">
                    <div className="flex items-center justify-between" onClick={() => toggleRowExpand(item.id)}>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center">
                          <FiUser className="w-4 h-4 text-slate-300" />
                        </div>
                        <div>
                          <p className="text-white font-medium text-sm">{item.email}</p>
                          <p className="text-slate-400 text-xs">{formatDate(item.created_at)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-white font-bold text-sm">
                          ${('amount' in item ? item.amount : item.deposit).toLocaleString()}
                        </span>
                        <button className="text-slate-400">
                          {isExpanded ? <FiChevronUp /> : <FiChevronDown />}
                        </button>
                      </div>
                    </div>
                    {isExpanded && (
                      <div className="mt-4 border-t border-slate-600/50 pt-4 space-y-3 text-sm">
                        <div className="flex items-center gap-2">
                          <FiMail className="text-slate-400" />
                          <span className="text-slate-300 break-all">{item.email}</span>
                        </div>
                        {/* <div className="flex items-center gap-2">
                          <FiClock className="text-slate-400" />
                          <StatusPill status={'status' in item ? item.status : !!item.account_number} type={activeTab === 'withdrawals' ? 'withdrawal' : 'deposit'} />
                        </div> */}
                        {'wallet_type' in item && (
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{TIER_CONFIG[item.wallet_type].icon}</span>
                            <span className="text-white">{TIER_CONFIG[item.wallet_type].name}</span>
                          </div>
                        )}
                        <div>
                          <div className="font-medium text-slate-300">Amount:</div>
                          <div className="flex items-center gap-2 mt-1">
                            {editingAmountId === item.id ? (
                                <>
                                  <input type="number" value={editAmount} onChange={(e) => setEditAmount(parseFloat(e.target.value))} className="w-20 bg-slate-700 border border-slate-600 rounded px-1 text-white text-xs"/>
                                  <button onClick={() => handleSaveAmount(item.id)} className="bg-green-600 hover:bg-green-700 text-white p-1 rounded transition-colors"><FiSave className="w-4 h-4" /></button>
                                  <button onClick={cancelEditingAmount} className="bg-slate-600 hover:bg-slate-700 text-white p-1 rounded transition-colors"><FiX className="w-4 h-4" /></button>
                                </>
                            ) : (
                                <>
                                  <span className="text-white">${('amount' in item ? item.amount : item.deposit).toLocaleString()}</span>
                                  {activeTab !== 'added_deposits' && (
                                    <button onClick={() => startEditingAmount(item.id, ('amount' in item ? item.amount : item.deposit))} className="text-slate-400 hover:text-white transition-colors"><FiEdit3 className="w-4 h-4" /> Edit Amount</button>
                                  )}
                                </>
                            )}
                          </div>
                        </div>
                        
                        <div>
                          <div className="font-medium text-slate-300">Date:</div>
                          <div className="flex items-center gap-2 mt-1">
                            {editingDateId === item.id ? (
                                <>
                                  <DatePicker selected={editDate} onChange={(date: Date | null) => setEditDate(date)} showTimeSelect timeFormat="HH:mm" timeIntervals={15} dateFormat="MMM d, yyyy h:mm aa" className="w-full bg-slate-700 border border-slate-600 rounded px-1 text-white text-xs"/>
                                  <button onClick={() => handleSaveDate(item.id)} className="bg-green-600 hover:bg-green-700 text-white p-1 rounded transition-colors"><FiSave className="w-4 h-4" /></button>
                                  <button onClick={cancelEditingDate} className="bg-slate-600 hover:bg-slate-700 text-white p-1 rounded transition-colors"><FiX className="w-4 h-4" /></button>
                                </>
                            ) : (
                                <>
                                  <span className="text-white">{formatDate(item.created_at)}</span>
                                  <button onClick={() => startEditingDate(item.id, item.created_at)} className="text-slate-400 hover:text-white transition-colors"><FiEdit3 className="w-4 h-4" /></button>
                                </>
                            )}
                          </div>
                        </div>
                        {'account_number' in item && activeTab !== 'added_deposits' && (
                          <div>
                            <div className="font-medium text-slate-300">Wallet Assignment:</div>
                            {editingId === item.id ? (
                                <div className="flex items-center gap-2 mt-1">
                                  <input type="text" value={editAccountNumber} onChange={(e) => setEditAccountNumber(e.target.value)} placeholder="Enter wallet address" className="flex-1 bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white text-sm"/>
                                  <button onClick={() => handleSaveWalletAddress(item.id)} disabled={updatingId === item.id} className="bg-green-600 hover:bg-green-700 text-white p-1 rounded disabled:opacity-50"><FiSave className="w-4 h-4" /></button>
                                  <button onClick={cancelEditingWalletAddress} className="bg-slate-600 hover:bg-slate-700 text-white p-1 rounded transition-colors"><FiX className="w-4 h-4" /></button>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="font-mono text-slate-300 break-all">{item.account_number || "Not assigned"}</span>
                                  <button onClick={() => startEditingWalletAddress(item.id, item.account_number || "")} className="text-slate-400 hover:text-white transition-colors"><FiEdit3 className="w-4 h-4" /></button>
                                </div>
                            )}
                          </div>
                        )}
                        <div className="mt-4">
                          <ActionsMenu
                            item={item}
                            activeTab={activeTab}
                            onConfirm={() => {
                              setCurrentTransactionId(item.id);
                              setShowConfirmationModal(true);
                            }}
                            onDelete={deleteItem}
                            onEditWalletAddress={startEditingWalletAddress}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="text-center py-12">
                <div className="text-slate-400 mb-4">
                  <FiEye className="w-12 h-12 mx-auto mb-2" />
                  <p>No {activeTab.replace('_', ' ')} requests found</p>
                  <p className="text-sm">
                    {filter === 'pending' && `No pending ${activeTab.replace('_', ' ')} at the moment`}
                    {filter === 'completed' && `No completed ${activeTab.replace('_', ' ')} found`}
                    {filter === 'all' && searchEmail && `No results for "${searchEmail}"`}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Confirmation Modal */}
        {showConfirmationModal && (
          <div className="fixed inset-0 bg-opacity-40 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 rounded-xl p-6 max-w-md w-full border border-slate-700">
              <h3 className="text-xl font-bold text-white mb-4">Confirm Payment</h3>
              <p className="text-slate-300 mb-6">
                Are you sure you want to confirm this {activeTab === 'deposits' ? 'deposit' : 'withdrawal'}?
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowConfirmationModal(false);
                    setCurrentTransactionId(null);
                  }}
                  className="px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-colors"
                  disabled={isConfirming}
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    if (!currentTransactionId) return;
                    setIsConfirming(true);
                    try {
                      if (activeTab === 'deposits') {
                        const transaction = transactions.find(t => t.id === currentTransactionId);
                        if (transaction && transaction.account_number) {
                          await updateWalletStatus(transaction.account_number, true);
                        }
                      } else {
                        await updateWithdrawalStatus(currentTransactionId, true);
                      }
                      setShowConfirmationModal(false);
                    } catch (error) {
                      console.error('Error confirming payment:', error);
                    } finally {
                      setIsConfirming(false);
                      setCurrentTransactionId(null);
                    }
                  }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center justify-center min-w-24"
                  disabled={isConfirming}
                >
                  {isConfirming ? (
                    <FiRefreshCw className="animate-spin cursor-pointer h-5 w-5" />
                  ) : (
                    'Confirm'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Add New Deposit Modal */}
        {showAddDepositModal && (
          <div className="fixed inset-0 bg-opacity-40 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 rounded-xl p-6 max-w-md w-full border border-slate-700">
              <h3 className="text-xl font-bold text-white mb-4">Add New Client Deposit</h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="deposit-email" className="block text-slate-300 text-sm font-medium mb-1">Client Email</label>
                  <select
                    id="deposit-email"
                    value={newDepositEmail}
                    onChange={(e) => setNewDepositEmail(e.target.value)}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="" disabled>Select client email</option>
                    {allEmails.map(email => (
                      <option key={email} value={email}>{email}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="deposit-amount" className="block text-slate-300 text-sm font-medium mb-1">Deposit Amount</label>
                  <input
                    id="deposit-amount"
                    type="number"
                    value={newDepositAmount}
                    onChange={(e) => setNewDepositAmount(parseFloat(e.target.value))}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                    placeholder="Enter amount"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowAddDepositModal(false)}
                  className="px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-colors"
                  disabled={isAddingDeposit}
                >
                  Cancel
                </button>
                <button
                  onClick={addDeposit}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center justify-center min-w-24"
                  disabled={isAddingDeposit || !newDepositEmail || newDepositAmount <= 0}
                >
                  {isAddingDeposit ? (
                    <FiRefreshCw className="animate-spin cursor-pointer h-5 w-5" />
                  ) : (
                    'Add Deposit'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminTransactionsPage;

