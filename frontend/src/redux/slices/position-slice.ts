import { createAppSlice } from 'redux/create-app-slice';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface PositionState {
  selectedPositionId?: string;
}

const initialState: PositionState = {
  selectedPositionId: undefined,
};

export const positionSlice = createAppSlice({
  name: 'positions',
  initialState,
  reducers: (create) => ({
    selectPosition: create.reducer((state, action: PayloadAction<string>) => {
      state.selectedPositionId = action.payload;
    }),
    clearSelectedPosition: create.reducer((state) => {
      state.selectedPositionId = undefined;
    }),
  }),
  selectors: {
    selectSelectedPosition: (state) => state.selectedPositionId,
  },
});

export const { selectPosition, clearSelectedPosition } = positionSlice.actions;

export const { selectSelectedPosition } = positionSlice.selectors;
