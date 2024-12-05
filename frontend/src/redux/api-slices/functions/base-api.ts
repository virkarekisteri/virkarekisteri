import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { acquireAccessToken } from 'auth/msal-instance';

export const baseApi = createApi({
  reducerPath: 'functionsApi',
  tagTypes: ['OrganizationTrees', 'PositionEmployees', 'PositionNames', 'Positions', 'ChangeLogs'],
  invalidationBehavior: 'delayed',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL,
    prepareHeaders: async (headers) => {
      const accessToken = await acquireAccessToken();
      headers.set('Authorization', `Bearer ${accessToken}`);

      if (import.meta.env.VITE_AZURE_FUNCTION_KEY)
        headers.set('X-FUNCTIONS-KEY', import.meta.env.VITE_AZURE_FUNCTION_KEY);
    },
  }),
  endpoints: () => ({}),
});
