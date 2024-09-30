import { getUserWithFiles } from "../../database/operations/users.js";

export const userParsedFilesCommand = async (ctx) => {
  try {
    const telegramId = ctx.from.id;
    const user = await getUserWithFiles(telegramId);

    if (!user) {
      return await ctx.reply(ctx.t("error.profile_error"));
    }

    const userFilesFiltered = user.files.filter(
      (f) => !f.name.includes("uploaded-")
    );
    const userFiles = userFilesFiltered.map(
      (f) => `\n 📥 <code>download_${f.name}</code>`
    );

    if (userFiles.length) {
      await ctx.reply(ctx.t("uploaded_file"), { parse_mode: "HTML" });
      await ctx.reply(
        ctx.t("uploaded_files", {
          files: userFiles.join(""),
        }),
        { parse_mode: "HTML" }
      );
    } else {
      await ctx.reply(ctx.t("do_not_have_uploaded_files"));
    }
  } catch (error) {
    console.error("[userParsedFilesCommand][error]", error);
    await ctx.reply(ctx.t("error.profile_error"));
  }
};
