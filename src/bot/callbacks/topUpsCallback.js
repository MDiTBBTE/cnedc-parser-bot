import {
  TOP_UP_10_BALANCE_KEYBOARD_VALUE,
  TOP_UP_22_BALANCE_KEYBOARD_VALUE,
  TOP_UP_100_BALANCE_KEYBOARD_VALUE,
  TOP_UP_190_BALANCE_KEYBOARD_VALUE,
  TOP_UP_350_BALANCE_KEYBOARD_VALUE,
} from "../commands/topUpCommand.js";
import { sendMessageToAdminChat } from "../utils/adminChat.js";
import { createCryptomusInvoice } from "../utils/cryptomus.js";

export const hasTopUpsValues = async (ctx) => {
  const requestedTopUp = ctx.callbackQuery.data;

  const hasTopUpsValue = [
    TOP_UP_10_BALANCE_KEYBOARD_VALUE,
    TOP_UP_22_BALANCE_KEYBOARD_VALUE,
    TOP_UP_100_BALANCE_KEYBOARD_VALUE,
    TOP_UP_190_BALANCE_KEYBOARD_VALUE,
    TOP_UP_350_BALANCE_KEYBOARD_VALUE,
  ].includes(requestedTopUp);

  return hasTopUpsValue;
};

export const topUpsCallback = async (ctx) => {
  const requestedTopUpPrice = ctx.callbackQuery.data.split("_")[2];
  const requestedTopUpAmount = ctx.callbackQuery.data.split("_")[3];

  await sendMessageToAdminChat(
    ctx,
    ctx.t("admin.buy_package", {
      name: `*${ctx.from.first_name}*`,
      username: `@${ctx.from.username}`,
      id: String(ctx.from.id),
      amount: requestedTopUpAmount,
      price: requestedTopUpPrice,
    }),
    { parse_mode: "Markdown" }
  );

  // TODO: if invoice is created, add uuid to the session to check if it's payed
  //        after payment remove uuid
  //        Also add checkCryptomusPayment continuosly to check the payment
  const cryptomusInvoiceResponseData =
    await createCryptomusInvoice(requestedTopUpAmount);

  if (
    cryptomusInvoiceResponseData &&
    cryptomusInvoiceResponseData?.result?.url
  ) {
    return await ctx.reply(
      ctx.t("msg.top_up_message_cryptomus", {
        price: requestedTopUpPrice,
        amount: requestedTopUpAmount,
        url: cryptomusInvoiceResponseData.result.url,
      }),
      {
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }
    );
  }

  return await ctx.reply(
    ctx.t("profile.top_up_message", {
      requestedTopUpPrice,
      requestedTopUpAmount,
    }),
    {
      parse_mode: "HTML",
      disable_web_page_preview: true,
    }
  );
};
