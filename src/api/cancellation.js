import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '/api';

// Get user bookings
export const getUserBookings = async (userId, status = 'all') => {
  try {
    const response = await axios.get(`${API_BASE_URL}/cancellation`, {
      params: {
        action: 'bookings',
        userId,
        status
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching bookings:', error);
    throw new Error('Failed to fetch bookings');
  }
};

// Get booking details
export const getBookingDetails = async (bookingId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/cancellation`, {
      params: {
        action: 'booking-details',
        bookingId
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching booking details:', error);
    throw error;
  }
};

// Calculate cancellation refund
export const calculateCancellationRefund = async (bookingId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/cancellation`, {
      params: {
        action: 'calculate-refund',
        bookingId
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error calculating refund:', error);
    throw error;
  }
};

// Submit cancellation request
export const submitCancellationRequest = async (bookingId, cancellationData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/cancellation?action=cancel-booking`, {
      bookingId,
      ...cancellationData
    });
    return response.data;
  } catch (error) {
    console.error('Error submitting cancellation:', error);
    throw error;
  }
};

// Get cancellation reasons
export const getCancellationReasons = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/cancellation`, {
      params: {
        action: 'cancellation-reasons'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching cancellation reasons:', error);
    throw new Error('Failed to fetch cancellation reasons');
  }
};

// Track refund status
export const trackRefundStatus = async (refundReference) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/cancellation`, {
      params: {
        action: 'track-refund',
        refundReference
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error tracking refund:', error);
    throw error;
  }
};

// Get cancellation policies
export const getCancellationPolicies = async (type = 'flight') => {
  try {
    const response = await axios.get(`${API_BASE_URL}/cancellation`, {
      params: {
        action: 'cancellation-policies',
        type
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching cancellation policies:', error);
    throw new Error('Failed to fetch cancellation policies');
  }
};

// Get refund statistics
export const getRefundStatistics = async (userId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/cancellation`, {
      params: {
        action: 'refund-statistics',
        userId
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching refund statistics:', error);
    throw new Error('Failed to fetch refund statistics');
  }
};

// Initialize sample data (for development/testing)
export const initializeSampleData = async () => {
  try {
    const response = await axios.post(`${API_BASE_URL}/init-sample-data`);
    return response.data;
  } catch (error) {
    console.error('Error initializing sample data:', error);
    throw new Error('Failed to initialize sample data');
  }
};