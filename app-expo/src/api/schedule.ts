import axios from 'axios';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

let API_BASE_URL;

if (Platform.OS === 'web') {
  API_BASE_URL = 'http://localhost:3000';
} else {
  API_BASE_URL = Constants.expoConfig.extra?.api_url_mobile;
}

export const getSchedulesByCourseId = async (courseId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/schedules/course/${courseId}`);
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data.message || 'Failed to fetch schedules');
      } else if (error.request) {
        throw new Error('No response from server. Please check your network connection.');
      } else {
        throw new Error('Error during fetch schedules request.');
      }
    }
  };
