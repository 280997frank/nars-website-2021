import { defaultOptions, checkErrorResponse } from "@/api";
import { getAccessToken } from "@/utils";

interface ApiTicketResponse {
  errcode: number;
  errmsg: string;
  ticket: string;
  expires_in: number;
}

export async function getWeChatApiTicket() {
  const response = await fetch(
    `${process.env.VITE_BACKEND_URL}/user/wechat_get_ticket`,
    defaultOptions
  );
  const errorMessage = await checkErrorResponse(response.clone());

  if (errorMessage) {
    throw new Error(errorMessage);
  }

  const json = (await response.json()) as ApiTicketResponse;

  if (json.errcode) {
    throw new Error(json.errmsg);
  }

  return json;
}

interface ImageUploadResponse {
  type: "image" | "voice" | "video" | "thumb";
  media_id: string;
  created_at: number;
  errcode?: number;
  errmsg?: string;
}

export async function uploadWeChatImage(file: Blob) {
  const accessToken = getAccessToken();
  const formData = new FormData();
  formData.append("folder", "NAVATAR");
  formData.append("file", file, "my-navatar.png");

  const response = await fetch(
    `${process.env.VITE_BACKEND_URL}/user/uploadImage`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      method: "POST",
      body: formData,
    }
  );
  const errorMessage = await checkErrorResponse(response.clone());

  if (errorMessage) {
    throw new Error(errorMessage);
  }

  const json = (await response.json()) as ImageUploadResponse;

  if (json.errcode) {
    throw new Error(json.errmsg);
  }

  return json;
}
