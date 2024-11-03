import { apiClient } from 'services/api-client';
import type { OrganizationTree } from 'models/OrganizationTree';

export const getOrganizationTreesFunc = async (): Promise<OrganizationTree[]> => {
  const response = await apiClient.get('/organizationtrees');
  return response.data;
};
