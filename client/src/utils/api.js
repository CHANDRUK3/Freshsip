// API configuration for both development and production
const getApiBase = () => {
  // If VITE_API_BASE is explicitly set, use it
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE) {
    return import.meta.env.VITE_API_BASE;
  }
  
  // In browser environment
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    
    // Development
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'http://localhost:5000';
    }
    
    // Production - use same domain
    return window.location.origin;
  }
  
  // Server-side fallback
  return 'http://localhost:5000';
};

export const API_BASE = getApiBase();

// Helper function for API calls with better error handling
export const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };
  
  try {
    console.log(`API Call: ${config.method || 'GET'} ${url}`);
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`API Error for ${url}:`, error);
    throw error;
  }
};
