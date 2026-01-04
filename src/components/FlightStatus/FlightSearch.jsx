import React, { useState } from 'react';
import { Search, Plane, MapPin } from 'lucide-react';

const FlightSearch = ({ onSearch, onFlightNumberSearch, loading }) => {
  const [searchType, setSearchType] = useState('flightNumber'); // 'flightNumber' or 'route'
  const [flightNumber, setFlightNumber] = useState('');
  const [fromCity, setFromCity] = useState('');
  const [toCity, setToCity] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (searchType === 'flightNumber') {
      if (flightNumber.trim()) {
        onFlightNumberSearch(flightNumber.trim());
      }
    } else {
      if (fromCity.trim() && toCity.trim()) {
        onSearch(fromCity.trim(), toCity.trim());
      }
    }
  };

  const popularRoutes = [
    { from: 'Delhi', to: 'Mumbai', code: 'DEL-BOM' },
    { from: 'Bangalore', to: 'Chennai', code: 'BLR-MAA' },
    { from: 'Mumbai', to: 'Delhi', code: 'BOM-DEL' },
    { from: 'Kolkata', to: 'Guwahati', code: 'CCU-GAU' }
  ];

  const sampleFlights = ['AI101', '6E205', 'SG8157', 'UK955', 'G8394'];

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Flight Status Search</h2>
      
      {/* Search Type Toggle */}
      <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
        <button
          type="button"
          onClick={() => setSearchType('flightNumber')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            searchType === 'flightNumber'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Plane className="w-4 h-4 inline mr-2" />
          Flight Number
        </button>
        <button
          type="button"
          onClick={() => setSearchType('route')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            searchType === 'route'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <MapPin className="w-4 h-4 inline mr-2" />
          By Route
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {searchType === 'flightNumber' ? (
          <div className="space-y-4">
            <div>
              <label htmlFor="flightNumber" className="block text-sm font-medium text-gray-700 mb-2">
                Flight Number
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="flightNumber"
                  value={flightNumber}
                  onChange={(e) => setFlightNumber(e.target.value.toUpperCase())}
                  placeholder="e.g., AI101, 6E205"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <Plane className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>
            </div>
            
            {/* Sample Flights */}
            <div>
              <p className="text-sm text-gray-600 mb-2">Try these sample flights:</p>
              <div className="flex flex-wrap gap-2">
                {sampleFlights.map((flight) => (
                  <button
                    key={flight}
                    type="button"
                    onClick={() => setFlightNumber(flight)}
                    className="px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors"
                  >
                    {flight}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="fromCity" className="block text-sm font-medium text-gray-700 mb-2">
                  From
                </label>
                <input
                  type="text"
                  id="fromCity"
                  value={fromCity}
                  onChange={(e) => setFromCity(e.target.value)}
                  placeholder="e.g., Delhi, Mumbai"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label htmlFor="toCity" className="block text-sm font-medium text-gray-700 mb-2">
                  To
                </label>
                <input
                  type="text"
                  id="toCity"
                  value={toCity}
                  onChange={(e) => setToCity(e.target.value)}
                  placeholder="e.g., Chennai, Bangalore"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            {/* Popular Routes */}
            <div>
              <p className="text-sm text-gray-600 mb-2">Popular routes:</p>
              <div className="grid grid-cols-2 gap-2">
                {popularRoutes.map((route) => (
                  <button
                    key={route.code}
                    type="button"
                    onClick={() => {
                      setFromCity(route.from);
                      setToCity(route.to);
                    }}
                    className="px-3 py-2 text-sm bg-gray-50 text-gray-700 rounded-md hover:bg-gray-100 transition-colors text-left"
                  >
                    {route.from} → {route.to}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={loading || (searchType === 'flightNumber' ? !flightNumber.trim() : !fromCity.trim() || !toCity.trim())}
          className="w-full mt-6 bg-blue-600 text-white py-3 px-4 rounded-md font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Searching...
            </>
          ) : (
            <>
              <Search className="w-4 h-4" />
              Search Flights
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default FlightSearch;