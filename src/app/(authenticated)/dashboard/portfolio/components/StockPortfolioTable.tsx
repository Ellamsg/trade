import React from 'react';
import { FiPieChart, FiActivity } from 'react-icons/fi';
import { StockPortfolioItem } from '@/app/data';

interface StockPortfolioTableProps {
  stockPortfolio: StockPortfolioItem[];
  portfolioLoading: boolean;
}

const StockPortfolioTable: React.FC<StockPortfolioTableProps> = ({
  stockPortfolio,
  portfolioLoading
}) => {
  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 overflow-hidden">
      <div className="p-6 border-b border-slate-700/50">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Stock Portfolio
            </h2>
            <p className="text-slate-400">Your current stock investments</p>
          </div>
          <div className="flex items-center gap-2">
            <FiPieChart className="w-5 h-5 text-blue-400" />
            <span className="text-sm text-slate-400">
              Total Assets: {stockPortfolio.length}
            </span>
          </div>
        </div>
      </div>

      {portfolioLoading ? (
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading portfolio...</p>
        </div>
      ) : stockPortfolio.length === 0 ? (
        <div className="p-8 text-center">
          <div className="text-slate-400 mb-4">
            <FiActivity className="w-12 h-12 mx-auto mb-2" />
            <p>No stock investments yet</p>
            <p className="text-sm mt-2">
              Your stock portfolio will appear here once you make
              investments
            </p>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-700/50">
              <tr>
                <th className="text-left p-4 text-slate-300 font-medium">
                  Asset
                </th>
                <th className="text-left p-4 text-slate-300 font-medium">
                  Symbol
                </th>
                <th className="text-left p-4 text-slate-300 font-medium">
                  Amount
                </th>
                <th className="text-left p-4 text-slate-300 font-medium">
                  P&L
                </th>
              </tr>
            </thead>
            <tbody>
              {stockPortfolio.map((item) => {
                const totalInvested = item.amount * item.average_price;
                const totalCurrentValue = item.amount * item.current_value;
                const profitLoss = totalCurrentValue - totalInvested;
                const profitLossPercentage =
                  totalInvested > 0
                    ? (profitLoss / totalInvested) * 100
                    : 0;

                return (
                  <tr
                    key={item.id}
                    className="border-t border-slate-700/50 hover:bg-slate-700/25"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {item.image_url && (
                          <img
                            src={item.image_url}
                            alt={item.asset_name}
                            className="w-8 h-8 rounded-full"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                            }}
                          />
                        )}
                        <div>
                          <p className="text-white font-medium">
                            {item.asset_name}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="text-slate-300 font-mono font-medium">
                        {item.asset}
                      </p>
                    </td>
                    <td className="p-4">
                      <p className="text-white font-medium">
                        {item.amount.toLocaleString()}
                      </p>
                    </td>
                    <td
                      className={`p-4 ${
                        item.price_change.includes("+")
                          ? "text-green-700"
                          : "text-red-800"
                      }`}
                    >
                      <p>{item.price_change}</p>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default StockPortfolioTable;