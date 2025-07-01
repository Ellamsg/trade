

'use client'

import { signOut } from "@/app/(auth)/login/action";
import { redirect } from 'next/navigation';
import { createClient } from "@/app/utils/supabase/clients";
import FrequencyStockCard from "@/app/components/frequency";
import CryptoCard from "@/app/components/cryptoCard";
import { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';

// Define interfaces for type safety
interface StockData {
  id: string;
  name: string;
  symbol: string;
  current_price: string;
  percentage_change: string;
  image_url?: string;
  created_at: string;
}

interface StockCardProps {
  name: string;
  symbol: string;
  price: string;
  change: string;
  icon: string;
}

const DashboardPage: React.FC = () => {
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Stock categories with proper typing
  const [topGainers, setTopGainers] = useState<StockCardProps[]>([]);
  const [mostActive, setMostActive] = useState<StockCardProps[]>([]);
  const [techStocks, setTechStocks] = useState<StockCardProps[]>([]);
  const [retailStocks, setRetailStocks] = useState<StockCardProps[]>([]);
  const [evStocks, setEvStocks] = useState<StockCardProps[]>([]);

  useEffect(() => {
    const fetchUser = async (): Promise<void> => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) {
        redirect('/login');
        return;
      }
      setUser(user);
    };

    const fetchStocks = async (): Promise<void> => {
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
          const typedStocks = stocks as StockData[];

          // Top gainers - stocks with highest percentage_change
          const gainers: StockCardProps[] = [...typedStocks]
            .sort((a, b) => parseFloat(b.percentage_change) - parseFloat(a.percentage_change))
            .slice(0, 4)
            .map((stock): StockCardProps => ({
              name: stock.name,
              symbol: stock.symbol,
              price: stock.current_price,
              change: stock.percentage_change,
              icon: stock.image_url || `https://financialmodelingprep.com/image-stock/${stock.symbol}.png`
            }));
          setTopGainers(gainers);

          // Most active - stocks with most recent updates
          const active: StockCardProps[] = [...typedStocks]
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
            .slice(0, 4)
            .map((stock): StockCardProps => ({
              name: stock.name,
              symbol: stock.symbol,
              price: stock.current_price,
              change: stock.percentage_change,
              icon: stock.image_url || `https://financialmodelingprep.com/image-stock/${stock.symbol}.png`
            }));
          setMostActive(active);

          // Tech stocks - filter by known tech symbols or names
          const techSymbols: string[] = ['AAPL', 'MSFT', 'GOOGL', 'META', 'NVDA', 'AMD', 'INTC'];
          const tech: StockCardProps[] = typedStocks
            .filter((stock): boolean => techSymbols.includes(stock.symbol))
            .slice(0, 4)
            .map((stock): StockCardProps => ({
              name: stock.name,
              symbol: stock.symbol,
              price: stock.current_price,
              change: stock.percentage_change,
              icon: stock.image_url || `https://financialmodelingprep.com/image-stock/${stock.symbol}.png`
            }));
          setTechStocks(tech);

          // Retail stocks
          const retailSymbols: string[] = ['AMZN', 'WMT', 'TGT', 'HD', 'COST', 'LOW', 'BABA'];
          const retail: StockCardProps[] = typedStocks
            .filter((stock): boolean => retailSymbols.includes(stock.symbol))
            .slice(0, 4)
            .map((stock): StockCardProps => ({
              name: stock.name,
              symbol: stock.symbol,
              price: stock.current_price,
              change: stock.percentage_change,
              icon: stock.image_url || `https://financialmodelingprep.com/image-stock/${stock.symbol}.png`
            }));
          setRetailStocks(retail);

          // EV stocks
          const evSymbols: string[] = ['TSLA', 'NIO', 'LCID', 'RIVN', 'F', 'GM', 'RIDE'];
          const ev: StockCardProps[] = typedStocks
            .filter((stock): boolean => evSymbols.includes(stock.symbol))
            .slice(0, 4)
            .map((stock): StockCardProps => ({
              name: stock.name,
              symbol: stock.symbol,
              price: stock.current_price,
              change: stock.percentage_change,
              icon: stock.image_url || `https://financialmodelingprep.com/image-stock/${stock.symbol}.png`
            }));
          setEvStocks(ev);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
        setError(errorMessage);
        console.error('Error fetching stock data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
    fetchStocks();
  }, [supabase]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-white">Loading...</div>
        </div>
      </div>
    );
  }

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
            {topGainers.map((stock: StockCardProps) => (
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
            {mostActive.map((stock: StockCardProps) => (
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
            {techStocks.map((stock: StockCardProps) => (
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
            {retailStocks.map((stock: StockCardProps) => (
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
            {evStocks.map((stock: StockCardProps) => (
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

