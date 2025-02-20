import { baseApi } from './base-api';
import type { Subject } from 'models/Subject';

const subjectsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getSubjects: build.query<Subject[], void>({
      query: () => '/subjects',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Subjects', id } as const)),
              { type: 'Subjects' as const, id: 'LIST' },
            ]
          : [{ type: 'Subjects' as const, id: 'LIST' }],
    }),
  }),
});

export const { useGetSubjectsQuery } = subjectsApi;