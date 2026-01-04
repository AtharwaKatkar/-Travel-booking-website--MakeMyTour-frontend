import React, { useState } from 'react';
import { 
  Plane, 
  Building, 
  Eye, 
  Navigation, 
  Users, 
  Crown,
  Star,
  Waves,
  Bed,
  Settings,
  ArrowRight,
  CheckCircle,
  Clock,
  Zap,
  Wifi,
  Coffee
} from 'lucide-react';

const SeatSelectionDemo = () => {
  const [selectedDemo, setSelectedDemo] = useState('flight');
  const [selectedSeat, setSelectedSeat] = useState('12A');
  const [selectedRoom, setSelectedRoom] = useState('301');

  const flightFeatures = [
    { icon: Eye, title: 'Interactive Seat Maps', desc: 'Visual seat selection with real-time availability' },
    { icon: Crown, title: '3D Seat Preview', desc: 'Detailed 3D views of seats and cabin layout' },
    { icon: Settings, title: 'Smart Preferences', desc: 'Save preferences for faster future bookings' },
    { icon: ArrowRight, title: 'Premium Upsells', desc: 'Intelligent upgrade recommendations' },
    { icon: CheckCircle, title: 'Instant Confirmation', desc: 'Real-time seat reservation with hold timer' },
    { icon: Zap, title: 'Feature Highlights', desc: 'Power outlets, WiFi, meal service indicators' }
  ];

  const hotelFeatures = [
    { icon: Building, title: 'Floor Plan Views', desc: 'Interactive hotel floor maps with room layouts' },
    { icon: Waves, title: 'Room Previews', desc: '3D room tours with view and amenity details' },
    { icon: Star, title: 'Preference Matching', desc: 'AI-powered room recommendations' },
    { icon: Crown, title: 'Upgrade Options', desc: 'Smart upselling to premium room types' },
    { icon: Bed, title: 'Amenity Filters', desc: 'Filter by view, floor, balcony, and more' },
    { icon: Clock, title: 'Hold & Reserve', desc: 'Secure room holds with expiry timers' }
  ];

  const mockFlightSeats = [
    { id: '10A', class: 'economy', type: 'window', status: 'available', price: 500 },
    { id: '10B', class: 'economy', type: 'middle', status: 'available', price: 0 },
    { id: '10C', class: 'economy', type: 'aisle', status: 'available', price: 300 },
    { id: '11A', class: 'economy', type: 'window', status: 'occupied', price: 500 },
    { id: '11B', class: 'economy', type: 'middle', status: 'available', price: 0 },
    { id: '11C', class: 'economy', type: 'aisle', status: 'available', price: 300 },
    { id: '12A', class: 'economy', type: 'window', status: 'selected', price: 500 },
    { id: '12B', class: 'economy', type: 'middle', status: 'available', price: 0 },
    { id: '12C', class: 'economy', type: 'aisle', status: 'available', price: 300 },
    { id: '5A', class: 'premium', type: 'window', status: 'available', price: 8000 },
    { id: '5B', class: 'premium', type: 'middle', status: 'available', price: 8000 },
    { id: '5C', class: 'premium', type: 'aisle', status: 'available', price: 8000 },
    { id: '2A', class: 'business', type: 'window', status: 'available', price: 15000 },
    { id: '2B', class: 'business', type: 'aisle', status: 'available', price: 15000 }
  ];

  const mockHotelRooms = [
    { id: '201', type: 'standard', view: 'courtyard', status: 'available', price: 0 },
    { id: '202', type: 'deluxe', view: 'city', status: 'available', price: 5000 },
    { id: '203', type: 'deluxe', view: 'ocean', status: 'occupied', price: 5000 },
    { id: '301', type: 'suite', view: 'ocean', status: 'selected', price: 15000 },
    { id: '302', type: 'suite', view: 'ocean', status: 'available', price: 15000 },
    { id: '501', type: 'presidential', view: 'ocean', status: 'available', price: 35000 },
    { id: '502', type: 'presidential', view: 'ocean', status: 'maintenance', price: 35000 }
  ];

  const getSeatColor = (status: string, seatClass: string) => {
    if (status === 'selected') return 'bg-blue-600 text-white';
    if (status === 'occupied') return 'bg-red-400 text-white';
    if (status === 'blocked') return 'bg-gray-400 text-white';
    
    switch (seatClass) {
      case 'business': return 'bg-purple-100 hover:bg-purple-200 border-purple-300';
      case 'premium': return 'bg-yellow-100 hover:bg-yellow-200 border-yellow-300';
      default: return 'bg-green-100 hover:bg-green-200 border-green-300';
    }
  };

  const getRoomColor = (status: string, roomType: string) => {
    if (status === 'selected') return 'bg-blue-600 text-white';
    if (status === 'occupied') return 'bg-red-400 text-white';
    if (status === 'maintenance') return 'bg-gray-400 text-white';
    
    switch (roomType) {
      case 'presidential': return 'bg-purple-100 hover:bg-purple-200 border-purple-300';
      case 'suite': return 'bg-yellow-100 hover:bg-yellow-200 border-yellow-300';
      case 'deluxe': return 'bg-green-100 hover:bg-green-200 border-green-300';
      default: return 'bg-blue-100 hover:bg-blue-200 border-blue-300';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Seat & Room Selection System Demo
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Interactive maps, 3D previews, smart preferences, and premium upselling
          </p>
          
          {/* Demo Type Selector */}
          <div className="flex justify-center">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setSelectedDemo('flight')}
                className={`flex items-center gap-2 px-6 py-3 rounded-md transition-colors ${
                  selectedDemo === 'flight'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Plane className="w-5 h-5" />
                <span>Flight Seat Selection</span>
              </button>
              <button
                onClick={() => setSelectedDemo('hotel')}
                className={`flex items-center gap-2 px-6 py-3 rounded-md transition-colors ${
                  selectedDemo === 'hotel'
                    ? 'bg-white text-green-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Building className="w-5 h-5" />
                <span>Hotel Room Selection</span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Demo Area */}
          <div className="lg:col-span-2">
            {selectedDemo === 'flight' ? (
              /* Flight Seat Map Demo */
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Plane className="w-8 h-8 mr-3" />
                      <div>
                        <h2 className="text-2xl font-bold">Boeing 737-800</h2>
                        <p className="text-blue-100">AI101 - Delhi to Mumbai</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">156</div>
                      <div className="text-blue-100">seats available</div>
                    </div>
                  </div>
                </div>

                {/* Class Sections */}
                <div className="p-6">
                  <div className="space-y-6">
                    {/* Business Class */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-semibold text-gray-900">Business Class</h3>
                        <span className="text-sm text-purple-600 font-medium">+₹15,000</span>
                      </div>
                      <div className="flex justify-center space-x-2 mb-4">
                        {mockFlightSeats.filter(s => s.class === 'business').map(seat => (
                          <button
                            key={seat.id}
                            onClick={() => setSelectedSeat(seat.id)}
                            className={`w-10 h-8 rounded border-2 text-xs font-medium transition-all ${getSeatColor(seat.status, seat.class)}`}
                          >
                            {seat.id}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Premium Economy */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-semibold text-gray-900">Premium Economy</h3>
                        <span className="text-sm text-yellow-600 font-medium">+₹8,000</span>
                      </div>
                      <div className="flex justify-center space-x-2 mb-4">
                        {mockFlightSeats.filter(s => s.class === 'premium').map(seat => (
                          <button
                            key={seat.id}
                            onClick={() => setSelectedSeat(seat.id)}
                            className={`w-10 h-8 rounded border-2 text-xs font-medium transition-all ${getSeatColor(seat.status, seat.class)}`}
                          >
                            {seat.id}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Economy Class */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-semibold text-gray-900">Economy Class</h3>
                        <span className="text-sm text-green-600 font-medium">Included</span>
                      </div>
                      <div className="space-y-2">
                        {[10, 11, 12].map(row => (
                          <div key={row} className="flex justify-center items-center space-x-2">
                            <span className="w-6 text-center text-sm text-gray-600">{row}</span>
                            {mockFlightSeats.filter(s => s.id.startsWith(row.toString())).map(seat => (
                              <button
                                key={seat.id}
                                onClick={() => setSelectedSeat(seat.id)}
                                className={`w-10 h-8 rounded border-2 text-xs font-medium transition-all ${getSeatColor(seat.status, seat.class)}`}
                              >
                                {seat.id.slice(-1)}
                              </button>
                            ))}
                            <span className="w-6 text-center text-sm text-gray-600">{row}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Legend */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center">
                        <div className="w-6 h-6 bg-green-100 border border-green-300 rounded mr-2"></div>
                        <span>Available</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-6 h-6 bg-blue-600 rounded mr-2"></div>
                        <span>Selected</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-6 h-6 bg-red-400 rounded mr-2"></div>
                        <span>Occupied</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-6 h-6 bg-gray-400 rounded mr-2"></div>
                        <span>Blocked</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Selected Seat Info */}
                {selectedSeat && (
                  <div className="border-t border-gray-200 p-4 bg-blue-50">
                    {(() => {
                      const seat = mockFlightSeats.find(s => s.id === selectedSeat);
                      return (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                            <div>
                              <h4 className="font-semibold text-gray-900">Selected: Seat {seat?.id}</h4>
                              <p className="text-sm text-gray-600 capitalize">
                                {seat?.class} class • {seat?.type} seat
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            {(seat?.price ?? 0) > 0 ? (
                              <div className="text-lg font-bold text-green-600">
                                +₹{seat?.price?.toLocaleString()}
                              </div>
                            ) : (
                              <div className="text-lg font-bold text-gray-600">Included</div>
                            )}
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                )}
              </div>
            ) : (
              /* Hotel Room Map Demo */
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Building className="w-8 h-8 mr-3" />
                      <div>
                        <h2 className="text-2xl font-bold">The Taj Mahal Palace</h2>
                        <p className="text-green-100">Mumbai • 5-Star Luxury</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">78</div>
                      <div className="text-green-100">rooms available</div>
                    </div>
                  </div>
                </div>

                {/* Floor Plans */}
                <div className="p-6">
                  <div className="space-y-6">
                    {/* Floor 5 - Presidential */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-semibold text-gray-900">Floor 5 - Presidential Suites</h3>
                        <span className="text-sm text-purple-600 font-medium">+₹35,000/night</span>
                      </div>
                      <div className="flex justify-center space-x-2 mb-4">
                        {mockHotelRooms.filter(r => r.type === 'presidential').map(room => (
                          <button
                            key={room.id}
                            onClick={() => setSelectedRoom(room.id)}
                            className={`w-12 h-8 rounded border-2 text-xs font-medium transition-all flex items-center justify-center ${getRoomColor(room.status, room.type)}`}
                          >
                            {room.status === 'selected' ? <Crown className="w-3 h-3" /> : room.id}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Floor 3 - Suites */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-semibold text-gray-900">Floor 3 - Executive Suites</h3>
                        <span className="text-sm text-yellow-600 font-medium">+₹15,000/night</span>
                      </div>
                      <div className="flex justify-center space-x-2 mb-4">
                        {mockHotelRooms.filter(r => r.type === 'suite').map(room => (
                          <button
                            key={room.id}
                            onClick={() => setSelectedRoom(room.id)}
                            className={`w-12 h-8 rounded border-2 text-xs font-medium transition-all flex items-center justify-center ${getRoomColor(room.status, room.type)}`}
                          >
                            {room.status === 'selected' ? <Star className="w-3 h-3" /> : room.id}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Floor 2 - Deluxe */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-semibold text-gray-900">Floor 2 - Deluxe Rooms</h3>
                        <span className="text-sm text-green-600 font-medium">+₹5,000/night</span>
                      </div>
                      <div className="flex justify-center space-x-2 mb-4">
                        {mockHotelRooms.filter(r => r.type === 'deluxe').map(room => (
                          <button
                            key={room.id}
                            onClick={() => setSelectedRoom(room.id)}
                            className={`w-12 h-8 rounded border-2 text-xs font-medium transition-all ${getRoomColor(room.status, room.type)}`}
                          >
                            {room.id}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Floor 2 - Standard */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-semibold text-gray-900">Floor 2 - Standard Rooms</h3>
                        <span className="text-sm text-blue-600 font-medium">Included</span>
                      </div>
                      <div className="flex justify-center space-x-2 mb-4">
                        {mockHotelRooms.filter(r => r.type === 'standard').map(room => (
                          <button
                            key={room.id}
                            onClick={() => setSelectedRoom(room.id)}
                            className={`w-12 h-8 rounded border-2 text-xs font-medium transition-all ${getRoomColor(room.status, room.type)}`}
                          >
                            {room.id}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Legend */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center">
                        <div className="w-6 h-6 bg-blue-100 border border-blue-300 rounded mr-2"></div>
                        <span>Available</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-6 h-6 bg-blue-600 rounded mr-2"></div>
                        <span>Selected</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-6 h-6 bg-red-400 rounded mr-2"></div>
                        <span>Occupied</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-6 h-6 bg-gray-400 rounded mr-2"></div>
                        <span>Maintenance</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Selected Room Info */}
                {selectedRoom && (
                  <div className="border-t border-gray-200 p-4 bg-green-50">
                    {(() => {
                      const room = mockHotelRooms.find(r => r.id === selectedRoom);
                      return (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                            <div>
                              <h4 className="font-semibold text-gray-900">Selected: Room {room?.id}</h4>
                              <p className="text-sm text-gray-600 capitalize">
                                {room?.type} • {room?.view} view
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            {(room?.price ?? 0) > 0 ? (
                              <div className="text-lg font-bold text-green-600">
                                +₹{room?.price?.toLocaleString()}
                              </div>
                            ) : (
                              <div className="text-lg font-bold text-gray-600">Included</div>
                            )}
                            <div className="text-sm text-gray-500">per night</div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Features Sidebar */}
          <div className="space-y-6">
            {/* Key Features */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                {selectedDemo === 'flight' ? 'Flight Seat' : 'Hotel Room'} Features
              </h3>
              <div className="space-y-4">
                {(selectedDemo === 'flight' ? flightFeatures : hotelFeatures).map((feature, index) => (
                  <div key={index} className="flex items-start">
                    <feature.icon className={`w-5 h-5 mt-0.5 mr-3 ${
                      selectedDemo === 'flight' ? 'text-blue-600' : 'text-green-600'
                    }`} />
                    <div>
                      <div className="font-medium text-gray-900">{feature.title}</div>
                      <div className="text-sm text-gray-600">{feature.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Demo Actions */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Try Interactive Demo</h3>
              <div className="space-y-3">
                <a
                  href={`/seat-selection?type=${selectedDemo}&itemId=demo_001&itemName=${
                    selectedDemo === 'flight' ? 'AI101 Delhi to Mumbai' : 'The Taj Mahal Palace'
                  }`}
                  className={`block w-full py-3 px-4 rounded-md font-medium text-center transition-colors ${
                    selectedDemo === 'flight' 
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  Open Full {selectedDemo === 'flight' ? 'Seat' : 'Room'} Selection
                </a>
                
                <div className="text-center">
                  <div className="text-sm text-gray-600 mb-2">Experience includes:</div>
                  <div className="text-xs text-gray-500 space-y-1">
                    <div>✓ Interactive maps with real-time updates</div>
                    <div>✓ 3D previews and detailed views</div>
                    <div>✓ Smart preference saving</div>
                    <div>✓ Premium upgrade recommendations</div>
                    <div>✓ Hold timers and instant confirmation</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Statistics */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">System Capabilities</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Aircraft Types:</span>
                  <span className="font-medium">15+</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Hotel Layouts:</span>
                  <span className="font-medium">50+</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">3D Views:</span>
                  <span className="font-medium">Multiple angles</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Real-time Updates:</span>
                  <span className="font-medium text-green-600">Live</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Hold Duration:</span>
                  <span className="font-medium">15-30 min</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Experience Smart Selection?</h2>
          <p className="text-blue-100 mb-6">
            Try our interactive seat and room selection system with 3D previews, smart recommendations, and instant booking.
          </p>
          <div className="flex justify-center space-x-4">
            <a
              href="/seat-selection?type=flight&itemId=demo_flight&itemName=AI101 Delhi to Mumbai"
              className="inline-flex items-center gap-2 bg-white text-blue-600 px-6 py-3 rounded-md font-medium hover:bg-blue-50 transition-colors"
            >
              <Plane className="w-5 h-5" />
              Try Flight Selection
            </a>
            <a
              href="/seat-selection?type=hotel&itemId=demo_hotel&itemName=The Taj Mahal Palace"
              className="inline-flex items-center gap-2 bg-white text-green-600 px-6 py-3 rounded-md font-medium hover:bg-green-50 transition-colors"
            >
              <Building className="w-5 h-5" />
              Try Room Selection
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatSelectionDemo;