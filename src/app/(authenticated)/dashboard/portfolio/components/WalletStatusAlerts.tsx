import React from 'react';
import { FiClock, FiTrendingUp } from 'react-icons/fi';
import { UserWallet, WalletUpgradeRequest, TIER_CONFIG, NETWORK_CONFIG, POPULAR_TOKENS } from '@/app/data';

interface WalletStatusAlertsProps {
  wallet: UserWallet | null;
  upgradeRequests: WalletUpgradeRequest[];
}

const WalletStatusAlerts: React.FC<WalletStatusAlertsProps> = ({
  wallet,
  upgradeRequests
}) => {
  const getTokenById = (tokenId: string) => {
    return POPULAR_TOKENS.find(token => token.id === tokenId);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
      {/* Wallet Status Alert */}
      {wallet?.status === false && (
        <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-3">
            <FiClock className="w-5 h-5 text-yellow-400" />
            <div>
              <p className="text-yellow-400 font-medium">
                Wallet Setup in Progress
              </p>
              <p className="text-sm text-slate-400">
                Send ${TIER_CONFIG[wallet.tier].minimum.toLocaleString()} to
                account:
                <span className="font-mono font-bold text-white ml-2">
                  {wallet.wallet_number}
                </span>
              </p>
              {wallet.network && wallet.token_type && (
                <p className="text-sm text-slate-400 mt-1">
                  Network: {NETWORK_CONFIG[wallet.network].name} • Token:{" "}
                  {getTokenById(wallet.token_type)?.name}
                </p>
              )}
              <p className="text-xs text-yellow-400 mt-2">
                Waiting for admin to confirm payment...
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Upgrade Request Alert */}
      {upgradeRequests.some((req) => !req.status) && (
        <div className="bg-purple-500/20 border border-purple-500/30 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-3">
            <FiTrendingUp className="w-5 h-5 text-purple-400" />
            <div>
              <p className="text-purple-400 font-medium">
                Tier Upgrade Requested
              </p>
              {upgradeRequests
                .filter((req) => !req.status)
                .map((req) => (
                  <div key={req.id}>
                    <p className="text-sm text-slate-400">
                      Upgrade to {TIER_CONFIG[req.target_tier].name}: Please
                      send
                      <span className="font-bold text-white">
                        {" "}
                        $
                        {TIER_CONFIG[
                          req.target_tier
                        ].minimum.toLocaleString()}
                      </span>{" "}
                      to account:
                      <span className="font-mono font-bold text-white ml-2">
                        {wallet?.wallet_number}
                      </span>
                    </p>
                    <p className="text-sm text-slate-400 mt-1">
                      Network:{" "}
                      {wallet?.network && NETWORK_CONFIG[wallet.network].name}{" "}
                      • Token:{" "}
                      {wallet?.token_type &&
                        getTokenById(wallet.token_type)?.name}
                    </p>
                    <p className="text-xs text-purple-400 mt-2">
                      Requested on {formatDate(req.created_at)} - Waiting for
                      admin confirmation...
                    </p>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default WalletStatusAlerts;