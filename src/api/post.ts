import { defaultOptions, checkErrorResponse, getHeaders } from "@/api";
import queryString from "query-string";
// import { getAccessToken } from "@/utils";
export enum typePost {
  byNars = "by-nars",
  byCommunity = "by-the-community",
}
export enum TPostReaction {
  love = "love",
  like = "like",
  clap = "clap",
}
interface PostsByCategoryPayload {
  type: typePost;
  page: number;
  limit: number;
  orderBy: string;
  sortBy: string;
  postId: string;
}
export interface TPostAssest {
  id: string;
  postId: string;
  url: string;
  type: "image" | "video";
  index: number;
}
/* interface TProductImages {
  id: string;
  image: string;
}

interface TProductThumbnail {
  id: string;
  thumbnail: string;
} */

interface TproductVariants {
  id: string;
  name: string;
}
interface TProductPost {
  id: string;
  // productImages: TProductImages[];
  productVariants: TproductVariants[];
  productThumbnail: string;
  name: string;
}
export interface TPostProduct {
  id: string;
  productId: string;
  product: TProductPost;
}

export enum ModuleType {
  RED = "red",
  WEIBO = "weibo",
  VIDEO = "video",
  TEXT = "text",
}

export interface PostModuleAsset {
  id: string;
  postModuleId: string;
  url: string;
  type: "image" | "video";
  index: number;
}

export interface PostModule {
  id: string;
  postId: string;
  type: ModuleType;
  content?: string;
  index: number;
  postModuleAssets: PostModuleAsset[];
}

export interface TPostData {
  id: string;
  title: string;
  type: string;
  platform: string;
  isFeatured: boolean;
  date: string;
  authorName: string;
  authorImage: string;
  content: string;
  layout: string;
  isActive: boolean;
  isLike: boolean;
  totalLike: number;
  isLove: boolean;
  totalLove: number;
  isClap: boolean;
  totalClap: number;
  postAssets: TPostAssest[];
  postProducts: TPostProduct[];
  postModules: PostModule[];
}

export interface PostsByCategoryResponse {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
  data: TPostData[];
}
export interface PostsReactionResponse {
  message: string;
  success: boolean;
  data: TPostData[];
}

export interface postReactionPayload {
  type: TPostReaction;
  postId: string;
}

export interface addWishlistPayload {
  productId: string;
  productVariantId: string;
}
export interface addWishlistResponse {
  id: string;
  productId: string;
  productVariantId: string;
  userId: string;
}
// const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjhjNDg2OWUwLTlhZDUtNDc2Yy1hMDgyLWEzYjBmNTVkMDBlYyIsImlhdCI6MTY0MTUyMjkzNiwiZXhwIjoxNjQxNjA5MzM2fQ.FksXTk-9mNT-5qbe9t_7bhDcYbL8UNnDA7C52SHwb1M"
export async function getPostsBYCategory(payload: PostsByCategoryPayload) {
  const response = await fetch(
    `${
      process.env.VITE_BACKEND_URL
    }/post/postsByCategory?${queryString.stringify(payload)}`,
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

  const json = (await response.json()) as PostsByCategoryResponse;
  return json;
}

export async function postReaction(payload: postReactionPayload) {
  const response = await fetch(
    `${process.env.VITE_BACKEND_URL}/post/reaction`,
    {
      ...defaultOptions,
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(payload),
    }
  );
  const errorMessage = await checkErrorResponse(response.clone());

  if (errorMessage) {
    throw new Error(errorMessage);
  }

  const json = (await response.json()) as PostsReactionResponse;
  return json;
}

export async function postRemoveReaction(payload: postReactionPayload) {
  const response = await fetch(
    `${process.env.VITE_BACKEND_URL}/post/removeReaction`,
    {
      ...defaultOptions,
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(payload),
    }
  );
  const errorMessage = await checkErrorResponse(response.clone());

  if (errorMessage) {
    throw new Error(errorMessage);
  }

  const json = (await response.json()) as PostsReactionResponse;
  return json;
}

export async function addWishlistPost(payload: addWishlistPayload) {
  const response = await fetch(`${process.env.VITE_BACKEND_URL}/wishlist/add`, {
    ...defaultOptions,
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });
  const errorMessage = await checkErrorResponse(response.clone());

  if (errorMessage) {
    throw new Error(errorMessage);
  }

  const json = (await response.json()) as addWishlistResponse;
  return json;
}

interface PostByIdResponse {
  message: string;
  success: boolean;
  data: TPostData;
}

export async function getPostById(postId: string) {
  const response = await fetch(
    `${process.env.VITE_BACKEND_URL}/post/detail?id=${postId}`,
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

  const json = (await response.json()) as PostByIdResponse;
  return json;
}
