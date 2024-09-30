import mongoose from "mongoose";
import * as dotenv from "dotenv";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

export const connectMongoose = async () => {
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is missing");
  }

  console.info(`[connectMongoose][DB connected succesfully]`);
  return await mongoose.connect(MONGODB_URI);
};
