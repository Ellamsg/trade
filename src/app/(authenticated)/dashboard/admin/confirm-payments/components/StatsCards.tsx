// import React from 'react';
// import { FiDollarSign, FiClock, FiCheck, FiExternalLink } from 'react-icons/fi';
// import { TransactionRequest, WithdrawalRequest} from '@/app/data';
// import { AddedDeposit } from '../page';

// interface StatsCardsProps {
//   activeTab: 'deposits' | 'withdrawals' | 'added_deposits';
//   transactions: TransactionRequest[];
//   withdrawals: WithdrawalRequest[];
//   addedDeposits: AddedDeposit[];
// }

// const StatsCards = ({ activeTab, transactions, withdrawals, addedDeposits }: StatsCardsProps) => {
//   const pendingDepositCount = transactions.filter(t => !t.status).length;
//   const completedDepositCount = transactions.filter(t => t.status).length;
//   const pendingWithdrawalCount = withdrawals.filter(w => !w.status).length;
//   const completedWithdrawalCount = withdrawals.filter(w => w.status).length;
//   const addedDepositCount = addedDeposits.length;
  
//   const totalAmount = activeTab === 'deposits' 
//     ? transactions.reduce((sum, t) => sum + t.amount, 0) 
//     : activeTab === 'withdrawals'
//     ? withdrawals.reduce((sum, w) => sum + w.amount, 0)
//     : addedDeposits.reduce((sum, d) => sum + d.deposit, 0);

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
//       <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
//         <div className="flex items-center justify-between">
//           <div>
//             <p className="text-slate-400 text-sm">Total {activeTab === 'deposits' ? 'Deposits' : activeTab === 'withdrawals' ? 'Withdrawals' : 'Added Deposits'}</p>
//             <p className="text-2xl font-bold text-white">
//               {activeTab === 'deposits' ? transactions.length : activeTab === 'withdrawals' ? withdrawals.length : addedDeposits.length}
//             </p>
//           </div>
//           <FiDollarSign className="w-8 h-8 text-blue-400" />
//         </div>
//       </div>
//       <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
//         <div className="flex items-center justify-between">
//           <div>
//             <p className="text-slate-400 text-sm">Pending</p>
//             <p className="text-2xl font-bold text-yellow-400">
//               {activeTab === 'deposits' ? pendingDepositCount : activeTab === 'withdrawals' ? pendingWithdrawalCount : 0}
//             </p>
//           </div>
//           <FiClock className="w-8 h-8 text-yellow-400" />
//         </div>
//       </div>
//       <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
//         <div className="flex items-center justify-between">
//           <div>
//             <p className="text-slate-400 text-sm">Completed</p>
//             <p className="text-2xl font-bold text-green-400">
//               {activeTab === 'deposits' ? completedDepositCount : activeTab === 'withdrawals' ? completedWithdrawalCount : addedDepositCount}
//             </p>
//           </div>
//           <FiCheck className="w-8 h-8 text-green-400" />
//         </div>
//       </div>
//       <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
//         <div className="flex items-center justify-between">
//           <div>
//             <p className="text-slate-400 text-sm">Total Amount</p>
//             <p className="text-2xl font-bold text-white">
//               ${totalAmount.toLocaleString()}
//             </p>
//           </div>
//           <FiExternalLink className="w-8 h-8 text-purple-400" />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default StatsCards;