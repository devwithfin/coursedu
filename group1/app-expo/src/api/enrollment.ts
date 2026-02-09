import apiClient from './client';

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

    const response = await apiClient.get(`/enrollments`, {
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
        const response = await apiClient.post(`/enrollments`, {
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
