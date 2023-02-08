import { checkErrorResponse, defaultOptions, getHeaders } from "@/api/index";

export interface DataTaskMonthly {
  id: string;
  taskType: string;
  name: string;
  description: string;
  reward: number;
  createdAt: Date;
}

export interface ResponseTaskMonthly {
  message: string;
  data: DataTaskMonthly[];
  success: boolean;
}

export async function getTaskMonthly() {
  const response = await fetch(
    `${process.env.VITE_BACKEND_URL}/task/getTaskMonthly`,
    {
      ...defaultOptions,
      headers: getHeaders(),
    }
  );
  const errorMessage = await checkErrorResponse(response.clone());
  if (errorMessage) {
    throw new Error(errorMessage);
  }
  const json = (await response.json()) as ResponseTaskMonthly;
  return json;
}

export enum EAvailableTasks {
  ScanQRCode = "ScanQRCode",
  Register = "Register",
  BrowseThreeProducts = "BrowseThreeProducts",
  ReactToAProduct = "ReactToAProduct",
  ReactToAPost = "ReactToAPost",
  CreateYourOwnAvatar = "CreateYourOwnAvatar",
  TryOnLook = "TryOnLook",
  AddProductToWishlist = "AddProductToWishlist",
  MonthlyGift = "MonthlyGift",
  Game = "Game",
  ReactToAPostOneTime = "ReactToAPostOneTime",
}

interface CompleteTaskResponse {
  message: string;
  data: {
    userId: string;
    currentBalance: number;
  };
  success: boolean;
}

export async function completeTask(
  taskName: EAvailableTasks,
  lookbookId?: string
) {
  const payload: Record<string, EAvailableTasks | string> = {
    task: taskName,
  };

  if (lookbookId) {
    payload.lookBookId = lookbookId;
  }

  const response = await fetch(
    `${process.env.VITE_BACKEND_URL}/task/completeTask`,
    {
      ...defaultOptions,
      headers: getHeaders(),
      method: "POST",
      body: JSON.stringify(payload),
    }
  );
  const errorMessage = await checkErrorResponse(response.clone());

  if (errorMessage) {
    throw new Error(errorMessage);
  }

  const json = (await response.json()) as CompleteTaskResponse;
  return json;
}
