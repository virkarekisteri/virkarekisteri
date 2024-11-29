import apiClient from 'services/api-client';
import type { Position } from 'models/Position';

export const createPosition = async (data: Position) => {
  const response = await apiClient.post('/positions', data);
  return response.data;
};

export const getPositionsFunc = async (): Promise<Position[]> => {
  const response = await apiClient.get('/positions');
  return response.data;
};

export const getPositionById = async (id: string): Promise<Position> => {
  const response = await apiClient.get(`/positions/${id}`);
  return response.data;
};

export const uploadCsv = async (formData: FormData): Promise<void> => {
  const response = await apiClient.post('/positions/import', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const updatePosition = async (id: string, data: Partial<Position>): Promise<Position> => {
  try {
    const response = await apiClient.put<Position>(`/positions/${id}`, data);
    return response.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error in updatePosition API:', error.message);
      throw error;
    } else if (typeof error === 'object' && error !== null && 'response' in error) {
      console.error('Unknown error');
      throw error;
    } else {
      console.error('Unknown error in updatePosition API');
      throw new Error('Unknown error occurred');
    }
  }
};
