import { useState, useEffect } from 'react';
import { 
  Snowflake, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  TrendingUp,
  Gift,
  Timer,
  Zap
} from 'lucide-react';

const PriceFreezeCard = ({ 
  itemType, 
  itemId, 
  currentPrice, 
  onCreateFreeze, 
  onUseFreeze,
  existingFreeze = null,
  className = ""
}) => {
  const [timeRemaining, setTimeRemaining] = useState('');
  const [isExpired, setIsExpired] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (existingFreeze && existingFreeze.isActive) {
      const timer = setInterval(() => {
        updateTimeRemaining();
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [existingFreeze]);

  const updateTimeRemaining = () => {
    if (!existingFreeze || !existingFreeze.freezeEndTime) return;

    const now = new Date();
    const endTime = new Date(existingFreeze.freezeEndTime);
    const timeDiff = endTime.getTime() - now.getTime();

    if (timeDiff <= 0) {
      setIsExpired(true);
      setTimeRemaining('Expired');
      return;
    }

    const hours = Math.floor(timeDiff / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

    setTimeRemaining(`${hours}h ${minutes}m ${seconds}s`);
    setIsExpired(false);
  };

  const handleCreateFreeze = async () => {
    try {
      setLoading(true);
      await onCreateFreeze(itemType, itemId, currentPrice);
    } catch (error) {
      console.error('Error creating price freeze:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUseFreeze = async () => {
    if (!existingFreeze) return;
    
    try {
      setLoading(true);
      await onUseFreeze(existingFreeze.id);
    } catch (error) {
      console.error('Error using price freeze:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // No existing freeze - show create option
  if (!existingFreeze) {
    return (
      <div className={`bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg border border-blue-200 p-6 ${className}`}>
        <div className="flex items-start justify-between">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Snowflake className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">Price Freeze</h3>
              <p className="text-sm text-gray-600">Lock in current price for 24 hours</p>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">
              ₹{currentPrice.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Current Price</div>
          </div>
        </div>

        <div className="mt-4 space-y-3">
          <div className="flex items-center text-sm text-gray-700">
            <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
            <span>Protect against price increases</span>
          </div>
          <div className="flex items-center text-sm text-gray-700">
            <Timer className="w-4 h-4 text-blue-600 mr-2" />
            <span>Valid for 24 hours</span>
          </div>
          <div className="flex items-center text-sm text-gray-700">
            <Gift className="w-4 h-4 text-purple-600 mr-2" />
            <span>Free to create, use when booking</span>
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={handleCreateFreeze}
            disabled={loading}
            className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Creating Freeze...
              </>
            ) : (
              <>
                <Snowflake className="w-4 h-4 mr-2" />
                Freeze This Price
              </>
            )}
          </button>
        </div>

        <div className="mt-3 text-xs text-gray-500 text-center">
          Price freezes are limited time offers and subject to availability
        </div>
      </div>
    );
  }

  // Existing freeze - show status
  const isActive = existingFreeze.isActive && !existingFreeze.isUsed && !isExpired;
  const isUsed = existingFreeze.isUsed;

  return (
    <div className={`rounded-lg border p-6 ${className} ${
      isActive ? 'bg-gradient-to-br from-green-50 to-emerald-100 border-green-200' :
      isUsed ? 'bg-gradient-to-br from-purple-50 to-violet-100 border-purple-200' :
      'bg-gradient-to-br from-gray-50 to-slate-100 border-gray-200'
    }`}>
      <div className="flex items-start justify-between">
        <div className="flex items-center">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
            isActive ? 'bg-green-100' :
            isUsed ? 'bg-purple-100' :
            'bg-gray-100'
          }`}>
            {isActive ? (
              <Snowflake className="w-6 h-6 text-green-600" />
            ) : isUsed ? (
              <CheckCircle className="w-6 h-6 text-purple-600" />
            ) : (
              <AlertTriangle className="w-6 h-6 text-gray-600" />
            )}
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {isActive ? 'Active Price Freeze' :
               isUsed ? 'Used Price Freeze' :
               'Expired Price Freeze'}
            </h3>
            <p className="text-sm text-gray-600">
              Created {formatDateTime(existingFreeze.freezeStartTime)}
            </p>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900">
            ₹{existingFreeze.frozenPrice.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">Frozen Price</div>
        </div>
      </div>

      {/* Status Information */}
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="text-center p-3 bg-white bg-opacity-50 rounded-lg">
          <div className="text-sm text-gray-600">Original Price</div>
          <div className="text-lg font-semibold text-gray-900">
            ₹{existingFreeze.originalPrice.toLocaleString()}
          </div>
        </div>
        
        <div className="text-center p-3 bg-white bg-opacity-50 rounded-lg">
          <div className="text-sm text-gray-600">Your Savings</div>
          <div className="text-lg font-semibold text-green-600">
            ₹{existingFreeze.savings.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Time Remaining or Status */}
      {isActive && (
        <div className="mt-4 p-3 bg-white bg-opacity-70 rounded-lg border border-green-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Clock className="w-4 h-4 text-green-600 mr-2" />
              <span className="text-sm font-medium text-green-800">Time Remaining:</span>
            </div>
            <div className="text-sm font-bold text-green-900">
              {timeRemaining}
            </div>
          </div>
          <div className="mt-2 text-xs text-green-700">
            Expires: {formatDateTime(existingFreeze.freezeEndTime)}
          </div>
        </div>
      )}

      {isUsed && (
        <div className="mt-4 p-3 bg-white bg-opacity-70 rounded-lg border border-purple-200">
          <div className="flex items-center">
            <CheckCircle className="w-4 h-4 text-purple-600 mr-2" />
            <span className="text-sm font-medium text-purple-800">
              Successfully used! You saved ₹{existingFreeze.savings.toLocaleString()}
            </span>
          </div>
        </div>
      )}

      {isExpired && (
        <div className="mt-4 p-3 bg-white bg-opacity-70 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <AlertTriangle className="w-4 h-4 text-gray-600 mr-2" />
            <span className="text-sm font-medium text-gray-700">
              This price freeze has expired
            </span>
          </div>
        </div>
      )}

      {/* Action Button */}
      {isActive && (
        <div className="mt-6">
          <button
            onClick={handleUseFreeze}
            disabled={loading}
            className="w-full flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Using Freeze...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 mr-2" />
                Use This Price Freeze
              </>
            )}
          </button>
          
          <div className="mt-2 text-xs text-green-700 text-center">
            Click to apply frozen price to your booking
          </div>
        </div>
      )}

      {/* Savings Highlight */}
      {existingFreeze.savings > 0 && (
        <div className="mt-4 flex items-center justify-center">
          <div className="flex items-center px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
            <TrendingUp className="w-4 h-4 mr-1" />
            <span>Saved ₹{existingFreeze.savings.toLocaleString()} vs current market price</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PriceFreezeCard;