export interface IRetailerProfile {
  id: string;
  email: string;
  firstName: string;
  password: string;
  role: string;
  lastName: string;
  birthDay: string;
  countryCode: string;
  mobileNumber: string;
  experienceUsingNARS: string;
  nickname: string;
  gender: string;
  country: string;
  city: string;
  province: string;
  openid: string;
  ncoins: number;
  language: string;
  source: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  retailer: Retailer;
}

export interface Retailer {
  id: string;
  name: string;
  slugName: string;
  termsAndConditions: string;
  featuredProductId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
}

export interface IProfileInformation {
  firstName: string;
  lastName: string;
  year: string;
  month: string;
  date: string;
  gender: string;
  countryCode: string;
  mobileNumber: string;
}

export interface ProductDetail {
  id: string;
  model3dUrl: string;
}
