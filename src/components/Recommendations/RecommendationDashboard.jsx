import React, { useState, useEffect } from 'react';
import { Sparkles, TrendingUp, Tag, Calendar, Filter, RefreshCw, BarChart3 } from 'lucide-react';
import RecommendationCard from './RecommendationCard';
import { recommendationsAPI } from '../../api/recommendations';

const RecommendationDashboard = ({ userId = 'user123' }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [filters, setFilters] = useState({
    itemType: 'all',
    priceRange: 'all',
    rating: 0
  });
  const [analytics, setAnalytics] = useState(null);
  const [showAnalytics, setShowAnalytics] = useState(false);

  const categories = [
    { id: 'all', label: 'All Recommendations', icon: Sparkles },
    { id: 'personalized', label: 'For You', icon: Sparkles },
    { id: 'trending', label: 'Trending', icon: TrendingUp },
    { id: 'deals', label: 'Best Deals', icon: Tag },
    { id: 'seasonal', label: 'Seasonal', icon: Calendar }
  ];

  const itemTypes = [
    { id: 'all', label: 'All Types' },
    { id: 'destination', label: 'Destinations' },
    { id: 'hotel', label: 'Hotels' },
    { id: 'flight', label: 'Flights' },
    { id: 'package', label: 'Packages' }
  ];

  const priceRanges = [
    { id: 'all', label: 'Any Price' },
    { id: 'budget', label: 'Under ₹10,000' },
    { id: 'mid-range', label: '₹10,000 - ₹30,000' },
    { id: 'premium', label: '₹30,000 - ₹50,000' },
    { id: 'luxury', label: 'Above ₹50,000' }
  ];

  useEffect(() => {
    loadRecommendations();
    loadAnalytics();
  }, [userId, activeCategory]);

  const loadRecommendations = async () => {
    try {
      setLoading(true);
      setError(null);

      // First generate fresh recommendations
      await recommendationsAPI.generateRecommendations({
        userId,
        count: 20,
        category: activeCategory === 'all' ? undefined : activeCategory,
        filters: filters.itemType !== 'all' ? { itemType: filters.itemType } : undefined
      });

      // Then fetch the recommendations
      const response = await recommendationsAPI.getUserRecommendations(
        userId,
        activeCategory === 'all' ? undefined : activeCategory
      );

      if (response.success) {
        let filteredRecs = response.data;

        // Apply client-side filters
        if (filters.itemType !== 'all') {
          filteredRecs = filteredRecs.filter(rec => rec.itemType === filters.itemType);
        }

        if (filters.priceRange !== 'all') {
          filteredRecs = filteredRecs.filter(rec => {
            switch (filters.priceRange) {
              case 'budget': return rec.price < 10000;
              case 'mid-range': return rec.price >= 10000 && rec.price <= 30000;
              case 'premium': return rec.price > 30000 && rec.price <= 50000;
              case 'luxury': return rec.price > 50000;
              default: return true;
            }
          });
        }

        if (filters.rating > 0) {
          filteredRecs = filteredRecs.filter(rec => rec.rating >= filters.rating);
        }

        setRecommendations(filteredRecs);
      } else {
        setError('Failed to load recommendations');
      }
    } catch (err) {
      console.error('Error loading recommendations:', err);
      setError('Failed to load recommendations');
    } finally {
      setLoading(false);
    }
  };

  const loadAnalytics = async () => {
    try {
      const response = await recommendationsAPI.getAnalytics();
      if (response.success) {
        setAnalytics(response.data);
      }
    } catch (err) {
      console.error('Error loading analytics:', err);
    }
  };

  const handleFeedback = async (feedback) => {
    try {
      await recommendationsAPI.submitFeedback(feedback);
      // Optionally refresh recommendations after feedback
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  };

  const handleInteraction = async (interaction) => {
    try {
      await recommendationsAPI.trackInteraction(interaction);
    } catch (error) {
      console.error('Error tracking interaction:', error);
    }
  };

  const initializeSampleData = async () => {
    try {
      setLoading(true);
      await recommendationsAPI.initializeSampleData();
      await loadRecommendations();
    } catch (error) {
      console.error('Error initializing sample data:', error);
      setError('Failed to initialize sample data');
    }
  };

  const filteredRecommendations = recommendations;

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              AI Recommendations
            </h1>
            <p className="text-gray-600">
              Personalized travel suggestions based on your preferences and behavior
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowAnalytics(!showAnalytics)}
              className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Analytics
            </button>
            <button
              onClick={loadRecommendations}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </button>
          </div>
        </div>

        {/* Analytics Panel */}
        {showAnalytics && analytics && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Recommendation Analytics</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {analytics.totalRecommendations}
                </div>
                <div className="text-sm text-blue-800">Total Recommendations</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {analytics.clickThroughRate.toFixed(1)}%
                </div>
                <div className="text-sm text-green-800">Click Through Rate</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {analytics.conversionRate.toFixed(1)}%
                </div>
                <div className="text-sm text-purple-800">Conversion Rate</div>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">
                  {analytics.averageScore.toFixed(1)}
                </div>
                <div className="text-sm text-orange-800">Average Score</div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-2">Category Breakdown</h4>
                <div className="space-y-2">
                  {Object.entries(analytics.categoryBreakdown).map(([category, count]) => (
                    <div key={category} className="flex justify-between">
                      <span className="capitalize">{category}</span>
                      <span className="font-medium">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Top Recommendation Reasons</h4>
                <div className="space-y-2">
                  {analytics.topReasons.map((reason, index) => (
                    <div key={index} className="flex justify-between">
                      <span className="capitalize">{reason.type.replace('_', ' ')}</span>
                      <span className="font-medium">{reason.successRate}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                activeCategory === category.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Icon className="w-4 h-4 mr-2" />
              {category.label}
            </button>
          );
        })}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="flex items-center mb-3">
          <Filter className="w-5 h-5 mr-2 text-gray-600" />
          <h3 className="font-medium text-gray-900">Filters</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type
            </label>
            <select
              value={filters.itemType}
              onChange={(e) => setFilters({ ...filters, itemType: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {itemTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price Range
            </label>
            <select
              value={filters.priceRange}
              onChange={(e) => setFilters({ ...filters, priceRange: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {priceRanges.map((range) => (
                <option key={range.id} value={range.id}>
                  {range.label}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Minimum Rating
            </label>
            <select
              value={filters.rating}
              onChange={(e) => setFilters({ ...filters, rating: parseFloat(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value={0}>Any Rating</option>
              <option value={3}>3+ Stars</option>
              <option value={4}>4+ Stars</option>
              <option value={4.5}>4.5+ Stars</option>
            </select>
          </div>
          
          <div className="flex items-end">
            <button
              onClick={loadRecommendations}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading recommendations...</span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="text-red-800">{error}</div>
            <div className="flex space-x-2">
              <button
                onClick={initializeSampleData}
                className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
              >
                Initialize Sample Data
              </button>
              <button
                onClick={loadRecommendations}
                className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Recommendations Grid */}
      {!loading && !error && (
        <>
          {filteredRecommendations.length === 0 ? (
            <div className="text-center py-12">
              <Sparkles className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No recommendations found
              </h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your filters or generate new recommendations
              </p>
              <button
                onClick={initializeSampleData}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Initialize Sample Data
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRecommendations.map((recommendation) => (
                  <RecommendationCard
                    key={recommendation.id || recommendation._id}
                    recommendation={recommendation}
                    onFeedback={handleFeedback}
                    onInteraction={handleInteraction}
                    showReasons={true}
                  />
                ))}
              </div>
              
              {/* Load More Button */}
              {filteredRecommendations.length >= 10 && (
                <div className="text-center mt-8">
                  <button
                    onClick={loadRecommendations}
                    className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Load More Recommendations
                  </button>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default RecommendationDashboard;