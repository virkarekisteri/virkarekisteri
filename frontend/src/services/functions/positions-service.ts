import { apiClient } from 'services/api-client';
import type { Position } from 'types/Position';

export const createPosition = async (data: Position) => {
  const response = await apiClient.post('/positions', data);
  return response.data;
};
