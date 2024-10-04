import { Keyboard, InlineKeyboard, InputFile } from "grammy";
import { profileCommand } from "../commands/profileCommand.js";
import { instructionCommand } from "../commands/instructionCommand.js";
import { fileURLToPath } from "node:url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const videoPath = path.resolve(
  __dirname,
  "../../../",
  "src/assets/settings.mp4"
);

export const PROFILE_KEYBOARD_VALUE1 = "👤 My profile";
export const PROFILE_KEYBOARD_VALUE2 = "👤 Мой профиль";
export const PROFILE_KEYBOARD_VALUE3 = "👤 Мій профіль";

export const INSTRUCTION_KEYBOARD_VALUE1 = "📋 Instruction";
export const INSTRUCTION_KEYBOARD_VALUE2 = "📋 Инструкция";
export const INSTRUCTION_KEYBOARD_VALUE3 = "📋 Інструкція";

export const SETTINGS_KEYBOARD_VALUE1 = "⚙️ Settings";
export const SETTINGS_KEYBOARD_VALUE2 = "⚙️ Настройки";
export const SETTINGS_KEYBOARD_VALUE3 = "⚙️ Налаштування";

export const LANGUAGE_KEYBOARD_VALUE = "LANGUAGE";
export const ABOUT_US_KEYBOARD_VALUE = "ABOUT_US";

export const UPLOADED_FILES_KEYBOARD_VALUE = "UPLOADED_FILES";
export const TOP_UP_BALANCE_KEYBOARD_VALUE = "TOP_UP_BALANCE";
export const REFERAL_SYSTEM_KEYBOARD_VALUE = "REFERAL_SYSTEM";

export const getMainKeyboard = async (ctx) => {
  return new Keyboard()
    .text(await ctx.t("profile.my_profile"))
    .row()
    .text(await ctx.t("profile.instruction"))
    .text(await ctx.t("profile.settings"))
    .row()
    .resized();
};

export const getSettingsKeyboard = async (ctx) => {
  return new InlineKeyboard()
    .text(await ctx.t("profile.about_us"), ABOUT_US_KEYBOARD_VALUE)
    .row()
    .text(await ctx.t("profile.language"), LANGUAGE_KEYBOARD_VALUE)
    .url(await ctx.t("profile.support"), "https://t.me/twint2/message");
};

export const getTopUpKeyboard = async (ctx) => {
  return new InlineKeyboard()
    .text(await ctx.t("profile.top_up_balance"), TOP_UP_BALANCE_KEYBOARD_VALUE)
    .row();
};

export const getProfileActionsKeyboard = async (ctx) => {
  return new InlineKeyboard()
    .text(await ctx.t("profile.uploaded_files"), UPLOADED_FILES_KEYBOARD_VALUE)
    .text(await ctx.t("profile.top_up_balance"), TOP_UP_BALANCE_KEYBOARD_VALUE)
    .row()
    .text(await ctx.t("profile.referal"), REFERAL_SYSTEM_KEYBOARD_VALUE);
};

export const hasKeyboardTexts = async (ctx) => {
  return [
    PROFILE_KEYBOARD_VALUE1,
    PROFILE_KEYBOARD_VALUE2,
    PROFILE_KEYBOARD_VALUE3,
    INSTRUCTION_KEYBOARD_VALUE1,
    INSTRUCTION_KEYBOARD_VALUE2,
    INSTRUCTION_KEYBOARD_VALUE3,
    SETTINGS_KEYBOARD_VALUE1,
    SETTINGS_KEYBOARD_VALUE2,
    SETTINGS_KEYBOARD_VALUE3,
  ].includes(ctx.message.text);
};

export const performKeyboardTexts = async (ctx) => {
  const PROFILE_ACTIONS_KEYBOARD = await getProfileActionsKeyboard(ctx);
  const SETTINGS_KEYBOARD = await getSettingsKeyboard(ctx);

  switch (ctx.message.text) {
    case PROFILE_KEYBOARD_VALUE1:
    case PROFILE_KEYBOARD_VALUE2:
    case PROFILE_KEYBOARD_VALUE3:
      await profileCommand(ctx);
      await ctx.reply(ctx.t("profile.additional_actions"), {
        reply_markup: PROFILE_ACTIONS_KEYBOARD,
      });
      break;
    case INSTRUCTION_KEYBOARD_VALUE1:
    case INSTRUCTION_KEYBOARD_VALUE2:
    case INSTRUCTION_KEYBOARD_VALUE3:
      await instructionCommand(ctx);
      break;
    case SETTINGS_KEYBOARD_VALUE1:
    case SETTINGS_KEYBOARD_VALUE2:
    case SETTINGS_KEYBOARD_VALUE3:
      // TODO: change to our video
      await ctx.replyWithVideo(new InputFile(videoPath), {
        caption: ctx.t("profile.settings"),
        reply_markup: SETTINGS_KEYBOARD,
      });
      //   await ctx.reply(ctx.t("profile.settings"), {
      //     reply_markup: SETTINGS_KEYBOARD,
      //   });
      break;
    default:
      break;
  }
};
