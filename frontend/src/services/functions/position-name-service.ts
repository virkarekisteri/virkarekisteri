import type { PositionName } from 'models/PositionName';
import apiClient from 'services/api-client';

export const getPositionNames = async (): Promise<PositionName[]> => {
  const response = await apiClient.get('/positionnames');
  return response.data;
};
