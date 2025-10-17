// src/services/authService.js
import axios from 'axios';

const API_URL = 'http://localhost:3000';

export const login = async (data) => {
  const response = await axios.post(`${API_URL}/auth/login`, data, {
    withCredentials: true, // permite enviar cookies si las usas
  });
  return response.data;
};
