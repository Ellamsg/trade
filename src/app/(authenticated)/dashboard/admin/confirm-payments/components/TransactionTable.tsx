// import React from 'react';
// import { FiChevronUp, FiChevronDown, FiEdit3, FiSave, FiX } from 'react-icons/fi';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';
// import UserInfo from './UserInfo';
// import ActionsMenu from './ActionsMenu';
// import StatusPill from './StatusPill';
// import { TIER_CONFIG, TransactionRequest, WithdrawalRequest } from '@/app/data';
// import { AddedDeposit } from '../page';

// interface TransactionTableProps {
//   activeTab: 'deposits' | 'withdrawals' | 'added_deposits';
//   items: (TransactionRequest | WithdrawalRequest | AddedDeposit)[];
//   expandedRows: Set<string>;
//   toggleRowExpand: (id: string) => void;
//   renderDepositStatus: (accountNumber: string | null) => React.JSX.Element;
//   editingAmountId: string | null;
//   editAmount: number;
//   setEditAmount: (amount: number) => void;
//   handleSaveAmount: (id: string) => void;
//   cancelEditingAmount: () => void;
//   startEditingAmount: (id: string, currentAmount: number) => void;
//   editingAddedDepositAmountId: string | null;
//   editAddedDepositAmount: number;
//   setEditAddedDepositAmount: (amount: number) => void;
//   handleSaveAddedDepositAmount: (id: string) => void;
//   cancelEditingAddedDepositAmount: () => void;
//   startEditingAddedDepositAmount: (id: string, currentAmount: number) => void;
//   editingId: string | null;
//   editAccountNumber: string;
//   setEditAccountNumber: (accountNumber: string) => void;
//   handleSaveWalletAddress: (id: string) => void;
//   cancelEditingWalletAddress: () => void;
//   startEditingWalletAddress: (id: string, currentAddress: string) => void;
//   updatingId: string | null;
//   editingDateId: string | null;
//   editDate: Date | null;
//   setEditDate: (date: Date | null) => void;
//   handleSaveDate: (id: string) => void;
//   cancelEditingDate: () => void;
//   startEditingDate: (id: string, currentDate: string) => void;
//   editingAddedDepositDateId: string | null;
//   editAddedDepositDate: Date | null;
//   setEditAddedDepositDate: (date: Date | null) => void;
//   handleSaveAddedDepositDate: (id: string) => void;
//   cancelEditingAddedDepositDate: () => void;
//   startEditingAddedDepositDate: (id: string, currentDate: string) => void;
//   deleteItem: (id: string) => void;
//   setCurrentTransactionId: (id: string | null) => void;
//   setShowConfirmationModal: (show: boolean) => void;
//   formatDate: (dateString: string) => string;
// }

// const TransactionTable = ({
//   activeTab, items, expandedRows, toggleRowExpand, renderDepositStatus, editingAmountId, editAmount, setEditAmount, handleSaveAmount, cancelEditingAmount, startEditingAmount, editingAddedDepositAmountId, editAddedDepositAmount, setEditAddedDepositAmount, handleSaveAddedDepositAmount, cancelEditingAddedDepositAmount, startEditingAddedDepositAmount, editingId, editAccountNumber, setEditAccountNumber, handleSaveWalletAddress, cancelEditingWalletAddress, startEditingWalletAddress, updatingId, editingDateId, editDate, setEditDate, handleSaveDate, cancelEditingDate, startEditingDate, editingAddedDepositDateId, editAddedDepositDate, setEditAddedDepositDate, handleSaveAddedDepositDate, cancelEditingAddedDepositDate, startEditingAddedDepositDate, deleteItem, setCurrentTransactionId, setShowConfirmationModal, formatDate,
// }: TransactionTableProps) => {

//   const handleConfirm = (id: string) => {
//     setCurrentTransactionId(id);
//     setShowConfirmationModal(true);
//   };
  
//   const handleSaveAmountWrapper = (id: string) => {
//     if (activeTab === 'deposits' || activeTab === 'withdrawals') {
//       handleSaveAmount(id);
//     } else {
//       handleSaveAddedDepositAmount(id);
//     }
//   };

//   const handleSaveDateWrapper = (id: string) => {
//     if (activeTab === 'deposits' || activeTab === 'withdrawals') {
//       handleSaveDate(id);
//     } else {
//       handleSaveAddedDepositDate(id);
//     }
//   };

//   return (
//     <div className="overflow-x-auto">
//       <table className="w-full">
//         <thead className="bg-slate-700/50">
//           <tr>
//             <th className="text-left p-4 text-slate-300 font-medium">User</th>
//             {activeTab === 'deposits' && <th className="text-left p-4 text-slate-300 font-medium">Wallet Type</th>}
//             <th className="text-left p-4 text-slate-300 font-medium">Amount</th>
//             <th className="text-left p-4 text-slate-300 font-medium">Status</th>
//             <th className="text-left p-4 text-slate-300 font-medium">Actions</th>
//             <th className="text-left p-4 text-slate-300 font-medium"></th>
//           </tr>
//         </thead>
//         <tbody>
//           {items.map((item) => {
//             const isExpanded = expandedRows.has(item.id);
//             const isDeposit = (item as TransactionRequest).wallet_type !== undefined;
//             const isWithdrawal = (item as WithdrawalRequest).account_number !== undefined && !isDeposit;
//             const isAddedDeposit = (item as AddedDeposit).deposit !== undefined;

//             return (
//               <React.Fragment key={item.id}>
//                 <tr className="border-t border-slate-700/50 hover:bg-slate-700/25">
//                   <td className="p-4"><UserInfo email={item.email} id={item.id} /></td>
//                   {activeTab === 'deposits' && (
//                     <td className="p-4">
//                       <div className="flex items-center gap-2">
//                         <span className="text-2xl">{TIER_CONFIG[(item as TransactionRequest).wallet_type].icon}</span>
//                         <div>
//                           <p className={`font-medium`}>{TIER_CONFIG[(item as TransactionRequest).wallet_type].name}</p>
//                         </div>
//                       </div>
//                     </td>
//                   )}
//                   <td className="p-4">
//                     {editingAmountId === item.id || editingAddedDepositAmountId === item.id ? (
//                       <div className="flex items-center gap-2">
//                         <input type="number" value={isAddedDeposit ? editAddedDepositAmount : editAmount} onChange={(e) => isAddedDeposit ? setEditAddedDepositAmount(parseFloat(e.target.value)) : setEditAmount(parseFloat(e.target.value))} className="w-24 bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white text-sm focus:outline-none focus:border-blue-500"/>
//                         <button onClick={() => handleSaveAmountWrapper(item.id)} className="bg-green-600 hover:bg-green-700 text-white p-1 rounded transition-colors"><FiSave className="w-4 h-4" /></button>
//                         <button onClick={isAddedDeposit ? cancelEditingAddedDepositAmount : cancelEditingAmount} className="bg-slate-600 hover:bg-slate-700 text-white p-1 rounded transition-colors"><FiX className="w-4 h-4" /></button>
//                       </div>
//                     ) : (
//                       <div className="flex items-center gap-2">
//                         <p className="text-white font-medium">${(isAddedDeposit ? (item as AddedDeposit).deposit : (item as TransactionRequest).amount).toLocaleString()}</p>
//                         <button onClick={() => isAddedDeposit ? startEditingAddedDepositAmount(item.id, (item as AddedDeposit).deposit) : startEditingAmount(item.id, (item as TransactionRequest).amount)} className="text-slate-400 hover:text-white transition-colors"><FiEdit3 className="w-4 h-4" /></button>
//                       </div>
//                     )}
//                   </td>
//                   <td className="p-4">
//                     {isDeposit ? renderDepositStatus((item as TransactionRequest).account_number) : <StatusPill status={(item as WithdrawalRequest).status} type="withdrawal" />}
//                   </td>
//                   <td className="p-4">
//                     <ActionsMenu
//                       item={item}
//                       activeTab={activeTab}
//                       onConfirm={handleConfirm}
//                       onDelete={deleteItem}
//                       onEditWalletAddress={startEditingWalletAddress}
//                     />
//                   </td>
//                   <td className="p-4">
//                     <button onClick={() => toggleRowExpand(item.id)} className="text-slate-400 hover:text-white cursor-pointer transition-colors">
//                       {isExpanded ? (<FiChevronUp className="w-4 h-4" />) : (<FiChevronDown className="w-4 h-4" />)}
//                     </button>
//                   </td>
//                 </tr>
//                 {isExpanded && (
//                   <tr className="bg-slate-700/10 border-b border-slate-700/30">
//                     <td colSpan={6} className="p-4">
//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-16">
//                         <div className="space-y-2">
//                           <h4 className="font-medium text-slate-300">{isDeposit ? 'Transaction Details' : isWithdrawal ? 'Withdrawal Details' : 'Deposit Details'}</h4>
//                           <div className="space-y-1">
//                             {isDeposit && (
//                               <div className="flex items-center gap-2">
//                                 <span className="text-slate-400">Token/Network:</span>
//                                 <span className="text-white">{(item as TransactionRequest).token_type} ({(item as TransactionRequest).network})</span>
//                               </div>
//                             )}
//                             {isWithdrawal && (
//                               <>
//                                 <div className="flex items-center gap-2">
//                                   <span className="text-slate-400">Token/Network:</span>
//                                   <span className="text-white">{(item as WithdrawalRequest).token_type} ({(item as WithdrawalRequest).network})</span>
//                                 </div>
//                                 {(item as WithdrawalRequest).status && (
//                                   <div className="flex items-center gap-2">
//                                     <span className="text-slate-400">Completed:</span>
//                                     <span className="text-slate-300">{formatDate((item as WithdrawalRequest).updated_at)}</span>
//                                   </div>
//                                 )}
//                               </>
//                             )}
//                             {isDeposit || isWithdrawal ? (
//                               <div>
//                                 <div className="font-medium text-slate-300 mt-2">Wallet Address:</div>
//                                 {editingId === item.id ? (
//                                   <div className="flex items-center gap-2 mt-1">
//                                     <input type="text" value={editAccountNumber} onChange={(e) => setEditAccountNumber(e.target.value)} placeholder="Enter wallet address" className="flex-1 bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white text-sm"/>
//                                     <button onClick={() => handleSaveWalletAddress(item.id)} disabled={updatingId === item.id} className="bg-green-600 hover:bg-green-700 text-white p-1 rounded disabled:opacity-50"><FiSave className="w-4 h-4" /></button>
//                                     <button onClick={cancelEditingWalletAddress} className="bg-slate-600 hover:bg-slate-700 text-white p-1 rounded transition-colors"><FiX className="w-4 h-4" /></button>
//                                   </div>
//                                 ) : (
//                                   <div className="flex items-center gap-2 mt-1">
//                                     <span className="font-mono text-slate-300 break-all">{(item as TransactionRequest).account_number || "Not assigned"}</span>
//                                     <button onClick={() => startEditingWalletAddress(item.id, (item as TransactionRequest).account_number || "")} className="text-slate-400 hover:text-white transition-colors"><FiEdit3 className="w-4 h-4" /></button>
//                                   </div>
//                                 )}
//                               </div>
//                             ) : null}
//                             <div>
//                               <div className="font-medium text-slate-300 mt-2">Created Date:</div>
//                               {editingDateId === item.id ? (
//                                 <div className="flex items-center gap-2 mt-1">
//                                   <DatePicker selected={editDate} onChange={(date: Date | null) => setEditDate(date)} showTimeSelect timeFormat="HH:mm" timeIntervals={15} dateFormat="MMM d, yyyy h:mm aa" className="w-full bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white text-sm focus:outline-none focus:border-blue-500"/>
//                                   <button onClick={() => handleSaveDateWrapper(item.id)} className="bg-green-600 hover:bg-green-700 text-white p-1 rounded transition-colors"><FiSave className="w-4 h-4" /></button>
//                                   <button onClick={cancelEditingDate} className="bg-slate-600 hover:bg-slate-700 text-white p-1 rounded transition-colors"><FiX className="w-4 h-4" /></button>
//                                 </div>
//                               ) : (
//                                 <div className="flex items-center gap-2 mt-1">
//                                   <span className="font-mono text-slate-300">{formatDate(item.created_at)}</span>
//                                   <button onClick={() => startEditingDate(item.id, item.created_at)} className="text-slate-400 hover:text-white transition-colors"><FiEdit3 className="w-4 h-4" /></button>
//                                 </div>
//                               )}
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     </td>
//                   </tr>
//                 )}
//               </React.Fragment>
//             );
//           })}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default TransactionTable;