


// 'use client'
// import React, { useState, useEffect } from 'react';
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
// import { createClient } from '@/app/utils/supabase/clients';

// interface PriceData {
//   timestamp: string;
//   price: number;
//   volume: number;
// }

// interface TimeRange {
//   label: string;
//   days: string;
//   interval: string;
// }

// interface Coin {
//   id: string;
//   name: string;
//   symbol: string;
//   image: string;
//   current_price: number;
//   price_change_percentage_24h: number;
//   market_cap: number;
//   total_volume: number;
// }

// interface CoinStats {
//   currentPrice: number;
//   priceChange24h: number;
//   priceChangePercent24h: number;
//   volume24h: number;
//   marketCap: number;
//   high24h: number;
//   low24h: number;
// }

// const CryptoPriceChart: React.FC = () => {
//   const supabase = createClient();
//   const [priceData, setPriceData] = useState<PriceData[]>([]);
//   const [coins, setCoins] = useState<Coin[]>([]);
//   const [coinStats, setCoinStats] = useState<CoinStats | null>(null);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [coinsLoading, setCoinsLoading] = useState<boolean>(true);
//   const [selectedCoin, setSelectedCoin] = useState<string>('bitcoin');
//   const [selectedRange, setSelectedRange] = useState<TimeRange>({
//     label: '7D',
//     days: '7',
//     interval: 'hourly'
//   });
//   const [error, setError] = useState<string>('');

//   const timeRanges: TimeRange[] = [
//     { label: '1D', days: '1', interval: 'hourly' },
//     { label: '7D', days: '7', interval: 'hourly' },
//     { label: '30D', days: '30', interval: 'daily' },
//     { label: '90D', days: '90', interval: 'daily' },
//     { label: '1Y', days: '365', interval: 'daily' }
//   ];

//   // Fetch available coins from Supabase
//   const fetchCoins = async () => {
//     setCoinsLoading(true);
//     try {
//       const { data: stocks, error } = await supabase
//         .from('posts')
//         .select('*')
//         .order('created_at', { ascending: false });

//       if (error) throw error;

//       // Transform Supabase data to match our Coin interface
//       const formattedCoins: Coin[] = stocks.map((stock: any) => ({
//         id: stock.symbol.toLowerCase(),
//         name: stock.name,
//         symbol: stock.symbol,
//         image: stock.image_url || `https://financialmodelingprep.com/image-stock/${stock.symbol}.png`,
//         current_price: stock.current_price,
//         price_change_percentage_24h: parseFloat(stock.percentage_change),
//         market_cap: stock.current_price * 1000000, // Approximate market cap
//         total_volume: stock.current_price * 10000  // Approximate volume
//       }));

//       setCoins(formattedCoins);
      
//       // Set first coin as default if no selection
//       if (formattedCoins.length > 0 && !selectedCoin) {
//         setSelectedCoin(formattedCoins[0].id);
//       }
//     } catch (err) {
//       console.error('Error fetching coins:', err);
//       setError('Failed to load available cryptocurrencies');
//     } finally {
//       setCoinsLoading(false);
//     }
//   };

//   // Fetch coin statistics from Supabase
//   const fetchCoinStats = async (coinId: string) => {
//     try {
//       const { data: stock, error } = await supabase
//         .from('posts')
//         .select('*')
//         .eq('symbol', coinId.toUpperCase())
//         .single();

//       if (error) throw error;
//       if (!stock) throw new Error('No data returned for this coin');

//       // Calculate price change based on percentage
//       const priceChange = (stock.current_price * parseFloat(stock.percentage_change)) / 100;
      
//       setCoinStats({
//         currentPrice: stock.current_price,
//         priceChange24h: priceChange,
//         priceChangePercent24h: parseFloat(stock.percentage_change),
//         volume24h: stock.current_price * 10000, // Approximate volume
//         marketCap: stock.current_price * 1000000, // Approximate market cap
//         high24h: stock.current_price * 1.05, // Approximate high
//         low24h: stock.current_price * 0.95   // Approximate low
//       });
//     } catch (err) {
//       console.error('Error fetching coin stats:', err);
//       // Fallback to coin list data if available
//       const coinFromList = coins.find(coin => coin.id === coinId);
//       if (coinFromList) {
//         setCoinStats({
//           currentPrice: coinFromList.current_price,
//           priceChange24h: (coinFromList.current_price * coinFromList.price_change_percentage_24h) / 100,
//           priceChangePercent24h: coinFromList.price_change_percentage_24h,
//           volume24h: coinFromList.total_volume,
//           marketCap: coinFromList.market_cap,
//           high24h: coinFromList.current_price * 1.05, // Approximate
//           low24h: coinFromList.current_price * 0.95   // Approximate
//         });
//       }
//     }
//   };

//   // Generate mock historical data based on current price and volatility
//   const generateMockHistoricalData = (currentPrice: number, volatility: number, days: number) => {
//     const data: PriceData[] = [];
//     const now = new Date();
//     const priceHistory = [currentPrice];
    
//     // Generate price path with some randomness
//     for (let i = 1; i < days * 24; i++) {
//       const previousPrice = priceHistory[i - 1];
//       const changePercent = (Math.random() * 2 - 1) * volatility;
//       const newPrice = previousPrice * (1 + changePercent / 100);
//       priceHistory.push(newPrice);
//     }
    
//     // Create data points
//     for (let i = 0; i < days * 24; i++) {
//       const date = new Date(now);
//       date.setHours(date.getHours() - i);
      
//       data.push({
//         timestamp: date.toLocaleDateString('en-US', {
//           month: 'short',
//           day: 'numeric',
//           ...(days === 1 ? { hour: '2-digit' } : {})
//         }),
//         price: priceHistory[i],
//         volume: Math.random() * 10000 + 5000
//       });
//     }
    
//     return data.reverse();
//   };

//   // Fetch historical price data (mock for now - you can replace with real data from Supabase if available)
//   const fetchPriceData = async (coinId: string, days: string) => {
//     setLoading(true);
//     setError('');
    
//     try {
//       // Get current price for the coin
//       const { data: stock, error } = await supabase
//         .from('posts')
//         .select('current_price, percentage_change')
//         .eq('symbol', coinId.toUpperCase())
//         .single();

//       if (error) throw error;
//       if (!stock) throw new Error('No data returned for this coin');

//       // Generate mock historical data based on current price
//       const volatility = Math.abs(parseFloat(stock.percentage_change)) || 5; // Use percentage change as volatility indicator
//       const mockData = generateMockHistoricalData(stock.current_price, volatility, parseInt(days));
      
//       setPriceData(mockData);
//     } catch (err) {
//       console.error('Error fetching price data:', err);
//       setError('Failed to load price chart data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Initialize data on component mount
//   useEffect(() => {
//     fetchCoins();
//   }, []);

//   // Fetch chart data and stats when coin or range changes
//   useEffect(() => {
//     if (selectedCoin) {
//       fetchPriceData(selectedCoin, selectedRange.days);
//       fetchCoinStats(selectedCoin);
//     }
//   }, [selectedCoin, selectedRange]);

//   const formatPrice = (price: number): string => {
//     if (price < 0.001) return `$${price.toFixed(8)}`;
//     if (price < 1) return `$${price.toFixed(6)}`;
//     if (price < 100) return `$${price}`;
//     return `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
//   };

//   const formatLargeNumber = (num: number): string => {
//     if (num > 1e12) return `$${(num / 1e12).toFixed(2)}T`;
//     if (num > 1e9) return `$${(num / 1e9).toFixed(2)}B`;
//     if (num > 1e6) return `$${(num / 1e6).toFixed(2)}M`;
//     if (num > 1e3) return `$${(num / 1e3).toFixed(2)}K`;
//     return `$${num.toFixed(2)}`;
//   };

//   const selectedCoinData = coins.find(coin => coin.id === selectedCoin);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="text-center mb-8">
//           <h1 className="text-4xl font-bold text-white mb-2">
//             Crypto Price Charts
//           </h1>
//           <p className="text-gray-300">Track cryptocurrency prices with your portfolio data</p>
//         </div>

//         {/* Main Chart Container */}
//         <div className="bg-slate-800/50 backdrop-blur-lg rounded-2xl border border-slate-700/50 shadow-2xl p-6 mb-6">
//           {/* Controls */}
//           <div className="flex flex-col lg:flex-row gap-4 mb-6">
//             {/* Coin Selector */}
//             <div className="flex-1">
//               <label className="block text-sm font-medium text-gray-300 mb-2">
//                 Select Cryptocurrency
//               </label>
//               {coinsLoading ? (
//                 <div className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-gray-400">
//                   Loading cryptocurrencies...
//                 </div>
//               ) : (
//                 <select
//                   value={selectedCoin}
//                   onChange={(e) => setSelectedCoin(e.target.value)}
//                   className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
//                 >
//                   {coins.map((coin) => (
//                     <option key={coin.id} value={coin.id}>
//                       {coin.name} ({coin.symbol.toUpperCase()}) - {formatPrice(coin.current_price)}
//                     </option>
//                   ))}
//                 </select>
//               )}
//             </div>

//             {/* Time Range Selector */}
//             <div className="flex-1">
//               <label className="block text-sm font-medium text-gray-300 mb-2">
//                 Time Range
//               </label>
//               <div className="flex bg-slate-700 rounded-lg p-1">
//                 {timeRanges.map((range) => (
//                   <button
//                     key={range.label}
//                     onClick={() => setSelectedRange(range)}
//                     className={`flex-1 px-3 py-1 rounded-md text-sm font-medium transition-colors ${
//                       selectedRange.label === range.label
//                         ? 'bg-purple-600 text-white'
//                         : 'text-gray-300 hover:text-white hover:bg-slate-600'
//                     }`}
//                   >
//                     {range.label}
//                   </button>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* Selected Coin Header */}
//           {selectedCoinData && (
//             <div className="flex items-center gap-4 mb-6 p-4 bg-slate-700/30 rounded-lg">
//               <img 
//                 src={selectedCoinData.image} 
//                 alt={selectedCoinData.name}
//                 className="w-12 h-12 rounded-full"
//               />
//               <div>
//                 <h3 className="text-2xl font-bold text-white">{selectedCoinData.name}</h3>
//                 <p className="text-gray-400">{selectedCoinData.symbol.toUpperCase()}</p>
//               </div>
//             </div>
//           )}

//           {/* Price Stats Grid */}
//           {coinStats && (
//             <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
//               <div className="bg-slate-700/50 rounded-lg p-4">
//                 <p className="text-gray-400 text-sm">Current Price</p>
//                 <p className="text-2xl font-bold text-white">{formatPrice(coinStats.currentPrice)}</p>
//               </div>
//               <div className="bg-slate-700/50 rounded-lg p-4">
//                 <p className="text-gray-400 text-sm">24h Change</p>
//                 <p className={`text-xl font-bold ${coinStats.priceChange24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
//                   {coinStats.priceChange24h >= 0 ? '+' : ''}{formatPrice(Math.abs(coinStats.priceChange24h))}
//                 </p>
//               </div>
//               <div className="bg-slate-700/50 rounded-lg p-4">
//                 <p className="text-gray-400 text-sm">24h Change %</p>
//                 <p className={`text-xl font-bold ${coinStats.priceChangePercent24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
//                   {coinStats.priceChangePercent24h >= 0 ? '+' : ''}{coinStats.priceChangePercent24h.toFixed(2)}%
//                 </p>
//               </div>
//               <div className="bg-slate-700/50 rounded-lg p-4">
//                 <p className="text-gray-400 text-sm">24h Volume</p>
//                 <p className="text-xl font-bold text-white">{formatLargeNumber(coinStats.volume24h)}</p>
//               </div>
//             </div>
//           )}

//           {/* Additional Stats */}
//           {coinStats && (
//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
//               <div className="bg-slate-700/30 rounded-lg p-4">
//                 <p className="text-gray-400 text-sm">Market Cap</p>
//                 <p className="text-lg font-bold text-white">{formatLargeNumber(coinStats.marketCap)}</p>
//               </div>
//               <div className="bg-slate-700/30 rounded-lg p-4">
//                 <p className="text-gray-400 text-sm">24h High</p>
//                 <p className="text-lg font-bold text-green-400">{formatPrice(coinStats.high24h)}</p>
//               </div>
//               <div className="bg-slate-700/30 rounded-lg p-4">
//                 <p className="text-gray-400 text-sm">24h Low</p>
//                 <p className="text-lg font-bold text-red-400">{formatPrice(coinStats.low24h)}</p>
//               </div>
//             </div>
//           )}

//           {/* Chart */}
//           <div className="bg-slate-900/50 rounded-xl p-4">
//             {error && (
//               <div className="bg-red-900/20 border border-red-600 rounded-lg p-3 mb-4">
//                 <p className="text-red-400 text-sm">{error}</p>
//               </div>
//             )}
            
//             {loading ? (
//               <div className="flex items-center justify-center h-96">
//                 <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
//                 <p className="ml-4 text-gray-400">Loading chart data...</p>
//               </div>
//             ) : priceData.length > 0 ? (
//               <ResponsiveContainer width="100%" height={400}>
//                 <LineChart data={priceData}>
//                   <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
//                   <XAxis 
//                     dataKey="timestamp" 
//                     stroke="#9CA3AF"
//                     fontSize={12}
//                     angle={-45}
//                     textAnchor="end"
//                     height={60}
//                   />
//                   <YAxis 
//                     stroke="#9CA3AF"
//                     fontSize={12}
//                     tickFormatter={formatPrice}
//                   />
//                   <Tooltip
//                     contentStyle={{
//                       backgroundColor: '#1F2937',
//                       border: '1px solid #374151',
//                       borderRadius: '8px',
//                       color: '#F3F4F6'
//                     }}
//                     formatter={(value: number) => [formatPrice(value), 'Price']}
//                     labelFormatter={(label) => `Date: ${label}`}
//                     labelStyle={{ color: '#9CA3AF' }}
//                   />
//                   <Line
//                     type="monotone"
//                     dataKey="price"
//                     stroke="#8B5CF6"
//                     strokeWidth={2}
//                     dot={false}
//                     activeDot={{ r: 4, fill: '#8B5CF6' }}
//                   />
//                 </LineChart>
//               </ResponsiveContainer>
//             ) : (
//               <div className="flex items-center justify-center h-96">
//                 <p className="text-gray-400">No chart data available</p>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CryptoPriceChart;




'use client'
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { createClient } from '@/app/utils/supabase/clients';

interface PriceData {
  timestamp: string;
  price: number;
  volume: number;
}

interface TimeRange {
  label: string;
  days: string;
  interval: string;
}

interface Coin {
  id: string;
  name: string;
  symbol: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  total_volume: number;
}

interface CoinStats {
  currentPrice: number;
  priceChange24h: number;
  priceChangePercent24h: number;
  volume24h: number;
  marketCap: number;
  high24h: number;
  low24h: number;
}

const CryptoPriceChart: React.FC = () => {
  const supabase = createClient();
  const [priceData, setPriceData] = useState<PriceData[]>([]);
  const [coins, setCoins] = useState<Coin[]>([]);
  const [coinStats, setCoinStats] = useState<CoinStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [coinsLoading, setCoinsLoading] = useState<boolean>(true);
  const [selectedCoin, setSelectedCoin] = useState<string>('');
  const [selectedRange, setSelectedRange] = useState<TimeRange>({
    label: '7D',
    days: '7',
    interval: 'hourly'
  });
  const [error, setError] = useState<string>('');
  const [initialLoad, setInitialLoad] = useState<boolean>(true);

  const timeRanges: TimeRange[] = [
    { label: '1D', days: '1', interval: 'hourly' },
    { label: '7D', days: '7', interval: 'hourly' },
    { label: '30D', days: '30', interval: 'daily' },
    { label: '90D', days: '90', interval: 'daily' },
    { label: '1Y', days: '365', interval: 'daily' }
  ];

  // Fetch available coins from Supabase
  const fetchCoins = async () => {
    setCoinsLoading(true);
    try {
      const { data: stocks, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform Supabase data to match our Coin interface
      const formattedCoins: Coin[] = stocks.map((stock: any) => ({
        id: stock.symbol.toLowerCase(),
        name: stock.name,
        symbol: stock.symbol,
        image: stock.image_url || `https://financialmodelingprep.com/image-stock/${stock.symbol}.png`,
        current_price: stock.current_price,
        price_change_percentage_24h: parseFloat(stock.percentage_change),
        market_cap: stock.current_price * 1000000,
        total_volume: stock.current_price * 10000
      }));

      setCoins(formattedCoins);
      
      // Automatically select first coin if available
      if (formattedCoins.length > 0) {
        setSelectedCoin(formattedCoins[0].id);
      }
    } catch (err) {
      console.error('Error fetching coins:', err);
      setError('Failed to load available cryptocurrencies');
    } finally {
      setCoinsLoading(false);
    }
  };

  // Fetch coin statistics from Supabase
  const fetchCoinStats = async (coinId: string) => {
    try {
      const { data: stock, error } = await supabase
        .from('posts')
        .select('*')
        .eq('symbol', coinId.toUpperCase())
        .single();

      if (error) throw error;
      if (!stock) throw new Error('No data returned for this coin');

      // Calculate price change based on percentage
      const priceChange = (stock.current_price * parseFloat(stock.percentage_change)) / 100;
      
      setCoinStats({
        currentPrice: stock.current_price,
        priceChange24h: priceChange,
        priceChangePercent24h: parseFloat(stock.percentage_change),
        volume24h: stock.current_price * 10000,
        marketCap: stock.current_price * 1000000,
        high24h: stock.current_price * 1.05,
        low24h: stock.current_price * 0.95
      });
    } catch (err) {
      console.error('Error fetching coin stats:', err);
      // Fallback to coin list data if available
      const coinFromList = coins.find(coin => coin.id === coinId);
      if (coinFromList) {
        setCoinStats({
          currentPrice: coinFromList.current_price,
          priceChange24h: (coinFromList.current_price * coinFromList.price_change_percentage_24h) / 100,
          priceChangePercent24h: coinFromList.price_change_percentage_24h,
          volume24h: coinFromList.total_volume,
          marketCap: coinFromList.market_cap,
          high24h: coinFromList.current_price * 1.05,
          low24h: coinFromList.current_price * 0.95
        });
      }
    }
  };

  // Generate mock historical data based on current price and volatility
  const generateMockHistoricalData = (currentPrice: number, volatility: number, days: number) => {
    const data: PriceData[] = [];
    const now = new Date();
    const priceHistory = [currentPrice];
    
    // Generate price path with some randomness
    for (let i = 1; i < days * 24; i++) {
      const previousPrice = priceHistory[i - 1];
      const changePercent = (Math.random() * 2 - 1) * volatility;
      const newPrice = previousPrice * (1 + changePercent / 100);
      priceHistory.push(newPrice);
    }
    
    // Create data points
    for (let i = 0; i < days * 24; i++) {
      const date = new Date(now);
      date.setHours(date.getHours() - i);
      
      data.push({
        timestamp: date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          ...(days === 1 ? { hour: '2-digit' } : {})
        }),
        price: priceHistory[i],
        volume: Math.random() * 10000 + 5000
      });
    }
    
    return data.reverse();
  };

  // Fetch historical price data
  const fetchPriceData = async (coinId: string, days: string) => {
    setLoading(true);
    setError('');
    
    try {
      if (!coinId) {
        throw new Error('No coin selected');
      }

      // Get current price for the coin
      const { data: stock, error } = await supabase
        .from('posts')
        .select('current_price, percentage_change')
        .eq('symbol', coinId.toUpperCase())
        .single();

      if (error) throw error;
      if (!stock) throw new Error('No data returned for this coin');

      // Generate mock historical data based on current price
      const volatility = Math.abs(parseFloat(stock.percentage_change)) || 5;
      const mockData = generateMockHistoricalData(stock.current_price, volatility, parseInt(days));
      
      setPriceData(mockData);
      setInitialLoad(false);
    } catch (err) {
      console.error('Error fetching price data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load price chart data');
    } finally {
      setLoading(false);
    }
  };

  // Initialize data on component mount
  useEffect(() => {
    fetchCoins();
  }, []);

  // Fetch chart data and stats when coin or range changes
  useEffect(() => {
    if (selectedCoin) {
      fetchPriceData(selectedCoin, selectedRange.days);
      fetchCoinStats(selectedCoin);
    }
  }, [selectedCoin, selectedRange]);

  const formatPrice = (price: number): string => {
    if (price < 0.001) return `$${price.toFixed(8)}`;
    if (price < 1) return `$${price.toFixed(6)}`;
    if (price < 100) return `$${price}`;
    return `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatLargeNumber = (num: number): string => {
    if (num > 1e12) return `$${(num / 1e12).toFixed(2)}T`;
    if (num > 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num > 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    if (num > 1e3) return `$${(num / 1e3).toFixed(2)}K`;
    return `$${num.toFixed(2)}`;
  };

  const selectedCoinData = coins.find(coin => coin.id === selectedCoin);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Crypto Price Charts
          </h1>
          <p className="text-gray-300">Track cryptocurrency prices with your portfolio data</p>
        </div>

        {/* Main Chart Container */}
        <div className="bg-slate-800/50 backdrop-blur-lg rounded-2xl border border-slate-700/50 shadow-2xl p-6 mb-6">
          {/* Controls */}
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            {/* Coin Selector */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Select Cryptocurrency
              </label>
              {coinsLoading ? (
                <div className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-gray-400">
                  Loading cryptocurrencies...
                </div>
              ) : (
                <select
                  value={selectedCoin}
                  onChange={(e) => setSelectedCoin(e.target.value)}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  {coins.map((coin) => (
                    <option key={coin.id} value={coin.id}>
                      {coin.name} ({coin.symbol.toUpperCase()}) - {formatPrice(coin.current_price)}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Time Range Selector */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Time Range
              </label>
              <div className="flex bg-slate-700 rounded-lg p-1">
                {timeRanges.map((range) => (
                  <button
                    key={range.label}
                    onClick={() => setSelectedRange(range)}
                    className={`flex-1 px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                      selectedRange.label === range.label
                        ? 'bg-purple-600 text-white'
                        : 'text-gray-300 hover:text-white hover:bg-slate-600'
                    }`}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Selected Coin Header */}
          {selectedCoinData && (
            <div className="flex items-center gap-4 mb-6 p-4 bg-slate-700/30 rounded-lg">
              <img 
                src={selectedCoinData.image} 
                alt={selectedCoinData.name}
                className="w-12 h-12 rounded-full"
              />
              <div>
                <h3 className="text-2xl font-bold text-white">{selectedCoinData.name}</h3>
                <p className="text-gray-400">{selectedCoinData.symbol.toUpperCase()}</p>
              </div>
            </div>
          )}

          {/* Price Stats Grid */}
          {coinStats && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-slate-700/50 rounded-lg p-4">
                <p className="text-gray-400 text-sm">Current Price</p>
                <p className="text-2xl font-bold text-white">{formatPrice(coinStats.currentPrice)}</p>
              </div>
              <div className="bg-slate-700/50 rounded-lg p-4">
                <p className="text-gray-400 text-sm">24h Change</p>
                <p className={`text-xl font-bold ${coinStats.priceChange24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {coinStats.priceChange24h >= 0 ? '+' : ''}{formatPrice(Math.abs(coinStats.priceChange24h))}
                </p>
              </div>
              <div className="bg-slate-700/50 rounded-lg p-4">
                <p className="text-gray-400 text-sm">24h Change %</p>
                <p className={`text-xl font-bold ${coinStats.priceChangePercent24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {coinStats.priceChangePercent24h >= 0 ? '+' : ''}{coinStats.priceChangePercent24h.toFixed(2)}%
                </p>
              </div>
              <div className="bg-slate-700/50 rounded-lg p-4">
                <p className="text-gray-400 text-sm">24h Volume</p>
                <p className="text-xl font-bold text-white">{formatLargeNumber(coinStats.volume24h)}</p>
              </div>
            </div>
          )}

          {/* Additional Stats */}
          {coinStats && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
              <div className="bg-slate-700/30 rounded-lg p-4">
                <p className="text-gray-400 text-sm">Market Cap</p>
                <p className="text-lg font-bold text-white">{formatLargeNumber(coinStats.marketCap)}</p>
              </div>
              <div className="bg-slate-700/30 rounded-lg p-4">
                <p className="text-gray-400 text-sm">24h High</p>
                <p className="text-lg font-bold text-green-400">{formatPrice(coinStats.high24h)}</p>
              </div>
              <div className="bg-slate-700/30 rounded-lg p-4">
                <p className="text-gray-400 text-sm">24h Low</p>
                <p className="text-lg font-bold text-red-400">{formatPrice(coinStats.low24h)}</p>
              </div>
            </div>
          )}

          {/* Chart */}
          <div className="bg-slate-900/50 rounded-xl p-4">
            {!selectedCoin && coins.length === 0 && !coinsLoading ? (
              <div className="flex items-center justify-center h-96">
                <p className="text-gray-400">No cryptocurrencies available to display</p>
              </div>
            ) : initialLoad ? (
              <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
                <p className="ml-4 text-gray-400">Loading initial data...</p>
              </div>
            ) : error ? (
              <div className="bg-red-900/20 border border-red-600 rounded-lg p-3 mb-4">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            ) : loading ? (
              <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
                <p className="ml-4 text-gray-400">Loading chart data...</p>
              </div>
            ) : priceData.length > 0 ? (
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={priceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="timestamp" 
                    stroke="#9CA3AF"
                    fontSize={12}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis 
                    stroke="#9CA3AF"
                    fontSize={12}
                    tickFormatter={formatPrice}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#F3F4F6'
                    }}
                    formatter={(value: number) => [formatPrice(value), 'Price']}
                    labelFormatter={(label) => `Date: ${label}`}
                    labelStyle={{ color: '#9CA3AF' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="price"
                    stroke="#8B5CF6"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4, fill: '#8B5CF6' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-96">
                <p className="text-gray-400">No chart data available</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CryptoPriceChart;