import type { NextApiRequest, NextApiResponse } from 'next';
import { BookingService } from '../../services/bookingService';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method, query, body } = req;

  try {
    switch (method) {
      case 'GET':
        await handleGet(req, res);
        break;
      case 'POST':
        await handlePost(req, res);
        break;
      case 'PUT':
        await handlePut(req, res);
        break;
      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT']);
        res.status(405).json({ 
          success: false, 
          error: `Method ${method} Not Allowed` 
        });
    }
  } catch (error: any) {
    console.error('API Error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Internal Server Error' 
    });
  }
}

async function handleGet(req: NextApiRequest, res: NextApiResponse) {
  const { action, userId, bookingId, refundReference, type } = req.query;
  const bookingService = new BookingService();

  switch (action) {
    case 'bookings':
      if (!userId) {
        return res.status(400).json({ 
          success: false, 
          error: 'User ID is required' 
        });
      }
      const bookingsResult = await bookingService.getUserBookings(
        userId as string, 
        req.query.status as string
      );
      return res.status(200).json(bookingsResult);

    case 'booking-details':
      if (!bookingId) {
        return res.status(400).json({ 
          success: false, 
          error: 'Booking ID is required' 
        });
      }
      const bookingResult = await bookingService.getBookingDetails(bookingId as string);
      return res.status(200).json(bookingResult);

    case 'calculate-refund':
      if (!bookingId) {
        return res.status(400).json({ 
          success: false, 
          error: 'Booking ID is required' 
        });
      }
      const refundResult = await bookingService.calculateCancellationRefund(bookingId as string);
      return res.status(200).json(refundResult);

    case 'cancellation-reasons':
      const reasonsResult = await bookingService.getCancellationReasons();
      return res.status(200).json(reasonsResult);

    case 'track-refund':
      if (!refundReference) {
        return res.status(400).json({ 
          success: false, 
          error: 'Refund reference is required' 
        });
      }
      const trackingResult = await bookingService.trackRefundStatus(refundReference as string);
      return res.status(200).json(trackingResult);

    case 'cancellation-policies':
      // For now, return static policies. In future, this could be from database
      const policies = {
        flight: {
          flexible: {
            name: "Flexible Cancellation",
            description: "More lenient cancellation terms with higher refund percentages",
            rules: [
              { period: "24h+", refundPercentage: 90, fee: 500, description: "Cancel 24+ hours before departure" },
              { period: "2-24h", refundPercentage: 50, fee: 1000, description: "Cancel 2-24 hours before departure" },
              { period: "<2h", refundPercentage: 0, fee: 0, description: "Cancel less than 2 hours before departure" }
            ]
          },
          standard: {
            name: "Standard Cancellation",
            description: "Standard airline cancellation policy",
            rules: [
              { period: "24h+", refundPercentage: 75, fee: 750, description: "Cancel 24+ hours before departure" },
              { period: "2-24h", refundPercentage: 25, fee: 1500, description: "Cancel 2-24 hours before departure" },
              { period: "<2h", refundPercentage: 0, fee: 0, description: "Cancel less than 2 hours before departure" }
            ]
          }
        },
        hotel: {
          flexible: {
            name: "Free Cancellation",
            description: "Cancel up to 24 hours before check-in for full refund",
            rules: [
              { period: "48h+", refundPercentage: 100, fee: 0, description: "Cancel 48+ hours before check-in" },
              { period: "24-48h", refundPercentage: 75, fee: 500, description: "Cancel 24-48 hours before check-in" },
              { period: "<24h", refundPercentage: 25, fee: 1000, description: "Cancel less than 24 hours before check-in" }
            ]
          }
        }
      };
      const requestedType = type as string || 'flight';
      return res.status(200).json({
        success: true,
        data: policies[requestedType as keyof typeof policies] || policies.flight
      });

    case 'refund-statistics':
      if (!userId) {
        return res.status(400).json({ 
          success: false, 
          error: 'User ID is required' 
        });
      }
      const statsResult = await bookingService.getRefundStatistics(userId as string);
      return res.status(200).json(statsResult);

    case 'initialize-sample-data':
      const initResult = await bookingService.initializeSampleData();
      return res.status(200).json(initResult);

    default:
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid action parameter' 
      });
  }
}

async function handlePost(req: NextApiRequest, res: NextApiResponse) {
  const { action } = req.query;
  const bookingService = new BookingService();

  switch (action) {
    case 'cancel-booking':
      const { bookingId, reason, comments, refundMethod } = req.body;
      
      if (!bookingId || !reason) {
        return res.status(400).json({ 
          success: false, 
          error: 'Booking ID and cancellation reason are required' 
        });
      }

      const cancellationResult = await bookingService.submitCancellationRequest(bookingId, {
        reason,
        comments,
        refundMethod
      });
      
      return res.status(200).json(cancellationResult);

    default:
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid action parameter' 
      });
  }
}

async function handlePut(req: NextApiRequest, res: NextApiResponse) {
  const { action } = req.query;

  switch (action) {
    case 'update-refund-status':
      // This would typically be called by payment processors or admin systems
      const { refundReference, status, processedAt } = req.body;
      
      if (!refundReference || !status) {
        return res.status(400).json({ 
          success: false, 
          error: 'Refund reference and status are required' 
        });
      }

      // In a real implementation, this would update the database
      return res.status(200).json({ 
        success: true, 
        message: 'Refund status updated successfully',
        data: {
          refundReference,
          status,
          updatedAt: processedAt || new Date().toISOString()
        }
      });

    default:
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid action parameter' 
      });
  }
}