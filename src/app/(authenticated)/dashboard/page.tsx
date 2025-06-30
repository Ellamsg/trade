


// import { signOut } from "@/app/(auth)/login/action";
// import { redirect } from 'next/navigation';
// import { createClient } from "@/app/utils/supabase/servers";
// import FrequencyStockCard from "@/app/components/frequency";
// import CryptoCard from "@/app/components/cryptoCard";
// const DashboardPage = async () => {
//   const supabase = await createClient();
//   const { data: { user }, error } = await supabase.auth.getUser();

//   if (error || !user) {
//     redirect('/login');
//   }

//   // Initialize data arrays
//   let topGainers = [];
//   let mostActive = [];
//   let techStocks = [];
//   let retailStocks = [];
//   let evStocks = [];

//   try {
//     const apiKey = process.env.NEXT_PUBLIC_FMP_API_KEY || 'demo'; // Use your FMP API key

//     // Fetch top gaining stocks
//     const gainersResponse = await fetch(
//       `https://financialmodelingprep.com/api/v3/stock_market/gainers?apikey=${apiKey}`,
//       { next: { revalidate: 60 } }
//     );
    
//     if (gainersResponse.ok) {
//       const data = await gainersResponse.json();
//       topGainers = data.slice(0, 4).map((stock: any) => ({
//         name: stock.name,
//         symbol: stock.symbol,
//         price: stock.price,
//         change: stock.changesPercentage,
//         icon: `https://financialmodelingprep.com/image-stock/${stock.symbol}.png`
//       }));
//     }

//     // Fetch most active stocks
//     const activeResponse = await fetch(
//       `https://financialmodelingprep.com/api/v3/stock_market/actives?apikey=${apiKey}`,
//       { next: { revalidate: 120 } }
//     );

//     if (activeResponse.ok) {
//       const data = await activeResponse.json();
//       mostActive = data.slice(0, 4).map((stock: any) => ({
//         name: stock.name,
//         symbol: stock.symbol,
//         price: stock.price,
//         change: stock.changesPercentage,
//         icon: `https://financialmodelingprep.com/image-stock/${stock.symbol}.png`
//       }));
//     }

//     // Predefined tech stocks (AAPL, MSFT, GOOGL, META)
//     const techSymbols = ['AAPL', 'MSFT', 'GOOGL', 'META'];
//     techStocks = await Promise.all(techSymbols.map(async (symbol) => {
//       const response = await fetch(
//         `https://financialmodelingprep.com/api/v3/quote/${symbol}?apikey=${apiKey}`,
//         { next: { revalidate: 300 } }
//       );
//       const data = await response.json();
//       return {
//         name: data[0]?.name || symbol,
//         symbol,
//         price: data[0]?.price || 0,
//         change: data[0]?.changesPercentage || 0,
//         icon: `https://financialmodelingprep.com/image-stock/${symbol}.png`
//       };
//     }));

//     // Predefined retail stocks (AMZN, WMT, TGT, HD)
//     const retailSymbols = ['AMZN', 'WMT', 'TGT', 'HD'];
//     retailStocks = await Promise.all(retailSymbols.map(async (symbol) => {
//       const response = await fetch(
//         `https://financialmodelingprep.com/api/v3/quote/${symbol}?apikey=${apiKey}`,
//         { next: { revalidate: 300 } }
//       );
//       const data = await response.json();
//       return {
//         name: data[0]?.name || symbol,
//         symbol,
//         price: data[0]?.price || 0,
//         change: data[0]?.changesPercentage || 0,
//         icon: `https://financialmodelingprep.com/image-stock/${symbol}.png`
//       };
//     }));

//     // Predefined EV stocks (TSLA, NIO, LCID, RIVN)
//     const evSymbols = ['TSLA', 'NIO', 'LCID', 'RIVN'];
//     evStocks = await Promise.all(evSymbols.map(async (symbol) => {
//       const response = await fetch(
//         `https://financialmodelingprep.com/api/v3/quote/${symbol}?apikey=${apiKey}`,
//         { next: { revalidate: 300 } }
//       );
//       const data = await response.json();
//       return {
//         name: data[0]?.name || symbol,
//         symbol,
//         price: data[0]?.price || 0,
//         change: data[0]?.changesPercentage || 0,
//         icon: `https://financialmodelingprep.com/image-stock/${symbol}.png`
//       };
//     }));

//   } catch (error) {
//     console.error('Error fetching stock data:', error);
//   }

//   return (
//     <div className="space-y-8 p-5 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
//       <FrequencyStockCard
//             symbols={['TSLA', 'NIO', 'LCID', 'RIVN']}
//             title="EV Stocks Frequency"
//             colorClass="bg-yellow-500"
//       />
//       <h1 className="text-3xl font-bold mb-6">Stock Market Overview</h1>
      
//       {/* Top Gainers */}
//       <section>
//         <h2 className="text-xl font-semibold mb-4 flex items-center">
//           <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
//           Top Gainers
//         </h2>
//         {topGainers.length > 0 ? (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//             {topGainers.map((stock) => (
//               <CryptoCard key={`top-${stock.symbol}`} {...stock} />
//             ))}
//           </div>
//         ) : (
//           <div className="bg-gray-800 rounded-lg p-4 text-center">
//             <p>Loading top gainers...</p>
//           </div>
//         )}
//       </section>

//       {/* Most Active Stocks */}
//       <section>
//         <h2 className="text-xl font-semibold mb-4 flex items-center">
//           <span className="w-3 h-3 bg-orange-500 rounded-full mr-2"></span>
//           Most Active
//         </h2>
//         {mostActive.length > 0 ? (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//             {mostActive.map((stock) => (
//               <CryptoCard key={`active-${stock.symbol}`} {...stock} />
//             ))}
//           </div>
//         ) : (
//           <div className="bg-gray-800 rounded-lg p-4 text-center">
//             <p>Loading most active stocks...</p>
//           </div>
//         )}
//       </section>

//       {/* Tech Stocks */}
//       <section>
//         <h2 className="text-xl font-semibold mb-4 flex items-center">
//           <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
//           Tech Stocks
//         </h2>
//         {techStocks.length > 0 ? (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//             {techStocks.map((stock) => (
//               <CryptoCard key={`tech-${stock.symbol}`} {...stock} />
//             ))}
//           </div>
//         ) : (
//           <div className="bg-gray-800 rounded-lg p-4 text-center">
//             <p>Loading tech stocks...</p>
//           </div>
//         )}
//       </section>

//       {/* Retail Stocks */}
//       <section>
//         <h2 className="text-xl font-semibold mb-4 flex items-center">
//           <span className="w-3 h-3 bg-purple-500 rounded-full mr-2"></span>
//           Retail Stocks
//         </h2>
//         {retailStocks.length > 0 ? (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//             {retailStocks.map((stock) => (
//               <CryptoCard key={`retail-${stock.symbol}`} {...stock} />
//             ))}
//           </div>
//         ) : (
//           <div className="bg-gray-800 rounded-lg p-4 text-center">
//             <p>Loading retail stocks...</p>
//           </div>
//         )}
//       </section>

//       {/* EV Stocks */}
//       <section>
//         <h2 className="text-xl font-semibold mb-4 flex items-center">
//           <span className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></span>
//           EV Stocks
//         </h2>
//         {evStocks.length > 0 ? (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//             {evStocks.map((stock) => (
//               <CryptoCard key={`ev-${stock.symbol}`} {...stock} />
//             ))}
//           </div>
//         ) : (
//           <div className="bg-gray-800 rounded-lg p-4 text-center">
//             <p>Loading EV stocks...</p>
//           </div>
//         )}
//       </section>

//       {/* Recent Activity Section */}
//       <section>
//         <div className="bg-blue-600/20 rounded-xl border border-blue-500/30 p-6">
//           <h2 className="text-xl font-bold mb-4 flex items-center">
//             <span className="w-3 h-3 bg-gray-500 rounded-full mr-2"></span>
//             Recent Activity
//           </h2>
//           <div className="space-y-4">
//             <div className="flex justify-between items-center p-3 bg-blue-600/20 border border-blue-500/30 rounded-lg">
//               <div>
//                 <p className="font-medium">AAPL Purchase</p>
//                 <p className="text-gray-400 text-sm">Today, 10:45 AM</p>
//               </div>
//               <span className="text-green-400">+5 Shares</span>
//             </div>
//             <div className="flex justify-between items-center p-3 bg-blue-600/20 border border-blue-500/30 rounded-lg">
//               <div>
//                 <p className="font-medium">TSLA Sell</p>
//                 <p className="text-gray-400 text-sm">Today, 9:30 AM</p>
//               </div>
//               <span className="text-red-400">-2 Shares</span>
//             </div>
//             <div className="flex justify-between items-center p-3 bg-blue-600/20 border border-blue-500/30 rounded-lg">
//               <div>
//                 <p className="font-medium">Dividend Received</p>
//                 <p className="text-gray-400 text-sm">Yesterday, 3:22 PM</p>
//               </div>
//               <span className="text-purple-400">+$125.00</span>
//             </div>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// };

// export default DashboardPage;

'use client'

import { signOut } from "@/app/(auth)/login/action";
import { redirect } from 'next/navigation';
import { createClient } from "@/app/utils/supabase/clients";
import FrequencyStockCard from "@/app/components/frequency";
import CryptoCard from "@/app/components/cryptoCard";
import { useEffect, useState } from 'react';

const DashboardPage = () => {
  const supabase = createClient();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Stock categories
  const [topGainers, setTopGainers] = useState([]);
  const [mostActive, setMostActive] = useState([]);
  const [techStocks, setTechStocks] = useState([]);
  const [retailStocks, setRetailStocks] = useState([]);
  const [evStocks, setEvStocks] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) {
        redirect('/login');
      }
      setUser(user);
    };

    const fetchStocks = async () => {
      try {
        setLoading(true);
        
        // Fetch all stocks from Supabase
        const { data: stocks, error } = await supabase
          .from('posts')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        // Categorize stocks
        if (stocks && stocks.length > 0) {
          // Top gainers - stocks with highest percentage_change
          const gainers = [...stocks]
            .sort((a, b) => parseFloat(b.percentage_change) - parseFloat(a.percentage_change))
            .slice(0, 4)
            .map(stock => ({
              name: stock.name,
              symbol: stock.symbol,
              price: stock.current_price,
              change: stock.percentage_change,
              icon: stock.image_url || `https://financialmodelingprep.com/image-stock/${stock.symbol}.png`
            }));
          setTopGainers(gainers);

          // Most active - stocks with most recent updates (we'll use created_at for this)
          const active = [...stocks]
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
            .slice(0, 4)
            .map(stock => ({
              name: stock.name,
              symbol: stock.symbol,
              price: stock.current_price,
              change: stock.percentage_change,
              icon: stock.image_url || `https://financialmodelingprep.com/image-stock/${stock.symbol}.png`
            }));
          setMostActive(active);

          // Tech stocks - filter by known tech symbols or names
          const techSymbols = ['AAPL', 'MSFT', 'GOOGL', 'META', 'NVDA', 'AMD', 'INTC'];
          const tech = stocks
            .filter(stock => techSymbols.includes(stock.symbol))
            .slice(0, 4)
            .map(stock => ({
              name: stock.name,
              symbol: stock.symbol,
              price: stock.current_price,
              change: stock.percentage_change,
              icon: stock.image_url || `https://financialmodelingprep.com/image-stock/${stock.symbol}.png`
            }));
          setTechStocks(tech);

          // Retail stocks
          const retailSymbols = ['AMZN', 'WMT', 'TGT', 'HD', 'COST', 'LOW', 'BABA'];
          const retail = stocks
            .filter(stock => retailSymbols.includes(stock.symbol))
            .slice(0, 4)
            .map(stock => ({
              name: stock.name,
              symbol: stock.symbol,
              price: stock.current_price,
              change: stock.percentage_change,
              icon: stock.image_url || `https://financialmodelingprep.com/image-stock/${stock.symbol}.png`
            }));
          setRetailStocks(retail);

          // EV stocks
          const evSymbols = ['TSLA', 'NIO', 'LCID', 'RIVN', 'F', 'GM', 'RIDE'];
          const ev = stocks
            .filter(stock => evSymbols.includes(stock.symbol))
            .slice(0, 4)
            .map(stock => ({
              name: stock.name,
              symbol: stock.symbol,
              price: stock.current_price,
              change: stock.percentage_change,
              icon: stock.image_url || `https://financialmodelingprep.com/image-stock/${stock.symbol}.png`
            }));
          setEvStocks(ev);
        }
      } catch (err) {
        setError(err.message);
        console.error('Error fetching stock data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
    fetchStocks();
  }, []);

  if (!user) return <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900"></div>;

  return (
    <div className="space-y-8 p-5 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 min-h-screen">
   
      <h1 className="text-3xl font-bold mb-6 text-white">Stock Market Overview</h1>
      
      {error && (
        <div className="p-4 bg-red-900/50 border-l-4 border-red-500 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">!</span>
            </div>
            <div>
              <p className="font-semibold text-red-300">Error</p>
              <p className="text-red-200">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Top Gainers */}
      <section>
        <h2 className="text-xl font-semibold mb-4 flex items-center text-white">
          <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
          Top Gainers
        </h2>
        {loading ? (
          <div className="bg-slate-800/50 rounded-lg p-4 text-center text-slate-400">
            <p>Loading top gainers...</p>
          </div>
        ) : topGainers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {topGainers.map((stock) => (
              <CryptoCard key={`top-${stock.symbol}`} {...stock} />
            ))}
          </div>
        ) : (
          <div className="bg-slate-800/50 rounded-lg p-4 text-center text-slate-400">
            <p>No top gainers found</p>
          </div>
        )}
      </section>

      {/* Most Active Stocks */}
      <section>
        <h2 className="text-xl font-semibold mb-4 flex items-center text-white">
          <span className="w-3 h-3 bg-orange-500 rounded-full mr-2"></span>
          Most Active
        </h2>
        {loading ? (
          <div className="bg-slate-800/50 rounded-lg p-4 text-center text-slate-400">
            <p>Loading most active stocks...</p>
          </div>
        ) : mostActive.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {mostActive.map((stock) => (
              <CryptoCard key={`active-${stock.symbol}`} {...stock} />
            ))}
          </div>
        ) : (
          <div className="bg-slate-800/50 rounded-lg p-4 text-center text-slate-400">
            <p>No active stocks found</p>
          </div>
        )}
      </section>

      {/* Tech Stocks */}
      <section>
        <h2 className="text-xl font-semibold mb-4 flex items-center text-white">
          <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
          Tech Stocks
        </h2>
        {loading ? (
          <div className="bg-slate-800/50 rounded-lg p-4 text-center text-slate-400">
            <p>Loading tech stocks...</p>
          </div>
        ) : techStocks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {techStocks.map((stock) => (
              <CryptoCard key={`tech-${stock.symbol}`} {...stock} />
            ))}
          </div>
        ) : (
          <div className="bg-slate-800/50 rounded-lg p-4 text-center text-slate-400">
            <p>No tech stocks found</p>
          </div>
        )}
      </section>

      {/* Retail Stocks */}
      <section>
        <h2 className="text-xl font-semibold mb-4 flex items-center text-white">
          <span className="w-3 h-3 bg-purple-500 rounded-full mr-2"></span>
          Retail Stocks
        </h2>
        {loading ? (
          <div className="bg-slate-800/50 rounded-lg p-4 text-center text-slate-400">
            <p>Loading retail stocks...</p>
          </div>
        ) : retailStocks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {retailStocks.map((stock) => (
              <CryptoCard key={`retail-${stock.symbol}`} {...stock} />
            ))}
          </div>
        ) : (
          <div className="bg-slate-800/50 rounded-lg p-4 text-center text-slate-400">
            <p>No retail stocks found</p>
          </div>
        )}
      </section>

      {/* EV Stocks */}
      <section>
        <h2 className="text-xl font-semibold mb-4 flex items-center text-white">
          <span className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></span>
          EV Stocks
        </h2>
        {loading ? (
          <div className="bg-slate-800/50 rounded-lg p-4 text-center text-slate-400">
            <p>Loading EV stocks...</p>
          </div>
        ) : evStocks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {evStocks.map((stock) => (
              <CryptoCard key={`ev-${stock.symbol}`} {...stock} />
            ))}
          </div>
        ) : (
          <div className="bg-slate-800/50 rounded-lg p-4 text-center text-slate-400">
            <p>No EV stocks found</p>
          </div>
        )}
      </section>

      {/* Recent Activity Section */}
      <section>
        <div className="bg-blue-600/20 rounded-xl border border-blue-500/30 p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center text-white">
            <span className="w-3 h-3 bg-gray-500 rounded-full mr-2"></span>
            Recent Activity
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-blue-600/20 border border-blue-500/30 rounded-lg">
              <div>
                <p className="font-medium text-white">AAPL Purchase</p>
                <p className="text-slate-400 text-sm">Today, 10:45 AM</p>
              </div>
              <span className="text-emerald-400">+5 Shares</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-blue-600/20 border border-blue-500/30 rounded-lg">
              <div>
                <p className="font-medium text-white">TSLA Sell</p>
                <p className="text-slate-400 text-sm">Today, 9:30 AM</p>
              </div>
              <span className="text-red-400">-2 Shares</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-blue-600/20 border border-blue-500/30 rounded-lg">
              <div>
                <p className="font-medium text-white">Dividend Received</p>
                <p className="text-slate-400 text-sm">Yesterday, 3:22 PM</p>
              </div>
              <span className="text-purple-400">+$125.00</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DashboardPage;


