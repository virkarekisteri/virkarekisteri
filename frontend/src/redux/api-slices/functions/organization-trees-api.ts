import { baseApi } from './base-api';
import type { OrganizationTree } from 'models/OrganizationTree';

const organizationTreesApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getOrganizationTrees: build.query<OrganizationTree[], void>({
      query: () => '/organizationtrees',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'OrganizationTrees', id }) as const),
              { type: 'OrganizationTrees', id: 'LIST' },
            ]
          : [{ type: 'OrganizationTrees', id: 'LIST' }],
    }),
  }),
});

export const { useGetOrganizationTreesQuery } = organizationTreesApi;
