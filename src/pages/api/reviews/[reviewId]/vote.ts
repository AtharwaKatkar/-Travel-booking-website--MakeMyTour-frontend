import type { NextApiRequest, NextApiResponse } from 'next';

// Mock user votes storage
const mockUserVotes: { [key: string]: string } = {};

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
    const { voteType, userId } = req.body;

    if (!reviewId || !voteType || !userId) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameters'
      });
    }

    const userVoteKey = `${userId}_${reviewId}`;
    const existingVote = mockUserVotes[userVoteKey];

    // Simulate vote counting (in real app, update database)
    let helpful = 24; // Mock current count
    let notHelpful = 2; // Mock current count

    // Remove existing vote if any
    if (existingVote) {
      if (existingVote === 'helpful') {
        helpful = Math.max(0, helpful - 1);
      } else {
        notHelpful = Math.max(0, notHelpful - 1);
      }
    }

    // Add new vote if different from existing
    if (existingVote !== voteType) {
      if (voteType === 'helpful') {
        helpful += 1;
      } else {
        notHelpful += 1;
      }
      mockUserVotes[userVoteKey] = voteType;
    } else {
      // Remove vote if same as existing
      delete mockUserVotes[userVoteKey];
    }

    res.status(200).json({
      success: true,
      data: {
        helpful,
        notHelpful,
        userVote: mockUserVotes[userVoteKey] || null
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to vote on review'
    });
  }
}