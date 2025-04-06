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
    createCostCentre: build.mutation<Costcentre, Partial<Costcentre>>({
      query: (body) => ({
        url: '/costcentres',
        method: 'POST',
        body,
        headers: {
          'Content-Type': 'application/json',
        }
      }),
      invalidatesTags: [{ type: 'CostCenters', id: 'LIST' }],
    }),
    updateCostCentre: build.mutation<Costcentre, Partial<Costcentre>>({
      query: (body) => ({
        url: `/costcentres/${body.id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'CostCenters', id }],
    }),
  }),
});

export const { useGetCostCentersQuery, useCreateCostCentreMutation, useUpdateCostCentreMutation } = costcentreTreesApi;
