import React, { useState, useEffect } from 'react';
import { 
  Eye, 
  Navigation, 
  Users, 
  Zap, 
  Wifi, 
  Coffee, 
  Maximize2,
  RotateCcw,
  Volume2,
  Wind,
  Bed,
  Bath,
  Tv,
  Car,
  Crown,
  Star,
  X,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause
} from 'lucide-react';

const SeatDetails3D = ({ 
  seat, 
  room, 
  type = 'flight', 
  onClose, 
  onSelect,
  isSelected = false 
}) => {
  const [currentView, setCurrentView] = useState(0);
  const [isRotating, setIsRotating] = useState(false);
  const [showFeatures, setShowFeatures] = useState(true);

  const item = type === 'flight' ? seat : room;
  
  // Mock 3D views/images for demonstration
  const get3DViews = () => {
    if (type === 'flight') {
      return [
        { 
          name: 'Seat View', 
          image: '/api/placeholder/600/400',
          description: 'Your seat from passenger perspective'
        },
        { 
          name: 'Side View', 
          image: '/api/placeholder/600/400',
          description: 'Side profile showing legroom and recline'
        },
        { 
          name: 'Cabin View', 
          image: '/api/placeholder/600/400',
          description: 'View of the cabin section'
        },
        { 
          name: 'Window View', 
          image: '/api/placeholder/600/400',
          description: 'View from the window (if window seat)'
        }
      ];
    } else {
      return [
        { 
          name: 'Room Overview', 
          image: '/api/placeholder/600/400',
          description: 'Complete room layout and design'
        },
        { 
          name: 'Bedroom', 
          image: '/api/placeholder/600/400',
          description: 'Sleeping area with bed and furnishings'
        },
        { 
          name: 'Bathroom', 
          image: '/api/placeholder/600/400',
          description: 'Private bathroom facilities'
        },
        { 
          name: 'View', 
          image: '/api/placeholder/600/400',
          description: `${room?.features?.view || 'Room'} view from window`
        },
        { 
          name: 'Balcony', 
          image: '/api/placeholder/600/400',
          description: 'Private balcony space (if available)'
        }
      ];
    }
  };

  const views = get3DViews();

  useEffect(() => {
    let interval;
    if (isRotating) {
      interval = setInterval(() => {
        setCurrentView(prev => (prev + 1) % views.length);
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isRotating, views.length]);

  const nextView = () => {
    setCurrentView(prev => (prev + 1) % views.length);
  };

  const prevView = () => {
    setCurrentView(prev => (prev - 1 + views.length) % views.length);
  };

  const getFeatureIcon = (feature) => {
    const iconMap = {
      window: Eye,
      aisle: Navigation,
      middle: Users,
      extraLegroom: Maximize2,
      powerOutlet: Zap,
      wifi: Wifi,
      meal: Coffee,
      quiet: Volume2,
      balcony: Wind,
      bed: Bed,
      bathroom: Bath,
      tv: Tv,
      parking: Car,
      suite: Crown,
      premium: Star
    };
    return iconMap[feature] || Star;
  };

  const getItemFeatures = () => {
    if (type === 'flight' && seat) {
      return [
        { key: 'class', label: 'Class', value: seat.class?.charAt(0).toUpperCase() + seat.class?.slice(1) },
        { key: 'type', label: 'Type', value: seat.type?.charAt(0).toUpperCase() + seat.type?.slice(1) },
        { key: 'window', label: 'Window Seat', value: seat.features?.window, icon: 'window' },
        { key: 'aisle', label: 'Aisle Access', value: seat.features?.aisle, icon: 'aisle' },
        { key: 'extraLegroom', label: 'Extra Legroom', value: seat.features?.extraLegroom, icon: 'extraLegroom' },
        { key: 'powerOutlet', label: 'Power Outlet', value: seat.features?.powerOutlet, icon: 'powerOutlet' },
        { key: 'wifi', label: 'WiFi Available', value: seat.features?.wifi, icon: 'wifi' },
        { key: 'meal', label: 'Meal Service', value: seat.features?.meal, icon: 'meal' }
      ];
    } else if (type === 'hotel' && room) {
      return [
        { key: 'type', label: 'Room Type', value: room.name },
        { key: 'size', label: 'Size', value: room.size },
        { key: 'floor', label: 'Floor', value: `Floor ${room.floor}` },
        { key: 'view', label: 'View', value: room.features?.view?.charAt(0).toUpperCase() + room.features?.view?.slice(1) },
        { key: 'balcony', label: 'Private Balcony', value: room.features?.balcony, icon: 'balcony' },
        { key: 'corner', label: 'Corner Room', value: room.features?.corner, icon: 'premium' },
        { key: 'wifi', label: 'WiFi', value: room.features?.wifi, icon: 'wifi' },
        { key: 'tv', label: 'Smart TV', value: room.features?.tv, icon: 'tv' }
      ];
    }
    return [];
  };

  const features = getItemFeatures();

  const getRecommendations = () => {
    if (type === 'flight' && seat) {
      const recommendations = [];
      if (seat.features?.window) recommendations.push('Perfect for photography and sightseeing');
      if (seat.features?.aisle) recommendations.push('Easy access to restroom and stretching');
      if (seat.features?.extraLegroom) recommendations.push('Ideal for tall passengers or long flights');
      if (seat.class === 'business') recommendations.push('Premium dining and priority boarding included');
      if (seat.features?.powerOutlet) recommendations.push('Keep your devices charged throughout the flight');
      return recommendations;
    } else if (type === 'hotel' && room) {
      const recommendations = [];
      if (room.features?.view === 'ocean') recommendations.push('Stunning ocean views perfect for relaxation');
      if (room.type === 'suite') recommendations.push('Spacious layout ideal for business or leisure');
      if (room.features?.corner) recommendations.push('Extra privacy and unique room layout');
      if (room.floor >= 4) recommendations.push('Quieter location away from street noise');
      if (room.features?.balcony) recommendations.push('Private outdoor space for morning coffee');
      return recommendations;
    }
    return [];
  };

  const recommendations = getRecommendations();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {type === 'flight' ? `Seat ${seat?.id}` : `Room ${room?.id}`}
            </h2>
            <p className="text-gray-600">
              {type === 'flight' 
                ? `${seat?.class?.charAt(0).toUpperCase() + seat?.class?.slice(1)} Class • ${seat?.type} seat`
                : `${room?.name} • ${room?.size}`
              }
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowFeatures(!showFeatures)}
              className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
            >
              {showFeatures ? 'Hide Details' : 'Show Details'}
            </button>
            <button
              onClick={onClose}
              className="p-2 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex">
          {/* 3D Preview */}
          <div className="flex-1 p-6">
            <div className="relative bg-gray-100 rounded-lg overflow-hidden">
              {/* Image Display */}
              <div className="aspect-video relative">
                <img
                  src={views[currentView]?.image}
                  alt={views[currentView]?.name}
                  className="w-full h-full object-cover"
                />
                
                {/* Navigation Arrows */}
                <button
                  onClick={prevView}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-opacity"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextView}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-opacity"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                {/* Auto-rotate Toggle */}
                <button
                  onClick={() => setIsRotating(!isRotating)}
                  className="absolute top-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-opacity"
                >
                  {isRotating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>

                {/* View Info Overlay */}
                <div className="absolute bottom-4 left-4 bg-black bg-opacity-75 text-white px-3 py-2 rounded-md">
                  <div className="font-medium">{views[currentView]?.name}</div>
                  <div className="text-sm opacity-90">{views[currentView]?.description}</div>
                </div>
              </div>

              {/* View Thumbnails */}
              <div className="p-4 bg-white border-t border-gray-200">
                <div className="flex space-x-2 overflow-x-auto">
                  {views.map((view, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentView(index)}
                      className={`flex-shrink-0 w-20 h-12 rounded-md overflow-hidden border-2 transition-colors ${
                        currentView === index ? 'border-blue-500' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <img
                        src={view.image}
                        alt={view.name}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Details Panel */}
          {showFeatures && (
            <div className="w-80 border-l border-gray-200 p-6 overflow-y-auto">
              {/* Features */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Features & Amenities</h3>
                <div className="space-y-3">
                  {features.map((feature) => {
                    if (typeof feature.value === 'boolean') {
                      if (!feature.value) return null;
                      const IconComponent = getFeatureIcon(feature.icon);
                      return (
                        <div key={feature.key} className="flex items-center">
                          <IconComponent className="w-4 h-4 text-green-600 mr-3" />
                          <span className="text-sm text-gray-700">{feature.label}</span>
                        </div>
                      );
                    } else {
                      return (
                        <div key={feature.key} className="flex justify-between">
                          <span className="text-sm text-gray-600">{feature.label}:</span>
                          <span className="text-sm font-medium text-gray-900">{feature.value}</span>
                        </div>
                      );
                    }
                  })}
                </div>
              </div>

              {/* Recommendations */}
              {recommendations.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Why Choose This {type === 'flight' ? 'Seat' : 'Room'}?</h3>
                  <div className="space-y-2">
                    {recommendations.map((rec, index) => (
                      <div key={index} className="flex items-start">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-sm text-gray-700">{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Amenities List (for hotels) */}
              {type === 'hotel' && room?.amenities && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Room Amenities</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {room.amenities.map((amenity, index) => (
                      <div key={index} className="flex items-center text-sm text-gray-700">
                        <div className="w-2 h-2 bg-green-600 rounded-full mr-2"></div>
                        {amenity}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Pricing */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Pricing</h3>
                {item?.price > 0 ? (
                  <div>
                    <div className="text-2xl font-bold text-green-600">
                      +₹{item.price.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">
                      {type === 'flight' ? 'additional cost' : 'per night upgrade'}
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="text-2xl font-bold text-gray-600">Included</div>
                    <div className="text-sm text-gray-600">No additional cost</div>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <button
                onClick={() => onSelect(item)}
                disabled={isSelected}
                className={`w-full py-3 px-4 rounded-md font-medium transition-colors ${
                  isSelected
                    ? 'bg-green-100 text-green-800 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {isSelected ? (
                  <>
                    <Star className="w-4 h-4 inline mr-2" />
                    Selected
                  </>
                ) : (
                  `Select This ${type === 'flight' ? 'Seat' : 'Room'}`
                )}
              </button>

              {/* Additional Info */}
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <div className="text-sm text-blue-800">
                  <div className="font-medium mb-1">💡 Pro Tip</div>
                  {type === 'flight' ? (
                    seat?.features?.window ? 
                      'Window seats are perfect for photography during takeoff and landing!' :
                      seat?.features?.aisle ?
                        'Aisle seats offer easy access to restrooms and overhead bins.' :
                        'Middle seats often have the best armrest access!'
                  ) : (
                    room?.features?.view === 'ocean' ?
                      'Ocean view rooms are most popular during sunrise and sunset!' :
                      room?.floor >= 4 ?
                        'Higher floors typically offer better views and less noise.' :
                        'Lower floors provide quicker access to hotel amenities.'
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SeatDetails3D;