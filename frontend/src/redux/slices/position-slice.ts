import { createAppSlice } from 'redux/create-app-slice';
import { getPositionsFunc } from 'services/functions/positions-service';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Position } from 'models/Position'; // Adjust the import path accordingly

export interface PositionState {
  entries: Position[];
}

const initialState: PositionState = {
  entries: [],
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
        fulfilled: (state, action: PayloadAction<Position[]>) => {
          state.entries = action.payload;
        },
      },
    ),
  }),
});

export const { getPositions } = positionSlice.actions;
