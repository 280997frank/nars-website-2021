import { checkErrorResponse, getHeaders } from "@/api";
import { METHOD } from "@/constants/base";
import type {
  TLookbookListResponse,
  TNavatarInsertResponse,
  TNavatarPayload,
  TGetNavatarResponse,
  TModelListResponse,
  THairColorResponse,
  TProductsByLookbookIdResponse,
  TSkintonesByLookbookIdResponse,
} from "@/interfaces/navatar";

// fetch lookbook list
export async function fetchLookbookList(
  gender: string,
  page: number,
  limit: number
) {
  const response = await fetch(
    `${process.env.VITE_BACKEND_URL}/look-book/list?page=${page}&limit=${limit}&gender=${gender}`,
    {
      method: METHOD.GET,
      headers: getHeaders(),
    }
  );

  const errorMessage = await checkErrorResponse(response.clone());

  if (errorMessage) {
    throw new Error(errorMessage);
  }

  const json = (await response.json()) as TLookbookListResponse;
  return json;
}

// fetch head or body 3d model
export async function fetchModelList(
  page: number,
  limit: number,
  type: string
) {
  const response = await fetch(
    `${process.env.VITE_BACKEND_URL}/3d-model/list?page=${page}&limit=${limit}&type=${type}`,
    {
      method: METHOD.GET,
      headers: getHeaders(),
    }
  );

  const errorMessage = await checkErrorResponse(response.clone());

  if (errorMessage) {
    throw new Error(errorMessage);
  }

  const json = (await response.json()) as TModelListResponse;
  return json;
}

// fetch hair color
export async function fetchHairColorList() {
  const response = await fetch(
    `${process.env.VITE_BACKEND_URL}/hair-color/list`,
    {
      method: METHOD.GET,
      headers: getHeaders(),
    }
  );

  const errorMessage = await checkErrorResponse(response.clone());

  if (errorMessage) {
    throw new Error(errorMessage);
  }

  const json = (await response.json()) as THairColorResponse;
  return json;
}

// fetch products by lookbook id
export async function fetchProductsByLookbookId(lookbookId: string) {
  const response = await fetch(
    `${process.env.VITE_BACKEND_URL}/look-book/details?lookBookId=${lookbookId}`,
    {
      method: METHOD.GET,
      headers: getHeaders(),
    }
  );

  const errorMessage = await checkErrorResponse(response.clone());

  if (errorMessage) {
    throw new Error(errorMessage);
  }

  const json = (await response.json()) as TProductsByLookbookIdResponse;
  return json;
}

// fetch skintones by lookbook id
export async function fetchSkintonesByLookbookId(
  lookbookId: string,
  type: string
) {
  const response = await fetch(
    `${process.env.VITE_BACKEND_URL}/look-book-texture/list?lookBookId=${lookbookId}&type=${type}`,
    {
      method: METHOD.GET,
      headers: getHeaders(),
    }
  );

  const errorMessage = await checkErrorResponse(response.clone());

  if (errorMessage) {
    throw new Error(errorMessage);
  }

  const json = (await response.json()) as TSkintonesByLookbookIdResponse;
  return json;
}

export async function saveNavatar(payload: TNavatarPayload) {
  const response = await fetch(`${process.env.VITE_BACKEND_URL}/navatar/save`, {
    method: METHOD.POST,
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });

  const errorMessage = await checkErrorResponse(response.clone());

  if (errorMessage) {
    throw new Error(errorMessage);
  }

  const json = (await response.json()) as TNavatarInsertResponse;
  return json;
}

export async function getNavatar() {
  const response = await fetch(
    `${process.env.VITE_BACKEND_URL}/navatar/getNavatar`,
    {
      method: METHOD.GET,
      headers: getHeaders(),
    }
  );

  const errorMessage = await checkErrorResponse(response.clone());

  if (errorMessage) {
    throw new Error(errorMessage);
  }

  const json = (await response.json()) as TGetNavatarResponse;
  return json;
}
