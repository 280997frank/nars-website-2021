import { defaultOptions, checkErrorResponse, getHeaders } from "@/api";

export interface INonStopHallHotspot {
  hotspotType: string;
  postId: string;
  productId: string;
  type: string;
  post?: {
    type: "by-nars" | "by-the-community";
  };
}

export interface INonStopHall {
  [key: string]: INonStopHallHotspot;
}

export interface INonStopHallResponse {
  message: string;
  success: boolean;
  data: INonStopHall;
}

export async function getNonstopHall() {
  const response = await fetch(
    `${process.env.VITE_BACKEND_URL}/nonstop-hall/list`,
    {
      ...defaultOptions,
      method: "GET",
      headers: getHeaders(),
      //   body: JSON.stringify(payload),
    }
  );
  const errorMessage = await checkErrorResponse(response.clone());

  if (errorMessage) {
    throw new Error(errorMessage);
  }

  const json = (await response.json()) as INonStopHallResponse;
  return json;
}
