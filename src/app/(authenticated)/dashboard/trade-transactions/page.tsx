"use client"
import React, { useState, useEffect } from 'react';
import { FiDollarSign, FiPieChart, FiActivity, FiTrendingUp } from 'react-icons/fi';
import { createClient } from '@/app/utils/supabase/clients';
import {
  UserWallet,
  StockPortfolioItem,
} from '@/app/data';

const PortfolioPage = () => {
  const [wallet, setWallet] = useState<UserWallet | null>(null);
  const [loading, setLoading] = useState(true);
  const [stockPortfolio, setStockPortfolio] = useState<StockPortfolioItem[]>([]);
  const [portfolioLoading, setPortfolioLoading] = useState(true);
  const [totalPortfolioBalance, setTotalPortfolioBalance] = useState<number>(0);
  
  const supabase = createClient();

  // Fetch wallet, stock portfolio, and total balance data on component mount
  useEffect(() => {
    fetchWalletData();
    fetchStockPortfolio();
    fetchTotalPortfolioBalance();
  }, []);

  const fetchWalletData = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      const { data: walletData, error: walletError } = await supabase
        .from('wallets')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (walletError && walletError.code !== 'PGRST116') {
        throw walletError;
      } else if (walletData) {
        setWallet(walletData);
      }
    } catch (error) {
      console.error('Error fetching wallet data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStockPortfolio = async () => {
    try {
      setPortfolioLoading(true);
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setPortfolioLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('stock_portfolio')
        .select('*')
        .eq('user_id', user.id)
        .order('current_value', { ascending: false });

      if (error) throw error;

      setStockPortfolio(data || []);
    } catch (error) {
      console.error('Error fetching stock portfolio:', error);
    } finally {
      setPortfolioLoading(false);
    }
  };
  
  // New function to fetch the total balance from the portfolio_balance table
  const fetchTotalPortfolioBalance = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setTotalPortfolioBalance(0);
        return;
      }

      const { data, error } = await supabase
        .from('portfolio_balance')
        .select('total_balance')
        .eq('email', user.email)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setTotalPortfolioBalance(data.total_balance);
      } else {
        setTotalPortfolioBalance(0);
      }
    } catch (error) {
      console.error('Error fetching total portfolio balance:', error);
      setTotalPortfolioBalance(0);
    }
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    };
    return date.toLocaleString(undefined, options);
  };

  // Main rendering logic
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading portfolio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white py-9">
      <div className="max-w-7xl mx-auto p-4 md:p-6">

        {/* Header with Stats Cards */}
        <div className="mb-6 md:mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 md:mb-6 gap-4">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-600/20 rounded-xl border border-blue-500/30 ">
                <FiActivity className="size-6 text-blue-400" />
              </div>
              <div>
                <h1 className="text-xl md:text-3xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                  Trades Summary
                </h1>
                <p className="text-slate-400 text-sm md:text-base">
                  Your current stock Trades
                </p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-6">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50 col-span-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-xs md:text-sm">
                    Total Portfolio Value
                  </p>
                  <p className="text-lg md:text-2xl font-bold text-white">
                    ${totalPortfolioBalance.toLocaleString()}
                  </p>
                  <p className="text-sm">
                    <span className="text-white font-bold">Encrypted Balance: </span>
                    <span className="text-red-500">${wallet?.encrypted_balance?.toLocaleString() || 'N/A'}</span>
                  </p>
                    <p className="text-sm">
                    <span className="text-white font-bold">Percentage: </span>
                    <span className="text-yellow-300">{wallet?.percent?.toLocaleString() || 'N/A'}%</span>
                  </p>
                </div>
                <div className="p-2 md:p-3 bg-purple-600/20 rounded-lg">
                  <FiTrendingUp className="size-4 md:size-6 text-purple-400" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stock Portfolio Table */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 overflow-hidden">
          <div className="p-6 border-b border-slate-700/50">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Trade Stocks</h2>
                <p className="text-slate-400">Your current stock trades</p>
              </div>
              <div className="flex items-center gap-2">
                <FiPieChart className="w-5 h-5 text-blue-400" />
                {/* <span className="text-sm text-slate-400">
                  Total Assets: {stockPortfolio.length}
                </span> */}
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
                <p className="text-sm mt-2">Your stock portfolio will appear here once you make investments</p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-700/50">
                  <tr>
                    <th className="text-left p-4 text-slate-300 font-medium">Stocks</th>
                    <th className="text-left p-4 text-slate-300 font-medium">Time</th>
                    <th className="text-left p-4 text-slate-300 font-medium">P&L</th>
                  </tr>
                </thead>
                <tbody>
                  {stockPortfolio.map((item) => {
                 
                    const displayTime = item.updated_at ? item.updated_at : item.created_at;

                    return (
                      <tr key={item.id} className="border-t border-slate-700/50 hover:bg-slate-700/25">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            {item.image_url && (
                              <img
                                src={item.image_url}
                                alt={item.asset_name}
                                className="w-8 h-8 rounded-full"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                }}
                              />
                            )}
                            <div>
                              <p className="text-white font-medium">{item.asset_name}</p>
                              <p className="text-slate-300 font-mono text-sm">{item.asset}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <p className="text-white font-medium">{formatDate(displayTime)}</p>
                        </td>
                        <td className={`p-4 ${item.price_change.includes('+') ? 'text-green-400' : 'text-red-400'}`}>
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
      </div>
    </div>
  );
};

export default PortfolioPage;