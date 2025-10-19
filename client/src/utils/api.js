// API configuration for both development and production
const getApiBase = () => {
  // If VITE_API_BASE is explicitly set, use it
  if (import.meta.env.VITE_API_BASE) {
    return import.meta.env.VITE_API_BASE;
  }
  
  // In production (when not localhost), use Netlify functions
  if (typeof window !== 'undefined' && !window.location.hostname.includes('localhost')) {
    return `${window.location.origin}/.netlify/functions/api`;
  }
  
  // Development fallback
  return 'http://localhost:5000';
};

export const API_BASE = getApiBase();
