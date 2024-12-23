import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LOGIN__EN from "../locales/en/login.json";
import LOGIN__VI from "../locales/vi/login.json";
import SIGNUP__EN from "../locales/en/signup.json";
import SIGNUP__VI from "../locales/vi/signup.json";
import HEADER__EN from "../locales/en/header.json";
import HEADER__VI from "../locales/en/header.json";


// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)
const resources = {
  en: {
    login: LOGIN__EN,
    signup: SIGNUP__EN,
    header: HEADER__EN,
  },
  vi: {
    login: LOGIN__VI,
    signup: SIGNUP__VI,
    header: HEADER__VI,
  },
};

const defaultNS = "login";

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: localStorage.getItem("lng") || "en",
    fallbackLng: "en",
    defaultNS,
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });
  i18n.on('languageChanged', (lng) => {
    localStorage.setItem("lng", lng);
  });

export default i18n;
