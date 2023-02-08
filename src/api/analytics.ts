import { checkErrorResponse, defaultOptions, getHeaders } from "@/api";

import type { AnalyticsType } from "@/interfaces/analytics";

export enum GuestAnalyticsType {
  CREATE_ACCOUNT = "create-account",
  CR_FEATURED = "community room-featured",
  CR_VIDEO = "community room-video",
  NH_BANNER1 = "nonstop hall-banner 1",
  NH_BANNER2 = "nonstop hall-banner 2",
  NH_BANNER3 = "nonstop hall-banner 3",
  NH_BANNER4 = "nonstop hall-banner 4",
  NH_FEATURED_PRODUCT = "nonstop hall-featured-product",
  NONSTOP_HALL = "nonstop hall",
  PRODUCT_VIDEOPLAY = "product-videoplay",
}

interface GuestAnalyticsPayload {
  type: GuestAnalyticsType;
  entryType: "start" | "end";
  guestId: string;
  id?: string;
  postId?: string;
  productId?: string;
}

interface AnalyticsPayload {
  type: AnalyticsType;
  entryType: "start" | "end";
  id?: string;
  lookBookId?: string;
  postId?: string;
  productId?: string;
  couponId?: string;
  hairColorHex?: string;
  skinToneHex?: string;
  head3dModel?: string;
  outfit3dModel?: string;
}

interface AnalyticsResponse {
  message: string;
  data: {
    userId: string;
    type: AnalyticsType;
    end: null;
    duration: null;
    id: string;
  };
  success: boolean;
}

export async function sendAnalytics(payload: AnalyticsPayload) {
  const response = await fetch(
    `${process.env.VITE_BACKEND_URL}/analytic/track`,
    {
      ...defaultOptions,
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(payload),
    }
  );

  const errorMessage = await checkErrorResponse(response.clone());

  if (errorMessage) {
    throw new Error(errorMessage);
  }

  const json = (await response.json()) as AnalyticsResponse;
  return json;
}

export async function sendGuestAnalytics(payload: GuestAnalyticsPayload) {
  const response = await fetch(
    `${process.env.VITE_BACKEND_URL}/analytic/trackGuest`,
    {
      ...defaultOptions,
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(payload),
    }
  );

  const errorMessage = await checkErrorResponse(response.clone());

  if (errorMessage) {
    throw new Error(errorMessage);
  }

  const json = (await response.json()) as AnalyticsResponse;
  return json;
}
