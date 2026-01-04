import React, { useState } from 'react';
import { Filter, X, MapPin, DollarSign, Star, Calendar, Users } from 'lucide-react';

const RecommendationFilters = ({ filters, onFiltersChange, onClear }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const itemTypes = [
    { id: 'all', label: 'All Types', icon: '🎯' },
    { id: 'destination', label: 'Destinations', icon: '🏝️' },
    { id: 'hotel', label: 'Hotels', icon: '🏨' },
    { id: 'flight', label: 'Flights', icon: '✈️' },
    { id: 'package', label: 'Packages', icon: '📦' }
  ];

  const priceRanges = [
    { id: 'all', label: 'Any Price', min: 0, max: Infinity },
    { id: 'budget', label: 'Budget (Under ₹10K)', min: 0, max: 10000 },
    { id: 'mid-range', label: 'Mid-range (₹10K-30K)', min: 10000, max: 30000 },
    { id: 'premium', label: 'Premium (₹30K-50K)', min: 30000, max: 50000 },
    { id: 'luxury', label: 'Luxury (Above ₹50K)', min: 50000, max: Infinity }
  ];

  const destinations = [
    'All Destinations',
    'Bali',
    'Goa',
    'Mumbai',
    'Delhi',
    'Manali',
    'Kerala',
    'Rajasthan',
    'Thailand',
    'Singapore',
    'Dubai'
  ];

  const features = [
    'Beach',
    'Mountains',
    'Culture',
    'Adventure',
    'Luxury',
    'Budget-friendly',
    'Family-friendly',
    'Romantic',
    'Business',
    'Heritage',
    'Nightlife',
    'Nature',
    'Spa & Wellness',
    'Water Sports',
    'Trekking'
  ];

  const handleFilterChange = (key, value) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const handleFeatureToggle = (feature) => {
    const currentFeatures = filters.features || [];
    const updatedFeatures = currentFeatures.includes(feature)
      ? currentFeatures.filter(f => f !== feature)
      : [...currentFeatures, feature];
    
    handleFilterChange('features', updatedFeatures);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.itemType && filters.itemType !== 'all') count++;
    if (filters.priceRange && filters.priceRange !== 'all') count++;
    if (filters.rating && filters.rating > 0) count++;
    if (filters.location && filters.location !== 'All Destinations') count++;
    if (filters.features && filters.features.length > 0) count++;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      {/* Filter Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center">
          <Filter className="w-5 h-5 mr-2 text-gray-600" />
          <h3 className="font-medium text-gray-900">Filters</h3>
          {activeFiltersCount > 0 && (
            <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
              {activeFiltersCount}
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {activeFiltersCount > 0 && (
            <button
              onClick={onClear}
              className="flex items-center px-3 py-1 text-sm text-gray-600 hover:text-red-600 transition-colors"
            >
              <X className="w-4 h-4 mr-1" />
              Clear All
            </button>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="px-3 py-1 text-sm text-blue-600 hover:text-blue-700 transition-colors"
          >
            {isExpanded ? 'Less' : 'More'} Filters
          </button>
        </div>
      </div>

      {/* Basic Filters */}
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Item Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MapPin className="w-4 h-4 inline mr-1" />
              Type
            </label>
            <select
              value={filters.itemType || 'all'}
              onChange={(e) => handleFilterChange('itemType', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {itemTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.icon} {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Price Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <DollarSign className="w-4 h-4 inline mr-1" />
              Price Range
            </label>
            <select
              value={filters.priceRange || 'all'}
              onChange={(e) => handleFilterChange('priceRange', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {priceRanges.map((range) => (
                <option key={range.id} value={range.id}>
                  {range.label}
                </option>
              ))}
            </select>
          </div>

          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Star className="w-4 h-4 inline mr-1" />
              Minimum Rating
            </label>
            <select
              value={filters.rating || 0}
              onChange={(e) => handleFilterChange('rating', parseFloat(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value={0}>Any Rating</option>
              <option value={3}>3+ Stars</option>
              <option value={4}>4+ Stars</option>
              <option value={4.5}>4.5+ Stars</option>
            </select>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MapPin className="w-4 h-4 inline mr-1" />
              Destination
            </label>
            <select
              value={filters.location || 'All Destinations'}
              onChange={(e) => handleFilterChange('location', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {destinations.map((destination) => (
                <option key={destination} value={destination}>
                  {destination}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Advanced Filters */}
      {isExpanded && (
        <div className="border-t border-gray-200 p-4">
          <div className="space-y-6">
            {/* Features */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Features & Interests
              </label>
              <div className="flex flex-wrap gap-2">
                {features.map((feature) => {
                  const isSelected = (filters.features || []).includes(feature);
                  return (
                    <button
                      key={feature}
                      onClick={() => handleFeatureToggle(feature)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                        isSelected
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {feature}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Price Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Custom Price Range
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Min Price</label>
                  <input
                    type="number"
                    placeholder="₹0"
                    value={filters.minPrice || ''}
                    onChange={(e) => handleFilterChange('minPrice', parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Max Price</label>
                  <input
                    type="number"
                    placeholder="₹100,000"
                    value={filters.maxPrice || ''}
                    onChange={(e) => handleFilterChange('maxPrice', parseInt(e.target.value) || 100000)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Duration Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                <Calendar className="w-4 h-4 inline mr-1" />
                Trip Duration
              </label>
              <div className="flex flex-wrap gap-2">
                {['1-2 days', '3-5 days', '5-7 days', '1-2 weeks', '2+ weeks'].map((duration) => {
                  const isSelected = filters.duration === duration;
                  return (
                    <button
                      key={duration}
                      onClick={() => handleFilterChange('duration', isSelected ? null : duration)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                        isSelected
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {duration}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Group Size */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                <Users className="w-4 h-4 inline mr-1" />
                Group Size
              </label>
              <div className="flex flex-wrap gap-2">
                {['Solo', 'Couple', 'Family', 'Group'].map((size) => {
                  const isSelected = filters.groupSize === size;
                  return (
                    <button
                      key={size}
                      onClick={() => handleFilterChange('groupSize', isSelected ? null : size)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                        isSelected
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Active Filters Summary */}
      {activeFiltersCount > 0 && (
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">
              {activeFiltersCount} filter{activeFiltersCount !== 1 ? 's' : ''} applied
            </span>
            <div className="flex flex-wrap gap-2">
              {filters.itemType && filters.itemType !== 'all' && (
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  {itemTypes.find(t => t.id === filters.itemType)?.label}
                </span>
              )}
              {filters.priceRange && filters.priceRange !== 'all' && (
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                  {priceRanges.find(p => p.id === filters.priceRange)?.label}
                </span>
              )}
              {filters.rating && filters.rating > 0 && (
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                  {filters.rating}+ Stars
                </span>
              )}
              {filters.location && filters.location !== 'All Destinations' && (
                <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                  {filters.location}
                </span>
              )}
              {filters.features && filters.features.length > 0 && (
                <span className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-full">
                  {filters.features.length} feature{filters.features.length !== 1 ? 's' : ''}
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecommendationFilters;