import { getUserWithFiles } from "../../database/operations/users.js";
import { convertToUserFriendlyDate } from "../utils/index.js";
import { InputFile } from "grammy";
import path from "path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const videoPath = path.resolve(
  __dirname,
  "../../../",
  "src/assets/profile.mp4"
);

export const profileCommand = async (ctx) => {
  try {
    const userId = ctx.from.id;
    const user = await getUserWithFiles(userId);

    if (!user) {
      return await ctx.reply(ctx.t("error.profile_error"));
    }
    // TODO: change to our video
    await ctx.replyWithVideo(new InputFile(videoPath), {
      caption: ctx.t("profile", {
        telegram_id: String(user.telegramId),
        name: `${user.firstName} ${user.lastName}`,
        registration_date: convertToUserFriendlyDate(
          user.createdAt,
          user?.lang || "en"
        ),
        parsed_files: user.files.filter((f) => !f.name.includes("uploaded-"))
          .length,
        parses: user.parses,
        checks: user.checks,
      }),
    });

    // await ctx.reply(
    //   ctx.t("profile", {
    //     telegram_id: String(user.telegramId),
    //     name: `${user.firstName} ${user.lastName}`,
    //     registration_date: convertToUserFriendlyDate(user.createdAt),
    //     parsed_files: user.files.filter((f) => !f.name.includes("uploaded-"))
    //       .length,
    //     parses: user.parses,
    //     checks: user.checks,
    //   })
    // );
  } catch (error) {
    console.error("[profileCommand][error]", error);
    await ctx.reply(ctx.t("error.profile_error"));
  }
};
