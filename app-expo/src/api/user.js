import axios from 'axios';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

let API_BASE_URL;

if (Platform.OS === 'web') {
  API_BASE_URL = 'http://localhost:3000';
} else {
  // Make sure you have the API URL in your app.json's extra section for mobile
  API_BASE_URL = Constants.expoConfig.extra?.api_url_mobile;
}

export const getTeachers = async (limit = null, orderBy = null) => {
  try {
    const params: { role: string; limit?: number; orderBy?: string } = {
      role: 'teacher',
    };

    if (limit !== null) {
      params.limit = limit;
    }
    if (orderBy !== null) {
      params.orderBy = orderBy;
    }

    const response = await axios.get(`${API_BASE_URL}/users`, {
      params,
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Failed to fetch teachers');
    } else if (error.request) {
      throw new Error('No response from server. Please check your network connection.');
    } else {
      throw new Error('Error during fetch teachers request.');
    }
  }
};
