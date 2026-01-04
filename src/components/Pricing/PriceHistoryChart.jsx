import { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Calendar,
  BarChart3,
  Info,
  RefreshCw
} from 'lucide-react';

const PriceHistoryChart = ({ itemType, itemId, priceHistory, currentPrice, basePrice }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('7d');
  const [chartData, setChartData] = useState([]);
  const [priceStats, setPriceStats] = useState(null);

  useEffect(() => {
    if (priceHistory && priceHistory.length > 0) {
      processChartData();
    }
  }, [priceHistory, selectedPeriod]);

  const processChartData = () => {
    let filteredData = [...priceHistory];
    const now = new Date();
    
    // Filter data based on selected period
    switch (selectedPeriod) {
      case '7d':
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        filteredData = priceHistory.filter(item => new Date(item.date) >= sevenDaysAgo);
        break;
      case '30d':
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        filteredData = priceHistory.filter(item => new Date(item.date) >= thirtyDaysAgo);
        break;
      case '90d':
        const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        filteredData = priceHistory.filter(item => new Date(item.date) >= ninetyDaysAgo);
        break;
      default:
        break;
    }

    // Sort by date
    filteredData.sort((a, b) => new Date(a.date) - new Date(b.date));

    // Calculate price statistics
    const prices = filteredData.map(item => item.finalPrice);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const avgPrice = Math.round(prices.reduce((sum, price) => sum + price, 0) / prices.length);
    
    const priceChange = currentPrice - (filteredData[0]?.finalPrice || currentPrice);
    const priceChangePercentage = filteredData[0]?.finalPrice 
      ? Math.round((priceChange / filteredData[0].finalPrice) * 100)
      : 0;

    setPriceStats({
      minPrice,
      maxPrice,
      avgPrice,
      priceChange,
      priceChangePercentage,
      dataPoints: filteredData.length
    });

    setChartData(filteredData);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getChartHeight = () => {
    if (chartData.length === 0) return 200;
    const prices = chartData.map(item => item.finalPrice);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    return maxPrice - minPrice > 1000 ? 300 : 200;
  };

  const renderChart = () => {
    if (chartData.length === 0) {
      return (
        <div className="flex items-center justify-center h-48 text-gray-500">
          <div className="text-center">
            <BarChart3 className="w-12 h-12 mx-auto mb-2 text-gray-400" />
            <p>No price data available for selected period</p>
          </div>
        </div>
      );
    }

    const prices = chartData.map(item => item.finalPrice);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const priceRange = maxPrice - minPrice;
    const chartHeight = getChartHeight();

    // Create SVG path for price line
    const pathData = chartData.map((item, index) => {
      const x = (index / (chartData.length - 1)) * 100;
      const y = priceRange > 0 
        ? ((maxPrice - item.finalPrice) / priceRange) * 80 + 10
        : 50;
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');

    // Create area fill path
    const areaPath = pathData + ` L 100 90 L 0 90 Z`;

    return (
      <div className="relative">
        <svg
          width="100%"
          height={chartHeight}
          viewBox="0 0 100 100"
          className="overflow-visible"
        >
          {/* Grid lines */}
          <defs>
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#f3f4f6" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#grid)" />
          
          {/* Area fill */}
          <path
            d={areaPath}
            fill="url(#priceGradient)"
            opacity="0.3"
          />
          
          {/* Price line */}
          <path
            d={pathData}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {/* Data points */}
          {chartData.map((item, index) => {
            const x = (index / (chartData.length - 1)) * 100;
            const y = priceRange > 0 
              ? ((maxPrice - item.finalPrice) / priceRange) * 80 + 10
              : 50;
            
            return (
              <g key={index}>
                <circle
                  cx={x}
                  cy={y}
                  r="2"
                  fill="#3b82f6"
                  className="hover:r-3 transition-all cursor-pointer"
                />
                <title>
                  {formatDate(item.date)} {formatTime(item.date)}: ₹{item.finalPrice.toLocaleString()}
                </title>
              </g>
            );
          })}
          
          {/* Gradient definition */}
          <defs>
            <linearGradient id="priceGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4"/>
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.1"/>
            </linearGradient>
          </defs>
        </svg>
        
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500 -ml-12">
          <span>₹{maxPrice.toLocaleString()}</span>
          <span>₹{Math.round((maxPrice + minPrice) / 2).toLocaleString()}</span>
          <span>₹{minPrice.toLocaleString()}</span>
        </div>
        
        {/* X-axis labels */}
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>{formatDate(chartData[0]?.date)}</span>
          {chartData.length > 2 && (
            <span>{formatDate(chartData[Math.floor(chartData.length / 2)]?.date)}</span>
          )}
          <span>{formatDate(chartData[chartData.length - 1]?.date)}</span>
        </div>
      </div>
    );
  };

  const getTrendIcon = () => {
    if (!priceStats) return <Minus className="w-4 h-4" />;
    
    if (priceStats.priceChangePercentage > 0) {
      return <TrendingUp className="w-4 h-4 text-red-600" />;
    } else if (priceStats.priceChangePercentage < 0) {
      return <TrendingDown className="w-4 h-4 text-green-600" />;
    }
    return <Minus className="w-4 h-4 text-gray-600" />;
  };

  const getTrendColor = () => {
    if (!priceStats) return 'text-gray-600';
    
    if (priceStats.priceChangePercentage > 0) {
      return 'text-red-600';
    } else if (priceStats.priceChangePercentage < 0) {
      return 'text-green-600';
    }
    return 'text-gray-600';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Price History</h3>
          <p className="text-sm text-gray-600">
            Track price changes over time
          </p>
        </div>
        
        {/* Period selector */}
        <div className="flex items-center space-x-2">
          {['7d', '30d', '90d'].map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                selectedPeriod === period
                  ? 'bg-blue-100 text-blue-700 border border-blue-300'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      {/* Price Statistics */}
      {priceStats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center">
            <div className="text-sm text-gray-600">Current Price</div>
            <div className="text-lg font-bold text-gray-900">
              ₹{currentPrice.toLocaleString()}
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-sm text-gray-600">Price Change</div>
            <div className={`text-lg font-bold flex items-center justify-center ${getTrendColor()}`}>
              {getTrendIcon()}
              <span className="ml-1">
                {priceStats.priceChangePercentage > 0 ? '+' : ''}
                {priceStats.priceChangePercentage}%
              </span>
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-sm text-gray-600">Lowest</div>
            <div className="text-lg font-bold text-green-600">
              ₹{priceStats.minPrice.toLocaleString()}
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-sm text-gray-600">Highest</div>
            <div className="text-lg font-bold text-red-600">
              ₹{priceStats.maxPrice.toLocaleString()}
            </div>
          </div>
        </div>
      )}

      {/* Chart */}
      <div className="mb-4">
        {renderChart()}
      </div>

      {/* Chart Info */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <div className="flex items-center">
          <Info className="w-4 h-4 mr-1" />
          <span>
            {priceStats ? `${priceStats.dataPoints} data points` : 'Loading data...'}
          </span>
        </div>
        
        <div className="flex items-center">
          <Calendar className="w-4 h-4 mr-1" />
          <span>Last updated: {new Date().toLocaleTimeString()}</span>
        </div>
      </div>

      {/* Base Price Comparison */}
      {basePrice && basePrice !== currentPrice && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-800">Base Price:</span>
            <span className="font-medium text-blue-900">₹{basePrice.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between mt-1">
            <span className="text-sm text-blue-800">Current vs Base:</span>
            <span className={`font-medium ${currentPrice > basePrice ? 'text-red-600' : 'text-green-600'}`}>
              {currentPrice > basePrice ? '+' : ''}
              {Math.round(((currentPrice - basePrice) / basePrice) * 100)}%
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PriceHistoryChart;