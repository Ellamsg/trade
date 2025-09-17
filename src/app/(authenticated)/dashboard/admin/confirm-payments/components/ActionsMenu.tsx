import React from 'react';
import { FiEdit3, FiCheck, FiTrash2 } from 'react-icons/fi';

// Reusable actions menu component
const ActionsMenu = ({ item, activeTab, onConfirm, onDelete, onEditWalletAddress }: any) => (
  <div className="flex items-center gap-2">
    {activeTab === 'deposits' ? (
      item.account_number ? (
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

export default ActionsMenu;