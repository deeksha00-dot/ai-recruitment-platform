import axios from 'axios';
import { toast } from 'react-toastify';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const message = error?.response?.data?.detail || error?.response?.data?.message || error.message;

    if (status === 401) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user_role');
      window.dispatchEvent(new CustomEvent('auth:logout'));
    } else if (status === 403) {
      toast.error("You don't have permission to do that.");
    } else if (status === 404) {
      // let calling code decide whether to surface this
    } else if (status >= 500) {
      toast.error('Something went wrong on our end. Please try again shortly.');
    } else if (!error.response) {
      toast.error('Network error. Check your connection and try again.');
    }

    return Promise.reject({ status, message, raw: error });
  }
);

export default api;
export { BASE_URL };
