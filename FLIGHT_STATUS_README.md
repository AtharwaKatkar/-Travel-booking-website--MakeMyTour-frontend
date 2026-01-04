# Live Flight Status Feature

A comprehensive real-time flight tracking system with push notifications, delay alerts, and live updates.

## 🚀 Features

### Core Functionality
- **Real-time Flight Status**: Live updates every 30 seconds
- **Flight Search**: Search by flight number or route (from/to cities)
- **Flight Tracking**: Track specific flights with detailed monitoring
- **Push Notifications**: Browser notifications for status changes
- **Delay Management**: Detailed delay reasons and estimated arrival updates
- **Statistics Dashboard**: Overview of flight performance metrics

### Notification System
- **Status Changes**: Get notified when flight status changes (On Time → Delayed, etc.)
- **Delay Alerts**: Notifications for flight delays with reasons
- **Gate Changes**: Alerts when gate assignments change
- **Boarding Notifications**: Alerts for boarding announcements
- **Customizable Settings**: Configure notification preferences and minimum delay thresholds

### User Experience
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Real-time Updates**: Automatic refresh without page reload
- **Offline Support**: Service worker for offline functionality
- **Progressive Web App**: Can be installed as a mobile app

## 📁 File Structure

```
src/
├── api/
│   ├── flightStatus.js          # Mock API with flight data simulation
│   └── index.js                 # Main API exports
├── components/FlightStatus/
│   ├── FlightStatusCard.jsx     # Individual flight status display
│   ├── FlightSearch.jsx         # Search interface
│   ├── FlightTracker.jsx        # Real-time flight tracking modal
│   ├── FlightStatistics.jsx     # Statistics dashboard
│   └── NotificationManager.jsx  # Notification settings
├── hooks/
│   └── useServiceWorker.js      # Service worker integration
├── pages/
│   ├── flight-status.tsx        # Main flight status page
│   ├── flight-status-demo.tsx   # Demo page
│   └── FlightStatusPage.jsx     # Core page component
└── public/
    └── sw.js                    # Service worker for notifications
```

## 🛠 Technical Implementation

### Mock API System
The flight status system uses a sophisticated mock API that simulates real airline operations:

- **Dynamic Status Updates**: Flight statuses change based on time and random events
- **Realistic Delay Simulation**: Delays with actual reasons (weather, technical issues, etc.)
- **Multiple Airlines**: Air India, IndiGo, SpiceJet, Vistara, GoAir
- **Route Coverage**: Major Indian airports (DEL, BOM, BLR, MAA, CCU, etc.)

### Real-time Updates
- **WebSocket-like Functionality**: Simulated using intervals for real-time feel
- **Status Transitions**: Logical progression from scheduled → delayed/on-time → in-flight → landed
- **Update History**: Track all changes with timestamps

### Notification System
- **Browser Notifications API**: Native browser notifications
- **Service Worker**: Background notifications even when tab is inactive
- **Customizable Preferences**: Users can configure what notifications they receive
- **Sound Alerts**: Optional audio notifications

## 🎯 Usage Examples

### Search by Flight Number
```javascript
// Search for a specific flight
await getFlightStatus('AI101');
```

### Search by Route
```javascript
// Find flights from Delhi to Mumbai
await searchFlightsByRoute('Delhi', 'Mumbai');
```

### Subscribe to Updates
```javascript
// Get real-time updates for a flight
const unsubscribe = subscribeToFlightUpdates('AI101', (updatedFlight) => {
  console.log('Flight updated:', updatedFlight);
});
```

## 📊 Sample Data

The system includes realistic flight data:

### Airlines Covered
- **Air India (AI)**: Full-service carrier
- **IndiGo (6E)**: Low-cost carrier
- **SpiceJet (SG)**: Budget airline
- **Vistara (UK)**: Premium service
- **GoAir (G8)**: Low-cost carrier

### Routes Included
- Delhi ↔ Mumbai (High traffic route)
- Bangalore ↔ Chennai (South India connection)
- Kolkata → Guwahati (Northeast connectivity)
- Mumbai → Delhi (Business route)
- Pune → Hyderabad (Tier-2 city connection)

### Status Types
- **ON_TIME**: Flight departing/arriving as scheduled
- **DELAYED**: Flight delayed with reason and duration
- **IN_FLIGHT**: Currently airborne
- **LANDED**: Successfully arrived
- **CANCELLED**: Flight cancelled (rare in simulation)

## 🔧 Configuration

### Notification Settings
Users can configure:
- Enable/disable notifications
- Notification types (status changes, delays, gate changes)
- Minimum delay threshold (5-60 minutes)
- Sound preferences
- Tracked flights list

### Update Intervals
- **Flight Status**: Updates every 30 seconds
- **Statistics**: Refreshes every 2 minutes
- **Notifications**: Immediate on status change

## 🚀 Getting Started

1. **Navigate to Flight Status**:
   ```
   /flight-status
   ```

2. **Try the Demo**:
   ```
   /flight-status-demo
   ```

3. **Search for Flights**:
   - Use sample flight numbers: AI101, 6E205, SG8157, UK955, G8394
   - Or search by route: Delhi to Mumbai, Bangalore to Chennai

4. **Enable Notifications**:
   - Click the bell icon in the header
   - Grant browser notification permission
   - Configure your preferences

5. **Track a Flight**:
   - Click "Track Flight" on any flight card
   - Enable notifications for real-time updates
   - View update history and live changes

## 🎨 UI Components

### FlightStatusCard
- Displays comprehensive flight information
- Color-coded status indicators
- Delay reasons and gate information
- Track flight button

### FlightTracker
- Modal with real-time updates
- Update history timeline
- Notification toggle
- Live status monitoring

### FlightSearch
- Dual search modes (flight number/route)
- Sample data suggestions
- Popular routes shortcuts
- Loading states

### NotificationManager
- Permission management
- Notification preferences
- Tracked flights overview
- Test notification feature

## 📱 Mobile Experience

- **Responsive Design**: Optimized for all screen sizes
- **Touch-friendly**: Large buttons and easy navigation
- **PWA Support**: Can be installed as mobile app
- **Offline Mode**: Basic functionality works offline

## 🔮 Future Enhancements

- **Real API Integration**: Connect to actual airline APIs
- **Flight Maps**: Visual flight tracking on maps
- **Seat Selection**: Integration with booking system
- **Weather Integration**: Weather impact on delays
- **Historical Data**: Flight performance analytics
- **Multi-language**: Support for regional languages

## 🐛 Known Limitations

- **Mock Data**: Uses simulated flight information
- **Limited Routes**: Covers major Indian airports only
- **Notification Persistence**: Requires tab to remain open for some browsers
- **No Real-time GPS**: Flight positions are simulated

## 📞 Support

For issues or questions about the flight status feature:
1. Check the demo page for examples
2. Verify notification permissions in browser settings
3. Ensure JavaScript is enabled
4. Try refreshing the page if updates stop

---

**Note**: This is a demonstration feature using mock data. In a production environment, this would integrate with real airline APIs and flight data providers.