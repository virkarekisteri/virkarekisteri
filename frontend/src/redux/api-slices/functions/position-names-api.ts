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
  }),
});

export const { useGetPositionNamesQuery } = PositionNamesApi;
