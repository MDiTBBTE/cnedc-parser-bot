import axios from "axios";
import { Binary } from "mongodb";
import { InputFile } from "grammy";
import * as dotenv from "dotenv";
import { parseCardDetails } from "./parsers.js";
import { addFile, getFileByName } from "../../database/operations/files.js";
import {
  updateUserParsesByTelegramId,
  hasUserEnoughParsesByTelegramId,
} from "../../database/operations/users.js";
import { getTopUpKeyboard } from "./keyboard.js";

dotenv.config();

export const convertToUserFriendlyDate = (dateString, lang = "en") => {
  const date = new Date(dateString);
  const locale = { en: "en-US", ru: "ru-RU", ua: "uk-UA" }[lang] || "en-US";

  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  return date.toLocaleString(locale, options);
};

export const downloadFileFromTelegram = async (fileId, botToken) => {
  try {
    const fileInfoResponse = await axios.get(
      `https://api.telegram.org/bot${botToken}/getFile?file_id=${fileId}`
    );
    const filePath = fileInfoResponse.data.result.file_path;

    const fileResponse = await axios.get(
      `https://api.telegram.org/file/bot${botToken}/${filePath}`,
      { responseType: "arraybuffer" }
    );

    return fileResponse.data;
  } catch (error) {
    console.error("[downloadFileFromTelegram][error]", error);
    return null;
  }
};

export const processMessageUpload = async (ctx) => {
  const telegramId = ctx.from.id;
  const hasUserEnoughParses = await hasUserEnoughParsesByTelegramId(
    telegramId,
    "minus",
    1
  );

  // TODO: parse anyway
  if (!hasUserEnoughParses) {
    const TOP_UP_KEYBOARD = await getTopUpKeyboard(ctx);
    return ctx.reply(ctx.t("error.not_enough_parses"), {
      reply_markup: TOP_UP_KEYBOARD,
    });
  }

  const text = ctx.message.text;
  const parsedData = parseCardDetails(text);

  const timestamp = new Date()
    .toISOString()
    .replace("T", "-")
    .slice(0, 19)
    .replace(/:/g, "-");

  if (parsedData) {
    // Create a processed file and store it in MongoDB
    const processedFileName = `parsed-msg-${timestamp}.txt`;
    const savedProcessedFile = await addFile({
      name: processedFileName,
      bin: new Binary(Buffer.from(parsedData, "utf-8")), // Store processed data as Binary
      telegramId,
    });

    if (!savedProcessedFile?.id) {
      ctx.reply(ctx.t("error.save_to_db"));
      return;
    }

    // Send the processed file to the user
    const fileBuffer = savedProcessedFile.bin;
    await ctx.replyWithDocument(new InputFile(fileBuffer, processedFileName));
    await updateUserParsesByTelegramId(telegramId, "minus", 1);
  } else {
    ctx.reply(ctx.t("error.cards_not_found"));
  }
};

export const processFileUpload = async (ctx) => {
  const telegramId = ctx.from.id;
  const hasUserEnoughParses = await hasUserEnoughParsesByTelegramId(
    telegramId,
    "minus",
    1
  );

  // TODO: parse anyway
  if (!hasUserEnoughParses) {
    const TOP_UP_KEYBOARD = await getTopUpKeyboard(ctx);
    return ctx.reply(ctx.t("error.not_enough_parses"), {
      reply_markup: TOP_UP_KEYBOARD,
    });
  }

  await ctx.reply(ctx.t("general.precessing"), {
    reply_to_message_id: ctx.message.message_id,
  });

  const document = ctx.message.document;
  const fileId = document.file_id;
  const fileExt = document.file_name
    ? document.file_name.split(".").pop()
    : "txt";

  const timestamp = new Date()
    .toISOString()
    .replace("T", "-")
    .slice(0, 19)
    .replace(/:/g, "-");

  const downloadedFileFromTelegram = await downloadFileFromTelegram(
    fileId,
    process.env.BOT_TOKEN
  );

  if (!downloadedFileFromTelegram) {
    ctx.reply(ctx.t("error.download_from_telegram"));
    return;
  }

  ctx.reply(ctx.t("success.download_from_telegram"));

  const savedFile = await addFile({
    name: `uploaded-doc-${timestamp}.${fileExt}`,
    bin: new Binary(downloadedFileFromTelegram),
    telegramId,
  });

  if (!savedFile?.id) {
    ctx.reply(ctx.t("error.save_to_db_for_processing"));
    return;
  }

  if (fileExt === "txt" || fileExt === "html") {
    // Convert Binary data to string
    const fileContent = downloadedFileFromTelegram.toString("utf-8");
    const parsedData = parseCardDetails(fileContent);

    if (parsedData) {
      // Create a processed file and store it in MongoDB
      const processedFileName = `parsed-doc-${timestamp}.txt`;
      const savedProcessedFile = await addFile({
        name: processedFileName,
        bin: new Binary(Buffer.from(parsedData, "utf-8")), // Store processed data as Binary
        telegramId,
      });

      if (!savedProcessedFile?.id) {
        ctx.reply(ctx.t("error.save_to_db"));
        return;
      }

      // Send the processed file to the user
      const fileBuffer = savedProcessedFile.bin;
      await ctx.replyWithDocument(new InputFile(fileBuffer, processedFileName));
      await updateUserParsesByTelegramId(telegramId, "minus", 1);
    } else {
      ctx.reply(ctx.t("error.cards_not_found"));
    }
  } else {
    ctx.reply(ctx.t("warn.pls_send_file_with_correct_format"), {
      parse_mode: "HTML",
    });
  }
};

export const processFileDownload = async (ctx) => {
  const fileName = ctx.message.text.split("_")[1];
  const file = await getFileByName(fileName);

  if (!file?.id) {
    ctx.reply(ctx.t("error.file_not_found_in_db"), {
      reply_to_message_id: ctx.update.message.message_id,
    });
    return;
  }

  // Send the file to the user
  const fileBuffer = file.bin;
  await ctx.replyWithDocument(new InputFile(fileBuffer, fileName), {
    caption: ctx.t("msg.file_found_in_db"),
  });
};
