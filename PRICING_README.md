# Dynamic Pricing Engine

A comprehensive dynamic pricing system with demand-based adjustments, price history tracking, and price freeze protection for travel bookings.

## 🚀 Features

### Core Functionality
- **Dynamic Price Adjustments**: Real-time pricing based on demand, seasonality, and market conditions
- **Price History Tracking**: Interactive charts showing price trends and historical data
- **Price Freeze Protection**: 24-hour price locks to protect against increases
- **Demand Factor Analysis**: Transparent breakdown of pricing factors
- **Intelligent Algorithms**: Smart pricing optimization with caps and floors

### Key Highlights
- ✅ **Demand-Based Pricing**: +20% during holidays, seasonal adjustments
- ✅ **Real-Time Updates**: Hourly price recalculations based on occupancy
- ✅ **Price History Graphs**: Interactive charts with 7d/30d/90d views
- ✅ **Price Freeze System**: 24-hour protection with countdown timers
- ✅ **Transparent Factors**: Clear breakdown of demand multipliers
- ✅ **MongoDB Integration**: Full database persistence and analytics
- ✅ **Responsive Design**: Optimized for all devices
- ✅ **Comprehensive Analytics**: Pricing insights and statistics

## 📁 File Structure

```
src/
├── models/
│   └── Pricing.ts                   # TypeScript interfaces for pricing data
├── services/
│   └── pricingService.ts            # Core pricing service with MongoDB
├── api/
│   └── pricing.js                   # API client functions
├── components/Pricing/
│   ├── PricingDashboard.jsx         # Main dashboard component
│   ├── PriceHistoryChart.jsx        # Interactive price history charts
│   ├── PriceFreezeCard.jsx          # Price freeze management
│   └── DemandFactors.jsx            # Demand factor analysis display
├── pages/
│   ├── api/
│   │   └── pricing.ts               # Next.js API endpoints
│   ├── pricing.tsx                  # Main pricing page
│   └── pricing-demo.tsx             # Demo showcase page
└── README files
```

## 🛠️ Installation & Setup

1. **Install Dependencies**
   ```bash
   npm install mongodb
   # Dependencies already included in package.json
   ```

2. **Configure MongoDB**
   ```bash
   # Update .env.local with your MongoDB connection
   MONGODB_URI=mongodb://localhost:27017/makemytrip
   MONGODB_DB=makemytrip
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Access the Application**
   - Main Dashboard: `http://localhost:3000/pricing`
   - Demo Page: `http://localhost:3000/pricing-demo`

## 📊 API Endpoints

### GET Endpoints
- `GET /api/pricing?action=flight-pricing&flightId={id}&departureDate={date}` - Get flight pricing
- `GET /api/pricing?action=hotel-pricing&hotelId={id}&checkInDate={date}&checkOutDate={date}` - Get hotel pricing
- `GET /api/pricing?action=price-history&itemType={type}&itemId={id}&days={days}` - Get price history
- `GET /api/pricing?action=user-price-freezes&userId={id}` - Get user's price freezes
- `GET /api/pricing?action=pricing-analytics` - Get pricing analytics
- `GET /api/pricing?action=initialize-sample-data` - Initialize sample data

### POST Endpoints
- `POST /api/pricing?action=create-price-freeze` - Create price freeze

### PUT Endpoints
- `PUT /api/pricing?action=use-price-freeze` - Use price freeze

## 🎯 Usage Examples

### Basic Pricing Operations
```javascript
import { 
  getFlightPricing, 
  createPriceFreeze, 
  getPriceHistory 
} from '../api/pricing';

// Get flight pricing with dynamic updates
const pricing = await getFlightPricing('AI101', '2026-02-15');
console.log(`Current price: ₹${pricing.data.currentPrice}`);

// Create price freeze
const freeze = await createPriceFreeze('user123', 'flight', 'AI101', 8500);
console.log(`Freeze created: ${freeze.data.id}`);

// Get price history
const history = await getPriceHistory('flight', 'AI101', 30);
console.log(history.data.priceHistory);
```

### Price Freeze Management
```javascript
import { usePriceFreeze, getUserPriceFreezes } from '../api/pricing';

// Use a price freeze
const result = await usePriceFreeze('PF123456', 'user123');
console.log(`Saved: ₹${result.data.savings}`);

// Get user's freezes
const freezes = await getUserPriceFreezes('user123');
console.log(`Active freezes: ${freezes.data.active.length}`);
```

## 🎨 Components

### PricingDashboard
Main dashboard with pricing management:
- Flight and hotel pricing tabs
- Real-time price updates
- Analytics cards
- Item selection interface

### PriceHistoryChart
Interactive price history visualization:
- SVG-based line charts
- 7d/30d/90d period selection
- Price statistics and trends
- Hover tooltips with details

### PriceFreezeCard
Price freeze management interface:
- Create new price freezes
- Real-time countdown timers
- Savings calculations
- One-click freeze usage

### DemandFactors
Demand factor analysis display:
- Active demand factors
- Occupancy rate indicators
- Booking trend analysis
- Factor impact breakdown

## 📋 Data Models

### FlightPricing
```javascript
{
  flightId: "AI101",
  route: "Delhi → Mumbai",
  airline: "Air India",
  flightNumber: "AI101",
  departureDate: "2026-02-15",
  basePrice: 8500,
  currentPrice: 10200,
  priceHistory: [
    {
      date: "2026-01-15T10:00:00Z",
      basePrice: 8500,
      finalPrice: 10200,
      demandMultiplier: 1.2,
      seasonalMultiplier: 1.0,
      eventMultiplier: 1.0,
      occupancyRate: 0.75,
      bookingCount: 135
    }
  ],
  demandFactors: [
    {
      type: "occupancy",
      name: "High Occupancy",
      multiplier: 1.3,
      description: "Limited availability drives higher prices",
      isActive: true
    }
  ],
  occupancyRate: 0.75,
  totalSeats: 180,
  availableSeats: 45,
  bookingTrend: "increasing",
  priceChangePercentage: 20,
  lastUpdated: "2026-01-15T10:00:00Z"
}
```

### PriceFreeze
```javascript
{
  id: "PF1642123456",
  userId: "user123",
  itemType: "flight",
  itemId: "AI101",
  frozenPrice: 8500,
  originalPrice: 10200,
  savings: 1700,
  freezeStartTime: "2026-01-15T10:00:00Z",
  freezeEndTime: "2026-01-16T10:00:00Z",
  isActive: true,
  isUsed: false
}
```

### DemandFactor
```javascript
{
  type: "seasonal", // seasonal, event, occupancy, time_based, competition
  name: "Winter Holiday Season",
  multiplier: 1.4,
  startDate: "2026-12-20",
  endDate: "2027-01-05",
  description: "High demand during winter holidays",
  isActive: true
}
```

## 🎛️ Pricing Logic

### Demand Factors
- **Seasonal**: Winter holidays (+40%), Summer season (+50%), Spring (+20%)
- **Events**: Diwali (+60%), Christmas/New Year (+80%), Summer vacation (+40%)
- **Occupancy**: High (80%+) = +30%, Moderate (60-80%) = +10%, Low (<30%) = -15%
- **Time-based**: Weekend premium (+15%), Peak hours adjustments
- **Competition**: Market-based adjustments

### Price Calculation
```javascript
// Base calculation
totalMultiplier = demandFactors.reduce((acc, factor) => acc * factor.multiplier, 1);

// Apply caps and floors
totalMultiplier = Math.min(totalMultiplier, 3.0); // Max 300% increase
totalMultiplier = Math.max(totalMultiplier, 0.5); // Min 50% of base price

finalPrice = Math.round(basePrice * totalMultiplier);
```

### Price Freeze Logic
- **Duration**: 24 hours from creation
- **Savings**: Difference between frozen price and current market price
- **Usage**: One-time use, expires after 24 hours
- **Limitations**: One active freeze per item per user

## 🔧 Customization

### Adding New Demand Factors
```javascript
// In pricingService.ts
const customFactor = {
  type: 'custom',
  name: 'Special Promotion',
  multiplier: 0.8, // 20% discount
  description: 'Limited time promotional pricing',
  isActive: true
};
```

### Modifying Price Calculation
```javascript
// Custom pricing logic
private calculateDynamicPrice(basePrice: number, demandFactors: DemandFactor[]): number {
  let totalMultiplier = 1;
  
  // Your custom calculation logic
  demandFactors.forEach(factor => {
    if (factor.isActive) {
      totalMultiplier *= factor.multiplier;
    }
  });
  
  // Custom caps and floors
  totalMultiplier = Math.min(totalMultiplier, 2.5); // Custom max
  totalMultiplier = Math.max(totalMultiplier, 0.7); // Custom min
  
  return Math.round(basePrice * totalMultiplier);
}
```

### Adding New Item Types
```javascript
// Extend for car rentals, packages, etc.
interface CarRentalPricing extends BasePricing {
  carId: string;
  carModel: string;
  location: string;
  rentalDays: number;
  // ... other car-specific fields
}
```

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Environment Variables
```env
MONGODB_URI=your_mongodb_connection_string
MONGODB_DB=makemytrip
NEXT_PUBLIC_API_BASE_URL=your_api_url
```

### Database Collections
The system creates these MongoDB collections:
- `flight_pricing` - Flight pricing data
- `hotel_pricing` - Hotel pricing data
- `price_freezes` - User price freezes
- `pricing_rules` - Pricing rules and policies
- `price_alerts` - Price alert subscriptions

## 📈 Analytics & Insights

### Pricing Analytics
- Total price changes across all items
- Average price increases and decreases
- Peak demand periods identification
- Top demand routes analysis
- Price freeze usage statistics
- Total savings from freezes

### Performance Metrics
- Price update frequency (hourly)
- Demand factor accuracy
- User engagement with price freezes
- Booking conversion rates
- Revenue optimization impact

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/pricing-enhancement`)
3. Commit your changes (`git commit -am 'Add pricing feature'`)
4. Push to the branch (`git push origin feature/pricing-enhancement`)
5. Create a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Email: support@makemytrip.com
- Phone: 1800-123-4567
- Documentation: [Link to docs]

## 🔄 Version History

- **v1.0.0** - Initial release with dynamic pricing and price freeze
- **v1.1.0** - Added price history charts and demand factor analysis
- **v1.2.0** - Enhanced analytics and MongoDB integration
- **v1.3.0** - Added comprehensive demo and documentation

---

Built with ❤️ for intelligent travel pricing management.