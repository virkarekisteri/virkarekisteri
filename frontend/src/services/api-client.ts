import axios from 'axios';
import msalInstance from 'auth/msal-instance';
import { loginRequest } from 'auth/auth-config';

const baseUrl = import.meta.env.VITE_API_BASE_URL;

const apiClient = axios.create({
  baseURL: baseUrl,
});

apiClient.interceptors.request.use(async (config) => {
  const { accessToken } = await msalInstance.acquireTokenSilent({
    scopes: loginRequest.scopes,
    account: msalInstance.getActiveAccount()!,
  });
  config.headers.Authorization = `Bearer ${accessToken}`;

  if (import.meta.env.VITE_AZURE_FUNCTION_KEY) config.headers.X_FUNCTIONS_KEY = import.meta.env.VITE_AZURE_FUNCTION_KEY;

  return config;
});

export default apiClient;
