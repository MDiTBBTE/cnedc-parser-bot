import * as dotenv from "dotenv";
import { Bot, GrammyError, HttpError, session } from "grammy";
import { freeStorage } from "@grammyjs/storage-free";

import { i18nMiddleware } from "../plugins/i18n.js";
import { startCommand } from "./commands/startCommand.js";
import { languageCommand } from "./commands/languageCommand.js";
import { userParsedFilesCommand } from "./commands/userFilesCommand.js";
import { topUpCommand } from "./commands/topUpCommand.js";
import { aboutUsCommand } from "./commands/aboutUsCommand.js";
import { languageCallback } from "./callbacks/languageCallback.js";
import { hasTopUpsValues, topUpsCallback } from "./callbacks/topUpsCallback.js";
import { hasToParseTextOrHTML } from "../bot/utils/parsers.js";
import { validateCardList, hasToValidCardInput } from "../bot/utils/checker.js";
import {
  processMessageUpload,
  processFileUpload,
  processFileDownload,
} from "../bot/utils/index.js";
import {
  hasKeyboardTexts,
  performKeyboardTexts,
  LANGUAGE_KEYBOARD_VALUE,
  ABOUT_US_KEYBOARD_VALUE,
  UPLOADED_FILES_KEYBOARD_VALUE,
  TOP_UP_BALANCE_KEYBOARD_VALUE,
} from "./utils/keyboard.js";

dotenv.config();

const bot = new Bot(process.env.BOT_TOKEN);

bot.use(
  session({
    initial: () => ({
      __language_code: "en",
    }),
    storage: freeStorage(bot.token),
  })
);

// set commands
bot.api.setMyCommands([
  { command: "start", description: "Start interacting with the bot" },
]);

// plugins
bot.use(i18nMiddleware);

// commands
bot.command("start", startCommand);

// callbacks
bot.on("callback_query:data", async (ctx) => {
  console.log("|--- callbackQuery_data", ctx.callbackQuery.data);

  if (LANGUAGE_KEYBOARD_VALUE === ctx.callbackQuery.data) {
    return await languageCommand(ctx);
  }
  if (ABOUT_US_KEYBOARD_VALUE === ctx.callbackQuery.data) {
    return await aboutUsCommand(ctx);
  }
  if (TOP_UP_BALANCE_KEYBOARD_VALUE === ctx.callbackQuery.data) {
    return await topUpCommand(ctx);
  }
  if (await hasTopUpsValues(ctx)) {
    return await topUpsCallback(ctx);
  }
  if (UPLOADED_FILES_KEYBOARD_VALUE === ctx.callbackQuery.data) {
    return await userParsedFilesCommand(ctx);
  }
  if (ctx.callbackQuery.data.startsWith("language_")) {
    return await languageCallback(ctx);
  }

  await ctx.reply(ctx.t("can_not_process_btn"), {
    reply_to_message_id: ctx.update.callback_query.message.message_id,
  });
});

bot.on("message:text", async (ctx) => {
  console.log("|--- message:text", ctx.message.text);

  if (await hasKeyboardTexts(ctx)) {
    return await performKeyboardTexts(ctx);
  }

  if (ctx.message.text.startsWith("download_parsed-")) {
    return await processFileDownload(ctx);
  }

  if (hasToValidCardInput(ctx.message.text)) {
    return await ctx.reply(
      ctx.t("checker.msg_reply", {
        result: validateCardList(ctx.message.text),
      })
    );
  }

  if (hasToParseTextOrHTML(ctx.message.text)) {
    return await processMessageUpload(ctx);
  }

  return await ctx.reply(ctx.t("error.incorrect_msg"), { parse_mode: "HTML" });
});

bot.on("message:document", async (ctx) => {
  await processFileUpload(ctx);
});

bot.catch((err) => {
  const ctx = err.ctx;
  console.error(`Error while handling update: ${ctx.update.update_id}`);
  const e = err.error;

  if (e instanceof GrammyError) {
    console.error(`Error in request: ${e.description}`);
  } else if (e instanceof HttpError) {
    console.error(`Could not contact Telegram: ${e}`);
  } else {
    console.error(`Unknown error: ${e}`);
  }
});

export { bot };
