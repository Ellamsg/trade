'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/app/utils/supabase/clients'

type StockData = {
  symbol: string;
  name: string;
  frequency: number;
  icon: string;
  trade: string; // Added trade field
}

interface FrequencyStockCardProps {
  symbols: string[];
  title?: string;
  colorClass?: string;
}

export default function FrequencyStockCard({ 
  symbols, 
  title = "Stock Frequencies",
  colorClass = "bg-blue-500"
}: FrequencyStockCardProps) {
  const [stocksData, setStocksData] = useState<StockData[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  const fetchStockData = async () => {
    setLoading(true)
    setError(null)

    try {
      // Fetch data from Supabase including the trade field
      const { data: posts, error: supabaseError } = await supabase
        .from('posts')
        .select('trade, frequency')
        .in('trade', symbols)

      if (supabaseError) throw supabaseError

      // Create a map for trade and frequency data
      const tradeDataMap = new Map<string, {frequency: number, trade: string}>()
      posts?.forEach(post => {
        if (post.frequency !== null && post.frequency !== undefined && post.trade) {
          tradeDataMap.set(post.trade.toUpperCase(), {
            frequency: post.frequency,
            trade: post.trade // Store the original trade value
          })
        }
      })

      // Fetch stock metadata
      const apiKey = process.env.NEXT_PUBLIC_FMP_API_KEY || 'demo'
      const stockPromises = symbols.map(async (symbol) => {
        try {
          const response = await fetch(
            `https://financialmodelingprep.com/api/v3/quote/${symbol}?apikey=${apiKey}`
          )
          const data = await response.json()
          
          const tradeData = tradeDataMap.get(symbol.toUpperCase()) || {
            frequency: 0,
            trade: symbol // Fallback to symbol if no trade data
          }

          return {
            symbol: symbol.toUpperCase(),
            name: data[0]?.name || symbol,
            frequency: tradeData.frequency,
            trade: tradeData.trade, // Include the trade field
            icon: `https://financialmodelingprep.com/image-stock/${symbol.toUpperCase()}.png`
          }
        } catch (err) {
          console.error(`Error fetching data for ${symbol}:`, err)
          const tradeData = tradeDataMap.get(symbol.toUpperCase()) || {
            frequency: 0,
            trade: symbol
          }
          return {
            symbol: symbol.toUpperCase(),
            name: symbol,
            frequency: tradeData.frequency,
            trade: tradeData.trade,
            icon: `https://financialmodelingprep.com/image-stock/${symbol.toUpperCase()}.png`
          }
        }
      })

      const results = await Promise.all(stockPromises)
      setStocksData(results)

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch stock data')
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (symbols.length > 0) {
      fetchStockData()
    }
  }, [symbols])

  // ... (keep the loading and error states the same as before)

  return (
    <section>
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <span className={`w-3 h-3 ${colorClass} rounded-full mr-2`}></span>
        {title}
      </h2>
      
      {stocksData.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stocksData.map((stock) => (
            <div 
              key={stock.symbol}
              className="bg-blue-600/20 backdrop-blur-sm border border-blue-500/30 rounded-xl p-4 hover:bg-blue-600/30 transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <img 
                    src={stock.icon}
                    alt={stock.symbol}
                    className="w-8 h-8 rounded-full bg-white/10 p-1"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                  <div>
                    <h3 className="font-semibold text-sm">{stock.symbol}</h3>
                    <p className="text-xs text-gray-400 truncate max-w-20">{stock.name}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="text-right">
                  <p className="text-lg font-bold text-white">
                    {stock.frequency}
                  </p>
                  <p className="text-xs text-gray-400">Frequency</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-blue-300">
                    {stock.trade}
                  </p>
                  <p className="text-xs text-gray-400">Trade</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-800 rounded-lg p-4 text-center">
          <p className="text-gray-400">No stock data available</p>
        </div>
      )}
      
      <button 
        onClick={fetchStockData}
        disabled={loading}
        className={`mt-4 px-4 py-2 rounded-md transition-colors ${
          loading 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-blue-600 hover:bg-blue-700'
        } text-white`}
      >
        {loading ? 'Refreshing...' : 'Refresh Data'}
      </button>
    </section>
  )
}