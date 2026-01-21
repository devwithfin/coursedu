// app-expo/src/api/auth.js
import axios from 'axios';
import Constants from 'expo-constants'; 
import { Platform } from 'react-native'; 

let API_BASE_URL;

if (Platform.OS === 'web') {
  API_BASE_URL = 'http://localhost:3000'; 
} else {
  API_BASE_URL = Constants.expoConfig.extra?.api_url_mobile;
}

export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, {
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
    const response = await axios.post(`${API_BASE_URL}/auth/logout`);
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



