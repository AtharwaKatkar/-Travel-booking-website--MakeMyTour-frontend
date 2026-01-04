import axios from "axios";

// Mock reviews data
const mockReviews = [
  {
    id: "rev_001",
    type: "hotel", // "hotel" or "flight"
    itemId: "hotel_001",
    itemName: "The Taj Mahal Palace Mumbai",
    userId: "user_001",
    userName: "Rajesh Kumar",
    userAvatar: null,
    rating: 5,
    title: "Exceptional luxury experience",
    content: "Stayed here for our anniversary and it was absolutely perfect. The service was impeccable, rooms were spacious and beautifully decorated. The heritage wing has so much character. Breakfast was outstanding with great variety. Location is perfect for exploring Mumbai. Highly recommend!",
    photos: [
      "/api/placeholder/400/300",
      "/api/placeholder/400/300"
    ],
    helpful: 24,
    notHelpful: 2,
    replies: [
      {
        id: "reply_001",
        userId: "hotel_001",
        userName: "Taj Mahal Palace Mumbai",
        isOfficial: true,
        content: "Thank you for your wonderful review! We're delighted that you had such a memorable anniversary celebration with us. We look forward to welcoming you back soon.",
        createdAt: "2026-01-01T10:30:00Z"
      }
    ],
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
  },
  {
    id: "rev_003",
    type: "hotel",
    itemId: "hotel_002",
    itemName: "ITC Grand Chola Chennai",
    userId: "user_003",
    userName: "Amit Patel",
    userAvatar: null,
    rating: 4,
    title: "Great business hotel",
    content: "Excellent for business travel. Rooms are modern and well-equipped. WiFi is fast and reliable. The executive lounge is a nice touch. Pool area is beautiful. Only downside was the restaurant service was a bit slow during peak hours. Would definitely stay again.",
    photos: ["/api/placeholder/400/300"],
    helpful: 18,
    notHelpful: 1,
    replies: [
      {
        id: "reply_002",
        userId: "hotel_002",
        userName: "ITC Grand Chola",
        isOfficial: true,
        content: "Thank you for choosing ITC Grand Chola for your business stay. We appreciate your feedback about restaurant service and will work to improve our response times during peak hours.",
        createdAt: "2025-12-24T09:15:00Z"
      }
    ],
    tags: ["business", "wifi", "pool", "modern"],
    verified: true,
    createdAt: "2025-12-23T11:30:00Z",
    updatedAt: "2025-12-23T11:30:00Z",
    flagged: false,
    flagReason: null
  },
  {
    id: "rev_004",
    type: "flight",
    itemId: "6E205",
    itemName: "IndiGo 6E205 (Bangalore to Chennai)",
    userId: "user_004",
    userName: "Sneha Reddy",
    userAvatar: null,
    rating: 4,
    title: "Punctual and efficient",
    content: "IndiGo as always was on time. Quick boarding process and friendly crew. Seats are a bit cramped but okay for a short flight. No meal service but that's expected. Clean aircraft and smooth flight. Good value for money.",
    photos: [],
    helpful: 8,
    notHelpful: 0,
    replies: [],
    tags: ["punctual", "efficient", "clean", "value"],
    verified: true,
    createdAt: "2025-12-22T08:20:00Z",
    updatedAt: "2025-12-22T08:20:00Z",
    flagged: false,
    flagReason: null
  },
  {
    id: "rev_005",
    type: "hotel",
    itemId: "hotel_003",
    itemName: "The Oberoi Udaivilas",
    userId: "user_005",
    userName: "Kavya Nair",
    userAvatar: null,
    rating: 5,
    title: "Palace-like luxury",
    content: "This is not just a hotel, it's an experience! The architecture is breathtaking, service is world-class. Our room had a stunning lake view. The spa treatments were divine. Dining was exceptional with great Indian and international options. Perfect for a romantic getaway. Expensive but worth every penny!",
    photos: [
      "/api/placeholder/400/300",
      "/api/placeholder/400/300",
      "/api/placeholder/400/300"
    ],
    helpful: 31,
    notHelpful: 1,
    replies: [
      {
        id: "reply_003",
        userId: "hotel_003",
        userName: "The Oberoi Udaivilas",
        isOfficial: true,
        content: "We are thrilled that you had such a wonderful experience at Udaivilas. Thank you for taking the time to share your feedback. We look forward to creating more magical moments for you in the future.",
        createdAt: "2025-12-21T14:45:00Z"
      }
    ],
    tags: ["luxury", "architecture", "spa", "romantic", "lake-view"],
    verified: true,
    createdAt: "2025-12-20T19:10:00Z",
    updatedAt: "2025-12-20T19:10:00Z",
    flagged: false,
    flagReason: null
  }
];

// Mock user votes (who voted helpful/not helpful)
const mockUserVotes = {};

// Get reviews for a specific item
export const getReviews = async (type, itemId, sortBy = 'newest', page = 1, limit = 10) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let filteredReviews = mockReviews.filter(review => 
      review.type === type && review.itemId === itemId
    );

    // Sort reviews
    switch (sortBy) {
      case 'newest':
        filteredReviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'oldest':
        filteredReviews.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
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
      default:
        break;
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
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

    return {
      success: true,
      data: {
        reviews: paginatedReviews,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalReviews / limit),
          totalReviews,
          hasNext: endIndex < totalReviews,
          hasPrev: page > 1
        },
        statistics: {
          averageRating: Math.round(averageRating * 10) / 10,
          totalReviews,
          ratingDistribution
        }
      }
    };
  } catch (error) {
    throw new Error('Failed to fetch reviews');
  }
};

// Submit a new review
export const submitReview = async (reviewData) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newReview = {
      id: `rev_${Date.now()}`,
      ...reviewData,
      helpful: 0,
      notHelpful: 0,
      replies: [],
      verified: true, // In real app, this would be based on actual booking verification
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      flagged: false,
      flagReason: null
    };

    // Add to mock data
    mockReviews.unshift(newReview);

    return {
      success: true,
      data: newReview,
      message: 'Review submitted successfully'
    };
  } catch (error) {
    throw new Error('Failed to submit review');
  }
};

// Vote on review helpfulness
export const voteOnReview = async (reviewId, voteType, userId) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const review = mockReviews.find(r => r.id === reviewId);
    if (!review) {
      throw new Error('Review not found');
    }

    const userVoteKey = `${userId}_${reviewId}`;
    const existingVote = mockUserVotes[userVoteKey];

    // Remove existing vote if any
    if (existingVote) {
      if (existingVote === 'helpful') {
        review.helpful = Math.max(0, review.helpful - 1);
      } else {
        review.notHelpful = Math.max(0, review.notHelpful - 1);
      }
    }

    // Add new vote if different from existing
    if (existingVote !== voteType) {
      if (voteType === 'helpful') {
        review.helpful += 1;
      } else {
        review.notHelpful += 1;
      }
      mockUserVotes[userVoteKey] = voteType;
    } else {
      // Remove vote if same as existing
      delete mockUserVotes[userVoteKey];
    }

    return {
      success: true,
      data: {
        helpful: review.helpful,
        notHelpful: review.notHelpful,
        userVote: mockUserVotes[userVoteKey] || null
      }
    };
  } catch (error) {
    throw new Error('Failed to vote on review');
  }
};

// Reply to a review
export const replyToReview = async (reviewId, replyData) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const review = mockReviews.find(r => r.id === reviewId);
    if (!review) {
      throw new Error('Review not found');
    }

    const newReply = {
      id: `reply_${Date.now()}`,
      ...replyData,
      createdAt: new Date().toISOString()
    };

    review.replies.push(newReply);

    return {
      success: true,
      data: newReply,
      message: 'Reply added successfully'
    };
  } catch (error) {
    throw new Error('Failed to add reply');
  }
};

// Flag a review
export const flagReview = async (reviewId, reason, userId) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const review = mockReviews.find(r => r.id === reviewId);
    if (!review) {
      throw new Error('Review not found');
    }

    // In a real app, this would create a moderation ticket
    console.log(`Review ${reviewId} flagged by user ${userId} for: ${reason}`);

    return {
      success: true,
      message: 'Review flagged for moderation. Thank you for helping keep our community safe.'
    };
  } catch (error) {
    throw new Error('Failed to flag review');
  }
};

// Upload review photos
export const uploadReviewPhotos = async (files) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simulate photo upload
    const uploadedPhotos = files.map((file, index) => ({
      id: `photo_${Date.now()}_${index}`,
      url: `/api/placeholder/400/300`, // In real app, this would be the actual uploaded URL
      filename: file.name,
      size: file.size
    }));

    return {
      success: true,
      data: uploadedPhotos
    };
  } catch (error) {
    throw new Error('Failed to upload photos');
  }
};

// Get user's reviews
export const getUserReviews = async (userId, page = 1, limit = 10) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const userReviews = mockReviews.filter(review => review.userId === userId);
    
    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedReviews = userReviews.slice(startIndex, endIndex);

    return {
      success: true,
      data: {
        reviews: paginatedReviews,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(userReviews.length / limit),
          totalReviews: userReviews.length,
          hasNext: endIndex < userReviews.length,
          hasPrev: page > 1
        }
      }
    };
  } catch (error) {
    throw new Error('Failed to fetch user reviews');
  }
};

// Search reviews
export const searchReviews = async (query, type = null, minRating = null, maxRating = null) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    let filteredReviews = mockReviews.filter(review => {
      const matchesQuery = !query || 
        review.title.toLowerCase().includes(query.toLowerCase()) ||
        review.content.toLowerCase().includes(query.toLowerCase()) ||
        review.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()));
      
      const matchesType = !type || review.type === type;
      const matchesRating = (!minRating || review.rating >= minRating) && 
                           (!maxRating || review.rating <= maxRating);
      
      return matchesQuery && matchesType && matchesRating;
    });

    return {
      success: true,
      data: filteredReviews
    };
  } catch (error) {
    throw new Error('Failed to search reviews');
  }
};