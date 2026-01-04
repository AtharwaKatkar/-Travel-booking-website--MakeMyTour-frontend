import axios from "axios";

// Mock flight status data
const mockFlightStatuses = [
  {
    id: "AI101",
    flightNumber: "AI101",
    airline: "Air India",
    from: "Delhi (DEL)",
    to: "Mumbai (BOM)",
    scheduledDeparture: "2026-01-02T10:30:00Z",
    scheduledArrival: "2026-01-02T12:45:00Z",
    actualDeparture: "2026-01-02T11:30:00Z",
    estimatedArrival: "2026-01-02T13:45:00Z",
    status: "DELAYED",
    delayReason: "Weather conditions at departure airport",
    delayDuration: 60, // minutes
    gate: "A12",
    terminal: "T3",
    aircraft: "Boeing 737-800",
    lastUpdated: new Date().toISOString()
  },
  {
    id: "6E205",
    flightNumber: "6E205",
    airline: "IndiGo",
    from: "Bangalore (BLR)",
    to: "Chennai (MAA)",
    scheduledDeparture: "2026-01-02T14:15:00Z",
    scheduledArrival: "2026-01-02T15:30:00Z",
    actualDeparture: "2026-01-02T14:15:00Z",
    estimatedArrival: "2026-01-02T15:30:00Z",
    status: "ON_TIME",
    delayReason: null,
    delayDuration: 0,
    gate: "B7",
    terminal: "T1",
    aircraft: "Airbus A320",
    lastUpdated: new Date().toISOString()
  },
  {
    id: "SG8157",
    flightNumber: "SG8157",
    airline: "SpiceJet",
    from: "Kolkata (CCU)",
    to: "Guwahati (GAU)",
    scheduledDeparture: "2026-01-02T16:45:00Z",
    scheduledArrival: "2026-01-02T18:20:00Z",
    actualDeparture: null,
    estimatedArrival: "2026-01-02T19:50:00Z",
    status: "DELAYED",
    delayReason: "Technical issue - aircraft maintenance",
    delayDuration: 90,
    gate: "C4",
    terminal: "T2",
    aircraft: "Boeing 737-900",
    lastUpdated: new Date().toISOString()
  },
  {
    id: "UK955",
    flightNumber: "UK955",
    airline: "Vistara",
    from: "Mumbai (BOM)",
    to: "Delhi (DEL)",
    scheduledDeparture: "2026-01-02T19:30:00Z",
    scheduledArrival: "2026-01-02T21:45:00Z",
    actualDeparture: "2026-01-02T19:25:00Z",
    estimatedArrival: "2026-01-02T21:40:00Z",
    status: "IN_FLIGHT",
    delayReason: null,
    delayDuration: 0,
    gate: "D9",
    terminal: "T2",
    aircraft: "Airbus A321",
    lastUpdated: new Date().toISOString()
  },
  {
    id: "G8394",
    flightNumber: "G8394",
    airline: "GoAir",
    from: "Pune (PNQ)",
    to: "Hyderabad (HYD)",
    scheduledDeparture: "2026-01-02T08:00:00Z",
    scheduledArrival: "2026-01-02T09:30:00Z",
    actualDeparture: "2026-01-02T08:00:00Z",
    estimatedArrival: "2026-01-02T09:30:00Z",
    status: "LANDED",
    delayReason: null,
    delayDuration: 0,
    gate: "E3",
    terminal: "T1",
    aircraft: "Airbus A320neo",
    lastUpdated: new Date().toISOString()
  }
];

// Simulate real-time updates by randomly changing flight statuses
const simulateStatusUpdates = () => {
  const statuses = ['ON_TIME', 'DELAYED', 'IN_FLIGHT', 'LANDED', 'CANCELLED'];
  const delayReasons = [
    'Weather conditions at departure airport',
    'Air traffic congestion',
    'Technical issue - aircraft maintenance',
    'Crew scheduling conflict',
    'Airport operational delays',
    'Security clearance delay'
  ];

  mockFlightStatuses.forEach(flight => {
    // 20% chance of status change
    if (Math.random() < 0.2) {
      const currentTime = new Date();
      const scheduledDep = new Date(flight.scheduledDeparture);
      const scheduledArr = new Date(flight.scheduledArrival);

      if (currentTime < scheduledDep) {
        // Flight hasn't departed yet
        flight.status = Math.random() < 0.7 ? 'ON_TIME' : 'DELAYED';
        if (flight.status === 'DELAYED') {
          flight.delayDuration = Math.floor(Math.random() * 120) + 15; // 15-135 minutes
          flight.delayReason = delayReasons[Math.floor(Math.random() * delayReasons.length)];
          
          // Update estimated times
          const delayMs = flight.delayDuration * 60 * 1000;
          flight.estimatedArrival = new Date(scheduledArr.getTime() + delayMs).toISOString();
        } else {
          flight.delayDuration = 0;
          flight.delayReason = null;
          flight.estimatedArrival = flight.scheduledArrival;
        }
      } else if (currentTime >= scheduledDep && currentTime < scheduledArr) {
        // Flight should be in air
        flight.status = 'IN_FLIGHT';
        flight.actualDeparture = flight.scheduledDeparture;
      } else {
        // Flight should have landed
        flight.status = 'LANDED';
        flight.actualDeparture = flight.scheduledDeparture;
      }

      flight.lastUpdated = new Date().toISOString();
    }
  });
};

// Get all flight statuses
export const getAllFlightStatuses = async () => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Simulate status updates
    simulateStatusUpdates();
    
    return {
      success: true,
      data: mockFlightStatuses,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    throw new Error('Failed to fetch flight statuses');
  }
};

// Get specific flight status
export const getFlightStatus = async (flightNumber) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    simulateStatusUpdates();
    
    const flight = mockFlightStatuses.find(f => 
      f.flightNumber.toLowerCase() === flightNumber.toLowerCase()
    );
    
    if (!flight) {
      throw new Error('Flight not found');
    }
    
    return {
      success: true,
      data: flight,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    throw error;
  }
};

// Search flights by route
export const searchFlightsByRoute = async (from, to) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    simulateStatusUpdates();
    
    const flights = mockFlightStatuses.filter(flight => 
      flight.from.toLowerCase().includes(from.toLowerCase()) &&
      flight.to.toLowerCase().includes(to.toLowerCase())
    );
    
    return {
      success: true,
      data: flights,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    throw new Error('Failed to search flights');
  }
};

// Subscribe to flight updates (mock WebSocket-like functionality)
export const subscribeToFlightUpdates = (flightNumber, callback) => {
  const interval = setInterval(async () => {
    try {
      const response = await getFlightStatus(flightNumber);
      callback(response.data);
    } catch (error) {
      console.error('Error fetching flight updates:', error);
    }
  }, 30000); // Update every 30 seconds

  return () => clearInterval(interval);
};

// Get flight statistics
export const getFlightStatistics = async () => {
  try {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    simulateStatusUpdates();
    
    const stats = {
      total: mockFlightStatuses.length,
      onTime: mockFlightStatuses.filter(f => f.status === 'ON_TIME').length,
      delayed: mockFlightStatuses.filter(f => f.status === 'DELAYED').length,
      inFlight: mockFlightStatuses.filter(f => f.status === 'IN_FLIGHT').length,
      landed: mockFlightStatuses.filter(f => f.status === 'LANDED').length,
      cancelled: mockFlightStatuses.filter(f => f.status === 'CANCELLED').length,
      averageDelay: Math.round(
        mockFlightStatuses
          .filter(f => f.delayDuration > 0)
          .reduce((sum, f) => sum + f.delayDuration, 0) /
        Math.max(mockFlightStatuses.filter(f => f.delayDuration > 0).length, 1)
      )
    };
    
    return {
      success: true,
      data: stats,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    throw new Error('Failed to fetch flight statistics');
  }
};