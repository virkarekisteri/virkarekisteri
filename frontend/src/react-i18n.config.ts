import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

export const LANGUAGES: Record<'fi' | 'en' | 'sv', string> = { fi: 'Suomi', en: 'English', sv: 'Svenska' };

i18next
  .use(initReactI18next)
  .use(HttpBackend)
  .use(LanguageDetector)
  .init({
    fallbackLng: 'fi',
    detection: {
      // only detect from localStorage, because many Finnish people have their browser in english,
      // and we assume 99% of app's users are Finnish
      order: ['localStorage'],
    },
  });
