import { baseApi } from './base-api';
import type { TeacherSubject } from 'models/TeacherSubject';

const TeacherSubjectsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getTeacherSubjects: build.query<TeacherSubject[], void>({
      query: () => '/subjects',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'TeacherSubjects', id }) as const),
              { type: 'TeacherSubjects', id: 'LIST' },
            ]
          : [{ type: 'TeacherSubjects', id: 'LIST' }],
    }),
    updateTeacherSubject: build.mutation<TeacherSubject, { id: string; subject: Partial<TeacherSubject> }>({
      query: ({ id, subject }) => ({
        url: `/subjects/${id}`,
        method: 'PUT',
        body: subject,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'TeacherSubjects', id },
        { type: 'AdminChangeLogs', id },
      ],
    }),
    createTeacherSubject: build.mutation<TeacherSubject, Partial<TeacherSubject>>({
      query: (subject) => ({
        url: `/subjects`,
        method: 'POST',
        body: subject,
      }),
      invalidatesTags: [{ type: 'TeacherSubjects', id: 'LIST' }],
    }),
  }),
});

export const { useGetTeacherSubjectsQuery, useUpdateTeacherSubjectMutation, useCreateTeacherSubjectMutation } =
  TeacherSubjectsApi;
