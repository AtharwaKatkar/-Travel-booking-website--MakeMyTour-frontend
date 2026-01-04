import React, { useState } from 'react';
import { 
  Star, 
  Upload, 
  X, 
  Image as ImageIcon,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

const ReviewForm = ({ 
  itemType, 
  itemId, 
  itemName, 
  onSubmit, 
  onCancel, 
  loading = false 
}) => {
  const [formData, setFormData] = useState({
    rating: 0,
    title: '',
    content: '',
    tags: [],
    photos: []
  });
  const [errors, setErrors] = useState({});
  const [dragActive, setDragActive] = useState(false);

  const handleRatingClick = (rating) => {
    setFormData(prev => ({ ...prev, rating }));
    if (errors.rating) {
      setErrors(prev => ({ ...prev, rating: null }));
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleTagAdd = (tag) => {
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
    }
  };

  const handleTagRemove = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleFileUpload = (files) => {
    const validFiles = Array.from(files).filter(file => {
      const isImage = file.type.startsWith('image/');
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB limit
      return isImage && isValidSize;
    });

    if (validFiles.length > 0) {
      setFormData(prev => ({
        ...prev,
        photos: [...prev.photos, ...validFiles].slice(0, 5) // Max 5 photos
      }));
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  const removePhoto = (index) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.rating) {
      newErrors.rating = 'Please select a rating';
    }
    
    if (!formData.title.trim()) {
      newErrors.title = 'Please enter a title for your review';
    }
    
    if (!formData.content.trim()) {
      newErrors.content = 'Please write your review';
    } else if (formData.content.trim().length < 10) {
      newErrors.content = 'Review must be at least 10 characters long';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit({
        type: itemType,
        itemId,
        itemName,
        userId: 'current_user', // In real app, get from auth context
        userName: 'Current User', // In real app, get from auth context
        ...formData
      });
    } catch (error) {
      console.error('Failed to submit review:', error);
    }
  };

  const suggestedTags = {
    hotel: ['service', 'cleanliness', 'location', 'value', 'comfort', 'amenities', 'staff', 'food', 'wifi', 'pool'],
    flight: ['punctual', 'crew', 'comfort', 'food', 'entertainment', 'value', 'clean', 'smooth', 'delayed', 'efficient']
  };

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Write a Review</h2>
        <p className="text-gray-600">
          Share your experience with <span className="font-medium">{itemName}</span>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Overall Rating *
          </label>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => handleRatingClick(star)}
                className="p-1 hover:scale-110 transition-transform"
              >
                <Star
                  className={`w-8 h-8 ${
                    star <= formData.rating
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300 hover:text-yellow-200'
                  }`}
                />
              </button>
            ))}
            {formData.rating > 0 && (
              <span className="ml-2 text-sm text-gray-600">
                {formData.rating} out of 5 stars
              </span>
            )}
          </div>
          {errors.rating && (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.rating}
            </p>
          )}
        </div>

        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Review Title *
          </label>
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            placeholder="Summarize your experience in a few words"
            className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.title ? 'border-red-300' : 'border-gray-300'
            }`}
            maxLength={100}
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.title}
            </p>
          )}
        </div>

        {/* Content */}
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
            Your Review *
          </label>
          <textarea
            id="content"
            value={formData.content}
            onChange={(e) => handleInputChange('content', e.target.value)}
            placeholder="Tell others about your experience. What did you like or dislike?"
            rows={6}
            className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none ${
              errors.content ? 'border-red-300' : 'border-gray-300'
            }`}
            maxLength={2000}
          />
          <div className="flex justify-between items-center mt-1">
            {errors.content ? (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.content}
              </p>
            ) : (
              <p className="text-sm text-gray-500">
                Minimum 10 characters
              </p>
            )}
            <p className="text-sm text-gray-500">
              {formData.content.length}/2000
            </p>
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tags (Optional)
          </label>
          <div className="space-y-3">
            {/* Selected Tags */}
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleTagRemove(tag)}
                      className="hover:text-blue-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
            
            {/* Suggested Tags */}
            <div>
              <p className="text-xs text-gray-500 mb-2">Suggested tags:</p>
              <div className="flex flex-wrap gap-2">
                {suggestedTags[itemType]?.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleTagAdd(tag)}
                    disabled={formData.tags.includes(tag)}
                    className="px-2 py-1 text-xs border border-gray-300 rounded-full hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Photo Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Photos (Optional)
          </label>
          
          {/* Upload Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
              dragActive
                ? 'border-blue-400 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600 mb-2">
              Drag and drop photos here, or{' '}
              <label className="text-blue-600 hover:text-blue-700 cursor-pointer">
                browse
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e.target.files)}
                  className="hidden"
                />
              </label>
            </p>
            <p className="text-xs text-gray-500">
              Max 5 photos, 5MB each. JPG, PNG supported.
            </p>
          </div>

          {/* Photo Previews */}
          {formData.photos.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mt-3">
              {formData.photos.map((photo, index) => (
                <div key={index} className="relative group">
                  <div className="aspect-square bg-gray-100 rounded-md overflow-hidden">
                    <img
                      src={URL.createObjectURL(photo)}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removePhoto(index)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Submitting...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                Submit Review
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReviewForm;