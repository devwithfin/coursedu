import axios from 'axios';

const API_URL = process.env.EXPO_PUBLIC_API_URL;
console.log('API_URL from environment:', API_URL); // Add this line // Ensure this is correctly set up in .env or app.json

export const getAdminStats = async (token: string) => {
  try {
    const response = await axios.get(`${API_URL}/admin/stats`, {
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
