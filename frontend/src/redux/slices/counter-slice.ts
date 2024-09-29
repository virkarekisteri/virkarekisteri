import { createAppSlice } from 'redux/create-app-slice';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface CounterState {
  value: number;
  status: 'idle' | 'loading' | 'failed';
}

const initialState: CounterState = {
  value: 0,
  status: 'idle',
};

export const counterSlice = createAppSlice({
  name: 'counter',
  initialState,
  reducers: (create) => ({
    increment: create.reducer((state) => {
      state.value += 1;
    }),
    decrement: create.reducer((state) => {
      state.value -= 1;
    }),
    incrementByAmount: create.reducer((state, action: PayloadAction<number>) => {
      state.value += action.payload;
    }),
    setValue: create.reducer((state, action: PayloadAction<number>) => {
      state.value = action.payload;
    }),
    // example async thunk
    incrementAsync: create.asyncThunk(
      async () => {
        const response = await new Promise<{ data: number }>((resolve) => setTimeout(() => resolve({ data: 1 }), 1000));
        return response.data;
      },
      {
        pending: (state) => {
          state.status = 'loading';
        },
        fulfilled: (state, action: PayloadAction<number>) => {
          state.status = 'idle';
          state.value += action.payload;
        },
        rejected: (state) => {
          state.status = 'failed';
        },
      },
    ),
  }),
  selectors: {
    selectCount: (counter) => counter.value,
    selectStatus: (counter) => counter.status,
  },
});

// Action creators are generated for each case reducer function.
export const { decrement, increment, incrementByAmount, incrementAsync, setValue } = counterSlice.actions;

// Selectors returned by `slice.selectors` take the root state as their first argument.
export const { selectCount, selectStatus } = counterSlice.selectors;
