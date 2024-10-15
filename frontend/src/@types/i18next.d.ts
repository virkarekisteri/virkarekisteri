import type resources from './resources';

// Type augment and interface merge for custom type definitions
declare module 'i18next' {
  interface CustomTypeOptions {
    resources: resources;
  }
}
