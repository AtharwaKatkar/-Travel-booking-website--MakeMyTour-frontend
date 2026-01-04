import React, { useState } from 'react';
import { X, Flag, AlertTriangle, CheckCircle } from 'lucide-react';

const FlagReviewModal = ({ isOpen, onClose, onSubmit, reviewId }) => {
  const [selectedReason, setSelectedReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const flagReasons = [
    {
      id: 'inappropriate',
      label: 'Inappropriate Content',
      description: 'Contains offensive language, hate speech, or inappropriate material'
    },
    {
      id: 'fake',
      label: 'Fake Review',
      description: 'Appears to be fake, spam, or not based on actual experience'
    },
    {
      id: 'irrelevant',
      label: 'Irrelevant Content',
      description: 'Not related to the hotel/flight or contains irrelevant information'
    },
    {
      id: 'personal',
      label: 'Personal Information',
      description: 'Contains personal information that should not be shared publicly'
    },
    {
      id: 'duplicate',
      label: 'Duplicate Review',
      description: 'This review appears to be a duplicate of another review'
    },
    {
      id: 'promotional',
      label: 'Promotional Content',
      description: 'Contains promotional content or advertising'
    },
    {
      id: 'other',
      label: 'Other',
      description: 'Other reason not listed above'
    }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedReason) return;
    
    setSubmitting(true);
    
    try {
      const reason = selectedReason === 'other' ? customReason : 
        flagReasons.find(r => r.id === selectedReason)?.label;
      
      await onSubmit(reviewId, reason);
      setSubmitted(true);
      
      // Auto close after 2 seconds
      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch (error) {
      console.error('Failed to flag review:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setSelectedReason('');
    setCustomReason('');
    setSubmitting(false);
    setSubmitted(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Flag className="w-5 h-5 text-red-600" />
            <h2 className="text-xl font-bold text-gray-900">Flag Review</h2>
          </div>
          <button
            onClick={handleClose}
            className="p-2 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          /* Success State */
          <div className="p-6 text-center">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Thank you for your report
            </h3>
            <p className="text-gray-600 mb-4">
              We've received your flag and will review this content. Our moderation team will take appropriate action if needed.
            </p>
            <p className="text-sm text-gray-500">
              This window will close automatically...
            </p>
          </div>
        ) : (
          /* Flag Form */
          <form onSubmit={handleSubmit} className="p-6">
            <div className="mb-6">
              <p className="text-gray-600 mb-4">
                Help us maintain a safe and helpful community by reporting inappropriate content. 
                Please select the reason that best describes the issue with this review.
              </p>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mb-4">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-yellow-800">
                    <p className="font-medium mb-1">Before flagging:</p>
                    <p>Consider if this is just a negative opinion. Reviews expressing genuine dissatisfaction are valuable feedback, even if critical.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Reason Selection */}
            <div className="space-y-3 mb-6">
              {flagReasons.map((reason) => (
                <label
                  key={reason.id}
                  className={`block p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedReason === reason.id
                      ? 'border-red-300 bg-red-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      name="flagReason"
                      value={reason.id}
                      checked={selectedReason === reason.id}
                      onChange={(e) => setSelectedReason(e.target.value)}
                      className="mt-1 text-red-600 focus:ring-red-500"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 mb-1">
                        {reason.label}
                      </div>
                      <div className="text-sm text-gray-600">
                        {reason.description}
                      </div>
                    </div>
                  </div>
                </label>
              ))}
            </div>

            {/* Custom Reason Input */}
            {selectedReason === 'other' && (
              <div className="mb-6">
                <label htmlFor="customReason" className="block text-sm font-medium text-gray-700 mb-2">
                  Please specify the reason
                </label>
                <textarea
                  id="customReason"
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  placeholder="Describe the issue with this review..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none"
                  required={selectedReason === 'other'}
                />
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!selectedReason || (selectedReason === 'other' && !customReason.trim()) || submitting}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Flag className="w-4 h-4" />
                    Flag Review
                  </>
                )}
              </button>
            </div>

            {/* Disclaimer */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                False reports may result in restrictions on your account. 
                Our moderation team reviews all flagged content and takes appropriate action.
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default FlagReviewModal;