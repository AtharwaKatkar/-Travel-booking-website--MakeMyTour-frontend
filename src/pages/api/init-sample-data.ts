import type { NextApiRequest, NextApiResponse } from 'next';
import { BookingService } from '../../services/bookingService';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      error: 'Method not allowed' 
    });
  }

  try {
    const bookingService = new BookingService();
    const result = await bookingService.initializeSampleData();
    
    res.status(200).json(result);
  } catch (error: any) {
    console.error('Error initializing sample data:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Failed to initialize sample data' 
    });
  }
}