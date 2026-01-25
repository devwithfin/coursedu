import axios from 'axios';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

let API_BASE_URL: string;

if (Platform.OS === 'web') {
  API_BASE_URL = 'http://localhost:3000/api';
} else {
  API_BASE_URL = Constants.expoConfig?.extra?.api_url_mobile + '/api';
}

/* ================= QUEUE (PENDING) ================= */
export const getEnrollmentQueue = async () => {
  try {
    const res = await axios.get(`${API_BASE_URL}/enrollments/queue`);
    return res.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || 'Failed to fetch enrollment queue'
    );
  }
};

/* ================= ACCEPTED ================= */
export const getAcceptedEnrollments = async () => {
  try {
    const res = await axios.get(`${API_BASE_URL}/enrollments/accepted`);
    return res.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || 'Failed to fetch accepted enrollments'
    );
  }
};

/* ================= APPROVE ================= */
export const approveEnrollment = async (id: number) => {
  try {
    const res = await axios.put(`${API_BASE_URL}/enrollments/${id}/approve`);
    return res.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || 'Failed to approve enrollment'
    );
  }
};

/* ================= DECLINE ================= */
export const declineEnrollment = async (id: number) => {
  try {
    const res = await axios.delete(`${API_BASE_URL}/enrollments/${id}`);
    return res.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || 'Failed to decline enrollment'
    );
  }
};
