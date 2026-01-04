import { 
  TrendingUp, 
  Calendar, 
  Users, 
  Clock, 
  MapPin,
  Zap,
  Sun,
  Snowflake,
  Leaf,
  Flower,
  Star,
  AlertTriangle
} from 'lucide-react';

const DemandFactors = ({ demandFactors, occupancyRate, bookingTrend }) => {
  const getFactorIcon = (type) => {
    switch (type) {
      case 'seasonal':
        return <Calendar className="w-4 h-4" />;
      case 'event':
        return <Star className="w-4 h-4" />;
      case 'occupancy':
        return <Users className="w-4 h-4" />;
      case 'time_based':
        return <Clock className="w-4 h-4" />;
      case 'competition':
        return <TrendingUp className="w-4 h-4" />;
      default:
        return <Zap className="w-4 h-4" />;
    }
  };

  const getFactorColor = (multiplier) => {
    if (multiplier >= 1.5) return 'text-red-600 bg-red-50 border-red-200';
    if (multiplier >= 1.2) return 'text-orange-600 bg-orange-50 border-orange-200';
    if (multiplier >= 1.0) return 'text-blue-600 bg-blue-50 border-blue-200';
    return 'text-green-600 bg-green-50 border-green-200';
  };

  const getSeasonIcon = (factorName) => {
    if (factorName.toLowerCase().includes('winter')) return <Snowflake className="w-4 h-4" />;
    if (factorName.toLowerCase().includes('summer')) return <Sun className="w-4 h-4" />;
    if (factorName.toLowerCase().includes('spring')) return <Flower className="w-4 h-4" />;
    if (factorName.toLowerCase().includes('autumn') || factorName.toLowerCase().includes('fall')) return <Leaf className="w-4 h-4" />;
    return <Calendar className="w-4 h-4" />;
  };

  const getOccupancyLevel = () => {
    if (occupancyRate >= 0.8) return { level: 'High', color: 'text-red-600', bg: 'bg-red-100' };
    if (occupancyRate >= 0.6) return { level: 'Moderate', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    if (occupancyRate >= 0.4) return { level: 'Normal', color: 'text-blue-600', bg: 'bg-blue-100' };
    return { level: 'Low', color: 'text-green-600', bg: 'bg-green-100' };
  };

  const getTrendIcon = () => {
    switch (bookingTrend) {
      case 'increasing':
        return <TrendingUp className="w-4 h-4 text-red-600" />;
      case 'decreasing':
        return <TrendingUp className="w-4 h-4 text-green-600 transform rotate-180" />;
      default:
        return <TrendingUp className="w-4 h-4 text-gray-600 transform rotate-90" />;
    }
  };

  const getTrendColor = () => {
    switch (bookingTrend) {
      case 'increasing':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'decreasing':
        return 'text-green-600 bg-green-50 border-green-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const activeDemandFactors = demandFactors.filter(factor => factor.isActive);
  const totalMultiplier = activeDemandFactors.reduce((acc, factor) => acc * factor.multiplier, 1);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Demand Factors</h3>
          <p className="text-sm text-gray-600">
            Current factors affecting pricing
          </p>
        </div>
        
        <div className="text-right">
          <div className="text-sm text-gray-600">Total Impact</div>
          <div className={`text-lg font-bold ${totalMultiplier > 1 ? 'text-red-600' : 'text-green-600'}`}>
            {totalMultiplier > 1 ? '+' : ''}{Math.round((totalMultiplier - 1) * 100)}%
          </div>
        </div>
      </div>

      {/* Overall Metrics */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600">Occupancy Rate</div>
              <div className="text-lg font-semibold text-gray-900">
                {Math.round(occupancyRate * 100)}%
              </div>
            </div>
            <div className={`px-2 py-1 rounded-full text-xs font-medium ${getOccupancyLevel().color} ${getOccupancyLevel().bg}`}>
              {getOccupancyLevel().level}
            </div>
          </div>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600">Booking Trend</div>
              <div className="text-lg font-semibold text-gray-900 capitalize">
                {bookingTrend}
              </div>
            </div>
            <div className={`p-2 rounded-full border ${getTrendColor()}`}>
              {getTrendIcon()}
            </div>
          </div>
        </div>
      </div>

      {/* Active Demand Factors */}
      <div className="space-y-3">
        <h4 className="font-medium text-gray-900">Active Factors</h4>
        
        {activeDemandFactors.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-gray-400" />
            <p>No active demand factors</p>
            <p className="text-sm">Prices are at base level</p>
          </div>
        ) : (
          activeDemandFactors.map((factor, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border ${getFactorColor(factor.multiplier)}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start">
                  <div className="mr-3 mt-0.5">
                    {factor.type === 'seasonal' ? getSeasonIcon(factor.name) : getFactorIcon(factor.type)}
                  </div>
                  <div>
                    <div className="font-medium">{factor.name}</div>
                    <div className="text-sm opacity-80 mt-1">
                      {factor.description}
                    </div>
                    {factor.startDate && factor.endDate && (
                      <div className="text-xs opacity-70 mt-2 flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {new Date(factor.startDate).toLocaleDateString()} - {new Date(factor.endDate).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="font-bold text-lg">
                    {factor.multiplier > 1 ? '+' : ''}{Math.round((factor.multiplier - 1) * 100)}%
                  </div>
                  <div className="text-xs opacity-70">
                    {factor.multiplier.toFixed(2)}x
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Price Impact Summary */}
      {activeDemandFactors.length > 0 && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <TrendingUp className="w-5 h-5 text-blue-600 mr-2" />
              <span className="font-medium text-blue-900">Combined Price Impact</span>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-blue-900">
                {totalMultiplier > 1 ? '+' : ''}{Math.round((totalMultiplier - 1) * 100)}%
              </div>
              <div className="text-xs text-blue-700">
                Multiplier: {totalMultiplier.toFixed(2)}x
              </div>
            </div>
          </div>
          
          <div className="mt-3 text-sm text-blue-800">
            {totalMultiplier > 1.5 ? (
              <>
                <AlertTriangle className="w-4 h-4 inline mr-1" />
                High demand period - consider booking soon or using price freeze
              </>
            ) : totalMultiplier > 1.2 ? (
              'Moderate price increase due to demand factors'
            ) : totalMultiplier > 1.0 ? (
              'Slight price increase from current demand'
            ) : (
              'Favorable pricing conditions - good time to book!'
            )}
          </div>
        </div>
      )}

      {/* Factor Categories */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
        {['seasonal', 'event', 'occupancy', 'time_based'].map((type) => {
          const typeFactors = activeDemandFactors.filter(f => f.type === type);
          const typeMultiplier = typeFactors.reduce((acc, f) => acc * f.multiplier, 1);
          
          return (
            <div key={type} className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-center mb-1">
                {getFactorIcon(type)}
              </div>
              <div className="text-xs text-gray-600 capitalize mb-1">
                {type.replace('_', ' ')}
              </div>
              <div className={`text-sm font-medium ${typeMultiplier > 1 ? 'text-red-600' : 'text-gray-600'}`}>
                {typeFactors.length > 0 ? (
                  <>
                    {typeMultiplier > 1 ? '+' : ''}{Math.round((typeMultiplier - 1) * 100)}%
                  </>
                ) : (
                  '0%'
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DemandFactors;