import { baseApi } from './base-api';
import type { OrganizationTree } from 'models/OrganizationTree';

const organizationTreesApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getCostCenters: build.query<OrganizationTree[], void>({
      query: () => '/costcentres',
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: 'CostCenters', id }) as const), { type: 'CostCenters', id: 'LIST' }]
          : [{ type: 'CostCenters', id: 'LIST' }],
    }),
  }),
});

export const { useGetCostCentersQuery } = organizationTreesApi;
