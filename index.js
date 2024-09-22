require("dotenv").config();
const fs = require("fs");
const path = require("path");
const axios = require("axios");
const { Bot, InputFile, GrammyError, HttpError } = require("grammy");

const bot = new Bot(process.env.BOT_API_KEY);

function parseCardDetailsFromText(input) {
  const cardRegex = /(?:\b|\s)(\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4})\b/g;
  const expiryRegex = /\b(0[1-9]|1[0-2])[\s\/|-]*(\d{2}|\d{4})\b/g;
  const cvvRegex = /(?:CVV\s*:?\s*|^|\s)(\d{3})(?:\s|$|[^0-9])/g;

  let cards = [];
  let expiryDates = [];
  let cvvs = [];

  let match;

  // Extract card numbers
  while ((match = cardRegex.exec(input)) !== null) {
    cards.push(match[1].replace(/[\s-]/g, ""));
  }
  // Extract expiry dates
  while ((match = expiryRegex.exec(input)) !== null) {
    let month = match[1];
    let year = match[2];
    if (year.length === 4) {
      year = year.slice(-2); // Take only the last two digits of the year
    }
    expiryDates.push(`${month}|${year}`);
  }
  // Extract CVVs
  while ((match = cvvRegex.exec(input)) !== null) {
    cvvs.push(match[1]);
  }

  // Combine extracted data
  let parsedData = [];
  for (
    let i = 0;
    i < Math.max(cards.length, expiryDates.length, cvvs.length);
    i++
  ) {
    const card = cards[i] || null;
    const expiry = expiryDates[i] || null;
    const cvv = cvvs[i] || null;

    if (card && expiry && cvv) {
      parsedData.push(`${card}|${expiry}|${cvv}`);
    }
  }

  return parsedData.join("\n");
}

function parseCardDetailsFromHTML(input) {
  const cardRegex = /(?:\b|\s)(\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4})\b/g;
  const expiryRegex = /\b(0[1-9]|1[0-2])[\s\/|-]*(\d{2}|\d{4})\b/g;
  const cvvRegex =
    /\b(?:CVV|CVC|CSC|CVV\/CVC)\b.*?(?:<code>|<strong>)?(\d{3,4})(?:<\/code>|<\/strong>)?/gi;

  const splitHTMLInput = (input) => {
    if (/<\/?strong>/i.test(input)) {
      return input.split(/\n+/g).filter(Boolean);
    }

    return input.split(/<\/?div>/).filter(Boolean);
  };

  const blocks = splitHTMLInput(input);
  let parsedData = [];

  for (let block of blocks) {
    let cards = [];
    let expiryDates = [];
    let cvvs = [];

    let match;

    // Extract card numbers
    while ((match = cardRegex.exec(block)) !== null) {
      cards.push(match[1].replace(/[\s-]/g, ""));
    }
    // Extract expiry dates
    while ((match = expiryRegex.exec(block)) !== null) {
      let month = match[1];
      let year = match[2];
      if (year.length === 4) {
        year = year.slice(-2);
      }
      expiryDates.push(`${month}|${year}`);
    }
    // Extract CVVs
    while ((match = cvvRegex.exec(block)) !== null) {
      cvvs.push(match[1]);
    }

    for (
      let i = 0;
      i < Math.max(cards.length, expiryDates.length, cvvs.length);
      i++
    ) {
      const card = cards[i] || null;
      const expiry = expiryDates[i] || null;
      const cvv = cvvs[i] || null;

      if (card && expiry && cvv) {
        parsedData.push(`${card}|${expiry}|${cvv}`);
      }
    }
  }

  return parsedData.join("\n");
}

function parseCardDetails(input) {
  const inputHasHtml = /<\/?[a-z][\s\S]*>/i.test(input);

  if (inputHasHtml) {
    return parseCardDetailsFromHTML(input);
  } else {
    return parseCardDetailsFromText(input);
  }
}

bot.api.setMyCommands([
  {
    command: "start",
    description: "Запуск бота",
  },
]);

bot.command("start", async (ctx) => {
  await ctx.react("😎");
  await ctx.reply(
    `Приветствую, <b>${ctx.from.first_name}</b>! Отправь мне текст или файл (<i>.html, .txt</i>), и я найду нужные данные.`,
    { parse_mode: "HTML" }
  );
});

bot.on("message:text", async (ctx) => {
  await ctx.react("⚡");
  await ctx.reply("Обрабатываем...", {
    reply_to_message_id: ctx.message.message_id,
  });

  const text = ctx.message.text;
  const parsedData = parseCardDetails(text);
  const outputMsgFolder = path.join(__dirname, "output-msg");

  if (!fs.existsSync(outputMsgFolder)) fs.mkdirSync(outputMsgFolder);

  const timestamp = new Date()
    .toISOString()
    .replace("T", "-")
    .slice(0, 19)
    .replace(/:/g, "-");
  const outputPath = path.join(
    outputMsgFolder,
    `parsed-msg-${ctx.from.id}-${timestamp}.txt`
  );

  try {
    await fs.promises.writeFile(outputPath, parsedData, "utf8");
  } catch (err) {
    console.error("Error writing the parsed data to file:", err);
    ctx.reply("Произошла ошибка при сохранении обработанных данных.");
  }

  try {
    await ctx.replyWithDocument(new InputFile(outputPath));
  } catch (err) {
    console.error("Error sending the file:", err);
    ctx.reply("Произошла ошибка при отправке файла.");
  }
});

bot.on("message:document", async (ctx) => {
  await ctx.react("⚡");
  await ctx.reply("Обрабатываем...", {
    reply_to_message_id: ctx.message.message_id,
  });

  try {
    const document = ctx.message.document;
    const file = await ctx.getFile();
    const fileLink = `https://api.telegram.org/file/bot${process.env.BOT_API_KEY}/${file.file_path}`;
    const fileExt = document.file_name
      ? document.file_name.split(".").pop()
      : "txt";
    const timestamp = new Date()
      .toISOString()
      .replace("T", "-")
      .slice(0, 19)
      .replace(/:/g, "-");
    const originalFilePath = path.join(
      __dirname,
      "uploaded",
      `uploaded-doc-${ctx.from.id}-${timestamp}.${fileExt}`
    );

    const uploadedFolder = path.join(__dirname, "uploaded");
    if (!fs.existsSync(uploadedFolder)) fs.mkdirSync(uploadedFolder);

    const response = await axios({
      url: fileLink,
      method: "GET",
      responseType: "stream",
    });

    ctx.reply("Файл был успешно загружен! Продолжаю обработку..");

    const writer = fs.createWriteStream(originalFilePath);
    response.data.pipe(writer);

    writer.on("finish", async () => {
      if (fileExt === "txt" || fileExt === "html") {
        const fileContent = fs.readFileSync(originalFilePath, "utf-8");
        const parsedData = parseCardDetails(fileContent);

        if (parsedData) {
          const processedFilePath = path.join(
            __dirname,
            "output",
            `parsed-doc-${ctx.from.id}-${timestamp}.txt`
          );

          const outputDocFolder = path.join(__dirname, "output");
          if (!fs.existsSync(outputDocFolder)) fs.mkdirSync(outputDocFolder);

          fs.writeFileSync(processedFilePath, parsedData, "utf-8");

          try {
            await ctx.replyWithDocument(new InputFile(processedFilePath));

            // COMMENT: Удаляем загруженный файл после обработки
            // fs.unlinkSync(originalFilePath);
          } catch (err) {
            console.error("Ошибка при отправке файла:", err);
            ctx.reply("Произошла ошибка при отправке обработанного файла.");
          }
        } else {
          ctx.reply("В файле не найдены данные карт.");
          // COMMENT: Удаляем загруженный файл, если нет данных карт
          // fs.unlinkSync(originalFilePath);
        }
      } else {
        ctx.reply(
          "Пожалуйста, загрузите текстовый файл (форматы <i>.html, .txt</i>).",
          { parse_mode: "HTML" }
        );
        // COMMENT: Удаляем загруженный файл, если это не текстовый или HTML файл
        // fs.unlinkSync(originalFilePath);
      }
    });

    writer.on("error", (err) => {
      console.error("Ошибка при записи файла:", err);
      ctx.reply("Произошла ошибка при загрузке файла.");
    });
  } catch (err) {
    console.error("Ошибка при обработке файла:", err);
    ctx.reply("Произошла ошибка при загрузке файла.");
  }
});

bot.catch((err) => {
  const ctx = err.ctx;
  consoler.error(`Error while handling update: ${ctx.update.update_id}`);
  const e = err.error;

  if (e instanceof GrammyError) {
    consoler.error(`Error in request: ${e.description}`);
  } else if (e instanceof HttpError) {
    consoler.error(`Could not contact Telegram: ${e}`);
  } else {
    consoler.error(`Unknown error: ${e}`);
  }
});

bot.start();
