// // // // // AdminUpgradeRequests.tsx
// // // // "use client"
// // // // import React, { useState, useEffect } from 'react';
// // // // import { createClient } from '@/app/utils/supabase/clients';
// // // // import { WalletUpgradeRequest, WalletTier, TIER_CONFIG } from '@/app/data';
// // // // import { FiCheck, FiClock, FiX, FiUser, FiCreditCard } from 'react-icons/fi';

// // // // const AdminUpgradeRequests = () => {
// // // //   const [requests, setRequests] = useState<WalletUpgradeRequest[]>([]);
// // // //   const [loading, setLoading] = useState(true);
// // // //   const supabase = createClient();

// // // //   useEffect(() => {
// // // //     fetchRequests();
// // // //     const interval = setInterval(fetchRequests, 10000);
// // // //     return () => clearInterval(interval);
// // // //   }, []);

// // // //   const fetchRequests = async () => {
// // // //     try {
// // // //       const { data, error } = await supabase
// // // //         .from('wallet_upgrades')
// // // //         .select('*')
// // // //         .order('created_at', { ascending: false });

// // // //       if (error) throw error;
// // // //       setRequests(data || []);
// // // //     } catch (error) {
// // // //       console.error('Error fetching upgrade requests:', error);
// // // //     } finally {
// // // //       setLoading(false);
// // // //     }
// // // //   };

// // // //   const handleApprove = async (requestId: string) => {
// // // //     try {
// // // //       // Update the upgrade request status
// // // //       const { error: updateError } = await supabase
// // // //         .from('wallet_upgrades')
// // // //         .update({ status: true, updated_at: new Date().toISOString() })
// // // //         .eq('id', requestId);

// // // //       if (updateError) throw updateError;

// // // //       // Find the request to get the wallet ID and new tier
// // // //       const request = requests.find(r => r.id === requestId);
// // // //       if (!request) return;

// // // //       // Update the wallet tier
// // // //       const { error: walletError } = await supabase
// // // //         .from('wallets')
// // // //         .update({ tier: request.target_tier })
// // // //         .eq('id', request.wallet_id);

// // // //       if (walletError) throw walletError;

// // // //       // Refresh the list
// // // //       fetchRequests();
// // // //     } catch (error) {
// // // //       console.error('Error approving upgrade:', error);
// // // //     }
// // // //   };

// // // //   const handleReject = async (requestId: string) => {
// // // //     try {
// // // //       const { error } = await supabase
// // // //         .from('wallet_upgrades')
// // // //         .delete()
// // // //         .eq('id', requestId);

// // // //       if (error) throw error;
// // // //       fetchRequests();
// // // //     } catch (error) {
// // // //       console.error('Error rejecting upgrade:', error);
// // // //     }
// // // //   };

// // // //   return (
// // // //     <div className="p-6">
// // // //       <h1 className="text-2xl font-bold mb-6">Wallet Upgrade Requests</h1>
      
// // // //       {loading ? (
// // // //         <div className="flex justify-center py-8">
// // // //           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
// // // //         </div>
// // // //       ) : requests.length === 0 ? (
// // // //         <div className="bg-slate-100 rounded-lg p-8 text-center">
// // // //           <p className="text-slate-500">No pending upgrade requests</p>
// // // //         </div>
// // // //       ) : (
// // // //         <div className="bg-white rounded-lg shadow overflow-hidden">
// // // //           <table className="w-full">
// // // //             <thead className="bg-slate-100">
// // // //               <tr>
// // // //                 <th className="p-3 text-left">User</th>
// // // //                 <th className="p-3 text-left">Wallet</th>
// // // //                 <th className="p-3 text-left">Current Tier</th>
// // // //                 <th className="p-3 text-left">Target Tier</th>
// // // //                 <th className="p-3 text-left">Requested</th>
// // // //                 <th className="p-3 text-left">Actions</th>
// // // //               </tr>
// // // //             </thead>
// // // //             <tbody>
// // // //               {requests.map(request => (
// // // //                 <tr key={request.id} className="border-t border-slate-200 hover:bg-slate-50">
// // // //                   <td className="p-3 flex items-center gap-2">
// // // //                     <FiUser className="text-slate-500" />
// // // //                     {request.user_id}
// // // //                   </td>
// // // //                   <td className="p-3 flex items-center gap-2">
// // // //                     <FiCreditCard className="text-slate-500" />
// // // //                     {request.wallet_id}
// // // //                   </td>
// // // //                   <td className="p-3">
// // // //                     <span className={`px-2 py-1 rounded-full text-xs ${TIER_CONFIG[request.current_tier].bgColor}`}>
// // // //                       {TIER_CONFIG[request.current_tier].name}
// // // //                     </span>
// // // //                   </td>
// // // //                   <td className="p-3">
// // // //                     <span className={`px-2 py-1 rounded-full text-xs ${TIER_CONFIG[request.target_tier].bgColor}`}>
// // // //                       {TIER_CONFIG[request.target_tier].name}
// // // //                     </span>
// // // //                   </td>
// // // //                   <td className="p-3 text-sm text-slate-500">
// // // //                     {new Date(request.created_at).toLocaleString()}
// // // //                   </td>
// // // //                   <td className="p-3">
// // // //                     {!request.status ? (
// // // //                       <div className="flex gap-2">
// // // //                         <button
// // // //                           onClick={() => handleApprove(request.id)}
// // // //                           className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-lg"
// // // //                         >
// // // //                           <FiCheck />
// // // //                         </button>
// // // //                         <button
// // // //                           onClick={() => handleReject(request.id)}
// // // //                           className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg"
// // // //                         >
// // // //                           <FiX />
// // // //                         </button>
// // // //                       </div>
// // // //                     ) : (
// // // //                       <span className="text-green-500 flex items-center gap-1">
// // // //                         <FiCheck /> Approved
// // // //                       </span>
// // // //                     )}
// // // //                   </td>
// // // //                 </tr>
// // // //               ))}
// // // //             </tbody>
// // // //           </table>
// // // //         </div>
// // // //       )}
// // // //     </div>
// // // //   );
// // // // };

// // // // export default AdminUpgradeRequests;



// // // // AdminUpgradeRequests.tsx
// // // "use client"
// // // import React, { useState, useEffect } from 'react';
// // // import { createClient } from '@/app/utils/supabase/clients';
// // // import { WalletUpgradeRequest, WalletTier, TIER_CONFIG } from '@/app/data';
// // // import { FiCheck, FiClock, FiX, FiUser, FiCreditCard, FiDollarSign } from 'react-icons/fi';

// // // const AdminUpgradeRequests = () => {
// // //   const [requests, setRequests] = useState<WalletUpgradeRequest[]>([]);
// // //   const [loading, setLoading] = useState(true);
// // //   const supabase = createClient();

// // //   useEffect(() => {
// // //     fetchRequests();
// // //     const interval = setInterval(fetchRequests, 10000);
// // //     return () => clearInterval(interval);
// // //   }, []);

// // //   const fetchRequests = async () => {
// // //     try {
// // //       const { data, error } = await supabase
// // //         .from('wallet_upgrades')
// // //         .select('*')
// // //         .order('created_at', { ascending: false });

// // //       if (error) throw error;
// // //       setRequests(data || []);
// // //     } catch (error) {
// // //       console.error('Error fetching upgrade requests:', error);
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   const handleApprove = async (requestId: string) => {
// // //     try {
// // //       // Update the upgrade request status
// // //       const { error: updateError } = await supabase
// // //         .from('wallet_upgrades')
// // //         .update({ status: true, updated_at: new Date().toISOString() })
// // //         .eq('id', requestId);

// // //       if (updateError) throw updateError;

// // //       // Find the request to get the wallet ID and new tier
// // //       const request = requests.find(r => r.id === requestId);
// // //       if (!request) return;

// // //       // Calculate the new balance (current balance + tier upgrade bonus)
// // //       const tierUpgradeBonus = TIER_CONFIG[request.target_tier].minimum;
// // //       const newBalance = request.balance + tierUpgradeBonus;

// // //       // Update the wallet tier and balance
// // //       const { error: walletError } = await supabase
// // //         .from('wallets')
// // //         .update({ 
// // //           tier: request.target_tier,
// // //           balance: newBalance
// // //         })
// // //         .eq('id', request.wallet_id);

// // //       if (walletError) throw walletError;

// // //       // Refresh the list
// // //       fetchRequests();
// // //     } catch (error) {
// // //       console.error('Error approving upgrade:', error);
// // //     }
// // //   };

// // //   const handleReject = async (requestId: string) => {
// // //     try {
// // //       const { error } = await supabase
// // //         .from('wallet_upgrades')
// // //         .delete()
// // //         .eq('id', requestId);

// // //       if (error) throw error;
// // //       fetchRequests();
// // //     } catch (error) {
// // //       console.error('Error rejecting upgrade:', error);
// // //     }
// // //   };

// // //   return (
// // //     <div className="p-6">
// // //       <h1 className="text-2xl font-bold mb-6">Wallet Upgrade Requests</h1>
      
// // //       {loading ? (
// // //         <div className="flex justify-center py-8">
// // //           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
// // //         </div>
// // //       ) : requests.length === 0 ? (
// // //         <div className=" rounded-lg p-8 text-center">
// // //           <p className="text-slate-500">No pending upgrade requests</p>
// // //         </div>
// // //       ) : (
// // //         <div className="rounded-lg shadow overflow-hidden">
// // //           <div className="overflow-x-auto">
// // //             <table className="w-full min-w-max">
// // //               <thead className="">
// // //                 <tr>
// // //                   <th className="p-3 text-left">User</th>
// // //                   <th className="p-3 text-left">Wallet Number</th>
// // //                   <th className="p-3 text-left">Current Balance</th>
// // //                   <th className="p-3 text-left">Current Tier</th>
// // //                   <th className="p-3 text-left">Target Tier</th>
// // //                   <th className="p-3 text-left">Upgrade Bonus</th>
// // //                   <th className="p-3 text-left">New Balance</th>
// // //                   <th className="p-3 text-left">Requested</th>
// // //                   <th className="p-3 text-left">Actions</th>
// // //                 </tr>
// // //               </thead>
// // //               <tbody>
// // //                 {requests.map(request => {
// // //                   const tierUpgradeBonus = TIER_CONFIG[request.target_tier].minimum;
// // //                   const newBalance = request.balance + tierUpgradeBonus;
                  
// // //                   return (
// // //                     <tr key={request.id} className="border-t">
// // //                       <td className="p-3 flex items-center gap-2">
// // //                         <FiUser className="text-slate-500" />
// // //                         <span className="text-sm">{request.user_id.substring(0, 8)}...</span>
// // //                       </td>
// // //                       <td className="p-3 flex items-center gap-2">
// // //                         <FiCreditCard className="text-slate-500" />
// // //                         <span className="font-mono text-sm">{request.wallet_number}</span>
// // //                       </td>
// // //                       <td className="p-3 flex items-center gap-2">
// // //                         <FiDollarSign className="text-slate-500" />
// // //                         <span className="font-semibold">${request.balance}</span>
// // //                       </td>
// // //                       <td className="p-3">
// // //                         <span className={`px-2 py-1 rounded-full text-xs ${TIER_CONFIG[request.current_tier].bgColor}`}>
// // //                           {TIER_CONFIG[request.current_tier].name}
// // //                         </span>
// // //                       </td>
// // //                       <td className="p-3">
// // //                         <span className={`px-2 py-1 rounded-full text-xs ${TIER_CONFIG[request.target_tier].bgColor}`}>
// // //                           {TIER_CONFIG[request.target_tier].name}
// // //                         </span>
// // //                       </td>
// // //                       <td className="p-3">
// // //                         <span className="text-green-600 font-semibold">
// // //                           +${tierUpgradeBonus.toLocaleString()}
// // //                         </span>
// // //                       </td>
// // //                       <td className="p-3">
// // //                         <span className="text-blue-600 font-semibold">
// // //                           ${newBalance.toLocaleString()}
// // //                         </span>
// // //                       </td>
// // //                       <td className="p-3 text-sm text-slate-500">
// // //                         {new Date(request.created_at).toLocaleString()}
// // //                       </td>
// // //                       <td className="p-3">
// // //                         {!request.status ? (
// // //                           <div className="flex gap-2">
// // //                             <button
// // //                               onClick={() => handleApprove(request.id)}
// // //                               className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-lg transition-colors"
// // //                               title="Approve Upgrade"
// // //                             >
// // //                               <FiCheck />
// // //                             </button>
// // //                             <button
// // //                               onClick={() => handleReject(request.id)}
// // //                               className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-colors"
// // //                               title="Reject Upgrade"
// // //                             >
// // //                               <FiX />
// // //                             </button>
// // //                           </div>
// // //                         ) : (
// // //                           <span className="text-green-500 flex items-center gap-1">
// // //                             <FiCheck /> Approved
// // //                           </span>
// // //                         )}
// // //                       </td>
// // //                     </tr>
// // //                   );
// // //                 })}
// // //               </tbody>
// // //             </table>
// // //           </div>
// // //         </div>
// // //       )}
// // //     </div>
// // //   );
// // // };

// // // export default AdminUpgradeRequests;



// // // AdminUpgradeRequests.tsx
// // "use client"
// // import React, { useState, useEffect } from 'react';
// // import { createClient } from '@/app/utils/supabase/clients';
// // import { WalletUpgradeRequest, WalletTier, TIER_CONFIG } from '@/app/data';
// // import { FiCheck, FiClock, FiX, FiUser, FiCreditCard, FiDollarSign, FiArrowUp, FiCalendar } from 'react-icons/fi';

// // const AdminUpgradeRequests = () => {
// //   const [requests, setRequests] = useState<WalletUpgradeRequest[]>([]);
// //   const [loading, setLoading] = useState(true);
// //   const supabase = createClient();

// //   useEffect(() => {
// //     fetchRequests();
// //     const interval = setInterval(fetchRequests, 10000);
// //     return () => clearInterval(interval);
// //   }, []);

// //   const fetchRequests = async () => {
// //     try {
// //       const { data, error } = await supabase
// //         .from('wallet_upgrades')
// //         .select('*')
// //         .order('created_at', { ascending: false });

// //       if (error) throw error;
// //       setRequests(data || []);
// //     } catch (error) {
// //       console.error('Error fetching upgrade requests:', error);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleApprove = async (requestId: string) => {
// //     try {
// //       // Update the upgrade request status
// //       const { error: updateError } = await supabase
// //         .from('wallet_upgrades')
// //         .update({ status: true, updated_at: new Date().toISOString() })
// //         .eq('id', requestId);

// //       if (updateError) throw updateError;

// //       // Find the request to get the wallet ID and new tier
// //       const request = requests.find(r => r.id === requestId);
// //       if (!request) return;

// //       // Calculate the new balance (current balance + tier upgrade bonus)
// //       const tierUpgradeBonus = TIER_CONFIG[request.target_tier].minimum;
// //       const newBalance = request.balance + tierUpgradeBonus;

// //       // Update the wallet tier and balance
// //       const { error: walletError } = await supabase
// //         .from('wallets')
// //         .update({ 
// //           tier: request.target_tier,
// //           balance: newBalance
// //         })
// //         .eq('id', request.wallet_id);

// //       if (walletError) throw walletError;

// //       // Refresh the list
// //       fetchRequests();
// //     } catch (error) {
// //       console.error('Error approving upgrade:', error);
// //     }
// //   };

// //   const handleReject = async (requestId: string) => {
// //     try {
// //       const { error } = await supabase
// //         .from('wallet_upgrades')
// //         .delete()
// //         .eq('id', requestId);

// //       if (error) throw error;
// //       fetchRequests();
// //     } catch (error) {
// //       console.error('Error rejecting upgrade:', error);
// //     }
// //   };

// //   const pendingRequests = requests.filter(r => !r.status);
// //   const approvedRequests = requests.filter(r => r.status);

// //   return (
// //     <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
// //       <div className="max-w-7xl mx-auto">
// //         {/* Header */}
// //         <div className="mb-8">
// //           <h1 className="text-3xl font-bold text-slate-800 mb-2">Wallet Upgrade Requests</h1>
// //           <p className="text-slate-600">Manage and approve wallet tier upgrade requests</p>
// //         </div>

// //         {/* Stats Cards */}
// //         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
// //           <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
// //             <div className="flex items-center justify-between">
// //               <div>
// //                 <p className="text-sm font-medium text-slate-500">Total Requests</p>
// //                 <p className="text-2xl font-bold text-slate-900">{requests.length}</p>
// //               </div>
// //               <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
// //                 <FiClock className="h-6 w-6 text-blue-600" />
// //               </div>
// //             </div>
// //           </div>
          
// //           <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
// //             <div className="flex items-center justify-between">
// //               <div>
// //                 <p className="text-sm font-medium text-slate-500">Pending</p>
// //                 <p className="text-2xl font-bold text-orange-600">{pendingRequests.length}</p>
// //               </div>
// //               <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
// //                 <FiArrowUp className="h-6 w-6 text-orange-600" />
// //               </div>
// //             </div>
// //           </div>
          
// //           <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
// //             <div className="flex items-center justify-between">
// //               <div>
// //                 <p className="text-sm font-medium text-slate-500">Approved</p>
// //                 <p className="text-2xl font-bold text-green-600">{approvedRequests.length}</p>
// //               </div>
// //               <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
// //                 <FiCheck className="h-6 w-6 text-green-600" />
// //               </div>
// //             </div>
// //           </div>
// //         </div>

// //         {/* Main Content */}
// //         {loading ? (
// //           <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12">
// //             <div className="flex flex-col items-center justify-center">
// //               <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mb-4"></div>
// //               <p className="text-slate-500">Loading upgrade requests...</p>
// //             </div>
// //           </div>
// //         ) : requests.length === 0 ? (
// //           <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12">
// //             <div className="text-center">
// //               <div className="h-16 w-16 bg-slate-100 rounded-lg flex items-center justify-center mx-auto mb-4">
// //                 <FiCreditCard className="h-8 w-8 text-slate-400" />
// //               </div>
// //               <h3 className="text-lg font-semibold text-slate-800 mb-2">No upgrade requests</h3>
// //               <p className="text-slate-500">There are currently no wallet upgrade requests to review.</p>
// //             </div>
// //           </div>
// //         ) : (
// //           <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
// //             <div className="overflow-x-auto">
// //               <table className="w-full">
// //                 <thead>
// //                   <tr className="bg-slate-50 border-b border-slate-200">
// //                     <th className="text-left py-4 px-6 font-semibold text-slate-700 text-sm">
// //                       <div className="flex items-center gap-2">
// //                         <FiUser className="h-4 w-4" />
// //                         User
// //                       </div>
// //                     </th>
// //                     <th className="text-left py-4 px-6 font-semibold text-slate-700 text-sm">
// //                       <div className="flex items-center gap-2">
// //                         <FiCreditCard className="h-4 w-4" />
// //                         Wallet
// //                       </div>
// //                     </th>
// //                     <th className="text-left py-4 px-6 font-semibold text-slate-700 text-sm">
// //                       <div className="flex items-center gap-2">
// //                         <FiDollarSign className="h-4 w-4" />
// //                         Balance
// //                       </div>
// //                     </th>
// //                     <th className="text-left py-4 px-6 font-semibold text-slate-700 text-sm">Current Tier</th>
// //                     <th className="text-left py-4 px-6 font-semibold text-slate-700 text-sm">Target Tier</th>
// //                     <th className="text-left py-4 px-6 font-semibold text-slate-700 text-sm">Bonus</th>
// //                     <th className="text-left py-4 px-6 font-semibold text-slate-700 text-sm">New Balance</th>
// //                     <th className="text-left py-4 px-6 font-semibold text-slate-700 text-sm">
// //                       <div className="flex items-center gap-2">
// //                         <FiCalendar className="h-4 w-4" />
// //                         Date
// //                       </div>
// //                     </th>
// //                     <th className="text-left py-4 px-6 font-semibold text-slate-700 text-sm">Actions</th>
// //                   </tr>
// //                 </thead>
// //                 <tbody>
// //                   {requests.map((request, index) => {
// //                     const tierUpgradeBonus = TIER_CONFIG[request.target_tier].minimum;
// //                     const newBalance = request.balance + tierUpgradeBonus;
                    
// //                     return (
// //                       <tr 
// //                         key={request.id} 
// //                         className={`border-b border-slate-100 hover:bg-slate-25 transition-colors ${
// //                           index % 2 === 0 ? 'bg-white' : 'bg-slate-25'
// //                         }`}
// //                       >
// //                         <td className="py-4 px-6">
// //                           <div className="flex items-center gap-3">
// //                             <div className="h-8 w-8 bg-slate-100 rounded-full flex items-center justify-center">
// //                               <FiUser className="h-4 w-4 text-slate-500" />
// //                             </div>
// //                             <span className="text-sm font-medium text-slate-700">
// //                               {request.user_id.substring(0, 8)}...
// //                             </span>
// //                           </div>
// //                         </td>
// //                         <td className="py-4 px-6">
// //                           <span className="font-mono text-sm text-slate-600 bg-slate-100 px-2 py-1 rounded">
// //                             {request.wallet_number}
// //                           </span>
// //                         </td>
// //                         <td className="py-4 px-6">
// //                           <span className="font-semibold text-slate-800">
// //                             ${request.balance}
// //                           </span>
// //                         </td>
// //                         <td className="py-4 px-6">
// //                           <span className={`px-3 py-1 rounded-full text-xs font-medium ${TIER_CONFIG[request.current_tier].bgColor}`}>
// //                             {TIER_CONFIG[request.current_tier].name}
// //                           </span>
// //                         </td>
// //                         <td className="py-4 px-6">
// //                           <span className={`px-3 py-1 rounded-full text-xs font-medium ${TIER_CONFIG[request.target_tier].bgColor}`}>
// //                             {TIER_CONFIG[request.target_tier].name}
// //                           </span>
// //                         </td>
// //                         <td className="py-4 px-6">
// //                           <span className="text-green-600 font-semibold">
// //                             +${tierUpgradeBonus.toLocaleString()}
// //                           </span>
// //                         </td>
// //                         <td className="py-4 px-6">
// //                           <span className="text-blue-600 font-semibold">
// //                             ${newBalance.toLocaleString()}
// //                           </span>
// //                         </td>
// //                         <td className="py-4 px-6">
// //                           <span className="text-sm text-slate-500">
// //                             {new Date(request.created_at).toLocaleDateString('en-US', {
// //                               month: 'short',
// //                               day: 'numeric',
// //                               hour: '2-digit',
// //                               minute: '2-digit'
// //                             })}
// //                           </span>
// //                         </td>
// //                         <td className="py-4 px-6">
// //                           {!request.status ? (
// //                             <div className="flex gap-2">
// //                               <button
// //                                 onClick={() => handleApprove(request.id)}
// //                                 className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-md"
// //                                 title="Approve Upgrade"
// //                               >
// //                                 <FiCheck className="h-4 w-4" />
// //                               </button>
// //                               <button
// //                                 onClick={() => handleReject(request.id)}
// //                                 className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-md"
// //                                 title="Reject Upgrade"
// //                               >
// //                                 <FiX className="h-4 w-4" />
// //                               </button>
// //                             </div>
// //                           ) : (
// //                             <div className="flex items-center gap-2">
// //                               <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
// //                                 <FiCheck className="h-4 w-4 text-green-600" />
// //                               </div>
// //                               <span className="text-sm font-medium text-green-600">Approved</span>
// //                             </div>
// //                           )}
// //                         </td>
// //                       </tr>
// //                     );
// //                   })}
// //                 </tbody>
// //               </table>
// //             </div>
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   );
// // };

// // export default AdminUpgradeRequests;


// // AdminUpgradeRequests.tsx
// "use client"
// import React, { useState, useEffect } from 'react';
// import { createClient } from '@/app/utils/supabase/clients';
// import { WalletUpgradeRequest, WalletTier, TIER_CONFIG } from '@/app/data';
// import { FiCheck, FiClock, FiX, FiUser, FiCreditCard, FiDollarSign, FiArrowUp, FiCalendar } from 'react-icons/fi';

// const AdminUpgradeRequests = () => {
//   const [requests, setRequests] = useState<WalletUpgradeRequest[]>([]);
//   const [loading, setLoading] = useState(true);
//   const supabase = createClient();

//   useEffect(() => {
//     fetchRequests();
//     const interval = setInterval(fetchRequests, 10000);
//     return () => clearInterval(interval);
//   }, []);

//   const fetchRequests = async () => {
//     try {
//       const { data, error } = await supabase
//         .from('wallet_upgrades')
//         .select('*')
//         .order('created_at', { ascending: false });

//       if (error) throw error;
//       setRequests(data || []);
//     } catch (error) {
//       console.error('Error fetching upgrade requests:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleApprove = async (requestId: string) => {
//     try {
//       // Update the upgrade request status
//       const { error: updateError } = await supabase
//         .from('wallet_upgrades')
//         .update({ status: true, updated_at: new Date().toISOString() })
//         .eq('id', requestId);

//       if (updateError) throw updateError;

//       // Find the request to get the wallet ID and new tier
//       const request = requests.find(r => r.id === requestId);
//       if (!request) return;

//       // Calculate the new balance (current balance + tier upgrade bonus)
//       const tierUpgradeBonus = TIER_CONFIG[request.target_tier].minimum;
//       const newBalance = request.balance + tierUpgradeBonus;

//       // Update the wallet tier and balance
//       const { error: walletError } = await supabase
//         .from('wallets')
//         .update({ 
//           tier: request.target_tier,
//           balance: newBalance
//         })
//         .eq('id', request.wallet_id);

//       if (walletError) throw walletError;

//       // Refresh the list
//       fetchRequests();
//     } catch (error) {
//       console.error('Error approving upgrade:', error);
//     }
//   };

//   const handleReject = async (requestId: string) => {
//     try {
//       const { error } = await supabase
//         .from('wallet_upgrades')
//         .delete()
//         .eq('id', requestId);

//       if (error) throw error;
//       fetchRequests();
//     } catch (error) {
//       console.error('Error rejecting upgrade:', error);
//     }
//   };

//   const pendingRequests = requests.filter(r => !r.status);
//   const approvedRequests = requests.filter(r => r.status);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 md:p-6">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="bg-gradient-to-r from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl p-6 mb-6 md:mb-8 border border-slate-700/50">
//           <h1 className="text-3xl font-bold text-white mb-2">Wallet Upgrade Requests</h1>
//           <p className="text-slate-300">Manage and approve wallet tier upgrade requests</p>
//         </div>

//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
//           <div className="bg-gradient-to-r from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-slate-400">Total Requests</p>
//                 <p className="text-2xl font-bold text-white">{requests.length}</p>
//               </div>
//               <div className="h-12 w-12 bg-blue-500/20 rounded-lg flex items-center justify-center border border-blue-500/30">
//                 <FiClock className="h-6 w-6 text-blue-400" />
//               </div>
//             </div>
//           </div>
          
//           <div className="bg-gradient-to-r from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-slate-400">Pending</p>
//                 <p className="text-2xl font-bold text-orange-400">{pendingRequests.length}</p>
//               </div>
//               <div className="h-12 w-12 bg-orange-500/20 rounded-lg flex items-center justify-center border border-orange-500/30">
//                 <FiArrowUp className="h-6 w-6 text-orange-400" />
//               </div>
//             </div>
//           </div>
          
//           <div className="bg-gradient-to-r from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-slate-400">Approved</p>
//                 <p className="text-2xl font-bold text-green-400">{approvedRequests.length}</p>
//               </div>
//               <div className="h-12 w-12 bg-green-500/20 rounded-lg flex items-center justify-center border border-green-500/30">
//                 <FiCheck className="h-6 w-6 text-green-400" />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Main Content */}
//         {loading ? (
//           <div className="bg-gradient-to-r from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl p-12 border border-slate-700/50">
//             <div className="flex flex-col items-center justify-center">
//               <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mb-4"></div>
//               <p className="text-slate-300">Loading upgrade requests...</p>
//             </div>
//           </div>
//         ) : requests.length === 0 ? (
//           <div className="bg-gradient-to-r from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl p-12 border border-slate-700/50">
//             <div className="text-center">
//               <div className="h-16 w-16 bg-slate-700/50 rounded-lg flex items-center justify-center mx-auto mb-4">
//                 <FiCreditCard className="h-8 w-8 text-slate-400" />
//               </div>
//               <h3 className="text-lg font-semibold text-white mb-2">No upgrade requests</h3>
//               <p className="text-slate-400">There are currently no wallet upgrade requests to review.</p>
//             </div>
//           </div>
//         ) : (
//           <div className="bg-gradient-to-r from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 overflow-hidden">
//             <div className="overflow-x-auto">
//               <div className="min-w-full inline-block align-middle">
//                 <table className="min-w-full">
//                   <thead>
//                     <tr className="bg-slate-700/30 border-b border-slate-600/50">
//                       <th className="text-left py-4 px-6 font-semibold text-slate-200 text-sm whitespace-nowrap">
//                         <div className="flex items-center gap-2">
//                           <FiUser className="h-4 w-4" />
//                           User
//                         </div>
//                       </th>
//                       <th className="text-left py-4 px-6 font-semibold text-slate-200 text-sm whitespace-nowrap">
//                         <div className="flex items-center gap-2">
//                           <FiCreditCard className="h-4 w-4" />
//                           Wallet
//                         </div>
//                       </th>
//                       <th className="text-left py-4 px-6 font-semibold text-slate-200 text-sm whitespace-nowrap">
//                         <div className="flex items-center gap-2">
//                           <FiDollarSign className="h-4 w-4" />
//                           Balance
//                         </div>
//                       </th>
//                       <th className="text-left py-4 px-6 font-semibold text-slate-200 text-sm whitespace-nowrap">Current Tier</th>
//                       <th className="text-left py-4 px-6 font-semibold text-slate-200 text-sm whitespace-nowrap">Target Tier</th>
//                       <th className="text-left py-4 px-6 font-semibold text-slate-200 text-sm whitespace-nowrap">Bonus</th>
//                       <th className="text-left py-4 px-6 font-semibold text-slate-200 text-sm whitespace-nowrap">New Balance</th>
//                       <th className="text-left py-4 px-6 font-semibold text-slate-200 text-sm whitespace-nowrap">
//                         <div className="flex items-center gap-2">
//                           <FiCalendar className="h-4 w-4" />
//                           Date
//                         </div>
//                       </th>
//                       <th className="text-left py-4 px-6 font-semibold text-slate-200 text-sm whitespace-nowrap">Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {requests.map((request, index) => {
//                       const tierUpgradeBonus = TIER_CONFIG[request.target_tier].minimum;
//                       const newBalance = request.balance + tierUpgradeBonus;
                      
//                       return (
//                         <tr 
//                           key={request.id} 
//                           className={`border-b border-slate-700/30 hover:bg-slate-700/20 transition-colors ${
//                             index % 2 === 0 ? 'bg-slate-800/20' : 'bg-slate-800/30'
//                           }`}
//                         >
//                           <td className="py-4 px-6 whitespace-nowrap">
//                             <div className="flex items-center gap-3">
//                               <div className="h-8 w-8 bg-slate-700/50 rounded-full flex items-center justify-center">
//                                 <FiUser className="h-4 w-4 text-slate-400" />
//                               </div>
//                               <span className="text-sm font-medium text-slate-300">
//                                 {request.user_id.substring(0, 8)}...
//                               </span>
//                             </div>
//                           </td>
//                           <td className="py-4 px-6 whitespace-nowrap">
//                             <span className="font-mono text-sm text-slate-300 bg-slate-700/50 px-2 py-1 rounded">
//                               {request.wallet_number}
//                             </span>
//                           </td>
//                           <td className="py-4 px-6 whitespace-nowrap">
//                             <span className="font-semibold text-slate-200">
//                               ${request.balance}
//                             </span>
//                           </td>
//                           <td className="py-4 px-6 whitespace-nowrap">
//                             <span className={`px-3 py-1 rounded-full text-xs font-medium ${TIER_CONFIG[request.current_tier].bgColor}`}>
//                               {TIER_CONFIG[request.current_tier].name}
//                             </span>
//                           </td>
//                           <td className="py-4 px-6 whitespace-nowrap">
//                             <span className={`px-3 py-1 rounded-full text-xs font-medium ${TIER_CONFIG[request.target_tier].bgColor}`}>
//                               {TIER_CONFIG[request.target_tier].name}
//                             </span>
//                           </td>
//                           <td className="py-4 px-6 whitespace-nowrap">
//                             <span className="text-green-400 font-semibold">
//                               +${tierUpgradeBonus.toLocaleString()}
//                             </span>
//                           </td>
//                           <td className="py-4 px-6 whitespace-nowrap">
//                             <span className="text-blue-400 font-semibold">
//                               ${newBalance.toLocaleString()}
//                             </span>
//                           </td>
//                           <td className="py-4 px-6 whitespace-nowrap">
//                             <span className="text-sm text-slate-400">
//                               {new Date(request.created_at).toLocaleDateString('en-US', {
//                                 month: 'short',
//                                 day: 'numeric',
//                                 hour: '2-digit',
//                                 minute: '2-digit'
//                               })}
//                             </span>
//                           </td>
//                           <td className="py-4 px-6 whitespace-nowrap">
//                             {!request.status ? (
//                               <div className="flex gap-2">
//                                 <button
//                                   onClick={() => handleApprove(request.id)}
//                                   className="bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30 p-2 rounded-lg transition-all duration-200 hover:scale-105"
//                                   title="Approve Upgrade"
//                                 >
//                                   <FiCheck className="h-4 w-4" />
//                                 </button>
//                                 <button
//                                   onClick={() => handleReject(request.id)}
//                                   className="bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 p-2 rounded-lg transition-all duration-200 hover:scale-105"
//                                   title="Reject Upgrade"
//                                 >
//                                   <FiX className="h-4 w-4" />
//                                 </button>
//                               </div>
//                             ) : (
//                               <div className="flex items-center gap-2">
//                                 <div className="h-8 w-8 bg-green-500/20 rounded-full flex items-center justify-center border border-green-500/30">
//                                   <FiCheck className="h-4 w-4 text-green-400" />
//                                 </div>
//                                 <span className="text-sm font-medium text-green-400">Approved</span>
//                               </div>
//                             )}
//                           </td>
//                         </tr>
//                       );
//                     })}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AdminUpgradeRequests;



// AdminUpgradeRequests.tsx
"use client"
import React, { useState, useEffect } from 'react';
import { createClient } from '@/app/utils/supabase/clients';
import { WalletUpgradeRequest, WalletTier, TIER_CONFIG } from '@/app/data';
import { FiCheck, FiClock, FiX, FiUser, FiCreditCard, FiDollarSign, FiArrowUp, FiCalendar, FiChevronDown, FiChevronUp } from 'react-icons/fi';

const AdminUpgradeRequests = () => {
  const [requests, setRequests] = useState<WalletUpgradeRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const supabase = createClient();

  useEffect(() => {
    fetchRequests();
    const interval = setInterval(fetchRequests, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('wallet_upgrades')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (error) {
      console.error('Error fetching upgrade requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (requestId: string) => {
    try {
      const { error: updateError } = await supabase
        .from('wallet_upgrades')
        .update({ status: true, updated_at: new Date().toISOString() })
        .eq('id', requestId);

      if (updateError) throw updateError;

      const request = requests.find(r => r.id === requestId);
      if (!request) return;

      const tierUpgradeBonus = TIER_CONFIG[request.target_tier].minimum;
      const newBalance = request.balance + tierUpgradeBonus;

      const { error: walletError } = await supabase
        .from('wallets')
        .update({ 
          tier: request.target_tier,
          balance: newBalance
        })
        .eq('id', request.wallet_id);

      if (walletError) throw walletError;
      fetchRequests();
    } catch (error) {
      console.error('Error approving upgrade:', error);
    }
  };

  const handleReject = async (requestId: string) => {
    try {
      const { error } = await supabase
        .from('wallet_upgrades')
        .delete()
        .eq('id', requestId);

      if (error) throw error;
      fetchRequests();
    } catch (error) {
      console.error('Error rejecting upgrade:', error);
    }
  };

  const toggleExpanded = (requestId: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(requestId)) {
      newExpanded.delete(requestId);
    } else {
      newExpanded.add(requestId);
    }
    setExpandedRows(newExpanded);
  };

  const pendingRequests = requests.filter(r => !r.status);
  const approvedRequests = requests.filter(r => r.status);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl p-6 mb-6 md:mb-8 border border-slate-700/50">
          <h1 className="text-3xl font-bold text-white mb-2">Wallet Upgrade Requests</h1>
          <p className="text-slate-300">Manage and approve wallet tier upgrade requests</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
          <div className="bg-gradient-to-r from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">Total Requests</p>
                <p className="text-2xl font-bold text-white">{requests.length}</p>
              </div>
              <div className="h-12 w-12 bg-blue-500/20 rounded-lg flex items-center justify-center border border-blue-500/30">
                <FiClock className="h-6 w-6 text-blue-400" />
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">Pending</p>
                <p className="text-2xl font-bold text-orange-400">{pendingRequests.length}</p>
              </div>
              <div className="h-12 w-12 bg-orange-500/20 rounded-lg flex items-center justify-center border border-orange-500/30">
                <FiArrowUp className="h-6 w-6 text-orange-400" />
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">Approved</p>
                <p className="text-2xl font-bold text-green-400">{approvedRequests.length}</p>
              </div>
              <div className="h-12 w-12 bg-green-500/20 rounded-lg flex items-center justify-center border border-green-500/30">
                <FiCheck className="h-6 w-6 text-green-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        {loading ? (
          <div className="bg-gradient-to-r from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl p-12 border border-slate-700/50">
            <div className="flex flex-col items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mb-4"></div>
              <p className="text-slate-300">Loading upgrade requests...</p>
            </div>
          </div>
        ) : requests.length === 0 ? (
          <div className="bg-gradient-to-r from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl p-12 border border-slate-700/50">
            <div className="text-center">
              <div className="h-16 w-16 bg-slate-700/50 rounded-lg flex items-center justify-center mx-auto mb-4">
                <FiCreditCard className="h-8 w-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">No upgrade requests</h3>
              <p className="text-slate-400">There are currently no wallet upgrade requests to review.</p>
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-r from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-700/30 border-b border-slate-600/50">
                    <th className="text-left py-4 px-4 font-semibold text-slate-200 text-sm">
                      <div className="flex items-center gap-2">
                        <FiUser className="h-4 w-4" />
                        User
                      </div>
                    </th>
                    <th className="text-left py-4 px-4 font-semibold text-slate-200 text-sm">Upgrade</th>
                    <th className="text-left py-4 px-4 font-semibold text-slate-200 text-sm">Status</th>
                    <th className="text-left py-4 px-4 font-semibold text-slate-200 text-sm">Actions</th>
                    <th className="text-left py-4 px-4 font-semibold text-slate-200 text-sm">Details</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((request, index) => {
                    const tierUpgradeBonus = TIER_CONFIG[request.target_tier].minimum;
                    const newBalance = request.balance + tierUpgradeBonus;
                    const isExpanded = expandedRows.has(request.id);
                    
                    return (
                      <React.Fragment key={request.id}>
                        <tr className={`border-b border-slate-700/30 hover:bg-slate-700/20 transition-colors ${
                          index % 2 === 0 ? 'bg-slate-800/20' : 'bg-slate-800/30'
                        }`}>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 bg-slate-700/50 rounded-full flex items-center justify-center">
                                <FiUser className="h-4 w-4 text-slate-400" />
                              </div>
                              <div>
                                <div className="text-sm font-medium text-slate-300">
                                  {request.email}...
                                </div>
                                <div className="text-xs text-slate-400">
                                  {new Date(request.created_at).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric'
                                  })}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${TIER_CONFIG[request.current_tier].bgColor}`}>
                                {TIER_CONFIG[request.current_tier].name}
                              </span>
                              <FiArrowUp className="h-3 w-3 text-slate-400" />
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${TIER_CONFIG[request.target_tier].bgColor}`}>
                                {TIER_CONFIG[request.target_tier].name}
                              </span>
                            </div>
                            <div className="text-xs text-green-400 mt-1">
                              +${tierUpgradeBonus.toLocaleString()} bonus
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            {!request.status ? (
                              <span className="inline-flex items-center gap-1 text-orange-400 bg-orange-500/20 px-2 py-1 rounded-full text-xs">
                                <FiClock className="h-3 w-3" />
                                Pending
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-green-400 bg-green-500/20 px-2 py-1 rounded-full text-xs">
                                <FiCheck className="h-3 w-3" />
                                Approved
                              </span>
                            )}
                          </td>
                          <td className="py-4 px-4">
                            {!request.status ? (
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleApprove(request.id)}
                                  className="bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30 p-2 rounded-lg transition-all duration-200 hover:scale-105"
                                  title="Approve Upgrade"
                                >
                                  <FiCheck className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleReject(request.id)}
                                  className="bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 p-2 rounded-lg transition-all duration-200 hover:scale-105"
                                  title="Reject Upgrade"
                                >
                                  <FiX className="h-4 w-4" />
                                </button>
                              </div>
                            ) : (
                              <span className="text-xs text-slate-400">Completed</span>
                            )}
                          </td>
                          <td className="py-4 px-4">
                            <button
                              onClick={() => toggleExpanded(request.id)}
                              className="text-slate-400 hover:text-slate-300 transition-colors"
                            >
                              {isExpanded ? (
                                <FiChevronUp className="h-4 w-4" />
                              ) : (
                                <FiChevronDown className="h-4 w-4" />
                              )}
                            </button>
                          </td>
                        </tr>
                        {isExpanded && (
                          <tr className="bg-slate-700/10 border-b border-slate-700/30">
                            <td colSpan={5} className="py-4 px-4">
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                <div className="space-y-2">
                                  <h4 className="font-medium text-slate-300">Wallet Details</h4>
                                  <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                      <FiCreditCard className="h-4 w-4 text-slate-400" />
                                      <span className="text-slate-400">Wallet:</span>
                                      <span className="font-mono text-slate-300 bg-slate-700/50 px-2 py-1 rounded">
                                        {request.wallet_number}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <FiDollarSign className="h-4 w-4 text-slate-400" />
                                      <span className="text-slate-400">Current Balance:</span>
                                      <span className="font-semibold text-slate-300">
                                        ${request.balance.toLocaleString()}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <h4 className="font-medium text-slate-300">Upgrade Details</h4>
                                  <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                      <span className="text-slate-400">Bonus:</span>
                                      <span className="text-green-400 font-semibold">
                                        +${tierUpgradeBonus.toLocaleString()}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <span className="text-slate-400">New Balance:</span>
                                      <span className="text-blue-400 font-semibold">
                                        ${newBalance.toLocaleString()}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <h4 className="font-medium text-slate-300">Timeline</h4>
                                  <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                      <FiCalendar className="h-4 w-4 text-slate-400" />
                                      <span className="text-slate-400">Requested:</span>
                                      <span className="text-slate-300">
                                        {new Date(request.created_at).toLocaleDateString('en-US', {
                                          month: 'short',
                                          day: 'numeric',
                                          year: 'numeric',
                                          hour: '2-digit',
                                          minute: '2-digit'
                                        })}
                                      </span>
                                    </div>
                                    {request.status && (
                                      <div className="flex items-center gap-2">
                                        <FiCheck className="h-4 w-4 text-green-400" />
                                        <span className="text-slate-400">Approved:</span>
                                        <span className="text-green-400">
                                          {new Date(request.updated_at).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                          })}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUpgradeRequests;