import apiClient from 'services/api-client';
import axios from 'axios';

export const getTestFunc1 = async (token) => {
  const response = await axios.get('https://auth-test-koira-apim.azure-api.net/HttpTrigger1', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response;
};

export const getTestFunc2 = async (token) => {
  const response = await axios.get('https://funcs-virkaluettelo.azurewebsites.net/api/TestFunc1', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response;
};

export const getTestFunc3 = async (token) => {
  const response = await apiClient.get('/HttpTrigger1');
  return response;
};
