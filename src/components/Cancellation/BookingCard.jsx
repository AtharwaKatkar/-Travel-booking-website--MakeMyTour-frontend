import React, { useState } from 'react';
import { 
  Plane, 
  Building, 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  CreditCard,
  AlertCircle,
  CheckCircle,
  XCircle,
  MoreHorizontal,
  Eye,
  X as XIcon,
  Edit,
  RefreshCw
} from 'lucide-react';

const BookingCard = ({ 
  booking, 
  onViewDetails, 
  onCancel, 
  onModify,
  onTrackRefund 
}) => {
  const [showDetails, setShowDetails] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'cancelled':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'completed':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'pending':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-4 h-4" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
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

  const isUpcoming = () => {
    const travelDate = new Date(booking.travelDate || booking.checkIn);
    return travelDate > new Date();
  };

  const canCancelOrModify = () => {
    return booking.status === 'confirmed' && isUpcoming();
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              {booking.type === 'flight' ? (
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Plane className="w-6 h-6 text-blue-600" />
                </div>
              ) : (
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Building className="w-6 h-6 text-green-600" />
                </div>
              )}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h3 className="text-lg font-semibold text-gray-900">
                  {booking.type === 'flight' 
                    ? `${booking.flight.flightNumber} - ${booking.flight.airline}`
                    : booking.hotel.name
                  }
                </h3>
                <div className={`px-3 py-1 rounded-full border text-sm font-medium flex items-center space-x-1 ${getStatusColor(booking.status)}`}>
                  {getStatusIcon(booking.status)}
                  <span className="capitalize">{booking.status}</span>
                </div>
              </div>
              
              <div className="text-sm text-gray-600 space-y-1">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>
                      {booking.type === 'flight' 
                        ? booking.flight.route
                        : booking.hotel.location
                      }
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>
                      {booking.type === 'flight' 
                        ? formatDate(booking.travelDate)
                        : `${formatDate(booking.checkIn)} - ${formatDate(booking.checkOut)}`
                      }
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-1" />
                    <span>
                      {booking.type === 'flight' 
                        ? booking.passenger.name
                        : booking.guest.name
                      }
                    </span>
                  </div>
                  <div className="flex items-center">
                    <CreditCard className="w-4 h-4 mr-1" />
                    <span>₹{booking.pricing.totalPaid.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100"
              title="View details"
            >
              <Eye className="w-4 h-4" />
            </button>
            
            <div className="relative">
              <button className="p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Details */}
      {booking.type === 'flight' ? (
        <div className="p-6 bg-gray-50">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Departure:</span>
              <div className="font-medium text-gray-900">
                {formatTime(booking.flight.departure)}
              </div>
            </div>
            <div>
              <span className="text-gray-600">Arrival:</span>
              <div className="font-medium text-gray-900">
                {formatTime(booking.flight.arrival)}
              </div>
            </div>
            <div>
              <span className="text-gray-600">Class:</span>
              <div className="font-medium text-gray-900 capitalize">
                {booking.flight.class}
              </div>
            </div>
            <div>
              <span className="text-gray-600">Seat:</span>
              <div className="font-medium text-gray-900">
                {booking.flight.seat}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-6 bg-gray-50">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Check-in:</span>
              <div className="font-medium text-gray-900">
                {formatDateTime(booking.checkIn)}
              </div>
            </div>
            <div>
              <span className="text-gray-600">Check-out:</span>
              <div className="font-medium text-gray-900">
                {formatDateTime(booking.checkOut)}
              </div>
            </div>
            <div>
              <span className="text-gray-600">Room:</span>
              <div className="font-medium text-gray-900">
                {booking.hotel.roomType}
              </div>
            </div>
            <div>
              <span className="text-gray-600">Nights:</span>
              <div className="font-medium text-gray-900">
                {booking.hotel.nights}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Expanded Details */}
      {showDetails && (
        <div className="p-6 border-t border-gray-100 bg-white">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Booking Information */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Booking Information</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Booking Reference:</span>
                  <span className="font-medium text-gray-900">{booking.bookingReference}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Booking Date:</span>
                  <span className="font-medium text-gray-900">{formatDate(booking.bookingDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Contact:</span>
                  <span className="font-medium text-gray-900">
                    {booking.type === 'flight' ? booking.passenger.email : booking.guest.email}
                  </span>
                </div>
              </div>
            </div>

            {/* Pricing Breakdown */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Pricing Breakdown</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    {booking.type === 'flight' ? 'Base Price:' : 'Room Rate:'}
                  </span>
                  <span className="font-medium text-gray-900">
                    ₹{booking.pricing.basePrice || booking.pricing.roomRate}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Taxes:</span>
                  <span className="font-medium text-gray-900">₹{booking.pricing.taxes}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Fees:</span>
                  <span className="font-medium text-gray-900">₹{booking.pricing.fees}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-200">
                  <span className="font-semibold text-gray-900">Total Paid:</span>
                  <span className="font-bold text-gray-900">₹{booking.pricing.totalPaid.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Cancellation Information */}
          {booking.status === 'cancelled' && booking.cancellation && (
            <div className="mt-6 p-4 bg-red-50 rounded-lg border border-red-200">
              <h4 className="font-semibold text-red-900 mb-3">Cancellation Details</h4>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-red-700">Cancelled On:</span>
                      <span className="font-medium text-red-900">
                        {formatDateTime(booking.cancellation.requestedAt)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-red-700">Refund Status:</span>
                      <span className="font-medium text-red-900 capitalize">
                        {booking.cancellation.refundStatus}
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-red-700">Refund Amount:</span>
                      <span className="font-medium text-red-900">
                        ₹{booking.cancellation.refundAmount.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-red-700">Reference:</span>
                      <span className="font-medium text-red-900">
                        {booking.cancellation.refundReference}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              {booking.cancellation.refundStatus !== 'processed' && (
                <div className="mt-3">
                  <button
                    onClick={() => onTrackRefund(booking.cancellation.refundReference)}
                    className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center"
                  >
                    <RefreshCw className="w-4 h-4 mr-1" />
                    Track Refund Status
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      {canCancelOrModify() && (
        <div className="p-6 border-t border-gray-100 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {booking.canCancel && (
                <span>Cancellation available • </span>
              )}
              {booking.canModify && (
                <span>Modification available</span>
              )}
            </div>
            
            <div className="flex items-center space-x-3">
              {booking.canModify && (
                <button
                  onClick={() => onModify(booking)}
                  className="flex items-center px-4 py-2 text-blue-600 border border-blue-300 rounded-md hover:bg-blue-50 transition-colors"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Modify
                </button>
              )}
              
              {booking.canCancel && (
                <button
                  onClick={() => onCancel(booking)}
                  className="flex items-center px-4 py-2 text-red-600 border border-red-300 rounded-md hover:bg-red-50 transition-colors"
                >
                  <XIcon className="w-4 h-4 mr-2" />
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingCard;