import { createAppSlice } from 'redux/create-app-slice';
import {
  createPositionEmployee,
  updatePositionEmployeeById,
  getPositionEmployeeById,
} from 'services/functions/position-employee-service';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { PositionEmployee } from 'models/PositionEmployee'; // Adjust the import path accordingly

export interface PositionEmployeeState {
  entries: PositionEmployee[];
  loading?: boolean;
  selectedEmployee?: PositionEmployee;
}

const initialState: PositionEmployeeState = {
  entries: [],
  loading: false,
  selectedEmployee: undefined,
};

export const positionEmployeeSlice = createAppSlice({
  name: 'positionEmployees',
  initialState,
  reducers: (create) => ({
    addPositionEmployee: create.asyncThunk(
      async (data: PositionEmployee) => {
        return await createPositionEmployee(data);
      },
      {
        pending: (state) => {
          state.loading = true;
        },
        fulfilled: (state, action: PayloadAction<PositionEmployee>) => {
          state.entries.push(action.payload);
          state.loading = false;
        },
        rejected: (state) => {
          state.loading = false;
        },
      },
    ),
    updatePositionEmployee: create.asyncThunk(
      async (data: PositionEmployee) => {
        return await updatePositionEmployeeById(data.id, data);
      },
      {
        pending: (state) => {
          state.loading = true;
        },
        fulfilled: (state, action: PayloadAction<PositionEmployee>) => {
          const index = state.entries.findIndex((emp) => emp.id === action.payload.id);
          if (index !== -1) {
            state.entries[index] = action.payload;
          }
          state.loading = false;
        },
        rejected: (state) => {
          state.loading = false;
        },
      },
    ),
    fetchPositionEmployee: create.asyncThunk(
      async (id: string) => {
        return await getPositionEmployeeById(id);
      },
      {
        pending: (state) => {
          state.loading = true;
        },
        fulfilled: (state, action: PayloadAction<PositionEmployee>) => {
          state.selectedEmployee = action.payload;
          state.loading = false;
        },
        rejected: (state) => {
          state.loading = false;
        },
      },
    ),
  }),
  selectors: {
    selectPositionEmployeeData: (data) => data.entries,
    selectPositionEmployeeLoading: (state) => state.loading,
    selectIndividualPositionEmployee: (state) => state.selectedEmployee,
  },
});

export const { addPositionEmployee, updatePositionEmployee, fetchPositionEmployee } = positionEmployeeSlice.actions;

export const { selectPositionEmployeeData, selectPositionEmployeeLoading, selectIndividualPositionEmployee } =
  positionEmployeeSlice.selectors;
