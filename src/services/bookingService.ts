import { getDatabase } from '../lib/mongodb';
import { Booking, CancellationReason, RefundStatistics } from '../models/Booking';
import { ObjectId } from 'mongodb';

const COLLECTION_NAME = 'bookings';
const CANCELLATION_REASONS_COLLECTION = 'cancellation_reasons';

export class BookingService {
  private async getCollection() {
    const db = await getDatabase();
    return db.collection<Booking>(COLLECTION_NAME);
  }

  private async getCancellationReasonsCollection() {
    const db = await getDatabase();
    return db.collection<CancellationReason>(CANCELLATION_REASONS_COLLECTION);
  }

  // Get user bookings
  async getUserBookings(userId: string, status?: string) {
    try {
      const collection = await this.getCollection();
      const filter: any = { userId };
      
      if (status && status !== 'all') {
        filter.status = status;
      }

      const bookings = await collection
        .find(filter)
        .sort({ bookingDate: -1 })
        .toArray();

      const summary = {
        total: await collection.countDocuments({ userId }),
        confirmed: await collection.countDocuments({ userId, status: 'confirmed' }),
        cancelled: await collection.countDocuments({ userId, status: 'cancelled' }),
        completed: await collection.countDocuments({ userId, status: 'completed' })
      };

      return {
        success: true,
        data: {
          bookings,
          summary
        }
      };
    } catch (error) {
      console.error('Error fetching user bookings:', error);
      throw new Error('Failed to fetch bookings');
    }
  }

  // Get booking details
  async getBookingDetails(bookingId: string) {
    try {
      const collection = await this.getCollection();
      const booking = await collection.findOne({ id: bookingId });

      if (!booking) {
        throw new Error('Booking not found');
      }

      return {
        success: true,
        data: booking
      };
    } catch (error) {
      console.error('Error fetching booking details:', error);
      throw error;
    }
  }

  // Calculate cancellation refund
  async calculateCancellationRefund(bookingId: string) {
    try {
      const bookingResult = await this.getBookingDetails(bookingId);
      const booking = bookingResult.data;

      if (!booking.canCancel) {
        throw new Error('This booking cannot be cancelled');
      }

      const now = new Date();
      const travelDate = new Date(booking.travelDate || booking.checkIn!);
      const hoursUntilTravel = (travelDate.getTime() - now.getTime()) / (1000 * 60 * 60);

      let applicableRule = null;

      // Find applicable cancellation rule
      for (const rule of booking.cancellationPolicy.rules) {
        if (rule.period === "24h+" && hoursUntilTravel >= 24) {
          applicableRule = rule;
          break;
        } else if (rule.period === "2-24h" && hoursUntilTravel >= 2 && hoursUntilTravel < 24) {
          applicableRule = rule;
          break;
        } else if (rule.period === "48h+" && hoursUntilTravel >= 48) {
          applicableRule = rule;
          break;
        } else if (rule.period === "24-48h" && hoursUntilTravel >= 24 && hoursUntilTravel < 48) {
          applicableRule = rule;
          break;
        } else if ((rule.period === "<2h" || rule.period === "<24h") && 
                   hoursUntilTravel < (rule.period === "<2h" ? 2 : 24)) {
          applicableRule = rule;
          break;
        }
      }

      if (!applicableRule) {
        applicableRule = booking.cancellationPolicy.rules[booking.cancellationPolicy.rules.length - 1];
      }

      const refundAmount = Math.round((booking.pricing.totalPaid * applicableRule.refundPercentage) / 100);
      const cancellationFee = applicableRule.fee;
      const netRefund = Math.max(0, refundAmount - cancellationFee);

      return {
        success: true,
        data: {
          bookingId,
          totalPaid: booking.pricing.totalPaid,
          refundPercentage: applicableRule.refundPercentage,
          refundAmount,
          cancellationFee,
          netRefund,
          hoursUntilTravel: Math.round(hoursUntilTravel),
          applicableRule,
          refundBreakdown: {
            baseRefund: Math.round(((booking.pricing.basePrice || booking.pricing.roomRate!) * applicableRule.refundPercentage) / 100),
            taxRefund: Math.round((booking.pricing.taxes * applicableRule.refundPercentage) / 100),
            feeRefund: Math.round((booking.pricing.fees * applicableRule.refundPercentage) / 100),
            cancellationFee
          }
        }
      };
    } catch (error) {
      console.error('Error calculating refund:', error);
      throw error;
    }
  }

  // Submit cancellation request
  async submitCancellationRequest(bookingId: string, cancellationData: any) {
    try {
      const collection = await this.getCollection();
      const booking = await collection.findOne({ id: bookingId });

      if (!booking) {
        throw new Error('Booking not found');
      }

      if (!booking.canCancel) {
        throw new Error('This booking cannot be cancelled');
      }

      // Calculate refund
      const refundCalculation = await this.calculateCancellationRefund(bookingId);

      // Create cancellation record
      const cancellation = {
        reason: cancellationData.reason,
        comments: cancellationData.comments,
        requestedAt: new Date().toISOString(),
        processedAt: new Date().toISOString(),
        refundAmount: refundCalculation.data.netRefund,
        refundFee: refundCalculation.data.cancellationFee,
        refundStatus: "processing" as const,
        refundMethod: cancellationData.refundMethod || "original_payment",
        refundReference: `REF-${booking.bookingReference}`,
        expectedRefundDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      };

      // Update booking
      const updateResult = await collection.updateOne(
        { id: bookingId },
        {
          $set: {
            status: "cancelled",
            cancellationDate: new Date().toISOString(),
            cancellation,
            canCancel: false,
            canModify: false,
            updatedAt: new Date()
          }
        }
      );

      if (updateResult.matchedCount === 0) {
        throw new Error('Failed to update booking');
      }

      return {
        success: true,
        data: {
          bookingId,
          cancellationReference: cancellation.refundReference,
          refundAmount: cancellation.refundAmount,
          expectedRefundDate: cancellation.expectedRefundDate,
          cancellation
        },
        message: 'Cancellation request submitted successfully. You will receive a confirmation email shortly.'
      };
    } catch (error) {
      console.error('Error submitting cancellation:', error);
      throw error;
    }
  }

  // Get cancellation reasons
  async getCancellationReasons() {
    try {
      const collection = await this.getCancellationReasonsCollection();
      const reasons = await collection.find({}).toArray();

      // If no reasons in database, return default ones
      if (reasons.length === 0) {
        const defaultReasons = [
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
        ];

        // Insert default reasons
        await collection.insertMany(defaultReasons);
        return {
          success: true,
          data: defaultReasons
        };
      }

      return {
        success: true,
        data: reasons
      };
    } catch (error) {
      console.error('Error fetching cancellation reasons:', error);
      throw new Error('Failed to fetch cancellation reasons');
    }
  }

  // Track refund status
  async trackRefundStatus(refundReference: string) {
    try {
      const collection = await this.getCollection();
      const booking = await collection.findOne({
        'cancellation.refundReference': refundReference
      });

      if (!booking || !booking.cancellation) {
        throw new Error('Refund reference not found');
      }

      // Simulate refund processing stages
      const stages = [
        {
          stage: "requested",
          title: "Cancellation Requested",
          description: "Your cancellation request has been received",
          completedAt: booking.cancellation.requestedAt,
          status: "completed"
        },
        {
          stage: "processing",
          title: "Processing Refund",
          description: "We are processing your refund according to the cancellation policy",
          completedAt: booking.cancellation.processedAt,
          status: booking.cancellation.refundStatus === "processing" ? "current" : "completed"
        },
        {
          stage: "approved",
          title: "Refund Approved",
          description: "Your refund has been approved and initiated",
          completedAt: booking.cancellation.refundStatus === "processed" ? booking.cancellation.processedAt : null,
          status: booking.cancellation.refundStatus === "processed" ? "completed" : 
                 booking.cancellation.refundStatus === "processing" ? "pending" : "current"
        },
        {
          stage: "completed",
          title: "Refund Completed",
          description: "Refund has been credited to your original payment method",
          completedAt: booking.cancellation.refundStatus === "processed" ? booking.cancellation.processedAt : null,
          status: booking.cancellation.refundStatus === "processed" ? "completed" : "pending"
        }
      ];

      return {
        success: true,
        data: {
          refundReference,
          bookingReference: booking.bookingReference,
          refundAmount: booking.cancellation.refundAmount,
          refundMethod: booking.cancellation.refundMethod,
          expectedDate: booking.cancellation.expectedRefundDate,
          currentStatus: booking.cancellation.refundStatus,
          stages,
          timeline: stages.filter(s => s.completedAt).map(s => ({
            title: s.title,
            description: s.description,
            completedAt: s.completedAt
          }))
        }
      };
    } catch (error) {
      console.error('Error tracking refund:', error);
      throw error;
    }
  }

  // Get refund statistics
  async getRefundStatistics(userId: string) {
    try {
      const collection = await this.getCollection();
      
      const userBookings = await collection.find({ userId }).toArray();
      const cancelledBookings = userBookings.filter(b => b.status === 'cancelled');

      const stats: RefundStatistics = {
        totalBookings: userBookings.length,
        cancelledBookings: cancelledBookings.length,
        cancellationRate: userBookings.length > 0 ? Math.round((cancelledBookings.length / userBookings.length) * 100) : 0,
        totalRefunded: cancelledBookings.reduce((sum, b) => sum + (b.cancellation?.refundAmount || 0), 0),
        averageRefundTime: 5, // days
        refundsByStatus: {
          processing: cancelledBookings.filter(b => b.cancellation?.refundStatus === 'processing').length,
          processed: cancelledBookings.filter(b => b.cancellation?.refundStatus === 'processed').length,
          failed: cancelledBookings.filter(b => b.cancellation?.refundStatus === 'failed').length
        },
        commonReasons: [
          { reason: "personal_emergency", count: 2, percentage: 40 },
          { reason: "medical_emergency", count: 1, percentage: 20 },
          { reason: "work_conflict", count: 1, percentage: 20 },
          { reason: "change_of_plans", count: 1, percentage: 20 }
        ]
      };

      return {
        success: true,
        data: stats
      };
    } catch (error) {
      console.error('Error fetching refund statistics:', error);
      throw new Error('Failed to fetch refund statistics');
    }
  }

  // Create a new booking (for testing)
  async createBooking(bookingData: Omit<Booking, '_id' | 'createdAt' | 'updatedAt'>) {
    try {
      const collection = await this.getCollection();
      
      const booking: Booking = {
        ...bookingData,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const result = await collection.insertOne(booking);
      
      return {
        success: true,
        data: {
          ...booking,
          _id: result.insertedId
        }
      };
    } catch (error) {
      console.error('Error creating booking:', error);
      throw new Error('Failed to create booking');
    }
  }

  // Initialize sample data
  async initializeSampleData() {
    try {
      const collection = await this.getCollection();
      const existingBookings = await collection.countDocuments();

      if (existingBookings > 0) {
        return { success: true, message: 'Sample data already exists' };
      }

      const sampleBookings: Booking[] = [
        {
          id: "BK001",
          type: "flight",
          bookingReference: "AI101-2026-001",
          status: "confirmed",
          bookingDate: "2026-01-01T10:00:00Z",
          travelDate: "2026-01-15T14:30:00Z",
          userId: "user123",
          passenger: {
            name: "Rajesh Kumar",
            email: "rajesh@example.com",
            phone: "+91-9876543210"
          },
          flight: {
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
              { period: "24h+", refundPercentage: 90, fee: 500, description: "Cancel 24+ hours before departure" },
              { period: "2-24h", refundPercentage: 50, fee: 1000, description: "Cancel 2-24 hours before departure" },
              { period: "<2h", refundPercentage: 0, fee: 0, description: "Cancel less than 2 hours before departure" }
            ]
          },
          canCancel: true,
          canModify: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: "BK002",
          type: "hotel",
          bookingReference: "TAJ-2026-002",
          status: "confirmed",
          bookingDate: "2026-01-02T15:30:00Z",
          checkIn: "2026-01-20T15:00:00Z",
          checkOut: "2026-01-23T11:00:00Z",
          userId: "user123",
          guest: {
            name: "Priya Sharma",
            email: "priya@example.com",
            phone: "+91-9876543211"
          },
          hotel: {
            name: "The Taj Mahal Palace",
            location: "Mumbai, Maharashtra",
            roomType: "Deluxe Ocean View",
            roomNumber: "301",
            nights: 3
          },
          pricing: {
            roomRate: 12000,
            taxes: 2160,
            fees: 300,
            totalPaid: 43380,
            currency: "INR"
          },
          cancellationPolicy: {
            type: "standard",
            rules: [
              { period: "48h+", refundPercentage: 100, fee: 0, description: "Cancel 48+ hours before check-in" },
              { period: "24-48h", refundPercentage: 75, fee: 500, description: "Cancel 24-48 hours before check-in" },
              { period: "<24h", refundPercentage: 25, fee: 1000, description: "Cancel less than 24 hours before check-in" }
            ]
          },
          canCancel: true,
          canModify: true,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];

      await collection.insertMany(sampleBookings);

      return {
        success: true,
        message: 'Sample data initialized successfully'
      };
    } catch (error) {
      console.error('Error initializing sample data:', error);
      throw new Error('Failed to initialize sample data');
    }
  }
}