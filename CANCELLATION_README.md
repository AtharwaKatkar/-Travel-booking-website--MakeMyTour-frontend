# Cancellation & Refunds System

A comprehensive booking management system with intelligent cancellation policies, real-time refund calculations, and seamless tracking capabilities.

## 🚀 Features

### Core Functionality
- **Booking Management Dashboard**: View and manage all bookings in one place
- **Smart Cancellation System**: Intelligent cancellation with real-time refund calculations
- **Refund Status Tracking**: Track refund progress with detailed timeline
- **Dynamic Policies**: Flexible cancellation policies based on booking type and timing
- **Multi-step Cancellation Process**: Guided cancellation with policy review and confirmation

### Key Highlights
- ✅ Real-time refund calculation based on cancellation policies
- ✅ Step-by-step cancellation process with clear confirmations
- ✅ Comprehensive refund tracking with progress timeline
- ✅ Multiple cancellation reasons and optional comments
- ✅ Transparent fee structure and policy explanations
- ✅ Email notifications and receipt downloads
- ✅ Responsive design for all devices
- ✅ Mock data for demonstration purposes

## 📁 File Structure

```
src/
├── api/
│   └── cancellation.js              # API functions for cancellation operations
├── components/Cancellation/
│   ├── BookingCard.jsx              # Individual booking display component
│   ├── CancellationModal.jsx        # Multi-step cancellation modal
│   ├── CancellationDashboard.jsx    # Main dashboard component
│   └── RefundTracker.jsx            # Refund status tracking component
├── pages/
│   ├── api/
│   │   └── cancellation.ts          # Next.js API endpoints
│   ├── cancellation.tsx             # Main cancellation page
│   └── cancellation-demo.tsx        # Demo showcase page
└── README files
```

## 🛠️ Installation & Setup

1. **Install Dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

3. **Access the Application**
   - Main Dashboard: `http://localhost:3000/cancellation`
   - Demo Page: `http://localhost:3000/cancellation-demo`

## 📊 API Endpoints

### GET Endpoints
- `GET /api/cancellation?action=bookings&userId={id}` - Get user bookings
- `GET /api/cancellation?action=booking-details&bookingId={id}` - Get booking details
- `GET /api/cancellation?action=calculate-refund&bookingId={id}` - Calculate refund amount
- `GET /api/cancellation?action=cancellation-reasons` - Get cancellation reasons
- `GET /api/cancellation?action=track-refund&refundReference={ref}` - Track refund status
- `GET /api/cancellation?action=cancellation-policies&type={type}` - Get cancellation policies
- `GET /api/cancellation?action=refund-statistics&userId={id}` - Get refund statistics

### POST Endpoints
- `POST /api/cancellation?action=cancel-booking` - Submit cancellation request

### PUT Endpoints
- `PUT /api/cancellation?action=update-refund-status` - Update refund status (admin)

## 🎯 Usage Examples

### Basic Cancellation Flow
```javascript
import { 
  getUserBookings, 
  calculateCancellationRefund, 
  submitCancellationRequest 
} from '../api/cancellation';

// Get user bookings
const bookings = await getUserBookings('user123');

// Calculate refund for a booking
const refundCalculation = await calculateCancellationRefund('BK001');

// Submit cancellation request
const cancellation = await submitCancellationRequest('BK001', {
  reason: 'personal_emergency',
  comments: 'Family emergency',
  refundMethod: 'original_payment'
});
```

### Refund Tracking
```javascript
import { trackRefundStatus } from '../api/cancellation';

// Track refund status
const refundStatus = await trackRefundStatus('REF-AI101-2026-001');
console.log(refundStatus.data.stages); // Progress stages
console.log(refundStatus.data.currentStatus); // Current status
```

## 🎨 Components

### CancellationDashboard
Main dashboard component with booking management features:
- Booking list with filtering and search
- Statistics cards
- Quick actions for cancellation and refund tracking

### CancellationModal
Multi-step modal for booking cancellation:
- Step 1: Policy review and refund calculation
- Step 2: Cancellation reason selection
- Step 3: Final confirmation

### RefundTracker
Comprehensive refund tracking component:
- Search by refund reference
- Progress timeline with status updates
- Refund details and contact information

### BookingCard
Individual booking display with:
- Booking details and status
- Expandable information sections
- Action buttons for cancellation/modification

## 📋 Mock Data Structure

### Booking Object
```javascript
{
  id: "BK001",
  type: "flight", // or "hotel"
  bookingReference: "AI101-2026-001",
  status: "confirmed", // confirmed, cancelled, completed, pending
  bookingDate: "2026-01-01T10:00:00Z",
  travelDate: "2026-01-15T14:30:00Z", // for flights
  checkIn: "2026-01-20T15:00:00Z", // for hotels
  checkOut: "2026-01-23T11:00:00Z", // for hotels
  passenger: { // for flights
    name: "Rajesh Kumar",
    email: "rajesh@example.com",
    phone: "+91-9876543210"
  },
  guest: { // for hotels
    name: "Priya Sharma",
    email: "priya@example.com",
    phone: "+91-9876543211"
  },
  flight: { // for flight bookings
    flightNumber: "AI101",
    airline: "Air India",
    route: "Delhi (DEL) → Mumbai (BOM)",
    departure: "2026-01-15T14:30:00Z",
    arrival: "2026-01-15T16:45:00Z",
    class: "economy",
    seat: "12A"
  },
  hotel: { // for hotel bookings
    name: "The Taj Mahal Palace",
    location: "Mumbai, Maharashtra",
    roomType: "Deluxe Ocean View",
    roomNumber: "301",
    nights: 3
  },
  pricing: {
    basePrice: 8500, // or roomRate for hotels
    taxes: 1500,
    fees: 200,
    totalPaid: 10200,
    currency: "INR"
  },
  cancellationPolicy: {
    type: "flexible", // flexible, standard, strict
    rules: [
      { 
        period: "24h+", 
        refundPercentage: 90, 
        fee: 500,
        description: "Cancel 24+ hours before departure"
      }
    ]
  },
  cancellation: { // present if cancelled
    reason: "personal_emergency",
    comments: "Family emergency",
    requestedAt: "2026-01-08T16:45:00Z",
    processedAt: "2026-01-08T17:30:00Z",
    refundAmount: 4905,
    refundFee: 545,
    refundStatus: "processed", // processing, processed, failed
    refundMethod: "original_payment",
    refundReference: "REF-6E205-003",
    expectedRefundDate: "2026-01-15T00:00:00Z"
  },
  canCancel: true,
  canModify: true
}
```

### Cancellation Reasons
```javascript
[
  { value: "personal_emergency", label: "Personal Emergency", category: "personal" },
  { value: "medical_emergency", label: "Medical Emergency", category: "medical" },
  { value: "family_emergency", label: "Family Emergency", category: "personal" },
  { value: "work_conflict", label: "Work Conflict", category: "professional" },
  { value: "weather_concerns", label: "Weather Concerns", category: "external" },
  { value: "travel_restrictions", label: "Travel Restrictions", category: "external" },
  { value: "flight_schedule_change", label: "Flight Schedule Change", category: "airline" },
  { value: "hotel_issues", label: "Hotel Issues", category: "accommodation" },
  { value: "change_of_plans", label: "Change of Plans", category: "personal" },
  { value: "financial_constraints", label: "Financial Constraints", category: "personal" },
  { value: "other", label: "Other", category: "other" }
]
```

## 🎛️ Cancellation Policies

### Flight Policies
- **Flexible**: 90% refund (24h+), 50% refund (2-24h), 0% refund (<2h)
- **Standard**: 75% refund (24h+), 25% refund (2-24h), 0% refund (<2h)
- **Strict**: Non-refundable with cancellation fees

### Hotel Policies
- **Flexible**: 100% refund (48h+), 75% refund (24-48h), 25% refund (<24h)
- **Standard**: 90% refund (48h+), 50% refund (24-48h), 0% refund (<24h)
- **Strict**: Non-refundable with cancellation fees

## 🔧 Customization

### Adding New Cancellation Reasons
```javascript
// In cancellation.js
const newReason = {
  value: "custom_reason",
  label: "Custom Reason",
  category: "custom"
};
cancellationReasons.push(newReason);
```

### Modifying Refund Calculation
```javascript
// In calculateCancellationRefund function
const customRefundLogic = (booking, hoursUntilTravel) => {
  // Your custom refund calculation logic
  return {
    refundPercentage: 80,
    cancellationFee: 300
  };
};
```

### Adding New Booking Types
```javascript
// Extend the booking object structure
const newBookingType = {
  type: "car_rental",
  carRental: {
    company: "Hertz",
    model: "Toyota Camry",
    pickupLocation: "Airport",
    dropoffLocation: "Hotel"
  }
};
```

## 🚀 Deployment

### Build for Production
```bash
npm run build
# or
yarn build
```

### Environment Variables
```env
NEXT_PUBLIC_API_URL=your_api_url
NEXT_PUBLIC_PAYMENT_GATEWAY=your_payment_gateway
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Create a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Email: support@makemytrip.com
- Phone: 1800-123-4567
- Documentation: [Link to docs]

## 🔄 Version History

- **v1.0.0** - Initial release with core cancellation features
- **v1.1.0** - Added refund tracking and enhanced policies
- **v1.2.0** - Improved UI/UX and added demo page

---

Built with ❤️ for seamless travel experience management.