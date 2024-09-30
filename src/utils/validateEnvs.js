export const validateEnvs = (ENVS) => {
  const ENV = ENVS.ENV;

  if (!ENV) {
    throw new Error("ENV is required");
  }

  if (!ENVS.BOT_TOKEN) {
    throw new Error("BOT_TOKEN is required");
  }

  if (!ENVS.MONGODB_URI) {
    throw new Error("MONGODB_URI is required");
  }

  if (!ENVS.ADMIN_CHAT_ID) {
    throw new Error("ADMIN_CHAT_ID is required");
  }

  if (!ENVS.CRYPTOMUS_MERCHANT_ID) {
    throw new Error("CRYPTOMUS_MERCHANT_ID is required");
  }

  // if (!ENVS.CRYPTOMUS_API_KEY) {
  //   throw new Error("CRYPTOMUS_API_KEY is required");
  // }

  if (!ENVS.CRYPTOMUS_API_URL) {
    throw new Error("CRYPTOMUS_API_URL is required");
  }
};
