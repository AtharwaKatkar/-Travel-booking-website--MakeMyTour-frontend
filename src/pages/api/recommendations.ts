import { NextApiRequest, NextApiResponse } from 'next';
import { RecommendationService } from '../../services/recommendationService';

const recommendationService = new RecommendationService();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'GET':
        return await handleGetRecommendations(req, res);
      case 'POST':
        return await handlePostRecommendations(req, res);
      default:
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

async function handleGetRecommendations(req: NextApiRequest, res: NextApiResponse) {
  const { userId, category, analytics } = req.query;

  if (analytics === 'true') {
    const result = await recommendationService.getRecommendationAnalytics();
    return res.status(200).json(result);
  }

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  const result = await recommendationService.getUserRecommendations(
    userId as string,
    category as string
  );
  
  return res.status(200).json(result);
}

async function handlePostRecommendations(req: NextApiRequest, res: NextApiResponse) {
  const { action, ...data } = req.body;

  switch (action) {
    case 'generate':
      const result = await recommendationService.generateRecommendations(data);
      return res.status(200).json(result);

    case 'track_interaction':
      const trackResult = await recommendationService.trackUserInteraction(data);
      return res.status(200).json(trackResult);

    case 'submit_feedback':
      const feedbackResult = await recommendationService.submitRecommendationFeedback(data);
      return res.status(200).json(feedbackResult);

    case 'initialize_sample_data':
      const initResult = await recommendationService.initializeSampleRecommendationData();
      return res.status(200).json(initResult);

    default:
      return res.status(400).json({ error: 'Invalid action' });
  }
}