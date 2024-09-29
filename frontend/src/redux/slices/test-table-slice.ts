import { createAppSlice } from 'redux/create-app-slice';
import { getTestFunc1 } from 'services/functions/functions-service';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface TestTableEntry {
  coolMessage?: string;
  displayMessage?: boolean;
  coolNumber?: number;
}

export interface TestTableState {
  entries: TestTableEntry[];
}

const initialState: TestTableState = {
  entries: [],
};

export const testTableSlice = createAppSlice({
  name: 'messages',
  initialState,
  reducers: (create) => ({
    getTestTable: create.asyncThunk(
      async () => {
        return await getTestFunc1();
      },
      {
        fulfilled: (state, action: PayloadAction<TestTableEntry[]>) => {
          state.entries = action.payload;
        },
      },
    ),
  }),
});

export const { getTestTable } = testTableSlice.actions;
