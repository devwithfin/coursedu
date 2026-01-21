import axios from 'axios';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

let API_BASE_URL;

if (Platform.OS === 'web') {
  API_BASE_URL = 'http://localhost:3000';
} else {
  API_BASE_URL = Constants.expoConfig.extra?.api_url_mobile;
}

export const getEnrollments = async (studentId, isApproved = null, limit = null, orderBy = null) => {
  try {
    const params: { student_id: number; is_approved?: number; limit?: number; orderBy?: string } = {
      student_id: studentId,
    };

    if (isApproved !== null) {
      params.is_approved = isApproved;
    }

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

export const createEnrollment = async (studentId, courseId) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/enrollments`, {
            student_id: studentId,
            course_id: courseId,
        });
        return response.data;
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.message || 'Failed to create enrollment');
        } else if (error.request) {
            throw new Error('No response from server. Please check your network connection.');
        } else {
            throw new Error('Error during create enrollment request.');
        }
    }
};