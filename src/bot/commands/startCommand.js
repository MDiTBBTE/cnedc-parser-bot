import {
  addUser,
  getUserByTelegramId,
} from "../../database/operations/users.js";
import { languageCommand } from "./languageCommand.js";
import { getMainKeyboard } from "../utils/keyboard.js";

export const startCommand = async (ctx) => {
  try {
    const MAIN_KEYBOARD = await getMainKeyboard(ctx);

    await ctx.react("🐳");
    await ctx.reply(
      ctx.t("start", {
        name: ctx.from.first_name,
        bot_name: ctx.me.first_name,
      }),
      { reply_markup: MAIN_KEYBOARD }
    );

    const user = ctx.from;
    await addUser({
      telegramUserName: user.username,
      telegramId: user.id,
      firstName: user.first_name || "",
      lastName: user.lastName || "",
    });

    const addedUser = await getUserByTelegramId(user.id);

    if (!addedUser?.lang) {
      await languageCommand(ctx);
    }
  } catch (error) {
    console.error("[startCommand][error]", error);
  }
};
