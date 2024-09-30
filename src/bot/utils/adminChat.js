import * as dotenv from "dotenv";
dotenv.config();

export const sendMessageToAdminChat = async (ctx, message, options = {}) => {
  await ctx.api.sendMessage(process.env.ADMIN_CHAT_ID, message, options);
};
