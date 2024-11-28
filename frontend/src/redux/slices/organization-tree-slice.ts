import { createAppSlice } from 'redux/create-app-slice';
import { getOrganizationTreesFunc } from 'services/functions/organization-tree-service';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { OrganizationTree } from 'models/OrganizationTree';

export interface OrganizationTreeState {
  entries: OrganizationTree[];
  loading?: boolean;
}

const initialState: OrganizationTreeState = {
  entries: [],
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
  }),
  selectors: {
    selectOrganizationTreeData: (state) => state.entries,
    selectOrganizationTreeLoading: (state) => state.loading,
  },
});

export const { getOrganizationTrees } = organizationTreeSlice.actions;

export const { selectOrganizationTreeData, selectOrganizationTreeLoading } = organizationTreeSlice.selectors;

export default organizationTreeSlice;
