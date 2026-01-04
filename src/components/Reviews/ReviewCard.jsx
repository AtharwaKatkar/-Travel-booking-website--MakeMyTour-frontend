import React, { useState } from 'react';
import { 
  Star, 
  ThumbsUp, 
  ThumbsDown, 
  Flag, 
  Reply, 
  MoreHorizontal,
  Calendar,
  CheckCircle,
  Image as ImageIcon
} from 'lucide-react';

const ReviewCard = ({ 
  review, 
  onVote, 
  onReply, 
  onFlag, 
  currentUserId, 
  showReplyForm = false,
  onToggleReplyForm 
}) => {
  const [showFullContent, setShowFullContent] = useState(false);
  const [showPhotos, setShowPhotos] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [submittingReply, setSubmittingReply] = useState(false);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const renderStars = (rating) => {
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

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!replyContent.trim()) return;

    setSubmittingReply(true);
    try {
      await onReply(review.id, {
        userId: currentUserId,
        userName: 'Current User', // In real app, get from user context
        content: replyContent.trim(),
        isOfficial: false
      });
      setReplyContent('');
      onToggleReplyForm(false);
    } catch (error) {
      console.error('Failed to submit reply:', error);
    } finally {
      setSubmittingReply(false);
    }
  };

  const truncatedContent = review.content.length > 300 
    ? review.content.substring(0, 300) + '...' 
    : review.content;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-blue-600 font-semibold">
              {review.userName.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-gray-900">{review.userName}</h4>
              {review.verified && (
                <CheckCircle className="w-4 h-4 text-green-500" title="Verified booking" />
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="w-3 h-3" />
              <span>{formatDate(review.createdAt)}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            {renderStars(review.rating)}
          </div>
          <button className="p-1 text-gray-400 hover:text-gray-600">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Review Title */}
      {review.title && (
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {review.title}
        </h3>
      )}

      {/* Review Content */}
      <div className="mb-4">
        <p className="text-gray-700 leading-relaxed">
          {showFullContent ? review.content : truncatedContent}
        </p>
        {review.content.length > 300 && (
          <button
            onClick={() => setShowFullContent(!showFullContent)}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium mt-1"
          >
            {showFullContent ? 'Show less' : 'Read more'}
          </button>
        )}
      </div>

      {/* Photos */}
      {review.photos && review.photos.length > 0 && (
        <div className="mb-4">
          <button
            onClick={() => setShowPhotos(!showPhotos)}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium mb-2"
          >
            <ImageIcon className="w-4 h-4" />
            <span>{review.photos.length} photo{review.photos.length > 1 ? 's' : ''}</span>
          </button>
          
          {showPhotos && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {review.photos.map((photo, index) => (
                <div key={index} className="aspect-video bg-gray-100 rounded-md overflow-hidden">
                  <img
                    src={photo}
                    alt={`Review photo ${index + 1}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tags */}
      {review.tags && review.tags.length > 0 && (
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
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center gap-4">
          <button
            onClick={() => onVote(review.id, 'helpful')}
            className="flex items-center gap-1 text-gray-600 hover:text-green-600 transition-colors"
          >
            <ThumbsUp className="w-4 h-4" />
            <span className="text-sm">{review.helpful}</span>
          </button>
          
          <button
            onClick={() => onVote(review.id, 'not-helpful')}
            className="flex items-center gap-1 text-gray-600 hover:text-red-600 transition-colors"
          >
            <ThumbsDown className="w-4 h-4" />
            <span className="text-sm">{review.notHelpful}</span>
          </button>
          
          <button
            onClick={() => onToggleReplyForm(!showReplyForm)}
            className="flex items-center gap-1 text-gray-600 hover:text-blue-600 transition-colors"
          >
            <Reply className="w-4 h-4" />
            <span className="text-sm">Reply</span>
          </button>
        </div>
        
        <button
          onClick={() => onFlag(review.id)}
          className="flex items-center gap-1 text-gray-400 hover:text-red-500 transition-colors"
        >
          <Flag className="w-4 h-4" />
          <span className="text-sm">Flag</span>
        </button>
      </div>

      {/* Reply Form */}
      {showReplyForm && (
        <form onSubmit={handleReplySubmit} className="mt-4 pt-4 border-t border-gray-100">
          <textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder="Write a reply..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            rows={3}
          />
          <div className="flex items-center justify-end gap-2 mt-2">
            <button
              type="button"
              onClick={() => onToggleReplyForm(false)}
              className="px-3 py-1 text-gray-600 hover:text-gray-800 text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!replyContent.trim() || submittingReply}
              className="px-4 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submittingReply ? 'Posting...' : 'Post Reply'}
            </button>
          </div>
        </form>
      )}

      {/* Replies */}
      {review.replies && review.replies.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
          {review.replies.map((reply) => (
            <div key={reply.id} className="flex gap-3">
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-gray-600 text-sm font-medium">
                  {reply.userName.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-gray-900 text-sm">
                    {reply.userName}
                  </span>
                  {reply.isOfficial && (
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                      Official
                    </span>
                  )}
                  <span className="text-gray-500 text-xs">
                    {formatDate(reply.createdAt)}
                  </span>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {reply.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewCard;