import apiClient from './client';

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

    const response = await apiClient.get(`/users`, {
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

export const getAllUsers = async (role = null, limit = null, orderBy = null) => {
  try {
    const params: { role?: string; limit?: number; orderBy?: string } = {};
    if (role) {
      params.role = role;
    }
    if (limit !== null) {
      params.limit = limit;
    }
    if (orderBy !== null) {
      params.orderBy = orderBy;
    }
    const response = await apiClient.get(`/users`, { params });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Failed to fetch users');
    } else if (error.request) {
      throw new Error('No response from server. Please check your network connection.');
    } else {
      throw new Error('Error during fetch users request.');
    }
  }
};

export const createUser = async (userData) => {
  try {
    const response = await apiClient.post(`/users`, userData);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Failed to create user');
    } else if (error.request) {
      throw new Error('No response from server. Please check your network connection.');
    } else {
      throw new Error('Error during create user request.');
    }
  }
};

export const updateUser = async (id, userData) => {
  try {
    const response = await apiClient.put(`/users/${id}`, userData);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Failed to update user');
    } else if (error.request) {
      throw new Error('No response from server. Please check your network connection.');
    } else {
      throw new Error('Error during update user request.');
    }
  }
};

export const deleteUser = async (id) => {
  try {
    const response = await apiClient.delete(`/users/${id}`);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Failed to delete user');
    } else if (error.request) {
      throw new Error('No response from server. Please check your network connection.');
    } else {
      throw new Error('Error during delete user request.');
    }
  }
};
