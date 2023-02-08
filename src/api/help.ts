import { checkErrorResponse, defaultOptions, getHeaders } from "@/api";

export async function fetchHelpList(page: number) {
  //&orderBy=updatedAt&sortBy=DESC
  const response = await fetch(
    `${process.env.VITE_BACKEND_URL}/help/list?page=${page}&limit=15`,
    {
      ...defaultOptions,
      headers: getHeaders(),
    }
  );

  const errorMessage = await checkErrorResponse(response.clone());

  if (errorMessage) {
    throw new Error(errorMessage);
  }

  const json = await response.json();
  return json;
}
