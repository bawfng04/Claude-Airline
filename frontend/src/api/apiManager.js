import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_BASE_URL;
console.log('API_BASE_URL:', API_BASE_URL);

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosClient;
