import apiClient from 'services/api-client';
import type { PositionEmployee } from 'models/PositionEmployee';

export const createPositionEmployee = async (data: PositionEmployee) => {
  const response = await apiClient.post('/positionemployees', data);
  return response.data;
};

// Made ready for the future
export const updatePositionEmployeeById = async (id: string, data: PositionEmployee) => {
  const response = await apiClient.put(`/positionemployees/${id}`, data);
  return response.data;
};

export const getPositionEmployeeById = async (id: string): Promise<PositionEmployee> => {
  const response = await apiClient.get(`/positionemployees/${id}`);
  return response.data;
};
