import { checkErrorResponse, getHeaders, defaultOptions } from "@/api";
import { METHOD } from "@/constants/base";
import type {
  IParamReactProduct,
  IProductToWishlist,
  IResProduct,
  IResProductList,
} from "@/interfaces/product";

export const getDetailProductById = async (id: string) => {
  const res = await fetch(
    `${process.env.VITE_BACKEND_URL}/product/details?productId=${id}`,
    {
      method: METHOD.GET,
      headers: getHeaders(),
    }
  );

  const errorMessage = await checkErrorResponse(res.clone());

  if (errorMessage) {
    throw new Error(errorMessage);
  }

  const json = (await res.json()) as IResProduct;
  return json;
};

export const removeReactProduct = async (body: IParamReactProduct) => {
  const res = await fetch(
    `${process.env.VITE_BACKEND_URL}/product-reaction/remove-react`,
    {
      method: METHOD.POST,
      headers: getHeaders(),
      body: JSON.stringify(body),
    }
  );

  const errorMessage = await checkErrorResponse(res.clone());

  if (errorMessage) {
    throw new Error(errorMessage);
  }

  const json = (await res.json()) as IResProduct;
  return json;
};

export const reactProduct = async (body: IParamReactProduct) => {
  const res = await fetch(
    `${process.env.VITE_BACKEND_URL}/product-reaction/react`,
    {
      method: METHOD.POST,
      headers: getHeaders(),
      body: JSON.stringify(body),
    }
  );

  const errorMessage = await checkErrorResponse(res.clone());

  if (errorMessage) {
    throw new Error(errorMessage);
  }

  const json = (await res.json()) as IResProduct;
  return json;
};

export const addProductToWishlist = async (body: IProductToWishlist) => {
  const res = await fetch(`${process.env.VITE_BACKEND_URL}/wishlist/add`, {
    method: METHOD.POST,
    headers: getHeaders(),
    body: JSON.stringify(body),
  });

  const errorMessage = await checkErrorResponse(res.clone());

  if (errorMessage) {
    throw new Error(errorMessage);
  }

  const json = await res.json();
  return json;
};

export const getProductList = async (type: string) => {
  const response = await fetch(
    `${process.env.VITE_BACKEND_URL}/product/list?type=${type}`,
    {
      ...defaultOptions,
      method: "GET",
      headers: getHeaders(),
    }
  );
  const errorMessage = await checkErrorResponse(response.clone());

  if (errorMessage) {
    throw new Error(errorMessage);
  }

  const json = await response.json();
  return json as IResProductList;
};
