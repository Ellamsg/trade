"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/app/utils/supabase/clients";
import {
  FiEdit,
  FiSave,
  FiRefreshCw,
  FiTrash2,
  FiSearch,
  FiUser,
  FiDollarSign,
  FiTrendingUp,
  FiCreditCard,
  FiActivity,
  FiChevronDown,
  FiChevronUp,
  FiEye,
  FiCalendar,
} from "react-icons/fi";
import { TIER_CONFIG, UserWallet, WalletTier, TokenType } from "@/app/data";

type PortfolioItem = {
  id: string;
  user_id: string;
  wallet_id: string;
  asset: string;
  asset_name: string;
  email: string;
  amount: number;
  price_change: string;
  average_price: number;
  current_value: number;
  created_at: string;
  updated_at: string;
  image_url?: string;
};

const AdminWalletsPage = () => {
  const supabase = createClient();
  const [activeTab, setActiveTab] = useState<"wallets" | "portfolios">(
    "wallets"
  );
  const [wallets, setWallets] = useState<UserWallet[]>([]);
  const [portfolios, setPortfolios] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [editForm, setEditForm] = useState<{
    balance?: string | number;
    current_value?: string | number;
    profit_loss?: string | number;
    performance_percentage?: string | number;
    status?: boolean;
    commissions?: string | number;
    price_change?: string;
    percent?: string | number;
    encrypted_balance?: string | number;
    amount?: string | number;
     p_l? :string;
    average_price?: string | number;
  }>({});
  const [filterUserId, setFilterUserId] = useState<string | "all">("all");

  // Toggle row expansion
  const toggleRowExpansion = (id: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  // Fetch all wallet and portfolio data
  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch wallets
      const { data: walletsData, error: walletsError } = await supabase
        .from("wallets")
        .select("*");

      if (walletsError) throw walletsError;
      setWallets(walletsData || []);

      // Fetch portfolios
      const { data: portfolioData, error: portfolioError } = await supabase
        .from("stock_portfolio")
        .select("*");

      if (portfolioError) throw portfolioError;
      setPortfolios(portfolioData || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Start editing an item (wallet or portfolio)
  const startEditing = (item: UserWallet | PortfolioItem) => {
    setEditingId(item.id);
    if ("balance" in item) {
      // Wallet editing
      setEditForm({
        balance: item.balance.toString(),
        percent: item.percent?.toString(),
        commissions: item.commissions?.toString(),
        encrypted_balance: item.encrypted_balance?.toString(),
        current_value: item.current_value.toString(),
        p_l: item.p_l,
        profit_loss: item.profit_loss.toString(),
        performance_percentage: item.performance_percentage.toString(),
        status: item.status,
      });
    } else {
      // Portfolio editing
      setEditForm({
        amount: item.amount.toString(),
        price_change: item.price_change.toString(),
        average_price: item.average_price.toString(),
        current_value: item.current_value.toString(),
      });
    }
  };

  // Save edited item
  const saveEdit = async () => {
    if (!editingId) return;

    try {
      setLoading(true);
      if (activeTab === "wallets") {
        const { error } = await supabase
          .from("wallets")
          .update({
            balance: Number(editForm.balance) || 0,
            percent: Number(editForm.percent) || 0,
            p_l: editForm.p_l,
            commissions: Number(editForm.commissions) || 0,
            current_value: Number(editForm.current_value) || 0,
            profit_loss: Number(editForm.profit_loss) || 0,
            encrypted_balance: Number(editForm.encrypted_balance) || 0,
            performance_percentage:
            Number(editForm.performance_percentage) || 0,
            status: editForm.status,
          })
          .eq("id", editingId);

        if (error) throw error;

        setWallets((prev) =>
          prev.map((wallet) =>
            wallet.id === editingId
              ? {
                  ...wallet,
                  balance: Number(editForm.balance) || 0,
                  percent: Number(editForm.percent) || 0,
                  commissions: Number(editForm.commissions) || 0,
                  p_l: editForm.p_l || "0",
                  current_value: Number(editForm.current_value) || 0,
                  encrypted_balance: Number(editForm.encrypted_balance) || 0,
                  profit_loss: Number(editForm.profit_loss) || 0,
                  performance_percentage:Number(editForm.performance_percentage) || 0,
                  status: editForm.status || false,
       
                }
              : wallet
          )
        );
      } else {
        const { error } = await supabase
          .from("stock_portfolio")
          .update({
            amount: Number(editForm.amount) || 0,
            price_change: editForm.price_change,
            average_price: Number(editForm.average_price) || 0,
            current_value: Number(editForm.current_value) || 0,
          })
          .eq("id", editingId);

        if (error) throw error;

        setPortfolios((prev) =>
          prev.map((portfolio) =>
            portfolio.id === editingId
              ? {
                  ...portfolio,
                  amount: Number(editForm.amount) || 0,
                  price_change: String(editForm.price_change) || "0",
                  average_price: Number(editForm.average_price) || 0,
                  current_value: Number(editForm.current_value) || 0,
                }
              : portfolio
          )
        );
      }
      setEditingId(null);
    } catch (error) {
      console.error(`Error updating ${activeTab}:`, error);
    } finally {
      setLoading(false);
    }
  };

  // Delete item (wallet or portfolio)
  const deleteItem = async (id: string) => {
    if (
      !confirm(
        `Are you sure you want to delete this ${activeTab.slice(0, -1)}?`
      )
    )
      return;

    try {
      setLoading(true);
      if (activeTab === "wallets") {
        const { error } = await supabase.from("wallets").delete().eq("id", id);
        if (error) throw error;
        setWallets((prev) => prev.filter((wallet) => wallet.id !== id));
      } else {
        const { error } = await supabase
          .from("stock_portfolio")
          .delete()
          .eq("id", id);
        if (error) throw error;
        setPortfolios((prev) =>
          prev.filter((portfolio) => portfolio.id !== id)
        );
      }
    } catch (error) {
      console.error(`Error deleting ${activeTab.slice(0, -1)}:`, error);
    } finally {
      setLoading(false);
    }
  };

  // Filtered data
  const filteredWallets = wallets.filter((wallet) => {
    const matchesSearch =
      searchTerm === "" ||
      wallet.wallet_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wallet.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesUser =
      filterUserId === "all" || wallet.user_id === filterUserId;
    return matchesSearch && matchesUser;
  });

  const filteredPortfolios = portfolios.filter((portfolio) => {
    const matchesSearch =
      searchTerm === "" ||
      portfolio.asset.toLowerCase().includes(searchTerm.toLowerCase()) ||
      portfolio.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesUser =
      filterUserId === "all" || portfolio.user_id === filterUserId;
    return matchesSearch && matchesUser;
  });

  // Get unique user IDs for filter dropdown
  const uniqueUserIds = Array.from(
    new Set([
      ...wallets.map((w) => w.user_id),
      ...portfolios.map((p) => p.user_id),
    ])
  );

  // Format wallet number for display
  const formatWalletNumber = (walletNumber: string) => {
    if (walletNumber.length <= 12) return walletNumber;
    return `${walletNumber.slice(0, 6)}...${walletNumber.slice(-6)}`;
  };

  // Stock image component
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

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white p-4 md:p-6">
      <div className="max-w-full mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-600/20 rounded-xl border border-blue-500/30">
              {activeTab === "wallets" ? (
                <FiCreditCard className="size-6 text-blue-400" />
              ) : (
                <FiTrendingUp className="size-6 text-blue-400" />
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                {activeTab === "wallets"
                  ? "Manage Wallets"
                  : "Manage Portfolios"}
              </h1>
              <p className="text-slate-400">
                Admin interface for user {activeTab}
              </p>
            </div>
          </div>
          <button
            onClick={fetchData}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors border border-blue-500/30"
          >
            <FiRefreshCw className={`${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>

        {/* Tabs */}
        <div className="mb-6 bg-slate-800/50 rounded-xl p-1 border border-slate-700/50 flex">
          <button
            onClick={() => setActiveTab("wallets")}
            className={`flex-1 py-2 rounded-lg font-medium transition-all duration-200 ${
              activeTab === "wallets"
                ? "bg-blue-600 text-white shadow-lg"
                : "text-slate-300 hover:text-white"
            }`}
          >
            Wallets
          </button>
          <button
            onClick={() => setActiveTab("portfolios")}
            className={`flex-1 py-2 rounded-lg font-medium transition-all duration-200 ${
              activeTab === "portfolios"
                ? "bg-blue-600 text-white shadow-lg"
                : "text-slate-300 hover:text-white"
            }`}
          >
            Portfolios
          </button>
        </div>

        {/* Filters */}
        <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl border border-slate-700/50 p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-slate-400" />
              </div>
              <input
                type="text"
                placeholder={
                  activeTab === "wallets"
                    ? "Search wallets..."
                    : "Search portfolios..."
                }
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiUser className="text-slate-400" />
              </div>
              <select
                value={filterUserId}
                onChange={(e) =>
                  setFilterUserId(e.target.value as string | "all")
                }
                className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
              >
                <option value="all">All Users</option>
                {uniqueUserIds.map((userId) => {
                  const item =
                    wallets.find((w) => w.user_id === userId) ||
                    portfolios.find((p) => p.user_id === userId);
                  return (
                    <option key={userId} value={userId}>
                      {item?.email ||
                        `${userId.slice(0, 6)}...${userId.slice(-4)}`}
                    </option>
                  );
                })}
              </select>
            </div>
            <div className="flex items-center text-slate-300">
              <FiDollarSign className="mr-2" />
              <span>
                Total {activeTab === "wallets" ? "Wallets" : "Portfolio Items"}:{" "}
                {activeTab === "wallets"
                  ? filteredWallets.length
                  : filteredPortfolios.length}
              </span>
            </div>
          </div>
        </div>

        {/* Wallets/Portfolios Cards/Table */}
        <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl border border-slate-700/50 overflow-hidden shadow-lg">
          {loading ? (
            <div className="flex justify-center p-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-400"></div>
            </div>
          ) : activeTab === "wallets" ? (
            filteredWallets.length === 0 ? (
              <div className="text-center p-12 text-slate-400">
                <FiCreditCard className="mx-auto h-12 w-12 opacity-50 mb-4" />
                <p className="text-lg">No wallets found</p>
                <p className="text-sm mt-1">
                  {searchTerm || filterUserId !== "all"
                    ? "Try adjusting your filters"
                    : "Users haven't created any wallets yet"}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-700/50">
                {filteredWallets.map((wallet) => (
                  <div
                    key={wallet.id}
                    className="bg-slate-800/20 hover:bg-slate-800/40 transition-colors"
                  >
                    {/* Main Row */}
                    <div className="p-4 md:p-6">
                      <div className="grid grid-cols-12 gap-4 items-center">
                        {/* User Info */}
                        <div className="col-span-12 md:col-span-3">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-600 rounded-full flex items-center justify-center text-sm font-bold mr-3 shrink-0">
                              {wallet.email?.charAt(0).toUpperCase() || "U"}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="text-sm font-medium text-white truncate">
                                {wallet.email ||
                                  `${wallet.user_id.slice(0, 8)}...`}
                              </div>
                              <div className="text-xs text-slate-400">
                                ID: {wallet.user_id.slice(0, 8)}...
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Wallet Info */}
                        <div className="col-span-12 md:col-span-3">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-sm font-bold mr-3 shrink-0">
                              {wallet.wallet_number.slice(0, 2)}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="text-sm font-medium text-white truncate">
                                {formatWalletNumber(wallet.wallet_number)}
                              </div>
                              <div className="text-xs text-slate-400">
                                {wallet.network} ({wallet.token_type})
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Tier & Balance */}
                        <div className="col-span-6 md:col-span-2">
                          <div className="space-y-2">
                            <span
                              className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                                TIER_CONFIG[wallet.tier].bgColor
                              }`}
                            >
                              {TIER_CONFIG[wallet.tier].name}
                            </span>
                            <div className="text-sm text-white">

                              <div>

                                {editingId === wallet.id ? (
                                <input
                                  type="text"
                                  placeholder="e.g - , +"
                                  value={editForm.p_l || ""}
                                  onChange={(e) =>
                                    setEditForm({
                                      ...editForm,
                                      p_l: e.target.value,
                                    })
                                  }
                                  className="w-full px-2 py-1 bg-slate-800/50 border border-slate-700/50 rounded text-white text-sm"
                                />
                              ) : (
                                <span>P & L{wallet.p_l}</span>
                              )}
                              </div>
                              {editingId === wallet.id ? (
                                <input
                                  type="number"
                                  value={editForm.balance || ""}
                                  onChange={(e) =>
                                    setEditForm({
                                      ...editForm,
                                      balance: e.target.value,
                                    })
                                  }
                                  className="w-full px-2 py-1 bg-slate-800/50 border border-slate-700/50 rounded text-white text-sm"
                                />
                              ) : (
                                <span>${wallet.balance.toLocaleString()}</span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Status */}
                        <div className="col-span-6 md:col-span-2">
                          {editingId === wallet.id ? (
                            <select
                              value={editForm.status ? "true" : "false"}
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm,
                                  status: e.target.value === "true",
                                })
                              }
                              className="w-full bg-slate-800/50 border border-slate-700/50 rounded text-white px-2 py-1 text-sm"
                            >
                              <option value="true">Active</option>
                              <option value="false">Inactive</option>
                            </select>
                          ) : (
                            <span
                              className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                                wallet.status
                                  ? "bg-green-500/20 text-green-400"
                                  : "bg-yellow-500/20 text-yellow-400"
                              }`}
                            >
                              {wallet.status ? "Active" : "Pending"}
                            </span>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="col-span-12 md:col-span-2">
                          <div className="flex items-center justify-end gap-2">
                            {editingId === wallet.id ? (
                              <>
                                <button
                                  onClick={saveEdit}
                                  className="flex items-center cursor-pointer gap-1 px-3 py-1 bg-green-600/90 hover:bg-green-600 text-white rounded-lg text-sm transition-colors border border-green-500/30"
                                >
                                  <FiSave size={14} />
                                  <span className="hidden sm:inline">Save</span>
                                </button>
                                <button
                                  onClick={() => setEditingId(null)}
                                  className="flex items-center gap-1 px-3 py-1 bg-slate-700/90 hover:bg-slate-700 text-white rounded-lg text-sm transition-colors border border-slate-600/30"
                                >
                                  Cancel
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() => toggleRowExpansion(wallet.id)}
                                  className="flex items-center cursor-pointer gap-1 px-3 py-1 bg-indigo-600/90 hover:bg-indigo-600 text-white rounded-lg text-sm transition-colors border border-indigo-500/30"
                                >
                                  <FiEye size={14} />
                                  {expandedRows.has(wallet.id) ? (
                                    <FiChevronUp size={14} />
                                  ) : (
                                    <FiChevronDown size={14} />
                                  )}
                                </button>
                                <button
                                  onClick={() => startEditing(wallet)}
                                  className="flex items-center cursor-pointer gap-1 px-3 py-1 bg-blue-600/90 hover:bg-blue-600 text-white rounded-lg text-sm transition-colors border border-blue-500/30"
                                >
                                  <FiEdit size={14} />
                                  <span className="hidden sm:inline">Edit</span>
                                </button>
                                <button
                                  onClick={() => deleteItem(wallet.id)}
                                  className="flex cursor-pointer items-center gap-1 px-3 py-1 bg-red-600/90 hover:bg-red-600 text-white rounded-lg text-sm transition-colors border border-red-500/30"
                                >
                                  <FiTrash2 size={14} />
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Expanded Wallet Details */}
                    {expandedRows.has(wallet.id) && (
                      <div className="border-t border-slate-700/50 bg-slate-800/10 p-4 md:p-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="space-y-4">
                            <h4 className="text-sm font-semibold text-blue-400 flex items-center gap-2">
                              <FiCreditCard size={16} />
                              Wallet Details
                            </h4>
                            <div className="space-y-3">
                              <div>
                                <label className="text-xs text-slate-400">
                                  Full Wallet Number
                                </label>
                                <div className="text-sm text-white bg-slate-800/50 rounded-lg p-2 font-mono break-all">
                                  {wallet.wallet_number}
                                </div>
                              </div>
                              <div>
                                <label className="text-xs text-slate-400">
                                  Network
                                </label>
                                <div className="text-sm text-white">
                                  {wallet.network}
                                </div>
                              </div>
                              <div>
                                <label className="text-xs text-slate-400">
                                  Token Type
                                </label>
                                <div className="text-sm text-white">
                                  {wallet.token_type}
                                </div>
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
                                {/* <label className="text-xs text-slate-400">
                                  Current Value
                                </label> */}
                                <div className="text-sm text-white">
                                  {/* {editingId === wallet.id ? (
                                    <input
                                      type="number"
                                      value={editForm.current_value || ""}
                                      onChange={(e) =>
                                        setEditForm({
                                          ...editForm,
                                          current_value: e.target.value,
                                        })
                                      }
                                      className="w-full px-2 py-1 bg-slate-800/50 border border-slate-700/50 rounded text-white text-sm"
                                    />
                                  ) : (
                                    <span>
                                      ${wallet.current_value.toLocaleString()}
                                    </span>
                                  )} */}
                                </div>
                              </div>
                              <div>
                                <div className="text-sm text-white">
                                  <label className="text-xs text-slate-400">
                                    Encrypted Balance :
                                  </label>
                                  {editingId === wallet.id ? (
                                    <input
                                      type="number"
                                      value={editForm.encrypted_balance || ""}
                                      onChange={(e) =>
                                        setEditForm({
                                          ...editForm,
                                          encrypted_balance: e.target.value,
                                        })
                                      }
                                      className="w-full px-2 py-1 bg-slate-800/50 border border-slate-700/50 rounded text-white text-sm"
                                    />
                                  ) : (
                                    <span>
                                      $
                                      {wallet.encrypted_balance.toLocaleString()}
                                    </span>
                                  )}
                                </div>

                                <div className="text-sm text-white">
                                  <label className="text-xs text-slate-400">
                                    Portfolio % :
                                  </label>

                                  {editingId === wallet.id ? (
                                    <input
                                      type="number"
                                      value={editForm.percent || ""}
                                      onChange={(e) =>
                                        setEditForm({
                                          ...editForm,
                                          percent: e.target.value,
                                        })
                                      }
                                      className="w-full px-2 py-1 bg-slate-800/50 border border-slate-700/50 rounded text-white text-sm"
                                    />
                                  ) : (
                                    <span>
                                      {wallet.percent}
                                    </span>
                                  )}
                                </div>

                            <div className="text-sm text-white">
                                  <label className="text-xs text-slate-400">
                                   Commission $:
                                  </label>
                                   
                                  {editingId === wallet.id ? (
                                    <input
                                      type="number"
                                      value={editForm.commissions || ""}
                                      onChange={(e) =>
                                        setEditForm({
                                          ...editForm,
                                          commissions: e.target.value,
                                        })
                                      }
                                      className="w-full px-2 py-1 bg-slate-800/50 border border-slate-700/50 rounded text-white text-sm"
                                    />
                                  ) : (
                                    <span>
                                      {wallet.commissions}
                                    </span>
                                  )}
                                </div>

                                <label className="text-xs hidden text-slate-400">
                                  Profit/Loss
                                </label>
                                <div className="text-sm hidden">
                                  {editingId === wallet.id ? (
                                    <input
                                      type="number"
                                      value={editForm.profit_loss || ""}
                                      onChange={(e) =>
                                        setEditForm({
                                          ...editForm,
                                          profit_loss: e.target.value,
                                        })
                                      }
                                      className="w-full px-2 py-1 bg-slate-800/50 border border-slate-700/50 rounded text-white text-sm"
                                    />
                                  ) : (
                                    <span
                                      className={
                                        wallet.profit_loss >= 0
                                          ? "text-green-400"
                                          : "text-red-400"
                                      }
                                    >
                                      {wallet.profit_loss >= 0 ? "+" : ""}$
                                      {wallet.profit_loss.toLocaleString()}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="hidden">
                                <label className="text-xs text-slate-400">
                                  Performance
                                </label>
                                <div className="text-sm">
                                  {editingId === wallet.id ? (
                                    <input
                                      type="number"
                                      value={
                                        editForm.performance_percentage || ""
                                      }
                                      onChange={(e) =>
                                        setEditForm({
                                          ...editForm,
                                          performance_percentage:
                                            e.target.value,
                                        })
                                      }
                                      className="w-full px-2 py-1 bg-slate-800/50 border border-slate-700/50 rounded text-white text-sm"
                                    />
                                  ) : (
                                    <span
                                      className={
                                        wallet.performance_percentage >= 0
                                          ? "text-green-400"
                                          : "text-red-400"
                                      }
                                    >
                                      {wallet.performance_percentage >= 0
                                        ? "+"
                                        : ""}
                                      {wallet.performance_percentage.toFixed(2)}
                                      %
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
                                <label className="text-xs text-slate-400">
                                  Created
                                </label>
                                <div className="text-sm text-white">
                                  {wallet.created_at
                                    ? new Date(
                                        wallet.created_at
                                      ).toLocaleDateString()
                                    : "N/A"}
                                </div>
                              </div>
                              <div>
                                <label className="text-xs text-slate-400">
                                  Wallet ID
                                </label>
                                <div className="text-sm text-slate-300 font-mono break-all">
                                  {wallet.id}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )
          ) : filteredPortfolios.length === 0 ? (
            <div className="text-center p-12 text-slate-400">
              <FiTrendingUp className="mx-auto h-12 w-12 opacity-50 mb-4" />
              <p className="text-lg">No portfolio items found</p>
              <p className="text-sm mt-1">
                {searchTerm || filterUserId !== "all"
                  ? "Try adjusting your filters"
                  : "Users haven't added any portfolio items yet"}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-700/50">
              {filteredPortfolios.map((portfolio) => (
                <div
                  key={portfolio.id}
                  className="bg-slate-800/20 hover:bg-slate-800/40 transition-colors"
                >
                  {/* Main Portfolio Row */}
                  <div className="p-4 md:p-6">
                    <div className="grid grid-cols-12 gap-4 items-center">
                      {/* User Info */}
                      <div className="col-span-12 md:col-span-3">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-600 rounded-full flex items-center justify-center text-sm font-bold mr-3 shrink-0">
                            {portfolio.email?.charAt(0).toUpperCase() || "U"}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-sm font-medium text-white truncate">
                              {portfolio.email ||
                                `${portfolio.user_id.slice(0, 8)}...`}
                            </div>
                            <div className="text-xs text-slate-400">
                              ID: {portfolio.user_id.slice(0, 8)}...
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Asset Info */}
                      <div className="col-span-12 md:col-span-3">
                        <div className="flex items-center">
                          <StockImage
                            imageUrl={portfolio.image_url}
                            symbol={portfolio.asset}
                            className="w-10 h-10 mr-3 shrink-0"
                          />
                          <div className="min-w-0 flex-1">
                            <div className="text-sm font-medium text-white truncate">
                              {portfolio.asset}
                            </div>
                            <div className="text-xs text-slate-400">
                              {portfolio.asset_name}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Amount & Average Price */}
                      <div className="col-span-6 md:col-span-2">
                        <div className="space-y-2">
                          <div className="text-sm text-white">
                            {editingId === portfolio.id ? (
                              <input
                                type="number"
                                value={editForm.amount || ""}
                                onChange={(e) =>
                                  setEditForm({
                                    ...editForm,
                                    amount: e.target.value,
                                  })
                                }
                                className="w-full px-2 py-1 bg-slate-800/50 border border-slate-700/50 rounded text-white text-sm"
                              />
                            ) : (
                              <span>{portfolio.amount} shares</span>
                            )}
                          </div>
                          <div className="text-sm text-white">
                            {editingId === portfolio.id ? (
                              <input
                                type="number"
                                value={editForm.average_price || ""}
                                onChange={(e) =>
                                  setEditForm({
                                    ...editForm,
                                    average_price: e.target.value,
                                  })
                                }
                                className="w-full px-2 py-1 bg-slate-800/50 border border-slate-700/50 rounded text-white text-sm"
                              />
                            ) : (
                              <span>
                                ${portfolio.average_price.toLocaleString()}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Current Value */}
                      <div className="col-span-6 md:col-span-2">
                        <div className="text-sm text-white">
                          {editingId === portfolio.id ? (
                            <input
                              type="number"
                              value={editForm.current_value || ""}
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm,
                                  current_value: e.target.value,
                                })
                              }
                              className="w-full px-2 py-1 bg-slate-800/50 border border-slate-700/50 rounded text-white text-sm"
                            />
                          ) : (
                            <span>
                              ${portfolio.current_value.toLocaleString()}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="col-span-12 md:col-span-2">
                        <div className="flex items-center justify-end gap-2">
                          {editingId === portfolio.id ? (
                            <>
                              <button
                                onClick={saveEdit}
                                className="flex items-center cursor-pointer gap-1 px-3 py-1 bg-green-600/90 hover:bg-green-600 text-white rounded-lg text-sm transition-colors border border-green-500/30"
                              >
                                <FiSave size={14} />
                                <span className="hidden sm:inline">Save</span>
                              </button>
                              <button
                                onClick={() => setEditingId(null)}
                                className="flex items-center gap-1 px-3 py-1 bg-slate-700/90 hover:bg-slate-700 text-white rounded-lg text-sm transition-colors border border-slate-600/30"
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => toggleRowExpansion(portfolio.id)}
                                className="flex items-center cursor-pointer gap-1 px-3 py-1 bg-indigo-600/90 hover:bg-indigo-600 text-white rounded-lg text-sm transition-colors border border-indigo-500/30"
                              >
                                <FiEye size={14} />
                                {expandedRows.has(portfolio.id) ? (
                                  <FiChevronUp size={14} />
                                ) : (
                                  <FiChevronDown size={14} />
                                )}
                              </button>
                              <button
                                onClick={() => startEditing(portfolio)}
                                className="flex items-center cursor-pointer gap-1 px-3 py-1 bg-blue-600/90 hover:bg-blue-600 text-white rounded-lg text-sm transition-colors border border-blue-500/30"
                              >
                                <FiEdit size={14} />
                                <span className="hidden sm:inline">Edit</span>
                              </button>
                              <button
                                onClick={() => deleteItem(portfolio.id)}
                                className="flex cursor-pointer items-center gap-1 px-3 py-1 bg-red-600/90 hover:bg-red-600 text-white rounded-lg text-sm transition-colors border border-red-500/30"
                              >
                                <FiTrash2 size={14} />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Portfolio Details */}
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
                              <label className="text-xs text-slate-400">
                                Asset
                              </label>
                              <div className="text-sm text-white">
                                {portfolio.asset}
                              </div>
                            </div>
                            <div>
                              <label className="text-xs text-slate-400">
                                Asset Name
                              </label>
                              <div className="text-sm text-white">
                                {portfolio.asset_name}
                              </div>
                            </div>
                            <div>
                              <label className="text-xs text-slate-400">
                                Wallet ID
                              </label>
                              <div className="text-sm text-white font-mono break-all">
                                {portfolio.wallet_id}
                              </div>
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
                              <label className="text-xs text-slate-400">
                                Shares
                              </label>
                              <div className="text-sm text-white">
                                {editingId === portfolio.id ? (
                                  <input
                                    type="number"
                                    value={editForm.amount || ""}
                                    onChange={(e) =>
                                      setEditForm({
                                        ...editForm,
                                        amount: e.target.value,
                                      })
                                    }
                                    className="w-full px-2 py-1 bg-slate-800/50 border border-slate-700/50 rounded text-white text-sm"
                                  />
                                ) : (
                                  <span>{portfolio.amount} shares</span>
                                )}
                              </div>
                            </div>
                            <div>
                              <label className="text-xs text-slate-400">
                                Average Price
                              </label>
                              <div className="text-sm text-white">
                                {editingId === portfolio.id ? (
                                  <input
                                    type="number"
                                    value={editForm.average_price || ""}
                                    onChange={(e) =>
                                      setEditForm({
                                        ...editForm,
                                        average_price: e.target.value,
                                      })
                                    }
                                    className="w-full px-2 py-1 bg-slate-800/50 border border-slate-700/50 rounded text-white text-sm"
                                  />
                                ) : (
                                  <span>
                                    ${portfolio.average_price.toLocaleString()}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div>
                              <label className="text-xs text-slate-400">
                                Current Value
                              </label>
                              <div className="text-sm text-white">
                                {editingId === portfolio.id ? (
                                  <input
                                    type="number"
                                    value={editForm.current_value || ""}
                                    onChange={(e) =>
                                      setEditForm({
                                        ...editForm,
                                        current_value: e.target.value,
                                      })
                                    }
                                    className="w-full px-2 py-1 bg-slate-800/50 border border-slate-700/50 rounded text-white text-sm"
                                  />
                                ) : (
                                  <span>
                                    ${portfolio.current_value.toLocaleString()}
                                  </span>
                                )}
                              </div>
                            </div>

                            <div>
                              <label className="text-xs text-slate-400">
                                Price Change
                              </label>
                              <div className="text-sm text-white">
                                {editingId === portfolio.id ? (
                                  <input
                                    type="text"
                                    value={editForm.price_change || ""}
                                    onChange={(e) =>
                                      setEditForm({
                                        ...editForm,
                                        price_change: e.target.value,
                                      })
                                    }
                                    className="w-full px-2 py-1 bg-slate-800/50 border border-slate-700/50 rounded text-white text-sm"
                                  />
                                ) : (
                                  <span
                                    className={`${
                                      portfolio?.price_change
                                        ?.toString()
                                        .includes("+")
                                        ? "text-green-600"
                                        : "text-red-700"
                                    }`}
                                  >
                                    {portfolio?.price_change?.toLocaleString?.() ??
                                      "N/A"}
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
                              <label className="text-xs text-slate-400">
                                Created
                              </label>
                              <div className="text-sm text-white">
                                {portfolio.created_at
                                  ? new Date(
                                      portfolio.created_at
                                    ).toLocaleDateString()
                                  : "N/A"}
                              </div>
                            </div>
                            <div>
                              <label className="text-xs text-slate-400">
                                Updated
                              </label>
                              <div className="text-sm text-white">
                                {portfolio.updated_at
                                  ? new Date(
                                      portfolio.updated_at
                                    ).toLocaleDateString()
                                  : "N/A"}
                              </div>
                            </div>
                            <div>
                              <label className="text-xs text-slate-400">
                                Portfolio ID
                              </label>
                              <div className="text-sm text-slate-300 font-mono break-all">
                                {portfolio.id}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminWalletsPage;
