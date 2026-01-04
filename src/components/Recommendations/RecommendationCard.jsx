import React, { useState } from 'react';
import { Heart, Star, MapPin, Clock, Info, ThumbsUp, ThumbsDown, Bookmark, Share2 } from 'lucide-react';

const RecommendationCard = ({ 
  recommendation, 
  onFeedback, 
  onInteraction,
  showReasons = true 
}) => {
  const [showReasonTooltip, setShowReasonTooltip] = useState(false);
  const [feedbackGiven, setFeedbackGiven] = useState(false);

  const handleFeedback = async (feedbackType) => {
    try {
      await onFeedback({
        recommendationId: recommendation.id,
        userId: recommendation.userId,
        feedbackType
      });
      setFeedbackGiven(true);
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  };

  const handleInteraction = (interactionType) => {
    onInteraction({
      userId: recommendation.userId,
      itemType: recommendation.itemType,
      itemId: recommendation.itemId,
      interactionType,
      metadata: {
        destination: recommendation.metadata?.destination,
        price: recommendation.price,
        rating: recommendation.rating,
        features: recommendation.metadata?.features || []
      }
    });
  };

  const getDiscountPercentage = () => {
    if (!recommendation.originalPrice) return null;
    return Math.round(((recommendation.originalPrice - recommendation.price) / recommendation.originalPrice) * 100);
  };

  const getPrimaryReason = () => {
    return recommendation.reasons?.[0] || null;
  };

  const getItemTypeIcon = () => {
    switch (recommendation.itemType) {
      case 'hotel': return '🏨';
      case 'flight': return '✈️';
      case 'destination': return '🏝️';
      case 'package': return '📦';
      default: return '🎯';
    }
  };

  const getCategoryColor = () => {
    switch (recommendation.category) {
      case 'personalized': return 'bg-blue-100 text-blue-800';
      case 'trending': return 'bg-red-100 text-red-800';
      case 'deals': return 'bg-green-100 text-green-800';
      case 'seasonal': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const primaryReason = getPrimaryReason();
  const discountPercentage = getDiscountPercentage();

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={recommendation.imageUrl || '/images/placeholder.jpg'}
          alt={recommendation.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onClick={() => handleInteraction('view')}
        />
        
        {/* Category Badge */}
        <div className={`absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor()}`}>
          {recommendation.category}
        </div>
        
        {/* Item Type Badge */}
        <div className="absolute top-3 right-3 bg-white bg-opacity-90 px-2 py-1 rounded-full text-sm">
          {getItemTypeIcon()} {recommendation.itemType}
        </div>
        
        {/* Discount Badge */}
        {discountPercentage && (
          <div className="absolute bottom-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-sm font-bold">
            {discountPercentage}% OFF
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-4">
        {/* Title and Location */}
        <div className="mb-2">
          <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1">
            {recommendation.title}
          </h3>
          <div className="flex items-center text-gray-600 text-sm">
            <MapPin className="w-4 h-4 mr-1" />
            <span>{recommendation.location}</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {recommendation.description}
        </p>

        {/* Rating and Reviews */}
        <div className="flex items-center mb-3">
          <div className="flex items-center">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="ml-1 text-sm font-medium">{recommendation.rating}</span>
          </div>
          <span className="text-gray-500 text-sm ml-2">
            ({recommendation.reviewCount.toLocaleString()} reviews)
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            {recommendation.originalPrice && (
              <span className="text-gray-400 line-through text-sm mr-2">
                ₹{recommendation.originalPrice.toLocaleString()}
              </span>
            )}
            <span className="text-2xl font-bold text-blue-600">
              ₹{recommendation.price.toLocaleString()}
            </span>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">Score</div>
            <div className="text-lg font-semibold text-green-600">
              {Math.round(recommendation.score)}
            </div>
          </div>
        </div>

        {/* Highlights */}
        <div className="mb-3">
          <div className="flex flex-wrap gap-1">
            {recommendation.highlights.slice(0, 3).map((highlight, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
              >
                {highlight}
              </span>
            ))}
            {recommendation.highlights.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                +{recommendation.highlights.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Recommendation Reason */}
        {showReasons && primaryReason && (
          <div className="mb-3 p-2 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Info className="w-4 h-4 text-blue-600 mr-2" />
                <span className="text-sm text-blue-800 font-medium">
                  Why recommended?
                </span>
              </div>
              <button
                className="text-blue-600 hover:text-blue-800"
                onMouseEnter={() => setShowReasonTooltip(true)}
                onMouseLeave={() => setShowReasonTooltip(false)}
              >
                <Info className="w-4 h-4" />
              </button>
            </div>
            <p className="text-sm text-blue-700 mt-1">
              {primaryReason.description}
            </p>
            
            {/* Detailed Reason Tooltip */}
            {showReasonTooltip && (
              <div className="absolute z-10 mt-2 p-3 bg-white border border-gray-200 rounded-lg shadow-lg max-w-xs">
                <div className="text-sm">
                  <div className="font-medium mb-1">Confidence: {Math.round(primaryReason.confidence * 100)}%</div>
                  {primaryReason.details.matchedPreferences && (
                    <div>
                      <span className="font-medium">Matched preferences:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {primaryReason.details.matchedPreferences.map((pref, index) => (
                          <span key={index} className="px-1 py-0.5 bg-blue-100 text-blue-800 text-xs rounded">
                            {pref}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {primaryReason.details.similarUsers && (
                    <div className="mt-1">
                      <span className="font-medium">Similar users:</span> {primaryReason.details.similarUsers}
                    </div>
                  )}
                  {primaryReason.details.priceAdvantage && (
                    <div className="mt-1">
                      <span className="font-medium">Savings:</span> ₹{primaryReason.details.priceAdvantage.toLocaleString()}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {!feedbackGiven ? (
              <>
                <button
                  onClick={() => handleFeedback('like')}
                  className="flex items-center px-3 py-1 text-sm text-green-600 hover:bg-green-50 rounded-full transition-colors"
                >
                  <ThumbsUp className="w-4 h-4 mr-1" />
                  Like
                </button>
                <button
                  onClick={() => handleFeedback('dislike')}
                  className="flex items-center px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-full transition-colors"
                >
                  <ThumbsDown className="w-4 h-4 mr-1" />
                  Pass
                </button>
              </>
            ) : (
              <span className="text-sm text-green-600 font-medium">Thanks for your feedback!</span>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleInteraction('save')}
              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
            >
              <Bookmark className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleInteraction('share')}
              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Book Now Button */}
        <button
          onClick={() => {
            handleInteraction('book');
            handleFeedback('booked');
          }}
          className="w-full mt-3 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Book Now
        </button>
      </div>
    </div>
  );
};

export default RecommendationCard;