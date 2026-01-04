import React from 'react';
import { Star, TrendingUp, Users, Award } from 'lucide-react';

const ReviewSummary = ({ statistics, itemName, itemType }) => {
  const { averageRating, totalReviews, ratingDistribution } = statistics;

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        className={`w-5 h-5 ${
          index < Math.floor(rating) 
            ? 'text-yellow-400 fill-current' 
            : index < rating 
            ? 'text-yellow-400 fill-current opacity-50'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  const getRatingLabel = (rating) => {
    if (rating >= 4.5) return { label: 'Excellent', color: 'text-green-600' };
    if (rating >= 4.0) return { label: 'Very Good', color: 'text-blue-600' };
    if (rating >= 3.5) return { label: 'Good', color: 'text-yellow-600' };
    if (rating >= 3.0) return { label: 'Average', color: 'text-orange-600' };
    return { label: 'Poor', color: 'text-red-600' };
  };

  const ratingInfo = getRatingLabel(averageRating);

  const getBarWidth = (count) => {
    return totalReviews > 0 ? (count / totalReviews) * 100 : 0;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Customer Reviews</h2>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Users className="w-4 h-4" />
          <span>{totalReviews} review{totalReviews !== 1 ? 's' : ''}</span>
        </div>
      </div>

      {totalReviews > 0 ? (
        <div className="grid md:grid-cols-2 gap-8">
          {/* Overall Rating */}
          <div className="text-center">
            <div className="mb-4">
              <div className="text-4xl font-bold text-gray-900 mb-2">
                {averageRating.toFixed(1)}
              </div>
              <div className="flex items-center justify-center gap-1 mb-2">
                {renderStars(averageRating)}
              </div>
              <div className={`text-lg font-semibold ${ratingInfo.color}`}>
                {ratingInfo.label}
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Based on {totalReviews} review{totalReviews !== 1 ? 's' : ''}
              </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-medium text-gray-900">
                    {Math.round((ratingDistribution[4] + ratingDistribution[5]) / totalReviews * 100)}%
                  </span>
                </div>
                <p className="text-xs text-gray-600">Positive</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Award className="w-4 h-4 text-blue-500" />
                  <span className="text-sm font-medium text-gray-900">
                    {ratingDistribution[5]}
                  </span>
                </div>
                <p className="text-xs text-gray-600">5-Star</p>
              </div>
            </div>
          </div>

          {/* Rating Distribution */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Rating Breakdown</h3>
            <div className="space-y-3">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center gap-3">
                  <div className="flex items-center gap-1 w-12">
                    <span className="text-sm font-medium text-gray-700">{rating}</span>
                    <Star className="w-3 h-3 text-yellow-400 fill-current" />
                  </div>
                  
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-400 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${getBarWidth(ratingDistribution[rating])}%` }}
                    ></div>
                  </div>
                  
                  <div className="w-8 text-right">
                    <span className="text-sm text-gray-600">
                      {ratingDistribution[rating]}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Percentage Summary */}
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Recommended: </span>
                  <span className="font-medium text-green-600">
                    {Math.round((ratingDistribution[4] + ratingDistribution[5]) / totalReviews * 100)}%
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Average: </span>
                  <span className="font-medium text-gray-900">
                    {averageRating.toFixed(1)}/5.0
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* No Reviews State */
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Star className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No reviews yet
          </h3>
          <p className="text-gray-600 mb-4">
            Be the first to share your experience with {itemName}
          </p>
          <div className="flex items-center justify-center gap-1 text-gray-400">
            {[...Array(5)].map((_, index) => (
              <Star key={index} className="w-6 h-6" />
            ))}
          </div>
        </div>
      )}

      {/* Review Guidelines */}
      <div className="mt-6 pt-6 border-t border-gray-100">
        <div className="bg-blue-50 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">Review Guidelines</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Share your honest experience</li>
            <li>• Be respectful and constructive</li>
            <li>• Focus on specific aspects of your {itemType}</li>
            <li>• Include photos to help other travelers</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ReviewSummary;