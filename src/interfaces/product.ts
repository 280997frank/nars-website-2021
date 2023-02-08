import type { Retailer } from "./retailer";

export interface IParamReactProduct {
  productId: string;
  type: string;
}

export interface IProductToWishlist {
  productId: string;
  productVariantId: string;
}

export interface IColor {
  color: string;
  label: string;
}

export interface IProduct {
  url: string;
  choosedColor: IColor;
  name: string;
}

export interface IProductImage {
  width?: number;
  source: IProduct;
}

export interface IProductImages {
  id: string;
  image: string;
  productModuleId: string;
  index: number;
}
export interface IProductThumbnails {
  id: string;
  thumbnail: string;
  productVariantId: string;
}
export interface IProductLookbooks {
  id: string;
  lookbookId: string;
  productId: string;
  lookBook: {
    id: string;
    name: string;
    thumbnail: string;
    thumbnailProduct: string;
    isActive: boolean;
    retailerId: string;
  };
}
export interface IProductVariants {
  id: string;
  name: string;
  index: number;
  hexCode: string;
  productId: string;
  productThumbnails: IProductThumbnails[];
}

export interface ILookbookProducts {
  id: string;
  productId: string;
  lookBookId: string;
  lookBook: {
    id: string;
    name: string;
    thumbnail: string;
    thumbnailProduct: string;
    gender: string;
    isActive: boolean;
    retailerId: string;
  };
}

export interface IProductDetail {
  claps: number;
  featured3dModel: string;
  id: string;
  isActive: boolean;
  isBestSeller: boolean;
  isClap: boolean;
  isFeatured: boolean;
  isLike: boolean;
  isLove: boolean;
  isNewArrival: boolean;
  likes: number;
  loves: number;
  name: string;
  productModules: IProductModules[];
  lookBookProducts: ILookbookProducts[];
  productPositions: IProductPosition[];
  productThumbnail: string;
  productVariants: IProductVariants[];
  retailer: IProductRetailer;
  retailerId: string;
  storeUrl: string;
  type: string;
}

export interface IProductRetailer {
  id: string;
  isDefault: boolean;
  languages: string;
  name: string;
  slugName: string;
}

export enum ModuleType {
  IMAGE = "image",
  LOOKBOOK = "lookbook",
  VIDEO = "video",
  TEXT = "text",
}

export interface IProductModules {
  id: string;
  index: 0;
  productId: string;
  productImages: IProductImages[];
  text: string;
  type: ModuleType;
  videoTitle: string;
  videoUrl: string;
}

export interface IProductPosition {
  position: number;
  productId: string;
  type: "regular" | "best_seller";
}

export interface IResProduct {
  data: IProductDetail;
}

export interface IProductByType {
  id: string;
  isActive: boolean;
  isBestSeller: boolean;
  isFeatured: boolean;
  featured3dModel: string;
  retailer: Retailer;
  retailerId: string;
  productPositions: IProductPosition[];
  name: string;
}

export interface IResProductList {
  data: IProductByType[];
}
