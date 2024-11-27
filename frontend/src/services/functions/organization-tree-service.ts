import apiClient from 'services/api-client';
import type { OrganizationTree } from 'models/OrganizationTree';

export const getOrganizationTreesFunc = async (): Promise<OrganizationTree[]> => {
  const response = await apiClient.get('/organizationtrees');
  return response.data;
};

export const getOrganizationTreeById = async (id: string): Promise<OrganizationTree> => {
  const response = await apiClient.get(`/organizationtrees/${id}`);
  return response.data;
};
