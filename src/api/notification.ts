import { checkErrorResponse, getHeaders, defaultOptions } from "@/api";

export async function fetchNotifications(page: number) {
  const response = await fetch(
    `${process.env.VITE_BACKEND_URL}/notification/list?page=${page}&limit=10&orderBy=updatedAt&sortBy=DESC`,
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
