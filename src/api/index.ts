import { get } from "svelte/store";
import { navigate } from "svelte-routing";

import { getAccessToken, removeAccessToken } from "@/utils";

import abortControllerStore from "@/stores/abortController";
import { isWelcomeModalShown as isWelcomeModalShownStore } from "@/stores/welcomeModal";

const abortController = get(abortControllerStore);
const retailerName = location.pathname.split("/")[1];

export const defaultOptions = {
  method: "GET",
  signal: abortController.signal,
  headers: {
    "Content-Type": "application/json",
    "Retailer-Name": retailerName,
  },
};

export async function checkErrorResponse(response: Response) {
  let errorMessage = "";
  const clonedResponse = response.clone();

  if (!response.ok) {
    try {
      const json = await response.json();
      if (json.message) {
        errorMessage = json.message;
      } else {
        errorMessage = "unknown";
      }
    } catch (error) {
      const text = await clonedResponse.text();
      errorMessage = text;
    }
  }

  const errorMsgInLowerCase = errorMessage.toLowerCase().trim();
  const INVALID_TOKEN_ERROR_MESSAGES = [
    "token expired",
    "failed to verify token",
  ];

  if (INVALID_TOKEN_ERROR_MESSAGES.includes(errorMsgInLowerCase)) {
    // abortController.abort();
    removeAccessToken();
    navigate(`/${retailerName}`);
    setTimeout(() => {
      isWelcomeModalShownStore.update(() => true);
    }, 2000);
  }

  return errorMessage;
}

export const getHeaders = () => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "Retailer-Name": retailerName,
  };
  const token = getAccessToken();

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};
