import { createAppSlice } from 'redux/create-app-slice';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { AuthenticationResult } from '@azure/msal-browser';
import type { JwtPayload } from 'jwt-decode';
import { jwtDecode } from 'jwt-decode';

enum RoleHierarchy {
  Read,
  Edit,
  Admin,
}

export interface AuthState {
  name?: string;
  email: string;
  roles?: RoleHierarchy[];
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
      state.roles = accessToken.roles
        ?.map((role) => RoleHierarchy[role as keyof typeof RoleHierarchy])
        .filter((role): role is RoleHierarchy => role !== undefined);
      state.name = authResult.payload.account.name;
      state.email = accessToken.upn;
    }),
    clearAuthState: create.reducer(() => initialState),
  }),
  selectors: {
    selectName: (state) => state.name,
    selectEmail: (state) => state.email,
    selectIsEditor: (state) => state.roles?.some((role) => role >= RoleHierarchy.Edit) ?? false,
    selectIsAdmin: (state) => state.roles?.includes(RoleHierarchy.Admin) ?? false,
    selectHighestRole: (state) => RoleHierarchy[Math.max(...(state.roles ?? [RoleHierarchy.Read]))],
  },
});

export const { updateAuthState, clearAuthState } = authSlice.actions;

export const { selectName, selectEmail, selectIsEditor, selectIsAdmin, selectHighestRole } = authSlice.selectors;
