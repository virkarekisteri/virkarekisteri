import { baseApi } from './base-api';
import type { AdminChangeLogEntry } from 'models/AdminChangeLogEntry';

const adminchangelogApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAdminChangelogs: build.query<AdminChangeLogEntry[], void>({
      query: () => '/crudchangelogs',
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: 'AdminChangeLogs', id }) as const), { type: 'AdminChangeLogs' as const, id: 'LIST' }]
          : [{ type: 'AdminChangeLogs' as const, id: 'LIST' }],
    }),
    getAdminChangeLogsByObjectType: build.query<AdminChangeLogEntry[], string>({
      query: (objectType) => `/crudchangelogs/objecttype/${objectType}`,
      providesTags: (_result, _error, objectType) => [{ type: 'AdminChangeLogs', id: objectType }],
    }),
    getAdminChangelogsByObjectId: build.query<AdminChangeLogEntry[], string>({
      query: (objectId) => `/crudchangelogs/object/${objectId}`,
      providesTags: (_result, _error, objectId) => [{ type: 'AdminChangeLogs', id: objectId }],
    }),
  }),
});

export const { useGetAdminChangelogsQuery, useGetAdminChangeLogsByObjectTypeQuery, useGetAdminChangelogsByObjectIdQuery } = adminchangelogApi;
