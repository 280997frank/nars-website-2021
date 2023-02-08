import { checkErrorResponse, defaultOptions } from "@/api";
import { getAccessToken } from "@/utils";
import queryString from "query-string";

export interface IUpdateProfilePayload {
  firstName: string;
  lastName: string;
  birthday: string;
  phoneNumber: string;
}

export interface productImages {
  image: string;
}

interface productVariant {
  name: string;
  hexCode: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  productThumbnail: string;
  storeUrl: string;
}

export interface WishlistData {
  id: string;
  productId: string;
  productVariant: productVariant | null;
  product: Product;
}

export interface WishlistResponse {
  success: boolean;
  data: WishlistData[];
}

export async function updateProfile(payload: IUpdateProfilePayload) {
  const response = await fetch(`${process.env.VITE_BACKEND_URL}/user/signup`, {
    ...defaultOptions,
    method: "POST",
    body: JSON.stringify(payload),
  });
  const errorMessage = await checkErrorResponse(response.clone());

  if (errorMessage) {
    throw new Error(errorMessage);
  }

  const json = (await response.json()) as string;
  return json;
}

export async function getWishlist() {
  const response = await fetch(
    `${process.env.VITE_BACKEND_URL}/wishlist/list`,
    {
      ...defaultOptions,
      method: "GET",
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
        "Content-Type": "application/json",
      },
      //   body: JSON.stringify(payload),
    }
  );
  const errorMessage = await checkErrorResponse(response.clone());

  if (errorMessage) {
    throw new Error(errorMessage);
  }

  const json = (await response.json()) as WishlistResponse;
  return json;
}

interface ProductByIdParams {
  productId: string;
}

export async function getWishProductById(payload: ProductByIdParams) {
  const response = await fetch(
    `${process.env.VITE_BACKEND_URL}/product/details?${queryString.stringify(
      payload
    )}`,
    {
      ...defaultOptions,
      method: "GET",
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
        "Content-Type": "application/json",
      },
    }
  );
  const errorMessage = await checkErrorResponse(response.clone());

  if (errorMessage) {
    throw new Error(errorMessage);
  }

  const json = (await response.json()) as WishlistResponse;
  return json;
}

interface DeleteWishParams {
  wishlistId: string;
}

export async function deleteWishProductById(payload: DeleteWishParams) {
  const response = await fetch(
    `${process.env.VITE_BACKEND_URL}/wishlist/delete`,
    {
      ...defaultOptions,
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
        "Content-Type": "application/json",
      },
    }
  );
  const errorMessage = await checkErrorResponse(response.clone());

  if (errorMessage) {
    throw new Error(errorMessage);
  }

  const json = (await response.json()) as WishlistResponse;
  return json;
}
