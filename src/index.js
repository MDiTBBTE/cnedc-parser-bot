import * as dotenv from "dotenv";
import { validateEnvs } from "./utils/validateEnvs.js";
import { runBot } from "./bot/index.js";
import { connectMongoose } from "./database/connectMongoose.js";

dotenv.config();

const ENVS = process.env;
validateEnvs(ENVS);

const runApp = async () => {
  try {
    await connectMongoose()
      .then(() => {
        runBot();
        console.error(`[runApp][Bot is running...]`);
      })
      .catch((error) => {
        console.error(`[runApp][Error on connect db]`, error);
      });
  } catch (error) {
    console.error(`[runApp][Error on running a bot]`, error);
  }
};

runApp();
