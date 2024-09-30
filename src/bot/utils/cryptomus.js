import axios from "axios";
import crypto from "crypto";
import * as dotenv from "dotenv";
dotenv.config();

const getCryptomusHeader = (payload) => {
  const sign = crypto
    .createHash("md5")
    .update(
      Buffer.from(JSON.stringify(payload)).toString("base64") +
        process.env.CRYPTOMUS_API_KEY
    )
    .digest("hex");

  return {
    merchant: process.env.CRYPTOMUS_MERCHANT_ID,
    sign,
  };
};

export const createCryptomusInvoice = async (amount, orderId, currency) => {
  try {
    const payload = {
      amount: amount.toString(),
      currency: currency || "USD",
      order_id: orderId || crypto.randomBytes(12).toString("hex"),
      url_callback: "https://t.me/parse_some_data_bot",
    };

    const response = await axios.post(
      `${process.env.CRYPTOMUS_API_URL}/payment`,
      payload,
      { headers: getCryptomusHeader(payload) }
    );

    console.warn("[createCryptomusInvoice][response]", response?.data);

    return response?.data;
  } catch (error) {
    console.error("[createCryptomusInvoice][error]", error.response.data);
  }
};

export const checkCryptomusPayment = async (id) => {
  try {
    const payload = {
      uuid: id,
    };

    const response = await axios.post(
      `${process.env.CRYPTOMUS_API_URL}/info`,
      payload,
      { headers: getCryptomusHeader(payload) }
    );

    console.warn("[checkCryptomusPayment][response]", response?.data);

    return response?.data;
  } catch (error) {
    console.error("[checkCryptomusPayment][error]", error);
  }
};
