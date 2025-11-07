import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

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

export default api;
