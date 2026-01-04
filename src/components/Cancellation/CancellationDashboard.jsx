import { useState, useEffect } from 'react';
import { 
  Search, 
  RefreshCw, 
  Calendar,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  Plus,
  Eye
} from 'lucide-react';
import BookingCard from './BookingCard';
import CancellationModal from './CancellationModal';
import RefundTracker from './RefundTracker';
import { 
  getUserBookings, 
  getCancellationReasons, 
  submitCancellationRequest,
  getRefundStatistics 
} from '../../api/cancellation';

const CancellationDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [cancellationReasons, setCancellationReasons] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filters
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals
  const [showCancellationModal, setShowCancellationModal] = useState(false);
  const [showRefundTracker, setShowRefundTracker] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [trackingReference, setTrackingReference] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [bookings, statusFilter, typeFilter, searchQuery]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [bookingsResponse, reasonsResponse, statsResponse] = await Promise.all([
        getUserBookings('user123'),
        getCancellationReasons(),
        getRefundStatistics('user123')
      ]);
      
      setBookings(bookingsResponse.data.bookings);
      setCancellationReasons(reasonsResponse.data);
      setStatistics(statsResponse.data);
    } catch (err) {
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...bookings];

    if (statusFilter !== 'all') {
      filtered = filtered.filter(booking => booking.status === statusFilter);
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(booking => booking.type === typeFilter);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(booking => 
        booking.bookingReference.toLowerCase().includes(query) ||
        (booking.type === 'flight' && 
          (booking.flight.flightNumber.toLowerCase().includes(query) ||
           booking.flight.airline.toLowerCase().includes(query) ||
           booking.passenger.name.toLowerCase().includes(query))
        ) ||
        (booking.type === 'hotel' && 
          (booking.hotel.name.toLowerCase().includes(query) ||
           booking.guest.name.toLowerCase().includes(query))
        )
      );
    }

    setFilteredBookings(filtered);
  };

  const handleCancelBooking = (booking) => {
    setSelectedBooking(booking);
    setShowCancellationModal(true);
  };

  const handleConfirmCancellation = async (cancellationData) => {
    try {
      const response = await submitCancellationRequest(
        cancellationData.bookingId, 
        cancellationData
      );
      
      setBookings(prevBookings => 
        prevBookings.map(booking => 
          booking.id === cancellationData.bookingId 
            ? { ...booking, status: 'cancelled', canCancel: false, canModify: false }
            : booking
        )
      );
      
      setTrackingReference(response.data.cancellationReference);
      setShowRefundTracker(true);
      
    } catch (err) {
      console.error('Cancellation failed:', err);
      throw err;
    }
  };

  const handleModifyBooking = (booking) => {
    console.log('Modify booking:', booking);
    alert('Modify booking functionality will be implemented in the next phase');
  };

  const handleTrackRefund = (refundReference) => {
    setTrackingReference(refundReference);
    setShowRefundTracker(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
          <span className="text-gray-600">Loading your bookings...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Data</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={loadData}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
          <p className="text-gray-600 mt-2">
            Manage your bookings, cancel reservations, and track refunds
          </p>
        </div>

        {/* Statistics Cards */}
        {statistics && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Bookings</p>
                  <p className="text-2xl font-bold text-gray-900">{statistics.totalBookings}</p>
                </div>
                <Calendar className="w-8 h-8 text-blue-600" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Cancelled</p>
                  <p className="text-2xl font-bold text-gray-900">{statistics.cancelledBookings}</p>
                </div>
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Refunded</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ₹{statistics.totalRefunded.toLocaleString()}
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Cancellation Rate</p>
                  <p className="text-2xl font-bold text-gray-900">{statistics.cancellationRate}%</p>
                </div>
                <AlertCircle className="w-8 h-8 text-yellow-600" />
              </div>
            </div>
          </div>
        )}

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search bookings..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-64"
                />
              </div>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
              </select>

              {/* Type Filter */}
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Types</option>
                <option value="flight">Flights</option>
                <option value="hotel">Hotels</option>
              </select>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowRefundTracker(true)}
                className="flex items-center px-4 py-2 text-blue-600 border border-blue-300 rounded-md hover:bg-blue-50"
              >
                <Eye className="w-4 h-4 mr-2" />
                Track Refund
              </button>

              <button
                onClick={loadData}
                className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Bookings List */}
        <div className="space-y-6">
          {filteredBookings.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Bookings Found</h3>
              <p className="text-gray-600 mb-6">
                {searchQuery || statusFilter !== 'all' || typeFilter !== 'all'
                  ? 'No bookings match your current filters.'
                  : 'You haven\'t made any bookings yet.'
                }
              </p>
              {searchQuery || statusFilter !== 'all' || typeFilter !== 'all' ? (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setStatusFilter('all');
                    setTypeFilter('all');
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Clear Filters
                </button>
              ) : (
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2 inline" />
                  Book Now
                </button>
              )}
            </div>
          ) : (
            filteredBookings.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                onCancel={handleCancelBooking}
                onModify={handleModifyBooking}
                onTrackRefund={handleTrackRefund}
              />
            ))
          )}
        </div>

        {/* Load More Button (if needed) */}
        {filteredBookings.length > 0 && filteredBookings.length >= 10 && (
          <div className="text-center mt-8">
            <button className="px-6 py-3 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
              Load More Bookings
            </button>
          </div>
        )}
      </div>

      {/* Cancellation Modal */}
      <CancellationModal
        isOpen={showCancellationModal}
        onClose={() => {
          setShowCancellationModal(false);
          setSelectedBooking(null);
        }}
        booking={selectedBooking}
        cancellationReasons={cancellationReasons}
        onConfirm={handleConfirmCancellation}
      />

      {/* Refund Tracker Modal */}
      {showRefundTracker && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <RefundTracker
              refundReference={trackingReference}
              onClose={() => {
                setShowRefundTracker(false);
                setTrackingReference('');
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CancellationDashboard;