// import { toasts } from "svelte-toasts";
import { nanoid } from "nanoid/non-secure";

import { getWeChatApiTicket } from "@/api/wechat";

export const initializeWeChatApi = async (url: string) => {
  const encoder = new TextEncoder();
  const nonceStr = nanoid();
  const timestamp = Date.now();
  let apiTicket = "";

  try {
    const apiTicketResponse = await getWeChatApiTicket();
    apiTicket = apiTicketResponse.ticket;

    const signaturePayload = {
      jsapi_ticket: apiTicket,
      noncestr: nonceStr,
      timestamp,
      // url: `${location.protocol}//${location.host}${location.pathname}`
      url,
    };

    const rawSignature = Object.entries(signaturePayload)
      .map(([key, val]) => `${key}=${val}`)
      .join("&");
    const data = encoder.encode(rawSignature);
    const hash = await crypto.subtle.digest("SHA-1", data);
    const hashArray = Array.from(new Uint8Array(hash));
    const signature = hashArray
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    window.wx.config({
      debug: false,
      appId: process.env.VITE_WECHAT_MINI_PROGRAM_APP_ID,
      timestamp,
      nonceStr,
      signature,
      jsApiList: ["downloadImage"],
    });

    window.wx.error((res) => {
      /* alert(
        JSON.stringify(
          {
            apiTicket,
            appId: process.env.VITE_WECHAT_MINI_PROGRAM_APP_ID,
            timestamp,
            nonceStr,
            signature,
            url,
          },
          null,
          2
        )
      ); */
      // toasts.error("JS API Initialization Error", res.errMsg);
      console.error("JS API Initialization Error", res.errMsg);
    });
  } catch (error) {
    // toasts.error("API Ticket Error", error.message);
    console.error("API Ticket Error", error.message);
  }
};
