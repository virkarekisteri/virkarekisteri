import { baseApi } from './base-api';
import type { PositionName } from 'models/PositionName';

const PositionNamesApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getPositionNames: build.query<PositionName[], void>({
      query: () => '/positionnames',
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: 'PositionNames', id }) as const), { type: 'PositionNames', id: 'LIST' }]
          : [{ type: 'PositionNames', id: 'LIST' }],
    }),
    updatePositionName: build.mutation<PositionName, {id: string, data: Partial<PositionName> }>({
      query: ({id, data}) => ({
        url: `/positionnames/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'PositionNames', id },
      ],
    }),
    createPositionName: build.mutation<PositionName, Partial<PositionName>>({
      query: (positionName) => ({
        url: '/positionnames',
        method: 'POST',
        body: positionName,
      }),
      invalidatesTags: [ {type: 'PositionNames', id: 'LIST'} ]
    }),
  }),
});

export const { useGetPositionNamesQuery, useUpdatePositionNameMutation, useCreatePositionNameMutation } = PositionNamesApi;
