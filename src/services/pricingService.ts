import { getDatabase } from '../lib/mongodb';
import { 
  FlightPricing, 
  HotelPricing, 
  PriceFreeze, 
  PricingRule, 
  PriceAlert,
  PricingAnalytics,
  DemandFactor,
  PriceHistory
} from '../models/Pricing';
import { ObjectId } from 'mongodb';

const FLIGHT_PRICING_COLLECTION = 'flight_pricing';
const HOTEL_PRICING_COLLECTION = 'hotel_pricing';
const PRICE_FREEZES_COLLECTION = 'price_freezes';
const PRICING_RULES_COLLECTION = 'pricing_rules';
const PRICE_ALERTS_COLLECTION = 'price_alerts';

export class PricingService {
  private async getFlightPricingCollection() {
    const db = await getDatabase();
    return db.collection<FlightPricing>(FLIGHT_PRICING_COLLECTION);
  }

  private async getHotelPricingCollection() {
    const db = await getDatabase();
    return db.collection<HotelPricing>(HOTEL_PRICING_COLLECTION);
  }

  private async getPriceFreezesCollection() {
    const db = await getDatabase();
    return db.collection<PriceFreeze>(PRICE_FREEZES_COLLECTION);
  }

  private async getPricingRulesCollection() {
    const db = await getDatabase();
    return db.collection<PricingRule>(PRICING_RULES_COLLECTION);
  }

  private async getPriceAlertsCollection() {
    const db = await getDatabase();
    return db.collection<PriceAlert>(PRICE_ALERTS_COLLECTION);
  }

  // Calculate dynamic price based on demand factors
  private calculateDynamicPrice(basePrice: number, demandFactors: DemandFactor[]): number {
    let totalMultiplier = 1;
    
    demandFactors.forEach(factor => {
      if (factor.isActive) {
        totalMultiplier *= factor.multiplier;
      }
    });

    // Cap the maximum price increase at 300% of base price
    const maxMultiplier = 3.0;
    totalMultiplier = Math.min(totalMultiplier, maxMultiplier);
    
    // Ensure minimum price is at least 50% of base price
    const minMultiplier = 0.5;
    totalMultiplier = Math.max(totalMultiplier, minMultiplier);

    return Math.round(basePrice * totalMultiplier);
  }

  // Get current demand factors based on date, occupancy, etc.
  private getCurrentDemandFactors(
    date: string, 
    occupancyRate: number, 
    type: 'flight' | 'hotel',
    route?: string,
    location?: string
  ): DemandFactor[] {
    const factors: DemandFactor[] = [];
    const currentDate = new Date(date);
    const dayOfWeek = currentDate.getDay();
    const month = currentDate.getMonth();

    // Seasonal factors
    if (month >= 11 || month <= 1) { // Winter holidays
      factors.push({
        type: 'seasonal',
        name: 'Winter Holiday Season',
        multiplier: 1.4,
        description: 'High demand during winter holidays',
        isActive: true
      });
    } else if (month >= 3 && month <= 5) { // Spring season
      factors.push({
        type: 'seasonal',
        name: 'Spring Travel Season',
        multiplier: 1.2,
        description: 'Moderate increase during spring',
        isActive: true
      });
    } else if (month >= 6 && month <= 8) { // Summer season
      factors.push({
        type: 'seasonal',
        name: 'Summer Peak Season',
        multiplier: 1.5,
        description: 'Peak travel season',
        isActive: true
      });
    }

    // Weekend premium
    if (dayOfWeek === 5 || dayOfWeek === 6) { // Friday or Saturday
      factors.push({
        type: 'time_based',
        name: 'Weekend Premium',
        multiplier: 1.15,
        description: 'Higher demand on weekends',
        isActive: true
      });
    }

    // Occupancy-based pricing
    if (occupancyRate > 0.8) {
      factors.push({
        type: 'occupancy',
        name: 'High Occupancy',
        multiplier: 1.3,
        description: 'Limited availability drives higher prices',
        isActive: true
      });
    } else if (occupancyRate > 0.6) {
      factors.push({
        type: 'occupancy',
        name: 'Moderate Occupancy',
        multiplier: 1.1,
        description: 'Moderate demand pricing',
        isActive: true
      });
    } else if (occupancyRate < 0.3) {
      factors.push({
        type: 'occupancy',
        name: 'Low Occupancy Discount',
        multiplier: 0.85,
        description: 'Promotional pricing for low demand',
        isActive: true
      });
    }

    // Special events (mock data)
    const specialEvents = [
      { name: 'Diwali Festival', multiplier: 1.6, dates: ['2026-10-20', '2026-11-10'] },
      { name: 'Christmas & New Year', multiplier: 1.8, dates: ['2026-12-20', '2027-01-05'] },
      { name: 'Summer Vacation', multiplier: 1.4, dates: ['2026-05-15', '2026-06-30'] }
    ];

    specialEvents.forEach(event => {
      const eventStart = new Date(event.dates[0]);
      const eventEnd = new Date(event.dates[1]);
      if (currentDate >= eventStart && currentDate <= eventEnd) {
        factors.push({
          type: 'event',
          name: event.name,
          multiplier: event.multiplier,
          startDate: event.dates[0],
          endDate: event.dates[1],
          description: `Special event pricing for ${event.name}`,
          isActive: true
        });
      }
    });

    return factors;
  }

  // Get flight pricing with dynamic updates
  async getFlightPricing(flightId: string, departureDate: string) {
    try {
      const collection = await this.getFlightPricingCollection();
      let pricing = await collection.findOne({ flightId, departureDate });

      if (!pricing) {
        // Create initial pricing if not exists
        pricing = await this.createInitialFlightPricing(flightId, departureDate);
      }

      // Update pricing if it's been more than 1 hour
      const lastUpdate = new Date(pricing.lastUpdated);
      const now = new Date();
      const hoursSinceUpdate = (now.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60);

      if (hoursSinceUpdate >= 1) {
        pricing = await this.updateFlightPricing(pricing);
      }

      return {
        success: true,
        data: pricing
      };
    } catch (error) {
      console.error('Error getting flight pricing:', error);
      throw new Error('Failed to get flight pricing');
    }
  }

  // Get hotel pricing with dynamic updates
  async getHotelPricing(hotelId: string, checkInDate: string, checkOutDate: string) {
    try {
      const collection = await this.getHotelPricingCollection();
      let pricing = await collection.findOne({ hotelId, checkInDate, checkOutDate });

      if (!pricing) {
        pricing = await this.createInitialHotelPricing(hotelId, checkInDate, checkOutDate);
      }

      const lastUpdate = new Date(pricing.lastUpdated);
      const now = new Date();
      const hoursSinceUpdate = (now.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60);

      if (hoursSinceUpdate >= 1) {
        pricing = await this.updateHotelPricing(pricing);
      }

      return {
        success: true,
        data: pricing
      };
    } catch (error) {
      console.error('Error getting hotel pricing:', error);
      throw new Error('Failed to get hotel pricing');
    }
  }

  // Create price freeze
  async createPriceFreeze(userId: string, itemType: 'flight' | 'hotel', itemId: string, currentPrice: number) {
    try {
      const collection = await this.getPriceFreezesCollection();
      
      // Check if user already has an active freeze for this item
      const existingFreeze = await collection.findOne({
        userId,
        itemType,
        itemId,
        isActive: true,
        isUsed: false
      });

      if (existingFreeze) {
        return {
          success: false,
          error: 'You already have an active price freeze for this item'
        };
      }

      const freezeId = `PF${Date.now()}`;
      const now = new Date();
      const freezeEndTime = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours

      // Simulate future price (10-30% increase)
      const futurePrice = Math.round(currentPrice * (1 + Math.random() * 0.2 + 0.1));
      const savings = futurePrice - currentPrice;

      const priceFreeze: PriceFreeze = {
        id: freezeId,
        userId,
        itemType,
        itemId,
        frozenPrice: currentPrice,
        originalPrice: futurePrice,
        savings,
        freezeStartTime: now.toISOString(),
        freezeEndTime: freezeEndTime.toISOString(),
        isActive: true,
        isUsed: false,
        createdAt: now,
        updatedAt: now
      };

      const result = await collection.insertOne(priceFreeze);

      return {
        success: true,
        data: {
          ...priceFreeze,
          _id: result.insertedId
        }
      };
    } catch (error) {
      console.error('Error creating price freeze:', error);
      throw new Error('Failed to create price freeze');
    }
  }

  // Use price freeze
  async usePriceFreeze(freezeId: string, userId: string) {
    try {
      const collection = await this.getPriceFreezesCollection();
      
      const priceFreeze = await collection.findOne({
        id: freezeId,
        userId,
        isActive: true,
        isUsed: false
      });

      if (!priceFreeze) {
        return {
          success: false,
          error: 'Price freeze not found or already used'
        };
      }

      // Check if freeze has expired
      const now = new Date();
      const freezeEndTime = new Date(priceFreeze.freezeEndTime);
      
      if (now > freezeEndTime) {
        await collection.updateOne(
          { id: freezeId },
          { 
            $set: { 
              isActive: false, 
              updatedAt: now 
            } 
          }
        );

        return {
          success: false,
          error: 'Price freeze has expired'
        };
      }

      // Mark as used
      await collection.updateOne(
        { id: freezeId },
        { 
          $set: { 
            isUsed: true, 
            isActive: false,
            updatedAt: now 
          } 
        }
      );

      return {
        success: true,
        data: {
          frozenPrice: priceFreeze.frozenPrice,
          savings: priceFreeze.savings,
          message: `Price freeze applied! You saved ₹${priceFreeze.savings}`
        }
      };
    } catch (error) {
      console.error('Error using price freeze:', error);
      throw new Error('Failed to use price freeze');
    }
  }

  // Get user's active price freezes
  async getUserPriceFreezes(userId: string) {
    try {
      const collection = await this.getPriceFreezesCollection();
      
      const freezes = await collection
        .find({ userId })
        .sort({ createdAt: -1 })
        .toArray();

      return {
        success: true,
        data: {
          active: freezes.filter(f => f.isActive && !f.isUsed),
          used: freezes.filter(f => f.isUsed),
          expired: freezes.filter(f => !f.isActive && !f.isUsed)
        }
      };
    } catch (error) {
      console.error('Error getting user price freezes:', error);
      throw new Error('Failed to get price freezes');
    }
  }

  // Get price history for an item
  async getPriceHistory(itemType: 'flight' | 'hotel', itemId: string, days: number = 30) {
    try {
      const collection = itemType === 'flight' 
        ? await this.getFlightPricingCollection()
        : await this.getHotelPricingCollection();

      const item = await collection.findOne({ 
        [itemType === 'flight' ? 'flightId' : 'hotelId']: itemId 
      });

      if (!item) {
        return {
          success: false,
          error: 'Item not found'
        };
      }

      // Get last N days of price history
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);

      const priceHistory = item.priceHistory
        .filter(h => new Date(h.date) >= cutoffDate)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      return {
        success: true,
        data: {
          itemId,
          itemType,
          currentPrice: item.currentPrice,
          basePrice: item.basePrice,
          priceHistory,
          priceChangePercentage: item.priceChangePercentage,
          bookingTrend: item.bookingTrend
        }
      };
    } catch (error) {
      console.error('Error getting price history:', error);
      throw new Error('Failed to get price history');
    }
  }

  // Get pricing analytics
  async getPricingAnalytics(): Promise<{ success: boolean; data: PricingAnalytics }> {
    try {
      const flightCollection = await this.getFlightPricingCollection();
      const hotelCollection = await this.getHotelPricingCollection();
      const freezeCollection = await this.getPriceFreezesCollection();

      const [flights, hotels, freezes] = await Promise.all([
        flightCollection.find({}).toArray(),
        hotelCollection.find({}).toArray(),
        freezeCollection.find({}).toArray()
      ]);

      const allItems = [...flights, ...hotels];
      
      // Calculate analytics
      const totalPriceChanges = allItems.reduce((sum, item) => 
        sum + item.priceHistory.length, 0
      );

      const priceChanges = allItems.flatMap(item => 
        item.priceHistory.map(h => h.finalPrice - item.basePrice)
      );

      const increases = priceChanges.filter(change => change > 0);
      const decreases = priceChanges.filter(change => change < 0);

      const analytics: PricingAnalytics = {
        totalPriceChanges,
        averagePriceIncrease: increases.length > 0 
          ? Math.round(increases.reduce((a, b) => a + b, 0) / increases.length)
          : 0,
        averagePriceDecrease: decreases.length > 0 
          ? Math.round(Math.abs(decreases.reduce((a, b) => a + b, 0) / decreases.length))
          : 0,
        peakDemandPeriods: [
          { period: 'Winter Holidays', averageMultiplier: 1.6, description: 'Dec 20 - Jan 5' },
          { period: 'Summer Season', averageMultiplier: 1.4, description: 'May 15 - Aug 31' },
          { period: 'Festival Season', averageMultiplier: 1.5, description: 'Oct 15 - Nov 15' }
        ],
        topDemandRoutes: flights
          .sort((a, b) => b.currentPrice - a.currentPrice)
          .slice(0, 5)
          .map(f => ({
            route: f.route,
            averagePrice: f.currentPrice,
            priceVolatility: Math.round(f.priceChangePercentage)
          })),
        priceFreezesActive: freezes.filter(f => f.isActive && !f.isUsed).length,
        priceFreezesUsed: freezes.filter(f => f.isUsed).length,
        totalSavingsFromFreezes: freezes
          .filter(f => f.isUsed)
          .reduce((sum, f) => sum + f.savings, 0)
      };

      return {
        success: true,
        data: analytics
      };
    } catch (error) {
      console.error('Error getting pricing analytics:', error);
      throw new Error('Failed to get pricing analytics');
    }
  }

  // Private helper methods
  private async createInitialFlightPricing(flightId: string, departureDate: string): Promise<FlightPricing & { _id: ObjectId }> {
    const collection = await this.getFlightPricingCollection();
    
    // Mock flight data
    const mockFlights = [
      { flightId: 'AI101', route: 'Delhi → Mumbai', airline: 'Air India', flightNumber: 'AI101', basePrice: 8500 },
      { flightId: 'SG102', route: 'Mumbai → Bangalore', airline: 'SpiceJet', flightNumber: 'SG102', basePrice: 6200 },
      { flightId: '6E103', route: 'Delhi → Goa', airline: 'IndiGo', flightNumber: '6E103', basePrice: 9800 }
    ];

    const mockFlight = mockFlights.find(f => f.flightId === flightId) || mockFlights[0];
    const occupancyRate = 0.3 + Math.random() * 0.5; // 30-80%
    const totalSeats = 180;
    const availableSeats = Math.round(totalSeats * (1 - occupancyRate));

    const demandFactors = this.getCurrentDemandFactors(departureDate, occupancyRate, 'flight', mockFlight.route);
    const currentPrice = this.calculateDynamicPrice(mockFlight.basePrice, demandFactors);
    const priceChangePercentage = Math.round(((currentPrice - mockFlight.basePrice) / mockFlight.basePrice) * 100);

    const now = new Date();
    const pricing: FlightPricing = {
      flightId,
      route: mockFlight.route,
      airline: mockFlight.airline,
      flightNumber: mockFlight.flightNumber,
      departureDate,
      basePrice: mockFlight.basePrice,
      currentPrice,
      priceHistory: [{
        date: now.toISOString(),
        basePrice: mockFlight.basePrice,
        finalPrice: currentPrice,
        demandMultiplier: demandFactors.reduce((acc, f) => acc * f.multiplier, 1),
        seasonalMultiplier: demandFactors.find(f => f.type === 'seasonal')?.multiplier || 1,
        eventMultiplier: demandFactors.find(f => f.type === 'event')?.multiplier || 1,
        occupancyRate,
        bookingCount: Math.round(totalSeats * occupancyRate)
      }],
      demandFactors,
      occupancyRate,
      totalSeats,
      availableSeats,
      bookingTrend: 'stable',
      priceChangePercentage,
      lastUpdated: now,
      createdAt: now,
      updatedAt: now
    };

    const result = await collection.insertOne(pricing);
    const insertedPricing = await collection.findOne({ _id: result.insertedId });
    return insertedPricing!;
  }

  private async createInitialHotelPricing(hotelId: string, checkInDate: string, checkOutDate: string): Promise<HotelPricing & { _id: ObjectId }> {
    const collection = await this.getHotelPricingCollection();
    
    const mockHotels = [
      { hotelId: 'TAJ001', hotelName: 'The Taj Mahal Palace', location: 'Mumbai', roomType: 'Deluxe', basePrice: 12000 },
      { hotelId: 'OBR002', hotelName: 'The Oberoi', location: 'Delhi', roomType: 'Premier', basePrice: 15000 },
      { hotelId: 'ITC003', hotelName: 'ITC Grand Chola', location: 'Chennai', roomType: 'Executive', basePrice: 10000 }
    ];

    const mockHotel = mockHotels.find(h => h.hotelId === hotelId) || mockHotels[0];
    const occupancyRate = 0.4 + Math.random() * 0.4; // 40-80%
    const totalRooms = 200;
    const availableRooms = Math.round(totalRooms * (1 - occupancyRate));

    const demandFactors = this.getCurrentDemandFactors(checkInDate, occupancyRate, 'hotel', undefined, mockHotel.location);
    const currentPrice = this.calculateDynamicPrice(mockHotel.basePrice, demandFactors);
    const priceChangePercentage = Math.round(((currentPrice - mockHotel.basePrice) / mockHotel.basePrice) * 100);

    const now = new Date();
    const pricing: HotelPricing = {
      hotelId,
      hotelName: mockHotel.hotelName,
      location: mockHotel.location,
      roomType: mockHotel.roomType,
      checkInDate,
      checkOutDate,
      basePrice: mockHotel.basePrice,
      currentPrice,
      priceHistory: [{
        date: now.toISOString(),
        basePrice: mockHotel.basePrice,
        finalPrice: currentPrice,
        demandMultiplier: demandFactors.reduce((acc, f) => acc * f.multiplier, 1),
        seasonalMultiplier: demandFactors.find(f => f.type === 'seasonal')?.multiplier || 1,
        eventMultiplier: demandFactors.find(f => f.type === 'event')?.multiplier || 1,
        occupancyRate,
        bookingCount: Math.round(totalRooms * occupancyRate)
      }],
      demandFactors,
      occupancyRate,
      totalRooms,
      availableRooms,
      bookingTrend: 'stable',
      priceChangePercentage,
      lastUpdated: now,
      createdAt: now,
      updatedAt: now
    };

    const result = await collection.insertOne(pricing);
    const insertedPricing = await collection.findOne({ _id: result.insertedId });
    return insertedPricing!;
  }

  private async updateFlightPricing(pricing: FlightPricing & { _id: ObjectId }): Promise<FlightPricing & { _id: ObjectId }> {
    const collection = await this.getFlightPricingCollection();
    
    // Simulate booking activity (reduce available seats)
    const newBookings = Math.floor(Math.random() * 5);
    const newAvailableSeats = Math.max(0, pricing.availableSeats - newBookings);
    const newOccupancyRate = (pricing.totalSeats - newAvailableSeats) / pricing.totalSeats;

    const demandFactors = this.getCurrentDemandFactors(pricing.departureDate, newOccupancyRate, 'flight', pricing.route);
    const newPrice = this.calculateDynamicPrice(pricing.basePrice, demandFactors);
    const priceChangePercentage = Math.round(((newPrice - pricing.basePrice) / pricing.basePrice) * 100);

    // Determine booking trend
    let bookingTrend: 'increasing' | 'decreasing' | 'stable' = 'stable';
    if (newPrice > pricing.currentPrice) {
      bookingTrend = 'increasing';
    } else if (newPrice < pricing.currentPrice) {
      bookingTrend = 'decreasing';
    }

    const now = new Date();
    const newHistoryEntry: PriceHistory = {
      date: now.toISOString(),
      basePrice: pricing.basePrice,
      finalPrice: newPrice,
      demandMultiplier: demandFactors.reduce((acc, f) => acc * f.multiplier, 1),
      seasonalMultiplier: demandFactors.find(f => f.type === 'seasonal')?.multiplier || 1,
      eventMultiplier: demandFactors.find(f => f.type === 'event')?.multiplier || 1,
      occupancyRate: newOccupancyRate,
      bookingCount: pricing.totalSeats - newAvailableSeats
    };

    // Keep only last 30 days of history
    const updatedHistory = [...pricing.priceHistory, newHistoryEntry]
      .filter(h => {
        const historyDate = new Date(h.date);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return historyDate >= thirtyDaysAgo;
      })
      .slice(-100); // Keep max 100 entries

    const updatedPricing = {
      ...pricing,
      currentPrice: newPrice,
      priceHistory: updatedHistory,
      demandFactors,
      occupancyRate: newOccupancyRate,
      availableSeats: newAvailableSeats,
      bookingTrend,
      priceChangePercentage,
      lastUpdated: now,
      updatedAt: now
    };

    await collection.updateOne(
      { flightId: pricing.flightId, departureDate: pricing.departureDate },
      { $set: updatedPricing }
    );

    const result = await collection.findOne({ _id: pricing._id });
    return result!;
  }

  private async updateHotelPricing(pricing: HotelPricing & { _id: ObjectId }): Promise<HotelPricing & { _id: ObjectId }> {
    const collection = await this.getHotelPricingCollection();
    
    const newBookings = Math.floor(Math.random() * 3);
    const newAvailableRooms = Math.max(0, pricing.availableRooms - newBookings);
    const newOccupancyRate = (pricing.totalRooms - newAvailableRooms) / pricing.totalRooms;

    const demandFactors = this.getCurrentDemandFactors(pricing.checkInDate, newOccupancyRate, 'hotel', undefined, pricing.location);
    const newPrice = this.calculateDynamicPrice(pricing.basePrice, demandFactors);
    const priceChangePercentage = Math.round(((newPrice - pricing.basePrice) / pricing.basePrice) * 100);

    let bookingTrend: 'increasing' | 'decreasing' | 'stable' = 'stable';
    if (newPrice > pricing.currentPrice) {
      bookingTrend = 'increasing';
    } else if (newPrice < pricing.currentPrice) {
      bookingTrend = 'decreasing';
    }

    const now = new Date();
    const newHistoryEntry: PriceHistory = {
      date: now.toISOString(),
      basePrice: pricing.basePrice,
      finalPrice: newPrice,
      demandMultiplier: demandFactors.reduce((acc, f) => acc * f.multiplier, 1),
      seasonalMultiplier: demandFactors.find(f => f.type === 'seasonal')?.multiplier || 1,
      eventMultiplier: demandFactors.find(f => f.type === 'event')?.multiplier || 1,
      occupancyRate: newOccupancyRate,
      bookingCount: pricing.totalRooms - newAvailableRooms
    };

    const updatedHistory = [...pricing.priceHistory, newHistoryEntry]
      .filter(h => {
        const historyDate = new Date(h.date);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return historyDate >= thirtyDaysAgo;
      })
      .slice(-100);

    const updatedPricing = {
      ...pricing,
      currentPrice: newPrice,
      priceHistory: updatedHistory,
      demandFactors,
      occupancyRate: newOccupancyRate,
      availableRooms: newAvailableRooms,
      bookingTrend,
      priceChangePercentage,
      lastUpdated: now,
      updatedAt: now
    };

    await collection.updateOne(
      { hotelId: pricing.hotelId, checkInDate: pricing.checkInDate, checkOutDate: pricing.checkOutDate },
      { $set: updatedPricing }
    );

    const result = await collection.findOne({ _id: pricing._id });
    return result!;
  }

  // Initialize sample pricing data
  async initializeSamplePricingData() {
    try {
      const flightCollection = await this.getFlightPricingCollection();
      const hotelCollection = await this.getHotelPricingCollection();

      const existingFlights = await flightCollection.countDocuments();
      const existingHotels = await hotelCollection.countDocuments();

      if (existingFlights === 0) {
        // Create sample flight pricing
        const sampleFlights = ['AI101', 'SG102', '6E103'];
        const departureDates = ['2026-02-15', '2026-02-20', '2026-03-01'];

        for (const flightId of sampleFlights) {
          for (const date of departureDates) {
            await this.createInitialFlightPricing(flightId, date);
          }
        }
      }

      if (existingHotels === 0) {
        // Create sample hotel pricing
        const sampleHotels = ['TAJ001', 'OBR002', 'ITC003'];
        const checkInDates = ['2026-02-15', '2026-02-20', '2026-03-01'];

        for (const hotelId of sampleHotels) {
          for (const checkIn of checkInDates) {
            const checkOut = new Date(checkIn);
            checkOut.setDate(checkOut.getDate() + 2);
            await this.createInitialHotelPricing(hotelId, checkIn, checkOut.toISOString().split('T')[0]);
          }
        }
      }

      return {
        success: true,
        message: 'Sample pricing data initialized successfully'
      };
    } catch (error) {
      console.error('Error initializing sample pricing data:', error);
      throw new Error('Failed to initialize sample pricing data');
    }
  }
}