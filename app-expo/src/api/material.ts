import axios from 'axios';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

let API_BASE_URL;

if (Platform.OS === 'web') {
  API_BASE_URL = 'http://localhost:3000';
} else {
  API_BASE_URL = Constants.expoConfig.extra?.api_url_mobile;
}

export const getMaterials = async (courseIds = [], limit = null, orderBy = null) => {
  try {
    const params: { course_ids?: string; limit?: number; orderBy?: string } = {};

    if (courseIds.length > 0) {
      params.course_ids = courseIds.join(',');
    }
    if (limit !== null) {
      params.limit = limit;
    }
    if (orderBy !== null) {
      params.orderBy = orderBy;
    }

    const response = await axios.get(`${API_BASE_URL}/materials`, {
      params,
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Failed to fetch materials');
    } else if (error.request) {
      throw new Error('No response from server. Please check your network connection.');
    } else {
      throw new Error('Error during fetch materials request.');
    }
  }
};

export const getMaterialById = async (materialId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/materials/${materialId}`);
        return response.data;
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.message || 'Failed to fetch material details');
        } else if (error.request) {
            throw new Error('No response from server. Please check your network connection.');
        } else {
            throw new Error('Error during fetch material details request.');
        }
    }
};