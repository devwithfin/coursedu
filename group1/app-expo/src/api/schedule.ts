import apiClient from './client';

export const getSchedulesByCourseId = async (courseId) => {
    try {
      const response = await apiClient.get(`/schedules/course/${courseId}`);
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
