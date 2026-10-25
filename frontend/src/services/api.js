import axios from 'axios';

// Normalize base URL to ensure it always targets the correct /api path
let rawBaseURL = import.meta.env.VITE_API_URL || '/api';
rawBaseURL = rawBaseURL.trim().replace(/\/+$/, ''); // Remove trailing slashes
if (rawBaseURL.startsWith('http') && !rawBaseURL.endsWith('/api')) {
  rawBaseURL = `${rawBaseURL}/api`;
}

const api = axios.create({
  baseURL: rawBaseURL,
});

// Request interceptor to attach JWT token (Teacher token prioritized if on teacher dashboard)
api.interceptors.request.use(
  (config) => {
    const teacherToken = localStorage.getItem('teacherToken');
    const leadToken = localStorage.getItem('teamLeadToken');

    if (config.url.includes('/teacher') || config.url.includes('/academic')) {
      if (teacherToken) {
        config.headers.Authorization = `Bearer ${teacherToken}`;
      }
    } else if (config.url.includes('/submit')) {
      if (leadToken) {
        config.headers.Authorization = `Bearer ${leadToken}`;
      }
    } else if (teacherToken) {
      config.headers.Authorization = `Bearer ${teacherToken}`;
    } else if (leadToken) {
      config.headers.Authorization = `Bearer ${leadToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;

