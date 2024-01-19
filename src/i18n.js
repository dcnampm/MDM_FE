import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import translationVI from './i18n/vi.json';

i18n
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    resources: {
      vi: {
        translation: translationVI,
      },
    },
    lng: 'vi',
    fallbackLng: 'vi',
    debug: true,

    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
  });
export default i18n;