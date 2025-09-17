import React from 'react';
import { FiRefreshCw } from 'react-icons/fi';

interface ConfirmationModalProps {
  showConfirmationModal: boolean;
  setShowConfirmationModal: (show: boolean) => void;
  activeTab: 'deposits' | 'withdrawals' | 'added_deposits';
  isConfirming: boolean;
  handleConfirm: () => void;
}

const ConfirmationModal = ({ showConfirmationModal, setShowConfirmationModal, activeTab, isConfirming, handleConfirm }: ConfirmationModalProps) => {
  if (!showConfirmationModal) return null;

  return (
    <div className="fixed inset-0 bg-opacity-40 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-xl p-6 max-w-md w-full border border-slate-700">
        <h3 className="text-xl font-bold text-white mb-4">Confirm Payment</h3>
        <p className="text-slate-300 mb-6">
          Are you sure you want to confirm this {activeTab === 'deposits' ? 'deposit' : 'withdrawal'}?
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={() => setShowConfirmationModal(false)}
            className="px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-colors"
            disabled={isConfirming}
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
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
  );
};

export default ConfirmationModal;