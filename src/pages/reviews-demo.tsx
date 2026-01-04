import React, { useState } from 'react';
import { 
  Star, 
  Hotel, 
  Plane, 
  MessageSquare, 
  TrendingUp,
  Users,
  Award,
  Camera,
  ThumbsUp,
  Flag
} from 'lucide-react';

type TabType = 'hotel' | 'flight';

const ReviewsDemo = () => {
  const [selectedTab, setSelectedTab] = useState<TabType>('hotel');

  const demoStats = {
    hotel: {
      name: 'The Taj Mahal Palace Mumbai',
      rating: 4.6,
      totalReviews: 2847,
      distribution: { 5: 1823, 4: 672, 3: 241, 2: 78, 1: 33 }
    },
    flight: {
      name: 'Air India AI101 (Delhi to Mumbai)',
      rating: 3.8,
      totalReviews: 1256,
      distribution: { 5: 342, 4: 456, 3: 298, 2: 112, 1: 48 }
    }
  };

  const demoReviews = {
    hotel: [
      {
        id: 1,
        user: 'Rajesh Kumar',
        rating: 5,
        title: 'Exceptional luxury experience',
        content: 'Stayed here for our anniversary and it was absolutely perfect. The service was impeccable, rooms were spacious and beautifully decorated...',
        photos: 3,
        helpful: 24,
        verified: true,
        date: '2 days ago',
        tags: ['luxury', 'service', 'location']
      },
      {
        id: 2,
        user: 'Priya Sharma',
        rating: 4,
        title: 'Great business hotel',
        content: 'Excellent for business travel. Rooms are modern and well-equipped. WiFi is fast and reliable. The executive lounge is a nice touch...',
        photos: 1,
        helpful: 18,
        verified: true,
        date: '1 week ago',
        tags: ['business', 'wifi', 'modern']
      }
    ],
    flight: [
      {
        id: 3,
        user: 'Amit Patel',
        rating: 3,
        title: 'Average experience with delays',
        content: 'Flight was delayed by 2 hours due to weather, which was understandable. Cabin crew was friendly and helpful. Food was decent...',
        photos: 0,
        helpful: 12,
        verified: true,
        date: '3 days ago',
        tags: ['delayed', 'crew', 'food']
      },
      {
        id: 4,
        user: 'Sneha Reddy',
        rating: 4,
        title: 'Punctual and efficient',
        content: 'IndiGo as always was on time. Quick boarding process and friendly crew. Seats are a bit cramped but okay for a short flight...',
        photos: 0,
        helpful: 8,
        verified: true,
        date: '5 days ago',
        tags: ['punctual', 'efficient', 'clean']
      }
    ]
  };

  const currentStats = demoStats[selectedTab];
  const currentReviews = demoReviews[selectedTab];

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating 
            ? 'text-yellow-400 fill-current' 
            : 'text-gray-300'
        }`}
      />
    ));
  };

  const getBarWidth = (count: number) => {
    return currentStats.totalReviews > 0 ? (count / currentStats.totalReviews) * 100 : 0;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Review & Rating System Demo
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Comprehensive review system with ratings, photos, moderation, and helpful sorting
          </p>
          
          {/* Tab Selector */}
          <div className="flex justify-center">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setSelectedTab('hotel')}
                className={`flex items-center gap-2 px-6 py-3 rounded-md transition-colors ${
                  selectedTab === 'hotel'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Hotel className="w-5 h-5" />
                <span>Hotel Reviews</span>
              </button>
              <button
                onClick={() => setSelectedTab('flight')}
                className={`flex items-center gap-2 px-6 py-3 rounded-md transition-colors ${
                  selectedTab === 'flight'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Plane className="w-5 h-5" />
                <span>Flight Reviews</span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Review Summary */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">{currentStats.name}</h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                {/* Overall Rating */}
                <div className="text-center">
                  <div className="text-4xl font-bold text-gray-900 mb-2">
                    {currentStats.rating}
                  </div>
                  <div className="flex items-center justify-center gap-1 mb-2">
                    {renderStars(currentStats.rating)}
                  </div>
                  <div className="text-lg font-semibold text-blue-600">Excellent</div>
                  <p className="text-sm text-gray-600 mt-1">
                    Based on {currentStats.totalReviews.toLocaleString()} reviews
                  </p>
                </div>

                {/* Rating Distribution */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">Rating Breakdown</h3>
                  <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map((rating) => (
                      <div key={rating} className="flex items-center gap-3">
                        <div className="flex items-center gap-1 w-12">
                          <span className="text-sm font-medium text-gray-700">{rating}</span>
                          <Star className="w-3 h-3 text-yellow-400 fill-current" />
                        </div>
                        
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-yellow-400 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${getBarWidth(currentStats.distribution[rating as keyof typeof currentStats.distribution])}%` }}
                          ></div>
                        </div>
                        
                        <div className="w-12 text-right">
                          <span className="text-sm text-gray-600">
                            {currentStats.distribution[rating as keyof typeof currentStats.distribution]}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Sample Reviews */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">Recent Reviews</h3>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MessageSquare className="w-4 h-4" />
                  <span>Sorted by Most Helpful</span>
                </div>
              </div>

              {currentReviews.map((review) => (
                <div key={review.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  {/* Review Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold">
                          {review.user.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-gray-900">{review.user}</h4>
                          {review.verified && (
                            <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                              Verified
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{review.date}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      {renderStars(review.rating)}
                    </div>
                  </div>

                  {/* Review Content */}
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {review.title}
                  </h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    {review.content}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {review.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Review Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-4">
                      <button className="flex items-center gap-1 text-gray-600 hover:text-green-600 transition-colors">
                        <ThumbsUp className="w-4 h-4" />
                        <span className="text-sm">{review.helpful}</span>
                      </button>
                      
                      {review.photos > 0 && (
                        <div className="flex items-center gap-1 text-gray-600">
                          <Camera className="w-4 h-4" />
                          <span className="text-sm">{review.photos} photo{review.photos > 1 ? 's' : ''}</span>
                        </div>
                      )}
                    </div>
                    
                    <button className="flex items-center gap-1 text-gray-400 hover:text-red-500 transition-colors">
                      <Flag className="w-4 h-4" />
                      <span className="text-sm">Flag</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Key Features */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Key Features</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Star className="w-5 h-5 text-yellow-500" />
                  <span className="text-sm text-gray-700">1-5 star ratings</span>
                </div>
                <div className="flex items-center gap-3">
                  <Camera className="w-5 h-5 text-blue-500" />
                  <span className="text-sm text-gray-700">Photo uploads</span>
                </div>
                <div className="flex items-center gap-3">
                  <ThumbsUp className="w-5 h-5 text-green-500" />
                  <span className="text-sm text-gray-700">Helpful voting</span>
                </div>
                <div className="flex items-center gap-3">
                  <Flag className="w-5 h-5 text-red-500" />
                  <span className="text-sm text-gray-700">Content moderation</span>
                </div>
                <div className="flex items-center gap-3">
                  <MessageSquare className="w-5 h-5 text-purple-500" />
                  <span className="text-sm text-gray-700">Reply system</span>
                </div>
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-5 h-5 text-orange-500" />
                  <span className="text-sm text-gray-700">Smart sorting</span>
                </div>
              </div>
            </div>

            {/* Statistics */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Review Statistics</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-blue-500" />
                    <span className="text-sm text-gray-600">Total Reviews</span>
                  </div>
                  <span className="font-semibold text-gray-900">
                    {currentStats.totalReviews.toLocaleString()}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm text-gray-600">5-Star Reviews</span>
                  </div>
                  <span className="font-semibold text-gray-900">
                    {Math.round((currentStats.distribution[5] / currentStats.totalReviews) * 100)}%
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-gray-600">Positive Reviews</span>
                  </div>
                  <span className="font-semibold text-gray-900">
                    {Math.round(((currentStats.distribution[4] + currentStats.distribution[5]) / currentStats.totalReviews) * 100)}%
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Camera className="w-4 h-4 text-purple-500" />
                    <span className="text-sm text-gray-600">With Photos</span>
                  </div>
                  <span className="font-semibold text-gray-900">42%</span>
                </div>
              </div>
            </div>

            {/* Demo Actions */}
            <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
              <h3 className="font-semibold text-blue-900 mb-3">Try the Full System</h3>
              <p className="text-sm text-blue-800 mb-4">
                Experience the complete review system with interactive features, photo uploads, and moderation tools.
              </p>
              <a
                href="/reviews?type=hotel&id=hotel_001&name=The%20Taj%20Mahal%20Palace%20Mumbai"
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm"
              >
                <MessageSquare className="w-4 h-4" />
                Open Review System
              </a>
            </div>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="mt-12 bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Complete Review & Rating Features
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Star className="w-6 h-6 text-yellow-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Star Ratings</h3>
              <p className="text-sm text-gray-600">
                1-5 star rating system with detailed breakdown and visual indicators
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Camera className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Photo Reviews</h3>
              <p className="text-sm text-gray-600">
                Upload multiple photos with reviews to help other travelers
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <ThumbsUp className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Helpful Voting</h3>
              <p className="text-sm text-gray-600">
                Community-driven helpful/not helpful voting system
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Flag className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Content Moderation</h3>
              <p className="text-sm text-gray-600">
                Flag inappropriate content with detailed reporting system
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <MessageSquare className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Reply System</h3>
              <p className="text-sm text-gray-600">
                Hotels and airlines can respond to reviews with official replies
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Smart Sorting</h3>
              <p className="text-sm text-gray-600">
                Sort by newest, most helpful, rating, and advanced filters
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewsDemo;