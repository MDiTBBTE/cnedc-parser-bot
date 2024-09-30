import { User } from "../schemas/user.js";

const FREE_PARSES = 1;
const FREE_CHECKS = 1;

export const addUser = async ({
  telegramUserName,
  telegramId,
  firstName,
  lastName,
}) => {
  try {
    const user = await getUserByTelegramId(telegramId);
    if (user) {
      return null;
    }

    const newUser = new User({
      telegramUserName,
      telegramId,
      firstName,
      lastName,
      lang: "en",
      parses: FREE_PARSES,
      checks: FREE_CHECKS,
    });

    const saveduser = await newUser.save();

    if (saveduser?.id) {
      console.info("[addUser][success]");
    } else {
      console.error("[addUser][error - user not saved]");
    }

    return saveduser;
  } catch (error) {
    console.error("[addUser][error]", error);
    return null;
  }
};

export const getUserByTelegramId = async (id) => {
  try {
    const user = await User.findOne({ telegramId: id });
    return user;
  } catch (error) {
    console.error("[getUserByTelegramId][error]", error);
    return null;
  }
};

export const updateUserByTelegramId = async (telegramId, update) => {
  try {
    const user = await getUserByTelegramId(telegramId);
    if (user) {
      Object.assign(user, update);
      await user.save();
      return user;
    }
    return null;
  } catch (error) {
    console.error("[updateUserByTelegramId][error]", error);
    return null;
  }
};

export const hasUserEnoughParsesByTelegramId = async (
  telegramId,
  action,
  amount
) => {
  try {
    const user = await getUserByTelegramId(telegramId);

    if (user && action) {
      if (action === "minus" && user.parses - amount < 0) {
        return false;
      }
      return true;
    }
    return false;
  } catch (error) {
    console.error("[updateUserByTelegramId][error]", error);
    return false;
  }
};

export const updateUserParsesByTelegramId = async (
  telegramId,
  action,
  amount
) => {
  try {
    const user = await getUserByTelegramId(telegramId);

    if (user && action) {
      Object.assign(user, {
        parses:
          action === "add"
            ? user.parses + amount
            : action === "minus"
              ? user.parses - amount
              : user.parses,
      });

      await user.save();
      return user;
    }
    return null;
  } catch (error) {
    console.error("[updateUserByTelegramId][error]", error);
    return null;
  }
};

export const getUserWithFiles = async (telegramId) => {
  try {
    const user = await User.findOne({ telegramId }).populate("files");
    if (!user) {
      console.error("[getUserWithFiles][error - user not found]");
      return null;
    }
    return user;
  } catch (error) {
    console.error("[getUserWithFiles][error]", error);
    return null;
  }
};
