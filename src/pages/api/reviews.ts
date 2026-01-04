import type { NextApiRequest, NextApiResponse } from 'next';

// Mock reviews data (same as in reviews.js but for API endpoint)
const mockReviews = [
  {
    id: "rev_001",
    type: "hotel",
    itemId: "hotel_001",
    itemName: "The Taj Mahal Palace Mumbai",
    userId: "user_001",
    userName: "Rajesh Kumar",
    userAvatar: null,
    rating: 5,
    title: "Exceptional luxury experience",
    content: "Stayed here for our anniversary and it was absolutely perfect. The service was impeccable, rooms were spacious and beautifully decorated. The heritage wing has so much character. Breakfast was outstanding with great variety. Location is perfect for exploring Mumbai. Highly recommend!",
    photos: ["/api/placeholder/400/300", "/api/placeholder/400/300"],
    helpful: 24,
    notHelpful: 2,
    replies: [],
    tags: ["luxury", "service", "location", "breakfast"],
    verified: true,
    createdAt: "2025-12-28T14:20:00Z",
    updatedAt: "2025-12-28T14:20:00Z",
    flagged: false,
    flagReason: null
  },
  {
    id: "rev_002",
    type: "flight",
    itemId: "AI101",
    itemName: "Air India AI101 (Delhi to Mumbai)",
    userId: "user_002",
    userName: "Priya Sharma",
    userAvatar: null,
    rating: 3,
    title: "Average experience with delays",
    content: "Flight was delayed by 2 hours due to weather, which was understandable. Cabin crew was friendly and helpful. Food was decent for domestic flight. Seats were comfortable enough for the short journey. Entertainment system worked well. Overall okay experience but nothing exceptional.",
    photos: [],
    helpful: 12,
    notHelpful: 3,
    replies: [],
    tags: ["delayed", "crew", "food", "comfort"],
    verified: true,
    createdAt: "2025-12-25T16:45:00Z",
    updatedAt: "2025-12-25T16:45:00Z",
    flagged: false,
    flagReason: null
  }
];

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method, query } = req;

  switch (method) {
    case 'GET':
      try {
        const { type, itemId, sortBy = 'newest', page = 1, limit = 10 } = query;
        
        let filteredReviews = mockReviews;
        
        // Filter by type and itemId if provided
        if (type && itemId) {
          filteredReviews = mockReviews.filter(review => 
            review.type === type && review.itemId === itemId
          );
        }

        // Sort reviews
        switch (sortBy) {
          case 'newest':
            filteredReviews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            break;
          case 'oldest':
            filteredReviews.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
            break;
          case 'highest':
            filteredReviews.sort((a, b) => b.rating - a.rating);
            break;
          case 'lowest':
            filteredReviews.sort((a, b) => a.rating - b.rating);
            break;
          case 'helpful':
            filteredReviews.sort((a, b) => b.helpful - a.helpful);
            break;
        }

        // Pagination
        const pageNum = parseInt(page as string);
        const limitNum = parseInt(limit as string);
        const startIndex = (pageNum - 1) * limitNum;
        const endIndex = startIndex + limitNum;
        const paginatedReviews = filteredReviews.slice(startIndex, endIndex);

        // Calculate statistics
        const totalReviews = filteredReviews.length;
        const averageRating = totalReviews > 0 
          ? filteredReviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews 
          : 0;
        
        const ratingDistribution = {
          5: filteredReviews.filter(r => r.rating === 5).length,
          4: filteredReviews.filter(r => r.rating === 4).length,
          3: filteredReviews.filter(r => r.rating === 3).length,
          2: filteredReviews.filter(r => r.rating === 2).length,
          1: filteredReviews.filter(r => r.rating === 1).length,
        };

        res.status(200).json({
          success: true,
          data: {
            reviews: paginatedReviews,
            pagination: {
              currentPage: pageNum,
              totalPages: Math.ceil(totalReviews / limitNum),
              totalReviews,
              hasNext: endIndex < totalReviews,
              hasPrev: pageNum > 1
            },
            statistics: {
              averageRating: Math.round(averageRating * 10) / 10,
              totalReviews,
              ratingDistribution
            }
          }
        });
      } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to fetch reviews' });
      }
      break;

    case 'POST':
      try {
        const reviewData = req.body;
        
        const newReview = {
          id: `rev_${Date.now()}`,
          ...reviewData,
          helpful: 0,
          notHelpful: 0,
          replies: [],
          verified: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          flagged: false,
          flagReason: null
        };

        // In a real app, save to database
        mockReviews.unshift(newReview);

        res.status(201).json({
          success: true,
          data: newReview,
          message: 'Review submitted successfully'
        });
      } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to submit review' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}