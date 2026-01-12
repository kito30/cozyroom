/**
 * API Configuration
 * Automatically detects the correct backend URL based on environment
 */

function getApiBaseUrl(): string {
  // Server-side: use env var or localhost
  if (typeof window === 'undefined') {
    return process.env.API_URL || 'http://localhost:3001';
  }
  
  // Client-side: check env var first
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  
  // Auto-detect: if accessing via network IP, use same IP for backend
  const hostname = window.location.hostname;
  if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
    return `http://${hostname}:3001`;
  }
  
  return 'http://localhost:3001';
}

export const API_BASE_URL = getApiBaseUrl();

export const getApiUrl = (path: string): string => {
  const cleanPath = path.replace(/^\//, ''); // Remove leading slash
  return `${API_BASE_URL}/${cleanPath}`;
};
