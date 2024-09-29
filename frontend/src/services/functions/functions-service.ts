import { apiClient } from 'services/api-client';

export const getTestFunc1 = async () => {
  const response = await apiClient.get('/TestFunc1');
  return response.data;
};
