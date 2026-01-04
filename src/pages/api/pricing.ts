import type { NextApiRequest, NextApiResponse } from 'next';
import { PricingService } from '../../services/pricingService';

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
    console.error('Pricing API Error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Internal Server Error' 
    });
  }
}

async function handleGet(req: NextApiRequest, res: NextApiResponse) {
  const { action, itemType, itemId, userId, days, flightId, departureDate, hotelId, checkInDate, checkOutDate } = req.query;
  const pricingService = new PricingService();

  switch (action) {
    case 'flight-pricing':
      if (!flightId || !departureDate) {
        return res.status(400).json({ 
          success: false, 
          error: 'Flight ID and departure date are required' 
        });
      }
      const flightResult = await pricingService.getFlightPricing(
        flightId as string, 
        departureDate as string
      );
      return res.status(200).json(flightResult);

    case 'hotel-pricing':
      if (!hotelId || !checkInDate || !checkOutDate) {
        return res.status(400).json({ 
          success: false, 
          error: 'Hotel ID, check-in date, and check-out date are required' 
        });
      }
      const hotelResult = await pricingService.getHotelPricing(
        hotelId as string,
        checkInDate as string,
        checkOutDate as string
      );
      return res.status(200).json(hotelResult);

    case 'price-history':
      if (!itemType || !itemId) {
        return res.status(400).json({ 
          success: false, 
          error: 'Item type and item ID are required' 
        });
      }
      const historyResult = await pricingService.getPriceHistory(
        itemType as 'flight' | 'hotel',
        itemId as string,
        days ? parseInt(days as string) : 30
      );
      return res.status(200).json(historyResult);

    case 'user-price-freezes':
      if (!userId) {
        return res.status(400).json({ 
          success: false, 
          error: 'User ID is required' 
        });
      }
      const freezesResult = await pricingService.getUserPriceFreezes(userId as string);
      return res.status(200).json(freezesResult);

    case 'pricing-analytics':
      const analyticsResult = await pricingService.getPricingAnalytics();
      return res.status(200).json(analyticsResult);

    case 'initialize-sample-data':
      const initResult = await pricingService.initializeSamplePricingData();
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
  const pricingService = new PricingService();

  switch (action) {
    case 'create-price-freeze':
      const { userId, itemType, itemId, currentPrice } = req.body;
      
      if (!userId || !itemType || !itemId || !currentPrice) {
        return res.status(400).json({ 
          success: false, 
          error: 'User ID, item type, item ID, and current price are required' 
        });
      }

      const freezeResult = await pricingService.createPriceFreeze(
        userId,
        itemType,
        itemId,
        currentPrice
      );
      
      return res.status(200).json(freezeResult);

    default:
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid action parameter' 
      });
  }
}

async function handlePut(req: NextApiRequest, res: NextApiResponse) {
  const { action } = req.query;
  const pricingService = new PricingService();

  switch (action) {
    case 'use-price-freeze':
      const { freezeId, userId } = req.body;
      
      if (!freezeId || !userId) {
        return res.status(400).json({ 
          success: false, 
          error: 'Freeze ID and user ID are required' 
        });
      }

      const useResult = await pricingService.usePriceFreeze(freezeId, userId);
      return res.status(200).json(useResult);

    default:
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid action parameter' 
      });
  }
}