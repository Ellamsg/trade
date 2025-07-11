// "use client"

// import { useState, useEffect } from 'react';
// import { FiTrendingUp, FiTrendingDown, FiDollarSign, FiPieChart, FiActivity } from 'react-icons/fi';

// type PortfolioItem = {
//   id: string;
//   asset: string;
//   assetName: string;
//   amount: number;
//   averagePrice: number;
//   totalValue: number;
//   addedAt: Date;
//   currentPrice?: number;
//   priceChange24h?: number;
// };

// type StockAsset = {
//   symbol: string;
//   name: string;
//   price: number;
//   changesPercentage: number;
// };

// const PortfolioPage = () => {
//   const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
//   const [stockData, setStockData] = useState<StockAsset[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [totalValue, setTotalValue] = useState(0);
//   const [totalChange24h, setTotalChange24h] = useState(0);

//   // Load portfolio from localStorage
//   useEffect(() => {
//     const loadPortfolio = () => {
//       try {
//         const savedPortfolio = localStorage.getItem('stock_portfolio');
//         if (savedPortfolio) {
//           const parsedPortfolio = JSON.parse(savedPortfolio).map((item: any) => ({
//             ...item,
//             addedAt: new Date(item.addedAt)
//           }));
//           setPortfolio(parsedPortfolio);
//         }
//       } catch (error) {
//         console.error('Error loading portfolio:', error);
//       }
//     };

//     loadPortfolio();
//   }, []);

//   // Fetch current stock prices from FMP API
//   useEffect(() => {
//     const fetchStockData = async () => {
//       if (portfolio.length === 0) {
//         setLoading(false);
//         return;
//       }

//       try {
//         setLoading(true);
//         const apiKey = process.env.NEXT_PUBLIC_FMP_API_KEY || 'demo';
//         const symbols = portfolio.map(item => item.asset).join(',');
        
//         const response = await fetch(
//           `https://financialmodelingprep.com/api/v3/quote/${symbols}?apikey=${apiKey}`,
//           { next: { revalidate: 300 } } // Cache for 5 minutes
//         );
        
//         if (response.ok) {
//           const data = await response.json();
//           setStockData(data);
          
//           // Update portfolio with current prices
//           const updatedPortfolio = portfolio.map(item => {
//             const stockInfo = data.find((stock: StockAsset) => 
//               stock.symbol.toUpperCase() === item.asset.toUpperCase()
//             );
            
//             if (stockInfo) {
//               return {
//                 ...item,
//                 currentPrice: stockInfo.price,
//                 priceChange24h: stockInfo.changesPercentage,
//                 totalValue: item.amount * stockInfo.price
//               };
//             }
//             return item;
//           });
          
//           setPortfolio(updatedPortfolio);
          
//           // Calculate total values
//           const total = updatedPortfolio.reduce((sum, item) => sum + item.totalValue, 0);
//           const totalInvested = updatedPortfolio.reduce((sum, item) => sum + (item.amount * item.averagePrice), 0);
//           const change24h = ((total - totalInvested) / totalInvested) * 100;
          
//           setTotalValue(total);
//           setTotalChange24h(change24h);
//         }
//       } catch (error) {
//         console.error('Error fetching stock data:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchStockData();
//   }, [portfolio.length]);

//   const getProfitLoss = (item: PortfolioItem) => {
//     if (!item.currentPrice) return { amount: 0, percentage: 0 };
    
//     const currentValue = item.amount * item.currentPrice;
//     const investedValue = item.amount * item.averagePrice;
//     const profitLoss = currentValue - investedValue;
//     const percentage = ((profitLoss / investedValue) * 100);
    
//     return { amount: profitLoss, percentage };
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
//           <p className="text-slate-400">Loading portfolio...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br  py-9 from-slate-900 via-blue-900 to-slate-900 text-white">
//       <div className="max-w-7xl mx-auto p-4 md:p-6">
//         {/* Header Section */}
//         <div className="mb-8">
//           <div className="flex items-center space-x-4 mb-6">
//             <div className="p-3 bg-blue-600/20 rounded-xl border border-blue-500/30">
//               <FiPieChart className="w-6 h-6 text-blue-400" />
//             </div>
//             <div>
//               <h1 className="md:text-3xl text-[19px] font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
//                 Your Stock Portfolio
//               </h1>
//               <p className="text-slate-400">Track your stock investments</p>
//             </div>
//           </div>

//           {/* Portfolio Summary Card */}
//           <div className="bg-gradient-to-r from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl p-8 mb-8 border border-slate-700/50 shadow-2xl">
//             <div className="flex items-center justify-between mb-6">
//               <div>
//                 <p className="text-slate-400 text-lg mb-2">Total Portfolio Value</p>
//                 <p className="text-4xl font-bold text-white mb-2">
//                   ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
//                 </p>
//                 <div className={`flex items-center text-lg ${
//                   totalChange24h >= 0 ? 'text-green-400' : 'text-red-400'
//                 }`}>
//                   {totalChange24h >= 0 ? (
//                     <FiTrendingUp className="w-5 h-5 mr-2" />
//                   ) : (
//                     <FiTrendingDown className="w-5 h-5 mr-2" />
//                   )}
//                   {totalChange24h >= 0 ? '+' : ''}
//                   {totalChange24h.toFixed(2)}%
//                 </div>
//               </div>
//               <div className="p-4 bg-blue-600/20 rounded-xl">
//                 <FiDollarSign className="w-8 h-8 text-blue-400" />
//               </div>
//             </div>
            
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//               <div className="bg-slate-800/30 rounded-xl p-4 border border-slate-700/30">
//                 <p className="text-slate-400 text-sm mb-1">Total Stocks</p>
//                 <p className="text-xl font-bold text-white">{portfolio.length}</p>
//               </div>
//               <div className="bg-slate-800/30 rounded-xl p-4 border border-slate-700/30">
//                 <p className="text-slate-400 text-sm mb-1">Total Invested</p>
//                 <p className="text-xl font-bold text-white">
//                   ${portfolio.reduce((sum, item) => sum + (item.amount * item.averagePrice), 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
//                 </p>
//               </div>
//               <div className="bg-slate-800/30 rounded-xl p-4 border border-slate-700/30">
//                 <p className="text-slate-400 text-sm mb-1">Best Performer</p>
//                 <p className="text-xl font-bold text-green-400">
//                   {portfolio.length > 0 ? 
//                     portfolio.reduce((best, item) => {
//                       const currentPL = getProfitLoss(item);
//                       const bestPL = getProfitLoss(best);
//                       return currentPL.percentage > bestPL.percentage ? item : best;
//                     }).asset : 'N/A'}
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Portfolio Assets Table */}
//         <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/50 overflow-hidden shadow-2xl">
//           <div className="px-6 py-4 border-b border-slate-700/50 bg-slate-800/50">
//             <h2 className="text-xl font-semibold flex items-center">
//               <FiActivity className="mr-2 text-blue-400" />
//               Your Stocks
//             </h2>
//           </div>
          
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead>
//                 <tr className="bg-slate-800/30 border-b border-slate-700/50">
//                   <th className="text-left px-6 py-4 text-slate-300 font-medium text-sm uppercase tracking-wider">Stock</th>
//                   <th className="text-left px-6 py-4 text-slate-300 font-medium text-sm uppercase tracking-wider">Shares</th>
//                   <th className="text-left px-6 py-4 text-slate-300 font-medium text-sm uppercase tracking-wider">Avg. Price</th>
//                   <th className="text-left px-6 py-4 text-slate-300 font-medium text-sm uppercase tracking-wider">Current Price</th>
//                   <th className="text-left px-6 py-4 text-slate-300 font-medium text-sm uppercase tracking-wider">Market Value</th>
//                   <th className="text-left px-6 py-4 text-slate-300 font-medium text-sm uppercase tracking-wider">P&L</th>
//                   <th className="text-left px-6 py-4 text-slate-300 font-medium text-sm uppercase tracking-wider">24h Change</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {portfolio.length === 0 ? (
//                   <tr>
//                     <td colSpan={7} className="px-6 py-12 text-center">
//                       <div className="flex flex-col items-center text-slate-400">
//                         <FiPieChart className="w-12 h-12 mb-4 opacity-50" />
//                         <p className="text-lg font-medium">No stocks in portfolio</p>
//                         <p className="text-sm">Complete some buy orders to build your portfolio</p>
//                       </div>
//                     </td>
//                   </tr>
//                 ) : (
//                   portfolio.map((item, index) => {
//                     const profitLoss = getProfitLoss(item);
//                     return (
//                       <tr key={item.id} className={`hover:bg-slate-800/30 transition-colors ${index % 2 === 0 ? 'bg-slate-800/10' : ''}`}>
//                         <td className="px-6 py-4">
//                           <div className="flex items-center">
//                             <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-center mr-3 text-sm font-bold text-white">
//                               {item.asset.slice(0, 2)}
//                             </div>
//                             <div>
//                               <div className="font-semibold text-white text-lg">{item.asset}</div>
//                               <div className="text-sm text-slate-400">{item.assetName}</div>
//                             </div>
//                           </div>
//                         </td>
//                         <td className="px-6 py-4">
//                           <div className="text-white font-mono font-medium">
//                             {item.amount} shares
//                           </div>
//                         </td>
//                         <td className="px-6 py-4">
//                           <div className="text-white font-mono">
//                             ${item.averagePrice.toLocaleString(undefined, { 
//                               minimumFractionDigits: 2, 
//                               maximumFractionDigits: 2 
//                             })}
//                           </div>
//                         </td>
//                         <td className="px-6 py-4">
//                           <div className="text-white font-mono font-medium">
//                             ${(item.currentPrice || 0).toLocaleString(undefined, { 
//                               minimumFractionDigits: 2, 
//                               maximumFractionDigits: 2 
//                             })}
//                           </div>
//                         </td>
//                         <td className="px-6 py-4">
//                           <div className="text-white font-mono font-bold text-lg">
//                             ${item.totalValue.toLocaleString(undefined, { 
//                               minimumFractionDigits: 2, 
//                               maximumFractionDigits: 2 
//                             })}
//                           </div>
//                         </td>
//                         <td className="px-6 py-4">
//                           <div className={`font-mono font-medium ${
//                             profitLoss.amount >= 0 ? 'text-green-400' : 'text-red-400'
//                           }`}>
//                             <div className="flex items-center">
//                               {profitLoss.amount >= 0 ? (
//                                 <FiTrendingUp className="w-4 h-4 mr-1" />
//                               ) : (
//                                 <FiTrendingDown className="w-4 h-4 mr-1" />
//                               )}
//                               <div>
//                                 <div>${Math.abs(profitLoss.amount).toLocaleString(undefined, { 
//                                   minimumFractionDigits: 2, 
//                                   maximumFractionDigits: 2 
//                                 })}</div>
//                                 <div className="text-xs">
//                                   ({profitLoss.percentage >= 0 ? '+' : ''}{profitLoss.percentage.toFixed(2)}%)
//                                 </div>
//                               </div>
//                             </div>
//                           </div>
//                         </td>
//                         <td className="px-6 py-4">
//                           <div className={`font-mono text-sm ${
//                             (item.priceChange24h || 0) >= 0 ? 'text-green-400' : 'text-red-400'
//                           }`}>
//                             {(item.priceChange24h || 0) >= 0 ? '+' : ''}
//                             {(item.priceChange24h || 0).toFixed(2)}%
//                           </div>
//                         </td>
//                       </tr>
//                     );
//                   })
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* Portfolio Allocation Chart Placeholder */}
//         {portfolio.length > 0 && (
//           <div className="mt-8 bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
//             <h3 className="text-xl font-semibold mb-4 flex items-center">
//               <FiPieChart className="mr-2 text-blue-400" />
//               Portfolio Allocation
//             </h3>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//               {portfolio.map((item) => {
//                 const percentage = (item.totalValue / totalValue) * 100;
//                 return (
//                   <div key={item.id} className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/30">
//                     <div className="flex items-center justify-between mb-2">
//                       <span className="font-medium text-white">{item.asset}</span>
//                       <span className="text-slate-400 text-sm">{percentage.toFixed(1)}%</span>
//                     </div>
//                     <div className="w-full bg-slate-700 rounded-full h-2">
//                       <div 
//                         className="bg-gradient-to-r from-blue-400 to-purple-500 h-2 rounded-full transition-all duration-300"
//                         style={{ width: `${percentage}%` }}
//                       ></div>
//                     </div>
//                     <div className="mt-2 text-sm text-slate-400">
//                       ${item.totalValue.toLocaleString(undefined, { 
//                         minimumFractionDigits: 2, 
//                         maximumFractionDigits: 2 
//                       })}
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default PortfolioPage;



"use client"

import { useState, useEffect } from 'react';
import { FiTrendingUp, FiTrendingDown, FiDollarSign, FiPieChart, FiActivity, FiPlus } from 'react-icons/fi';

type PortfolioItem = {
  id: string;
  asset: string;
  assetName: string;
  amount: number;
  averagePrice: number;
  totalValue: number;
  addedAt: Date;
  currentPrice?: number;
  priceChange24h?: number;
};

type StockAsset = {
  symbol: string;
  name: string;
  price: number;
  changesPercentage: number;
};

const PortfolioPage = () => {
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [stockData, setStockData] = useState<StockAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalValue, setTotalValue] = useState(0);
  const [totalChange24h, setTotalChange24h] = useState(0);

  // Load portfolio from localStorage
  useEffect(() => {
    const loadPortfolio = () => {
      try {
        const savedPortfolio = localStorage.getItem('stock_portfolio');
        if (savedPortfolio) {
          const parsedPortfolio = JSON.parse(savedPortfolio).map((item: any) => ({
            ...item,
            addedAt: new Date(item.addedAt)
          }));
          setPortfolio(parsedPortfolio);
        }
      } catch (error) {
        console.error('Error loading portfolio:', error);
      }
    };

    loadPortfolio();
  }, []);

  // Fetch current stock prices from FMP API
  useEffect(() => {
    const fetchStockData = async () => {
      if (portfolio.length === 0) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const apiKey = process.env.NEXT_PUBLIC_FMP_API_KEY || 'demo';
        const symbols = portfolio.map(item => item.asset).join(',');
        
        const response = await fetch(
          `https://financialmodelingprep.com/api/v3/quote/${symbols}?apikey=${apiKey}`,
          { next: { revalidate: 300 } } // Cache for 5 minutes
        );
        
        if (response.ok) {
          const data = await response.json();
          setStockData(data);
          
          // Update portfolio with current prices
          const updatedPortfolio = portfolio.map(item => {
            const stockInfo = data.find((stock: StockAsset) => 
              stock.symbol.toUpperCase() === item.asset.toUpperCase()
            );
            
            if (stockInfo) {
              return {
                ...item,
                currentPrice: stockInfo.price,
                priceChange24h: stockInfo.changesPercentage,
                totalValue: item.amount * stockInfo.price
              };
            }
            return item;
          });
          
          setPortfolio(updatedPortfolio);
          
          // Calculate total values
          const total = updatedPortfolio.reduce((sum, item) => sum + item.totalValue, 0);
          const totalInvested = updatedPortfolio.reduce((sum, item) => sum + (item.amount * item.averagePrice), 0);
          const change24h = ((total - totalInvested) / totalInvested) * 100;
          
          setTotalValue(total);
          setTotalChange24h(change24h);
        }
      } catch (error) {
        console.error('Error fetching stock data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStockData();
  }, [portfolio.length]);

  const getProfitLoss = (item: PortfolioItem) => {
    if (!item.currentPrice) return { amount: 0, percentage: 0 };
    
    const currentValue = item.amount * item.currentPrice;
    const investedValue = item.amount * item.averagePrice;
    const profitLoss = currentValue - investedValue;
    const percentage = ((profitLoss / investedValue) * 100);
    
    return { amount: profitLoss, percentage };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading portfolio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br py-9 from-slate-900 via-blue-900 to-slate-900 text-white">
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        {/* Header Section */}
        <div className="mb-6 md:mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 md:mb-6 gap-4">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-600/20 rounded-xl border border-blue-500/30 ">
                <FiPieChart className="size-6 text-blue-400" />
              </div>
              <div>
                <h1 className="text-xl md:text-3xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                  Your Stock Portfolio
                </h1>
                <p className="text-slate-400 text-sm md:text-base">Track your stock investments</p>
              </div>
            </div>
           
          </div>

          {/* Portfolio Summary Card */}
          <div className="bg-gradient-to-r from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl p-6 mb-6 md:mb-8 border border-slate-700/50 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-slate-400 text-base md:text-lg mb-2">Total Portfolio Value</p>
                <p className="text-2xl md:text-4xl font-bold text-white mb-2">
                  ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                <div className={`flex items-center text-base md:text-lg ${
                  totalChange24h >= 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {totalChange24h >= 0 ? (
                    <FiTrendingUp className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                  ) : (
                    <FiTrendingDown className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                  )}
                  {totalChange24h >= 0 ? '+' : ''}
                  {totalChange24h.toFixed(2)}%
                </div>
              </div>
              <div className="p-3 md:p-4 bg-blue-600/20 rounded-xl">
                <FiDollarSign className="w-6 h-6 md:w-8 md:h-8 text-blue-400" />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              <div className="bg-slate-800/30 rounded-xl p-3 md:p-4 border border-slate-700/30">
                <p className="text-slate-400 text-xs md:text-sm mb-1">Total Stocks</p>
                <p className="text-lg md:text-xl font-bold text-white">{portfolio.length}</p>
              </div>
              <div className="bg-slate-800/30 rounded-xl p-3 md:p-4 border border-slate-700/30">
                <p className="text-slate-400 text-xs md:text-sm mb-1">Total Invested</p>
                <p className="text-lg md:text-xl font-bold text-white">
                  ${portfolio.reduce((sum, item) => sum + (item.amount * item.averagePrice), 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
              <div className="bg-slate-800/30 rounded-xl p-3 md:p-4 border border-slate-700/30">
                <p className="text-slate-400 text-xs md:text-sm mb-1">Best Performer</p>
                <p className="text-lg md:text-xl font-bold text-green-400">
                  {portfolio.length > 0 ? 
                    portfolio.reduce((best, item) => {
                      const currentPL = getProfitLoss(item);
                      const bestPL = getProfitLoss(best);
                      return currentPL.percentage > bestPL.percentage ? item : best;
                    }).asset : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Portfolio Assets Section */}
        <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/50 overflow-hidden shadow-2xl">
          <div className="px-4 md:px-6 py-4 border-b border-slate-700/50 bg-slate-800/50">
            <h2 className="text-lg md:text-xl font-semibold flex items-center">
              <FiActivity className="mr-2 text-blue-400" />
              Your Stocks
            </h2>
          </div>
          
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-800/30 border-b border-slate-700/50">
                  <th className="text-left px-6 py-4 text-slate-300 font-medium text-sm uppercase tracking-wider">Stock</th>
                  <th className="text-left px-6 py-4 text-slate-300 font-medium text-sm uppercase tracking-wider">Shares</th>
                  <th className="text-left px-6 py-4 text-slate-300 font-medium text-sm uppercase tracking-wider">Avg. Price</th>
                  <th className="text-left px-6 py-4 text-slate-300 font-medium text-sm uppercase tracking-wider">Current Price</th>
                  <th className="text-left px-6 py-4 text-slate-300 font-medium text-sm uppercase tracking-wider">Market Value</th>
                  <th className="text-left px-6 py-4 text-slate-300 font-medium text-sm uppercase tracking-wider">P&L</th>
                  <th className="text-left px-6 py-4 text-slate-300 font-medium text-sm uppercase tracking-wider">24h Change</th>
                </tr>
              </thead>
              <tbody>
                {portfolio.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center text-slate-400">
                        <FiPieChart className="w-12 h-12 mb-4 opacity-50" />
                        <p className="text-lg font-medium">No stocks in portfolio</p>
                        <p className="text-sm">Complete some buy orders to build your portfolio</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  portfolio.map((item, index) => {
                    const profitLoss = getProfitLoss(item);
                    return (
                      <tr key={item.id} className={`hover:bg-slate-800/30 transition-colors ${index % 2 === 0 ? 'bg-slate-800/10' : ''}`}>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-center mr-3 text-sm font-bold text-white">
                              {item.asset.slice(0, 2)}
                            </div>
                            <div>
                              <div className="font-semibold text-white text-lg">{item.asset}</div>
                              <div className="text-sm text-slate-400">{item.assetName}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-white font-mono font-medium">
                            {item.amount} shares
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-white font-mono">
                            ${item.averagePrice.toLocaleString(undefined, { 
                              minimumFractionDigits: 2, 
                              maximumFractionDigits: 2 
                            })}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-white font-mono font-medium">
                            ${(item.currentPrice || 0).toLocaleString(undefined, { 
                              minimumFractionDigits: 2, 
                              maximumFractionDigits: 2 
                            })}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-white font-mono font-bold text-lg">
                            ${item.totalValue.toLocaleString(undefined, { 
                              minimumFractionDigits: 2, 
                              maximumFractionDigits: 2 
                            })}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className={`font-mono font-medium ${
                            profitLoss.amount >= 0 ? 'text-green-400' : 'text-red-400'
                          }`}>
                            <div className="flex items-center">
                              {profitLoss.amount >= 0 ? (
                                <FiTrendingUp className="w-4 h-4 mr-1" />
                              ) : (
                                <FiTrendingDown className="w-4 h-4 mr-1" />
                              )}
                              <div>
                                <div>${Math.abs(profitLoss.amount).toLocaleString(undefined, { 
                                  minimumFractionDigits: 2, 
                                  maximumFractionDigits: 2 
                                })}</div>
                                <div className="text-xs">
                                  ({profitLoss.percentage >= 0 ? '+' : ''}{profitLoss.percentage.toFixed(2)}%)
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className={`font-mono text-sm ${
                            (item.priceChange24h || 0) >= 0 ? 'text-green-400' : 'text-red-400'
                          }`}>
                            {(item.priceChange24h || 0) >= 0 ? '+' : ''}
                            {(item.priceChange24h || 0).toFixed(2)}%
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden">
            {portfolio.length === 0 ? (
              <div className="px-4 py-12 text-center">
                <div className="flex flex-col items-center text-slate-400">
                  <FiPieChart className="w-12 h-12 mb-4 opacity-50" />
                  <p className="text-lg font-medium">No stocks in portfolio</p>
                  <p className="text-sm">Complete some buy orders to build your portfolio</p>
                </div>
              </div>
            ) : (
              <div className="divide-y divide-slate-700/50">
                {portfolio.map((item) => {
                  const profitLoss = getProfitLoss(item);
                  return (
                    <div key={item.id} className="p-4 hover:bg-slate-800/30 transition-colors">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-center mr-3 text-sm font-bold text-white">
                            {item.asset.slice(0, 2)}
                          </div>
                          <div>
                            <div className="font-semibold text-white">{item.asset}</div>
                            <div className="text-xs text-slate-400">{item.assetName}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-white">
                            ${item.totalValue.toLocaleString(undefined, { 
                              minimumFractionDigits: 2, 
                              maximumFractionDigits: 2 
                            })}
                          </div>
                          <div className={`text-xs ${
                            (item.priceChange24h || 0) >= 0 ? 'text-green-400' : 'text-red-400'
                          }`}>
                            {(item.priceChange24h || 0) >= 0 ? '+' : ''}
                            {(item.priceChange24h || 0).toFixed(2)}%
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-3 grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-slate-400 text-xs">Shares</p>
                          <p className="text-white font-medium">{item.amount}</p>
                        </div>
                        <div>
                          <p className="text-slate-400 text-xs">Avg. Price</p>
                          <p className="text-white font-medium">
                            ${item.averagePrice.toLocaleString(undefined, { 
                              minimumFractionDigits: 2, 
                              maximumFractionDigits: 2 
                            })}
                          </p>
                        </div>
                        <div>
                          <p className="text-slate-400 text-xs">Current Price</p>
                          <p className="text-white font-medium">
                            ${(item.currentPrice || 0).toLocaleString(undefined, { 
                              minimumFractionDigits: 2, 
                              maximumFractionDigits: 2 
                            })}
                          </p>
                        </div>
                        <div>
                          <p className="text-slate-400 text-xs">Profit/Loss</p>
                          <div className={`font-medium ${
                            profitLoss.amount >= 0 ? 'text-green-400' : 'text-red-400'
                          }`}>
                            <div className="flex items-center">
                              {profitLoss.amount >= 0 ? (
                                <FiTrendingUp className="w-3 h-3 mr-1" />
                              ) : (
                                <FiTrendingDown className="w-3 h-3 mr-1" />
                              )}
                              <span>
                                ${Math.abs(profitLoss.amount).toLocaleString(undefined, { 
                                  minimumFractionDigits: 2, 
                                  maximumFractionDigits: 2 
                                })}
                              </span>
                            </div>
                            <div className="text-xs">
                              ({profitLoss.percentage >= 0 ? '+' : ''}{profitLoss.percentage.toFixed(2)}%)
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Portfolio Allocation Chart Placeholder */}
        {portfolio.length > 0 && (
          <div className="mt-6 md:mt-8 bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-4 md:p-6">
            <h3 className="text-lg md:text-xl font-semibold mb-4 flex items-center">
              <FiPieChart className="mr-2 text-blue-400" />
              Portfolio Allocation
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
              {portfolio.map((item) => {
                const percentage = (item.totalValue / totalValue) * 100;
                return (
                  <div key={item.id} className="bg-slate-800/50 rounded-xl p-3 md:p-4 border border-slate-700/30">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-white text-sm md:text-base">{item.asset}</span>
                      <span className="text-slate-400 text-xs md:text-sm">{percentage.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-400 to-purple-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <div className="mt-2 text-xs md:text-sm text-slate-400">
                      ${item.totalValue.toLocaleString(undefined, { 
                        minimumFractionDigits: 2, 
                        maximumFractionDigits: 2 
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PortfolioPage;