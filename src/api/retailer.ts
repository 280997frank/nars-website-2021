import { checkErrorResponse, getHeaders, defaultOptions } from "@/api";
import { METHOD } from "@/constants/base";
import type { IRetailerProfile, Retailer } from "@/interfaces/retailer";
import { getAccessToken } from "../utils";

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

export interface IUpdateProfilePayload {
  firstName: string;
  lastName: string;
  birthday: string;
  mobileNumber: string;
}

export async function updateProfile(payload: IUpdateProfilePayload) {
  const response = await fetch(`${process.env.VITE_BACKEND_URL}/user/signup`, {
    ...defaultOptions,
    method: METHOD.POST,
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });
  const errorMessage = await checkErrorResponse(response.clone());

  if (errorMessage) {
    throw new Error(errorMessage);
  }

  const json = (await response.json()) as string;
  return json;
}

export async function firstFetchProfile(token: string) {
  const response = await fetch(`${process.env.VITE_BACKEND_URL}/user/profile`, {
    ...defaultOptions,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  const errorMessage = await checkErrorResponse(response.clone());

  if (errorMessage) {
    throw new Error(errorMessage);
  }

  const json = (await response.json()) as IRetailerProfile;
  return json;
}

export async function fetchRetailers() {
  const options = {
    ...defaultOptions,
    headers: getHeaders(),
  };

  delete options.headers["Retailer-Name"];

  const response = await fetch(
    `${process.env.VITE_BACKEND_URL}/retailer/list`,
    options
  );

  const errorMessage = await checkErrorResponse(response.clone());

  if (errorMessage) {
    throw new Error(errorMessage);
  }

  const json = (await response.json()) as Retailer[];
  return json;
}

export async function updateRetailer(id: string) {
  const response = await fetch(
    `${process.env.VITE_BACKEND_URL}/user/update_retailer`,
    {
      ...defaultOptions,
      method: METHOD.POST,
      headers: getHeaders(),
      body: JSON.stringify({ id }),
    }
  );

  const errorMessage = await checkErrorResponse(response.clone());

  if (errorMessage) {
    throw new Error(errorMessage);
  }

  const json = (await response.json()) as IRetailerProfile;
  return json;
}

export interface FeaturedProduct {
  id: string;
  isFeatured: boolean;
  featured3dModel: string;
}

interface RetailerDetail {
  name: string;
  featuredProducts: FeaturedProduct[];
  languages?: string[];
}

export async function getMyRetailer() {
  const response = await fetch(
    `${process.env.VITE_BACKEND_URL}/retailer/detail`,
    {
      ...defaultOptions,
      headers: getHeaders(),
    }
  );

  const errorMessage = await checkErrorResponse(response.clone());

  if (errorMessage) {
    throw new Error(errorMessage);
  }

  const json = (await response.json()) as RetailerDetail;
  return json;
}

export async function getMyRetailerByName(retailerName: string) {
  const response = await fetch(
    `${process.env.VITE_BACKEND_URL}/retailer/detail-by-slug?slugName=${retailerName}`,
    {
      ...defaultOptions,
      headers: getHeaders(),
    }
  );

  const errorMessage = await checkErrorResponse(response.clone());

  if (errorMessage) {
    throw new Error(errorMessage);
  }

  const json = (await response.json()) as RetailerDetail;
  return json;
}
