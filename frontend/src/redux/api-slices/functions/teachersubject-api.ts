import { baseApi } from './base-api';
import type { TeacherSubject } from 'models/TeacherSubject';

const TeacherSubjectsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getTeacherSubjects: build.query<TeacherSubject[], void>({
      query: () => '/subjects',
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: 'TeacherSubjects', id }) as const), { type: 'TeacherSubjects', id: 'LIST' }]
          : [{ type: 'TeacherSubjects', id: 'LIST' }],
    }),
  /*
    getPositionChangeLogs: build.query<TeacherSubject[], string>({
      query: (id) => `/positions/${id}/changelog`,
      providesTags: (_result, _error, id) => [{ type: 'ChangeLogs', id }],
    }),
  */
  }),
});

export const { /*useGetPositionChangeLogsQuery,*/ useGetTeacherSubjectsQuery } = TeacherSubjectsApi;
