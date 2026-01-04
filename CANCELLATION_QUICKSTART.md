# Cancellation & Refunds - Quick Start Guide

Get up and running with the Cancellation & Refunds system in minutes!

## 🚀 Quick Demo

**Try the live demo:** [http://localhost:3000/cancellation-demo](http://localhost:3000/cancellation-demo)

## 📋 5-Minute Setup

### 1. Start the Development Server
```bash
npm run dev
# or
yarn dev
```

### 2. Access the System
- **Main Dashboard**: [http://localhost:3000/cancellation](http://localhost:3000/cancellation)
- **Demo Page**: [http://localhost:3000/cancellation-demo](http://localhost:3000/cancellation-demo)

### 3. Try These Features

#### Cancel a Booking
1. Go to the cancellation dashboard
2. Find a confirmed booking (e.g., "AI101 - Air India")
3. Click the "Cancel" button
4. Follow the 3-step cancellation process:
   - Review policy and refund calculation
   - Select cancellation reason
   - Confirm cancellation

#### Track a Refund
1. Click "Track Refund" in the dashboard
2. Enter refund reference: `REF-6E205-003`
3. View detailed refund progress and timeline

#### Filter and Search
1. Use the search bar to find bookings by reference, airline, or passenger name
2. Filter by status (Confirmed, Cancelled, etc.)
3. Filter by type (Flights, Hotels)

## 🎯 Key Components to Explore

### CancellationDashboard
```javascript
import CancellationDashboard from '../components/Cancellation/CancellationDashboard';

// Use in your page
<CancellationDashboard />
```

### RefundTracker
```javascript
import RefundTracker from '../components/Cancellation/RefundTracker';

// Track specific refund
<RefundTracker refundReference="REF-AI101-2026-001" />
```

### CancellationModal
```javascript
import CancellationModal from '../components/Cancellation/CancellationModal';

// Cancel booking modal
<CancellationModal
  isOpen={showModal}
  booking={selectedBooking}
  cancellationReasons={reasons}
  onConfirm={handleCancellation}
  onClose={() => setShowModal(false)}
/>
```

## 📊 Sample API Calls

### Get User Bookings
```javascript
import { getUserBookings } from '../api/cancellation';

const bookings = await getUserBookings('user123', 'confirmed');
console.log(bookings.data.bookings);
```

### Calculate Refund
```javascript
import { calculateCancellationRefund } from '../api/cancellation';

const refund = await calculateCancellationRefund('BK001');
console.log(`Refund: ₹${refund.data.netRefund}`);
```

### Submit Cancellation
```javascript
import { submitCancellationRequest } from '../api/cancellation';

const result = await submitCancellationRequest('BK001', {
  reason: 'personal_emergency',
  comments: 'Family emergency'
});
console.log(`Refund Reference: ${result.data.cancellationReference}`);
```

## 🎨 Customization Examples

### Add Custom Cancellation Reason
```javascript
// In cancellation.js, add to cancellationReasons array
{
  value: "covid_related",
  label: "COVID-19 Related",
  category: "health"
}
```

### Modify Refund Policy
```javascript
// In mockBookings, update cancellationPolicy
cancellationPolicy: {
  type: "custom",
  rules: [
    { period: "48h+", refundPercentage: 100, fee: 0 },
    { period: "24-48h", refundPercentage: 75, fee: 500 },
    { period: "<24h", refundPercentage: 25, fee: 1000 }
  ]
}
```

## 🔍 Testing Scenarios

### Test Data Available
- **Confirmed Flight**: BK001 (AI101 - Air India)
- **Confirmed Hotel**: BK002 (Taj Mahal Palace)
- **Cancelled Flight**: BK003 (6E205 - IndiGo) - Use for refund tracking

### Test Refund References
- `REF-6E205-003` - Processed refund
- `REF-AI101-2026-001` - Processing refund

### Test Cancellation Flow
1. Select booking BK001 (AI101)
2. Choose reason: "Personal Emergency"
3. Add comment: "Family emergency"
4. Confirm cancellation
5. Note the refund reference for tracking

## 🛠️ Common Use Cases

### Business Traveler
- Quick cancellation with minimal fees
- Track multiple refunds
- Export refund receipts

### Leisure Traveler
- Understand cancellation policies
- Compare refund amounts
- Get email notifications

### Travel Agent
- Manage multiple client bookings
- Bulk cancellation operations
- Generate refund reports

## 📱 Mobile Experience

The system is fully responsive and works great on:
- ✅ Desktop (1200px+)
- ✅ Tablet (768px - 1199px)
- ✅ Mobile (320px - 767px)

## 🎯 Next Steps

1. **Explore the Demo**: Try all features in the demo page
2. **Read the Full README**: Check `CANCELLATION_README.md` for detailed documentation
3. **Customize**: Modify policies, reasons, and UI to match your needs
4. **Integrate**: Connect with your existing booking system
5. **Deploy**: Build and deploy to production

## 🆘 Need Help?

- **Documentation**: Check `CANCELLATION_README.md`
- **Demo Issues**: Refresh the page and try again
- **API Errors**: Check browser console for details
- **UI Problems**: Ensure all dependencies are installed

## 🎉 What's Included

✅ Complete booking management dashboard  
✅ Multi-step cancellation process  
✅ Real-time refund calculations  
✅ Comprehensive refund tracking  
✅ Responsive design  
✅ Mock data for testing  
✅ API endpoints  
✅ Demo page  
✅ Documentation  

**Happy cancelling! 🎯**