interface CryptoCardProps {
  name: string;
  symbol: string;
  price: number | string;
  change: number | string;  // Allow both number and string
  icon: string;
}
  const CryptoCard = ({ name, symbol, price, change, icon }: CryptoCardProps) => {
    const changeNum = typeof change === 'string' ? parseFloat(change) : change;
  const isPositive = changeNum >= 0;

    return (
      <div className="bg-blue-600/20 rounded-xl border border-blue-500/30 p-4 hover:bg-gray-700 transition-colors">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center mr-3">
              <img 
                src={icon} 
                alt={`${name} logo`}
                className="w-8 h-8 rounded-full object-cover"
             
              />
            </div>
            <div>
              <h3 className="font-medium">{name}</h3>
              <p className="text-gray-400 text-sm">{symbol}</p>
            </div>
          </div>
          <span
            className={`px-2 py-1 rounded text-xs font-medium ${
              isPositive ? 'bg-green-900 text-green-400' : 'bg-red-900 text-red-400'
            }`}
          >
         
            {change}%
          </span>
        </div>
        <div className="flex justify-between items-end">
          <span className="text-xl font-bold">${price.toLocaleString()}</span>
          <button className="bg-blue-600 hidden hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-sm transition-colors">
            Trade
          </button>
        </div>
      </div>
    );
  };
  
  export default CryptoCard;