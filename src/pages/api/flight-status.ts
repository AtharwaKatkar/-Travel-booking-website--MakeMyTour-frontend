import type { NextApiRequest, NextApiResponse } from 'next';

// Mock flight status data for API endpoint
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
    delayDuration: 60,
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
  }
];

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method, query } = req;

  switch (method) {
    case 'GET':
      if (query.flightNumber) {
        // Get specific flight
        const flight = mockFlightStatuses.find(
          f => f.flightNumber.toLowerCase() === (query.flightNumber as string).toLowerCase()
        );
        
        if (flight) {
          res.status(200).json({ success: true, data: flight });
        } else {
          res.status(404).json({ success: false, error: 'Flight not found' });
        }
      } else {
        // Get all flights
        res.status(200).json({ success: true, data: mockFlightStatuses });
      }
      break;

    default:
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}