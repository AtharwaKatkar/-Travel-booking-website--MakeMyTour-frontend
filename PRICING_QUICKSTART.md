# Dynamic Pricing Engine - Quick Start Guide

Get up and running with the Dynamic Pricing Engine in minutes!

## 🚀 Quick Demo

**Try the live demo:** [http://localhost:3000/pricing-demo](http://localhost:3000/pricing-demo)

## 📋 5-Minute Setup

### 1. Start the Development Server
```bash
npm run dev
```

### 2. Access the System
- **Main Dashboard**: [http://localhost:3000/pricing](http://localhost:3000/pricing)
- **Demo Page**: [http://localhost:3000/pricing-demo](http://localhost:3000/pricing-demo)

### 3. Try These Features

#### View Dynamic Pricing
1. Go to the pricing dashboard
2. Select "Flight Pricing" or "Hotel Pricing" tab
3. Choose an item (e.g., "Air India AI101")
4. See real-time pricing with demand factors

#### Create a Price Freeze
1. Select any flight or hotel
2. Click "Freeze This Price" in the price freeze card
3. Watch the 24-hour countdown timer
4. Use the freeze when booking

#### Explore Price History
1. View interactive price charts
2. Switch between 7d, 30d, and 90d periods
3. See price trends and statistics
4. Hover over data points for details

#### Analyze Demand Factors
1. Check the "Demand Factors" section
2. See active pricing multipliers
3. Understand seasonal, occupancy, and event impacts
4. View combined price impact

## 🎯 Key Components to Explore

### PricingDashboard
```javascript
import PricingDashboard from '../components/Pricing/PricingDashboard';

// Use in your page
<PricingDashboard />
```

### PriceHistoryChart
```javascript
import PriceHistoryChart from '../components/Pricing/PriceHistoryChart';

// Display price history
<PriceHistoryChart
  itemType="flight"
  itemId="AI101"
  priceHistory={historyData}
  currentPrice={10200}
  basePrice={8500}
/>
```

### PriceFreezeCard
```javascript
import PriceFreezeCard from '../components/Pricing/PriceFreezeCard';

// Price freeze management
<PriceFreezeCard
  itemType="flight"
  itemId="AI101"
  currentPrice={10200}
  onCreateFreeze={handleCreateFreeze}
  onUseFreeze={handleUseFreeze}
  existingFreeze={freezeData}
/>
```

## 📊 Sample API Calls

### Get Flight Pricing
```javascript
import { getFlightPricing } from '../api/pricing';

const pricing = await getFlightPricing('AI101', '2026-02-15');
console.log(`Current price: ₹${pricing.data.currentPrice}`);
console.log(`Price change: ${pricing.data.priceChangePercentage}%`);
```

### Create Price Freeze
```javascript
import { createPriceFreeze } from '../api/pricing';

const freeze = await createPriceFreeze('user123', 'flight', 'AI101', 8500);
console.log(`Freeze ID: ${freeze.data.id}`);
console.log(`Expires: ${freeze.data.freezeEndTime}`);
```

### Get Price History
```javascript
import { getPriceHistory } from '../api/pricing';

const history = await getPriceHistory('flight', 'AI101', 30);
console.log(`${history.data.priceHistory.length} price points`);
console.log(`Current trend: ${history.data.bookingTrend}`);
```

### Use Price Freeze
```javascript
import { usePriceFreeze } from '../api/pricing';

const result = await usePriceFreeze('PF123456', 'user123');
console.log(`Savings: ₹${result.data.savings}`);
```

## 🎨 Customization Examples

### Add Custom Demand Factor
```javascript
// In pricingService.ts
const customFactor = {
  type: 'promotion',
  name: 'Flash Sale',
  multiplier: 0.7, // 30% discount
  description: 'Limited time flash sale pricing',
  isActive: true
};
```

### Modify Price Calculation
```javascript
// Custom pricing logic
const calculateCustomPrice = (basePrice, demandFactors) => {
  let multiplier = 1;
  
  // Apply your custom logic
  demandFactors.forEach(factor => {
    if (factor.type === 'seasonal') {
      multiplier *= factor.multiplier * 1.1; // Boost seasonal impact
    } else {
      multiplier *= factor.multiplier;
    }
  });
  
  return Math.round(basePrice * multiplier);
};
```

### Add New Item Type
```javascript
// Extend for car rentals
const carRentalPricing = {
  carId: 'CAR001',
  model: 'Toyota Camry',
  location: 'Mumbai Airport',
  basePrice: 2500,
  currentPrice: 3200,
  // ... other fields
};
```

## 🔍 Testing Scenarios

### Test Data Available
- **Flight AI101**: Delhi → Mumbai (Base: ₹8,500)
- **Flight SG102**: Mumbai → Bangalore (Base: ₹6,200)
- **Hotel TAJ001**: Taj Mahal Palace Mumbai (Base: ₹12,000)

### Test Pricing Scenarios
1. **High Demand**: 80%+ occupancy = +30% price
2. **Holiday Season**: Winter holidays = +40% price
3. **Weekend Premium**: Friday/Saturday = +15% price
4. **Low Season**: <30% occupancy = -15% price

### Test Price Freeze Flow
1. Select any item with current price
2. Create price freeze
3. Wait for price to change (or simulate)
4. Use freeze to get original price
5. See savings calculation

## 🛠️ Common Use Cases

### Travel Agency
- Monitor pricing across multiple routes
- Create bulk price freezes for clients
- Analyze demand patterns
- Optimize booking timing

### Individual Traveler
- Track price history before booking
- Use price freeze for protection
- Understand pricing factors
- Find best booking times

### Business Traveler
- Quick price freeze for approval process
- Corporate rate comparisons
- Expense planning with price trends
- Last-minute booking optimization

## 📱 Mobile Experience

The system is fully responsive:
- ✅ **Mobile Charts**: Touch-friendly price history
- ✅ **Swipe Navigation**: Easy tab switching
- ✅ **Touch Controls**: Tap to create/use freezes
- ✅ **Responsive Layout**: Optimized for all screens

## 🎯 Next Steps

1. **Explore the Demo**: Try all features in the demo page
2. **Read Full Documentation**: Check `PRICING_README.md`
3. **Customize Factors**: Modify demand factors for your needs
4. **Integrate APIs**: Connect with your booking system
5. **Deploy**: Build and deploy to production

## 🆘 Need Help?

- **Documentation**: Check `PRICING_README.md` for detailed info
- **Demo Issues**: Refresh page and try again
- **API Errors**: Check browser console for details
- **UI Problems**: Ensure all dependencies are installed

## 🎉 What's Included

✅ **Dynamic Pricing Engine** with demand-based adjustments  
✅ **Price History Charts** with interactive visualization  
✅ **Price Freeze System** with 24-hour protection  
✅ **Demand Factor Analysis** with transparent breakdowns  
✅ **MongoDB Integration** with full data persistence  
✅ **Responsive Design** for all devices  
✅ **Comprehensive Analytics** with insights  
✅ **Demo Page** with feature showcase  
✅ **API Documentation** with examples  

## 🔥 Pro Tips

- **Best Booking Times**: Use price history to identify patterns
- **Price Freeze Strategy**: Create freezes during low-price periods
- **Demand Awareness**: Book early during high-demand seasons
- **Multiple Options**: Compare prices across different dates
- **Trend Analysis**: Use 30-day charts for better insights

**Happy pricing! 📈**