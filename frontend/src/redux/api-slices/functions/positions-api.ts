import { baseApi } from './base-api';
import type { Position } from 'models/Position';
import type { CsvImportResponse } from 'models/CsvImportResponse';

const PositionsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getPositions: build.query<Position[], void>({
      query: () => '/positions',
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: 'Positions', id }) as const), { type: 'Positions', id: 'LIST' }]
          : [{ type: 'Positions', id: 'LIST' }],
    }),
    getPosition: build.query<Position, string>({
      query: (id) => `/positions/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Positions', id }],
    }),
    createPosition: build.mutation<Position, Position>({
      query: (position) => ({
        url: '/positions',
        method: 'POST',
        body: position,
      }),
      invalidatesTags: [
        { type: 'Positions', id: 'LIST' },
        { type: 'PositionNames', id: 'LIST' },
      ],
    }),
    updatePosition: build.mutation<Position, { id: string; position: Partial<Position> }>({
      query: ({ id, position }) => ({
        url: `/positions/${id}`,
        method: 'PUT',
        body: position,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Positions', id },
        { type: 'ChangeLogs', id },
        { type: 'PositionNames', id: 'LIST' },
      ],
    }),
    importPositionsCsv: build.mutation<CsvImportResponse, FormData>({
      query: (form) => ({
        url: '/positions/import',
        method: 'POST',
        body: form,
      }),
      invalidatesTags: [{ type: 'Positions', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetPositionsQuery,
  useGetPositionQuery,
  useLazyGetPositionQuery,
  useCreatePositionMutation,
  useUpdatePositionMutation,
  useImportPositionsCsvMutation,
} = PositionsApi;
