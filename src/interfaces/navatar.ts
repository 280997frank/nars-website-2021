// BASE TYPE
export enum SkintonesEnum {
  BEST_SELLER = "best_seller",
  REGULAR = "regular",
}

export interface TLookbook {
  id: string;
  name: string;
  thumbnail: string;
  thumbnailProduct: string;
  isActive: boolean;
}

export interface TModel {
  id: string;
  type: string;
  name: string;
  gender: string;
  product3dModel: string;
  thumbnail: string;
  isActive: true;
}

export interface TNavatarPayload {
  skinToneHex: string;
  hairColorHex: string;
  head3dModel: string;
  outfit3dModel: string;
  lookBookId: string;
  lookBookTexture: string;
}

// =====================================
// RESPONSES
export interface TLookbookListResponse {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
  data: TLookbook[];
}

export interface THairColorResponse {
  success: boolean;
  data: {
    id: string;
    colorName: string;
    colorHex: string;
  }[];
}

export interface TModelListResponse {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
  data: TModel[];
}

interface LookbookProduct {
  product: {
    id: string;
    type: string;
    name: string;
    storeUrl: string;
    featured3dModel: string;
    productThumbnail: string;
  };
}

export interface TProductsByLookbookIdResponse {
  success: boolean;
  data: {
    lookBookProducts: LookbookProduct[];
  };
}

export interface TSkintonesByLookbookIdResponse {
  success: boolean;
  data: {
    id: string;
    lookBookId: string;
    url: string;
    skinToneName: string;
    hexCode: string;
    type: string;
  }[];
}

// ======================================
// INSERT NAVATAR
export interface TNavatarInsertResponse {
  message: string;
  data: {
    id: string;
    userId: string;
    lookBookId: string;
    model3dHairId: string;
    model3dFaceId: string;
    model3dOutfitId: string;
  };
  success: boolean;
}

// GET NAVATAR
export interface TGetNavatarResponse {
  message: string;
  data: {
    hairColorHex: string;
    head3dModel: string;
    id: string;
    lookBookId: string;
    lookBookTexture: string;
    outfit3dModel: string;
    skinToneHex: string;
    userId: string;
  };
  success: true;
}
