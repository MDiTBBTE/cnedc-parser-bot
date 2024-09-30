import { I18n } from "@grammyjs/i18n";

export const i18n = new I18n({
  defaultLocale: "en",
  useSession: true,
  directory: "src/locales",
});

export const i18nMiddleware = i18n.middleware();
