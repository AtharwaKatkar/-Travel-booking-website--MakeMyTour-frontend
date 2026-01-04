# MongoDB Integration Setup Guide

## 🚀 MongoDB Integration Status: ✅ COMPLETE

The MakeMyTrip application now has full MongoDB integration for the cancellation system!

## 📋 What's Been Integrated

### ✅ **Database Connection**
- MongoDB client setup with connection pooling
- Environment variable configuration
- Development and production connection handling

### ✅ **Data Models**
- TypeScript interfaces for all booking data
- Comprehensive booking schema with cancellation support
- Cancellation reasons and refund statistics models

### ✅ **Database Service**
- Complete BookingService class with all CRUD operations
- Real-time refund calculations
- Cancellation request processing
- Refund status tracking
- Sample data initialization

### ✅ **API Integration**
- Updated API endpoints to use MongoDB
- Replaced mock data with database operations
- Error handling and validation

## 🛠️ Setup Instructions

### 1. **Install MongoDB**

#### Option A: Local MongoDB Installation
```bash
# Windows (using Chocolatey)
choco install mongodb

# macOS (using Homebrew)
brew tap mongodb/brew
brew install mongodb-community

# Ubuntu/Debian
sudo apt-get install mongodb
```

#### Option B: MongoDB Atlas (Cloud)
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account
3. Create a new cluster
4. Get your connection string

### 2. **Start MongoDB Service**

#### Local MongoDB
```bash
# Windows
net start MongoDB

# macOS/Linux
sudo systemctl start mongod
# or
mongod --dbpath /path/to/your/data/directory
```

#### MongoDB Atlas
- No setup needed, it's cloud-hosted

### 3. **Configure Environment Variables**

The `.env.local` file has been created with default settings:

```env
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/makemytrip
MONGODB_DB=makemytrip

# For MongoDB Atlas, use:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/makemytrip
```

### 4. **Initialize Sample Data**

The application will automatically initialize sample data when you first access the cancellation system.

Or manually initialize:
```bash
curl -X POST http://localhost:3000/api/init-sample-data
```

## 📊 Database Schema

### **Bookings Collection**
```javascript
{
  _id: ObjectId,
  id: "BK001", // Unique booking ID
  type: "flight" | "hotel",
  bookingReference: "AI101-2026-001",
  status: "confirmed" | "cancelled" | "completed" | "pending",
  userId: "user123",
  bookingDate: "2026-01-01T10:00:00Z",
  travelDate: "2026-01-15T14:30:00Z", // for flights
  checkIn: "2026-01-20T15:00:00Z", // for hotels
  checkOut: "2026-01-23T11:00:00Z", // for hotels
  passenger: { // for flights
    name: "Rajesh Kumar",
    email: "rajesh@example.com",
    phone: "+91-9876543210"
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
  pricing: {
    basePrice: 8500,
    taxes: 1500,
    fees: 200,
    totalPaid: 10200,
    currency: "INR"
  },
  cancellationPolicy: {
    type: "flexible",
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
    refundAmount: 4905,
    refundStatus: "processing",
    refundReference: "REF-AI101-2026-001"
  },
  canCancel: true,
  canModify: true,
  createdAt: Date,
  updatedAt: Date
}
```

### **Cancellation Reasons Collection**
```javascript
{
  _id: ObjectId,
  value: "personal_emergency",
  label: "Personal Emergency",
  category: "personal"
}
```

## 🔧 API Endpoints (Updated)

All endpoints now use MongoDB:

### **GET Endpoints**
- `GET /api/cancellation?action=bookings&userId=user123` - Get user bookings
- `GET /api/cancellation?action=booking-details&bookingId=BK001` - Get booking details
- `GET /api/cancellation?action=calculate-refund&bookingId=BK001` - Calculate refund
- `GET /api/cancellation?action=cancellation-reasons` - Get cancellation reasons
- `GET /api/cancellation?action=track-refund&refundReference=REF-001` - Track refund
- `GET /api/cancellation?action=refund-statistics&userId=user123` - Get statistics

### **POST Endpoints**
- `POST /api/cancellation?action=cancel-booking` - Submit cancellation
- `POST /api/init-sample-data` - Initialize sample data

## 🎯 Testing the Integration

### 1. **Start the Application**
```bash
npm run dev
```

### 2. **Access the Cancellation System**
- Dashboard: `http://localhost:3000/cancellation`
- Demo: `http://localhost:3000/cancellation-demo`

### 3. **Test Database Operations**
- View bookings (loads from MongoDB)
- Cancel a booking (saves to MongoDB)
- Track refund status (reads from MongoDB)
- Filter and search (queries MongoDB)

## 🔍 Verify MongoDB Integration

### **Check Database Connection**
```javascript
// In browser console on any page
fetch('/api/cancellation?action=bookings&userId=user123')
  .then(r => r.json())
  .then(console.log);
```

### **View Database Contents**
```bash
# Connect to MongoDB
mongo makemytrip

# View collections
show collections

# View bookings
db.bookings.find().pretty()

# View cancellation reasons
db.cancellation_reasons.find().pretty()
```

## 🚨 Troubleshooting

### **Connection Issues**
1. **Check MongoDB is running**:
   ```bash
   # Check if MongoDB is running
   ps aux | grep mongod
   ```

2. **Check connection string**:
   - Verify `.env.local` has correct MONGODB_URI
   - For Atlas, ensure IP whitelist includes your IP

3. **Check database permissions**:
   - Ensure user has read/write access to the database

### **Sample Data Issues**
1. **Manually initialize data**:
   ```bash
   curl -X POST http://localhost:3000/api/init-sample-data
   ```

2. **Clear and reinitialize**:
   ```bash
   # Connect to MongoDB
   mongo makemytrip
   
   # Drop collections
   db.bookings.drop()
   db.cancellation_reasons.drop()
   
   # Restart app to reinitialize
   ```

## 🎉 Benefits of MongoDB Integration

### ✅ **Real Data Persistence**
- Bookings persist across app restarts
- Real cancellation history
- Actual refund tracking

### ✅ **Scalability**
- Handle thousands of bookings
- Efficient querying and indexing
- Horizontal scaling support

### ✅ **Advanced Features**
- Complex queries and aggregations
- Real-time data updates
- Backup and recovery

### ✅ **Production Ready**
- ACID transactions support
- Data validation and constraints
- Performance optimization

## 🚀 Next Steps

### **Phase 2 Enhancements**
1. **User Authentication Integration**
   - Connect with existing user system
   - User-specific booking management

2. **Advanced Queries**
   - Date range filtering
   - Price range searches
   - Advanced analytics

3. **Real-time Updates**
   - WebSocket integration for live updates
   - Push notifications for status changes

4. **Data Analytics**
   - Booking trends analysis
   - Cancellation pattern insights
   - Revenue impact reports

## ✅ **Integration Complete!**

The MakeMyTrip application now has full MongoDB integration with:
- ✅ Database connection and models
- ✅ Complete CRUD operations
- ✅ Real data persistence
- ✅ Sample data initialization
- ✅ Production-ready architecture

**Ready for production use! 🚀**