import { baseApi } from './base-api';
import type { PositionChangeLogEntry } from 'models/PositionChangeLogEntry';

const ChangeLogsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getChangeLogs: build.query<PositionChangeLogEntry[], void>({
      query: () => '/changelogs',
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: 'ChangeLogs', id }) as const), { type: 'ChangeLogs', id: 'LIST' }]
          : [{ type: 'ChangeLogs', id: 'LIST' }],
    }),
    getPositionChangeLogs: build.query<PositionChangeLogEntry[], string>({
      query: (id) => `/positions/${id}/changelog`,
      providesTags: (_result, _error, id) => [{ type: 'ChangeLogs', id }],
    }),
  }),
});

export const { useGetPositionChangeLogsQuery, useGetChangeLogsQuery } = ChangeLogsApi;
