import axios from 'axios';
import { acquireAccessToken } from 'auth/msal-instance';

const baseUrl = import.meta.env.VITE_API_BASE_URL;

const apiClient = axios.create({
  baseURL: baseUrl,
});

apiClient.interceptors.request.use(async (config) => {
  const accessToken = await acquireAccessToken();
  config.headers.Authorization = `Bearer ${accessToken}`;

  if (import.meta.env.VITE_AZURE_FUNCTION_KEY)
    config.headers['X-FUNCTIONS-KEY'] = import.meta.env.VITE_AZURE_FUNCTION_KEY;

  return config;
});

export default apiClient;
