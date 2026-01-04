import { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Snowflake, 
  BarChart3, 
  RefreshCw,
  AlertCircle,
  Calendar,
  Plane,
  Building,
  Search,
  Filter
} from 'lucide-react';
import PriceHistoryChart from './PriceHistoryChart';
import PriceFreezeCard from './PriceFreezeCard';
import DemandFactors from './DemandFactors';
import { 
  getFlightPricing,
  getHotelPricing,
  getPriceHistory,
  createPriceFreeze,
  usePriceFreeze,
  getUserPriceFreezes,
  getPricingAnalytics,
  initializeSamplePricingData
} from '../../api/pricing';

const PricingDashboard = () => {
  const [activeTab, setActiveTab] = useState('flights');
  const [selectedItem, setSelectedItem] = useState(null);
  const [priceHistory, setPriceHistory] = useState([]);
  const [userFreezes, setUserFreezes] = useState({ active: [], used: [], expired: [] });
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  // Sample items for demo
  const sampleFlights = [
    { id: 'AI101', name: 'Air India AI101', route: 'Delhi → Mumbai', date: '2026-02-15' },
    { id: 'SG102', name: 'SpiceJet SG102', route: 'Mumbai → Bangalore', date: '2026-02-20' },
    { id: '6E103', name: 'IndiGo 6E103', route: 'Delhi → Goa', date: '2026-03-01' }
  ];

  const sampleHotels = [
    { id: 'TAJ001', name: 'The Taj Mahal Palace', location: 'Mumbai', checkIn: '2026-02-15', checkOut: '2026-02-17' },
    { id: 'OBR002', name: 'The Oberoi', location: 'Delhi', checkIn: '2026-02-20', checkOut: '2026-02-22' },
    { id: 'ITC003', name: 'ITC Grand Chola', location: 'Chennai', checkIn: '2026-03-01', checkOut: '2026-03-03' }
  ];

  useEffect(() => {
    initializeData();
  }, []);

  useEffect(() => {
    if (selectedItem) {
      loadItemData();
    }
  }, [selectedItem, activeTab]);

  const initializeData = async () => {
    try {
      setLoading(true);
      
      // Initialize sample data
      await initializeSamplePricingData();
      
      // Load analytics and user freezes
      const [analyticsResponse, freezesResponse] = await Promise.all([
        getPricingAnalytics(),
        getUserPriceFreezes('user123')
      ]);
      
      setAnalytics(analyticsResponse.data);
      setUserFreezes(freezesResponse.data);
      
      // Select first item by default
      setSelectedItem(activeTab === 'flights' ? sampleFlights[0] : sampleHotels[0]);
      
    } catch (err) {
      setError(err.message || 'Failed to load pricing data');
    } finally {
      setLoading(false);
    }
  };

  const loadItemData = async () => {
    if (!selectedItem) return;

    try {
      setRefreshing(true);
      
      let pricingResponse, historyResponse;
      
      if (activeTab === 'flights') {
        pricingResponse = await getFlightPricing(selectedItem.id, selectedItem.date);
        historyResponse = await getPriceHistory('flight', selectedItem.id);
      } else {
        pricingResponse = await getHotelPricing(selectedItem.id, selectedItem.checkIn, selectedItem.checkOut);
        historyResponse = await getPriceHistory('hotel', selectedItem.id);
      }
      
      setSelectedItem({
        ...selectedItem,
        pricing: pricingResponse.data
      });
      
      if (historyResponse.success) {
        setPriceHistory(historyResponse.data.priceHistory);
      }
      
    } catch (err) {
      console.error('Error loading item data:', err);
    } finally {
      setRefreshing(false);
    }
  };

  const handleCreatePriceFreeze = async (itemType, itemId, currentPrice) => {
    try {
      const response = await createPriceFreeze('user123', itemType, itemId, currentPrice);
      
      if (response.success) {
        // Refresh user freezes
        const freezesResponse = await getUserPriceFreezes('user123');
        setUserFreezes(freezesResponse.data);
        
        alert('Price freeze created successfully!');
      } else {
        alert(response.error || 'Failed to create price freeze');
      }
    } catch (error) {
      alert('Error creating price freeze: ' + error.message);
    }
  };

  const handleUsePriceFreeze = async (freezeId) => {
    try {
      const response = await usePriceFreeze(freezeId, 'user123');
      
      if (response.success) {
        // Refresh user freezes
        const freezesResponse = await getUserPriceFreezes('user123');
        setUserFreezes(freezesResponse.data);
        
        alert(response.data.message);
      } else {
        alert(response.error || 'Failed to use price freeze');
      }
    } catch (error) {
      alert('Error using price freeze: ' + error.message);
    }
  };

  const handleRefresh = async () => {
    await loadItemData();
    
    // Refresh analytics
    try {
      const analyticsResponse = await getPricingAnalytics();
      setAnalytics(analyticsResponse.data);
    } catch (error) {
      console.error('Error refreshing analytics:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
          <span className="text-gray-600">Loading pricing data...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Data</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={initializeData}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const currentItems = activeTab === 'flights' ? sampleFlights : sampleHotels;
  const existingFreeze = selectedItem ? userFreezes.active.find(f => 
    f.itemType === activeTab.slice(0, -1) && f.itemId === selectedItem.id
  ) : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dynamic Pricing Engine</h1>
          <p className="text-gray-600 mt-2">
            Real-time pricing with demand-based adjustments and price freeze protection
          </p>
        </div>

        {/* Analytics Cards */}
        {analytics && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Price Changes</p>
                  <p className="text-2xl font-bold text-gray-900">{analytics.totalPriceChanges}</p>
                </div>
                <BarChart3 className="w-8 h-8 text-blue-600" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Avg. Increase</p>
                  <p className="text-2xl font-bold text-red-600">₹{analytics.averagePriceIncrease}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-red-600" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Freezes</p>
                  <p className="text-2xl font-bold text-blue-600">{analytics.priceFreezesActive}</p>
                </div>
                <Snowflake className="w-8 h-8 text-blue-600" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Savings</p>
                  <p className="text-2xl font-bold text-green-600">₹{analytics.totalSavingsFromFreezes.toLocaleString()}</p>
                </div>
                <Calendar className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="flex">
            <button
              onClick={() => {
                setActiveTab('flights');
                setSelectedItem(sampleFlights[0]);
              }}
              className={`flex items-center px-6 py-4 text-sm font-medium rounded-l-lg transition-colors ${
                activeTab === 'flights'
                  ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Plane className="w-4 h-4 mr-2" />
              Flight Pricing
            </button>
            <button
              onClick={() => {
                setActiveTab('hotels');
                setSelectedItem(sampleHotels[0]);
              }}
              className={`flex items-center px-6 py-4 text-sm font-medium rounded-r-lg transition-colors ${
                activeTab === 'hotels'
                  ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Building className="w-4 h-4 mr-2" />
              Hotel Pricing
            </button>
          </div>
        </div>

        {/* Item Selection */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Select {activeTab === 'flights' ? 'Flight' : 'Hotel'}
            </h3>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {currentItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className={`p-4 text-left border rounded-lg transition-colors ${
                  selectedItem?.id === item.id
                    ? 'border-blue-300 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-medium text-gray-900">{item.name}</div>
                <div className="text-sm text-gray-600 mt-1">
                  {activeTab === 'flights' ? item.route : item.location}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {activeTab === 'flights' 
                    ? new Date(item.date).toLocaleDateString()
                    : `${new Date(item.checkIn).toLocaleDateString()} - ${new Date(item.checkOut).toLocaleDateString()}`
                  }
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        {selectedItem && selectedItem.pricing && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Price History and Demand Factors */}
            <div className="lg:col-span-2 space-y-6">
              <PriceHistoryChart
                itemType={activeTab.slice(0, -1)}
                itemId={selectedItem.id}
                priceHistory={priceHistory}
                currentPrice={selectedItem.pricing.currentPrice}
                basePrice={selectedItem.pricing.basePrice}
              />
              
              <DemandFactors
                demandFactors={selectedItem.pricing.demandFactors}
                occupancyRate={selectedItem.pricing.occupancyRate}
                bookingTrend={selectedItem.pricing.bookingTrend}
              />
            </div>

            {/* Right Column - Price Freeze */}
            <div className="space-y-6">
              <PriceFreezeCard
                itemType={activeTab.slice(0, -1)}
                itemId={selectedItem.id}
                currentPrice={selectedItem.pricing.currentPrice}
                onCreateFreeze={handleCreatePriceFreeze}
                onUseFreeze={handleUsePriceFreeze}
                existingFreeze={existingFreeze}
              />

              {/* Current Pricing Info */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Pricing</h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Base Price:</span>
                    <span className="font-medium text-gray-900">
                      ₹{selectedItem.pricing.basePrice.toLocaleString()}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Current Price:</span>
                    <span className="font-bold text-lg text-gray-900">
                      ₹{selectedItem.pricing.currentPrice.toLocaleString()}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Price Change:</span>
                    <span className={`font-medium ${
                      selectedItem.pricing.priceChangePercentage > 0 ? 'text-red-600' : 
                      selectedItem.pricing.priceChangePercentage < 0 ? 'text-green-600' : 'text-gray-600'
                    }`}>
                      {selectedItem.pricing.priceChangePercentage > 0 ? '+' : ''}
                      {selectedItem.pricing.priceChangePercentage}%
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Availability:</span>
                    <span className="font-medium text-gray-900">
                      {activeTab === 'flights' 
                        ? `${selectedItem.pricing.availableSeats}/${selectedItem.pricing.totalSeats} seats`
                        : `${selectedItem.pricing.availableRooms}/${selectedItem.pricing.totalRooms} rooms`
                      }
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PricingDashboard;