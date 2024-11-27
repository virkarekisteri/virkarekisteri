import { createAppSlice } from 'redux/create-app-slice';
import { getOrganizationTreeById, getOrganizationTreesFunc } from 'services/functions/organization-tree-service';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { OrganizationTree } from 'models/OrganizationTree';

export interface OrganizationTreeState {
  entries: OrganizationTree[];
  selectedOrganization?: OrganizationTree;
  loading?: boolean;
}

const initialState: OrganizationTreeState = {
  entries: [],
  selectedOrganization: undefined,
  loading: false,
};

export const organizationTreeSlice = createAppSlice({
  name: 'organizationTree',
  initialState,
  reducers: (create) => ({
    getOrganizationTrees: create.asyncThunk(
      async () => {
        return await getOrganizationTreesFunc();
      },
      {
        pending: (state) => {
          state.loading = true;
        },
        fulfilled: (state, action: PayloadAction<OrganizationTree[]>) => {
          state.entries = action.payload;
          state.loading = false;
        },
        rejected: (state) => {
          state.loading = false;
        },
      },
    ),
    fetchOrganization: create.asyncThunk(
      async (id: string) => {
        return await getOrganizationTreeById(id);
      },
      {
        pending: (state) => {
          state.loading = true;
        },
        fulfilled: (state, action: PayloadAction<OrganizationTree>) => {
          state.selectedOrganization = action.payload;
          state.loading = false;
        },
        rejected: (state) => {
          state.loading = false;
        },
      },
    )
  }),
  selectors: {
    selectOrganizationTreeData: (state) => state.entries,
    selectOrganizationTreeLoading: (state) => state.loading,
    selectOrganizationTree: (state) => state.selectedOrganization,
  },
});

export const { getOrganizationTrees, fetchOrganization } = organizationTreeSlice.actions;

export const { selectOrganizationTreeData, selectOrganizationTreeLoading, selectOrganizationTree } = organizationTreeSlice.selectors;

export default organizationTreeSlice;
