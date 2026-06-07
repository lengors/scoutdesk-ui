import type { IsEqual } from "./typing";

import type en from "../../public/locales/en/translation.json";
import type pt from "../../public/locales/pt/translation.json";

import { capitalize } from "./text";
import { initReactI18next } from "react-i18next";

import i18n from "i18next";
import backend from "i18next-http-backend";
import detector from "i18next-browser-languagedetector";

await i18n
  .use(backend)
  .use(detector)
  .use(initReactI18next)
  .init({
    debug: false,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });

i18n.services.formatter?.add("capitalize", capitalize);

type UnsafeTranslation = typeof en & typeof pt;
type Translation = IsEqual<
  UnsafeTranslation,
  typeof en,
  UnsafeTranslation,
  never
>;

declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: "translation";
    resources: {
      translation: Translation;
    };
  }
}

export default i18n;
