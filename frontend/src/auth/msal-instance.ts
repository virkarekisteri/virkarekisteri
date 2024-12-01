import type { AuthenticationResult, AuthError, EventMessage } from '@azure/msal-browser';
import { EventType, PublicClientApplication } from '@azure/msal-browser';
import { loginRequest, msalConfig } from './auth-config';
import type { AppStore } from 'redux/store';
import { clearAuthState, updateAuthState } from 'redux/slices/auth-slice';

const msalInstance = new PublicClientApplication(msalConfig);

// default to using the first account if no account is active on page load
if (!msalInstance.getActiveAccount() && msalInstance.getAllAccounts().length > 0) {
  msalInstance.setActiveAccount(msalInstance.getAllAccounts()[0]);
}

// emit events if account storage changes in another tab or window
msalInstance.enableAccountStorageEvents();

// special setup function for the event listeners, so that the Redux store can be passed in
// kind of a hack, but we have to somehow interlink the Redux store with the MSAL instance
// and this is a convenient place
export const setupMsalEventListeners = (store: AppStore) => {
  msalInstance.addEventCallback(async (event: EventMessage) => {
    if (event.eventType === EventType.LOGIN_SUCCESS) {
      const payload = event.payload as AuthenticationResult;

      if (payload.account) {
        msalInstance.setActiveAccount(payload.account);
        store.dispatch(updateAuthState(payload));
      }
    }

    // interlink the Redux store with the MSAL instance
    if (event.eventType === EventType.ACQUIRE_TOKEN_SUCCESS) {
      const payload = event.payload as AuthenticationResult;
      if (payload.account) store.dispatch(updateAuthState(payload));
    }

    if (event.eventType === EventType.ACQUIRE_TOKEN_FAILURE) {
      const error = event.error as AuthError;

      // if the refresh token has expired, log out the user
      // a manual re-login is required
      if (error.name === 'InteractionRequiredAuthError') {
        console.warn('Refresh token has expired, manual re-login is required, clearing cached user');
        await msalInstance.logoutRedirect({
          account: msalInstance.getActiveAccount(),
          onRedirectNavigate: () => false,
        });
      }
    }

    if (event.eventType === EventType.LOGOUT_SUCCESS) {
      store.dispatch(clearAuthState());
      await msalInstance.clearCache();
    }
  });
};

/**
 * Helper function to acquire an access token silently.
 */
export const acquireAccessToken = async () =>
  (
    await msalInstance.acquireTokenSilent({
      scopes: loginRequest.scopes,
      account: msalInstance.getActiveAccount()!,
    })
  ).accessToken;

/**
 * Helper function to validate the authentication state.
 * Checks that if there is an active account, we're able to retrieve access tokens if needed.
 * If, e.g., the auth state has been sitting stale for a while in the browser's storage, the refresh
 * token might have expired and therefore the whole auth state is invalid.
 */
export const validateAuthState = async () => {
  // silently catch any error, the event handler will take care of clearing the auth state
  if (msalInstance.getActiveAccount()) await acquireAccessToken().catch();
};

export default msalInstance;
