export const aboutUsCommand = async (ctx) => {
  try {
    await ctx.reply(ctx.t("info"), { parse_mode: "HTML" });
  } catch (error) {
    console.error("[aboutUsCommand][error]", error);
  }
};
