import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method, query } = req;

  switch (method) {
    case 'GET':
      try {
        const { type, itemId, aircraftType, hotelType } = query;
        
        if (type === 'flight') {
          // Mock flight seat map data
          const seatMap = {
            flightId: itemId,
            aircraft: {
              name: aircraftType || "Boeing 737-800",
              totalSeats: 189,
              sections: {
                business: { startRow: 1, endRow: 4, price: 15000 },
                premium: { startRow: 5, endRow: 8, price: 8000 },
                economy: { startRow: 9, endRow: 32, price: 0 }
              }
            },
            seats: generateMockSeats(),
            statistics: {
              totalSeats: 189,
              availableSeats: 156,
              occupiedSeats: 28,
              blockedSeats: 5
            }
          };
          
          res.status(200).json({ success: true, data: seatMap });
        } else if (type === 'hotel') {
          // Mock hotel room map data
          const roomMap = {
            hotelId: itemId,
            hotel: {
              name: "The Taj Mahal Palace",
              floors: 5,
              totalRooms: 100,
              roomTypes: {
                standard: { name: "Standard Room", price: 0 },
                deluxe: { name: "Deluxe Room", price: 5000 },
                suite: { name: "Executive Suite", price: 15000 },
                presidential: { name: "Presidential Suite", price: 35000 }
              }
            },
            rooms: generateMockRooms(),
            statistics: {
              totalRooms: 100,
              availableRooms: 78,
              occupiedRooms: 18,
              maintenanceRooms: 4
            }
          };
          
          res.status(200).json({ success: true, data: roomMap });
        } else {
          res.status(400).json({ success: false, error: 'Invalid type parameter' });
        }
      } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to fetch seat/room map' });
      }
      break;

    case 'POST':
      try {
        const { type, itemId, seatId, roomId, userId } = req.body;
        
        if (type === 'flight' && seatId) {
          const holdExpiry = new Date(Date.now() + 15 * 60 * 1000).toISOString();
          res.status(200).json({
            success: true,
            data: {
              seatId,
              flightId: itemId,
              userId,
              selectedAt: new Date().toISOString(),
              holdExpiry
            },
            message: 'Seat selected successfully. You have 15 minutes to complete booking.'
          });
        } else if (type === 'hotel' && roomId) {
          const holdExpiry = new Date(Date.now() + 30 * 60 * 1000).toISOString();
          res.status(200).json({
            success: true,
            data: {
              roomId,
              hotelId: itemId,
              userId,
              selectedAt: new Date().toISOString(),
              holdExpiry
            },
            message: 'Room selected successfully. You have 30 minutes to complete booking.'
          });
        } else {
          res.status(400).json({ success: false, error: 'Invalid selection data' });
        }
      } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to select seat/room' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}

function generateMockSeats() {
  const seats: any[] = [];
  const occupiedSeats = new Set(['1A', '1B', '2C', '5A', '12F', '15B', '20A', '25C']);
  const blockedSeats = new Set(['3D', '7E', '18F']);

  for (let row = 1; row <= 32; row++) {
    let seatClass = 'economy';
    let seatPrice = 0;
    
    if (row <= 4) {
      seatClass = 'business';
      seatPrice = 15000;
    } else if (row <= 8) {
      seatClass = 'premium';
      seatPrice = 8000;
    }

    const letters = seatClass === 'business' ? ['A', 'B', 'D', 'E'] : ['A', 'B', 'C', 'D', 'E', 'F'];
    
    letters.forEach((letter) => {
      const seatId = `${row}${letter}`;
      const isWindow = letter === 'A' || letter === 'F';
      const isAisle = letter === 'C' || letter === 'D' || (seatClass === 'business' && (letter === 'B' || letter === 'D'));
      
      let extraPrice = 0;
      if (seatClass === 'economy') {
        if (isWindow) extraPrice = 500;
        else if (isAisle) extraPrice = 300;
        if ([12, 13, 14].includes(row)) extraPrice = 1000; // Exit rows
      }

      seats.push({
        id: seatId,
        row: row,
        column: letter,
        class: seatClass,
        type: isWindow ? 'window' : isAisle ? 'aisle' : 'middle',
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

  return seats;
}

function generateMockRooms() {
  const rooms = [];
  const occupiedRooms = new Set(['101', '102', '205', '301', '315', '420', '501']);
  const maintenanceRooms = new Set(['103', '210', '318']);

  for (let floor = 1; floor <= 5; floor++) {
    for (let roomNum = 1; roomNum <= 20; roomNum++) {
      const roomId = `${floor}${roomNum.toString().padStart(2, '0')}`;
      
      let roomType = 'standard';
      let roomPrice = 0;
      
      if (floor === 5 && roomNum <= 2) {
        roomType = 'presidential';
        roomPrice = 35000;
      } else if (floor === 5 || (floor === 4 && roomNum <= 4)) {
        roomType = 'suite';
        roomPrice = 15000;
      } else if (roomNum <= 6 || floor >= 3) {
        roomType = 'deluxe';
        roomPrice = 5000;
      }

      const hasOceanView = roomNum <= 10 && floor >= 2;
      const hasCityView = roomNum > 10 && roomNum <= 15;
      const isCorner = roomNum === 1 || roomNum === 20;
      
      rooms.push({
        id: roomId,
        floor: floor,
        number: roomNum,
        type: roomType,
        name: getRoomTypeName(roomType),
        price: roomPrice,
        size: getRoomSize(roomType),
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
          minibar: true
        },
        amenities: getRoomAmenities(roomType)
      });
    }
  }

  return rooms;
}

function getRoomTypeName(type: string) {
  const names = {
    standard: "Standard Room",
    deluxe: "Deluxe Room", 
    suite: "Executive Suite",
    presidential: "Presidential Suite"
  };
  return names[type as keyof typeof names] || "Standard Room";
}

function getRoomSize(type: string) {
  const sizes = {
    standard: "25 sqm",
    deluxe: "35 sqm",
    suite: "60 sqm", 
    presidential: "120 sqm"
  };
  return sizes[type as keyof typeof sizes] || "25 sqm";
}

function getRoomAmenities(type: string) {
  const baseAmenities = ["AC", "WiFi", "TV", "Minibar"];
  
  switch (type) {
    case 'deluxe':
      return [...baseAmenities, "City View", "Balcony"];
    case 'suite':
      return [...baseAmenities, "Ocean View", "Balcony", "Living Area", "Premium Bathroom"];
    case 'presidential':
      return [...baseAmenities, "Ocean View", "Balcony", "Living Area", "Premium Bathroom", "Butler Service", "Private Terrace"];
    default:
      return baseAmenities;
  }
}