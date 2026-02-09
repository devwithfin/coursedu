export const API_BASE_URL =
  process.env.EXPO_PUBLIC_GROUP5_API_URL ?? 'http://localhost:3004';

export const apiUrl = (path: string) => {
  if (!path.startsWith('/')) {
    return `${API_BASE_URL}/${path}`;
  }

  return `${API_BASE_URL}${path}`;
};
