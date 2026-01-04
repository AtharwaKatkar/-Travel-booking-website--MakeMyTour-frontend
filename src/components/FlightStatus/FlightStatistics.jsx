import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Clock, Plane, AlertTriangle, CheckCircle } from 'lucide-react';
import { getFlightStatistics } from '../../api/flightStatus';

const FlightStatistics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStatistics();
    
    // Refresh statistics every 2 minutes
    const interval = setInterval(fetchStatistics, 120000);
    return () => clearInterval(interval);
  }, []);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      const response = await getFlightStatistics();
      setStats(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !stats) {
    return (
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <div className="text-center text-red-600">
          <AlertTriangle className="w-8 h-8 mx-auto mb-2" />
          <p>{error}</p>
          <button
            onClick={fetchStatistics}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const getPercentage = (value, total) => {
    return total > 0 ? Math.round((value / total) * 100) : 0;
  };

  const statCards = [
    {
      title: 'Total Flights',
      value: stats?.total || 0,
      icon: Plane,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      title: 'On Time',
      value: stats?.onTime || 0,
      percentage: getPercentage(stats?.onTime, stats?.total),
      icon: CheckCircle,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      title: 'Delayed',
      value: stats?.delayed || 0,
      percentage: getPercentage(stats?.delayed, stats?.total),
      icon: Clock,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600'
    },
    {
      title: 'In Flight',
      value: stats?.inFlight || 0,
      percentage: getPercentage(stats?.inFlight, stats?.total),
      icon: TrendingUp,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-gray-600" />
          <h2 className="text-xl font-bold text-gray-900">Flight Statistics</h2>
        </div>
        <button
          onClick={fetchStatistics}
          disabled={loading}
          className="px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 disabled:opacity-50"
        >
          {loading ? 'Updating...' : 'Refresh'}
        </button>
      </div>

      {/* Main Statistics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className={`${stat.bgColor} rounded-lg p-4 border border-gray-200`}>
              <div className="flex items-center justify-between mb-2">
                <Icon className={`w-5 h-5 ${stat.textColor}`} />
                {stat.percentage !== undefined && (
                  <span className={`text-xs font-medium ${stat.textColor}`}>
                    {stat.percentage}%
                  </span>
                )}
              </div>
              <div className={`text-2xl font-bold ${stat.textColor} mb-1`}>
                {stat.value}
              </div>
              <div className="text-sm text-gray-600">{stat.title}</div>
            </div>
          );
        })}
      </div>

      {/* Additional Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Average Delay */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Average Delay</span>
          </div>
          <div className="text-xl font-bold text-gray-900">
            {stats?.averageDelay || 0} min
          </div>
        </div>

        {/* Landed Flights */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Landed</span>
          </div>
          <div className="text-xl font-bold text-gray-900">
            {stats?.landed || 0}
          </div>
          <div className="text-xs text-gray-500">
            {getPercentage(stats?.landed, stats?.total)}% of total
          </div>
        </div>

        {/* Cancelled Flights */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-red-600" />
            <span className="text-sm font-medium text-gray-700">Cancelled</span>
          </div>
          <div className="text-xl font-bold text-red-600">
            {stats?.cancelled || 0}
          </div>
          <div className="text-xs text-gray-500">
            {getPercentage(stats?.cancelled, stats?.total)}% of total
          </div>
        </div>
      </div>

      {/* Performance Indicator */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">On-time Performance</span>
          <div className="flex items-center gap-2">
            <div className="w-32 bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${getPercentage(stats?.onTime, stats?.total)}%` }}
              ></div>
            </div>
            <span className="text-sm font-medium text-gray-900">
              {getPercentage(stats?.onTime, stats?.total)}%
            </span>
          </div>
        </div>
      </div>

      {/* Last Updated */}
      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500">
          Last updated: {stats ? new Date().toLocaleTimeString() : 'Never'}
        </p>
      </div>
    </div>
  );
};

export default FlightStatistics;