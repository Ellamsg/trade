import React from "react";
import { FiDollarSign } from "react-icons/fi";
import {
  UserWallet,
  TIER_CONFIG,
  NETWORK_CONFIG,
  POPULAR_TOKENS,
} from "@/app/data";

interface PortfoliySummaryProps {
  wallet: UserWallet | null;
}

const PortfolioSummary: React.FC<PortfoliySummaryProps> = ({ wallet }) => {
  const getTokenById = (tokenId: string) => {
    return POPULAR_TOKENS.find((token) => token.id === tokenId);
  };

  return (
    <div className="bg-gradient-to-r from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl p-6 mb-6 md:mb-8 border border-slate-700/50 shadow-2xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-slate-400 text-base md:text-lg mb-2">
            Your Current Wallet Value
          </p>
    <p
  className={`text-2xl md:text-4xl font-bold mb-2 ${
    wallet?.p_l?.toString().includes("+")
      ? "text-green-500"
      : wallet?.p_l?.toString().includes("-")
      ? "text-red-500"
      : "text-white"
  }`}
>
  {wallet?.p_l} ${wallet?.balance.toLocaleString() || "0"}
</p>


          <p className="text-slate-400 text-base md:text-sm mb-2">Commission</p>

          <p
            className={`md:text-13px font-bold mb-2 ${
              wallet?.commissions?.toString().includes("-")
                ? "text-red-500"
                : "text-green-500"
            }`}
          >
            {wallet?.commissions !== undefined && wallet?.commissions !== 0
              ? `${
                  wallet?.commissions?.toString().includes("-") ? "-" : "+"
                }$${Math.abs(wallet.commissions).toLocaleString()}`
              : "$0"}
          </p>
        </div>

        <div className="p-3 md:p-4 bg-blue-600/20 rounded-xl">
          <FiDollarSign className="w-6 h-6 md:w-8 md:h-8 text-blue-400" />
        </div>
      </div>
      <div className="bg-slate-800/30 my-6 rounded-xl p-3 md:p-4 border border-slate-700/30">
        <p className="text-slate-400 text-xs md:text-sm mb-1">Wallet Address</p>
        <p className="text-lg md:text-xl font-bold text-white font-mono">
          {wallet?.wallet_number || "N/A"}
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6">
        <div className="bg-slate-800/30 rounded-xl p-3 md:p-4 border border-slate-700/30">
          <p className="text-slate-400 text-xs md:text-sm mb-1">Wallet Tier</p>
          <p className="text-lg md:text-xl font-bold text-white">
            {wallet ? TIER_CONFIG[wallet.tier].name : "N/A"}
          </p>
        </div>
        <div className="bg-slate-800/30 rounded-xl p-3 md:p-4 border border-slate-700/30">
          <p className="text-slate-400 text-xs md:text-sm mb-1">Network</p>
          <p className="text-lg md:text-xl font-bold text-white">
            {wallet?.network ? NETWORK_CONFIG[wallet.network].name : "N/A"}
          </p>
        </div>
        <div className="bg-slate-800/30 rounded-xl p-3 md:p-4 border border-slate-700/30">
          <p className="text-slate-400 text-xs md:text-sm mb-1">Token</p>
          <p className="text-lg md:text-xl font-bold text-white">
            {wallet?.token_type
              ? getTokenById(wallet.token_type)?.symbol
              : "N/A"}
          </p>
          <p>{wallet?.token_type}</p>
        </div>
      </div>
    </div>
  );
};

export default PortfolioSummary;
