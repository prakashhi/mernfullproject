import axios from 'axios';
import { toast } from 'react-toastify';

// Get the base URL from the environment variable
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Create an Axios instance with the base URL
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Handle errors globally with an Axios interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || 'Something went wrong!';
    toast.error(message);
    return Promise.reject(error);
  }
);

export default apiClient;
