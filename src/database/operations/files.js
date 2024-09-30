import * as dotenv from "dotenv";
import { File } from "../schemas/file.js";
import { User } from "../schemas/user.js";
dotenv.config();

export const addFile = async ({ name, bin, telegramId }) => {
  try {
    const file = await getFileByName(name);
    if (file) {
      return null;
    }

    const newFile = new File({ name, bin, telegramId });
    const savedFile = await newFile.save();

    if (!savedFile?.id) {
      console.error("[addFile][error - file not saved]");
      return null;
    }
    console.info("[addFile][success]");

    const user = await User.findOne({ telegramId });
    if (!user) {
      console.error("[addFile][error - user not found]");
      return null;
    }

    user.files.push(savedFile._id);
    await user.save();

    return savedFile;
  } catch (error) {
    console.error("[addFile][error]", error);
    return null;
  }
};

export const getFileByName = async (name) => {
  try {
    const file = await File.findOne({ name });
    return file;
  } catch (error) {
    console.error("[getFileByName][error]", error);
    return null;
  }
};
