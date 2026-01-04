import type { NextApiRequest, NextApiResponse } from 'next';

// In a real application, you would store subscriptions in a database
let subscriptions: any[] = [];

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  switch (method) {
    case 'POST':
      try {
        const subscription = req.body;
        
        // Validate subscription object
        if (!subscription || !subscription.endpoint) {
          return res.status(400).json({ 
            success: false, 
            error: 'Invalid subscription object' 
          });
        }

        // Store subscription (in production, save to database)
        subscriptions.push({
          ...subscription,
          createdAt: new Date().toISOString()
        });

        console.log('New subscription added:', subscription.endpoint);
        
        res.status(201).json({ 
          success: true, 
          message: 'Subscription saved successfully' 
        });
      } catch (error) {
        console.error('Error saving subscription:', error);
        res.status(500).json({ 
          success: false, 
          error: 'Failed to save subscription' 
        });
      }
      break;

    case 'GET':
      // Return number of active subscriptions (for demo purposes)
      res.status(200).json({ 
        success: true, 
        data: { 
          totalSubscriptions: subscriptions.length,
          subscriptions: subscriptions.map(sub => ({
            endpoint: sub.endpoint.substring(0, 50) + '...',
            createdAt: sub.createdAt
          }))
        } 
      });
      break;

    default:
      res.setHeader('Allow', ['POST', 'GET']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}