import React from 'react';
import { FiRefreshCw } from 'react-icons/fi';

interface AddDepositModalProps {
  showAddDepositModal: boolean;
  setShowAddDepositModal: (show: boolean) => void;
  newDepositEmail: string;
  setNewDepositEmail: (email: string) => void;
  newDepositAmount: number;
  setNewDepositAmount: (amount: number) => void;
  isAddingDeposit: boolean;
  addDeposit: () => void;
}

const AddDepositModal = ({ showAddDepositModal, setShowAddDepositModal, newDepositEmail, setNewDepositEmail, newDepositAmount, setNewDepositAmount, isAddingDeposit, addDeposit }: AddDepositModalProps) => {
  if (!showAddDepositModal) return null;

  return (
    <div className="fixed inset-0 bg-opacity-40 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-xl p-6 max-w-md w-full border border-slate-700">
        <h3 className="text-xl font-bold text-white mb-4">Add New Client Deposit</h3>
        <div className="space-y-4">
          <div>
            <label htmlFor="deposit-email" className="block text-slate-300 text-sm font-medium mb-1">Client Email</label>
            <input
              id="deposit-email"
              type="email"
              value={newDepositEmail}
              onChange={(e) => setNewDepositEmail(e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
              placeholder="Enter client email"
            />
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
  );
};

export default AddDepositModal;