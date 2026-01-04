import { ObjectId } from 'mongodb';

export interface UserPreference {
  category: string;
  value: string;
  weight: number;
  source: 'booking' | 'search' | 'review' | 'explicit';
  lastUpdated: Date;
}

export interface UserProfile {
  _id?: ObjectId;
  userId: string;
  preferences: UserPreference[];
  demographics: {
    ageGroup?: string;
    travelStyle?: 'budget' | 'mid-range' | 'luxury';
    travelPurpose?: 'business' | 'leisure' | 'family' | 'adventure';
    groupSize?: 'solo' | 'couple' | 'family' | 'group';
  };
  behaviorMetrics: {
    averageBookingValue: number;
    bookingFrequency: number;
    seasonalPreferences: string[];
    destinationTypes: string[];
    accommodationTypes: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface UserInteraction {
  _id?: ObjectId;
  userId: string;
  itemType: 'flight' | 'hotel' | 'destination';
  itemId: string;
  interactionType: 'view' | 'search' | 'book' | 'review' | 'save' | 'share';
  metadata: {
    destination?: string;
    price?: number;
    rating?: number;
    duration?: number;
    features?: string[];
  };
  timestamp: Date;
}

export interface RecommendationReason {
  type: 'preference_match' | 'collaborative' | 'trending' | 'seasonal' | 'price_match' | 'similar_users';
  description: string;
  confidence: number;
  details: {
    matchedPreferences?: string[];
    similarUsers?: number;
    trendingScore?: number;
    priceAdvantage?: number;
  };
}

export interface Recommendation {
  _id?: ObjectId;
  id: string;
  userId: string;
  itemType: 'flight' | 'hotel' | 'destination' | 'package';
  itemId: string;
  title: string;
  description: string;
  imageUrl: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  location: string;
  highlights: string[];
  reasons: RecommendationReason[];
  score: number;
  category: 'personalized' | 'trending' | 'deals' | 'seasonal';
  metadata: {
    destination?: string;
    duration?: string;
    features?: string[];
    tags?: string[];
  };
  isActive: boolean;
  createdAt: Date;
  expiresAt: Date;
}

export interface CollaborativeData {
  _id?: ObjectId;
  userId: string;
  similarUsers: Array<{
    userId: string;
    similarity: number;
    commonPreferences: string[];
  }>;
  userClusters: string[];
  lastUpdated: Date;
}

export interface RecommendationFeedback {
  _id?: ObjectId;
  userId: string;
  recommendationId: string;
  feedbackType: 'like' | 'dislike' | 'not_interested' | 'booked' | 'saved';
  reason?: string;
  timestamp: Date;
}

export interface TrendingItem {
  _id?: ObjectId;
  itemType: 'flight' | 'hotel' | 'destination';
  itemId: string;
  title: string;
  location: string;
  trendScore: number;
  viewCount: number;
  bookingCount: number;
  searchCount: number;
  timeframe: '24h' | '7d' | '30d';
  lastUpdated: Date;
}

export interface RecommendationAnalytics {
  totalRecommendations: number;
  clickThroughRate: number;
  conversionRate: number;
  averageScore: number;
  categoryBreakdown: {
    personalized: number;
    trending: number;
    deals: number;
    seasonal: number;
  };
  feedbackStats: {
    likes: number;
    dislikes: number;
    bookings: number;
    saves: number;
  };
  topReasons: Array<{
    type: string;
    count: number;
    successRate: number;
  }>;
}

export interface DestinationInsight {
  destination: string;
  category: string;
  features: string[];
  bestTime: string[];
  averagePrice: number;
  popularWith: string[];
  description: string;
  tags: string[];
}

export interface RecommendationRequest {
  userId: string;
  count?: number;
  category?: 'personalized' | 'trending' | 'deals' | 'seasonal';
  itemType?: 'flight' | 'hotel' | 'destination' | 'package';
  filters?: {
    priceRange?: { min: number; max: number };
    location?: string;
    rating?: number;
    features?: string[];
  };
}