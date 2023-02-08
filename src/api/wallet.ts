import { defaultOptions, checkErrorResponse, getHeaders } from "@/api";
import { getAccessToken } from "../utils";
import type { IRetailerProfile } from "@/interfaces/retailer";

interface TaskResponse {
  message: string;
  success: boolean;
  data: TTaskData[];
}

export interface TTaskData {
  id: string;
  taskType: "monthly" | "onboarding" | "qrcode";
  name: string;
  description: string;
  reward: number;
  qrName?: string;
}

interface CoinHistoryResponse {
  message: string;
  success: boolean;
  data: TCoinHistory[];
}

export interface TCoinHistory {
  id: string;
  sourceName: string;
  transactionType: "deduction" | "allocation";
  value: number;
  taskType: "onboarding" | "monthly" | "qrcode";
}

export interface TCoupon {
  id: string;
  name: string;
  expiryDate: string;
  description: string;
  image: string;
  status: "redeemed" | "available" | "used";
  price: number;
}

interface CouponAvailableResponse {
  message: string;
  success: boolean;
  data: TCoupon[];
}

interface RedemDataResponse {
  message: string;
  success: boolean;
  data: {
    couponPrice: number;
    currentBalance: number;
    previousBalance: number;
  };
}

interface QRCodeResponse {
  message: string;
  success: boolean;
  data: {
    currentBalance: number;
    taskReward: number;
    userId: string;
  };
}

interface verificationCodeResponse {
  message: string;
  success: boolean;
}

interface retailerHasActiveQrCodeResponse {
  message: string;
  success: boolean;
  data: {
    retailerHasActiveQrCode: boolean;
  };
}

export async function getTasks() {
  const token = getAccessToken();
  if (token) {
    const response = await fetch(
      `${process.env.VITE_BACKEND_URL}/task/getTaskRetailer`,
      {
        ...defaultOptions,
        headers: getHeaders(),
        //   body: JSON.stringify(payload),
      }
    );
    const errorMessage = await checkErrorResponse(response.clone());

    if (errorMessage) {
      throw new Error(errorMessage);
    }

    const json = (await response.json()) as TaskResponse;
    return json;
  }
  return null;
}

export async function getCoinHistory() {
  const token = getAccessToken();
  if (token) {
    const response = await fetch(
      `${process.env.VITE_BACKEND_URL}/transaction/getMyNCoinHistory?page=1&limit=10`,
      {
        ...defaultOptions,
        headers: getHeaders(),
        //   body: JSON.stringify(payload),
      }
    );
    const errorMessage = await checkErrorResponse(response.clone());

    if (errorMessage) {
      throw new Error(errorMessage);
    }

    const json = (await response.json()) as CoinHistoryResponse;
    return json;
  }
  return null;
}

export async function getAvailableCoupons() {
  const token = getAccessToken();
  if (token) {
    const response = await fetch(
      `${process.env.VITE_BACKEND_URL}/coupon/getUserAvailableCoupons`,
      {
        ...defaultOptions,
        headers: getHeaders(),
        //   body: JSON.stringify(payload),
      }
    );
    const errorMessage = await checkErrorResponse(response.clone());

    if (errorMessage) {
      throw new Error(errorMessage);
    }

    const json = (await response.json()) as CouponAvailableResponse;
    return json;
  }
  return null;
}

export async function getHistoryCoupons() {
  const token = getAccessToken();
  if (token) {
    const response = await fetch(
      `${process.env.VITE_BACKEND_URL}/coupon/getUsersUsedCoupons`,
      {
        ...defaultOptions,
        headers: getHeaders(),
        //   body: JSON.stringify(payload),
      }
    );
    const errorMessage = await checkErrorResponse(response.clone());

    if (errorMessage) {
      throw new Error(errorMessage);
    }

    const json = (await response.json()) as CouponAvailableResponse;
    return json;
  }
  return null;
}

export async function redeemCoupon(payload) {
  const token = getAccessToken();
  if (token) {
    const response = await fetch(
      `${process.env.VITE_BACKEND_URL}/coupon/redeemCoupon`,
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

    const json = (await response.json()) as RedemDataResponse;
    return json;
  }
  return null;
}

export async function verifyCoupon(payload) {
  const token = getAccessToken();
  if (token) {
    const response = await fetch(
      `${process.env.VITE_BACKEND_URL}/coupon/verifyCoupon`,
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

    const json = (await response.json()) as verificationCodeResponse;
    return json;
  }
  return null;
}

export const setDateWord = (date: string) => {
  const locale = localStorage.getItem("locale") || "zh-CN";
  const months = [
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MAY",
    "JUNE",
    "JULY",
    "AUG",
    "SEP",
    "OCT",
    "NOV",
    "DEC",
  ];
  const newDate = new Date(date);
  const year = newDate.getFullYear();

  if (locale === "zh-CN") {
    const month = String(newDate.getMonth() + 1).padStart(2, "0");
    const day = String(newDate.getDate()).padStart(2, "0");

    return `${day}.${month}.${year}`;
  } else {
    const month = months[newDate.getMonth()];
    const day = newDate.getDate();

    return `${month} ${day}, ${year}`;
  }
};

export async function fetchProfile() {
  const token = getAccessToken();
  if (token) {
    const response = await fetch(
      `${process.env.VITE_BACKEND_URL}/user/profile`,
      {
        ...defaultOptions,
        headers: getHeaders(),
      }
    );

    const errorMessage = await checkErrorResponse(response.clone());

    if (errorMessage) {
      throw new Error(errorMessage);
    }

    const json = (await response.json()) as IRetailerProfile;
    return json;
  }
  return null;
}

export async function taskQrCode(payload) {
  const token = getAccessToken();
  if (token) {
    const response = await fetch(
      `${process.env.VITE_BACKEND_URL}/task/completeTask`,
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

    const json = (await response.json()) as QRCodeResponse;
    return json;
  }
  return null;
}

export async function fetchQRCodeStatusActive() {
  const token = getAccessToken();
  if (token) {
    const response = await fetch(
      `${process.env.VITE_BACKEND_URL}/task/retailerHasActiveQrCode`,
      {
        ...defaultOptions,
        headers: getHeaders(),
      }
    );

    const errorMessage = await checkErrorResponse(response.clone());

    if (errorMessage) {
      throw new Error(errorMessage);
    }

    const json = (await response.json()) as retailerHasActiveQrCodeResponse;
    return json;
  }
  return null;
}
