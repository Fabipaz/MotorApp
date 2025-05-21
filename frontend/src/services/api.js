import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;
console.log(API_URL);
const api = axios.create({
  baseURL: API_URL,
});

// Interceptor para agregar el token automáticamente si existe
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
});

export default api; 