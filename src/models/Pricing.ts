import { ObjectId } from 'mongodb';

export interface PriceHistory {
  date: string;
  basePrice: number;
  finalPrice: number;
  demandMultiplier: number;
  seasonalMultiplier: number;
  eventMultiplier: number;
  occupancyRate: number;
  bookingCount: number;
}

export interface DemandFactor {
  type: 'seasonal' | 'event' | 'occupancy' | 'time_based' | 'competition';
  name: string;
  multiplier: number;
  startDate?: string;
  endDate?: string;
  description: string;
  isActive: boolean;
}

export interface PriceFreeze {
  _id?: ObjectId;
  id: string;
  userId: string;
  itemType: 'flight' | 'hotel';
  itemId: string;
  frozenPrice: number;
  originalPrice: number;
  savings: number;
  freezeStartTime: string;
  freezeEndTime: string;
  isActive: boolean;
  isUsed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface PricingRule {
  _id?: ObjectId;
  id: string;
  name: string;
  type: 'flight' | 'hotel' | 'global';
  priority: number;
  conditions: {
    dateRange?: {
      start: string;
      end: string;
    };
    occupancyThreshold?: number;
    advanceBookingDays?: number;
    dayOfWeek?: number[];
    timeOfDay?: {
      start: string;
      end: string;
    };
    route?: string;
    location?: string;
  };
  adjustment: {
    type: 'percentage' | 'fixed';
    value: number;
    cap?: number; // Maximum price increase
    floor?: number; // Minimum price
  };
  description: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface FlightPricing {
  _id?: ObjectId;
  flightId: string;
  route: string;
  airline: string;
  flightNumber: string;
  departureDate: string;
  basePrice: number;
  currentPrice: number;
  priceHistory: PriceHistory[];
  demandFactors: DemandFactor[];
  occupancyRate: number;
  totalSeats: number;
  availableSeats: number;
  bookingTrend: 'increasing' | 'decreasing' | 'stable';
  priceChangePercentage: number;
  lastUpdated: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface HotelPricing {
  _id?: ObjectId;
  hotelId: string;
  hotelName: string;
  location: string;
  roomType: string;
  checkInDate: string;
  checkOutDate: string;
  basePrice: number;
  currentPrice: number;
  priceHistory: PriceHistory[];
  demandFactors: DemandFactor[];
  occupancyRate: number;
  totalRooms: number;
  availableRooms: number;
  bookingTrend: 'increasing' | 'decreasing' | 'stable';
  priceChangePercentage: number;
  lastUpdated: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface PriceAlert {
  _id?: ObjectId;
  id: string;
  userId: string;
  itemType: 'flight' | 'hotel';
  itemId: string;
  targetPrice: number;
  currentPrice: number;
  isActive: boolean;
  notificationSent: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface PricingAnalytics {
  totalPriceChanges: number;
  averagePriceIncrease: number;
  averagePriceDecrease: number;
  peakDemandPeriods: Array<{
    period: string;
    averageMultiplier: number;
    description: string;
  }>;
  topDemandRoutes: Array<{
    route: string;
    averagePrice: number;
    priceVolatility: number;
  }>;
  priceFreezesActive: number;
  priceFreezesUsed: number;
  totalSavingsFromFreezes: number;
}