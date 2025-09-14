import React from 'react';
import { FiCheck, FiClock } from 'react-icons/fi';
import { WalletUpgradeRequest, TIER_CONFIG } from '@/app/data';

interface UpgradeRequestsTableProps {
  upgradeRequests: WalletUpgradeRequest[];
}

const UpgradeRequestsTable: React.FC<UpgradeRequestsTableProps> = ({
  upgradeRequests
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (upgradeRequests.length === 0) return null;

  return (
    <div className="mt-8">
      <h3 className="text-xl font-bold mb-4">Pending Tier Upgrades</h3>
      <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-700/50">
            <tr>
              <th className="p-3 text-left text-slate-300">
                Current Tier
              </th>
              <th className="p-3 text-left text-slate-300">
                Target Tier
              </th>
              <th className="p-3 text-left text-slate-300">Requested</th>
              <th className="p-3 text-left text-slate-300">Status</th>
            </tr>
          </thead>
          <tbody>
            {upgradeRequests.map((request) => (
              <tr
                key={request.id}
                className="border-t border-slate-700/50 hover:bg-slate-700/25"
              >
                <td className="p-3">
                  {TIER_CONFIG[request.current_tier].name}
                </td>
                <td className="p-3">
                  {TIER_CONFIG[request.target_tier].name}
                </td>
                <td className="p-3 text-slate-400">
                  {formatDate(request.created_at)}
                </td>
                <td className="p-3">
                  {request.status ? (
                    <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm flex items-center gap-1 w-fit">
                      <FiCheck className="w-3 h-3" /> Approved
                    </span>
                  ) : (
                    <span className="bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full text-sm flex items-center gap-1 w-fit">
                      <FiClock className="w-3 h-3" /> Pending
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UpgradeRequestsTable;