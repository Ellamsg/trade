// import React from 'react';
// import { FiPlusCircle } from 'react-icons/fi';
// import { TransactionRequest, WithdrawalRequest } from '@/app/data';
// import { AddedDeposit } from '../page';

// interface FiltersProps {
//   filter: 'all' | 'pending' | 'completed';
//   setFilter: (filter: 'all' | 'pending' | 'completed') => void;
//   searchEmail: string;
//   setSearchEmail: (email: string) => void;
//   activeTab: 'deposits' | 'withdrawals' | 'added_deposits';
//   getFilteredItems: () => (TransactionRequest | WithdrawalRequest | AddedDeposit)[];
//   setShowAddDepositModal: (show: boolean) => void;
// }

// const Filters = ({ filter, setFilter, searchEmail, setSearchEmail, activeTab, getFilteredItems, setShowAddDepositModal }: FiltersProps) => (
//   <div className="flex flex-col md:flex-row gap-4 mb-6 items-center justify-between">
//     <div className="flex bg-slate-800/50 rounded-lg p-1 border border-slate-700/50">
//       <button
//         onClick={() => setFilter('all')}
//         className={`px-4 py-2 rounded-md font-medium transition-colors ${
//           filter === 'all'
//             ? 'bg-blue-600 text-white'
//             : 'text-slate-400 hover:text-white'
//         }`}
//       >
//         All ({getFilteredItems().length})
//       </button>
//       <button
//         onClick={() => setFilter('pending')}
//         className={`px-4 py-2 rounded-md font-medium transition-colors ${
//           filter === 'pending'
//             ? 'bg-yellow-600 text-white'
//             : 'text-slate-400 hover:text-white'
//         }`}
//       >
//         Pending ({getFilteredItems().filter(item => 'status' in item ? !item.status : false).length})
//       </button>
//       <button
//         onClick={() => setFilter('completed')}
//         className={`px-4 py-2 rounded-md font-medium transition-colors ${
//           filter === 'completed'
//             ? 'bg-green-600 text-white'
//             : 'text-slate-400 hover:text-white'
//         }`}
//       >
//         Completed ({getFilteredItems().filter(item => 'status' in item ? item.status : true).length})
//       </button>
//     </div>
    
//     <div className="flex-1 max-w-md flex gap-4">
//       <input
//         type="text"
//         placeholder="Search by email..."
//         value={searchEmail}
//         onChange={(e) => setSearchEmail(e.target.value)}
//         className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
//       />
//       {activeTab === 'added_deposits' && (
//         <button
//           onClick={() => setShowAddDepositModal(true)}
//           className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
//         >
//           <FiPlusCircle className="w-4 h-4" />
//           Add Deposit
//         </button>
//       )}
//     </div>
//   </div>
// );

// export default Filters;