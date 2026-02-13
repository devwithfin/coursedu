import axios from 'axios';
import Constants from 'expo-constants';

const explicitEnvUrl = process.env.EXPO_PUBLIC_API_URL;
const configUrl = Constants.expoConfig?.extra?.api_url_mobile as string | undefined;
const defaultUrl = 'http://localhost:3000';

export const API_BASE_URL = explicitEnvUrl || configUrl || defaultUrl;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

export default apiClient;
