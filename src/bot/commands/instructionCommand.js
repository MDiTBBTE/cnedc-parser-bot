export const instructionCommand = async (ctx) => {
  try {
    await ctx.reply(ctx.t("instruction"), { parse_mode: "HTML" });
  } catch (error) {
    console.error("[instructionCommand][error]", error);
  }
};
