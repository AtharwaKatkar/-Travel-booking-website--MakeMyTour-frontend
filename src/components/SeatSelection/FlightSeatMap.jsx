import React, { useState, useEffect } from 'react';
import { 
  Plane, 
  Wifi, 
  Zap, 
  Coffee, 
  Eye, 
  Navigation,
  Users,
  Crown,
  Star,
  Info,
  X,
  Check
} from 'lucide-react';

const FlightSeatMap = ({ 
  flightId, 
  aircraftType, 
  onSeatSelect, 
  selectedSeat, 
  userPreferences,
  showPricing = true 
}) => {
  const [seatMap, setSeatMap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hoveredSeat, setHoveredSeat] = useState(null);
  const [selectedClass, setSelectedClass] = useState('all');
  const [showLegend, setShowLegend] = useState(true);

  useEffect(() => {
    loadSeatMap();
  }, [flightId, aircraftType]);

  const loadSeatMap = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data - in real app, this would come from API
      const mockSeatMap = generateMockSeatMap(aircraftType);
      setSeatMap(mockSeatMap);
    } catch (error) {
      console.error('Failed to load seat map:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateMockSeatMap = (aircraftType) => {
    const config = {
      "Boeing 737-800": {
        name: "Boeing 737-800",
        totalSeats: 189,
        rows: 32,
        sections: {
          business: { startRow: 1, endRow: 4, price: 15000, layout: "2-2" },
          premium: { startRow: 5, endRow: 8, price: 8000, layout: "3-3" },
          economy: { startRow: 9, endRow: 32, price: 0, layout: "3-3" }
        }
      }
    };

    const aircraftConfig = config[aircraftType] || config["Boeing 737-800"];
    const seats = [];
    const occupiedSeats = new Set(['1A', '1B', '2C', '5A', '12F', '15B', '20A', '25C']);
    const blockedSeats = new Set(['3D', '7E', '18F']);

    for (let row = 1; row <= aircraftConfig.rows; row++) {
      let seatClass = 'economy';
      let seatPrice = aircraftConfig.sections.economy.price;
      let layout = aircraftConfig.sections.economy.layout;
      
      if (row >= aircraftConfig.sections.business.startRow && row <= aircraftConfig.sections.business.endRow) {
        seatClass = 'business';
        seatPrice = aircraftConfig.sections.business.price;
        layout = aircraftConfig.sections.business.layout;
      } else if (row >= aircraftConfig.sections.premium.startRow && row <= aircraftConfig.sections.premium.endRow) {
        seatClass = 'premium';
        seatPrice = aircraftConfig.sections.premium.price;
        layout = aircraftConfig.sections.premium.layout;
      }

      const seatsInRow = layout === "2-2" ? 4 : 6;
      const letters = layout === "2-2" ? ['A', 'B', 'D', 'E'] : ['A', 'B', 'C', 'D', 'E', 'F'];
      
      letters.forEach((letter, index) => {
        const seatId = `${row}${letter}`;
        const isWindow = letter === 'A' || letter === 'F' || (layout === "2-2" && (letter === 'A' || letter === 'E'));
        const isAisle = letter === 'C' || letter === 'D' || (layout === "2-2" && (letter === 'B' || letter === 'D'));
        
        let seatType = 'standard';
        let extraPrice = 0;
        
        if (isWindow) {
          seatType = 'window';
          extraPrice = seatClass === 'economy' ? 500 : 0;
        } else if (isAisle) {
          seatType = 'aisle';
          extraPrice = seatClass === 'economy' ? 300 : 0;
        }

        // Emergency exit rows
        if ([12, 13, 14].includes(row) && seatClass === 'economy') {
          seatType = 'exit';
          extraPrice = 1000;
        }

        seats.push({
          id: seatId,
          row: row,
          column: letter,
          class: seatClass,
          type: seatType,
          price: seatPrice + extraPrice,
          status: occupiedSeats.has(seatId) ? 'occupied' : 
                  blockedSeats.has(seatId) ? 'blocked' : 'available',
          features: {
            window: isWindow,
            aisle: isAisle,
            extraLegroom: [12, 13, 14].includes(row) || seatClass !== 'economy',
            powerOutlet: seatClass !== 'economy',
            wifi: true,
            meal: seatClass === 'business' || seatClass === 'premium'
          }
        });
      });
    }

    return {
      aircraft: aircraftConfig,
      seats,
      statistics: {
        totalSeats: aircraftConfig.totalSeats,
        availableSeats: seats.filter(s => s.status === 'available').length,
        occupiedSeats: seats.filter(s => s.status === 'occupied').length,
        blockedSeats: seats.filter(s => s.status === 'blocked').length
      }
    };
  };

  const getSeatColor = (seat) => {
    if (seat.status === 'occupied') return 'bg-red-400 cursor-not-allowed';
    if (seat.status === 'blocked') return 'bg-gray-400 cursor-not-allowed';
    if (selectedSeat === seat.id) return 'bg-blue-600 text-white';
    if (hoveredSeat === seat.id) return 'bg-blue-200';
    
    switch (seat.class) {
      case 'business':
        return 'bg-purple-100 hover:bg-purple-200 border-purple-300';
      case 'premium':
        return 'bg-yellow-100 hover:bg-yellow-200 border-yellow-300';
      default:
        return 'bg-green-100 hover:bg-green-200 border-green-300';
    }
  };

  const getSeatIcon = (seat) => {
    if (seat.status === 'occupied') return '✗';
    if (seat.status === 'blocked') return '⚠';
    if (selectedSeat === seat.id) return '✓';
    return seat.column;
  };

  const handleSeatClick = (seat) => {
    if (seat.status !== 'available') return;
    onSeatSelect(seat);
  };

  const filteredSeats = seatMap?.seats.filter(seat => 
    selectedClass === 'all' || seat.class === selectedClass
  ) || [];

  const getClassStats = (className) => {
    if (!seatMap) return { total: 0, available: 0, price: 0 };
    
    const classSeats = seatMap.seats.filter(s => s.class === className);
    return {
      total: classSeats.length,
      available: classSeats.filter(s => s.status === 'available').length,
      price: classSeats[0]?.price || 0
    };
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="animate-pulse">
          <div className="flex items-center justify-center mb-6">
            <Plane className="w-8 h-8 text-gray-400 mr-3" />
            <div className="h-6 bg-gray-200 rounded w-48"></div>
          </div>
          <div className="space-y-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="flex justify-center space-x-2">
                {[...Array(6)].map((_, j) => (
                  <div key={j} className="w-8 h-8 bg-gray-200 rounded"></div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!seatMap) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        <Plane className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Unable to load seat map</h3>
        <p className="text-gray-600">Please try again later</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Plane className="w-8 h-8 mr-3" />
            <div>
              <h2 className="text-2xl font-bold">{seatMap.aircraft.name}</h2>
              <p className="text-blue-100">Select your preferred seat</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{seatMap.statistics.availableSeats}</div>
            <div className="text-blue-100">seats available</div>
          </div>
        </div>
      </div>

      {/* Class Filter */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex space-x-2">
            {['all', 'business', 'premium', 'economy'].map((classType) => (
              <button
                key={classType}
                onClick={() => setSelectedClass(classType)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedClass === classType
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {classType === 'all' ? 'All Classes' : 
                 classType.charAt(0).toUpperCase() + classType.slice(1)}
              </button>
            ))}
          </div>
          
          <button
            onClick={() => setShowLegend(!showLegend)}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <Info className="w-4 h-4 mr-1" />
            Legend
          </button>
        </div>

        {/* Class Statistics */}
        <div className="grid grid-cols-3 gap-4">
          {['business', 'premium', 'economy'].map((classType) => {
            const stats = getClassStats(classType);
            return (
              <div key={classType} className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-gray-900 capitalize">{classType}</div>
                    <div className="text-sm text-gray-600">
                      {stats.available}/{stats.total} available
                    </div>
                  </div>
                  {showPricing && stats.price > 0 && (
                    <div className="text-right">
                      <div className="font-semibold text-green-600">
                        +₹{stats.price.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500">upgrade</div>
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
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
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-3 text-sm">
            <div className="flex items-center">
              <Eye className="w-4 h-4 text-blue-600 mr-2" />
              <span>Window</span>
            </div>
            <div className="flex items-center">
              <Navigation className="w-4 h-4 text-green-600 mr-2" />
              <span>Aisle</span>
            </div>
            <div className="flex items-center">
              <Users className="w-4 h-4 text-orange-600 mr-2" />
              <span>Extra Legroom</span>
            </div>
          </div>
        </div>
      )}

      {/* Seat Map */}
      <div className="p-6 overflow-x-auto">
        <div className="min-w-max">
          {/* Aircraft Front Indicator */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center bg-gray-100 rounded-full px-4 py-2">
              <Plane className="w-5 h-5 text-gray-600 mr-2" />
              <span className="text-sm font-medium text-gray-700">Front of Aircraft</span>
            </div>
          </div>

          {/* Seat Grid */}
          <div className="space-y-2">
            {Array.from(new Set(filteredSeats.map(s => s.row))).sort((a, b) => a - b).map(row => {
              const rowSeats = filteredSeats.filter(s => s.row === row).sort((a, b) => a.column.localeCompare(b.column));
              const seatClass = rowSeats[0]?.class;
              
              return (
                <div key={row} className="flex items-center justify-center">
                  {/* Row Number */}
                  <div className="w-8 text-center text-sm font-medium text-gray-600 mr-4">
                    {row}
                  </div>
                  
                  {/* Seats */}
                  <div className="flex items-center space-x-1">
                    {rowSeats.map((seat, index) => {
                      const isAisleAfter = (seat.column === 'C' && seatClass === 'economy') || 
                                          (seat.column === 'B' && seatClass === 'business');
                      
                      return (
                        <React.Fragment key={seat.id}>
                          <button
                            onClick={() => handleSeatClick(seat)}
                            onMouseEnter={() => setHoveredSeat(seat.id)}
                            onMouseLeave={() => setHoveredSeat(null)}
                            disabled={seat.status !== 'available'}
                            className={`
                              w-8 h-8 rounded border-2 text-xs font-medium transition-all duration-200
                              ${getSeatColor(seat)}
                              ${seat.status === 'available' ? 'hover:scale-110' : ''}
                              ${seat.features.extraLegroom ? 'ring-2 ring-blue-300' : ''}
                            `}
                            title={`Seat ${seat.id} - ${seat.class} class ${seat.type} seat${seat.price > 0 ? ` (+₹${seat.price})` : ''}`}
                          >
                            {getSeatIcon(seat)}
                          </button>
                          
                          {/* Aisle Space */}
                          {isAisleAfter && (
                            <div className="w-6 flex justify-center">
                              <div className="w-px h-6 bg-gray-300"></div>
                            </div>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </div>
                  
                  {/* Row Number (Right) */}
                  <div className="w-8 text-center text-sm font-medium text-gray-600 ml-4">
                    {row}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Aircraft Rear Indicator */}
          <div className="text-center mt-6">
            <div className="inline-flex items-center bg-gray-100 rounded-full px-4 py-2">
              <span className="text-sm font-medium text-gray-700 mr-2">Rear of Aircraft</span>
              <Plane className="w-5 h-5 text-gray-600 rotate-180" />
            </div>
          </div>
        </div>
      </div>

      {/* Seat Details Panel */}
      {hoveredSeat && (
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          {(() => {
            const seat = seatMap.seats.find(s => s.id === hoveredSeat);
            if (!seat) return null;
            
            return (
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-gray-900">
                    Seat {seat.id} - {seat.class.charAt(0).toUpperCase() + seat.class.slice(1)} Class
                  </h4>
                  <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                    {seat.features.window && (
                      <div className="flex items-center">
                        <Eye className="w-4 h-4 mr-1" />
                        Window
                      </div>
                    )}
                    {seat.features.aisle && (
                      <div className="flex items-center">
                        <Navigation className="w-4 h-4 mr-1" />
                        Aisle
                      </div>
                    )}
                    {seat.features.extraLegroom && (
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        Extra Legroom
                      </div>
                    )}
                    {seat.features.powerOutlet && (
                      <div className="flex items-center">
                        <Zap className="w-4 h-4 mr-1" />
                        Power
                      </div>
                    )}
                    {seat.features.wifi && (
                      <div className="flex items-center">
                        <Wifi className="w-4 h-4 mr-1" />
                        WiFi
                      </div>
                    )}
                    {seat.features.meal && (
                      <div className="flex items-center">
                        <Coffee className="w-4 h-4 mr-1" />
                        Meal
                      </div>
                    )}
                  </div>
                </div>
                
                {showPricing && seat.price > 0 && (
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-600">
                      +₹{seat.price.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500">additional cost</div>
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      )}

      {/* Selected Seat Summary */}
      {selectedSeat && (
        <div className="border-t border-gray-200 p-4 bg-blue-50">
          {(() => {
            const seat = seatMap.seats.find(s => s.id === selectedSeat);
            if (!seat) return null;
            
            return (
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-green-600 mr-3" />
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      Selected: Seat {seat.id}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {seat.class.charAt(0).toUpperCase() + seat.class.slice(1)} class • {seat.type} seat
                    </p>
                  </div>
                </div>
                
                {showPricing && (
                  <div className="text-right">
                    {seat.price > 0 ? (
                      <div className="text-lg font-bold text-green-600">
                        +₹{seat.price.toLocaleString()}
                      </div>
                    ) : (
                      <div className="text-lg font-bold text-gray-600">
                        Included
                      </div>
                    )}
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

export default FlightSeatMap;