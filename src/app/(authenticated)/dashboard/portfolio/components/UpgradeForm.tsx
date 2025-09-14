import React from 'react';
import { FiX, FiTrendingUp, FiCheck } from 'react-icons/fi';
import { UserWallet, WalletTier, TIER_CONFIG, WALLET_TIERS } from '@/app/data';

interface UpgradeFormProps {
  wallet: UserWallet | null;
  selectedUpgradeTier: WalletTier | null;
  upgrading: boolean;
  onClose: () => void;
  onTierSelect: (tier: WalletTier) => void;
  onUpgrade: () => Promise<void>;
}

const UpgradeForm: React.FC<UpgradeFormProps> = ({
  wallet,
  selectedUpgradeTier,
  upgrading,
  onClose,
  onTierSelect,
  onUpgrade
}) => {
  if (!wallet) return null;

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-2xl p-6 max-w-md w-full border border-slate-700">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Upgrade Wallet Tier</h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        <div className="mb-6">
          <p className="text-slate-400 mb-2">
            Current Tier: {TIER_CONFIG[wallet.tier].name}
          </p>
          <p className="text-slate-400 mb-4">
            Minimum for upgrade: ${wallet && TIER_CONFIG[wallet.tier].minimum * 2}
          </p>

          <label className="block text-slate-400 mb-2">
            Select New Tier
          </label>
          <div className="space-y-2">
            {WALLET_TIERS.filter(
              (tier) =>
                TIER_CONFIG[tier].minimum >
                TIER_CONFIG[wallet.tier].minimum
            ).map((tier) => (
              <div
                key={tier}
                className={`p-3 rounded-lg border cursor-pointer ${
                  selectedUpgradeTier === tier
                    ? "border-purple-500 bg-purple-500/10"
                    : "border-slate-700 hover:bg-slate-700/50"
                }`}
                onClick={() => onTierSelect(tier)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">
                      {TIER_CONFIG[tier].name}
                    </p>
                    <p className="text-sm text-slate-400">
                      Min: ${TIER_CONFIG[tier].minimum.toLocaleString()}
                    </p>
                  </div>
                  {selectedUpgradeTier === tier && (
                    <FiCheck className="text-purple-400" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={onUpgrade}
          disabled={!selectedUpgradeTier || upgrading}
          className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white py-3 rounded-lg font-medium disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {upgrading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Processing...
            </>
          ) : (
            <>
              <FiTrendingUp className="w-4 h-4" />
              Request Upgrade
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default UpgradeForm;