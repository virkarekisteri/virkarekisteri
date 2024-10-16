import { createAppSlice } from 'redux/create-app-slice';
import { createPosition, getPositionsFunc } from 'services/functions/positions-service';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Position } from 'models/Position'; // Adjust the import path accordingly

export interface PositionState {
  entries: Position[];
  loading?: boolean;
}

const initialState: PositionState = {
  entries: [],
  loading: false,
};

export const positionSlice = createAppSlice({
  name: 'positions',
  initialState,
  reducers: (create) => ({
    getPositions: create.asyncThunk(
      async () => {
        return await getPositionsFunc();
      },
      {
        pending: (state) => {
          state.loading = true;
        },
        fulfilled: (state, action: PayloadAction<Position[]>) => {
          state.entries = action.payload;
          state.loading = false;
        },
        rejected: (state) => {
          state.loading = false;
        },
      },
    ),
    addPosition: create.asyncThunk(
      async (data: Position) => {
        return await createPosition(data);
      },
      {
        pending: (state) => {
          state.loading = true;
        },
        fulfilled: (state, action: PayloadAction<Position>) => {
          state.entries.push(action.payload);
          state.loading = false;
        },
        rejected: (state) => {
          state.loading = false;
        },
      },
    ),
  }),
});

export const { getPositions, addPosition } = positionSlice.actions;
