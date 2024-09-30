import { InlineKeyboard } from "grammy";

export const TOP_UP_10_BALANCE_KEYBOARD_VALUE = "TOP_UP_10_40_BALANCE";
export const TOP_UP_22_BALANCE_KEYBOARD_VALUE = "TOP_UP_22_100_BALANCE";
export const TOP_UP_100_BALANCE_KEYBOARD_VALUE = "TOP_UP_100_500_BALANCE";
export const TOP_UP_190_BALANCE_KEYBOARD_VALUE = "TOP_UP_190_1000_BALANCE";
export const TOP_UP_350_BALANCE_KEYBOARD_VALUE = "TOP_UP_350_2000_BALANCE";

export const getTopUpKeyboard = async (ctx) => {
  return new InlineKeyboard()
    .text(
      await ctx.t("profile.top_up_10_40_balance"),
      TOP_UP_10_BALANCE_KEYBOARD_VALUE
    )
    .row()
    .text(
      await ctx.t("profile.top_up_22_100_balance"),
      TOP_UP_22_BALANCE_KEYBOARD_VALUE
    )
    .row()
    .text(
      await ctx.t("profile.top_up_100_500_balance"),
      TOP_UP_100_BALANCE_KEYBOARD_VALUE
    )
    .row()
    .text(
      await ctx.t("profile.top_up_190_1000_balance"),
      TOP_UP_190_BALANCE_KEYBOARD_VALUE
    )
    .row()
    .text(
      await ctx.t("profile.top_up_350_2000_balance"),
      TOP_UP_350_BALANCE_KEYBOARD_VALUE
    );
};

export const topUpCommand = async (ctx) => {
  const TOP_UP_KEYBOARD = await getTopUpKeyboard(ctx);

  await ctx.reply(ctx.t("choose_packages"), {
    reply_markup: TOP_UP_KEYBOARD,
  });
};
