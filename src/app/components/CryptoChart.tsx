// 'use client';

// import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// const CustomTooltip = ({ active, payload, label }: any) => {
//   if (active && payload && payload.length) {
//     const data = payload[0];
//     return (
//       <div className="bg-gray-700 border border-gray-600 rounded-lg p-3 shadow-lg">
//         <p className="text-gray-300 text-sm">{label}</p>
//         <p className="text-white font-semibold">
//           ${data.value.toLocaleString(undefined, { 
//             minimumFractionDigits: 2, 
//             maximumFractionDigits: 2 
//           })}
//         </p>
//       </div>
//     );
//   }
//   return null;
// };

// export const CryptoChart = ({ coinId, name, chartData }: { coinId: string; name: string; chartData: any }) => {
//   if (!chartData || !chartData.prices) {
//     return (
//       <div className="bg-gray-800 rounded-xl p-6">
//         <h3 className="text-lg font-semibold mb-4">{name} Price Chart (7 Days)</h3>
//         <div className="h-64 bg-gray-900 rounded-lg p-4 flex items-center justify-center">
//           <div className="text-center">
//             <div className="animate-pulse">
//               <div className="h-32 bg-gray-700 rounded mb-4"></div>
//               <p className="text-gray-400">Loading {name} chart data...</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   const chartDataProcessed = chartData.prices.map((price: [number, number], index: number) => ({
//     time: new Date(price[0]).toLocaleDateString('en-US', { 
//       month: 'short', 
//       day: 'numeric',
//       hour: index % 24 === 0 ? 'numeric' : undefined 
//     }),
//     price: price[1],
//     timestamp: price[0]
//   }));

//   const sampledData = chartDataProcessed.filter((_, index: any) => index % 6 === 0);
//   const currentPrice = chartDataProcessed[chartDataProcessed.length - 1]?.price || 0;
//   const firstPrice = chartDataProcessed[0]?.price || 0;
//   const priceChange = ((currentPrice - firstPrice) / firstPrice) * 100;
//   const isPositive = priceChange >= 0;
//   const minPrice = Math.min(...chartDataProcessed.map(d => d.price));
//   const maxPrice = Math.max(...chartDataProcessed.map(d => d.price));

//   return (
//     <div className="bg-gray-800 rounded-xl p-6">
//       <div className="flex justify-between items-center mb-4">
//         <h3 className="text-lg font-semibold">{name} Price Chart (7 Days)</h3>
//         <div className="text-right">
//           <p className="text-xl font-bold">
//             ${currentPrice.toLocaleString(undefined, { 
//               minimumFractionDigits: 2, 
//               maximumFractionDigits: 2 
//             })}
//           </p>
//           <p className={`text-sm ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
//             {isPositive ? '+' : ''}{priceChange.toFixed(2)}%
//           </p>
//         </div>
//       </div>
      
//       <div className="h-64 bg-gray-900 rounded-lg p-4">
//         <ResponsiveContainer width="100%" height="100%">
//           <AreaChart data={sampledData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
//             <CartesianGrid strokeDasharray="3 3" stroke="#374151" strokeOpacity={0.3} />
//             <XAxis 
//               dataKey="time" 
//               axisLine={false}
//               tickLine={false}
//               tick={{ fill: '#9CA3AF', fontSize: 12 }}
//               interval="preserveStartEnd"
//             />
//             <YAxis 
//               axisLine={false}
//               tickLine={false}
//               tick={{ fill: '#9CA3AF', fontSize: 12 }}
//               domain={['dataMin - 50', 'dataMax + 50']}
//               tickFormatter={(value) => `${value.toLocaleString()}`}
//             />
//             <Tooltip content={<CustomTooltip />} />
//             <defs>
//               <linearGradient id={`colorPrice-${coinId}`} x1="0" y1="0" x2="0" y2="1">
//                 <stop offset="5%" stopColor={isPositive ? "#10b981" : "#ef4444"} stopOpacity={0.3}/>
//                 <stop offset="95%" stopColor={isPositive ? "#10b981" : "#ef4444"} stopOpacity={0.0}/>
//               </linearGradient>
//             </defs>
//             <Area
//               type="monotone"
//               dataKey="price"
//               stroke={isPositive ? "#10b981" : "#ef4444"}
//               strokeWidth={2}
//               fill={`url(#colorPrice-${coinId})`}
//               dot={false}
//               activeDot={{ 
//                 r: 4, 
//                 fill: isPositive ? "#10b981" : "#ef4444",
//                 strokeWidth: 2,
//                 stroke: '#1f2937'
//               }}
//             />
//           </AreaChart>
//         </ResponsiveContainer>
        
//         <div className="flex justify-between text-xs text-gray-400 mt-2">
//           <span>Low: ${minPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
//           <span>High: ${maxPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
//         </div>
//       </div>
//     </div>
//   );
// };