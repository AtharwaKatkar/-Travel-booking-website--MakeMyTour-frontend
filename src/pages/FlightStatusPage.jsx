import React, { useState, useEffect } from 'react';
import { Plane, Search, BarChart3, Bell, RefreshCw, AlertCircle } from 'lucide-react';
import FlightSearch from '../components/FlightStatus/FlightSearch';
import FlightStatusCard from '../components/FlightStatus/FlightStatusCard';
import FlightTracker from '../components/FlightStatus/FlightTracker';
import FlightStatistics from '../components/FlightStatus/FlightStatistics';
import NotificationManager from '../components/FlightStatus/NotificationManager';
import { useServiceWorker } from '../hooks/useServiceWorker';
import { 
  getAllFlightStatuses, 
  getFlightStatus, 
  searchFlightsByRoute 
} from '../api/flightStatus';

const FlightStatusPage = () => {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [showTracker, setShowTracker] = useState(false);
  const [trackedFlight, setTrackedFlight] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [trackedFlights, setTrackedFlights] = useState([]);
  const [activeTab, setActiveTab] = useState('search'); // 'search', 'all', 'statistics'
  
  const { requestNotificationPermission, subscribeToNotifications } = useServiceWorker();

  useEffect(() => {
    // Load all flights on component mount
    loadAllFlights();
    
    // Load tracked flights from localStorage
    const saved = localStorage.getItem('trackedFlights');
    if (saved) {
      setTrackedFlights(JSON.parse(saved));
    }
  }, []);

  const loadAllFlights = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAllFlightStatuses();
      setFlights(response.data);
    } catch (err) {
      setError('Failed to load flight statuses. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFlightNumberSearch = async (flightNumber) => {
    try {
      setLoading(true);
      setError(null);
      const response = await getFlightStatus(flightNumber);
      setSearchResults([response.data]);
      setActiveTab('search');
    } catch (err) {
      setError(`Flight ${flightNumber} not found. Please check the flight number and try again.`);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRouteSearch = async (from, to) => {
    try {
      setLoading(true);
      setError(null);
      const response = await searchFlightsByRoute(from, to);
      setSearchResults(response.data);
      setActiveTab('search');
      
      if (response.data.length === 0) {
        setError(`No flights found from ${from} to ${to}.`);
      }
    } catch (err) {
      setError('Failed to search flights. Please try again.');
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleTrackFlight = (flightNumber) => {
    setTrackedFlight(flightNumber);
    setShowTracker(true);
    
    // Add to tracked flights if not already tracked
    if (!trackedFlights.includes(flightNumber)) {
      const newTrackedFlights = [...trackedFlights, flightNumber];
      setTrackedFlights(newTrackedFlights);
      localStorage.setItem('trackedFlights', JSON.stringify(newTrackedFlights));
    }
  };

  const handleCloseTracker = () => {
    setShowTracker(false);
    setTrackedFlight(null);
  };

  const tabs = [
    { id: 'search', label: 'Search Flights', icon: Search },
    { id: 'all', label: 'All Flights', icon: Plane },
    { id: 'statistics', label: 'Statistics', icon: BarChart3 }
  ];

  const displayFlights = activeTab === 'search' ? searchResults : flights;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Plane className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Live Flight Status</h1>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowNotifications(true)}
                className="p-2 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 transition-colors relative"
                title="Notification Settings"
              >
                <Bell className="w-5 h-5" />
                {trackedFlights.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {trackedFlights.length}
                  </span>
                )}
              </button>
              <button
                onClick={loadAllFlights}
                disabled={loading}
                className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
                title="Refresh All Flights"
              >
                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 mb-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        {activeTab === 'search' && (
          <div className="space-y-8">
            <FlightSearch
              onSearch={handleRouteSearch}
              onFlightNumberSearch={handleFlightNumberSearch}
              loading={loading}
            />
            
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <p className="text-red-800">{error}</p>
                </div>
              </div>
            )}

            {searchResults.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Search Results ({searchResults.length})
                </h2>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
                  {searchResults.map((flight) => (
                    <FlightStatusCard
                      key={flight.id}
                      flight={flight}
                      onTrack={handleTrackFlight}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'all' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                All Flights ({flights.length})
              </h2>
              <p className="text-sm text-gray-600">
                Updates automatically every 30 seconds
              </p>
            </div>

            {loading && flights.length === 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg shadow-md border border-gray-200 p-6 animate-pulse">
                    <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
                {displayFlights.map((flight) => (
                  <FlightStatusCard
                    key={flight.id}
                    flight={flight}
                    onTrack={handleTrackFlight}
                  />
                ))}
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <p className="text-red-800">{error}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'statistics' && (
          <div>
            <FlightStatistics />
          </div>
        )}
      </div>

      {/* Flight Tracker Modal */}
      {showTracker && trackedFlight && (
        <FlightTracker
          flightNumber={trackedFlight}
          onClose={handleCloseTracker}
          onNotificationToggle={(enabled) => {
            console.log('Notifications', enabled ? 'enabled' : 'disabled', 'for', trackedFlight);
          }}
        />
      )}

      {/* Notification Settings Modal */}
      {showNotifications && (
        <NotificationManager
          isOpen={showNotifications}
          onClose={() => setShowNotifications(false)}
          trackedFlights={trackedFlights}
        />
      )}
    </div>
  );
};

export default FlightStatusPage;