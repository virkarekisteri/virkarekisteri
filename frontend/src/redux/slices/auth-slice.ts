import { createAppSlice } from 'redux/create-app-slice';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { AuthenticationResult } from '@azure/msal-browser';
import type { JwtPayload } from 'jwt-decode';
import { jwtDecode } from 'jwt-decode';

export interface AuthState {
  name?: string;
  email: string;
  roles?: string[];
}

const initialState: AuthState = {
  name: undefined,
  email: '',
  roles: undefined,
};

export const authSlice = createAppSlice({
  name: 'auth',
  initialState,
  reducers: (create) => ({
    updateAuthState: create.reducer((state, authResult: PayloadAction<AuthenticationResult>) => {
      const accessToken = jwtDecode<JwtPayload & { roles?: string[]; upn: string }>(authResult.payload.accessToken);
      state.roles = accessToken.roles;
      state.name = authResult.payload.account.name;
      state.email = accessToken.upn;
    }),
    clearAuthState: create.reducer(() => initialState),
  }),
  selectors: {
    selectName: (state) => state.name,
    selectEmail: (state) => state.email,
    selectIsAdmin: (state) => state.roles?.includes('Admin') ?? false,
  },
});

export const { updateAuthState, clearAuthState } = authSlice.actions;

export const { selectName, selectEmail, selectIsAdmin } = authSlice.selectors;
