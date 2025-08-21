"use client";

import { useState, useEffect } from "react";
import {
  FiPlus,
  FiX,
  FiArrowUp,
  FiArrowDown,
  FiClock,
  FiActivity,
  FiCheck,
} from "react-icons/fi";
import { createClient } from "@/app/utils/supabase/clients";
import Loader from "../waitlist/components/loader";

type StockAsset = {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  percentage_change: string;
  image_url?: string;
  price_change?: string;
};

type Order = {
  id: string;
  user_id: string;
  wallet_id: string;
  asset: string;
  asset_name: string;
  email: string;
  type: "buy" | "sell";
  price: number;
  amount: number;
  total: number;
  price_change?: string;
  status: "pending" | "approved" | "cancelled";
  created_at: string;
  approved_at?: string;
  image_url?: string;
};

const StockTransactions = () => {
  const supabase = createClient();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Get user session
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("User not authenticated");

        // Fetch user orders
        const { data: ordersData, error: ordersError } = await supabase
          .from("stock_orders")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (ordersError) throw ordersError;
        setOrders(ordersData || []);

      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Poll for order status updates
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Check for pending orders that need approval
        const pendingOrders = orders.filter(o => o.status === "pending");
        if (pendingOrders.length === 0) return;

        // Update orders from database
        const { data: updatedOrders, error } = await supabase
          .from("stock_orders")
          .select("*")
          .eq("user_id", user.id)
          .in("id", pendingOrders.map(o => o.id));

        if (error) throw error;

        // Update local state if any orders changed
        if (updatedOrders && updatedOrders.some(o => o.status !== "pending")) {
          setOrders(prev => prev.map(order => {
            const updated = updatedOrders.find(u => u.id === order.id);
            return updated || order;
          }));
        }
      } catch (error) {
        console.error("Error polling orders:", error);
      }
    }, 10000); // Poll every 10 seconds

    return () => clearInterval(interval);
  }, [orders]);

  const cancelOrder = async (orderId: string) => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      // Update order status in database
      const { error: updateError } = await supabase
        .from("stock_orders")
        .update({ status: "cancelled" })
        .eq("id", orderId);

      if (updateError) throw updateError;
      
      setOrders(prev => prev.map(order => 
        order.id === orderId ? { ...order, status: "cancelled" } : order
      ));

    } catch (error) {
      console.error("Error cancelling order:", error);
      alert("Failed to cancel order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const pendingOrders = orders.filter((o) => o.status === "pending");
  const approvedOrders = orders.filter((o) => o.status === "approved");

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <span className="px-3 py-1 bg-yellow-500/10 text-yellow-400 rounded-full text-xs font-medium border border-yellow-500/20 flex items-center w-fit">
            <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2 animate-pulse"></div>
            PENDING
          </span>
        );
      case "approved":
        return (
          <span className="px-3 py-1 bg-green-500/10 text-green-400 rounded-full text-xs font-medium border border-green-500/20 flex items-center w-fit">
            <FiCheck className="w-3 h-3 mr-2" />
            APPROVED
          </span>
        );
      case "cancelled":
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

  const StockImage = ({
    imageUrl,
    symbol,
    className = "w-8 h-8",
  }: {
    imageUrl?: string;
    symbol: string;
    className?: string;
  }) => {
    if (imageUrl) {
      return (
        <img
          src={imageUrl}
          alt={symbol}
          className={`${className} rounded-full object-cover border-2 border-slate-600/50`}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = "none";
            target.nextElementSibling?.classList.remove("hidden");
          }}
        />
      );
    }

    return (
      <div
        className={`${className} bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-sm font-bold text-white`}
      >
        {symbol.slice(0, 2)}
      </div>
    );
  };

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
};

  if (loading) {
    return <Loader />;
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
                  Stock Transactions
                </h1>
                <p className="text-slate-400 text-sm md:text-base">
                  All your stock orders in one place
                </p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-6">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-xs md:text-sm">
                    Pending Trades
                  </p>
                  <p className="text-lg md:text-2xl font-bold text-white">
                    {pendingOrders.length}
                  </p>
                </div>
                <div className="p-2 md:p-3 bg-yellow-600/20 rounded-lg">
                  <FiClock className="size-4 md:size-6 text-yellow-400" />
                </div>
              </div>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-xs md:text-sm">
                    Approved Trades
                  </p>
                  <p className="text-lg md:text-2xl font-bold text-white">
                    {approvedOrders.length}
                  </p>
                </div>
                <div className="p-2 md:p-3 bg-green-600/20 rounded-lg">
                  <FiCheck className="size-4 md:size-6 text-green-400" />
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
              Your Trades
            </h2>
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-800/30 border-b border-slate-700/50">
                  <th className="text-left px-6 py-4 text-slate-300 font-medium text-sm uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="text-left px-6 py-4 text-slate-300 font-medium text-sm uppercase tracking-wider">
                    Type
                  </th>
                  <th className="text-left px-6 py-4 text-slate-300 font-medium text-sm uppercase tracking-wider">
                    Price
                  </th>
                  <th className="text-left px-6 py-4 text-slate-300 font-medium text-sm uppercase tracking-wider">
                    Shares
                  </th>
                  <th className="text-left px-6 py-4 text-slate-300 font-medium text-sm uppercase tracking-wider">
                    Total Value
                  </th>
                  <th className="text-left px-6 py-4 text-slate-300 font-medium text-sm uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-left px-6 py-4 text-slate-300 font-medium text-sm uppercase tracking-wider">
                    Time
                  </th>
                  <th className="text-left px-6 py-4 text-slate-300 font-medium text-sm uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center text-slate-400">
                        <FiActivity className="w-12 h-12 mb-4 opacity-50" />
                        <p className="text-lg font-medium">No orders yet</p>
                        <p className="text-sm">
                          Create your first order to get started
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  orders.map((order, index) => (
                    <tr
                      key={order.id}
                      className={`hover:bg-slate-800/30 transition-colors ${
                        index % 2 === 0 ? "bg-slate-800/10" : ""
                      }`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <StockImage
                            imageUrl={order.image_url}
                            symbol={order.asset}
                            className="w-8 h-8 mr-3"
                          />
                          <div>
                            <div className="font-semibold text-white">
                              {order.asset}
                            </div>
                            <div className="text-xs text-slate-400">
                              {order.asset_name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div
                          className={`flex items-center font-medium ${
                            order.type === "buy"
                              ? "text-green-400"
                              : "text-red-400"
                          }`}
                        >
                          {order.type === "buy" ? (
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
                          {formatDate(order.created_at)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {order.status === "pending" && (
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
                  <p className="text-sm">
                    Create your first order to get started
                  </p>
                </div>
              </div>
            ) : (
              <div className="divide-y divide-slate-700/50">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="p-4 hover:bg-slate-800/30 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center">
                        <StockImage
                          imageUrl={order.image_url}
                          symbol={order.asset}
                          className="w-8 h-8 mr-3"
                        />
                        <div>
                          <div className="font-semibold text-white">
                            {order.asset}
                          </div>
                          <div className="text-xs text-slate-400">
                            {order.asset_name}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-white">
                          ${order.total.toLocaleString()}
                        </div>
                        <div className="text-xs text-slate-400">
                          {order.amount} @ ₦{order.price.toLocaleString()}
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        {order.type === "buy" ? (
                          <span className="text-green-400 text-sm">BUY</span>
                        ) : (
                          <span className="text-red-400 text-sm">SELL</span>
                        )}
                        {getStatusBadge(order.status)}
                      </div>

                      <div className="text-xs text-slate-400">
                        {formatDate(order.created_at)}
                      </div>
                    </div>

                    {/* Expandable Details */}
                    <div className="mt-3 pt-3 border-t border-slate-700/50">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-slate-400">Total Value:</span>
                          <span className="ml-2 text-white">
                            ${order.total.toLocaleString()}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400">Status:</span>
                          <span className="ml-2">
                            {getStatusBadge(order.status)}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400">Price:</span>
                          <span className="ml-2 text-white">
                            ${order.price.toLocaleString()}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400">Shares:</span>
                          <span className="ml-2 text-white">
                            {order.amount}
                          </span>
                        </div>
                      </div>

                      {order.status === "pending" && (
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
    </div>
  );
};

export default StockTransactions;