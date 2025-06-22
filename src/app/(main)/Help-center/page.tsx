"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  TrendingUp,
  TrendingDown,
  Star,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import StackedCarousel from "../../components/StackedCarousel";

interface CryptoAsset {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change24h: number;
  marketCap: number;
  volume24h: number;
  icon: string;
  isFavorite?: boolean;
  supportedNetworks: string[];
}

const dummyCryptoData: CryptoAsset[] = [
  {
    id: "bitcoin",
    name: "Bitcoin",
    symbol: "BTC",
    price: 106016.0,
    change24h: 1.18,
    marketCap: 2100000000000,
    volume24h: 28500000000,
    icon: "₿",
    supportedNetworks: ["Bitcoin"],
  },
  {
    id: "ethereum",
    name: "Ethereum",
    symbol: "ETH",
    price: 2553.0,
    change24h: 1.06,
    marketCap: 307000000000,
    volume24h: 15200000000,
    icon: "Ξ",
    supportedNetworks: ["Ethereum", "Arbitrum", "Polygon"],
  },
  {
    id: "tether",
    name: "Tether",
    symbol: "USDT",
    price: 0.9999,
    change24h: -0.02,
    marketCap: 140000000000,
    volume24h: 45800000000,
    icon: "₮",
    supportedNetworks: ["Ethereum", "Tron", "BSC", "Avalanche"],
  },
  {
    id: "bnb",
    name: "BNB",
    symbol: "BNB",
    price: 647.0,
    change24h: 0.83,
    marketCap: 94000000000,
    volume24h: 1800000000,
    icon: "B",
    supportedNetworks: ["BSC", "Ethereum"],
  },
  {
    id: "xrp",
    name: "XRP",
    symbol: "XRP",
    price: 2.0,
    change24h: 0.97,
    marketCap: 114000000000,
    volume24h: 8500000000,
    icon: "X",
    supportedNetworks: ["XRP Ledger"],
  },
  {
    id: "cardano",
    name: "Cardano",
    symbol: "ADA",
    price: 0.4521,
    change24h: -2.45,
    marketCap: 15800000000,
    volume24h: 680000000,
    icon: "₳",
    supportedNetworks: ["Cardano"],
  },
  {
    id: "solana",
    name: "Solana",
    symbol: "SOL",
    price: 135.67,
    change24h: 3.21,
    marketCap: 64200000000,
    volume24h: 2400000000,
    icon: "◎",
    supportedNetworks: ["Solana"],
  },
  {
    id: "dogecoin",
    name: "Dogecoin",
    symbol: "DOGE",
    price: 0.3245,
    change24h: -1.87,
    marketCap: 47800000000,
    volume24h: 1200000000,
    icon: "Ð",
    supportedNetworks: ["Dogecoin"],
  },
];

const CryptoUI: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const filteredCryptos = useMemo(() => {
    return dummyCryptoData.filter(
      (crypto) =>
        crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const toggleFavorite = (id: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(id)) {
      newFavorites.delete(id);
    } else {
      newFavorites.add(id);
    }
    setFavorites(newFavorites);
  };

  const toggleExpand = (id: string) => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(id)) {
      newExpandedRows.delete(id);
    } else {
      newExpandedRows.add(id);
    }
    setExpandedRows(newExpandedRows);
  };

  const formatPrice = (price: number): string => {
    if (price >= 1000) {
      return `$${price.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
    }
    return `$${price.toFixed(4)}`;
  };

  const formatMarketCap = (marketCap: number): string => {
    if (marketCap >= 1e12) {
      return `$${(marketCap / 1e12).toFixed(2)}T`;
    } else if (marketCap >= 1e9) {
      return `$${(marketCap / 1e9).toFixed(2)}B`;
    } else if (marketCap >= 1e6) {
      return `$${(marketCap / 1e6).toFixed(2)}M`;
    }
    return `$${marketCap.toLocaleString()}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#111111] via-[black] to-slate-900 text-white">
      {/* Header */}
      <div className="border-b border-slate-700/50 from-[#222222] to-[#5e5e5e]">
        <div className="mx-auto text-center  flex justify-center items-center flex-col  px-4 sm:px-6 py-[70px]">
          <div className="flex justify-center ">
            <p className="custom-3-text md:w-[70%]">
              Supported Coins and Tokens
            </p>
          </div>

          <p className="custom-4-text">
            Tangem wallets support coins and tokens listed below.
          </p>

          {/* Search Bar */}
          <div className="relative my-5 max-w-lg">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search cryptocurrencies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-black border-[#5b5959] border-2 rounded-xl focus:ring-2 focus:ring-white focus:border-transparent outline-none transition-all placeholder-slate-400"
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Desktop Table Header - hidden on mobile */}
        <div className="hidden sm:grid grid-cols-12 gap-4 px-6 py-4 text-sm font-medium text-slate-400 border-b border-slate-700/30">
          <div className="col-span-1">#</div>
          <div className="col-span-3">Asset</div>
          <div className="col-span-2">Price</div>
          <div className="col-span-2">24h Change</div>
          <div className="col-span-2">Market Cap</div>
          <div className="col-span-2">Networks</div>
        </div>

        {/* Crypto List */}
        <div className="space-y-2">
          {filteredCryptos.map((crypto, index) => (
            <div
              key={crypto.id}
              className="sm:grid sm:grid-cols-12 gap-4 px-4 sm:px-6 py-4 hover:bg-slate-800/30 rounded-xl transition-all duration-200 border border-transparent hover:border-slate-700/30 group"
            >
              {/* Mobile View - Compact */}
              <div className="sm:hidden flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => toggleFavorite(crypto.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Star
                      className={`w-4 h-4 ${
                        favorites.has(crypto.id)
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-slate-400 hover:text-yellow-400"
                      }`}
                    />
                  </button>
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center font-bold text-white shadow-lg">
                    {crypto.icon}
                  </div>
                  <div>
                    <div className="font-semibold text-white">
                      {crypto.symbol}
                    </div>
                    <div
                      className={`flex items-center space-x-1 text-sm ${
                        crypto.change24h >= 0
                          ? "text-emerald-400"
                          : "text-red-400"
                      }`}
                    >
                      {crypto.change24h >= 0 ? (
                        <TrendingUp className="w-3 h-3" />
                      ) : (
                        <TrendingDown className="w-3 h-3" />
                      )}
                      <span>
                        {crypto.change24h >= 0 ? "+" : ""}
                        {crypto.change24h.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <span className="font-semibold">
                    {formatPrice(crypto.price)}
                  </span>
                  <button onClick={() => toggleExpand(crypto.id)}>
                    {expandedRows.has(crypto.id) ? (
                      <ChevronUp className="w-5 h-5 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-400" />
                    )}
                  </button>
                </div>
              </div>

              {/* Expanded Content - Mobile */}
              {expandedRows.has(crypto.id) && (
                <div className="sm:hidden mt-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Name</span>
                    <span>{crypto.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Market Cap</span>
                    <span>{formatMarketCap(crypto.marketCap)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Networks</span>
                    <div className="flex flex-wrap gap-1 justify-end">
                      {crypto.supportedNetworks.slice(0, 2).map((network) => (
                        <span
                          key={network}
                          className="px-2 py-1 bg-slate-700/50 text-xs rounded-md text-slate-300"
                        >
                          {network}
                        </span>
                      ))}
                      {crypto.supportedNetworks.length > 2 && (
                        <span className="px-2 py-1 bg-slate-700/50 text-xs rounded-md text-slate-400">
                          +{crypto.supportedNetworks.length - 2}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Desktop View - Full Row */}
              <div className="hidden sm:contents">
                {/* Rank */}
                <div className="col-span-1 flex items-center">
                  <span className="text-slate-400 font-medium">
                    {index + 1}
                  </span>
                </div>

                {/* Asset Info */}
                <div className="col-span-3 flex items-center space-x-4">
                  <button
                    onClick={() => toggleFavorite(crypto.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Star
                      className={`w-4 h-4 ${
                        favorites.has(crypto.id)
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-slate-400 hover:text-yellow-400"
                      }`}
                    />
                  </button>
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center font-bold text-white shadow-lg">
                    {crypto.icon}
                  </div>
                  <div>
                    <div className="font-semibold text-white">
                      {crypto.name}
                    </div>
                    <div className="text-sm text-slate-400">
                      {crypto.symbol}
                    </div>
                  </div>
                </div>

                {/* Price */}
                <div className="col-span-2 flex items-center">
                  <span className="font-semibold text-lg">
                    {formatPrice(crypto.price)}
                  </span>
                </div>

                {/* 24h Change */}
                <div className="col-span-2 flex items-center">
                  <div
                    className={`flex items-center space-x-1 ${
                      crypto.change24h >= 0
                        ? "text-emerald-400"
                        : "text-red-400"
                    }`}
                  >
                    {crypto.change24h >= 0 ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingDown className="w-4 h-4" />
                    )}
                    <span className="font-medium">
                      {crypto.change24h >= 0 ? "+" : ""}
                      {crypto.change24h.toFixed(2)}%
                    </span>
                  </div>
                </div>

                {/* Market Cap */}
                <div className="col-span-2 flex items-center">
                  <span className="text-slate-300">
                    {formatMarketCap(crypto.marketCap)}
                  </span>
                </div>

                {/* Networks */}
                <div className="col-span-2 flex items-center">
                  <div className="flex flex-wrap gap-1">
                    {crypto.supportedNetworks.slice(0, 2).map((network) => (
                      <span
                        key={network}
                        className="px-2 py-1 bg-slate-700/50 text-xs rounded-md text-slate-300"
                      >
                        {network}
                      </span>
                    ))}
                    {crypto.supportedNetworks.length > 2 && (
                      <span className="px-2 py-1 bg-slate-700/50 text-xs rounded-md text-slate-400">
                        +{crypto.supportedNetworks.length - 2}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredCryptos.length === 0 && (
          <div className="text-center py-12">
            <div className="text-slate-400 text-lg">
              No cryptocurrencies found
            </div>
            <div className="text-slate-500 text-sm mt-2">
              Try adjusting your search terms
            </div>
          </div>
        )}
      </div>

      <div className="py-[100px]">
        <StackedCarousel />
      </div>
    </div>
  );
};

export default CryptoUI;
