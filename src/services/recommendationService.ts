import { getDatabase } from '../lib/mongodb';
import { 
  UserProfile, 
  UserInteraction, 
  Recommendation, 
  RecommendationFeedback,
  CollaborativeData,
  TrendingItem,
  RecommendationAnalytics,
  RecommendationRequest,
  RecommendationReason,
  UserPreference,
  DestinationInsight
} from '../models/Recommendations';
import { ObjectId } from 'mongodb';

const USER_PROFILES_COLLECTION = 'user_profiles';
const USER_INTERACTIONS_COLLECTION = 'user_interactions';
const RECOMMENDATIONS_COLLECTION = 'recommendations';
const RECOMMENDATION_FEEDBACK_COLLECTION = 'recommendation_feedback';
const COLLABORATIVE_DATA_COLLECTION = 'collaborative_data';
const TRENDING_ITEMS_COLLECTION = 'trending_items';

export class RecommendationService {
  private async getUserProfilesCollection() {
    const db = await getDatabase();
    return db.collection<UserProfile>(USER_PROFILES_COLLECTION);
  }

  private async getUserInteractionsCollection() {
    const db = await getDatabase();
    return db.collection<UserInteraction>(USER_INTERACTIONS_COLLECTION);
  }

  private async getRecommendationsCollection() {
    const db = await getDatabase();
    return db.collection<Recommendation>(RECOMMENDATIONS_COLLECTION);
  }

  private async getRecommendationFeedbackCollection() {
    const db = await getDatabase();
    return db.collection<RecommendationFeedback>(RECOMMENDATION_FEEDBACK_COLLECTION);
  }

  private async getCollaborativeDataCollection() {
    const db = await getDatabase();
    return db.collection<CollaborativeData>(COLLABORATIVE_DATA_COLLECTION);
  }

  private async getTrendingItemsCollection() {
    const db = await getDatabase();
    return db.collection<TrendingItem>(TRENDING_ITEMS_COLLECTION);
  }

  // Track user interaction
  async trackUserInteraction(interaction: Omit<UserInteraction, '_id' | 'timestamp'>) {
    try {
      const collection = await this.getUserInteractionsCollection();
      
      const userInteraction: UserInteraction = {
        ...interaction,
        timestamp: new Date()
      };

      await collection.insertOne(userInteraction);
      
      // Update user profile based on interaction
      await this.updateUserProfile(interaction.userId, interaction);
      
      return {
        success: true,
        message: 'Interaction tracked successfully'
      };
    } catch (error) {
      console.error('Error tracking user interaction:', error);
      throw new Error('Failed to track user interaction');
    }
  }

  // Update user profile based on interactions
  private async updateUserProfile(userId: string, interaction: Omit<UserInteraction, '_id' | 'timestamp'>) {
    try {
      const collection = await this.getUserProfilesCollection();
      let profile = await collection.findOne({ userId });

      if (!profile) {
        profile = await this.createInitialUserProfile(userId);
      }

      // Extract preferences from interaction
      const newPreferences = this.extractPreferencesFromInteraction(interaction);
      
      // Update existing preferences or add new ones
      const updatedPreferences = [...profile.preferences];
      
      newPreferences.forEach(newPref => {
        const existingIndex = updatedPreferences.findIndex(
          p => p.category === newPref.category && p.value === newPref.value
        );
        
        if (existingIndex >= 0) {
          // Increase weight for existing preference
          updatedPreferences[existingIndex].weight += newPref.weight;
          updatedPreferences[existingIndex].lastUpdated = new Date();
        } else {
          // Add new preference
          updatedPreferences.push(newPref);
        }
      });

      // Update behavior metrics
      const behaviorMetrics = this.updateBehaviorMetrics(profile.behaviorMetrics, interaction);

      await collection.updateOne(
        { userId },
        {
          $set: {
            preferences: updatedPreferences,
            behaviorMetrics,
            updatedAt: new Date()
          }
        }
      );

    } catch (error) {
      console.error('Error updating user profile:', error);
    }
  }

  // Extract preferences from interaction
  private extractPreferencesFromInteraction(interaction: Omit<UserInteraction, '_id' | 'timestamp'>): UserPreference[] {
    const preferences: UserPreference[] = [];
    const now = new Date();

    // Extract destination preference
    if (interaction.metadata.destination) {
      preferences.push({
        category: 'destination',
        value: interaction.metadata.destination,
        weight: this.getInteractionWeight(interaction.interactionType),
        source: interaction.interactionType === 'book' ? 'booking' : 'search',
        lastUpdated: now
      });
    }

    // Extract price range preference
    if (interaction.metadata.price) {
      const priceRange = this.getPriceRange(interaction.metadata.price);
      preferences.push({
        category: 'price_range',
        value: priceRange,
        weight: this.getInteractionWeight(interaction.interactionType),
        source: interaction.interactionType === 'book' ? 'booking' : 'search',
        lastUpdated: now
      });
    }

    // Extract feature preferences
    if (interaction.metadata.features) {
      interaction.metadata.features.forEach(feature => {
        preferences.push({
          category: 'feature',
          value: feature,
          weight: this.getInteractionWeight(interaction.interactionType) * 0.5,
          source: interaction.interactionType === 'book' ? 'booking' : 'search',
          lastUpdated: now
        });
      });
    }

    return preferences;
  }

  // Get interaction weight based on type
  private getInteractionWeight(interactionType: string): number {
    const weights = {
      'book': 10,
      'review': 8,
      'save': 6,
      'share': 5,
      'view': 2,
      'search': 1
    };
    return weights[interactionType as keyof typeof weights] || 1;
  }

  // Get price range category
  private getPriceRange(price: number): string {
    if (price < 5000) return 'budget';
    if (price < 15000) return 'mid-range';
    if (price < 30000) return 'premium';
    return 'luxury';
  }

  // Update behavior metrics
  private updateBehaviorMetrics(currentMetrics: any, interaction: Omit<UserInteraction, '_id' | 'timestamp'>) {
    const updated = { ...currentMetrics };

    if (interaction.interactionType === 'book' && interaction.metadata.price) {
      const currentTotal = updated.averageBookingValue * updated.bookingFrequency;
      updated.bookingFrequency += 1;
      updated.averageBookingValue = (currentTotal + interaction.metadata.price) / updated.bookingFrequency;
    }

    if (interaction.metadata.destination) {
      const destType = this.getDestinationType(interaction.metadata.destination);
      if (!updated.destinationTypes.includes(destType)) {
        updated.destinationTypes.push(destType);
      }
    }

    return updated;
  }

  // Get destination type
  private getDestinationType(destination: string): string {
    const beachDestinations = ['goa', 'maldives', 'bali', 'phuket', 'miami'];
    const mountainDestinations = ['manali', 'shimla', 'nepal', 'switzerland', 'colorado'];
    const cityDestinations = ['mumbai', 'delhi', 'bangalore', 'new york', 'london'];
    
    const dest = destination.toLowerCase();
    
    if (beachDestinations.some(beach => dest.includes(beach))) return 'beach';
    if (mountainDestinations.some(mountain => dest.includes(mountain))) return 'mountain';
    if (cityDestinations.some(city => dest.includes(city))) return 'city';
    
    return 'other';
  }

  // Create initial user profile
  private async createInitialUserProfile(userId: string): Promise<UserProfile> {
    const collection = await this.getUserProfilesCollection();
    
    const profile: UserProfile = {
      userId,
      preferences: [],
      demographics: {},
      behaviorMetrics: {
        averageBookingValue: 0,
        bookingFrequency: 0,
        seasonalPreferences: [],
        destinationTypes: [],
        accommodationTypes: []
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await collection.insertOne(profile);
    return profile;
  }

  // Generate personalized recommendations
  async generateRecommendations(request: RecommendationRequest) {
    try {
      const { userId, count = 10, category, itemType, filters } = request;
      
      // Get user profile
      const profileCollection = await this.getUserProfilesCollection();
      const userProfile = await profileCollection.findOne({ userId });
      
      if (!userProfile) {
        // Return trending recommendations for new users
        return await this.getTrendingRecommendations(count, itemType);
      }

      // Generate different types of recommendations
      const recommendations: Recommendation[] = [];
      
      if (!category || category === 'personalized') {
        const personalizedRecs = await this.generatePersonalizedRecommendations(userProfile, count);
        recommendations.push(...personalizedRecs);
      }
      
      if (!category || category === 'collaborative') {
        const collaborativeRecs = await this.generateCollaborativeRecommendations(userId, count);
        recommendations.push(...collaborativeRecs);
      }
      
      if (!category || category === 'trending') {
        const trendingRecs = await this.getTrendingRecommendations(count, itemType);
        recommendations.push(...trendingRecs);
      }
      
      if (!category || category === 'deals') {
        const dealRecs = await this.generateDealRecommendations(userProfile, count);
        recommendations.push(...dealRecs);
      }

      // Sort by score and remove duplicates
      const uniqueRecs = this.removeDuplicateRecommendations(recommendations);
      const sortedRecs = uniqueRecs.sort((a, b) => b.score - a.score);
      
      // Apply filters if provided
      const filteredRecs = this.applyFilters(sortedRecs, filters);
      
      // Store recommendations
      await this.storeRecommendations(filteredRecs.slice(0, count));
      
      return {
        success: true,
        data: filteredRecs.slice(0, count)
      };
    } catch (error) {
      console.error('Error generating recommendations:', error);
      throw new Error('Failed to generate recommendations');
    }
  }

  // Generate personalized recommendations based on user preferences
  private async generatePersonalizedRecommendations(userProfile: UserProfile, count: number): Promise<Recommendation[]> {
    const recommendations: Recommendation[] = [];
    
    // Get top preferences
    const topPreferences = userProfile.preferences
      .sort((a, b) => b.weight - a.weight)
      .slice(0, 5);

    // Mock recommendation data based on preferences
    const mockRecommendations = await this.getMockRecommendations();
    
    topPreferences.forEach(preference => {
      const matchingRecs = mockRecommendations.filter(rec => 
        this.doesRecommendationMatchPreference(rec, preference)
      );
      
      matchingRecs.forEach(rec => {
        const reasons: RecommendationReason[] = [{
          type: 'preference_match',
          description: `Based on your interest in ${preference.value}`,
          confidence: Math.min(preference.weight / 10, 1),
          details: {
            matchedPreferences: [preference.value]
          }
        }];
        
        recommendations.push({
          ...rec,
          userId: userProfile.userId,
          reasons,
          score: this.calculatePersonalizedScore(rec, preference),
          category: 'personalized'
        });
      });
    });

    return recommendations.slice(0, count);
  }

  // Generate collaborative filtering recommendations
  private async generateCollaborativeRecommendations(userId: string, count: number): Promise<Recommendation[]> {
    const recommendations: Recommendation[] = [];
    
    // Get similar users (mock implementation)
    const similarUsers = await this.findSimilarUsers(userId);
    
    if (similarUsers.length === 0) {
      return recommendations;
    }

    // Get recommendations based on similar users' preferences
    const mockRecommendations = await this.getMockRecommendations();
    
    similarUsers.slice(0, 3).forEach(similarUser => {
      const userRecs = mockRecommendations.filter(() => Math.random() > 0.7); // Mock selection
      
      userRecs.forEach(rec => {
        const reasons: RecommendationReason[] = [{
          type: 'collaborative',
          description: `Users with similar preferences also liked this`,
          confidence: similarUser.similarity,
          details: {
            similarUsers: similarUsers.length,
            matchedPreferences: similarUser.commonPreferences
          }
        }];
        
        recommendations.push({
          ...rec,
          userId,
          reasons,
          score: this.calculateCollaborativeScore(rec, similarUser.similarity),
          category: 'personalized'
        });
      });
    });

    return recommendations.slice(0, count);
  }

  // Get trending recommendations
  private async getTrendingRecommendations(count: number, itemType?: string): Promise<Recommendation[]> {
    const mockRecommendations = await this.getMockRecommendations();
    
    return mockRecommendations
      .filter(rec => !itemType || rec.itemType === itemType)
      .map(rec => ({
        ...rec,
        userId: 'anonymous',
        reasons: [{
          type: 'trending',
          description: 'Popular destination trending now',
          confidence: 0.8,
          details: {
            trendingScore: Math.random() * 100
          }
        }],
        score: Math.random() * 100,
        category: 'trending' as const
      }))
      .slice(0, count);
  }

  // Generate deal recommendations
  private async generateDealRecommendations(userProfile: UserProfile, count: number): Promise<Recommendation[]> {
    const mockRecommendations = await this.getMockRecommendations();
    
    return mockRecommendations
      .filter(rec => rec.originalPrice && rec.originalPrice > rec.price)
      .map(rec => ({
        ...rec,
        userId: userProfile.userId,
        reasons: [{
          type: 'price_match',
          description: `Great deal - ${Math.round(((rec.originalPrice! - rec.price) / rec.originalPrice!) * 100)}% off`,
          confidence: 0.9,
          details: {
            priceAdvantage: rec.originalPrice! - rec.price
          }
        }],
        score: ((rec.originalPrice! - rec.price) / rec.originalPrice!) * 100,
        category: 'deals' as const
      }))
      .slice(0, count);
  }

  // Find similar users (mock implementation)
  private async findSimilarUsers(userId: string) {
    // Mock similar users data
    return [
      {
        userId: 'user456',
        similarity: 0.85,
        commonPreferences: ['beach', 'luxury', 'international']
      },
      {
        userId: 'user789',
        similarity: 0.72,
        commonPreferences: ['adventure', 'budget', 'domestic']
      }
    ];
  }

  // Check if recommendation matches preference
  private doesRecommendationMatchPreference(rec: any, preference: UserPreference): boolean {
    switch (preference.category) {
      case 'destination':
        return rec.location.toLowerCase().includes(preference.value.toLowerCase());
      case 'price_range':
        const recPriceRange = this.getPriceRange(rec.price);
        return recPriceRange === preference.value;
      case 'feature':
        return rec.highlights.some((h: string) => 
          h.toLowerCase().includes(preference.value.toLowerCase())
        );
      default:
        return false;
    }
  }

  // Calculate personalized score
  private calculatePersonalizedScore(rec: any, preference: UserPreference): number {
    const baseScore = 50;
    const preferenceBoost = (preference.weight / 10) * 30;
    const ratingBoost = rec.rating * 5;
    const randomFactor = Math.random() * 10;
    
    return Math.min(baseScore + preferenceBoost + ratingBoost + randomFactor, 100);
  }

  // Calculate collaborative score
  private calculateCollaborativeScore(rec: any, similarity: number): number {
    const baseScore = 40;
    const similarityBoost = similarity * 40;
    const ratingBoost = rec.rating * 4;
    const randomFactor = Math.random() * 10;
    
    return Math.min(baseScore + similarityBoost + ratingBoost + randomFactor, 100);
  }

  // Remove duplicate recommendations
  private removeDuplicateRecommendations(recommendations: Recommendation[]): Recommendation[] {
    const seen = new Set();
    return recommendations.filter(rec => {
      const key = `${rec.itemType}-${rec.itemId}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }

  // Apply filters to recommendations
  private applyFilters(recommendations: Recommendation[], filters?: any): Recommendation[] {
    if (!filters) return recommendations;
    
    return recommendations.filter(rec => {
      if (filters.priceRange) {
        if (rec.price < filters.priceRange.min || rec.price > filters.priceRange.max) {
          return false;
        }
      }
      
      if (filters.location && !rec.location.toLowerCase().includes(filters.location.toLowerCase())) {
        return false;
      }
      
      if (filters.rating && rec.rating < filters.rating) {
        return false;
      }
      
      if (filters.features) {
        const hasFeature = filters.features.some((feature: string) =>
          rec.highlights.some(highlight => 
            highlight.toLowerCase().includes(feature.toLowerCase())
          )
        );
        if (!hasFeature) return false;
      }
      
      return true;
    });
  }

  // Store recommendations in database
  private async storeRecommendations(recommendations: Recommendation[]) {
    if (recommendations.length === 0) return;
    
    const collection = await this.getRecommendationsCollection();
    
    const recsWithMetadata = recommendations.map(rec => ({
      ...rec,
      id: `rec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      isActive: true,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    }));
    
    await collection.insertMany(recsWithMetadata);
  }

  // Submit recommendation feedback
  async submitRecommendationFeedback(feedback: Omit<RecommendationFeedback, '_id' | 'timestamp'>) {
    try {
      const collection = await this.getRecommendationFeedbackCollection();
      
      const feedbackRecord: RecommendationFeedback = {
        ...feedback,
        timestamp: new Date()
      };
      
      await collection.insertOne(feedbackRecord);
      
      // Update user profile based on feedback
      await this.updateProfileFromFeedback(feedback);
      
      return {
        success: true,
        message: 'Feedback submitted successfully'
      };
    } catch (error) {
      console.error('Error submitting feedback:', error);
      throw new Error('Failed to submit feedback');
    }
  }

  // Update user profile based on feedback
  private async updateProfileFromFeedback(feedback: Omit<RecommendationFeedback, '_id' | 'timestamp'>) {
    try {
      // Get the recommendation to understand what was liked/disliked
      const recCollection = await this.getRecommendationsCollection();
      const recommendation = await recCollection.findOne({ id: feedback.recommendationId });
      
      if (!recommendation) return;
      
      const profileCollection = await this.getUserProfilesCollection();
      const profile = await profileCollection.findOne({ userId: feedback.userId });
      
      if (!profile) return;
      
      // Adjust preferences based on feedback
      const updatedPreferences = [...profile.preferences];
      const weightAdjustment = feedback.feedbackType === 'like' ? 2 : 
                              feedback.feedbackType === 'dislike' ? -1 : 0;
      
      // Update preferences related to this recommendation
      recommendation.metadata.tags?.forEach(tag => {
        const existingIndex = updatedPreferences.findIndex(
          p => p.category === 'feature' && p.value === tag
        );
        
        if (existingIndex >= 0) {
          updatedPreferences[existingIndex].weight += weightAdjustment;
          updatedPreferences[existingIndex].lastUpdated = new Date();
        } else if (weightAdjustment > 0) {
          updatedPreferences.push({
            category: 'feature',
            value: tag,
            weight: weightAdjustment,
            source: 'explicit',
            lastUpdated: new Date()
          });
        }
      });
      
      await profileCollection.updateOne(
        { userId: feedback.userId },
        {
          $set: {
            preferences: updatedPreferences,
            updatedAt: new Date()
          }
        }
      );
      
    } catch (error) {
      console.error('Error updating profile from feedback:', error);
    }
  }

  // Get user recommendations
  async getUserRecommendations(userId: string, category?: string) {
    try {
      const collection = await this.getRecommendationsCollection();
      
      const filter: any = {
        userId,
        isActive: true,
        expiresAt: { $gt: new Date() }
      };
      
      if (category) {
        filter.category = category;
      }
      
      const recommendations = await collection
        .find(filter)
        .sort({ score: -1 })
        .limit(20)
        .toArray();
      
      return {
        success: true,
        data: recommendations
      };
    } catch (error) {
      console.error('Error getting user recommendations:', error);
      throw new Error('Failed to get recommendations');
    }
  }

  // Get recommendation analytics
  async getRecommendationAnalytics(): Promise<{ success: boolean; data: RecommendationAnalytics }> {
    try {
      const [recCollection, feedbackCollection] = await Promise.all([
        this.getRecommendationsCollection(),
        this.getRecommendationFeedbackCollection()
      ]);
      
      const [recommendations, feedbacks] = await Promise.all([
        recCollection.find({}).toArray(),
        feedbackCollection.find({}).toArray()
      ]);
      
      const totalRecommendations = recommendations.length;
      const totalFeedbacks = feedbacks.length;
      
      const analytics: RecommendationAnalytics = {
        totalRecommendations,
        clickThroughRate: totalFeedbacks > 0 ? (feedbacks.filter(f => f.feedbackType === 'like').length / totalFeedbacks) * 100 : 0,
        conversionRate: totalFeedbacks > 0 ? (feedbacks.filter(f => f.feedbackType === 'booked').length / totalFeedbacks) * 100 : 0,
        averageScore: recommendations.length > 0 ? recommendations.reduce((sum, r) => sum + r.score, 0) / recommendations.length : 0,
        categoryBreakdown: {
          personalized: recommendations.filter(r => r.category === 'personalized').length,
          trending: recommendations.filter(r => r.category === 'trending').length,
          deals: recommendations.filter(r => r.category === 'deals').length,
          seasonal: recommendations.filter(r => r.category === 'seasonal').length
        },
        feedbackStats: {
          likes: feedbacks.filter(f => f.feedbackType === 'like').length,
          dislikes: feedbacks.filter(f => f.feedbackType === 'dislike').length,
          bookings: feedbacks.filter(f => f.feedbackType === 'booked').length,
          saves: feedbacks.filter(f => f.feedbackType === 'saved').length
        },
        topReasons: [
          { type: 'preference_match', count: 45, successRate: 78 },
          { type: 'collaborative', count: 32, successRate: 65 },
          { type: 'trending', count: 28, successRate: 52 },
          { type: 'price_match', count: 23, successRate: 85 }
        ]
      };
      
      return {
        success: true,
        data: analytics
      };
    } catch (error) {
      console.error('Error getting recommendation analytics:', error);
      throw new Error('Failed to get analytics');
    }
  }

  // Get mock recommendations data
  private async getMockRecommendations() {
    return [
      {
        itemType: 'destination' as const,
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
        metadata: {
          destination: 'Bali',
          duration: '5-7 days',
          features: ['beach', 'international', 'culture'],
          tags: ['beach', 'tropical', 'adventure', 'culture', 'international']
        }
      },
      {
        itemType: 'destination' as const,
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
        metadata: {
          destination: 'Goa',
          duration: '3-5 days',
          features: ['beach', 'domestic', 'nightlife'],
          tags: ['beach', 'party', 'domestic', 'water-sports', 'heritage']
        }
      },
      {
        itemType: 'destination' as const,
        itemId: 'manali_001',
        title: 'Manali Mountain Retreat',
        description: 'Escape to the serene mountains and enjoy adventure activities',
        imageUrl: '/images/manali.jpg',
        price: 12000,
        originalPrice: 15000,
        rating: 4.6,
        reviewCount: 654,
        location: 'Manali, Himachal Pradesh',
        highlights: ['Mountains', 'Adventure', 'Trekking', 'Snow', 'Nature'],
        metadata: {
          destination: 'Manali',
          duration: '4-6 days',
          features: ['mountain', 'domestic', 'adventure'],
          tags: ['mountain', 'adventure', 'trekking', 'snow', 'nature']
        }
      },
      {
        itemType: 'hotel' as const,
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
        metadata: {
          destination: 'Mumbai',
          features: ['luxury', 'heritage', 'business'],
          tags: ['luxury', 'heritage', 'business', 'city', 'iconic']
        }
      },
      {
        itemType: 'flight' as const,
        itemId: 'ai_del_bom',
        title: 'Delhi to Mumbai - Air India',
        description: 'Comfortable flight with excellent service and on-time performance',
        imageUrl: '/images/air-india.jpg',
        price: 8500,
        originalPrice: 10000,
        rating: 4.2,
        reviewCount: 1876,
        location: 'Delhi to Mumbai',
        highlights: ['On-time', 'Comfortable', 'Good Service', 'Meals Included'],
        metadata: {
          destination: 'Mumbai',
          features: ['domestic', 'business', 'reliable'],
          tags: ['domestic', 'business', 'reliable', 'meals']
        }
      },
      {
        itemType: 'destination' as const,
        itemId: 'kerala_001',
        title: 'Kerala Backwaters Experience',
        description: 'Cruise through serene backwaters and experience Gods Own Country',
        imageUrl: '/images/kerala.jpg',
        price: 20000,
        originalPrice: 25000,
        rating: 4.7,
        reviewCount: 1123,
        location: 'Kerala, India',
        highlights: ['Backwaters', 'Houseboat', 'Nature', 'Ayurveda', 'Spices'],
        metadata: {
          destination: 'Kerala',
          duration: '5-7 days',
          features: ['nature', 'domestic', 'relaxation'],
          tags: ['backwaters', 'nature', 'relaxation', 'ayurveda', 'houseboat']
        }
      }
    ];
  }

  // Initialize sample data
  async initializeSampleRecommendationData() {
    try {
      const profileCollection = await this.getUserProfilesCollection();
      const interactionCollection = await this.getUserInteractionsCollection();
      
      const existingProfiles = await profileCollection.countDocuments();
      const existingInteractions = await interactionCollection.countDocuments();
      
      if (existingProfiles === 0) {
        // Create sample user profiles
        const sampleProfiles: UserProfile[] = [
          {
            userId: 'user123',
            preferences: [
              { category: 'destination', value: 'beach', weight: 8, source: 'booking', lastUpdated: new Date() },
              { category: 'price_range', value: 'mid-range', weight: 6, source: 'booking', lastUpdated: new Date() },
              { category: 'feature', value: 'luxury', weight: 5, source: 'search', lastUpdated: new Date() }
            ],
            demographics: {
              ageGroup: '25-35',
              travelStyle: 'mid-range',
              travelPurpose: 'leisure',
              groupSize: 'couple'
            },
            behaviorMetrics: {
              averageBookingValue: 25000,
              bookingFrequency: 3,
              seasonalPreferences: ['winter', 'summer'],
              destinationTypes: ['beach', 'city'],
              accommodationTypes: ['hotel', 'resort']
            },
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ];
        
        await profileCollection.insertMany(sampleProfiles);
      }
      
      if (existingInteractions === 0) {
        // Create sample interactions
        const sampleInteractions: UserInteraction[] = [
          {
            userId: 'user123',
            itemType: 'destination',
            itemId: 'bali_001',
            interactionType: 'view',
            metadata: {
              destination: 'Bali',
              price: 45000,
              features: ['beach', 'culture']
            },
            timestamp: new Date()
          },
          {
            userId: 'user123',
            itemType: 'hotel',
            itemId: 'taj_mumbai',
            interactionType: 'book',
            metadata: {
              destination: 'Mumbai',
              price: 25000,
              rating: 4.9,
              features: ['luxury', 'heritage']
            },
            timestamp: new Date()
          }
        ];
        
        await interactionCollection.insertMany(sampleInteractions);
      }
      
      return {
        success: true,
        message: 'Sample recommendation data initialized successfully'
      };
    } catch (error) {
      console.error('Error initializing sample recommendation data:', error);
      throw new Error('Failed to initialize sample data');
    }
  }
}