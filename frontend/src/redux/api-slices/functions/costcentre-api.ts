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
        },
      }),
      invalidatesTags: [{ type: 'CostCenters', id: 'LIST' }],
    }),
    updateCostCentre: build.mutation<Costcentre, { id: string; costcentre: Partial<Costcentre> }>({
      query: ({ id, costcentre }) => ({
        url: `/costcentres/${id}`,
        method: 'PUT',
        body: costcentre,
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'CostCenters', id }],
    }),
  }),
});

export const { useGetCostCentersQuery, useCreateCostCentreMutation, useUpdateCostCentreMutation } = costcentreTreesApi;
