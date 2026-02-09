import apiClient from './client';

export const getAdminStats = async (token: string) => {
  try {
    const response = await apiClient.get(`/admin/stats`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('API admin.ts: Full API response for stats:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    throw error;
  }
};
