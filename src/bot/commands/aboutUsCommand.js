export const aboutUsCommand = async (ctx) => {
  try {
    await ctx.reply(ctx.t("info"), {
      parse_mode: "HTML",
      disable_web_page_preview: true,
    });
  } catch (error) {
    console.error("[aboutUsCommand][error]", error);
  }
};
