import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { FileNode } from '../types';

// Load API configuration
let apiUrl = 'http://localhost:3000/api'; // Default fallback

// Fetch config.json to get the API URL
fetch('/config.json')
  .then(response => response.json())
  .then(config => {
    apiUrl = config.apiUrl || apiUrl;
    api.defaults.baseURL = apiUrl;
  })
  .catch(() => {
    // Use default if config.json is not available
    api.defaults.baseURL = apiUrl;
  });

const api = axios.create({
  baseURL: apiUrl,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    // Silently handle errors when backend is not available
    // You can uncomment these for debugging when backend is connected
    // if (error.response) {
    //   console.error('API Error:', error.response.data);
    // } else if (error.request) {
    //   console.error('Network Error:', error.message);
    // }
    return Promise.reject(error);
  }
);

// File API methods
export const fileAPI = {
  // Get file tree from backend
  getFiles: async (): Promise<FileNode | null> => {
    try {
      const response = await api.get('/files');
      return response.data || null;
    } catch (error) {
      console.error('Failed to fetch files:', error);
      return null;
    }
  },

  // Helper: encode each path segment so slashes remain separators
  encodePathSegments: (path: string): string => {
    if (!path) return '';
    // split on '/' and encode each segment individually
    return path
      .split('/')
      .map((seg) => encodeURIComponent(seg))
      .join('/');
  },

  // Download a file or folder (returns backend route)
  downloadFile: (path: string): string => {
    const enc = fileAPI.encodePathSegments(path);
    return `/download/${enc}`;
  },

  // Delete a file or folder via backend DELETE
  deleteFile: async (path: string): Promise<boolean> => {
    try {
      const enc = fileAPI.encodePathSegments(path);
      await api.delete(`/download/${enc}`);
      return true;
    } catch (error) {
      console.error('Failed to delete file:', error);
      return false;
    }
  },

  // Check if file is streamable (video/audio)
  isStreamable: (filename: string): boolean => {
    // Limit video streaming to browser-friendly containers/codecs (mp4, webm, m4v)
    const videoExtensions = ['.mp4', '.webm', '.m4v'];
    const audioExtensions = ['.mp3', '.wav', '.ogg', '.m4a', '.flac', '.aac'];
    const ext = filename.toLowerCase().substring(filename.lastIndexOf('.'));
    return [...videoExtensions, ...audioExtensions].includes(ext);
  },

  // Is image
  isImage: (filename: string): boolean => {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg'];
    const ext = filename.toLowerCase().substring(filename.lastIndexOf('.'));
    return imageExtensions.includes(ext);
  },

  // Get stream URL for a file
  getStreamURL: (path: string): string => {
    const enc = fileAPI.encodePathSegments(path);
    // Use the backend streaming endpoint. The browser will request Range headers
    // which the backend serves via http.ServeContent.
    return `/download/${enc}`;
  },
};

export default api;
