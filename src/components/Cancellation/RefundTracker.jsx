import { useState, useEffect } from 'react';
import { 
  Search, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  CreditCard,
  Calendar,
  RefreshCw,
  ExternalLink,
  Download,
  Mail
} from 'lucide-react';
import { trackRefundStatus } from '../../api/cancellation';

const RefundTracker = ({ refundReference: initialReference, onClose }) => {
  const [refundReference, setRefundReference] = useState(initialReference || '');
  const [refundData, setRefundData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialReference) {
      handleTrackRefund();
    }
  }, [initialReference]);

  const handleTrackRefund = async () => {
    if (!refundReference.trim()) {
      setError('Please enter a refund reference number');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const response = await trackRefundStatus(refundReference.trim());
      setRefundData(response.data);
    } catch (err) {
      setError(err.message || 'Failed to track refund status');
      setRefundData(null);
    } finally {
      setLoading(false);
    }
  };

  const getStageStatus = (stage) => {
    switch (stage.status) {
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'current':
        return 'text-blue-600 bg-blue-100';
      case 'pending':
        return 'text-gray-400 bg-gray-100';
      default:
        return 'text-gray-400 bg-gray-100';
    }
  };

  const getStageIcon = (stage) => {
    switch (stage.status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'current':
        return <Clock className="w-5 h-5 text-blue-600" />;
      case 'pending':
        return <AlertCircle className="w-5 h-5 text-gray-400" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-400" />;
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'processed':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'processing':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'failed':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Track Refund Status</h2>
              <p className="text-gray-600 mt-1">
                Enter your refund reference number to track the status of your refund
              </p>
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Search Form */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex space-x-4">
            <div className="flex-1">
              <label htmlFor="refundReference" className="block text-sm font-medium text-gray-700 mb-2">
                Refund Reference Number
              </label>
              <input
                type="text"
                id="refundReference"
                value={refundReference}
                onChange={(e) => setRefundReference(e.target.value)}
                placeholder="e.g., REF-AI101-2026-001"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                onKeyPress={(e) => e.key === 'Enter' && handleTrackRefund()}
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={handleTrackRefund}
                disabled={loading || !refundReference.trim()}
                className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                    Tracking...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4 mr-2" />
                    Track Refund
                  </>
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-red-600 mr-3" />
                <span className="text-red-800">{error}</span>
              </div>
            </div>
          )}
        </div>

        {/* Refund Details */}
        {refundData && (
          <div className="p-6">
            {/* Refund Summary */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Refund Summary</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-600">Refund Amount</span>
                    <CreditCard className="w-5 h-5 text-gray-400" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    ₹{refundData.refundAmount.toLocaleString()}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-600">Status</span>
                    <div className={`px-3 py-1 rounded-full border text-sm font-medium capitalize ${getStatusColor(refundData.currentStatus)}`}>
                      {refundData.currentStatus}
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    {refundData.currentStatus === 'processed' ? 'Completed' : 'In Progress'}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-600">Expected Date</span>
                    <Calendar className="w-5 h-5 text-gray-400" />
                  </div>
                  <div className="text-sm font-medium text-gray-900">
                    {formatDateTime(refundData.expectedDate)}
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Timeline */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Refund Progress</h3>
              <div className="space-y-6">
                {refundData.stages.map((stage, index) => (
                  <div key={stage.stage} className="flex items-start">
                    <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${getStageStatus(stage)}`}>
                      {getStageIcon(stage)}
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-semibold text-gray-900">{stage.title}</h4>
                        {stage.completedAt && (
                          <span className="text-xs text-gray-500">
                            {formatDateTime(stage.completedAt)}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{stage.description}</p>
                      {index < refundData.stages.length - 1 && (
                        <div className="w-px h-6 bg-gray-200 ml-5 mt-2"></div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Information */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-3">Refund Details</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-blue-700">Booking Reference:</span>
                    <span className="font-medium text-blue-900">{refundData.bookingReference}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Refund Method:</span>
                    <span className="font-medium text-blue-900 capitalize">
                      {refundData.refundMethod.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Reference Number:</span>
                    <span className="font-medium text-blue-900">{refundData.refundReference}</span>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 rounded-lg p-4">
                <h4 className="font-semibold text-green-900 mb-3">Need Help?</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center text-green-800">
                    <Mail className="w-4 h-4 mr-2" />
                    <span>Email: support@makemytrip.com</span>
                  </div>
                  <div className="flex items-center text-green-800">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    <span>Call: 1800-123-4567</span>
                  </div>
                  <button className="flex items-center text-green-600 hover:text-green-700 font-medium">
                    <Download className="w-4 h-4 mr-2" />
                    Download Refund Receipt
                  </button>
                </div>
              </div>
            </div>

            {/* Timeline History */}
            {refundData.timeline && refundData.timeline.length > 0 && (
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Timeline History</h3>
                <div className="space-y-3">
                  {refundData.timeline.map((event, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium text-gray-900">{event.title}</h4>
                          <span className="text-xs text-gray-500">
                            {formatDateTime(event.completedAt)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RefundTracker;