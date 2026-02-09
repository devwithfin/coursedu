import apiClient from './client';

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

    const response = await apiClient.get(`/materials`, {
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
        const response = await apiClient.get(`/materials/${materialId}`);
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
