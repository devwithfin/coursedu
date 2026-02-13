// app-expo/src/api/auth.js
import apiClient, { API_BASE_URL } from './client';

export const login = async (email, password) => {
  try {
    const response = await apiClient.post(`/auth/login`, {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Login failed');
    } else if (error.request) {
      throw new Error('No response from server. Please check your network connection.');
    } else {
      throw new Error('Error during login request.');
    }
  }
};

export const logout = async () => {
  try {
    const response = await apiClient.post(`/auth/logout`);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Logout failed');
    } else if (error.request) {
      throw new Error('No response from server. Please check your network connection.');
    } else {
      throw new Error('Error during logout request.');
    }
  }
};



