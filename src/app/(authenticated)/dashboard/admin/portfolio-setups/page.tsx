
"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/app/utils/supabase/clients";
import { FiEdit, FiSave, FiRefreshCw, FiTrash2, FiSearch, FiUser, FiDollarSign, FiTrendingUp, FiCreditCard, FiActivity, FiChevronDown, FiChevronUp, FiEye, FiCalendar, FiTrendingDown } from "react-icons/fi";
import { 
  TIER_CONFIG ,
  UserWallet,
  WalletTier,
  TokenType,
} from "@/app/data";

const AdminWalletsPage = () => {
  const supabase = createClient();
  const [wallets, setWallets] = useState<UserWallet[]>([]);
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
  }>({});
  const [filterUserId, setFilterUserId] = useState<string | "all">("all");

  // Toggle row expansion
  const toggleRowExpansion = (walletId: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(walletId)) {
      newExpanded.delete(walletId);
    } else {
      newExpanded.add(walletId);
    }
    setExpandedRows(newExpanded);
  };

  // Fetch all wallet data
  const fetchWallets = async () => {
    setLoading(true);
    try {
      const { data: walletsData, error: walletsError } = await supabase
        .from("wallets")
        .select("*");

      if (walletsError) throw walletsError;

      setWallets(walletsData || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Start editing an item
  const startEditing = (wallet: UserWallet) => {
    setEditingId(wallet.id);
    setEditForm({
      balance: wallet.balance.toString(),
      current_value: wallet.current_value.toString(),
      profit_loss: wallet.profit_loss.toString(),
      performance_percentage: wallet.performance_percentage.toString(),
      status: wallet.status
    });
  };

  // Save edited item
  const saveEdit = async () => {
    if (!editingId) return;

    try {
      setLoading(true);
      const { error } = await supabase
        .from("wallets")
        .update({
          balance: Number(editForm.balance) || 0,
          current_value: Number(editForm.current_value) || 0,
          profit_loss: Number(editForm.profit_loss) || 0,
          performance_percentage: Number(editForm.performance_percentage) || 0,
          status: editForm.status
        })
        .eq("id", editingId);

      if (error) throw error;

      // Update local state with converted numbers
      setWallets(prev => prev.map(wallet => 
        wallet.id === editingId ? { 
          ...wallet, 
          balance: Number(editForm.balance) || 0,
          current_value: Number(editForm.current_value) || 0,
          profit_loss: Number(editForm.profit_loss) || 0,
          performance_percentage: Number(editForm.performance_percentage) || 0,
          status: editForm.status || false
        } : wallet
      ));
      setEditingId(null);
    } catch (error) {
      console.error("Error updating wallet:", error);
    } finally {
      setLoading(false);
    }
  };

  // Delete wallet
  const deleteWallet = async (id: string) => {
    if (!confirm("Are you sure you want to delete this wallet?")) return;

    try {
      setLoading(true);
      const { error } = await supabase
        .from("wallets")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setWallets(prev => prev.filter(wallet => wallet.id !== id));
    } catch (error) {
      console.error("Error deleting wallet:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filtered wallets
  const filteredWallets = wallets.filter(wallet => {
    const matchesSearch = searchTerm === "" || 
      wallet.wallet_number.toLowerCase().includes(searchTerm.toLowerCase()) || 
      wallet.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesUser = filterUserId === "all" || wallet.user_id === filterUserId;
    
    return matchesSearch && matchesUser;
  });

  // Get unique user IDs for filter dropdown
  const uniqueUserIds = Array.from(new Set(wallets.map(wallet => wallet.user_id)));

  // Format wallet number for display
  const formatWalletNumber = (walletNumber: string) => {
    if (walletNumber.length <= 12) return walletNumber;
    return `${walletNumber.slice(0, 6)}...${walletNumber.slice(-6)}`;
  };

  useEffect(() => {
    fetchWallets();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white p-4 md:p-6">
      <div className="max-w-full mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-600/20 rounded-xl border border-blue-500/30">
              <FiCreditCard className="size-6 text-blue-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                Manage Wallets
              </h1>
              <p className="text-slate-400">Admin interface for user wallets</p>
            </div>
          </div>
          <button
            onClick={fetchWallets}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors border border-blue-500/30"
          >
            <FiRefreshCw className={`${loading ? "animate-spin" : ""}`} />
            Refresh
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
                placeholder="Search wallets..."
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
                onChange={(e) => setFilterUserId(e.target.value as string | "all")}
                className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
              >
                <option value="all">All Users</option>
                {uniqueUserIds.map(userId => {
                  const wallet = wallets.find(w => w.user_id === userId);
                  return (
                    <option key={userId} value={userId}>
                      {wallet?.email || `${userId.slice(0, 6)}...${userId.slice(-4)}`}
                    </option>
                  );
                })}
              </select>
            </div>
            
            <div className="flex items-center text-slate-300">
              <FiDollarSign className="mr-2" />
              <span>Total Wallets: {filteredWallets.length}</span>
            </div>
          </div>
        </div>

        {/* Wallets Cards/Table */}
        <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl border border-slate-700/50 overflow-hidden shadow-lg">
          {loading ? (
            <div className="flex justify-center p-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-400"></div>
            </div>
          ) : filteredWallets.length === 0 ? (
            <div className="text-center p-12 text-slate-400">
              <FiCreditCard className="mx-auto h-12 w-12 opacity-50 mb-4" />
              <p className="text-lg">No wallets found</p>
              <p className="text-sm mt-1">
                {searchTerm || filterUserId !== "all" ? "Try adjusting your filters" : "Users haven't created any wallets yet"}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-700/50">
              {filteredWallets.map((wallet) => (
                <div key={wallet.id} className="bg-slate-800/20 hover:bg-slate-800/40 transition-colors">
                  {/* Main Row */}
                  <div className="p-4 md:p-6">
                    <div className="grid grid-cols-12 gap-4 items-center">
                      {/* User Info - 3 columns */}
                      <div className="col-span-12 md:col-span-3">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-600 rounded-full flex items-center justify-center text-sm font-bold mr-3 shrink-0">
                            {wallet.email?.charAt(0).toUpperCase() || "U"}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-sm font-medium text-white truncate">
                              {wallet.email || `${wallet.user_id.slice(0, 8)}...`}
                            </div>
                            <div className="text-xs text-slate-400">
                              ID: {wallet.user_id.slice(0, 8)}...
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Wallet Info - 3 columns */}
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

                      {/* Tier & Balance - 2 columns */}
                      <div className="col-span-6 md:col-span-2">
                        <div className="space-y-2">
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                            TIER_CONFIG[wallet.tier].bgColor
                          }`}>
                            {TIER_CONFIG[wallet.tier].name}
                          </span>
                          <div className="text-sm text-white">
                            {editingId === wallet.id ? (
                              <input
                                type="number"
                                value={editForm.balance || ""}
                                onChange={(e) => setEditForm({...editForm, balance: e.target.value})}
                                className="w-full px-2 py-1 bg-slate-800/50 border border-slate-700/50 rounded text-white text-sm"
                              />
                            ) : (
                              <span>${wallet.balance.toLocaleString()}</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Status - 2 columns */}
                      <div className="col-span-6 md:col-span-2">
                        {editingId === wallet.id ? (
                          <select
                            value={editForm.status ? "true" : "false"}
                            onChange={(e) => setEditForm({...editForm, status: e.target.value === "true"})}
                            className="w-full bg-slate-800/50 border border-slate-700/50 rounded text-white px-2 py-1 text-sm"
                          >
                            <option value="true">Active</option>
                            <option value="false">Inactive</option>
                          </select>
                        ) : (
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                            wallet.status ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"
                          }`}>
                            {wallet.status ? "Active" : "Pending"}
                          </span>
                        )}
                      </div>

                      {/* Actions - 2 columns */}
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
                                {expandedRows.has(wallet.id) ? <FiChevronUp size={14} /> : <FiChevronDown size={14} />}
                              </button>
                              <button
                                onClick={() => startEditing(wallet)}
                                className="flex items-center cursor-pointer gap-1 px-3 py-1 bg-blue-600/90 hover:bg-blue-600 text-white rounded-lg text-sm transition-colors border border-blue-500/30"
                              >
                                <FiEdit size={14} />
                                <span className="hidden sm:inline">Edit</span>
                              </button>
                              <button
                                onClick={() => deleteWallet(wallet.id)}
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

                  {/* Expanded Details */}
                  {expandedRows.has(wallet.id) && (
                    <div className="border-t border-slate-700/50 bg-slate-800/10 p-4 md:p-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Full Wallet Details */}
                        <div className="space-y-4">
                          <h4 className="text-sm font-semibold text-blue-400 flex items-center gap-2">
                            <FiCreditCard size={16} />
                            Wallet Details
                          </h4>
                          <div className="space-y-3">
                            <div>
                              <label className="text-xs text-slate-400">Full Wallet Number</label>
                              <div className="text-sm text-white bg-slate-800/50 rounded-lg p-2 font-mono break-all">
                                {wallet.wallet_number}
                              </div>
                            </div>
                            <div>
                              <label className="text-xs text-slate-400">Network</label>
                              <div className="text-sm text-white">{wallet.network}</div>
                            </div>
                            <div>
                              <label className="text-xs text-slate-400">Token Type</label>
                              <div className="text-sm text-white">{wallet.token_type}</div>
                            </div>
                          </div>
                        </div>

                        {/* Financial Details */}
                        <div className="space-y-4">
                          <h4 className="text-sm font-semibold text-green-400 flex items-center gap-2">
                            <FiDollarSign size={16} />
                            Financial Information
                          </h4>
                          <div className="space-y-3">
                            <div>
                              <label className="text-xs text-slate-400">Current Value</label>
                              <div className="text-sm text-white">
                                {editingId === wallet.id ? (
                                  <input
                                    type="number"
                                    value={editForm.current_value || ""}
                                    onChange={(e) => setEditForm({...editForm, current_value: e.target.value})}
                                    className="w-full px-2 py-1 bg-slate-800/50 border border-slate-700/50 rounded text-white text-sm"
                                  />
                                ) : (
                                  <span>${wallet.current_value.toLocaleString()}</span>
                                )}
                              </div>
                            </div>
                            <div>
                              <label className="text-xs text-slate-400">Profit/Loss</label>
                              <div className="text-sm">
                                {editingId === wallet.id ? (
                                  <input
                                    type="number"
                                    value={editForm.profit_loss || ""}
                                    onChange={(e) => setEditForm({...editForm, profit_loss: e.target.value})}
                                    className="w-full px-2 py-1 bg-slate-800/50 border border-slate-700/50 rounded text-white text-sm"
                                  />
                                ) : (
                                  <span className={wallet.profit_loss >= 0 ? "text-green-400" : "text-red-400"}>
                                    {wallet.profit_loss >= 0 ? "+" : ""}${wallet.profit_loss.toLocaleString()}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div>
                              <label className="text-xs text-slate-400">Performance</label>
                              <div className="text-sm">
                                {editingId === wallet.id ? (
                                  <input
                                    type="number"
                                    value={editForm.performance_percentage || ""}
                                    onChange={(e) => setEditForm({...editForm, performance_percentage: e.target.value})}
                                    className="w-full px-2 py-1 bg-slate-800/50 border border-slate-700/50 rounded text-white text-sm"
                                  />
                                ) : (
                                  <span className={wallet.performance_percentage >= 0 ? "text-green-400" : "text-red-400"}>
                                    {wallet.performance_percentage >= 0 ? "+" : ""}{wallet.performance_percentage.toFixed(2)}%
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Timestamps */}
                        <div className="space-y-4">
                          <h4 className="text-sm font-semibold text-purple-400 flex items-center gap-2">
                            <FiCalendar size={16} />
                            Timestamps
                          </h4>
                          <div className="space-y-3">
                            <div>
                              <label className="text-xs text-slate-400">Created</label>
                              <div className="text-sm text-white">
                                {wallet.created_at ? new Date(wallet.created_at).toLocaleDateString() : "N/A"}
                              </div>
                            </div>
                           
                            <div>
                              <label className="text-xs text-slate-400">Wallet ID</label>
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
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminWalletsPage;