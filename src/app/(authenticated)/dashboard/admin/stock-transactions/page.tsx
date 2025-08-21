// "use client";

// import { useState, useEffect } from "react";
// import { createClient } from "@/app/utils/supabase/clients";
// import { FiCheck, FiX, FiRefreshCw,FiClock } from "react-icons/fi";

// type Order = {
//   id: string;
//   user_id: string;
//   wallet_id: string;
//   asset: string;
//   asset_name: string;
//   type: "buy" | "sell";
//   price: number;
//   email:string;
//   amount: number;
//   total: number;
//   price_change:string;
//   status: "pending" | "approved" | "cancelled";
//   created_at: string;
//   image_url?: string;
// };

// const AdminOrdersPage = () => {
//   const supabase = createClient();
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [processing, setProcessing] = useState<string | null>(null);

//   // Fetch pending orders
//   const fetchPendingOrders = async () => {
//     setLoading(true);
//     try {
//       const { data, error } = await supabase
//         .from("stock_orders")
//         .select("*")
//         .eq("status", "pending")
//         .order("created_at", { ascending: true });

//       if (error) throw error;
//       setOrders(data || []);
//     } catch (error) {
//       console.error("Error fetching orders:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Approve an order
//   const approveOrder = async (orderId: string) => {
//     setProcessing(orderId);
//     try {
//       // 1. Update the order status to approved
//       const { error: updateError } = await supabase
//         .from("stock_orders")
//         .update({ status: "approved", approved_at: new Date().toISOString() })
//         .eq("id", orderId);

//       if (updateError) throw updateError;

//       // 2. Get the full order details
//       const { data: order, error: fetchError } = await supabase
//         .from("stock_orders")
//         .select("*")
//         .eq("id", orderId)
//         .single();

//       if (fetchError) throw fetchError;

//       // 3. Update the portfolio based on order type
//       if (order.type === "buy") {
//         // For buy orders, add to portfolio
//         const { error: upsertError } = await supabase
//           .from("stock_portfolio")
//           .upsert(
//             {
//               user_id: order.user_id,
//               wallet_id: order.wallet_id,
//               asset: order.asset,
//               email: order.email,
//               price_change: order.price_change,
//               asset_name: order.asset_name,
//               amount: order.amount,
//               average_price: order.price,
//               current_value: order.total,
//               image_url: order.image_url,
//             },
//             { onConflict: "user_id,asset" }
//           );

//         if (upsertError) throw upsertError;
//       } else if (order.type === "sell") {
//         // For sell orders, reduce the portfolio amount
//         const { data: portfolioItem, error: fetchPortfolioError } = await supabase
//           .from("stock_portfolio")
//           .select("*")
//           .eq("user_id", order.user_id)
//           .eq("asset", order.asset)
//           .single();

//         if (fetchPortfolioError) throw fetchPortfolioError;

//         if (portfolioItem) {
//           const newAmount = portfolioItem.amount - order.amount;
//           if (newAmount <= 0) {
//             // Remove if no shares left
//             await supabase
//               .from("stock_portfolio")
//               .delete()
//               .eq("id", portfolioItem.id);
//           } else {
//             // Update the amount
//             await supabase
//               .from("stock_portfolio")
//               .update({
//                 amount: newAmount,
//                 current_value: newAmount * portfolioItem.average_price,
//               })
//               .eq("id", portfolioItem.id);
//           }
//         }
//       }

//       // Refresh the orders list
//       await fetchPendingOrders();
//     } catch (error) {
//       console.error("Error approving order:", error);
//     } finally {
//       setProcessing(null);
//     }
//   };

//   // Reject an order
//   const rejectOrder = async (orderId: string) => {
//     setProcessing(orderId);
//     try {
//       // 1. Update the order status to cancelled
//       const { error: updateError } = await supabase
//         .from("stock_orders")
//         .update({ status: "cancelled" })
//         .eq("id", orderId);

//       if (updateError) throw updateError;

//       // 2. If it was a buy order, refund the wallet
//       const order = orders.find(o => o.id === orderId);
//       if (order && order.type === "buy") {
//         await supabase.rpc("increment_wallet_balance", {
//           wallet_id: order.wallet_id,
//           amount: order.total,
//         });
//       }

//       // Refresh the orders list
//       await fetchPendingOrders();
//     } catch (error) {
//       console.error("Error rejecting order:", error);
//     } finally {
//       setProcessing(null);
//     }
//   };

//   // Initial fetch
//   useEffect(() => {
//     fetchPendingOrders();
//   }, []);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white p-6">
//     <div className="max-w-7xl mx-auto">
//       {/* Header Section */}
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
//         <div className="flex items-center space-x-4">
//           <div className="p-3 bg-blue-600/20 rounded-xl border border-blue-500/30">
//             <FiClock className="size-6 text-blue-400" />
//           </div>
//           <div>
//             <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
//               Pending Orders
//             </h1>
//             <p className="text-slate-400">Approve or reject stock transactions</p>
//           </div>
//         </div>
//         <button
//           onClick={fetchPendingOrders}
//           className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors border border-blue-500/30"
//         >
//           <FiRefreshCw className={`${loading ? "animate-spin" : ""}`} />
//           Refresh
//         </button>
//       </div>

//       {/* Orders Table */}
//       <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl border border-slate-700/50 overflow-hidden shadow-lg">
//         {loading ? (
//           <div className="flex justify-center p-12">
//             <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-400"></div>
//           </div>
//         ) : orders.length === 0 ? (
//           <div className="text-center p-12 text-slate-400">
//             <FiClock className="mx-auto h-12 w-12 opacity-50 mb-4" />
//             <p className="text-lg">No pending orders</p>
//             <p className="text-sm mt-1">All caught up!</p>
//           </div>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead className="bg-slate-800/50 border-b border-slate-700/50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
//                     Stock
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
//                     User
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
//                     Type
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
//                     Details
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
//                     Date
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-slate-700/50">
//                 {orders.map((order) => (
//                   <tr key={order.id} className="hover:bg-slate-800/20 transition-colors">
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="flex items-center">
//                         {order.image_url ? (
//                           <img
//                             src={order.image_url}
//                             alt={order.asset}
//                             className="w-8 h-8 rounded-full mr-3 border border-slate-600/50"
//                           />
//                         ) : (
//                           <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-xs font-bold mr-3">
//                             {order.asset.slice(0, 2)}
//                           </div>
//                         )}
//                         <div>
//                           <div className="font-medium text-white">{order.asset}</div>
//                           <div className="text-xs text-slate-400">{order.asset_name}</div>
//                         </div>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
//                       {order.user_id.slice(0, 6)}...{order.user_id.slice(-4)}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span className={`px-3 py-1 rounded-full text-xs font-medium ${
//                         order.type === "buy"
//                           ? "bg-green-500/10 text-green-400 border border-green-500/20"
//                           : "bg-red-500/10 text-red-400 border border-red-500/20"
//                       }`}>
//                         {order.type.toUpperCase()}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="text-sm text-white">
//                         {order.amount} @ ${order.price.toLocaleString()}
//                       </div>
//                       <div className="text-sm font-bold text-white">
//                         ${order.total.toLocaleString()}
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
//                       {new Date(order.created_at).toLocaleTimeString()}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="flex gap-2">
//                         <button
//                           onClick={() => approveOrder(order.id)}
//                           disabled={processing === order.id}
//                           className={`flex items-center gap-1 px-3 py-1 rounded-lg text-sm transition-all ${
//                             processing === order.id
//                               ? "bg-blue-800/50 text-blue-300"
//                               : "bg-green-600/90 hover:bg-green-600 text-white"
//                           } border border-green-500/30`}
//                         >
//                           <FiCheck size={14} /> 
//                           {processing === order.id ? "Processing..." : "Approve"}
//                         </button>
//                         <button
//                           onClick={() => rejectOrder(order.id)}
//                           disabled={processing === order.id}
//                           className={`flex items-center gap-1 px-3 py-1 rounded-lg text-sm transition-all ${
//                             processing === order.id
//                               ? "bg-slate-800/50 text-slate-500"
//                               : "bg-red-600/90 hover:bg-red-600 text-white"
//                           } border border-red-500/30`}
//                         >
//                           <FiX size={14} /> Reject
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//     </div>
//   </div>
//   );
// };

// export default AdminOrdersPage;





"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/app/utils/supabase/clients";
import { FiCheck, FiX, FiRefreshCw, FiClock, FiDollarSign } from "react-icons/fi";

type Order = {
  id: string;
  user_id: string;
  wallet_id: string;
  asset: string;
  asset_name: string;
  type: "buy" | "sell";
  price: number;
  email:string;
  amount: number;
  total: number;
  price_change:string;
  status: "pending" | "approved" | "cancelled";
  created_at: string;
  image_url?: string;
};

// Added new type for portfolio balance table
type PortfolioBalance = {
  email: string;
  total_balance: number;
  created_at?: string;
  updated_at?: string;
};

const AdminOrdersPage = () => {
  const supabase = createClient();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);

  // Fetch pending orders
  const fetchPendingOrders = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("stock_orders")
        .select("*")
        .eq("status", "pending")
        .order("created_at", { ascending: true });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const updatePortfolioBalance = async (userEmail: string) => {
    try {
      const { data: portfolioItems, error: portfolioError } = await supabase
        .from("stock_portfolio")
        .select("current_value")
        .eq("email", userEmail);

      if (portfolioError) throw portfolioError;

      const totalBalance = portfolioItems.reduce((sum, item) => sum + item.current_value, 0);

      // Check if a record already exists for the email
      const { data: existingRecord, error: fetchRecordError } = await supabase
        .from("portfolio_balance")
        .select("email")
        .eq("email", userEmail)
        .single();

      if (fetchRecordError && fetchRecordError.code !== 'PGRST116') {
        throw fetchRecordError;
      }
      
      if (existingRecord) {
        // If the record exists, update it
        const { error: updateError } = await supabase
          .from("portfolio_balance")
          .update({
            total_balance: totalBalance,
            updated_at: new Date().toISOString(),
          })
          .eq("email", userEmail);

        if (updateError) throw updateError;
        console.log(`Updated portfolio balance for ${userEmail} to $${totalBalance}`);
      } else {
        // If the record doesn't exist, insert a new one
        const { error: insertError } = await supabase
          .from("portfolio_balance")
          .insert({
            email: userEmail,
            total_balance: totalBalance,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });
          
        if (insertError) throw insertError;
        console.log(`Created new portfolio balance entry for ${userEmail} with total $${totalBalance}`);
      }
      
    } catch (error) {
      console.error("Error updating portfolio balance:", error);
    }
  };


  // Approve an order
  const approveOrder = async (orderId: string) => {
    setProcessing(orderId);
    try {
      // 1. Update the order status to approved
      const { error: updateError } = await supabase
        .from("stock_orders")
        .update({ status: "approved", approved_at: new Date().toISOString() })
        .eq("id", orderId);

      if (updateError) throw updateError;

      // 2. Get the full order details
      const { data: order, error: fetchError } = await supabase
        .from("stock_orders")
        .select("*")
        .eq("id", orderId)
        .single();

      if (fetchError) throw fetchError;

      // 3. Update the portfolio based on order type
      if (order.type === "buy") {
        // For buy orders, add to portfolio
        const { error: upsertError } = await supabase
          .from("stock_portfolio")
          .upsert(
            {
              user_id: order.user_id,
              wallet_id: order.wallet_id,
              asset: order.asset,
              email: order.email,
              price_change: order.price_change,
              asset_name: order.asset_name,
              amount: order.amount,
              average_price: order.price,
              current_value: order.total,
              image_url: order.image_url,
            },
            { onConflict: "user_id,asset" }
          );

        if (upsertError) throw upsertError;
      } else if (order.type === "sell") {
        // For sell orders, reduce the portfolio amount
        const { data: portfolioItem, error: fetchPortfolioError } = await supabase
          .from("stock_portfolio")
          .select("*")
          .eq("user_id", order.user_id)
          .eq("asset", order.asset)
          .single();

        if (fetchPortfolioError) throw fetchPortfolioError;

        if (portfolioItem) {
          const newAmount = portfolioItem.amount - order.amount;
          if (newAmount <= 0) {
            // Remove if no shares left
            await supabase
              .from("stock_portfolio")
              .delete()
              .eq("id", portfolioItem.id);
          } else {
            // Update the amount
            await supabase
              .from("stock_portfolio")
              .update({
                amount: newAmount,
                current_value: newAmount * portfolioItem.average_price,
              })
              .eq("id", portfolioItem.id);
          }
        }
      }

      // 4. Update the portfolio balance table (NEW)
      await updatePortfolioBalance(order.email);

      // Refresh the orders list
      await fetchPendingOrders();
    } catch (error) {
      console.error("Error approving order:", error);
    } finally {
      setProcessing(null);
    }
  };

  // Reject an order
  const rejectOrder = async (orderId: string) => {
    setProcessing(orderId);
    try {
      // 1. Update the order status to cancelled
      const { error: updateError } = await supabase
        .from("stock_orders")
        .update({ status: "cancelled" })
        .eq("id", orderId);

      if (updateError) throw updateError;

      // 2. If it was a buy order, refund the wallet
      const order = orders.find(o => o.id === orderId);
      if (order && order.type === "buy") {
        await supabase.rpc("increment_wallet_balance", {
          wallet_id: order.wallet_id,
          amount: order.total,
        });
      }

      // 3. Recalculate and update the portfolio balance (NEW)
      if (order?.email) {
        await updatePortfolioBalance(order.email);
      }

      // Refresh the orders list
      await fetchPendingOrders();
    } catch (error) {
      console.error("Error rejecting order:", error);
    } finally {
      setProcessing(null);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchPendingOrders();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white p-6">
    <div className="max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-blue-600/20 rounded-xl border border-blue-500/30">
            <FiClock className="size-6 text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
              Pending Orders
            </h1>
            <p className="text-slate-400">Approve or reject stock transactions</p>
          </div>
        </div>
        <button
          onClick={fetchPendingOrders}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors border border-blue-500/30"
        >
          <FiRefreshCw className={`${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Orders Table */}
      <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl border border-slate-700/50 overflow-hidden shadow-lg">
        {loading ? (
          <div className="flex justify-center p-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-400"></div>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center p-12 text-slate-400">
            <FiClock className="mx-auto h-12 w-12 opacity-50 mb-4" />
            <p className="text-lg">No pending orders</p>
            <p className="text-sm mt-1">All caught up!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-800/50 border-b border-slate-700/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-800/20 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {order.image_url ? (
                          <img
                            src={order.image_url}
                            alt={order.asset}
                            className="w-8 h-8 rounded-full mr-3 border border-slate-600/50"
                          />
                        ) : (
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-xs font-bold mr-3">
                            {order.asset.slice(0, 2)}
                          </div>
                        )}
                        <div>
                          <div className="font-medium text-white">{order.asset}</div>
                          <div className="text-xs text-slate-400">{order.asset_name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                      {order.user_id.slice(0, 6)}...{order.user_id.slice(-4)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        order.type === "buy"
                          ? "bg-green-500/10 text-green-400 border border-green-500/20"
                          : "bg-red-500/10 text-red-400 border border-red-500/20"
                      }`}>
                        {order.type.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-white">
                        {order.amount} @ ${order.price.toLocaleString()}
                      </div>
                      <div className="text-sm font-bold text-white">
                        ${order.total.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                      {new Date(order.created_at).toLocaleTimeString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-2">
                        <button
                          onClick={() => approveOrder(order.id)}
                          disabled={processing === order.id}
                          className={`flex items-center gap-1 px-3 py-1 rounded-lg text-sm transition-all ${
                            processing === order.id
                              ? "bg-blue-800/50 text-blue-300"
                              : "bg-green-600/90 hover:bg-green-600 text-white"
                          } border border-green-500/30`}
                        >
                          <FiCheck size={14} /> 
                          {processing === order.id ? "Processing..." : "Approve"}
                        </button>
                        <button
                          onClick={() => rejectOrder(order.id)}
                          disabled={processing === order.id}
                          className={`flex items-center gap-1 px-3 py-1 rounded-lg text-sm transition-all ${
                            processing === order.id
                              ? "bg-slate-800/50 text-slate-500"
                              : "bg-red-600/90 hover:bg-red-600 text-white"
                          } border border-red-500/30`}
                        >
                          <FiX size={14} /> Reject
                        </button>
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

export default AdminOrdersPage;