import { baseApi } from './base-api';
import type { ChangeLogEntry } from 'models/ChangeLogEntry';

const ChangeLogsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getChangeLogs: build.query<ChangeLogEntry[], void>({
      query: () => '/changelogs',
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: 'ChangeLogs', id }) as const), { type: 'ChangeLogs', id: 'LIST' }]
          : [{ type: 'ChangeLogs', id: 'LIST' }],
    }),
    getPositionChangeLogs: build.query<ChangeLogEntry[], string>({
      query: (id) => `/positions/${id}/changelog`,
      providesTags: (_result, _error, id) => [{ type: 'ChangeLogs', id }],
    }),
  }),
});

export const { useGetPositionChangeLogsQuery, useGetChangeLogsQuery } = ChangeLogsApi;
