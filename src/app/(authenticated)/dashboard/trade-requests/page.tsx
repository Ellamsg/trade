"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/app/utils/supabase/clients";
import { FiClock, FiCheck, FiX } from "react-icons/fi";

type TradeRequest = {
  id: string;
  user_id: string;
  wallet_id: string;
  email: string;
  status: "pending" | "approved" | "rejected" | "cancelled";
  created_at: string;
  updated_at?: string;
  admin_notes?: string;
  profit_loss?: number;
};

type UserWallet = {
  id: string;
  balance: number;
  wallet_number: string;
  tier: string;
  status: boolean;
};

const TradeRequestsPage = () => {
  const [wallet, setWallet] = useState<UserWallet | null>(null);
  const [loading, setLoading] = useState(true);
  const [tradeRequests, setTradeRequests] = useState<TradeRequest[]>([]);
  const [submitting, setSubmitting] = useState(false);
  
  const supabase = createClient();

  useEffect(() => {
    fetchWalletData();
    fetchTradeRequests();
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

      if (!walletError && walletData) {
        setWallet(walletData);
      }
    } catch (error) {
      console.error('Error fetching wallet data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTradeRequests = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      const { data, error } = await supabase
        .from('trade_requests')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTradeRequests(data || []);
    } catch (error) {
      console.error('Error fetching trade requests:', error);
    }
  };

  const handleRequestTrade = async () => {
    try {
      setSubmitting(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !wallet) throw new Error("User not authenticated or wallet not found");

      // Create new trade request
      const { data: newRequest, error: requestError } = await supabase
        .from("trade_requests")
        .insert({
          user_id: user.id,
          wallet_id: wallet.id,
          email: user.email!,
          status: "pending",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (requestError) throw requestError;

      // Refresh requests
      setTradeRequests([newRequest, ...tradeRequests]);
    } catch (error) {
      console.error('Error submitting trade request:', error);
      alert('Failed to submit trade request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelRequest = async (requestId: string) => {
    try {
      const { error } = await supabase
        .from('trade_requests')
        .update({ 
          status: 'cancelled',
          updated_at: new Date().toISOString()
        })
        .eq('id', requestId);

      if (error) throw error;
      fetchTradeRequests();
    } catch (error) {
      console.error('Error cancelling trade request:', error);
      alert('Failed to cancel trade request. Please try again.');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved": return "text-green-400";
      case "rejected": return "text-red-400";
      case "cancelled": return "text-slate-400";
      default: return "text-yellow-400";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved": return <FiCheck className="mr-1" />;
      case "rejected": return <FiX className="mr-1" />;
      case "cancelled": return <FiX className="mr-1" />;
      default: return <FiClock className="mr-1" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
              Trade Requests
            </h1>
            <p className="text-slate-400">Request trades to be executed by our admin team</p>
          </div>
          <button
            onClick={handleRequestTrade}
            disabled={submitting}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Submitting...
              </>
            ) : (
              <>Request Trade</>
            )}
          </button>
        </div>

        {/* Trade Requests List */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 overflow-hidden">
          {tradeRequests.length === 0 ? (
            <div className="text-center p-12 text-slate-400">
              <p className="text-lg">No trade requests yet</p>
              <p className="text-sm mt-1">Click the "Request Trade" button to get started</p>
              <button
                onClick={handleRequestTrade}
                disabled={submitting}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg inline-flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Request Trade
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-700/50">
                  <tr>
                    <th className="text-left p-4 text-slate-300 font-medium">Request ID</th>
                    <th className="text-left p-4 text-slate-300 font-medium">Status</th>
                    <th className="text-left p-4 text-slate-300 font-medium">Date</th>
     
                    <th className="text-left p-4 text-slate-300 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {tradeRequests.map((request) => (
                    <tr key={request.id} className="hover:bg-slate-700/30">
                      <td className="p-4">
                        <div className="font-medium">{request.id}</div>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center ${getStatusColor(request.status)}`}>
                          {getStatusIcon(request.status)}
                          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                        </span>
                      </td>
                      <td className="p-4 text-slate-400">{formatDate(request.created_at)}</td>
                   
                      <td className="p-4">
                        {request.status === 'pending' && (
                          <button
                            onClick={() => handleCancelRequest(request.id)}
                            className="text-red-400 hover:text-red-300 text-sm"
                          >
                            Cancel
                          </button>
                        )}
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

export default TradeRequestsPage;