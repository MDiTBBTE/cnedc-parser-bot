import { run } from "@grammyjs/runner";
import { bot } from "./bot.js";

const runBot = async () => {
  if (!bot.isInited()) {
    run(bot);
  }
};

export { runBot };
