import i18n from "i18next";
import Backend from "i18next-http-backend";
//import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import flagEs from "/flags/es.svg";
import flagEn from "/flags/en.svg";

const DEVELOPMENT = import.meta.env.VITE_NODE_ENV == "development";
const LOCAL = import.meta.env.VITE_NODE_ENV == "local";
const basePath = LOCAL
  ? "/"
  : DEVELOPMENT
  ? "/proyectos/dev-cotizador/"
  : "/";

const backendOptions = {
  loadPath: `${basePath}locales/{{lng}}/{{ns}}.json`,
};

i18n
  // load translation using http -> see /public/locales
  // learn more: https://github.com/i18next/i18next-http-backend
  .use(Backend)
  // detect user language
  // learn more: https://github.com/i18next/i18next-browser-languageDetector
  //   .use(LanguageDetector)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    lng: "es",
    fallbackLng: "es",
    debug: true,
    backend: backendOptions,
  });

export const availableLanguages = [
  {
    code: "es",
    name: "Español",
    flag: "🇪🇸",
    flagPath: flagEs,
  },
  {
    code: "en",
    name: "English",
    flag: "🇬🇧",
    flagPath: flagEn,
  },
];

export function changeLanguage(lng) {
  if (!availableLanguages.find((l) => l.code === lng))
    throw new Error(`Language ${lng} not supported`);

  i18n.changeLanguage(lng);
}

export const currentLanguage = (i18n) => {
  const code = i18n.language;
  return (
    availableLanguages.find((l) => l.code === code) || availableLanguages[0]
  );
};

export default i18n;
