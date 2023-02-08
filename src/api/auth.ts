import { checkErrorResponse, getHeaders } from "@/api";

interface VerificationCodePayload {
  countryCode: string;
  mobileNumber: string;
}

interface VerificationCodeResponse {
  id: string;
  otp: number;
}

export async function getVerificationCode(payload: VerificationCodePayload) {
  const response = await fetch(`${process.env.VITE_BACKEND_URL}/otp/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  const errorMessage = await checkErrorResponse(response.clone());

  if (errorMessage) {
    throw new Error(errorMessage);
  }

  const json = (await response.json()) as VerificationCodeResponse;
  return json;
}

interface SignupPayload {
  firstName: string;
  lastName: string;
  countryCode: string;
  mobileNumber: string;
  birthDay: string;
  gender?: "male" | "female";
  experienceUsingNARS: "using" | "tried-it" | "never";
  source: "regular" | "wechat";
  otp: number;
  thumbnail: string;
  marketingConsent: boolean;
}

interface SignupResponse {
  id: string;
  token: string;
}

export async function signup(payload: SignupPayload) {
  const response = await fetch(`${process.env.VITE_BACKEND_URL}/user/signup`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(payload),
  });
  const errorMessage = await checkErrorResponse(response.clone());

  if (errorMessage) {
    throw new Error(errorMessage);
  }

  const json = (await response.json()) as SignupResponse;
  return json;
}

interface WeChatResponse {
  access_token: string;
  refresh_token: string;
  openid: string;
  profile: {
    openid: string;
    nickname: string;
    sex: number;
    language: string;
    city: string;
    province: string;
    country: string;
    headimgurl: string;
    privilege: string[];
    unionid: string;
    errcode?: string;
    errmsg?: string;
  };
  response: {
    access_token: string;
    expires_in: number;
    refresh_token: string;
    openid: string;
    scope: string;
    unionid: string;
    errcode?: string;
    errmsg?: string;
  };
  token?: string;
  firstName?: string;
  lastName?: string;
  thumbnail?: string;
}

export async function getOpenId(code: string) {
  const response = await fetch(
    `${process.env.VITE_BACKEND_URL}/user/wechat_get_token?code=${code}`,
    {
      headers: {
        "Content-Type": "application/json",
      },
      method: "GET",
    }
  );
  const errorMessage = await checkErrorResponse(response.clone());

  if (errorMessage) {
    if (errorMessage === "unknown") {
      const json = (await response.json()) as WeChatResponse;
      throw new Error(`${json.profile.errcode}: ${json.profile.errmsg}`);
    } else {
      throw new Error(errorMessage);
    }
  }

  const json = (await response.json()) as WeChatResponse;
  return json;
}

interface LoginPayload {
  countryCode: string;
  mobileNumber: string;
  otp: number;
}

interface LoginResponse {
  firstName: string;
  lastName: string;
  token: string;
  thumbnail: string | null;
}

export async function login(payload: LoginPayload) {
  const response = await fetch(`${process.env.VITE_BACKEND_URL}/user/login`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(payload),
  });
  const errorMessage = await checkErrorResponse(response.clone());

  if (errorMessage) {
    throw new Error(errorMessage);
  }

  const json = (await response.json()) as LoginResponse;
  return json;
}

interface LogoutResponse {
  message: string;
  data: null;
  success: boolean;
}

export async function logout() {
  const response = await fetch(`${process.env.VITE_BACKEND_URL}/user/logout`, {
    headers: getHeaders(),
    method: "POST",
  });
  const errorMessage = await checkErrorResponse(response.clone());

  if (errorMessage) {
    throw new Error(errorMessage);
  }

  const json = (await response.json()) as LogoutResponse;
  return json;
}
