import { createAppSlice } from 'redux/create-app-slice';
import { createPosition, getPositionById, getPositionsFunc, uploadCsv } from 'services/functions/positions-service';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Position } from 'models/Position';
import { updatePosition as updatePositionAPI } from 'services/functions/positions-service';

export interface PositionState {
  entries: Position[];
  loading?: boolean;
  selectedPosition?: Position | null;
}

const initialState: PositionState = {
  entries: [],
  loading: false,
  selectedPosition: undefined,
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
          state.selectedPosition = action.payload;
          state.loading = false;
        },
        rejected: (state) => {
          state.loading = false;
        },
      },
    ),
    updatePosition: create.asyncThunk(
      async ({ id, data }: { id: string; data: Partial<Position> }) => {
        return await updatePositionAPI(id, {
          ...data,
          DecisionNumber: data.DecisionNumber,
        });
      },
      {
        pending: (state) => {
          state.loading = true;
        },
        fulfilled: (state, action: PayloadAction<Position>) => {
          const index = state.entries.findIndex((entry) => entry.id === action.payload.id);
          if (index !== -1) {
            state.entries[index] = action.payload;
          }
          state.selectedPosition = action.payload;
          state.loading = false;
        },
        rejected: (state) => {
          state.loading = false;
        },
      },
    ),
    fetchPosition: create.asyncThunk(
      async (id: string | null) => {
        if (id === null) {
          return null; // Return null to indicate no selection
        }
        return await getPositionById(id); // Fetch data for the given ID
      },
      {
        pending: (state) => {
          state.loading = true;
        },
        fulfilled: (state, action: PayloadAction<Position | null>) => {
          state.selectedPosition = action.payload; // Set to null or the fetched position
          state.loading = false;
        },
        rejected: (state) => {
          state.loading = false;
        },
      },
    ),
    uploadPositionsFromCsv: create.asyncThunk(
      async (formData: FormData) => {
        return await uploadCsv(formData); // API call to handle file upload
      },
      {
        pending: (state) => {
          state.loading = true;
        },
        fulfilled: (state) => {
          state.loading = false;
        },
        rejected: (state) => {
          state.loading = false;
        },
      },
    ),
  }),
  selectors: {
    selectPositionData: (data) => data.entries,
    selectPositionLoading: (state) => state.loading,
    selectIndividualPosition: (state) => state.selectedPosition,
  },
});

export const { getPositions, addPosition, fetchPosition, uploadPositionsFromCsv, updatePosition } =
  positionSlice.actions;

export const { selectPositionData, selectPositionLoading, selectIndividualPosition } = positionSlice.selectors;
