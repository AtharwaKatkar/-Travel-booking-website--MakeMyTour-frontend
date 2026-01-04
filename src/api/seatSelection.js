import axios from "axios";

// Mock aircraft configurations
const aircraftConfigurations = {
  "Boeing 737-800": {
    id: "b737-800",
    name: "Boeing 737-800",
    totalSeats: 189,
    rows: 32,
    seatsPerRow: { 
      economy: 6, 
      premium: 6, 
      business: 4 
    },
    layout: "3-3", // Economy layout
    businessLayout: "2-2",
    premiumLayout: "3-3",
    sections: {
      business: { startRow: 1, endRow: 4, price: 15000 },
      premium: { startRow: 5, endRow: 8, price: 8000 },
      economy: { startRow: 9, endRow: 32, price: 0 }
    },
    features: {
      wifi: true,
      entertainment: true,
      powerOutlets: true,
      meals: ["business", "premium"]
    }
  },
  "Airbus A320": {
    id: "a320",
    name: "Airbus A320",
    totalSeats: 180,
    rows: 30,
    seatsPerRow: { 
      economy: 6, 
      premium: 6, 
      business: 4 
    },
    layout: "3-3",
    businessLayout: "2-2", 
    premiumLayout: "3-3",
    sections: {
      business: { startRow: 1, endRow: 3, price: 12000 },
      premium: { startRow: 4, endRow: 7, price: 6000 },
      economy: { startRow: 8, endRow: 30, price: 0 }
    },
    features: {
      wifi: true,
      entertainment: true,
      powerOutlets: false,
      meals: ["business"]
    }
  }
};

// Mock hotel room configurations
const hotelConfigurations = {
  "luxury-hotel": {
    id: "luxury-hotel",
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
    },
    features: {
      spa: true,
      pool: true,
      gym: true,
      restaurant: true,
      roomService: true,
      concierge: true
    }
  }
};

// Generate mock seat data
const generateFlightSeats = (aircraftType, flightId) => {
  const config = aircraftConfigurations[aircraftType];
  if (!config) return [];

  const seats = [];
  const occupiedSeats = new Set();
  const blockedSeats = new Set();
  
  // Randomly occupy some seats (30-70%)
  const occupancyRate = 0.3 + Math.random() * 0.4;
  const totalSeatsToOccupy = Math.floor(config.totalSeats * occupancyRate);
  
  // Generate random occupied seats
  while (occupiedSeats.size < totalSeatsToOccupy) {
    const row = Math.floor(Math.random() * config.rows) + 1;
    const seatLetter = ['A', 'B', 'C', 'D', 'E', 'F'][Math.floor(Math.random() * 6)];
    occupiedSeats.add(`${row}${seatLetter}`);
  }

  // Block some seats for maintenance (2-5%)
  const blockedCount = Math.floor(config.totalSeats * (0.02 + Math.random() * 0.03));
  while (blockedSeats.size < blockedCount) {
    const row = Math.floor(Math.random() * config.rows) + 1;
    const seatLetter = ['A', 'B', 'C', 'D', 'E', 'F'][Math.floor(Math.random() * 6)];
    const seatId = `${row}${seatLetter}`;
    if (!occupiedSeats.has(seatId)) {
      blockedSeats.add(seatId);
    }
  }

  // Generate all seats
  for (let row = 1; row <= config.rows; row++) {
    let seatClass = 'economy';
    let seatPrice = config.sections.economy.price;
    
    if (row >= config.sections.business.startRow && row <= config.sections.business.endRow) {
      seatClass = 'business';
      seatPrice = config.sections.business.price;
    } else if (row >= config.sections.premium.startRow && row <= config.sections.premium.endRow) {
      seatClass = 'premium';
      seatPrice = config.sections.premium.price;
    }

    const seatsInRow = seatClass === 'business' ? 4 : 6;
    const letters = seatsInRow === 4 ? ['A', 'B', 'D', 'E'] : ['A', 'B', 'C', 'D', 'E', 'F'];
    
    letters.forEach((letter, index) => {
      const seatId = `${row}${letter}`;
      const isWindow = letter === 'A' || letter === 'F' || (seatsInRow === 4 && (letter === 'A' || letter === 'E'));
      const isAisle = letter === 'C' || letter === 'D' || (seatsInRow === 4 && (letter === 'B' || letter === 'D'));
      const isMiddle = !isWindow && !isAisle;
      
      let seatType = 'standard';
      let extraPrice = 0;
      
      if (isWindow) {
        seatType = 'window';
        extraPrice = seatClass === 'economy' ? 500 : 0;
      } else if (isAisle) {
        seatType = 'aisle';
        extraPrice = seatClass === 'economy' ? 300 : 0;
      }

      // Emergency exit rows (usually more legroom)
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
          middle: isMiddle,
          extraLegroom: [12, 13, 14].includes(row) || seatClass !== 'economy',
          powerOutlet: config.features.powerOutlets || seatClass !== 'economy',
          wifi: config.features.wifi,
          meal: config.features.meals.includes(seatClass)
        },
        position: {
          x: index * 60 + (index >= 3 ? 40 : 0), // Add aisle space
          y: (row - 1) * 50
        }
      });
    });
  }

  return seats;
};

// Generate mock room data
const generateHotelRooms = (hotelType, checkIn, checkOut) => {
  const config = hotelConfigurations[hotelType];
  if (!config) return [];

  const rooms = [];
  const occupiedRooms = new Set();
  const maintenanceRooms = new Set();
  
  // Randomly occupy some rooms (40-80%)
  const occupancyRate = 0.4 + Math.random() * 0.4;
  const totalRoomsToOccupy = Math.floor(config.totalRooms * occupancyRate);
  
  // Generate random occupied rooms
  while (occupiedRooms.size < totalRoomsToOccupy) {
    const floor = Math.floor(Math.random() * config.floors) + 1;
    const roomNum = Math.floor(Math.random() * config.roomsPerFloor) + 1;
    const roomId = `${floor}${roomNum.toString().padStart(2, '0')}`;
    occupiedRooms.add(roomId);
  }

  // Block some rooms for maintenance (2-5%)
  const maintenanceCount = Math.floor(config.totalRooms * (0.02 + Math.random() * 0.03));
  while (maintenanceRooms.size < maintenanceCount) {
    const floor = Math.floor(Math.random() * config.floors) + 1;
    const roomNum = Math.floor(Math.random() * config.roomsPerFloor) + 1;
    const roomId = `${floor}${roomNum.toString().padStart(2, '0')}`;
    if (!occupiedRooms.has(roomId)) {
      maintenanceRooms.add(roomId);
    }
  }

  // Generate all rooms
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
      const hasView = roomNum <= 10; // Rooms 1-10 have better views
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
          ...roomConfig.amenities.reduce((acc, amenity) => ({ ...acc, [amenity.toLowerCase().replace(' ', '')]: true }), {}),
          view: hasView ? (floor >= 3 ? 'ocean' : 'city') : 'courtyard',
          corner: isCorner,
          balcony: roomType !== 'standard' || hasView,
          floor: floor
        },
        amenities: roomConfig.amenities,
        position: {
          x: (roomNum - 1) * 80,
          y: (floor - 1) * 100
        }
      });
    }
  }

  return rooms;
};

// API Functions

// Get flight seat map
export const getFlightSeatMap = async (flightId, aircraftType = "Boeing 737-800") => {
  try {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const seats = generateFlightSeats(aircraftType, flightId);
    const config = aircraftConfigurations[aircraftType];
    
    return {
      success: true,
      data: {
        flightId,
        aircraft: config,
        seats,
        seatMap: {
          totalSeats: config.totalSeats,
          availableSeats: seats.filter(s => s.status === 'available').length,
          occupiedSeats: seats.filter(s => s.status === 'occupied').length,
          blockedSeats: seats.filter(s => s.status === 'blocked').length
        }
      }
    };
  } catch (error) {
    throw new Error('Failed to fetch seat map');
  }
};

// Get hotel room map
export const getHotelRoomMap = async (hotelId, checkIn, checkOut, hotelType = "luxury-hotel") => {
  try {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const rooms = generateHotelRooms(hotelType, checkIn, checkOut);
    const config = hotelConfigurations[hotelType];
    
    return {
      success: true,
      data: {
        hotelId,
        hotel: config,
        rooms,
        roomMap: {
          totalRooms: config.totalRooms,
          availableRooms: rooms.filter(r => r.status === 'available').length,
          occupiedRooms: rooms.filter(r => r.status === 'occupied').length,
          maintenanceRooms: rooms.filter(r => r.status === 'maintenance').length
        }
      }
    };
  } catch (error) {
    throw new Error('Failed to fetch room map');
  }
};

// Select seat/room
export const selectSeat = async (flightId, seatId, userId) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    // In real app, this would update database
    console.log(`Seat ${seatId} selected for flight ${flightId} by user ${userId}`);
    
    return {
      success: true,
      data: {
        seatId,
        flightId,
        userId,
        selectedAt: new Date().toISOString(),
        holdExpiry: new Date(Date.now() + 15 * 60 * 1000).toISOString() // 15 minutes hold
      },
      message: 'Seat selected successfully. You have 15 minutes to complete booking.'
    };
  } catch (error) {
    throw new Error('Failed to select seat');
  }
};

export const selectRoom = async (hotelId, roomId, userId, checkIn, checkOut) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    console.log(`Room ${roomId} selected for hotel ${hotelId} by user ${userId}`);
    
    return {
      success: true,
      data: {
        roomId,
        hotelId,
        userId,
        checkIn,
        checkOut,
        selectedAt: new Date().toISOString(),
        holdExpiry: new Date(Date.now() + 30 * 60 * 1000).toISOString() // 30 minutes hold
      },
      message: 'Room selected successfully. You have 30 minutes to complete booking.'
    };
  } catch (error) {
    throw new Error('Failed to select room');
  }
};

// Get seat/room details
export const getSeatDetails = async (seatId, flightId) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const seatMap = await getFlightSeatMap(flightId);
    const seat = seatMap.data.seats.find(s => s.id === seatId);
    
    if (!seat) {
      throw new Error('Seat not found');
    }
    
    return {
      success: true,
      data: {
        ...seat,
        description: getSeatDescription(seat),
        recommendations: getSeatRecommendations(seat),
        nearbySeats: getNearbySeats(seat, seatMap.data.seats)
      }
    };
  } catch (error) {
    throw new Error('Failed to fetch seat details');
  }
};

export const getRoomDetails = async (roomId, hotelId) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const roomMap = await getHotelRoomMap(hotelId);
    const room = roomMap.data.rooms.find(r => r.id === roomId);
    
    if (!room) {
      throw new Error('Room not found');
    }
    
    return {
      success: true,
      data: {
        ...room,
        description: getRoomDescription(room),
        recommendations: getRoomRecommendations(room),
        nearbyRooms: getNearbyRooms(room, roomMap.data.rooms)
      }
    };
  } catch (error) {
    throw new Error('Failed to fetch room details');
  }
};

// Save user preferences
export const saveUserPreferences = async (userId, preferences) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // In real app, save to database
    localStorage.setItem(`userPreferences_${userId}`, JSON.stringify({
      ...preferences,
      updatedAt: new Date().toISOString()
    }));
    
    return {
      success: true,
      message: 'Preferences saved successfully'
    };
  } catch (error) {
    throw new Error('Failed to save preferences');
  }
};

export const getUserPreferences = async (userId) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const saved = localStorage.getItem(`userPreferences_${userId}`);
    const preferences = saved ? JSON.parse(saved) : {
      seatPreferences: {
        preferredClass: 'economy',
        preferredType: 'window',
        extraLegroom: false,
        nearFront: false
      },
      roomPreferences: {
        preferredType: 'deluxe',
        preferredFloor: 'high',
        preferredView: 'ocean',
        quietRoom: true
      }
    };
    
    return {
      success: true,
      data: preferences
    };
  } catch (error) {
    throw new Error('Failed to fetch preferences');
  }
};

// Helper functions
const getSeatDescription = (seat) => {
  const descriptions = [];
  
  if (seat.class === 'business') {
    descriptions.push('Business class seat with premium service');
  } else if (seat.class === 'premium') {
    descriptions.push('Premium economy with extra comfort');
  } else {
    descriptions.push('Economy class seat');
  }
  
  if (seat.features.window) {
    descriptions.push('Window seat with great views');
  } else if (seat.features.aisle) {
    descriptions.push('Aisle seat for easy access');
  } else {
    descriptions.push('Middle seat');
  }
  
  if (seat.features.extraLegroom) {
    descriptions.push('Extra legroom for comfort');
  }
  
  if (seat.features.powerOutlet) {
    descriptions.push('Power outlet available');
  }
  
  return descriptions.join('. ');
};

const getRoomDescription = (room) => {
  const descriptions = [];
  
  descriptions.push(`${room.name} (${room.size})`);
  
  if (room.features.view === 'ocean') {
    descriptions.push('Beautiful ocean view');
  } else if (room.features.view === 'city') {
    descriptions.push('City view');
  }
  
  if (room.features.corner) {
    descriptions.push('Corner room with extra space');
  }
  
  if (room.features.balcony) {
    descriptions.push('Private balcony');
  }
  
  return descriptions.join('. ');
};

const getSeatRecommendations = (seat) => {
  const recommendations = [];
  
  if (seat.features.window) {
    recommendations.push('Great for photography and sightseeing');
  }
  
  if (seat.features.aisle) {
    recommendations.push('Easy bathroom access and leg stretching');
  }
  
  if (seat.features.extraLegroom) {
    recommendations.push('Ideal for tall passengers');
  }
  
  if (seat.class === 'business') {
    recommendations.push('Premium dining and priority boarding');
  }
  
  return recommendations;
};

const getRoomRecommendations = (room) => {
  const recommendations = [];
  
  if (room.features.view === 'ocean') {
    recommendations.push('Perfect for romantic getaways');
  }
  
  if (room.type === 'suite') {
    recommendations.push('Ideal for business travelers and special occasions');
  }
  
  if (room.features.corner) {
    recommendations.push('More privacy and space');
  }
  
  if (room.floor >= 4) {
    recommendations.push('Quieter location away from street noise');
  }
  
  return recommendations;
};

const getNearbySeats = (seat, allSeats) => {
  return allSeats.filter(s => 
    Math.abs(s.row - seat.row) <= 1 && 
    s.id !== seat.id
  ).slice(0, 6);
};

const getNearbyRooms = (room, allRooms) => {
  return allRooms.filter(r => 
    r.floor === room.floor && 
    Math.abs(r.number - room.number) <= 2 && 
    r.id !== room.id
  ).slice(0, 4);
};