import { createAppSlice } from 'redux/create-app-slice';
import { getPositionNames } from 'services/functions/position-name-service';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { PositionName } from 'models/PositionName';

export interface PositionNameState {
  positionNames: PositionName[];
  loading?: boolean;
  error?: string | null;
}

const initialState: PositionNameState = {
  positionNames: [],
  loading: false,
  error: null,
};

export const positionNamesSlice = createAppSlice({
  name: 'positionNames',
  initialState,
  reducers: (create) => ({
    fetchPositionNames: create.asyncThunk(
      async () => {
        return await getPositionNames();
      },
      {
        pending: (state) => {
          state.loading = true;
          state.error = null;
        },
        fulfilled: (state, action: PayloadAction<PositionName[]>) => {
          state.positionNames = action.payload;
          state.loading = false;
        },
        rejected: (state, action) => {
          state.loading = false;
          state.error = action.error.message;
        },
      },
    ),
  }),
  selectors: {
    selectPositionNames: (state) => state.positionNames,
    selectPositionNamesLoading: (state) => state.loading,
    selectPositionNamesError: (state) => state.error,
  },
});

export const { fetchPositionNames } = positionNamesSlice.actions;

export const { selectPositionNames, selectPositionNamesLoading, selectPositionNamesError } =
  positionNamesSlice.selectors;

export default positionNamesSlice;
