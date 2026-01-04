import React, { useState, useEffect } from 'react';
import { 
  Star, 
  Plus, 
  ArrowLeft, 
  Filter,
  MessageSquare,
  TrendingUp
} from 'lucide-react';
import ReviewSummary from '../components/Reviews/ReviewSummary';
import ReviewFilters from '../components/Reviews/ReviewFilters';
import ReviewCard from '../components/Reviews/ReviewCard';
import ReviewForm from '../components/Reviews/ReviewForm';
import FlagReviewModal from '../components/Reviews/FlagReviewModal';
import {
  getReviews,
  submitReview,
  voteOnReview,
  replyToReview,
  flagReview
} from '../api/reviews';

const ReviewsPage = ({ 
  itemType = 'hotel', 
  itemId = 'hotel_001', 
  itemName = 'Sample Hotel',
  onBack 
}) => {
  const [reviews, setReviews] = useState([]);
  const [statistics, setStatistics] = useState({
    averageRating: 0,
    totalReviews: 0,
    ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    hasNext: false,
    hasPrev: false
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showFlagModal, setShowFlagModal] = useState(false);
  const [flagReviewId, setFlagReviewId] = useState(null);
  const [activeReplyForm, setActiveReplyForm] = useState(null);
  const [sortBy, setSortBy] = useState('newest');
  const [filters, setFilters] = useState({});
  const [searchQuery, setSearchQuery] = useState('');

  const currentUserId = 'current_user'; // In real app, get from auth context

  useEffect(() => {
    loadReviews();
  }, [itemType, itemId, sortBy, filters, searchQuery]);

  const loadReviews = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await getReviews(itemType, itemId, sortBy, page, 10);
      
      setReviews(response.data.reviews);
      setStatistics(response.data.statistics);
      setPagination(response.data.pagination);
    } catch (err) {
      setError('Failed to load reviews. Please try again.');
      console.error('Error loading reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (reviewData) => {
    try {
      await submitReview(reviewData);
      setShowReviewForm(false);
      loadReviews(); // Reload to show new review
    } catch (error) {
      console.error('Failed to submit review:', error);
      throw error;
    }
  };

  const handleVoteOnReview = async (reviewId, voteType) => {
    try {
      const response = await voteOnReview(reviewId, voteType, currentUserId);
      
      // Update the review in the local state
      setReviews(prevReviews =>
        prevReviews.map(review =>
          review.id === reviewId
            ? {
                ...review,
                helpful: response.data.helpful,
                notHelpful: response.data.notHelpful
              }
            : review
        )
      );
    } catch (error) {
      console.error('Failed to vote on review:', error);
    }
  };

  const handleReplyToReview = async (reviewId, replyData) => {
    try {
      const response = await replyToReview(reviewId, replyData);
      
      // Update the review with the new reply
      setReviews(prevReviews =>
        prevReviews.map(review =>
          review.id === reviewId
            ? {
                ...review,
                replies: [...review.replies, response.data]
              }
            : review
        )
      );
      
      setActiveReplyForm(null);
    } catch (error) {
      console.error('Failed to reply to review:', error);
      throw error;
    }
  };

  const handleFlagReview = async (reviewId, reason) => {
    try {
      await flagReview(reviewId, reason, currentUserId);
      setShowFlagModal(false);
      setFlagReviewId(null);
    } catch (error) {
      console.error('Failed to flag review:', error);
      throw error;
    }
  };

  const handleSortChange = (newSort) => {
    setSortBy(newSort);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handlePageChange = (page) => {
    loadReviews(page);
  };

  const openFlagModal = (reviewId) => {
    setFlagReviewId(reviewId);
    setShowFlagModal(true);
  };

  if (showReviewForm) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <button
              onClick={() => setShowReviewForm(false)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Reviews</span>
            </button>
          </div>
          
          <ReviewForm
            itemType={itemType}
            itemId={itemId}
            itemName={itemName}
            onSubmit={handleSubmitReview}
            onCancel={() => setShowReviewForm(false)}
            loading={loading}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            {onBack && (
              <button
                onClick={onBack}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            )}
            <h1 className="text-3xl font-bold text-gray-900">Reviews</h1>
            <p className="text-gray-600 mt-1">{itemName}</p>
          </div>
          
          <button
            onClick={() => setShowReviewForm(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Write Review</span>
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Filters */}
            <ReviewFilters
              onSortChange={handleSortChange}
              onFilterChange={handleFilterChange}
              onSearch={handleSearch}
              totalReviews={statistics.totalReviews}
              currentSort={sortBy}
              currentFilters={filters}
            />

            {/* Reviews List */}
            {loading ? (
              <div className="space-y-6">
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/6"></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <p className="text-red-800">{error}</p>
                <button
                  onClick={() => loadReviews()}
                  className="mt-2 text-red-600 hover:text-red-700 underline"
                >
                  Try again
                </button>
              </div>
            ) : reviews.length > 0 ? (
              <>
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <ReviewCard
                      key={review.id}
                      review={review}
                      onVote={handleVoteOnReview}
                      onReply={handleReplyToReview}
                      onFlag={openFlagModal}
                      currentUserId={currentUserId}
                      showReplyForm={activeReplyForm === review.id}
                      onToggleReplyForm={(show) => setActiveReplyForm(show ? review.id : null)}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-8">
                    <button
                      onClick={() => handlePageChange(pagination.currentPage - 1)}
                      disabled={!pagination.hasPrev}
                      className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    
                    <div className="flex items-center gap-1">
                      {[...Array(pagination.totalPages)].map((_, index) => {
                        const page = index + 1;
                        return (
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`px-3 py-2 text-sm rounded-md ${
                              page === pagination.currentPage
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-600 hover:bg-gray-100'
                            }`}
                          >
                            {page}
                          </button>
                        );
                      })}
                    </div>
                    
                    <button
                      onClick={() => handlePageChange(pagination.currentPage + 1)}
                      disabled={!pagination.hasNext}
                      className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No reviews found
                </h3>
                <p className="text-gray-600 mb-4">
                  {searchQuery || Object.keys(filters).length > 0
                    ? 'Try adjusting your search or filters'
                    : 'Be the first to share your experience'
                  }
                </p>
                <button
                  onClick={() => setShowReviewForm(true)}
                  className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Write First Review
                </button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Review Summary */}
            <ReviewSummary
              statistics={statistics}
              itemName={itemName}
              itemType={itemType}
            />

            {/* Quick Stats */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Review Insights</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Most mentioned</span>
                  <span className="text-sm font-medium text-gray-900">Service</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Recent trend</span>
                  <div className="flex items-center gap-1 text-green-600">
                    <TrendingUp className="w-3 h-3" />
                    <span className="text-sm font-medium">Improving</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Response rate</span>
                  <span className="text-sm font-medium text-gray-900">85%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Flag Review Modal */}
      <FlagReviewModal
        isOpen={showFlagModal}
        onClose={() => {
          setShowFlagModal(false);
          setFlagReviewId(null);
        }}
        onSubmit={handleFlagReview}
        reviewId={flagReviewId}
      />
    </div>
  );
};

export default ReviewsPage;