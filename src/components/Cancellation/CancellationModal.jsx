import React, { useState, useEffect } from 'react';
import { 
  X, 
  AlertTriangle, 
  Calculator, 
  CreditCard, 
  Clock,
  CheckCircle,
  Info,
  RefreshCw
} from 'lucide-react';

const CancellationModal = ({ 
  isOpen, 
  onClose, 
  booking, 
  onConfirm,
  cancellationReasons = []
}) => {
  const [step, setStep] = useState(1); // 1: Policy, 2: Reason, 3: Confirmation
  const [selectedReason, setSelectedReason] = useState('');
  const [comments, setComments] = useState('');
  const [refundCalculation, setRefundCalculation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [calculating, setCalculating] = useState(false);

  useEffect(() => {
    if (isOpen && booking) {
      calculateRefund();
    }
  }, [isOpen, booking]);

  const calculateRefund = async () => {
    try {
      setCalculating(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock calculation based on booking
      const now = new Date();
      const travelDate = new Date(booking.travelDate || booking.checkIn);
      const hoursUntilTravel = (travelDate - now) / (1000 * 60 * 60);
      
      let refundPercentage = 0;
      let cancellationFee = 0;
      
      if (booking.cancellationPolicy) {
        const applicableRule = booking.cancellationPolicy.rules.find(rule => {
          if (rule.period === "24h+" && hoursUntilTravel >= 24) return true;
          if (rule.period === "2-24h" && hoursUntilTravel >= 2 && hoursUntilTravel < 24) return true;
          if (rule.period === "48h+" && hoursUntilTravel >= 48) return true;
          if (rule.period === "24-48h" && hoursUntilTravel >= 24 && hoursUntilTravel < 48) return true;
          if (rule.period === "<2h" && hoursUntilTravel < 2) return true;
          if (rule.period === "<24h" && hoursUntilTravel < 24) return true;
          return false;
        }) || booking.cancellationPolicy.rules[booking.cancellationPolicy.rules.length - 1];
        
        refundPercentage = applicableRule.refundPercentage;
        cancellationFee = applicableRule.fee;
      }
      
      const refundAmount = Math.round((booking.pricing.totalPaid * refundPercentage) / 100);
      const netRefund = Math.max(0, refundAmount - cancellationFee);
      
      setRefundCalculation({
        totalPaid: booking.pricing.totalPaid,
        refundPercentage,
        refundAmount,
        cancellationFee,
        netRefund,
        hoursUntilTravel: Math.round(hoursUntilTravel),
        breakdown: {
          baseRefund: Math.round(((booking.pricing.basePrice || booking.pricing.roomRate) * refundPercentage) / 100),
          taxRefund: Math.round((booking.pricing.taxes * refundPercentage) / 100),
          feeRefund: Math.round((booking.pricing.fees * refundPercentage) / 100)
        }
      });
    } catch (error) {
      console.error('Failed to calculate refund:', error);
    } finally {
      setCalculating(false);
    }
  };

  const handleConfirm = async () => {
    if (!selectedReason) return;
    
    try {
      setLoading(true);
      await onConfirm({
        bookingId: booking.id,
        reason: selectedReason,
        comments: comments.trim(),
        refundCalculation
      });
      onClose();
    } catch (error) {
      console.error('Failed to cancel booking:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  if (!isOpen || !booking) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Cancel Booking</h2>
            <p className="text-gray-600 mt-1">
              {booking.bookingReference} • {booking.type === 'flight' ? booking.flight.airline : booking.hotel.name}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step 1: Cancellation Policy & Refund Calculation */}
        {step === 1 && (
          <div className="p-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Cancellation Policy & Refund Calculation</h3>
              
              {calculating ? (
                <div className="flex items-center justify-center py-8">
                  <RefreshCw className="w-6 h-6 animate-spin text-blue-600 mr-3" />
                  <span className="text-gray-600">Calculating your refund...</span>
                </div>
              ) : refundCalculation ? (
                <div className="space-y-4">
                  {/* Time Until Travel */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <Clock className="w-5 h-5 text-blue-600 mr-3" />
                      <div>
                        <div className="font-medium text-blue-900">
                          {refundCalculation.hoursUntilTravel} hours until {booking.type === 'flight' ? 'departure' : 'check-in'}
                        </div>
                        <div className="text-sm text-blue-700">
                          {booking.type === 'flight' 
                            ? formatDateTime(booking.travelDate)
                            : formatDateTime(booking.checkIn)
                          }
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Refund Calculation */}
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center mb-4">
                      <Calculator className="w-5 h-5 text-gray-600 mr-3" />
                      <h4 className="font-semibold text-gray-900">Refund Calculation</h4>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Paid:</span>
                        <span className="font-medium text-gray-900">
                          ₹{refundCalculation.totalPaid.toLocaleString()}
                        </span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-gray-600">Refund Percentage:</span>
                        <span className="font-medium text-gray-900">
                          {refundCalculation.refundPercentage}%
                        </span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-gray-600">Refund Amount:</span>
                        <span className="font-medium text-gray-900">
                          ₹{refundCalculation.refundAmount.toLocaleString()}
                        </span>
                      </div>
                      
                      {refundCalculation.cancellationFee > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Cancellation Fee:</span>
                          <span className="font-medium text-red-600">
                            -₹{refundCalculation.cancellationFee.toLocaleString()}
                          </span>
                        </div>
                      )}
                      
                      <div className="flex justify-between pt-3 border-t border-gray-200">
                        <span className="font-semibold text-gray-900">Net Refund:</span>
                        <span className="font-bold text-green-600 text-lg">
                          ₹{refundCalculation.netRefund.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Refund Breakdown */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-3">Refund Breakdown</h4>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Base Amount:</span>
                        <div className="font-medium text-gray-900">
                          ₹{refundCalculation.breakdown.baseRefund.toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-600">Taxes:</span>
                        <div className="font-medium text-gray-900">
                          ₹{refundCalculation.breakdown.taxRefund.toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-600">Fees:</span>
                        <div className="font-medium text-gray-900">
                          ₹{refundCalculation.breakdown.feeRefund.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Policy Information */}
                  {booking.cancellationPolicy && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex items-start">
                        <Info className="w-5 h-5 text-yellow-600 mr-3 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-yellow-900 mb-2">Cancellation Policy</h4>
                          <div className="space-y-1 text-sm text-yellow-800">
                            {booking.cancellationPolicy.rules.map((rule, index) => (
                              <div key={index}>
                                • {rule.description}: {rule.refundPercentage}% refund
                                {rule.fee > 0 && ` (₹${rule.fee} fee)`}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Warning */}
                  {refundCalculation.netRefund === 0 && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <div className="flex items-start">
                        <AlertTriangle className="w-5 h-5 text-red-600 mr-3 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-red-900 mb-1">No Refund Available</h4>
                          <p className="text-sm text-red-800">
                            Based on the cancellation policy and timing, no refund is available for this booking.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-4 text-red-600">
                  Failed to calculate refund. Please try again.
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => setStep(2)}
                disabled={calculating || !refundCalculation}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue Cancellation
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Cancellation Reason */}
        {step === 2 && (
          <div className="p-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Reason for Cancellation</h3>
              
              <div className="space-y-3 mb-4">
                {cancellationReasons.map((reason) => (
                  <label
                    key={reason.value}
                    className={`block p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedReason === reason.value
                        ? 'border-red-300 bg-red-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="cancellationReason"
                        value={reason.value}
                        checked={selectedReason === reason.value}
                        onChange={(e) => setSelectedReason(e.target.value)}
                        className="text-red-600 focus:ring-red-500"
                      />
                      <span className="ml-3 text-gray-900">{reason.label}</span>
                    </div>
                  </label>
                ))}
              </div>

              {/* Comments */}
              <div>
                <label htmlFor="comments" className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Comments (Optional)
                </label>
                <textarea
                  id="comments"
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder="Please provide any additional details about your cancellation..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none"
                  maxLength={500}
                />
                <div className="text-right text-xs text-gray-500 mt-1">
                  {comments.length}/500 characters
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setStep(1)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={!selectedReason}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Review Cancellation
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Final Confirmation */}
        {step === 3 && (
          <div className="p-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirm Cancellation</h3>
              
              {/* Summary */}
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <h4 className="font-medium text-gray-900 mb-3">Cancellation Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Booking:</span>
                    <span className="font-medium text-gray-900">{booking.bookingReference}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Reason:</span>
                    <span className="font-medium text-gray-900">
                      {cancellationReasons.find(r => r.value === selectedReason)?.label}
                    </span>
                  </div>
                  {refundCalculation && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Refund Amount:</span>
                      <span className="font-bold text-green-600">
                        ₹{refundCalculation.netRefund.toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Refund Information */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <div className="flex items-start">
                  <CreditCard className="w-5 h-5 text-blue-600 mr-3 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-900 mb-1">Refund Information</h4>
                    <div className="text-sm text-blue-800 space-y-1">
                      <p>• Refund will be processed to your original payment method</p>
                      <p>• Processing time: 5-7 business days</p>
                      <p>• You will receive email confirmation once processed</p>
                      <p>• Refund reference will be provided for tracking</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Warning */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start">
                  <AlertTriangle className="w-5 h-5 text-red-600 mr-3 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-red-900 mb-1">Important Notice</h4>
                    <p className="text-sm text-red-800">
                      This action cannot be undone. Once cancelled, you will need to make a new booking 
                      if you wish to travel. Current prices may differ from your original booking.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setStep(2)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Back
              </button>
              <button
                onClick={handleConfirm}
                disabled={loading}
                className="flex items-center px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                    Cancelling...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Confirm Cancellation
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CancellationModal;