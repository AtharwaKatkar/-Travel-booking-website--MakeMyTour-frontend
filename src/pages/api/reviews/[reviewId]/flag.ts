import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;
  const { reviewId } = req.query;

  if (method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${method} Not Allowed`);
  }

  try {
    const { reason, userId } = req.body;

    if (!reviewId || !reason || !userId) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameters'
      });
    }

    // In a real app, this would:
    // 1. Save the flag to database
    // 2. Create a moderation ticket
    // 3. Possibly auto-hide content based on flag count
    // 4. Send notification to moderation team

    console.log(`Review ${reviewId} flagged by user ${userId} for: ${reason}`);

    res.status(200).json({
      success: true,
      message: 'Review flagged for moderation. Thank you for helping keep our community safe.'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to flag review'
    });
  }
}