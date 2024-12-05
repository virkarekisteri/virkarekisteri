import { baseApi } from './base-api';
import type { PositionEmployee } from 'models/PositionEmployee';

const positionEmployeesApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getPositionEmployee: build.query<PositionEmployee, string>({
      query: (id) => `/positionemployees/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'PositionEmployees', id }],
    }),
    createPositionEmployee: build.mutation<
      PositionEmployee,
      { positionEmployee: PositionEmployee; decisionNumber: string }
    >({
      query: ({ positionEmployee, decisionNumber }) => ({
        url: '/positionemployees',
        method: 'POST',
        body: { positionEmployee, decisionNumber },
      }),
      invalidatesTags: (_result, _error, { positionEmployee }) => [
        { type: 'Positions', id: positionEmployee.positionId },
        { type: 'ChangeLogs', id: positionEmployee.positionId },
      ],
    }),
    updatePositionEmployee: build.mutation<PositionEmployee, PositionEmployee>({
      query: (positionEmployee) => ({
        url: `/positionemployees/${positionEmployee.id}`,
        method: 'PUT',
        body: positionEmployee,
      }),
      invalidatesTags: (_result, _error, { id, positionId }) => [
        { type: 'PositionEmployees', id },
        { type: 'ChangeLogs', id: positionId },
      ],
    }),
  }),
});

export const { useGetPositionEmployeeQuery, useCreatePositionEmployeeMutation, useUpdatePositionEmployeeMutation } =
  positionEmployeesApi;
