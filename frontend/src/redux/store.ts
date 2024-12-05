import type { Action, ThunkAction } from '@reduxjs/toolkit';
import { combineSlices, configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { positionSlice } from './slices/position-slice';
import { authSlice } from './slices/auth-slice';
import { baseApi } from './api-slices/functions/base-api';

const rootReducer = combineSlices(positionSlice, authSlice, baseApi);

// Infer the `RootState` type from the root reducer
export type RootState = ReturnType<typeof rootReducer>;

// The store setup is wrapped in `makeStore` to allow reuse
// when setting up tests that need the same store config
export const makeStore = (preloadedState?: Partial<RootState>) => {
  const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActionPaths: [
            'meta.arg',
            'meta.arg.file',
            'payload.extExpiresOn',
            'payload.expiresOn',
            'payload.account.tenantProfiles',
          ],
          ignoredPaths: ['positions.meta.arg', 'positions.meta.arg.file'],
        },
      }).concat(baseApi.middleware),
    preloadedState,
  });
  setupListeners(store.dispatch);
  return store;
};

export const store = makeStore();

// Infer the type of `store`
export type AppStore = typeof store;
// Infer the `AppDispatch` type from the store itself
export type AppDispatch = AppStore['dispatch'];
export type AppThunk<ThunkReturnType = void> = ThunkAction<ThunkReturnType, RootState, unknown, Action>;
