import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Settings, 
  Eye, 
  Save,
  Clock,
  CheckCircle,
  AlertCircle,
  Plane,
  Building
} from 'lucide-react';
import FlightSeatMap from '../components/SeatSelection/FlightSeatMap';
import HotelRoomMap from '../components/SeatSelection/HotelRoomMap';
import SeatPreferences from '../components/SeatSelection/SeatPreferences';
import SeatDetails3D from '../components/SeatSelection/SeatDetails3D';
import PremiumUpsell from '../components/SeatSelection/PremiumUpsell';
import { 
  getFlightSeatMap, 
  getHotelRoomMap, 
  selectSeat, 
  selectRoom,
  getUserPreferences,
  saveUserPreferences
} from '../api/seatSelection';

const SeatSelectionPage = ({ 
  type = 'flight', // 'flight' or 'hotel'
  itemId,
  itemName,
  aircraftType,
  hotelType,
  checkIn,
  checkOut,
  onBack,
  onComplete
}) => {
  const [currentStep, setCurrentStep] = useState('selection'); // 'selection', 'preferences', 'upsell', 'confirmation'
  const [selectedItem, setSelectedItem] = useState(null);
  const [userPreferences, setUserPreferences] = useState(null);
  const [showPreferences, setShowPreferences] = useState(false);
  const [show3DDetails, setShow3DDetails] = useState(false);
  const [detailsItem, setDetailsItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [holdExpiry, setHoldExpiry] = useState(null);
  const [showUpsell, setShowUpsell] = useState(false);

  const currentUserId = 'current_user'; // In real app, get from auth context

  useEffect(() => {
    loadUserPreferences();
  }, []);

  useEffect(() => {
    // Set up hold expiry timer
    if (selectedItem && holdExpiry) {
      const timer = setInterval(() => {
        const now = new Date();
        const expiry = new Date(holdExpiry);
        if (now >= expiry) {
          setSelectedItem(null);
          setHoldExpiry(null);
          setError('Your seat/room hold has expired. Please select again.');
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [selectedItem, holdExpiry]);

  const loadUserPreferences = async () => {
    try {
      const response = await getUserPreferences(currentUserId);
      setUserPreferences(response.data);
    } catch (error) {
      console.error('Failed to load preferences:', error);
    }
  };

  const handleItemSelect = async (item) => {
    try {
      setLoading(true);
      setError(null);

      let response;
      if (type === 'flight') {
        response = await selectSeat(itemId, item.id, currentUserId);
      } else {
        response = await selectRoom(itemId, item.id, currentUserId, checkIn, checkOut);
      }

      setSelectedItem(item);
      setHoldExpiry(response.data.holdExpiry);
      
      // Show upsell if item is basic/economy
      if ((type === 'flight' && item.class === 'economy') || 
          (type === 'hotel' && item.type === 'standard')) {
        setShowUpsell(true);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePreferencesChange = (newPreferences) => {
    setUserPreferences(newPreferences);
  };

  const handleSavePreferences = async () => {
    try {
      await saveUserPreferences(currentUserId, userPreferences);
      setShowPreferences(false);
    } catch (error) {
      setError('Failed to save preferences');
    }
  };

  const handleShow3DDetails = (item) => {
    setDetailsItem(item);
    setShow3DDetails(true);
  };

  const handleUpgrade = (upgradeOption) => {
    // In real app, this would process the upgrade
    console.log('Upgrading to:', upgradeOption);
    setShowUpsell(false);
    setCurrentStep('confirmation');
  };

  const handleDeclineUpgrade = () => {
    setShowUpsell(false);
    setCurrentStep('confirmation');
  };

  const handleComplete = () => {
    onComplete && onComplete({
      type,
      selectedItem,
      preferences: userPreferences,
      holdExpiry
    });
  };

  const getTimeRemaining = () => {
    if (!holdExpiry) return null;
    
    const now = new Date();
    const expiry = new Date(holdExpiry);
    const diff = expiry - now;
    
    if (diff <= 0) return null;
    
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const timeRemaining = getTimeRemaining();

  if (showUpsell) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <PremiumUpsell
            currentSelection={selectedItem}
            type={type}
            onUpgrade={handleUpgrade}
            onDecline={handleDeclineUpgrade}
          />
        </div>
      </div>
    );
  }

  if (currentStep === 'confirmation') {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {type === 'flight' ? 'Seat Reserved!' : 'Room Reserved!'}
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              Your {type === 'flight' ? `seat ${selectedItem?.id}` : `room ${selectedItem?.id}`} has been successfully reserved.
            </p>
            
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Reservation Details</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">
                    {type === 'flight' ? 'Seat:' : 'Room:'}
                  </span>
                  <span className="font-medium text-gray-900 ml-2">
                    {selectedItem?.id}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Type:</span>
                  <span className="font-medium text-gray-900 ml-2 capitalize">
                    {type === 'flight' ? selectedItem?.class : selectedItem?.type}
                  </span>
                </div>
                {type === 'hotel' && (
                  <>
                    <div>
                      <span className="text-gray-600">Check-in:</span>
                      <span className="font-medium text-gray-900 ml-2">{checkIn}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Check-out:</span>
                      <span className="font-medium text-gray-900 ml-2">{checkOut}</span>
                    </div>
                  </>
                )}
                <div>
                  <span className="text-gray-600">Price:</span>
                  <span className="font-medium text-gray-900 ml-2">
                    {selectedItem?.price > 0 ? `₹${selectedItem.price.toLocaleString()}` : 'Included'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Hold Expires:</span>
                  <span className="font-medium text-red-600 ml-2">{timeRemaining}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center space-x-4">
              <button
                onClick={onBack}
                className="px-6 py-3 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Back to Selection
              </button>
              <button
                onClick={handleComplete}
                className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Continue to Payment
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={onBack}
                className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
              >
                <ArrowLeft className="w-5 h-5 mr-1" />
                Back
              </button>
              <div className="flex items-center">
                {type === 'flight' ? (
                  <Plane className="w-6 h-6 text-blue-600 mr-3" />
                ) : (
                  <Building className="w-6 h-6 text-green-600 mr-3" />
                )}
                <div>
                  <h1 className="text-xl font-bold text-gray-900">
                    Select Your {type === 'flight' ? 'Seat' : 'Room'}
                  </h1>
                  <p className="text-sm text-gray-600">{itemName}</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Hold Timer */}
              {selectedItem && timeRemaining && (
                <div className="flex items-center bg-red-50 text-red-700 px-3 py-2 rounded-md">
                  <Clock className="w-4 h-4 mr-2" />
                  <span className="text-sm font-medium">Hold expires in {timeRemaining}</span>
                </div>
              )}
              
              {/* Preferences Button */}
              <button
                onClick={() => setShowPreferences(true)}
                className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                <Settings className="w-4 h-4 mr-2" />
                Preferences
              </button>
              
              {/* 3D View Button */}
              {selectedItem && (
                <button
                  onClick={() => handleShow3DDetails(selectedItem)}
                  className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  3D View
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
              <span className="text-red-800">{error}</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {type === 'flight' ? (
          <FlightSeatMap
            flightId={itemId}
            aircraftType={aircraftType}
            onSeatSelect={handleItemSelect}
            selectedSeat={selectedItem?.id}
            userPreferences={userPreferences}
            showPricing={true}
          />
        ) : (
          <HotelRoomMap
            hotelId={itemId}
            checkIn={checkIn}
            checkOut={checkOut}
            onRoomSelect={handleItemSelect}
            selectedRoom={selectedItem?.id}
            userPreferences={userPreferences}
            showPricing={true}
          />
        )}

        {/* Continue Button */}
        {selectedItem && (
          <div className="mt-8 flex justify-center">
            <button
              onClick={() => setCurrentStep('confirmation')}
              className="flex items-center px-8 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 text-lg font-medium"
            >
              <Save className="w-5 h-5 mr-2" />
              Continue with {type === 'flight' ? `Seat ${selectedItem.id}` : `Room ${selectedItem.id}`}
            </button>
          </div>
        )}
      </div>

      {/* Preferences Modal */}
      {showPreferences && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                {type === 'flight' ? 'Seat' : 'Room'} Preferences
              </h2>
              <button
                onClick={() => setShowPreferences(false)}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              <SeatPreferences
                userId={currentUserId}
                type={type}
                initialPreferences={userPreferences}
                onPreferencesChange={handlePreferencesChange}
              />
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowPreferences(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSavePreferences}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Save Preferences
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3D Details Modal */}
      {show3DDetails && detailsItem && (
        <SeatDetails3D
          seat={type === 'flight' ? detailsItem : null}
          room={type === 'hotel' ? detailsItem : null}
          type={type}
          onClose={() => setShow3DDetails(false)}
          onSelect={handleItemSelect}
          isSelected={selectedItem?.id === detailsItem.id}
        />
      )}
    </div>
  );
};

export default SeatSelectionPage;