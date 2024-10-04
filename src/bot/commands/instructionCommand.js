export const instructionCommand = async (ctx) => {
  try {
    await ctx.reply(
      ctx.t("instruction", {
        bot_name: `@${ctx.me.username}`,
      }),
      {
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }
    );
  } catch (error) {
    console.error("[instructionCommand][error]", error);
  }
};
