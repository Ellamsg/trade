// wallet-config.ts - Strict TypeScript with enhanced type safety

export const WALLET_TIERS = ['basic', 'standard', 'premium', 'gold', 'platinum', 'diamond', 'elite'] as const;
export const NETWORK_TYPES = ['erc20', 'trc20', 'bep20', 'polygon', 'solana', 'bitcoin'] as const;

export type WalletTier = typeof WALLET_TIERS[number];
export type NetworkType = typeof NETWORK_TYPES[number];
export type TokenType = string;

export interface TokenInfo {
  readonly id: string;
  readonly symbol: string;
  readonly name: string;
  readonly icon: string;
  readonly color: string;
  readonly supportedNetworks: readonly NetworkType[];
}

export interface NetworkInfo {
  readonly id: NetworkType;
  readonly name: string;
  readonly symbol: string;
  readonly icon: string;
  readonly color: string;
  readonly bgColor: string;
  readonly borderColor: string;
  readonly description: string;
}

export interface TierConfig {
  readonly name: string;
  readonly minimum: number;
  readonly color: string;
  readonly bgColor: string;
  readonly borderColor: string;
  readonly icon: string;
  readonly description: string;
}

export interface UserWallet {
  readonly id: string;
  readonly user_id: string;
  readonly tier: WalletTier;
  readonly wallet_number: string;
  readonly status: boolean;
  readonly balance: number;
  readonly email: string;
  readonly created_at: string;
  readonly current_value: number;
  readonly profit_loss: number;
  readonly performance_percentage: number;
  readonly network?: NetworkType;
  readonly token_type?: TokenType;
}

export interface TransactionRequest {
  readonly id: string;
  readonly email: string;
  readonly amount: number;
  readonly wallet_type: WalletTier;
  readonly account_number: string | null;
  readonly status: boolean;
  readonly created_at: string;
  readonly network?: NetworkType;
  readonly token_type?: TokenType;
}

export interface WithdrawalRequest {
  readonly id: string;
  readonly user_id: string;
  readonly wallet_id: string;
  readonly email: string;
  readonly amount: number;
  readonly network: NetworkType;
  readonly token_type: TokenType;
  readonly account_number: string;
  readonly status: boolean;
  readonly created_at: string;
  readonly updated_at: string;
  
}

export interface StockPortfolioItem {
  readonly id: string;
  readonly user_id: string;
  readonly asset: string;
  readonly asset_name: string;
  readonly amount: number;
  readonly average_price: number;
  readonly current_value: number;
  readonly image_url?: string;
}

// Configuration Objects with strict typing
export const TIER_CONFIG: Readonly<Record<WalletTier, TierConfig>> = {
  basic: {
    name: 'Basic Wallet',
    minimum: 1000,
    color: 'from-gray-300 to-gray-400',
    bgColor: 'bg-gray-400/20',
    borderColor: 'border-gray-400/30',
    icon: '🟦',
    description: 'Entry-level access',
  },
  standard: {
    name: 'Standard Wallet',
    minimum: 10000,
    color: 'from-blue-400 to-blue-600',
    bgColor: 'bg-blue-500/20',
    borderColor: 'border-blue-500/30',
    icon: '🟪',
    description: 'Ideal for consistent growth',
  },
  premium: {
    name: 'Premium Wallet',
    minimum: 20000,
    color: 'from-purple-400 to-purple-600',
    bgColor: 'bg-purple-500/20',
    borderColor: 'border-purple-500/30',
    icon: '🟣',
    description: 'Advanced investor access',
  },
  gold: {
    name: 'Gold Wallet',
    minimum: 50000,
    color: 'from-yellow-400 to-yellow-600',
    bgColor: 'bg-yellow-500/20',
    borderColor: 'border-yellow-500/30',
    icon: '🟨',
    description: 'High-value investments',
  },
  platinum: {
    name: 'Platinum Wallet',
    minimum: 100000,
    color: 'from-slate-400 to-slate-600',
    bgColor: 'bg-slate-500/20',
    borderColor: 'border-slate-500/30',
    icon: '⬜️',
    description: 'Exclusive investor tier',
  },
  diamond: {
    name: 'Diamond Wallet',
    minimum: 500000,
    color: 'from-indigo-400 to-indigo-700',
    bgColor: 'bg-indigo-500/20',
    borderColor: 'border-indigo-500/30',
    icon: '🔷',
    description: 'Elite wealth package',
  },
  elite: {
    name: 'Elite Wallet',
    minimum: 1000000,
    color: 'from-emerald-500 to-emerald-700',
    bgColor: 'bg-emerald-500/20',
    borderColor: 'border-emerald-500/30',
    icon: '💎',
    description: 'Top 1% wealth access',
  },
} as const;

export const NETWORK_CONFIG: Readonly<Record<NetworkType, NetworkInfo>> = {
  erc20: {
    id: 'erc20',
    name: 'ERC20 (Ethereum)',
    symbol: 'ETH',
    icon: '⟠',
    color: 'from-blue-400 to-blue-600',
    bgColor: 'bg-blue-500/20',
    borderColor: 'border-blue-500/30',
    description: 'Ethereum token standard'
  },
  trc20: {
    id: 'trc20',
    name: 'TRC20 (Tron)',
    symbol: 'TRX',
    icon: '🔶',
    color: 'from-red-400 to-red-600',
    bgColor: 'bg-red-500/20',
    borderColor: 'border-red-500/30',
    description: 'Tron token standard'
  },
  bep20: {
    id: 'bep20',
    name: 'BEP20 (Binance Smart Chain)',
    symbol: 'BSC',
    icon: '🔶',
    color: 'from-yellow-400 to-yellow-600',
    bgColor: 'bg-yellow-500/20',
    borderColor: 'border-yellow-500/30',
    description: 'Binance Smart Chain token standard'
  },
  polygon: {
    id: 'polygon',
    name: 'Polygon POS',
    symbol: 'MATIC',
    icon: '🔷',
    color: 'from-purple-400 to-purple-600',
    bgColor: 'bg-purple-500/20',
    borderColor: 'border-purple-500/30',
    description: 'Polygon Proof-of-Stake chain'
  },
  solana: {
    id: 'solana',
    name: 'Solana',
    symbol: 'SOL',
    icon: '☀️',
    color: 'from-green-400 to-green-600',
    bgColor: 'bg-green-500/20',
    borderColor: 'border-green-500/30',
    description: 'High-performance blockchain'
  },
  bitcoin: {
    id: 'bitcoin',
    name: 'Bitcoin',
    symbol: 'BTC',
    icon: '₿',
    color: 'from-orange-400 to-orange-600',
    bgColor: 'bg-orange-500/20',
    borderColor: 'border-orange-500/30',
    description: 'Original cryptocurrency'
  }
} as const;

export const POPULAR_TOKENS: readonly TokenInfo[] = [
  {
    id: 'bitcoin',
    symbol: 'BTC',
    name: 'Bitcoin',
    icon: '₿',
    color: 'from-orange-400 to-orange-600',
    supportedNetworks: ['bitcoin']
  },
  {
    id: 'ethereum',
    symbol: 'ETH',
    name: 'Ethereum',
    icon: '⟠',
    color: 'from-blue-400 to-blue-600',
    supportedNetworks: ['erc20']
  },
  {
    id: 'tether',
    symbol: 'USDT',
    name: 'Tether',
    icon: '💵',
    color: 'from-green-400 to-green-600',
    supportedNetworks: ['erc20', 'trc20', 'bep20', 'polygon']
  },
  {
    id: 'usd-coin',
    symbol: 'USDC',
    name: 'USD Coin',
    icon: '🪙',
    color: 'from-blue-400 to-blue-600',
    supportedNetworks: ['erc20', 'bep20', 'polygon', 'solana']
  },
  {
    id: 'binancecoin',
    symbol: 'BNB',
    name: 'Binance Coin',
    icon: '🔶',
    color: 'from-yellow-400 to-yellow-600',
    supportedNetworks: ['bep20']
  },
  {
    id: 'ripple',
    symbol: 'XRP',
    name: 'XRP',
    icon: '✕',
    color: 'from-gray-400 to-gray-600',
    supportedNetworks: ['erc20']
  },
  {
    id: 'cardano',
    symbol: 'ADA',
    name: 'Cardano',
    icon: '🔵',
    color: 'from-blue-400 to-cyan-600',
    supportedNetworks: ['erc20']
  },
  {
    id: 'solana',
    symbol: 'SOL',
    name: 'Solana',
    icon: '☀️',
    color: 'from-green-400 to-green-600',
    supportedNetworks: ['solana']
  },
  {
    id: 'dogecoin',
    symbol: 'DOGE',
    name: 'Dogecoin',
    icon: '🐕',
    color: 'from-yellow-400 to-yellow-600',
    supportedNetworks: ['erc20']
  },
  {
    id: 'polkadot',
    symbol: 'DOT',
    name: 'Polkadot',
    icon: '🔴',
    color: 'from-pink-400 to-pink-600',
    supportedNetworks: ['erc20']
  },
  {
    id: 'polygon',
    symbol: 'MATIC',
    name: 'Polygon',
    icon: '🔷',
    color: 'from-purple-400 to-purple-600',
    supportedNetworks: ['polygon', 'erc20']
  },
  {
    id: 'shiba-inu',
    symbol: 'SHIB',
    name: 'Shiba Inu',
    icon: '🐕',
    color: 'from-orange-400 to-orange-600',
    supportedNetworks: ['erc20']
  },
  {
    id: 'avalanche-2',
    symbol: 'AVAX',
    name: 'Avalanche',
    icon: '❄️',
    color: 'from-red-400 to-red-600',
    supportedNetworks: ['erc20']
  },
  {
    id: 'chainlink',
    symbol: 'LINK',
    name: 'Chainlink',
    icon: '🔗',
    color: 'from-blue-400 to-blue-600',
    supportedNetworks: ['erc20']
  },
  {
    id: 'uniswap',
    symbol: 'UNI',
    name: 'Uniswap',
    icon: '🦄',
    color: 'from-pink-400 to-pink-600',
    supportedNetworks: ['erc20']
  },
  {
    id: 'litecoin',
    symbol: 'LTC',
    name: 'Litecoin',
    icon: 'Ł',
    color: 'from-gray-400 to-gray-600',
    supportedNetworks: ['erc20']
  },
  {
    id: 'bitcoin-cash',
    symbol: 'BCH',
    name: 'Bitcoin Cash',
    icon: '₿',
    color: 'from-green-400 to-green-600',
    supportedNetworks: ['erc20']
  },
  {
    id: 'stellar',
    symbol: 'XLM',
    name: 'Stellar',
    icon: '✱',
    color: 'from-blue-400 to-blue-600',
    supportedNetworks: ['erc20']
  },
  {
    id: 'filecoin',
    symbol: 'FIL',
    name: 'Filecoin',
    icon: '📁',
    color: 'from-blue-400 to-blue-600',
    supportedNetworks: ['erc20']
  },
  {
    id: 'vechain',
    symbol: 'VET',
    name: 'VeChain',
    icon: 'Ⓥ',
    color: 'from-green-400 to-green-600',
    supportedNetworks: ['erc20']
  }
] as const;

// Type-safe utility functions
export function getTierConfig(tier: WalletTier): TierConfig {
  return TIER_CONFIG[tier];
}

export function getNetworkConfig(network: NetworkType): NetworkInfo {
  return NETWORK_CONFIG[network];
}

export function getTokenById(id: string): TokenInfo | undefined {
  return POPULAR_TOKENS.find(token => token.id === id);
}

export function getTokensByNetwork(network: NetworkType): TokenInfo[] {
  return POPULAR_TOKENS.filter(token => token.supportedNetworks.includes(network));
}

// Type guards for runtime validation
export function isWalletTier(value: string): value is WalletTier {
  return WALLET_TIERS.includes(value as WalletTier);
}

export function isNetworkType(value: string): value is NetworkType {
  return NETWORK_TYPES.includes(value as NetworkType);
}