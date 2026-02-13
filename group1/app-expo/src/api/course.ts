import apiClient from './client';

export const getCourseById = async (courseId) => {
    try {
      const response = await apiClient.get(`/courses/${courseId}`);
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data.message || `Failed to fetch course with ID ${courseId}`);
      } else if (error.request) {
        throw new Error('No response from server. Please check your network connection.');
      } else {
        throw new Error('Error during fetch course by ID request.');
      }
    }
};

export const getAllCourses = async () => {
    try {
      const response = await apiClient.get(`/courses`);
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data.message || 'Failed to fetch all courses');
      } else if (error.request) {
        throw new Error('No response from server. Please check your network connection.');
      } else {
        throw new Error('Error during fetch all courses request.');
      }
    }
  };
