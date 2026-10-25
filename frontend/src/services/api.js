import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
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

