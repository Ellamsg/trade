// import React from 'react';
// import { FiChevronUp, FiChevronDown, FiUser, FiMail, FiClock, FiEdit3, FiSave, FiX, FiEye } from 'react-icons/fi';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';
// import StatusPill from './StatusPill';
// import ActionsMenu from './ActionsMenu';
// import { TIER_CONFIG, TransactionRequest, WithdrawalRequest } from '@/app/data';
// import { AddedDeposit } from '../page';

// interface MobileCardListProps {
//   items: (TransactionRequest | WithdrawalRequest | AddedDeposit)[];
//   expandedRows: Set<string>;
//   toggleRowExpand: (id: string) => void;
//   formatDate: (dateString: string) => string;
//   activeTab: 'deposits' | 'withdrawals' | 'added_deposits';
//   editingAmountId: string | null;
//   editAmount: number;
//   setEditAmount: (amount: number) => void;
//   handleSaveAmount: (id: string) => void;
//   cancelEditingAmount: () => void;
//   startEditingAmount: (id: string, currentAmount: number) => void;
//   editingDateId: string | null;
//   editDate: Date | null;
//   setEditDate: (date: Date | null) => void;
//   handleSaveDate: (id: string) => void;
//   cancelEditingDate: () => void;
//   startEditingDate: (id: string, currentDate: string) => void;
//   editingId: string | null;
//   editAccountNumber: string;
//   setEditAccountNumber: (accountNumber: string) => void;
//   handleSaveWalletAddress: (id: string) => void;
//   cancelEditingWalletAddress: () => void;
//   startEditingWalletAddress: (id: string, currentAddress: string) => void;
//   updatingId: string | null;
//   deleteItem: (id: string) => void;
//   setCurrentTransactionId: (id: string | null) => void;
//   setShowConfirmationModal: (show: boolean) => void;
// }

// const MobileCardList = ({
//   items, expandedRows, toggleRowExpand, formatDate, activeTab, editingAmountId, editAmount, setEditAmount, handleSaveAmount, cancelEditingAmount, startEditingAmount, editingDateId, editDate, setEditDate, handleSaveDate, cancelEditingDate, startEditingDate, editingId, editAccountNumber, setEditAccountNumber, handleSaveWalletAddress, cancelEditingWalletAddress, startEditingWalletAddress, updatingId, deleteItem, setCurrentTransactionId, setShowConfirmationModal,
// }: MobileCardListProps) => {

//   const handleConfirm = (id: string) => {
//     setCurrentTransactionId(id);
//     setShowConfirmationModal(true);
//   };
  
//   return (
//     <div className="p-4 space-y-4">
//       {items.length > 0 ? (
//         items.map((item) => {
//           const isExpanded = expandedRows.has(item.id);
//           const isDeposit = (item as TransactionRequest).wallet_type !== undefined;
//           const isWithdrawal = (item as WithdrawalRequest).account_number !== undefined && !isDeposit;
//           const isAddedDeposit = (item as AddedDeposit).deposit !== undefined;

//           return (
//             <div key={item.id} className="bg-slate-700/30 rounded-lg border border-slate-600/50 p-4">
//               <div className="flex items-center justify-between" onClick={() => toggleRowExpand(item.id)}>
//                 <div className="flex items-center gap-3">
//                   <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center">
//                     <FiUser className="w-4 h-4 text-slate-300" />
//                   </div>
//                   <div>
//                     <p className="text-white font-medium text-sm">{item.email}</p>
//                     <p className="text-slate-400 text-xs">{formatDate(item.created_at)}</p>
//                   </div>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <span className="text-white font-bold text-sm">
//                     ${(isAddedDeposit ? (item as AddedDeposit).deposit : (item as TransactionRequest).amount).toLocaleString()}
//                   </span>
//                   <button className="text-slate-400">
//                     {isExpanded ? <FiChevronUp /> : <FiChevronDown />}
//                   </button>
//                 </div>
//               </div>
//               {isExpanded && (
//                 <div className="mt-4 border-t border-slate-600/50 pt-4 space-y-3 text-sm">
//                   <div className="flex items-center gap-2">
//                     <FiMail className="text-slate-400" />
//                     <span className="text-slate-300 break-all">{item.email}</span>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <FiClock className="text-slate-400" />
//                     <StatusPill status={'status' in item ? item.status : !!(item as TransactionRequest).account_number} type={activeTab === 'withdrawals' ? 'withdrawal' : 'deposit'} />
//                   </div>
//                   {isDeposit && (
//                     <div className="flex items-center gap-2">
//                       <span className="text-2xl">{TIER_CONFIG[(item as TransactionRequest).wallet_type].icon}</span>
//                       <span className="text-white">{TIER_CONFIG[(item as TransactionRequest).wallet_type].name}</span>
//                     </div>
//                   )}
//                   <div>
//                     <div className="font-medium text-slate-300">Amount:</div>
//                     <div className="flex items-center gap-2 mt-1">
//                       {editingAmountId === item.id ? (
//                           <>
//                             <input type="number" value={editAmount} onChange={(e) => setEditAmount(parseFloat(e.target.value))} className="w-20 bg-slate-700 border border-slate-600 rounded px-1 text-white text-xs"/>
//                             <button onClick={() => handleSaveAmount(item.id)} className="bg-green-600 hover:bg-green-700 text-white p-1 rounded transition-colors"><FiSave className="w-4 h-4" /></button>
//                             <button onClick={cancelEditingAmount} className="bg-slate-600 hover:bg-slate-700 text-white p-1 rounded transition-colors"><FiX className="w-4 h-4" /></button>
//                           </>
//                       ) : (
//                           <>
//                             <span className="text-white">${(isAddedDeposit ? (item as AddedDeposit).deposit : (item as TransactionRequest).amount).toLocaleString()}</span>
//                             {!isAddedDeposit && (
//                               <button onClick={() => startEditingAmount(item.id, (isAddedDeposit ? (item as AddedDeposit).deposit : (item as TransactionRequest).amount))} className="text-slate-400 hover:text-white transition-colors"><FiEdit3 className="w-4 h-4" /> Edit Amount</button>
//                             )}
//                           </>
//                       )}
//                     </div>
//                   </div>
                  
//                   <div>
//                     <div className="font-medium text-slate-300">Date:</div>
//                     <div className="flex items-center gap-2 mt-1">
//                       {editingDateId === item.id ? (
//                           <>
//                             <DatePicker selected={editDate} onChange={(date: Date | null) => setEditDate(date)} showTimeSelect timeFormat="HH:mm" timeIntervals={15} dateFormat="MMM d, yyyy h:mm aa" className="w-full bg-slate-700 border border-slate-600 rounded px-1 text-white text-xs"/>
//                             <button onClick={() => handleSaveDate(item.id)} className="bg-green-600 hover:bg-green-700 text-white p-1 rounded transition-colors"><FiSave className="w-4 h-4" /></button>
//                             <button onClick={cancelEditingDate} className="bg-slate-600 hover:bg-slate-700 text-white p-1 rounded transition-colors"><FiX className="w-4 h-4" /></button>
//                           </>
//                       ) : (
//                           <>
//                             <span className="text-white">{formatDate(item.created_at)}</span>
//                             <button onClick={() => startEditingDate(item.id, item.created_at)} className="text-slate-400 hover:text-white transition-colors"><FiEdit3 className="w-4 h-4" /></button>
//                           </>
//                       )}
//                     </div>
//                   </div>
//                   {(isDeposit || isWithdrawal) && (
//                     <div>
//                       <div className="font-medium text-slate-300">Wallet Assignment:</div>
//                       {editingId === item.id ? (
//                           <div className="flex items-center gap-2 mt-1">
//                             <input type="text" value={editAccountNumber} onChange={(e) => setEditAccountNumber(e.target.value)} placeholder="Enter wallet address" className="flex-1 bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white text-sm"/>
//                             <button onClick={() => handleSaveWalletAddress(item.id)} disabled={updatingId === item.id} className="bg-green-600 hover:bg-green-700 text-white p-1 rounded disabled:opacity-50"><FiSave className="w-4 h-4" /></button>
//                             <button onClick={cancelEditingWalletAddress} className="bg-slate-600 hover:bg-slate-700 text-white p-1 rounded transition-colors"><FiX className="w-4 h-4" /></button>
//                           </div>
//                       ) : (
//                           <div className="flex items-center gap-2 mt-1">
//                             <span className="font-mono text-slate-300 break-all">{(item as TransactionRequest).account_number || "Not assigned"}</span>
//                             <button onClick={() => startEditingWalletAddress(item.id, (item as TransactionRequest).account_number || "")} className="text-slate-400 hover:text-white transition-colors"><FiEdit3 className="w-4 h-4" /></button>
//                           </div>
//                       )}
//                     </div>
//                   )}
//                   <div className="mt-4">
//                     <ActionsMenu
//                       item={item}
//                       activeTab={activeTab}
//                       onConfirm={handleConfirm}
//                       onDelete={deleteItem}
//                       onEditWalletAddress={startEditingWalletAddress}
//                     />
//                   </div>
//                 </div>
//               )}
//             </div>
//           );
//         })
//       ) : (
//         <div className="text-center py-12">
//           <div className="text-slate-400 mb-4">
//             <FiEye className="w-12 h-12 mx-auto mb-2" />
//             <p>No {activeTab.replace('_', ' ')} requests found</p>
//             <p className="text-sm">
//               {activeTab === 'deposits' && 'No pending deposits at the moment'}
//             </p>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default MobileCardList;