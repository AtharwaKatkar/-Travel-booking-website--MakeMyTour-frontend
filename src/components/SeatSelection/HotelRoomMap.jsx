import React, { useState, useEffect } from 'react';
import { 
  Building, 
  Wifi, 
  Tv, 
  Coffee, 
  Eye, 
  Car,
  Waves,
  Crown,
  Star,
  Info,
  Bed,
  Bath,
  Wind,
  Check,
  MapPin
} from 'lucide-react';

const HotelRoomMap = ({ 
  hotelId, 
  checkIn, 
  checkOut, 
  onRoomSelect, 
  selectedRoom, 
  userPreferences,
  showPricing = true 
}) => {
  const [roomMap, setRoomMap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hoveredRoom, setHoveredRoom] = useState(null);
  const [selectedFloor, setSelectedFloor] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [showLegend, setShowLegend] = useState(true);

  useEffect(() => {
    loadRoomMap();
  }, [hotelId, checkIn, checkOut]);

  const loadRoomMap = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data - in real app, this would come from API
      const mockRoomMap = generateMockRoomMap();
      setRoomMap(mockRoomMap);
    } catch (error) {
      console.error('Failed to load room map:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateMockRoomMap = () => {
    const config = {
      name: "The Taj Mahal Palace",
      floors: 5,
      roomsPerFloor: 20,
      totalRooms: 100,
      roomTypes: {
        standard: { 
          name: "Standard Room", 
          price: 0, 
          size: "25 sqm",
          amenities: ["AC", "WiFi", "TV", "Minibar"]
        },
        deluxe: { 
          name: "Deluxe Room", 
          price: 5000, 
          size: "35 sqm",
          amenities: ["AC", "WiFi", "TV", "Minibar", "City View", "Balcony"]
        },
        suite: { 
          name: "Executive Suite", 
          price: 15000, 
          size: "60 sqm",
          amenities: ["AC", "WiFi", "TV", "Minibar", "Ocean View", "Balcony", "Living Area", "Premium Bathroom"]
        },
        presidential: { 
          name: "Presidential Suite", 
          price: 35000, 
          size: "120 sqm",
          amenities: ["AC", "WiFi", "TV", "Minibar", "Ocean View", "Balcony", "Living Area", "Premium Bathroom", "Butler Service", "Private Terrace"]
        }
      }
    };

    const rooms = [];
    const occupiedRooms = new Set(['101', '102', '205', '301', '315', '420', '501']);
    const maintenanceRooms = new Set(['103', '210', '318']);

    for (let floor = 1; floor <= config.floors; floor++) {
      for (let roomNum = 1; roomNum <= config.roomsPerFloor; roomNum++) {
        const roomId = `${floor}${roomNum.toString().padStart(2, '0')}`;
        
        // Determine room type based on room number and floor
        let roomType = 'standard';
        if (floor === config.floors && roomNum <= 2) {
          roomType = 'presidential';
        } else if (floor === config.floors || (floor === config.floors - 1 && roomNum <= 4)) {
          roomType = 'suite';
        } else if (roomNum <= 6 || floor >= 3) {
          roomType = 'deluxe';
        }

        const roomConfig = config.roomTypes[roomType];
        const hasOceanView = roomNum <= 10 && floor >= 2; // Rooms 1-10 on floors 2+ have ocean view
        const hasCityView = roomNum > 10 && roomNum <= 15;
        const isCorner = roomNum === 1 || roomNum === config.roomsPerFloor;
        
        rooms.push({
          id: roomId,
          floor: floor,
          number: roomNum,
          type: roomType,
          name: roomConfig.name,
          price: roomConfig.price,
          size: roomConfig.size,
          status: occupiedRooms.has(roomId) ? 'occupied' : 
                  maintenanceRooms.has(roomId) ? 'maintenance' : 'available',
          features: {
            view: hasOceanView ? 'ocean' : hasCityView ? 'city' : 'courtyard',
            corner: isCorner,
            balcony: roomType !== 'standard' || hasOceanView,
            floor: floor,
            wifi: true,
            ac: true,
            tv: true,
            minibar: true,
            roomService: floor >= 2,
            concierge: roomType === 'suite' || roomType === 'presidential'
          },
          amenities: roomConfig.amenities,
          position: {
            x: (roomNum - 1) % 10, // 10 rooms per row for display
            y: Math.floor((roomNum - 1) / 10)
          }
        });
      }
    }

    return {
      hotel: config,
      rooms,
      statistics: {
        totalRooms: config.totalRooms,
        availableRooms: rooms.filter(r => r.status === 'available').length,
        occupiedRooms: rooms.filter(r => r.status === 'occupied').length,
        maintenanceRooms: rooms.filter(r => r.status === 'maintenance').length
      }
    };
  };

  const getRoomColor = (room) => {
    if (room.status === 'occupied') return 'bg-red-400 cursor-not-allowed';
    if (room.status === 'maintenance') return 'bg-gray-400 cursor-not-allowed';
    if (selectedRoom === room.id) return 'bg-blue-600 text-white';
    if (hoveredRoom === room.id) return 'bg-blue-200';
    
    switch (room.type) {
      case 'presidential':
        return 'bg-purple-100 hover:bg-purple-200 border-purple-300';
      case 'suite':
        return 'bg-yellow-100 hover:bg-yellow-200 border-yellow-300';
      case 'deluxe':
        return 'bg-green-100 hover:bg-green-200 border-green-300';
      default:
        return 'bg-blue-100 hover:bg-blue-200 border-blue-300';
    }
  };

  const getRoomIcon = (room) => {
    if (room.status === 'occupied') return '✗';
    if (room.status === 'maintenance') return '⚠';
    if (selectedRoom === room.id) return '✓';
    
    switch (room.type) {
      case 'presidential':
        return <Crown className="w-3 h-3" />;
      case 'suite':
        return <Star className="w-3 h-3" />;
      default:
        return room.number.toString().padStart(2, '0');
    }
  };

  const handleRoomClick = (room) => {
    if (room.status !== 'available') return;
    onRoomSelect(room);
  };

  const filteredRooms = roomMap?.rooms.filter(room => {
    const floorMatch = selectedFloor === 'all' || room.floor.toString() === selectedFloor;
    const typeMatch = selectedType === 'all' || room.type === selectedType;
    return floorMatch && typeMatch;
  }) || [];

  const getTypeStats = (typeName) => {
    if (!roomMap) return { total: 0, available: 0, price: 0 };
    
    const typeRooms = roomMap.rooms.filter(r => r.type === typeName);
    return {
      total: typeRooms.length,
      available: typeRooms.filter(r => r.status === 'available').length,
      price: typeRooms[0]?.price || 0
    };
  };

  const getFloorRooms = (floorNum) => {
    return filteredRooms.filter(room => room.floor === floorNum);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="animate-pulse">
          <div className="flex items-center justify-center mb-6">
            <Building className="w-8 h-8 text-gray-400 mr-3" />
            <div className="h-6 bg-gray-200 rounded w-48"></div>
          </div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex justify-center space-x-2">
                {[...Array(10)].map((_, j) => (
                  <div key={j} className="w-12 h-8 bg-gray-200 rounded"></div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!roomMap) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        <Building className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Unable to load room map</h3>
        <p className="text-gray-600">Please try again later</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Building className="w-8 h-8 mr-3" />
            <div>
              <h2 className="text-2xl font-bold">{roomMap.hotel.name}</h2>
              <p className="text-green-100">Select your preferred room</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{roomMap.statistics.availableRooms}</div>
            <div className="text-green-100">rooms available</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex space-x-4">
            {/* Floor Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Floor</label>
              <select
                value={selectedFloor}
                onChange={(e) => setSelectedFloor(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="all">All Floors</option>
                {[...Array(roomMap.hotel.floors)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>Floor {i + 1}</option>
                ))}
              </select>
            </div>

            {/* Room Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Room Type</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="all">All Types</option>
                <option value="standard">Standard</option>
                <option value="deluxe">Deluxe</option>
                <option value="suite">Suite</option>
                <option value="presidential">Presidential</option>
              </select>
            </div>
          </div>
          
          <button
            onClick={() => setShowLegend(!showLegend)}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <Info className="w-4 h-4 mr-1" />
            Legend
          </button>
        </div>

        {/* Room Type Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['standard', 'deluxe', 'suite', 'presidential'].map((roomType) => {
            const stats = getTypeStats(roomType);
            return (
              <div key={roomType} className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-gray-900 capitalize">{roomType}</div>
                    <div className="text-sm text-gray-600">
                      {stats.available}/{stats.total} available
                    </div>
                  </div>
                  {showPricing && stats.price > 0 && (
                    <div className="text-right">
                      <div className="font-semibold text-green-600">
                        +₹{stats.price.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500">per night</div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      {showLegend && (
        <div className="p-4 bg-gray-50 border-b border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
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
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center">
              <Waves className="w-4 h-4 text-blue-600 mr-2" />
              <span>Ocean View</span>
            </div>
            <div className="flex items-center">
              <Building className="w-4 h-4 text-gray-600 mr-2" />
              <span>City View</span>
            </div>
            <div className="flex items-center">
              <Crown className="w-4 h-4 text-purple-600 mr-2" />
              <span>Presidential</span>
            </div>
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-600 mr-2" />
              <span>Suite</span>
            </div>
          </div>
        </div>
      )}

      {/* Room Map */}
      <div className="p-6 overflow-x-auto">
        <div className="min-w-max space-y-8">
          {[...Array(roomMap.hotel.floors)].map((_, floorIndex) => {
            const floorNum = roomMap.hotel.floors - floorIndex; // Start from top floor
            const floorRooms = getFloorRooms(floorNum);
            
            if (floorRooms.length === 0 && selectedFloor !== 'all') return null;
            
            return (
              <div key={floorNum} className="border border-gray-200 rounded-lg p-4">
                {/* Floor Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center mr-3">
                      <span className="text-sm font-bold text-gray-700">{floorNum}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Floor {floorNum}</h3>
                      <p className="text-sm text-gray-600">
                        {floorRooms.filter(r => r.status === 'available').length} of {floorRooms.length} available
                      </p>
                    </div>
                  </div>
                  
                  {/* Floor Features */}
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    {floorNum >= 3 && (
                      <div className="flex items-center">
                        <Waves className="w-4 h-4 mr-1" />
                        <span>Ocean View</span>
                      </div>
                    )}
                    {floorNum === roomMap.hotel.floors && (
                      <div className="flex items-center">
                        <Crown className="w-4 h-4 mr-1" />
                        <span>Premium Floor</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Room Grid */}
                <div className="grid grid-cols-10 gap-2">
                  {[...Array(roomMap.hotel.roomsPerFloor)].map((_, roomIndex) => {
                    const roomNum = roomIndex + 1;
                    const room = floorRooms.find(r => r.number === roomNum);
                    
                    if (!room) {
                      return <div key={roomIndex} className="w-12 h-8"></div>;
                    }
                    
                    return (
                      <button
                        key={room.id}
                        onClick={() => handleRoomClick(room)}
                        onMouseEnter={() => setHoveredRoom(room.id)}
                        onMouseLeave={() => setHoveredRoom(null)}
                        disabled={room.status !== 'available'}
                        className={`
                          w-12 h-8 rounded border-2 text-xs font-medium transition-all duration-200 flex items-center justify-center
                          ${getRoomColor(room)}
                          ${room.status === 'available' ? 'hover:scale-105' : ''}
                          ${room.features.corner ? 'ring-2 ring-yellow-300' : ''}
                        `}
                        title={`Room ${room.id} - ${room.name} (${room.size})${room.price > 0 ? ` +₹${room.price}/night` : ''}`}
                      >
                        {getRoomIcon(room)}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Room Details Panel */}
      {hoveredRoom && (
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          {(() => {
            const room = roomMap.rooms.find(r => r.id === hoveredRoom);
            if (!room) return null;
            
            return (
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-gray-900">
                    Room {room.id} - {room.name}
                  </h4>
                  <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Bed className="w-4 h-4 mr-1" />
                      {room.size}
                    </div>
                    {room.features.view === 'ocean' && (
                      <div className="flex items-center">
                        <Waves className="w-4 h-4 mr-1" />
                        Ocean View
                      </div>
                    )}
                    {room.features.view === 'city' && (
                      <div className="flex items-center">
                        <Building className="w-4 h-4 mr-1" />
                        City View
                      </div>
                    )}
                    {room.features.balcony && (
                      <div className="flex items-center">
                        <Wind className="w-4 h-4 mr-1" />
                        Balcony
                      </div>
                    )}
                    {room.features.wifi && (
                      <div className="flex items-center">
                        <Wifi className="w-4 h-4 mr-1" />
                        WiFi
                      </div>
                    )}
                  </div>
                  <div className="mt-1 text-xs text-gray-500">
                    Floor {room.floor} • {room.amenities.join(' • ')}
                  </div>
                </div>
                
                {showPricing && (
                  <div className="text-right">
                    {room.price > 0 ? (
                      <div className="text-lg font-bold text-green-600">
                        +₹{room.price.toLocaleString()}
                      </div>
                    ) : (
                      <div className="text-lg font-bold text-gray-600">
                        Included
                      </div>
                    )}
                    <div className="text-sm text-gray-500">per night</div>
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      )}

      {/* Selected Room Summary */}
      {selectedRoom && (
        <div className="border-t border-gray-200 p-4 bg-green-50">
          {(() => {
            const room = roomMap.rooms.find(r => r.id === selectedRoom);
            if (!room) return null;
            
            return (
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-green-600 mr-3" />
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      Selected: Room {room.id}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {room.name} • {room.size} • Floor {room.floor}
                    </p>
                  </div>
                </div>
                
                {showPricing && (
                  <div className="text-right">
                    {room.price > 0 ? (
                      <div className="text-lg font-bold text-green-600">
                        +₹{room.price.toLocaleString()}
                      </div>
                    ) : (
                      <div className="text-lg font-bold text-gray-600">
                        Included
                      </div>
                    )}
                    <div className="text-sm text-gray-500">per night</div>
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};

export default HotelRoomMap;