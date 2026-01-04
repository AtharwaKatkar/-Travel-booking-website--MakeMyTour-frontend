import { ObjectId } from 'mongodb';

export interface Passenger {
  name: string;
  email: string;
  phone: string;
}

export interface Guest {
  name: string;
  email: string;
  phone: string;
}

export interface Flight {
  flightNumber: string;
  airline: string;
  route: string;
  departure: string;
  arrival: string;
  class: string;
  seat: string;
}

export interface Hotel {
  name: string;
  location: string;
  roomType: string;
  roomNumber?: string;
  nights: number;
}

export interface Pricing {
  basePrice?: number;
  roomRate?: number;
  taxes: number;
  fees: number;
  totalPaid: number;
  currency: string;
}

export interface CancellationRule {
  period: string;
  refundPercentage: number;
  fee: number;
  description?: string;
}

export interface CancellationPolicy {
  type: 'flexible' | 'standard' | 'strict';
  rules: CancellationRule[];
}

export interface Cancellation {
  reason: string;
  comments?: string;
  requestedAt: string;
  processedAt?: string;
  refundAmount: number;
  refundFee: number;
  refundStatus: 'processing' | 'processed' | 'failed';
  refundMethod: string;
  refundReference: string;
  expectedRefundDate: string;
}

export interface Booking {
  _id?: ObjectId;
  id: string;
  type: 'flight' | 'hotel';
  bookingReference: string;
  status: 'confirmed' | 'cancelled' | 'completed' | 'pending';
  bookingDate: string;
  travelDate?: string; // for flights
  checkIn?: string; // for hotels
  checkOut?: string; // for hotels
  cancellationDate?: string;
  userId: string;
  passenger?: Passenger; // for flights
  guest?: Guest; // for hotels
  flight?: Flight;
  hotel?: Hotel;
  pricing: Pricing;
  cancellationPolicy: CancellationPolicy;
  cancellation?: Cancellation;
  canCancel: boolean;
  canModify: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CancellationReason {
  value: string;
  label: string;
  category: string;
}

export interface RefundStatistics {
  totalBookings: number;
  cancelledBookings: number;
  cancellationRate: number;
  totalRefunded: number;
  averageRefundTime: number;
  refundsByStatus: {
    processing: number;
    processed: number;
    failed: number;
  };
  commonReasons: Array<{
    reason: string;
    count: number;
    percentage: number;
  }>;
}