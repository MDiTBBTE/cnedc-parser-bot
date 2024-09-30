import { getMainKeyboard } from "../utils/keyboard.js";
import { updateUserByTelegramId } from "../../database/operations/users.js";

export const languageCallback = async (ctx) => {
  const requestedLocale = ctx.callbackQuery.data.split("_")[1];

  if ((await ctx.i18n.getLocale()) === requestedLocale) {
    return await ctx.reply(ctx.t("language.already-set"));
  }

  await ctx.i18n.setLocale(requestedLocale);
  await updateUserByTelegramId(ctx.from.id, { lang: requestedLocale });

  const MAIN_KEYBOARD = await getMainKeyboard(ctx);

  await ctx.reply(ctx.t("language.language-set"), {
    reply_markup: MAIN_KEYBOARD,
  });

  await ctx.answerCallbackQuery();
};
