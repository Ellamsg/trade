

"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/app/utils/supabase/clients";
import { FiEdit, FiSave, FiRefreshCw, FiTrash2, FiSearch, FiUser, FiDollarSign, FiTrendingUp } from "react-icons/fi";

type PortfolioItem = {
  id: string;
  user_id: string;
  wallet_id: string;
  asset: string;
  asset_name: string;
  email: string;
  amount: number;
  average_price: number;
  current_value: number;
  image_url?: string;
};

const AdminPortfolioPage = () => {
  const supabase = createClient();
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<PortfolioItem>>({});
  const [filterUserId, setFilterUserId] = useState<string | "all">("all");

  // Fetch all portfolio data
  const fetchPortfolio = async () => {
    setLoading(true);
    try {
      const { data: portfolioData, error: portfolioError } = await supabase
        .from("stock_portfolio")
        .select("*");

      if (portfolioError) throw portfolioError;

      setPortfolio(portfolioData || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Start editing an item
  const startEditing = (item: PortfolioItem) => {
    setEditingId(item.id);
    setEditForm({
      amount: item.amount,
      average_price: item.average_price,
      current_value: item.current_value
    });
  };

  // Save edited item
  const saveEdit = async () => {
    if (!editingId) return;

    try {
      setLoading(true);
      const { error } = await supabase
        .from("stock_portfolio")
        .update({
          amount: editForm.amount,
          average_price: editForm.average_price,
          current_value: editForm.current_value
        })
        .eq("id", editingId);

      if (error) throw error;

      // Update local state
      setPortfolio(prev => prev.map(item => 
        item.id === editingId ? { ...item, ...editForm } : item
      ));
      setEditingId(null);
    } catch (error) {
      console.error("Error updating portfolio:", error);
    } finally {
      setLoading(false);
    }
  };

  // Delete portfolio item
  const deleteItem = async (id: string) => {
    if (!confirm("Are you sure you want to delete this portfolio item?")) return;

    try {
      setLoading(true);
      const { error } = await supabase
        .from("stock_portfolio")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setPortfolio(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      console.error("Error deleting item:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filtered portfolio items
  const filteredPortfolio = portfolio.filter(item => {
    const matchesSearch = searchTerm === "" || 
      item.asset.toLowerCase().includes(searchTerm.toLowerCase()) || 
      item.asset_name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesUser = filterUserId === "all" || item.user_id === filterUserId;
    
    return matchesSearch && matchesUser;
  });

  // Get unique user IDs for filter dropdown
  const uniqueUserIds = Array.from(new Set(portfolio.map(item => item.user_id)));

  useEffect(() => {
    fetchPortfolio();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-600/20 rounded-xl border border-blue-500/30">
              <FiTrendingUp className="size-6 text-blue-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                Manage Portfolios
              </h1>
              <p className="text-slate-400">Admin interface for user stock portfolios</p>
            </div>
          </div>
          <button
            onClick={fetchPortfolio}
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
                placeholder="Search stocks..."
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
                  const item = portfolio.find(i => i.user_id === userId);
                  return (
                    <option key={userId} value={userId}>
                      {item?.email || userId.slice(0, 6)}...{userId.slice(-4)}
                    </option>
                  );
                })}
              </select>
            </div>
            
            <div className="flex items-center text-slate-300">
              <FiDollarSign className="mr-2" />
              <span>Total Items: {filteredPortfolio.length}</span>
            </div>
          </div>
        </div>

        {/* Portfolio Table */}
        <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl border border-slate-700/50 overflow-hidden shadow-lg">
          {loading ? (
            <div className="flex justify-center p-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-400"></div>
            </div>
          ) : filteredPortfolio.length === 0 ? (
            <div className="text-center p-12 text-slate-400">
              <FiTrendingUp className="mx-auto h-12 w-12 opacity-50 mb-4" />
              <p className="text-lg">No portfolio items found</p>
              <p className="text-sm mt-1">
                {searchTerm || filterUserId !== "all" ? "Try adjusting your filters" : "Users haven't made any investments yet"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-800/50 border-b border-slate-700/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                      Holdings
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                      Avg Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                      Current Value
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {filteredPortfolio.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-800/20 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-600 rounded-full flex items-center justify-center text-xs font-bold mr-3">
                            {item.email?.charAt(0).toUpperCase() || "U"}
                          </div>
                          <div>
                            <div className="text-xs text-slate-400">
                              {item.email || `${item.user_id.slice(0, 6)}...${item.user_id.slice(-4)}`}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {item.image_url ? (
                            <img
                              src={item.image_url}
                              alt={item.asset}
                              className="w-8 h-8 rounded-full mr-3 border border-slate-600/50"
                            />
                          ) : (
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-xs font-bold mr-3">
                              {item.asset.slice(0, 2)}
                            </div>
                          )}
                          <div>
                            <div className="font-medium text-white">{item.asset}</div>
                            <div className="text-xs text-slate-400">{item.asset_name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {editingId === item.id ? (
                          <input
                            type="number"
                            value={editForm.amount || ""}
                            onChange={(e) => setEditForm({...editForm, amount: Number(e.target.value)})}
                            className="w-20 px-2 py-1 bg-slate-800/50 border border-slate-700/50 rounded text-white"
                          />
                        ) : (
                          <span className="text-white">{item.amount} shares</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {editingId === item.id ? (
                          <input
                            type="number"
                            value={editForm.average_price || ""}
                            onChange={(e) => setEditForm({...editForm, average_price: Number(e.target.value)})}
                            className="w-20 px-2 py-1 bg-slate-800/50 border border-slate-700/50 rounded text-white"
                          />
                        ) : (
                          <span className="text-white">${item.average_price.toLocaleString()}</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {editingId === item.id ? (
                          <input
                            type="number"
                            value={editForm.current_value || ""}
                            onChange={(e) => setEditForm({...editForm, current_value: Number(e.target.value)})}
                            className="w-24 px-2 py-1 bg-slate-800/50 border border-slate-700/50 rounded text-white"
                          />
                        ) : (
                          <span className="text-white">${item.current_value.toLocaleString()}</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex gap-2">
                          {editingId === item.id ? (
                            <>
                              <button
                                onClick={saveEdit}
                                className="flex items-center gap-1 px-3 py-1 bg-green-600/90 hover:bg-green-600 text-white rounded-lg text-sm transition-colors border border-green-500/30"
                              >
                                <FiSave size={14} /> Save
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
                                onClick={() => startEditing(item)}
                                className="flex items-center gap-1 px-3 py-1 bg-blue-600/90 hover:bg-blue-600 text-white rounded-lg text-sm transition-colors border border-blue-500/30"
                              >
                                <FiEdit size={14} /> Edit
                              </button>
                              <button
                                onClick={() => deleteItem(item.id)}
                                className="flex items-center gap-1 px-3 py-1 bg-red-600/90 hover:bg-red-600 text-white rounded-lg text-sm transition-colors border border-red-500/30"
                              >
                                <FiTrash2 size={14} />
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
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPortfolioPage;