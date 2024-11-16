import type { Action, ThunkAction } from '@reduxjs/toolkit';
import { combineSlices, configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { positionSlice } from './slices/position-slice';
import positionNameSlice from './slices/position-name-slice';
import organizationTreeSlice from './slices/organization-tree-slice';
import { authSlice } from './slices/auth-slice';
import { setupMsalEventListeners } from 'auth/msal-instance';

const rootReducer = combineSlices(positionSlice, positionNameSlice, organizationTreeSlice, authSlice);

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
          ignoredActionPaths: ['payload.extExpiresOn', 'payload.expiresOn', 'payload.account.tenantProfiles'],
        },
      }),
    preloadedState,
  });
  setupListeners(store.dispatch);
  return store;
};

export const store = makeStore();
setupMsalEventListeners(store);

// Infer the type of `store`
export type AppStore = typeof store;
// Infer the `AppDispatch` type from the store itself
export type AppDispatch = AppStore['dispatch'];
export type AppThunk<ThunkReturnType = void> = ThunkAction<ThunkReturnType, RootState, unknown, Action>;
