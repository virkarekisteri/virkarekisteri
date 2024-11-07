import type { AuthenticationResult, EventMessage } from '@azure/msal-browser';
import { EventType, PublicClientApplication } from '@azure/msal-browser';
import { msalConfig } from './auth-config';

const msalInstance = new PublicClientApplication(msalConfig);

// default to using the first account if no account is active on page load
if (!msalInstance.getActiveAccount() && msalInstance.getAllAccounts().length > 0) {
  msalInstance.setActiveAccount(msalInstance.getAllAccounts()[0]);
}

// emit events if account storage changes in another tab or window
msalInstance.enableAccountStorageEvents();

// listen for sign-in event and set active account
msalInstance.addEventCallback((event: EventMessage) => {
  if (event.eventType === EventType.LOGIN_SUCCESS) {
    const payload = event.payload as AuthenticationResult;
    if (payload.account) msalInstance.setActiveAccount(payload.account);
  }
});

export default msalInstance;
