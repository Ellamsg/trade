

"use client"

import { useState, useEffect } from 'react';
import { FiPlus, FiX, FiArrowUp, FiArrowDown, FiClock, FiDollarSign, FiTrendingUp, FiActivity, FiCheck } from 'react-icons/fi';
import { createClient } from '@/app/utils/supabase/clients';

type StockAsset = {
  symbol: string;
  name: string;
  current_price: number;
  percentage_change: string;
};

type Order = {
  id: string;
  asset: string;
  assetName: string;
  type: 'buy' | 'sell';
  price: number;
  amount: number;
  total: number;
  status: 'pending' | 'approved' | 'cancelled';
  createdAt: Date;
  approvedAt?: Date;
};

type PortfolioItem = {
  id: string;
  asset: string;
  assetName: string;
  amount: number;
  averagePrice: number;
  totalValue: number;
  addedAt: Date;
};

const WaitlistPage = () => {
  const supabase = createClient();
  const [orders, setOrders] = useState<Order[]>([]);
  const [stockAssets, setStockAssets] = useState<StockAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orderType, setOrderType] = useState<'buy' | 'sell'>('buy');
  const [selectedAsset, setSelectedAsset] = useState<StockAsset | null>(null);
  const [price, setPrice] = useState('');
  const [amount, setAmount] = useState('');

  // Load orders from localStorage on component mount
  useEffect(() => {
    const savedOrders = localStorage.getItem('stock_orders');
    if (savedOrders) {
      const parsedOrders = JSON.parse(savedOrders).map((order: any) => ({
        ...order,
        createdAt: new Date(order.createdAt),
        approvedAt: order.approvedAt ? new Date(order.approvedAt) : undefined
      }));
      setOrders(parsedOrders);
    }
  }, []);

  // Save orders to localStorage whenever orders change
  useEffect(() => {
    if (orders.length > 0) {
      localStorage.setItem('stock_orders', JSON.stringify(orders));
    }
  }, [orders]);

  // Fetch stock data from Supabase
  useEffect(() => {
    const fetchStockData = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('posts')
          .select('symbol, name, current_price, percentage_change')
          .order('created_at', { ascending: false });

        if (error) throw error;

        const formattedStocks = data.map((stock: any) => ({
          symbol: stock.symbol,
          name: stock.name,
          current_price: stock.current_price,
          percentage_change: stock.percentage_change,
        }));
        
        setStockAssets(formattedStocks);
        if (formattedStocks.length > 0) {
          setSelectedAsset(formattedStocks[0]);
          setPrice(formattedStocks[0].current_price.toString());
        }
      } catch (error) {
        console.error('Error fetching stock data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStockData();
  }, []);

  // Handle pending to approved status transition
  useEffect(() => {
    const interval = setInterval(() => {
      setOrders(prevOrders => {
        return prevOrders.map(order => {
          if (order.status === 'pending') {
            const timeDiff = Date.now() - order.createdAt.getTime();
            if (timeDiff >= 30000) { // 30 seconds
              const approvedOrder = {
                ...order,
                status: 'approved' as const,
                approvedAt: new Date()
              };
              
              // Add to portfolio when approved
              addToPortfolio(approvedOrder);
              
              return approvedOrder;
            }
          }
          return order;
        });
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const addToPortfolio = (approvedOrder: Order) => {
    if (approvedOrder.type === 'buy') {
      const existingPortfolio = JSON.parse(localStorage.getItem('stock_portfolio') || '[]');
      
      // Check if asset already exists in portfolio
      const existingAssetIndex = existingPortfolio.findIndex((item: PortfolioItem) => item.asset === approvedOrder.asset);
      
      if (existingAssetIndex >= 0) {
        // Update existing asset - calculate new average price
        const existingItem = existingPortfolio[existingAssetIndex];
        const totalAmount = existingItem.amount + approvedOrder.amount;
        const totalValue = (existingItem.amount * existingItem.averagePrice) + (approvedOrder.amount * approvedOrder.price);
        const newAveragePrice = totalValue / totalAmount;
        
        existingPortfolio[existingAssetIndex] = {
          ...existingItem,
          amount: totalAmount,
          averagePrice: newAveragePrice,
          totalValue: totalAmount * (selectedAsset?.current_price || approvedOrder.price)
        };
      } else {
        // Add new asset to portfolio
        const newPortfolioItem: PortfolioItem = {
          id: Date.now().toString(),
          asset: approvedOrder.asset,
          assetName: approvedOrder.assetName,
          amount: approvedOrder.amount,
          averagePrice: approvedOrder.price,
          totalValue: approvedOrder.amount * (selectedAsset?.current_price || approvedOrder.price),
          addedAt: new Date()
        };
        existingPortfolio.push(newPortfolioItem);
      }
      
      localStorage.setItem('stock_portfolio', JSON.stringify(existingPortfolio));
    }
  };

  const handleNewOrder = () => {
    if (!price || !amount || !selectedAsset) return;

    const newOrder: Order = {
      id: Date.now().toString(),
      asset: selectedAsset.symbol.toUpperCase(),
      assetName: selectedAsset.name,
      type: orderType,
      price: parseFloat(price),
      amount: parseFloat(amount),
      total: parseFloat(price) * parseFloat(amount),
      status: 'pending',
      createdAt: new Date()
    };

    setOrders([newOrder, ...orders]);
    setIsModalOpen(false);
    setPrice(selectedAsset.current_price.toString());
    setAmount('');
  };

  const cancelOrder = (id: string) => {
    setOrders(orders.map(order => 
      order.id === id ? { ...order, status: 'cancelled' } : order
    ));
  };

  const handleAssetChange = (symbol: string) => {
    const asset = stockAssets.find(a => a.symbol === symbol);
    if (asset) {
      setSelectedAsset(asset);
      setPrice(asset.current_price.toString());
    }
  };

  const pendingOrders = orders.filter(o => o.status === 'pending');
  const approvedOrders = orders.filter(o => o.status === 'approved');
  const totalValue = pendingOrders.reduce((sum, order) => sum + order.total, 0);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <span className="px-3 py-1 bg-yellow-500/10 text-yellow-400 rounded-full text-xs font-medium border border-yellow-500/20 flex items-center w-fit">
            <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2 animate-pulse"></div>
            PENDING
          </span>
        );
      case 'approved':
        return (
          <span className="px-3 py-1 bg-green-500/10 text-green-400 rounded-full text-xs font-medium border border-green-500/20 flex items-center w-fit">
            <FiCheck className="w-3 h-3 mr-2" />
            APPROVED
          </span>
        );
      case 'cancelled':
        return (
          <span className="px-3 py-1 bg-red-500/10 text-red-400 rounded-full text-xs font-medium border border-red-500/20 flex items-center w-fit">
            <FiX className="w-3 h-3 mr-2" />
            CANCELLED
          </span>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading stock data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 py-6 via-blue-900 to-slate-900 text-white">
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        {/* Header Section */}
        <div className="mb-6 md:mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 md:mb-6 gap-4">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-600/20 rounded-xl border border-blue-500/30 ">
                <FiActivity className="size-6 text-blue-400" />
              </div>
              <div>
                <h1 className="text-xl md:text-3xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                  Stock Order Watchlist
                </h1>
                <p className="text-slate-400 text-sm md:text-base">Manage your pending stock trades</p>
              </div>
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center justify-center bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2 md:px-6 md:py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 border border-blue-500/30 text-sm md:text-base"
            >
              <FiPlus className="mr-2" />
              New Order
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-6">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-xs md:text-sm">Pending Orders</p>
                  <p className="text-lg md:text-2xl font-bold text-white">{pendingOrders.length}</p>
                </div>
                <div className="p-2 md:p-3 bg-yellow-600/20 rounded-lg">
                  <FiClock className="size-4 md:size-6 text-yellow-400" />
                </div>
              </div>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-xs md:text-sm">Approved Orders</p>
                  <p className="text-lg md:text-2xl font-bold text-white">{approvedOrders.length}</p>
                </div>
                <div className="p-2 md:p-3 bg-green-600/20 rounded-lg">
                  <FiCheck className="size-4 md:size-6 text-green-400" />
                </div>
              </div>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-xs md:text-sm">Total Value</p>
                  <p className="text-lg md:text-2xl font-bold text-white">${totalValue.toLocaleString()}</p>
                </div>
                <div className="p-2 md:p-3 bg-purple-600/20 rounded-lg">
                  <FiDollarSign className="size-4 md:size-6 text-purple-400" />
                </div>
              </div>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-xs md:text-sm">Active Stocks</p>
                  <p className="text-lg md:text-2xl font-bold text-white">{new Set(orders.map(o => o.asset)).size}</p>
                </div>
                <div className="p-2 md:p-3 bg-blue-600/20 rounded-lg">
                  <FiTrendingUp className="size-4 md:size-6 text-blue-400" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Orders Section */}
        <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/50 overflow-hidden shadow-2xl">
          <div className="px-4 md:px-6 py-4 border-b border-slate-700/50 bg-slate-800/50">
            <h2 className="text-lg md:text-xl font-semibold flex items-center">
              <FiActivity className="mr-2 text-blue-400" />
              All Orders
            </h2>
          </div>
          
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-800/30 border-b border-slate-700/50">
                  <th className="text-left px-6 py-4 text-slate-300 font-medium text-sm uppercase tracking-wider">Stock</th>
                  <th className="text-left px-6 py-4 text-slate-300 font-medium text-sm uppercase tracking-wider">Side</th>
                  <th className="text-left px-6 py-4 text-slate-300 font-medium text-sm uppercase tracking-wider">Price</th>
                  <th className="text-left px-6 py-4 text-slate-300 font-medium text-sm uppercase tracking-wider">Shares</th>
                  <th className="text-left px-6 py-4 text-slate-300 font-medium text-sm uppercase tracking-wider">Total Value</th>
                  <th className="text-left px-6 py-4 text-slate-300 font-medium text-sm uppercase tracking-wider">Status</th>
                  <th className="text-left px-6 py-4 text-slate-300 font-medium text-sm uppercase tracking-wider">Time</th>
                  <th className="text-left px-6 py-4 text-slate-300 font-medium text-sm uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center text-slate-400">
                        <FiActivity className="w-12 h-12 mb-4 opacity-50" />
                        <p className="text-lg font-medium">No orders yet</p>
                        <p className="text-sm">Create your first order to get started</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  orders.map((order, index) => (
                    <tr key={order.id} className={`hover:bg-slate-800/30 transition-colors ${index % 2 === 0 ? 'bg-slate-800/10' : ''}`}>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-center mr-3 text-sm font-bold text-white">
                            {order.asset.slice(0, 2)}
                          </div>
                          <div>
                            <div className="font-semibold text-white">{order.asset}</div>
                            <div className="text-xs text-slate-400">{order.assetName}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className={`flex items-center font-medium ${
                          order.type === 'buy' ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {order.type === 'buy' ? (
                            <>
                              <FiArrowUp className="mr-2 w-4 h-4" />
                              <span className="bg-green-500/10 px-3 py-1 rounded-full text-sm border border-green-500/20">
                                BUY
                              </span>
                            </>
                          ) : (
                            <>
                              <FiArrowDown className="mr-2 w-4 h-4" />
                              <span className="bg-red-500/10 px-3 py-1 rounded-full text-sm border border-red-500/20">
                                SELL
                              </span>
                            </>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-white font-mono font-medium">
                          ${order.price.toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-white font-mono">
                          {order.amount} shares
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-white font-mono font-semibold">
                          ${order.total.toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(order.status)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-slate-400 text-sm font-mono">
                          {order.createdAt.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {order.status === 'pending' && (
                          <button 
                            onClick={() => cancelOrder(order.id)}
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10 px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 border border-transparent hover:border-red-500/20"
                          >
                            Cancel
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden">
            {orders.length === 0 ? (
              <div className="px-4 py-12 text-center">
                <div className="flex flex-col items-center text-slate-400">
                  <FiActivity className="w-12 h-12 mb-4 opacity-50" />
                  <p className="text-lg font-medium">No orders yet</p>
                  <p className="text-sm">Create your first order to get started</p>
                </div>
              </div>
            ) : (
              <div className="divide-y divide-slate-700/50">
                {orders.map((order) => (
                  <div key={order.id} className="p-4 hover:bg-slate-800/30 transition-colors">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-center mr-3 text-sm font-bold text-white">
                          {order.asset.slice(0, 2)}
                        </div>
                        <div>
                          <div className="font-semibold text-white">{order.asset}</div>
                          <div className="text-xs text-slate-400">{order.assetName}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-white">
                          ${order.total.toLocaleString()}
                        </div>
                        <div className="text-xs text-slate-400">
                          {order.amount} @ ${order.price.toLocaleString()}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-3 flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        {order.type === 'buy' ? (
                          <span className="text-green-400 text-sm">BUY</span>
                        ) : (
                          <span className="text-red-400 text-sm">SELL</span>
                        )}
                        {getStatusBadge(order.status)}
                      </div>
                      
                      <div className="text-xs text-slate-400">
                        {order.createdAt.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </div>
                    </div>

                    {/* Expandable Details */}
                    <div className="mt-3 pt-3 border-t border-slate-700/50">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-slate-400">Total Value:</span>
                          <span className="ml-2 text-white">${order.total.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-slate-400">Status:</span>
                          <span className="ml-2">{getStatusBadge(order.status)}</span>
                        </div>
                        <div>
                          <span className="text-slate-400">Price:</span>
                          <span className="ml-2 text-white">${order.price.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-slate-400">Shares:</span>
                          <span className="ml-2 text-white">{order.amount}</span>
                        </div>
                      </div>
                      
                      {order.status === 'pending' && (
                        <div className="mt-3">
                          <button 
                            onClick={() => cancelOrder(order.id)}
                            className="w-full text-red-400 hover:text-red-300 hover:bg-red-500/10 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 border border-red-500/20"
                          >
                            Cancel Order
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* New Order Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-md" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-slate-900/95 backdrop-blur-xl rounded-2xl p-6 w-full max-w-lg border border-slate-600/50 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">
                {orderType === 'buy' ? 'Place Buy Order' : 'Place Sell Order'}
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all duration-200"
              >
                <FiX size={20} />
              </button>
            </div>

            <div className="space-y-4">
              {/* Order Type Toggle */}
              <div className="flex bg-slate-800/50 rounded-xl p-1 border border-slate-700/50">
                <button
                  onClick={() => setOrderType('buy')}
                  className={`flex-1 py-2 rounded-lg font-medium transition-all duration-200 ${
                    orderType === 'buy' 
                      ? 'bg-green-600 text-white shadow-lg' 
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Buy Order
                </button>
                <button
                  onClick={() => setOrderType('sell')}
                  className={`flex-1 py-2 rounded-lg font-medium transition-all duration-200 ${
                    orderType === 'sell' 
                      ? 'bg-red-600 text-white shadow-lg' 
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Sell Order
                </button>
              </div>

              {/* Asset Selection */}
              <div>
                <label className="block text-slate-300 mb-2 font-medium">Select Stock</label>
                <select
                  value={selectedAsset?.symbol || ''}
                  onChange={(e) => handleAssetChange(e.target.value)}
                  className="w-full bg-slate-800/50 border border-slate-600/50 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none backdrop-blur-sm"
                >
                  {stockAssets.map(stock => (
                    <option key={stock.symbol} value={stock.symbol} className="bg-slate-800">
                      {stock.symbol} - {stock.name} (${stock.current_price.toLocaleString()})
                    </option>
                  ))}
                </select>
              </div>

              {/* Current Price Display */}
              {selectedAsset && (
                <div className="bg-slate-800/30 rounded-xl p-4 border border-slate-700/50">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Current Market Price</span>
                    <div className="text-right">
                      <span className="font-mono font-bold text-lg text-white">
                        ${selectedAsset.current_price.toLocaleString()}
                      </span>
                      <div className={`text-sm ${
                        parseFloat(selectedAsset.percentage_change) >= 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {parseFloat(selectedAsset.percentage_change) >= 0 ? '+' : ''}
                        {selectedAsset.percentage_change}%
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Price Input */}
              <div>
                <label className="block text-slate-300 mb-2 font-medium">Limit Price (USD)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400">
                    <FiDollarSign className="w-4 h-4" />
                  </span>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="0.00"
                    step="0.01"
                    className="w-full bg-slate-800/50 border border-slate-600/50 rounded-xl pl-12 pr-4 py-3 text-white font-mono focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none backdrop-blur-sm"
                  />
                </div>
              </div>

              {/* Amount Input */}
              <div>
                <label className="block text-slate-300 mb-2 font-medium">
                  Shares
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0"
                  step="1"
                  className="w-full bg-slate-800/50 border border-slate-600/50 rounded-xl px-4 py-3 text-white font-mono focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none backdrop-blur-sm"
                />
              </div>

              {/* Order Summary */}
              <div className="bg-slate-800/30 rounded-xl p-4 border border-slate-700/50">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-slate-400">Order Total</span>
                  <span className="font-mono font-bold text-xl text-white">
                    ${(parseFloat(price || '0') * parseFloat(amount || '0')).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">Est. Fees (0.1%)</span>
                  <span className="font-mono text-slate-300">
                    ${((parseFloat(price || '0') * parseFloat(amount || '0')) * 0.001).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleNewOrder}
                disabled={!price || !amount || !selectedAsset}
                className={`w-full py-4 rounded-xl font-semibold text-white transition-all duration-200 shadow-lg ${
                  orderType === 'buy' 
                    ? 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800' 
                    : 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800'
                } disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-slate-600 disabled:hover:to-slate-700 disabled:bg-gradient-to-r disabled:from-slate-600 disabled:to-slate-700`}
              >
                {orderType === 'buy' ? 'Place Buy Order' : 'Place Sell Order'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WaitlistPage;