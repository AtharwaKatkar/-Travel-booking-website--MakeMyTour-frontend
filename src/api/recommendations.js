// API client functions for recommendations

const API_BASE_URL = '/api/recommendations';

export const recommendationsAPI = {
  // Generate recommendations for a user
  generateRecommendations: async (request) => {
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'generate',
          ...request
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error generating recommendations:', error);
      throw error;
    }
  },

  // Get user recommendations
  getUserRecommendations: async (userId, category = null) => {
    try {
      const params = new URLSearchParams({ userId });
      if (category) params.append('category', category);

      const response = await fetch(`${API_BASE_URL}?${params}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting user recommendations:', error);
      throw error;
    }
  },

  // Track user interaction
  trackInteraction: async (interaction) => {
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'track_interaction',
          ...interaction
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error tracking interaction:', error);
      throw error;
    }
  },

  // Submit recommendation feedback
  submitFeedback: async (feedback) => {
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'submit_feedback',
          ...feedback
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error submitting feedback:', error);
      throw error;
    }
  },

  // Get recommendation analytics
  getAnalytics: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}?analytics=true`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting analytics:', error);
      throw error;
    }
  },

  // Initialize sample data
  initializeSampleData: async () => {
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'initialize_sample_data'
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error initializing sample data:', error);
      throw error;
    }
  }
};

// Mock data for development and testing
export const mockRecommendations = [
  {
    id: 'rec_001',
    userId: 'user123',
    itemType: 'destination',
    itemId: 'bali_001',
    title: 'Bali Beach Paradise',
    description: 'Experience pristine beaches and vibrant culture in Bali',
    imageUrl: '/images/bali.jpg',
    price: 45000,
    originalPrice: 55000,
    rating: 4.8,
    reviewCount: 1247,
    location: 'Bali, Indonesia',
    highlights: ['Beach', 'Culture', 'Temples', 'Nightlife', 'Adventure'],
    reasons: [
      {
        type: 'preference_match',
        description: 'Based on your interest in beach destinations',
        confidence: 0.9,
        details: {
          matchedPreferences: ['beach', 'international']
        }
      }
    ],
    score: 95,
    category: 'personalized',
    metadata: {
      destination: 'Bali',
      duration: '5-7 days',
      features: ['beach', 'international', 'culture'],
      tags: ['beach', 'tropical', 'adventure', 'culture', 'international']
    },
    isActive: true,
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  },
  {
    id: 'rec_002',
    userId: 'user123',
    itemType: 'hotel',
    itemId: 'taj_mumbai',
    title: 'The Taj Mahal Palace Mumbai',
    description: 'Iconic luxury hotel with heritage charm and modern amenities',
    imageUrl: '/images/taj-mumbai.jpg',
    price: 25000,
    originalPrice: 30000,
    rating: 4.9,
    reviewCount: 2341,
    location: 'Mumbai, Maharashtra',
    highlights: ['Luxury', 'Heritage', 'Sea View', 'Fine Dining', 'Spa'],
    reasons: [
      {
        type: 'collaborative',
        description: 'Users with similar preferences also liked this',
        confidence: 0.85,
        details: {
          similarUsers: 156,
          matchedPreferences: ['luxury', 'heritage']
        }
      }
    ],
    score: 88,
    category: 'personalized',
    metadata: {
      destination: 'Mumbai',
      features: ['luxury', 'heritage', 'business'],
      tags: ['luxury', 'heritage', 'business', 'city', 'iconic']
    },
    isActive: true,
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  },
  {
    id: 'rec_003',
    userId: 'user123',
    itemType: 'destination',
    itemId: 'goa_001',
    title: 'Goa Coastal Getaway',
    description: 'Relax on golden beaches and enjoy vibrant nightlife',
    imageUrl: '/images/goa.jpg',
    price: 15000,
    originalPrice: 18000,
    rating: 4.5,
    reviewCount: 892,
    location: 'Goa, India',
    highlights: ['Beach', 'Nightlife', 'Portuguese Heritage', 'Seafood', 'Water Sports'],
    reasons: [
      {
        type: 'price_match',
        description: 'Great deal - 17% off regular price',
        confidence: 0.9,
        details: {
          priceAdvantage: 3000
        }
      }
    ],
    score: 82,
    category: 'deals',
    metadata: {
      destination: 'Goa',
      duration: '3-5 days',
      features: ['beach', 'domestic', 'nightlife'],
      tags: ['beach', 'party', 'domestic', 'water-sports', 'heritage']
    },
    isActive: true,
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  }
];

export default recommendationsAPI;