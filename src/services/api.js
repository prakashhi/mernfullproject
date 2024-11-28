import axios from 'axios';


// Get the base URL from the environment variable
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

// Create an Axios instance with the base URL
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});



export default apiClient;
