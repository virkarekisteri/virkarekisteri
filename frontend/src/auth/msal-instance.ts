import type { AuthenticationResult, EventMessage } from '@azure/msal-browser';
import { EventType, PublicClientApplication } from '@azure/msal-browser';
import { msalConfig } from './auth-config';
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
  msalInstance.addEventCallback((event: EventMessage) => {
    if (event.eventType === EventType.LOGIN_SUCCESS) {
      const payload = event.payload as AuthenticationResult;

      if (payload.account) {
        msalInstance.setActiveAccount(payload.account);
        store.dispatch(updateAuthState(payload));
      }
    }

    if (event.eventType === EventType.ACQUIRE_TOKEN_SUCCESS) {
      const payload = event.payload as AuthenticationResult;
      if (payload.account) store.dispatch(updateAuthState(payload));
    }

    if (event.eventType === EventType.LOGOUT_SUCCESS) {
      store.dispatch(clearAuthState());
    }
  });
};

export default msalInstance;
