"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Search,
  TrendingUp,
  TrendingDown,
  Star,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import StackedCarousel from "../../components/StackedCarousel";
import { createClient } from "@/app/utils/supabase/clients";

interface StockAsset {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change24h: number;
  marketCap?: number;
  volume24h?: number;
  icon: string;
  isFavorite?: boolean;
  supportedNetworks: string[];
  created_at: string;
}

const Stocks: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [stocksData, setStocksData] = useState<StockAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        setLoading(true);
        
        // Fetch all stocks from Supabase
        const { data: stocks, error } = await supabase
          .from('posts')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        // Transform the data to match our interface
        if (stocks && stocks.length > 0) {
          const transformedStocks: StockAsset[] = stocks.map((stock, index) => ({
            id: stock.id || stock.symbol,
            name: stock.name,
            symbol: stock.symbol,
            price: parseFloat(stock.current_price) || 0,
            change24h: parseFloat(stock.percentage_change) || 0,
            marketCap: stock.market_cap ? parseFloat(stock.market_cap) : undefined,
            volume24h: stock.volume ? parseFloat(stock.volume) : undefined,
            icon: getStockIcon(stock.symbol),
            supportedNetworks: ["NYSE", "NASDAQ"], // Default networks for stocks
            created_at: stock.created_at
          }));
          
          setStocksData(transformedStocks);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching stock data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStocks();
  }, []);

  // Function to get stock icon based on symbol
  const getStockIcon = (symbol: string): string => {
    const iconMap: { [key: string]: string } = {
      'AAPL': '🍎',
      'MSFT': 'Ⓜ️',
      'GOOGL': 'G',
      'META': 'M',
      'TSLA': '⚡',
      'AMZN': 'A',
      'NVDA': 'N',
      'BTC': '₿',
      'ETH': 'Ξ',
      'USDT': '₮',
      'BNB': 'B',
      'XRP': 'X',
      'ADA': '₳',
      'SOL': '◎',
      'DOGE': 'Ð',
    };
    return iconMap[symbol] || symbol.charAt(0);
  };

  // Filter and limit stocks based on search term
  const displayedStocks = useMemo(() => {
    const filtered = stocksData.filter(
      (stock) =>
        stock.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stock.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // If searching, show all results. If not searching, show only first 5
    return searchTerm.trim() ? filtered : filtered.slice(0, 5);
  }, [searchTerm, stocksData]);

  // Check if we have more results when not searching
  const hasMoreResults = useMemo(() => {
    return !searchTerm.trim() && stocksData.length > 5;
  }, [searchTerm, stocksData]);

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

  const formatMarketCap = (marketCap?: number): string => {
    if (!marketCap) return "N/A";
    
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
          <div className="flex pt-[100px] justify-center ">
            <p className="custom-3-text leading-13 md:leading-19 md:w-[70%]">
              Supported Stocks 
            </p>
          </div>

          <p className="custom-4-text">
            Penta Stocks support Stocks and tokens listed below.
          </p>

          {/* Search Bar */}
          <div className="relative my-5  w-[70%] md:w-[60%]">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search stocks and cryptocurrencies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12  pr-4 py-4 bg-black border-[#5b5959] border-2 rounded-xl 
              focus:ring-2 focus:ring-white focus:border-transparent outline-none transition-all
               placeholder-slate-400"
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Error Display */}
        {error && (
          <div className="p-4 bg-red-900/50 border-l-4 border-red-500 rounded-xl mb-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">!</span>
              </div>
              <div>
                <p className="font-semibold text-red-300">Error</p>
                <p className="text-red-200">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-12">
            <div className="text-slate-400 text-lg">Loading stocks...</div>
          </div>
        ) : (
          <>
            {/* Search Results Info */}
            {searchTerm.trim() && (
              <div className="mb-4 px-4 sm:px-6 ">
                <div className="text-slate-400 text-sm">
                  {displayedStocks.length === 0 
                    ? `No results found for "${searchTerm}"`
                    : `Found ${displayedStocks.length} result${displayedStocks.length === 1 ? '' : 's'} for "${searchTerm}"`
                  }
                </div>
              </div>
            )}

            {/* Default View Info */}
            {!searchTerm.trim() && hasMoreResults && (
              <div className="mb-4 px-4 sm:px-6 ">
                <div className="text-slate-400 text-sm">
                  Showing top 5 stocks. Use search to find more from our {stocksData.length} supported assets.
                </div>
              </div>
            )}

            {/* Desktop Table Header - hidden on mobile */}
            {displayedStocks.length > 0 && (
              <div className="hidden sm:grid grid-cols-12 gap-4 px-6 py-4 text-sm font-medium text-slate-400 border-b border-slate-700/30">
                <div className="col-span-1">#</div>
                <div className="col-span-3">Asset</div>
                <div className="col-span-2">Price</div>
                <div className="col-span-2">24h Change</div>
                <div className="col-span-2">Market Cap</div>
                <div className="col-span-2">Networks</div>
              </div>
            )}

            {/* Stocks List */}
            <div className="space-y-2">
              {displayedStocks.map((stock, index) => (
                <div
                  key={stock.id}
                  className="sm:grid bg-[#1d1d1d] sm:grid-cols-12 gap-4 px-4 sm:px-6 py-4 hover:bg-slate-800/30 rounded-xl transition-all duration-200 border border-transparent hover:border-slate-700/30 group"
                >
                  {/* Mobile View - Compact */}
                  <div className="sm:hidden flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => toggleFavorite(stock.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Star
                          className={`w-4 h-4 ${
                            favorites.has(stock.id)
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-slate-400 hover:text-yellow-400"
                          }`}
                        />
                      </button>
                      <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center font-bold text-white shadow-lg">
                        {stock.icon}
                      </div>
                      <div>
                        <div className="font-semibold text-white">
                          {stock.symbol}
                        </div>
                        <div
                          className={`flex items-center space-x-1 text-sm ${
                            stock.change24h >= 0
                              ? "text-emerald-400"
                              : "text-red-400"
                          }`}
                        >
                          {stock.change24h >= 0 ? (
                            <TrendingUp className="w-3 h-3" />
                          ) : (
                            <TrendingDown className="w-3 h-3" />
                          )}
                          <span>
                            {stock.change24h >= 0 ? "+" : ""}
                            {stock.change24h.toFixed(2)}%
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <span className="font-semibold">
                        {formatPrice(stock.price)}
                      </span>
                      <button onClick={() => toggleExpand(stock.id)}>
                        {expandedRows.has(stock.id) ? (
                          <ChevronUp className="w-5 h-5 text-slate-400" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-slate-400" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Content - Mobile */}
                  {expandedRows.has(stock.id) && (
                    <div className="sm:hidden mt-4 space-y-3">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Name</span>
                        <span>{stock.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Market Cap</span>
                        <span>{formatMarketCap(stock.marketCap)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Networks</span>
                        <div className="flex flex-wrap gap-1 justify-end">
                          {stock.supportedNetworks.slice(0, 2).map((network) => (
                            <span
                              key={network}
                              className="px-2 py-1 bg-slate-700/50 text-xs rounded-md text-slate-300"
                            >
                              {network}
                            </span>
                          ))}
                          {stock.supportedNetworks.length > 2 && (
                            <span className="px-2 py-1 bg-slate-700/50 text-xs rounded-md text-slate-400">
                              +{stock.supportedNetworks.length - 2}
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
                        {searchTerm.trim() ? (
                          // When searching, show the actual index in filtered results
                          index + 1
                        ) : (
                          // When not searching, show the rank from original data
                          stocksData.findIndex(s => s.id === stock.id) + 1
                        )}
                      </span>
                    </div>

                    {/* Asset Info */}
                    <div className="col-span-3 flex items-center space-x-4">
                      <button
                        onClick={() => toggleFavorite(stock.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Star
                          className={`w-4 h-4 ${
                            favorites.has(stock.id)
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-slate-400 hover:text-yellow-400"
                          }`}
                        />
                      </button>
                      <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center font-bold text-white shadow-lg">
                        {stock.icon}
                      </div>
                      <div>
                        <div className="font-semibold text-white">
                          {stock.name}
                        </div>
                        <div className="text-sm text-slate-400">
                          {stock.symbol}
                        </div>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="col-span-2 flex items-center">
                      <span className="font-semibold text-lg">
                        {formatPrice(stock.price)}
                      </span>
                    </div>

                    {/* 24h Change */}
                    <div className="col-span-2 flex items-center">
                      <div
                        className={`flex items-center space-x-1 ${
                          stock.change24h >= 0
                            ? "text-emerald-400"
                            : "text-red-400"
                        }`}
                      >
                        {stock.change24h >= 0 ? (
                          <TrendingUp className="w-4 h-4" />
                        ) : (
                          <TrendingDown className="w-4 h-4" />
                        )}
                        <span className="font-medium">
                          {stock.change24h >= 0 ? "+" : ""}
                          {stock.change24h.toFixed(2)}%
                        </span>
                      </div>
                    </div>

                    {/* Market Cap */}
                    <div className="col-span-2 flex items-center">
                      <span className="text-slate-300">
                        {formatMarketCap(stock.marketCap)}
                      </span>
                    </div>

                    {/* Networks */}
                    <div className="col-span-2 flex items-center">
                      <div className="flex flex-wrap gap-1">
                        {stock.supportedNetworks.slice(0, 2).map((network) => (
                          <span
                            key={network}
                            className="px-2 py-1 bg-slate-700/50 text-xs rounded-md text-slate-300"
                          >
                            {network}
                          </span>
                        ))}
                        {stock.supportedNetworks.length > 2 && (
                          <span className="px-2 py-1 bg-slate-700/50 text-xs rounded-md text-slate-400">
                            +{stock.supportedNetworks.length - 2}
                          </span>
                        )}
                      </div> 
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* No Results */}
            {displayedStocks.length === 0 && !loading && (
              <div className="text-center py-12">
                <div className="text-slate-400 text-lg">
                  {searchTerm.trim() ? "No stocks found" : "No stocks available"}
                </div>
                <div className="text-slate-500 text-sm mt-2">
                  {searchTerm.trim() 
                    ? "Try adjusting your search terms" 
                    : "Check back later for stock listings"
                  }
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <div className="py-[100px]">
        <StackedCarousel />
      </div>
    </div>
  );
};

export default Stocks;