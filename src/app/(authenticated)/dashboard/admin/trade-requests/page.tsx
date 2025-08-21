"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/app/utils/supabase/clients";
import { FiCheck, FiX, FiRefreshCw, FiClock, FiDollarSign, FiEdit, FiSave, FiTrash2, FiSearch, FiTrendingUp, FiActivity, FiChevronDown, FiChevronUp, FiCalendar } from "react-icons/fi";

type TradeRequest = {
  id: string;
  user_id: string;
  wallet_id: string;
  asset?: string;
  asset_name?: string;
  email: string;
  type?: "buy" | "sell";
  price?: number;
  amount?: number;
  total?: number;
  notes?: string;
  status: "pending" | "approved" | "rejected" | "cancelled";
  created_at: string;
  updated_at?: string;
  admin_notes?: string;
  profit_loss?: number;
};

type PortfolioItem = {
  id: string;
  user_id: string;
  wallet_id: string;
  asset: string;
  asset_name: string;
  email: string;
  amount: number;
  price_change?: string;
  average_price: number;
  current_value: number;
  created_at: string;
  updated_at: string;
  image_url?: string;
};

type StockAsset = {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  percentage_change: string;
  price_change?: string;
  image_url?: string;
};

type UserWallet = {
  id: string;
  user_id: string;
  email?: string;
  balance: number;
  wallet_number: string;
  tier: string;
  status: boolean;
};

type StockOrder = {
  id: string;
  user_id: string;
  wallet_id: string;
  email: string;
  asset: string;
  asset_name: string;
  amount: number;
  price: number;
  total: number;
  type: "buy" | "sell";
  status: "pending" | "approved" | "rejected";
  created_at: string;
  approved_at: string;
  image_url?: string;
};

const AdminTradeRequestsPage = () => {
  const supabase = createClient();
  const [activeTab, setActiveTab] = useState<"requests" | "add" | "portfolios">("requests");
  const [tradeRequests, setTradeRequests] = useState<TradeRequest[]>([]);
  const [portfolios, setPortfolios] = useState<PortfolioItem[]>([]);
  const [wallets, setWallets] = useState<UserWallet[]>([]);
  const [stockAssets, setStockAssets] = useState<StockAsset[]>([]);
  const [stockOrders, setStockOrders] = useState<StockOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const [filter, setFilter] = useState<"pending" | "approved" | "rejected" | "cancelled" | "all">("pending");
  const [searchEmail, setSearchEmail] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{ admin_notes?: string }>({});
  const [selectedEmail, setSelectedEmail] = useState<string>("");
  const [selectedStock, setSelectedStock] = useState<StockAsset | null>(null);
  const [stockAmount, setStockAmount] = useState<string>("1");
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [portfolioEditingId, setPortfolioEditingId] = useState<string | null>(null);
  const [portfolioEditForm, setPortfolioEditForm] = useState<{
    amount?: string | number;
    price_change?: string;
    average_price?: string | number;
    current_value?: string | number;
  }>({});
  const [portfolioSearchTerm, setPortfolioSearchTerm] = useState("");
  const [filterEmail, setFilterEmail] = useState<string | "all">("all");
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [pendingOrder, setPendingOrder] = useState<StockOrder | null>(null);
  const [selectedPortfolioUser, setSelectedPortfolioUser] = useState<string | "all">("all");

  const fetchAllData = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("trade_requests")
        .select("*")
        .order("created_at", { ascending: false });

      if (filter !== "all") {
        query = query.eq("status", filter);
      }

      if (searchEmail) {
        query = query.ilike("email", `%${searchEmail}%`);
      }

      const { data: requestsData, error: requestsError } = await query;
      if (requestsError) throw new Error(`Trade requests error: ${requestsError.message}`);
      console.log("Trade Requests:", requestsData);
      setTradeRequests(requestsData || []);

      const { data: stocksData, error: stocksError } = await supabase
        .from("posts")
        .select("id, symbol, name, current_price, percentage_change, price_change, image_url")
        .order("created_at", { ascending: false });
      if (stocksError) throw new Error(`Stocks error: ${stocksError.message}`);
      console.log("Stocks:", stocksData);
      setStockAssets(stocksData || []);

      const { data: walletsData, error: walletsError } = await supabase
        .from("wallets")
        .select("*");
      if (walletsError) throw new Error(`Wallets error: ${walletsError.message}`);
      console.log("Wallets:", walletsData);
      setWallets(walletsData || []);

      const { data: portfolioData, error: portfolioError } = await supabase
        .from("stock_portfolio")
        .select("*");
      if (portfolioError) throw new Error(`Portfolio error: ${portfolioError.message}`);
      console.log("Portfolios:", portfolioData);
      setPortfolios(portfolioData || []);

      const { data: ordersData, error: ordersError } = await supabase
        .from("stock_orders")
        .select("*")
        .order("created_at", { ascending: false });
      if (ordersError) throw new Error(`Stock orders error: ${ordersError.message}`);
      console.log("Stock Orders:", ordersData);
      setStockOrders(ordersData || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      alert(`Failed to load data: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [filter, searchEmail]);

  const approveRequest = async (requestId: string) => {
    setProcessing(requestId);
    try {
      const { error: updateError } = await supabase
        .from("trade_requests")
        .update({
          status: "approved",
          updated_at: new Date().toISOString(),
          admin_notes: editForm.admin_notes || null,
        })
        .eq("id", requestId);

      if (updateError) throw new Error(`Approve error: ${updateError.message}`);
      console.log(`Approved trade request ${requestId}`);
      await fetchAllData();
    } catch (error) {
      console.error("Error approving trade request:", error);
      alert(`Error approving trade request: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setProcessing(null);
      setEditingId(null);
      setEditForm({});
    }
  };

  const rejectRequest = async (requestId: string) => {
    setProcessing(requestId);
    try {
      const { error: updateError } = await supabase
        .from("trade_requests")
        .update({
          status: "rejected",
          updated_at: new Date().toISOString(),
          admin_notes: editForm.admin_notes || null,
        })
        .eq("id", requestId);

      if (updateError) throw new Error(`Reject error: ${updateError.message}`);
      console.log(`Rejected trade request ${requestId}`);
      await fetchAllData();
    } catch (error) {
      console.error("Error rejecting trade request:", error);
      alert(`Error rejecting trade request: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setProcessing(null);
      setEditingId(null);
      setEditForm({});
    }
  };

  const handleEdit = (request: TradeRequest) => {
    setEditingId(request.id);
    setEditForm({
      admin_notes: request.admin_notes || "",
    });
  };

  const handleSave = async (id: string) => {
    try {
      const { error } = await supabase
        .from("trade_requests")
        .update({
          admin_notes: editForm.admin_notes,
        })
        .eq("id", id);

      if (error) throw new Error(`Save notes error: ${error.message}`);
      console.log(`Saved notes for trade request ${id}`);
      await fetchAllData();
      setEditingId(null);
    } catch (error) {
      console.error("Error saving notes:", error);
      alert(`Error saving notes: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  };

  const addStockToPortfolio = async () => {
    if (!selectedEmail || !selectedStock || !stockAmount) {
      alert("Please select a user email, stock, and amount");
      return;
    }

    const amount = parseFloat(stockAmount);
    if (isNaN(amount) || amount <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    console.log("Selected Email:", selectedEmail);
    console.log("Selected Stock:", selectedStock);
    console.log("Amount:", amount);
    console.log("Available Wallets:", wallets);

    setLoading(true);
    try {
      if (wallets.length === 0) {
        throw new Error("No wallets available. Please ensure wallets are loaded.");
      }

      const wallet = wallets.find((w) => w.email === selectedEmail);
      if (!wallet) {
        throw new Error(`No wallet found for email: ${selectedEmail}`);
      }

      const price = selectedStock.current_price;
      const totalCost = price * amount;

      if (wallet.balance < totalCost) {
        alert(
          `Insufficient balance for ${selectedEmail}. Required: $${totalCost.toLocaleString()}, Available: $${wallet.balance.toLocaleString()}`
        );
        return;
      }

      const orderData = {
        user_id: wallet.user_id,
        wallet_id: wallet.id,
        email: selectedEmail,
        asset: selectedStock.symbol,
        asset_name: selectedStock.name,
        amount,
        price,
        total: totalCost,
        type: "buy",
        status: "pending",
        created_at: new Date().toISOString(),
        approved_at: new Date().toISOString(),
        image_url: selectedStock.image_url,
      };

      console.log("Creating stock order:", orderData);

      const { data: newOrder, error: orderError } = await supabase
        .from("stock_orders")
        .insert(orderData)
        .select()
        .single();

      if (orderError) {
        throw new Error(`Stock order creation error: ${orderError.message}`);
      }

      setPendingOrder(newOrder);
      setShowConfirmModal(true);
    } catch (error) {
      console.error("Error creating stock order:", error);
      alert(`Failed to create stock order: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  };

  const approveStockOrder = async () => {
    if (!pendingOrder) return;

    setLoading(true);
    try {
      const wallet = wallets.find((w) => w.email === pendingOrder.email);
      if (!wallet) {
        throw new Error(`No wallet found for email: ${pendingOrder.email}`);
      }

      const { data: existing, error: fetchError } = await supabase
        .from("stock_portfolio")
        .select("*")
        .eq("email", pendingOrder.email)
        .eq("asset", pendingOrder.asset)
        .single();

      if (fetchError && fetchError.code !== "PGRST116") {
        throw new Error(`Portfolio fetch error: ${fetchError.message}`);
      }

      let newAmount = pendingOrder.amount;
      let newAverage = pendingOrder.price;
      if (existing) {
        newAmount = existing.amount + pendingOrder.amount;
        newAverage = (existing.average_price * existing.amount + pendingOrder.price * pendingOrder.amount) / newAmount;
      }

      const portfolioData = {
        user_id: pendingOrder.user_id,
        wallet_id: pendingOrder.wallet_id,
        asset: pendingOrder.asset,
        asset_name: pendingOrder.asset_name,
        email: pendingOrder.email,
        amount: newAmount,
        average_price: newAverage,
        current_value: newAmount * newAverage,
        price_change: pendingOrder.image_url ? stockAssets.find((s) => s.symbol === pendingOrder.asset)?.price_change : "0",
        created_at: existing ? existing.created_at : new Date().toISOString(),
        updated_at: new Date().toISOString(),
        image_url: pendingOrder.image_url,
      };

      console.log("Adding to portfolio:", portfolioData);

 const { error: portfolioError } = await supabase
       .from("stock_portfolio")
         .upsert(portfolioData, { onConflict: "email,asset" });

      if (portfolioError) {
        throw new Error(`Portfolio upsert error: ${portfolioError.message}`);
      }

      const newBalance = wallet.balance - pendingOrder.total;
      const { error: walletError } = await supabase
        .from("wallets")
        .update({ balance: newBalance })
        .eq("email", pendingOrder.email);

      if (walletError) {
        throw new Error(`Wallet update error: ${walletError.message}`);
      }

      const { error: orderUpdateError } = await supabase
        .from("stock_orders")
        .update({ status: "approved", approved_at: new Date().toISOString() })
        .eq("id", pendingOrder.id);

      if (orderUpdateError) {
        throw new Error(`Order approval error: ${orderUpdateError.message}`);
      }

      console.log(`Deducted $${pendingOrder.total.toLocaleString()} from wallet for ${pendingOrder.email}. New balance: $${newBalance.toLocaleString()}`);
      await fetchAllData();
      setStockAmount("1");
      setSelectedEmail("");
      setSelectedStock(null);
      setShowConfirmModal(false);
      setPendingOrder(null);
      alert("Stock added to portfolio successfully!");
    } catch (error) {
      console.error("Error approving stock order:", error);
      alert(`Failed to approve stock order: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  };

  const cancelStockOrder = async () => {
    if (!pendingOrder) return;

    setLoading(true);
    try {
      const { error: orderUpdateError } = await supabase
        .from("stock_orders")
        .update({ status: "rejected", approved_at: new Date().toISOString() })
        .eq("id", pendingOrder.id);

      if (orderUpdateError) {
        throw new Error(`Order rejection error: ${orderUpdateError.message}`);
      }

      console.log(`Rejected stock order ${pendingOrder.id}`);
      await fetchAllData();
      setStockAmount("1");
      setSelectedEmail("");
      setSelectedStock(null);
      setShowConfirmModal(false);
      setPendingOrder(null);
    } catch (error) {
      console.error("Error rejecting stock order:", error);
      alert(`Failed to reject stock order: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  };

  const toggleRowExpansion = (id: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  const startPortfolioEditing = (item: PortfolioItem) => {
    setPortfolioEditingId(item.id);
    setPortfolioEditForm({
      amount: item.amount.toString(),
      price_change: item.price_change || "",
      average_price: item.average_price.toString(),
      current_value: item.current_value.toString(),
    });
  };

  const savePortfolioEdit = async () => {
    if (!portfolioEditingId) return;

    try {
      const { error } = await supabase
        .from("stock_portfolio")
        .update({
          amount: Number(portfolioEditForm.amount) || 0,
          price_change: portfolioEditForm.price_change,
          average_price: Number(portfolioEditForm.average_price) || 0,
          current_value: Number(portfolioEditForm.current_value) || 0,
        })
        .eq("id", portfolioEditingId);

      if (error) throw new Error(`Portfolio edit error: ${error.message}`);

      console.log(`Updated portfolio ${portfolioEditingId}`);
      setPortfolios((prev) =>
        prev.map((portfolio) =>
          portfolio.id === portfolioEditingId
            ? {
                ...portfolio,
                amount: Number(portfolioEditForm.amount) || 0,
                price_change: portfolioEditForm.price_change || "0",
                average_price: Number(portfolioEditForm.average_price) || 0,
                current_value: Number(portfolioEditForm.current_value) || 0,
              }
            : portfolio
        )
      );
      setPortfolioEditingId(null);
    } catch (error) {
      console.error("Error updating portfolio:", error);
      alert(`Error updating portfolio: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  };

  const deleteItem = async (id: string) => {
    if (!confirm("Are you sure you want to delete this portfolio?")) return;

    try {
      const { error } = await supabase.from("stock_portfolio").delete().eq("id", id);
      if (error) throw new Error(`Portfolio delete error: ${error.message}`);
      console.log(`Deleted portfolio ${id}`);
      setPortfolios((prev) => prev.filter((portfolio) => portfolio.id !== id));
    } catch (error) {
      console.error("Error deleting portfolio:", error);
      alert(`Error deleting portfolio: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  };

  const filteredPortfolios = portfolios.filter((portfolio) => {
    const matchesSearch =
      portfolioSearchTerm === "" ||
      portfolio.asset.toLowerCase().includes(portfolioSearchTerm.toLowerCase()) ||
      portfolio.email?.toLowerCase().includes(portfolioSearchTerm.toLowerCase());
    const matchesEmail = selectedPortfolioUser === "all" || portfolio.email === selectedPortfolioUser;
    return matchesSearch && matchesEmail;
  });

  const calculateTotalPortfolioValue = () => {
    return filteredPortfolios.reduce((total, item) => total + item.current_value, 0);
  };
  
  const totalPortfolioValue = calculateTotalPortfolioValue();

  const uniqueEmails = Array.from(new Set(wallets.map((w) => w.email).filter((email): email is string => !!email)));

  const formatWalletNumber = (walletNumber: string) => {
    if (walletNumber.length <= 12) return walletNumber;
    return `${walletNumber.slice(0, 6)}...${walletNumber.slice(-6)}`;
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
    return new Date(dateString).toLocaleString();
  };
const displayNumberOfStocks = () => {
  return stockAssets.length;
};
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white p-4 md:p-6">
      <div className="max-w-full mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-600/20 rounded-xl border border-blue-500/30">
              <FiActivity className="size-6 text-blue-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                Admin Trade Management
              </h1>
              <p className="text-slate-400 text-sm">Manage requests, add stocks, and edit portfolios</p>
            </div>
          </div>
        </div>

        <div className="flex bg-slate-800/50 rounded-xl p-1 border border-slate-700/50 mb-6">
          <button
            onClick={() => setActiveTab("requests")}
            className={`flex-1 py-2 rounded-lg font-medium transition-all duration-200 ${
              activeTab === "requests" ? "bg-blue-600 text-white shadow-lg" : "text-slate-300 hover:text-white"
            }`}
          >
            Trade Requests
          </button>
          <button
            onClick={() => setActiveTab("add")}
            className={`flex-1 py-2 rounded-lg font-medium transition-all duration-200 ${
              activeTab === "add" ? "bg-blue-600 text-white shadow-lg" : "text-slate-300 hover:text-white"
            }`}
          >
            Add Stock
          </button>
          <button
            onClick={() => setActiveTab("portfolios")}
            className={`flex-1 py-2 rounded-lg font-medium transition-all duration-200 ${
              activeTab === "portfolios" ? "bg-blue-600 text-white shadow-lg" : "text-slate-300 hover:text-white"
            }`}
          >
            Portfolios
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          </div>
        ) : (
          <>
            {showConfirmModal && pendingOrder && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-slate-800 rounded-xl p-6 max-w-md w-full border border-slate-700/50">
                  <h3 className="text-lg font-bold text-white mb-4">Confirm Stock Order</h3>
                  <p className="text-slate-300 mb-4">
                    Are you sure you want to approve this order for {pendingOrder.email}?
                    <br />
                    Stock: {pendingOrder.asset_name} ({pendingOrder.asset})
                    <br />
                    Amount: {pendingOrder.amount} shares
                    <br />
                    Total Cost: ${pendingOrder.total.toLocaleString()}
                  </p>
                  <div className="flex justify-end gap-4">
                    <button
                      onClick={cancelStockOrder}
                      className="px-4 py-2 bg-red-600/90 hover:bg-red-600 text-white rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={approveStockOrder}
                      className="px-4 py-2 bg-green-600/90 hover:bg-green-600 text-white rounded-lg"
                    >
                      Approve
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "requests" && (
              <div>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                  <div className="flex gap-4">
                    <select
                      value={filter}
                      onChange={(e) => setFilter(e.target.value as any)}
                      className="bg-slate-800/50 border border-slate-700/50 rounded-lg px-4 py-2 text-white"
                    >
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="all">All</option>
                    </select>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search by email..."
                        value={searchEmail}
                        onChange={(e) => setSearchEmail(e.target.value)}
                        className="bg-slate-800/50 border border-slate-700/50 rounded-lg pl-10 pr-4 py-2 text-white"
                      />
                      <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                    </div>
                    <button
                      onClick={fetchAllData}
                      className="p-2 bg-slate-800/50 rounded-lg hover:bg-slate-700/50"
                    >
                      <FiRefreshCw className="text-blue-400" />
                    </button>
                  </div>
                </div>

                <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-slate-700/50">
                        <tr>
                          <th className="p-4 text-left text-slate-300">Email</th>
             
                          <th className="p-4 text-left text-slate-300">Created At</th>
                          <th className="p-4 text-left text-slate-300">Status</th>
                          <th className="p-4 text-left text-slate-300">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-700/50">
                        {tradeRequests.map((request) => (
                          <tr key={request.id} className="hover:bg-slate-700/30">
                            <td className="p-4">{request.email}</td>
                            
                            <td className="p-4 text-slate-400">{formatDate(request.created_at)}</td>
                            <td className="p-4">
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  request.status === "approved"
                                    ? "bg-green-100/10 text-green-400"
                                    : request.status === "rejected"
                                    ? "bg-red-100/10 text-red-400"
                                    : request.status === "cancelled"
                                    ? "bg-slate-100/10 text-slate-400"
                                    : "bg-yellow-100/10 text-yellow-400"
                                }`}
                              >
                                {request.status === "approved" ? <FiCheck className="mr-1" /> : 
                                 request.status === "rejected" ? <FiX className="mr-1" /> : 
                                 request.status === "cancelled" ? <FiX className="mr-1" /> :
                                 <FiClock className="mr-1" />}
                                {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                              </span>
                            </td>
                            <td className="p-4">
                              <div className="flex space-x-2">
                                {editingId === request.id ? (
                                  <button
                                    onClick={() => handleSave(request.id)}
                                    className="p-1.5 bg-blue-600/20 text-blue-400 rounded-lg hover:bg-blue-600/30"
                                    title="Save"
                                  >
                                    <FiSave size={16} />
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => handleEdit(request)}
                                    className="p-1.5 bg-slate-600/20 text-slate-400 rounded-lg hover:bg-slate-600/30"
                                    title="Edit"
                                  >
                                    <FiEdit size={16} />
                                  </button>
                                )}
                                {request.status === "pending" && (
                                  <>
                                    <button
                                      onClick={() => approveRequest(request.id)}
                                      disabled={processing === request.id}
                                      className="p-1.5 bg-green-600/20 text-green-400 rounded-lg hover:bg-green-600/30 disabled:opacity-50"
                                      title="Approve"
                                    >
                                      <FiCheck size={16} />
                                    </button>
                                    <button
                                      onClick={() => rejectRequest(request.id)}
                                      disabled={processing === request.id}
                                      className="p-1.5 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 disabled:opacity-50"
                                      title="Reject"
                                    >
                                      <FiX size={16} />
                                    </button>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
            {activeTab === "add" && (
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6">
                <h2 className="text-xl font-bold mb-6 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                  Buy Stock for User
                </h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-slate-300 mb-2 font-medium">Select User Email</label>
                    <select
                      value={selectedEmail}
                      onChange={(e) => {
                        console.log("Selected Email:", e.target.value);
                        setSelectedEmail(e.target.value);
                      }}
                      className="w-full bg-slate-800/50 border border-slate-600/50 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none backdrop-blur-sm"
                    >
                      <option value="">Select a user email</option>
                      {uniqueEmails.length === 0 ? (
                        <option disabled>No users available</option>
                      ) : (
                        uniqueEmails.map((email) => (
                          <option key={email} value={email}>
                            {email} (Balance: ${wallets.find((w) => w.email === email)?.balance.toLocaleString() || "N/A"})
                          </option>
                        ))
                      )}
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-300 mb-2 font-medium">Select Stock</label>
                    <select
                      value={selectedStock ? `${selectedStock.symbol} - ${selectedStock.name} ($${selectedStock.current_price.toLocaleString()})` : ""}
                      onChange={(e) => {
                        const selectedId = e.target.value.split(" - ")[0];
                        const stock = stockAssets.find((s) => s.symbol === selectedId) || null;
                        setSelectedStock(stock);
                        console.log("Selected Stock:", stock);
                      }}
                      className="w-full bg-slate-800/50 border border-slate-600/50 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none backdrop-blur-sm"
                    >
                      <option value="">Select a stock</option>
                      {stockAssets.map((stock) => (
                        <option key={stock.id} value={`${stock.symbol} - ${stock.name} ($${stock.current_price.toLocaleString()})`}>
                          {stock.symbol} - {stock.name} (${stock.current_price.toLocaleString()})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-300 mb-2 font-medium">Amount of Shares</label>
                    <input
                      type="number"
                      value={stockAmount}
                      onChange={(e) => setStockAmount(e.target.value)}
                      className="w-full bg-slate-800/50 border border-slate-600/50 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none backdrop-blur-sm"
                      min="1"
                      step="1"
                    />
                  </div>
                  <button
                    onClick={addStockToPortfolio}
                    disabled={loading || !selectedEmail || !selectedStock || !stockAmount}
                    className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-lg"
                  >
                    {loading ? "Processing..." : "Submit Stock Order"}
                  </button>
                </div>
              </div>
            )}
            {activeTab === "portfolios" && (
              <div>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-blue-600/20 rounded-xl border border-blue-500/30">
                      <FiTrendingUp className="size-6 text-blue-400" />
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                        User Portfolios
                      </h1>
                      <p className="text-slate-400 text-sm">Edit user stock portfolios</p>
                      <p className="font-bold text-red-600">Trades: {displayNumberOfStocks()}</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                  <div className="relative">
                      <select
                        value={selectedPortfolioUser}
                        onChange={(e) => setSelectedPortfolioUser(e.target.value)}
                        className="bg-slate-800/50 border border-slate-700/50 rounded-lg px-4 py-2 text-white"
                      >
                        <option value="all">All Users</option>
                        {uniqueEmails.map((email) => (
                          <option key={email} value={email}>
                            {email}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search asset or email..."
                        value={portfolioSearchTerm}
                        onChange={(e) => setPortfolioSearchTerm(e.target.value)}
                        className="bg-slate-800/50 border border-slate-700/50 rounded-lg pl-10 pr-4 py-2 text-white"
                      />
                      <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                    </div>
                    <button
                      onClick={fetchAllData}
                      className="p-2 bg-slate-800/50 rounded-lg hover:bg-slate-700/50"
                    >
                      <FiRefreshCw className="text-blue-400" />
                    </button>
                  </div>
                </div>
                {selectedPortfolioUser !== "all" && (
                    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6 mb-6">
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="text-slate-300 text-sm font-medium">Total Portfolio Value for {selectedPortfolioUser}</h3>
                                <p className="text-3xl font-bold text-blue-400 mt-1">${totalPortfolioValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                            </div>
                        </div>
                    </div>
                )}
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 overflow-hidden divide-y divide-slate-700/50">
                  {filteredPortfolios.map((portfolio) => (
                    <div key={portfolio.id}>
                      <div className="grid grid-cols-12 items-center p-4 md:p-6 gap-4 hover:bg-slate-700/30">
                        {/* User & Asset Info */}
                        <div className="col-span-12 md:col-span-4 flex items-center gap-4">
                          <div className="flex items-center gap-4">
                            <StockImage imageUrl={portfolio.image_url} symbol={portfolio.asset} />
                            <div>
                              <h3 className="font-bold text-white">{portfolio.asset_name}</h3>
                              <p className="text-sm text-slate-400 font-mono">{portfolio.asset}</p>
                            </div>
                          </div>
                        </div>

                        {/* Shares & Avg Price */}
                        <div className="col-span-6 md:col-span-2 text-right">
                          <p className="text-white font-medium">{portfolio.amount} shares</p>
                          <p className="text-slate-400">Shares</p>
                        </div>
                        <div className="col-span-6 md:col-span-2 text-right">
                          <p className="text-white font-medium">${portfolio.average_price.toLocaleString()}</p>
                          <p className="text-slate-400">Avg Price</p>
                        </div>

                        {/* Current Value & Price Change */}
                        <div className="col-span-6 md:col-span-2 text-right">
                          <p className="text-white font-medium">${portfolio.current_value.toLocaleString()}</p>
                          <p className="text-slate-400">Current Value</p>
                        </div>
                        <div className="col-span-6 md:col-span-2 text-right">
                          <p
                            className={`${
                              portfolio.price_change?.includes("+") ? "text-green-600" : "text-red-700"
                            } font-medium`}
                          >
                            {portfolio.price_change ?? "N/A"}
                          </p>
                          <p className="text-slate-400">Price Change</p>
                        </div>

                        {/* Actions */}
                        <div className="col-span-12 flex justify-end items-center gap-2">
                          <button
                            onClick={() => toggleRowExpansion(portfolio.id)}
                            className="flex items-center gap-1 px-3 py-1 bg-slate-700/50 hover:bg-slate-700 rounded-lg text-sm transition-colors"
                          >
                            Details
                            {expandedRows.has(portfolio.id) ? <FiChevronUp size={14} /> : <FiChevronDown size={14} />}
                          </button>
                          {portfolioEditingId === portfolio.id ? (
                            <button
                              onClick={savePortfolioEdit}
                              className="flex items-center gap-1 px-3 py-1 bg-blue-600/90 hover:bg-blue-600 text-white rounded-lg text-sm transition-colors border border-blue-500/30"
                            >
                              <FiSave size={14} />
                              Save
                            </button>
                          ) : (
                            <button
                              onClick={() => startPortfolioEditing(portfolio)}
                              className="flex items-center gap-1 px-3 py-1 bg-blue-600/90 hover:bg-blue-600 text-white rounded-lg text-sm transition-colors border border-blue-500/30"
                            >
                              <FiEdit size={14} />
                              Edit
                            </button>
                          )}
                          <button
                            onClick={() => deleteItem(portfolio.id)}
                            className="flex items-center gap-1 px-3 py-1 bg-red-600/90 hover:bg-red-600 text-white rounded-lg text-sm transition-colors border border-red-500/30"
                          >
                            <FiTrash2 size={14} />
                          </button>
                        </div>
                      </div>
                      {expandedRows.has(portfolio.id) && (
                        <div className="border-t border-slate-700/50 bg-slate-800/10 p-4 md:p-6">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-4">
                              <h4 className="text-sm font-semibold text-blue-400 flex items-center gap-2">
                                <FiTrendingUp size={16} />
                                Asset Details
                              </h4>
                              <div className="space-y-3">
                                <div>
                                  <label className="text-xs text-slate-400">Asset</label>
                                  <div className="text-sm text-white">{portfolio.asset}</div>
                                </div>
                                <div>
                                  <label className="text-xs text-slate-400">Asset Name</label>
                                  <div className="text-sm text-white">{portfolio.asset_name}</div>
                                </div>
                                <div>
                                  <label className="text-xs text-slate-400">Wallet ID</label>
                                  <div className="text-sm text-white font-mono break-all">{portfolio.wallet_id}</div>
                                </div>
                              </div>
                            </div>
                            <div className="space-y-4">
                              <h4 className="text-sm font-semibold text-green-400 flex items-center gap-2">
                                <FiDollarSign size={16} />
                                Financial Information
                              </h4>
                              <div className="space-y-3">
                                <div>
                                  <label className="text-xs text-slate-400">Shares</label>
                                  <div className="text-sm text-white">
                                    {portfolioEditingId === portfolio.id ? (
                                      <input
                                        type="number"
                                        value={portfolioEditForm.amount || ""}
                                        onChange={(e) =>
                                          setPortfolioEditForm({ ...portfolioEditForm, amount: e.target.value })
                                        }
                                        className="w-full px-2 py-1 bg-slate-800/50 border border-slate-700/50 rounded text-white text-sm"
                                      />
                                    ) : (
                                      <span>{portfolio.amount} shares</span>
                                    )}
                                  </div>
                                </div>
                                <div>
                                  <label className="text-xs text-slate-400">Average Price</label>
                                  <div className="text-sm text-white">
                                    {portfolioEditingId === portfolio.id ? (
                                      <input
                                        type="number"
                                        value={portfolioEditForm.average_price || ""}
                                        onChange={(e) =>
                                          setPortfolioEditForm({ ...portfolioEditForm, average_price: e.target.value })
                                        }
                                        className="w-full px-2 py-1 bg-slate-800/50 border border-slate-700/50 rounded text-white text-sm"
                                      />
                                    ) : (
                                      <span>${portfolio.average_price.toLocaleString()}</span>
                                    )}
                                  </div>
                                </div>
                                <div>
                                  <label className="text-xs text-slate-400">Current Value</label>
                                  <div className="text-sm text-white">
                                    {portfolioEditingId === portfolio.id ? (
                                      <input
                                        type="number"
                                        value={portfolioEditForm.current_value || ""}
                                        onChange={(e) =>
                                          setPortfolioEditForm({ ...portfolioEditForm, current_value: e.target.value })
                                        }
                                        className="w-full px-2 py-1 bg-slate-800/50 border border-slate-700/50 rounded text-white text-sm"
                                      />
                                    ) : (
                                      <span>${portfolio.current_value.toLocaleString()}</span>
                                    )}
                                  </div>
                                </div>
                                <div>
                                  <label className="text-xs text-slate-400">P & L</label>
                                  <div className="text-sm text-white">
                                    {portfolioEditingId === portfolio.id ? (
                                      <input
                                        type="text"
                                        value={portfolioEditForm.price_change || ""}
                                        onChange={(e) =>
                                          setPortfolioEditForm({ ...portfolioEditForm, price_change: e.target.value })
                                        }
                                        className="w-full px-2 py-1 bg-slate-800/50 border border-slate-700/50 rounded text-white text-sm"
                                      />
                                    ) : (
                                      <span
                                        className={`${
                                          portfolio?.price_change?.toString().includes("+")
                                            ? "text-green-600"
                                            : "text-red-700"
                                        }`}
                                      >
                                        {portfolio?.price_change?.toLocaleString?.() ?? "N/A"}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="space-y-4">
                              <h4 className="text-sm font-semibold text-purple-400 flex items-center gap-2">
                                <FiCalendar size={16} />
                                Timestamps
                              </h4>
                              <div className="space-y-3">
                                <div>
                                  <label className="text-xs text-slate-400">Created</label>
                                  <div className="text-sm text-white">
                                    {portfolio.created_at ? new Date(portfolio.created_at).toLocaleDateString() : "N/A"}
                                  </div>
                                </div>
                                <div>
                                  <label className="text-xs text-slate-400">Updated</label>
                                  <div className="text-sm text-white">
                                    {portfolio.updated_at ? new Date(portfolio.updated_at).toLocaleDateString() : "N/A"}
                                  </div>
                                </div>
                                <div>
                                  <label className="text-xs text-slate-400">Portfolio ID</label>
                                  <div className="text-sm text-slate-300 font-mono break-all">{portfolio.id}</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminTradeRequestsPage;