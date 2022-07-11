import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

import languageKo from './language/ko';
import languageEn from './language/en';
import languageId from './language/id';
import languageVi from './language/vi';

const resources = {
  ko: {
    translation: languageKo,
  },
  en: {
    translation: languageEn,
  },
  id: {
    translation: languageId,
  },
  vi: {
    translation: languageVi,
  },
};

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: 'ko',
    fallbackLng: 'ko',
    keySeparator: false, // we do not use keys in form messages.welcome
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
