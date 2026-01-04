import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '/api';

// Get flight pricing with dynamic updates
export const getFlightPricing = async (flightId, departureDate) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/pricing`, {
      params: {
        action: 'flight-pricing',
        flightId,
        departureDate
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching flight pricing:', error);
    throw new Error('Failed to fetch flight pricing');
  }
};

// Get hotel pricing with dynamic updates
export const getHotelPricing = async (hotelId, checkInDate, checkOutDate) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/pricing`, {
      params: {
        action: 'hotel-pricing',
        hotelId,
        checkInDate,
        checkOutDate
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching hotel pricing:', error);
    throw new Error('Failed to fetch hotel pricing');
  }
};

// Get price history for an item
export const getPriceHistory = async (itemType, itemId, days = 30) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/pricing`, {
      params: {
        action: 'price-history',
        itemType,
        itemId,
        days
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching price history:', error);
    throw new Error('Failed to fetch price history');
  }
};

// Create a price freeze
export const createPriceFreeze = async (userId, itemType, itemId, currentPrice) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/pricing?action=create-price-freeze`, {
      userId,
      itemType,
      itemId,
      currentPrice
    });
    return response.data;
  } catch (error) {
    console.error('Error creating price freeze:', error);
    throw new Error('Failed to create price freeze');
  }
};

// Use a price freeze
export const usePriceFreeze = async (freezeId, userId) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/pricing?action=use-price-freeze`, {
      freezeId,
      userId
    });
    return response.data;
  } catch (error) {
    console.error('Error using price freeze:', error);
    throw new Error('Failed to use price freeze');
  }
};

// Get user's price freezes
export const getUserPriceFreezes = async (userId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/pricing`, {
      params: {
        action: 'user-price-freezes',
        userId
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user price freezes:', error);
    throw new Error('Failed to fetch price freezes');
  }
};

// Get pricing analytics
export const getPricingAnalytics = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/pricing`, {
      params: {
        action: 'pricing-analytics'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching pricing analytics:', error);
    throw new Error('Failed to fetch pricing analytics');
  }
};

// Initialize sample pricing data
export const initializeSamplePricingData = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/pricing`, {
      params: {
        action: 'initialize-sample-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error initializing sample pricing data:', error);
    throw new Error('Failed to initialize sample pricing data');
  }
};