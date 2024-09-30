import { InlineKeyboard } from "grammy";

const languageKeyboard = new InlineKeyboard()
  .text("🇺🇸 English", "language_en")
  .text("🇷🇺 Русский", "language_ru")
  .text("🇺🇦 Українська", "language_ua");

export const languageCommand = async (ctx) => {
  await ctx.reply(ctx.t("start_language"), {
    reply_markup: languageKeyboard,
  });
};
