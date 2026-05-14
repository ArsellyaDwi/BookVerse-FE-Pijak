import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const quoteService = {
  // Get quote of the day (public)
  getQuoteOfDay: async () => {
    try {
      const response = await axios.get(`${API_URL}/quotes/today`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch quote of the day:', error);
      return null;
    }
  },

  // Get all quotes with filters
  getAllQuotes: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      if (filters.mood) params.append('mood', filters.mood);
      if (filters.search) params.append('search', filters.search);
      
      const response = await axios.get(`${API_URL}/quotes?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch quotes:', error);
      return { success: false, data: [] };
    }
  },

  // Get quotes by detected mood from text
  getQuotesByMood: async (text) => {
    try {
      const response = await axios.post(`${API_URL}/quotes/by-mood`, { text });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch quotes by mood:', error);
      return null;
    }
  },

  // Save quote to user collection (requires auth)
  saveQuote: async (quoteId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/quotes/save/${quoteId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      console.error('Failed to save quote:', error);
      return { success: false };
    }
  },

  // Remove saved quote
  unsaveQuote: async (quoteId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`${API_URL}/quotes/save/${quoteId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      console.error('Failed to unsave quote:', error);
      return { success: false };
    }
  },

  // Get user's saved quotes
  getSavedQuotes: async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/quotes/saved`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      console.error('Failed to get saved quotes:', error);
      return { success: false, data: [] };
    }
  }
};

export default quoteService;