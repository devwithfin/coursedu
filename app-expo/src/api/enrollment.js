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

export const getEnrollments = async (studentId, limit = null, orderBy = null) => {
  try {
    const params: { student_id: number; is_approved: number; limit?: number; orderBy?: string } = {
      student_id: studentId,
      is_approved: 1,
    };

    if (limit !== null) {
      params.limit = limit;
    }
    if (orderBy !== null) {
      params.orderBy = orderBy;
    }

    const response = await axios.get(`${API_BASE_URL}/enrollments`, {
      params,
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Failed to fetch enrollments');
    } else if (error.request) {
      throw new Error('No response from server. Please check your network connection.');
    } else {
      throw new Error('Error during fetch enrollments request.');
    }
  }
};
