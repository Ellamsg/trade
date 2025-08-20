import React from 'react';
import {
 
  FiArrowLeft,
} from "react-icons/fi";
export default function WalletsDirection() {
  return (
 <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white flex items-center justify-center">
        <div className="text-center max-w-md p-6 bg-slate-800/50 rounded-xl border border-slate-700/50">
          <h2 className="text-xl font-bold mb-4">Wallet Not Found</h2>
          <p className="text-slate-400 mb-6">
            You need to create a wallet before you can trade stocks.
          </p>
          <a
            href="/dashboard/portfolio"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center gap-2"
          >
            <FiArrowLeft className="w-4 h-4" />
            Go to Portfolio
          </a>
        </div>
      </div>
  );
}