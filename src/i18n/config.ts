import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import resources from './resources.json';
import { Language } from '../types/Language';

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: Language.PT,
    fallbackLng: Language.PT,
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;