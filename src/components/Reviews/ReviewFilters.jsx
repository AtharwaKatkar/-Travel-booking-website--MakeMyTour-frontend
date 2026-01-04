import React, { useState } from 'react';
import { 
  Filter, 
  Star, 
  Calendar, 
  TrendingUp, 
  Search,
  X,
  ChevronDown
} from 'lucide-react';

const ReviewFilters = ({ 
  onSortChange, 
  onFilterChange, 
  onSearch,
  totalReviews,
  currentSort = 'newest',
  currentFilters = {}
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    rating: null,
    verified: false,
    withPhotos: false,
    ...currentFilters
  });

  const sortOptions = [
    { value: 'newest', label: 'Newest First', icon: Calendar },
    { value: 'oldest', label: 'Oldest First', icon: Calendar },
    { value: 'highest', label: 'Highest Rating', icon: Star },
    { value: 'lowest', label: 'Lowest Rating', icon: Star },
    { value: 'helpful', label: 'Most Helpful', icon: TrendingUp }
  ];

  const handleSortChange = (sortValue) => {
    onSortChange(sortValue);
  };

  const handleFilterChange = (filterKey, value) => {
    const newFilters = { ...filters, [filterKey]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const clearFilters = () => {
    const clearedFilters = {
      rating: null,
      verified: false,
      withPhotos: false
    };
    setFilters(clearedFilters);
    setSearchQuery('');
    onFilterChange(clearedFilters);
    onSearch('');
  };

  const activeFiltersCount = Object.values(filters).filter(value => 
    value !== null && value !== false && value !== ''
  ).length + (searchQuery ? 1 : 0);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Left Side - Search and Results Count */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-gray-600">
            <span className="font-medium">{totalReviews}</span>
            <span>review{totalReviews !== 1 ? 's' : ''}</span>
          </div>
          
          {/* Search */}
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search reviews..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  onSearch('');
                }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </form>
        </div>

        {/* Right Side - Sort and Filters */}
        <div className="flex items-center gap-3">
          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={currentSort}
              onChange={(e) => handleSortChange(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-md px-4 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 border rounded-md transition-colors ${
              showFilters || activeFiltersCount > 0
                ? 'bg-blue-50 border-blue-300 text-blue-700'
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
            {activeFiltersCount > 0 && (
              <span className="bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </button>

          {/* Clear Filters */}
          {activeFiltersCount > 0 && (
            <button
              onClick={clearFilters}
              className="text-sm text-gray-600 hover:text-gray-800 underline"
            >
              Clear all
            </button>
          )}
        </div>
      </div>

      {/* Expanded Filters */}
      {showFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Rating Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minimum Rating
              </label>
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((rating) => (
                  <label key={rating} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="rating"
                      value={rating}
                      checked={filters.rating === rating}
                      onChange={() => handleFilterChange('rating', rating)}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <div className="flex items-center gap-1">
                      {[...Array(rating)].map((_, index) => (
                        <Star key={index} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                      {[...Array(5 - rating)].map((_, index) => (
                        <Star key={index} className="w-4 h-4 text-gray-300" />
                      ))}
                      <span className="text-sm text-gray-600 ml-1">& up</span>
                    </div>
                  </label>
                ))}
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="rating"
                    value=""
                    checked={filters.rating === null}
                    onChange={() => handleFilterChange('rating', null)}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-600">All ratings</span>
                </label>
              </div>
            </div>

            {/* Review Type Filters */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Review Type
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.verified}
                    onChange={(e) => handleFilterChange('verified', e.target.checked)}
                    className="text-blue-600 focus:ring-blue-500 rounded"
                  />
                  <span className="text-sm text-gray-700">Verified bookings only</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.withPhotos}
                    onChange={(e) => handleFilterChange('withPhotos', e.target.checked)}
                    className="text-blue-600 focus:ring-blue-500 rounded"
                  />
                  <span className="text-sm text-gray-700">Reviews with photos</span>
                </label>
              </div>
            </div>

            {/* Quick Filters */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quick Filters
              </label>
              <div className="flex flex-wrap gap-2">
                {['Recent', 'Detailed', 'Critical'].map((filter) => (
                  <button
                    key={filter}
                    className="px-3 py-1 text-sm border border-gray-300 rounded-full hover:bg-gray-50 transition-colors"
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Active Filters Display */}
      {activeFiltersCount > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-gray-600">Active filters:</span>
            
            {searchQuery && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                Search: "{searchQuery}"
                <button
                  onClick={() => {
                    setSearchQuery('');
                    onSearch('');
                  }}
                  className="hover:text-blue-600"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            
            {filters.rating && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                {filters.rating}+ stars
                <button
                  onClick={() => handleFilterChange('rating', null)}
                  className="hover:text-blue-600"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            
            {filters.verified && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                Verified only
                <button
                  onClick={() => handleFilterChange('verified', false)}
                  className="hover:text-blue-600"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            
            {filters.withPhotos && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                With photos
                <button
                  onClick={() => handleFilterChange('withPhotos', false)}
                  className="hover:text-blue-600"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewFilters;