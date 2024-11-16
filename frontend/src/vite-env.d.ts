/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;

  readonly VITE_MSAL_CLIENT_ID: string;
  readonly VITE_MSAL_AUTHORITY: string;
  readonly VITE_MSAL_REDIRECT_URI: string;
  readonly VITE_MSAL_LOGIN_SCOPE: string;

  readonly VITE_AZURE_FUNCTION_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
