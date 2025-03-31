import { baseApi } from './base-api';
import type { Costcentre } from 'models/Costcentre';

const costcentreTreesApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getCostCenters: build.query<Costcentre[], void>({
      query: () => '/costcentres',
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: 'CostCenters', id }) as const), { type: 'CostCenters', id: 'LIST' }]
          : [{ type: 'CostCenters', id: 'LIST' }],
    }),
  }),
});

export const { useGetCostCentersQuery } = costcentreTreesApi;
