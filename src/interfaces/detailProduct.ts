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
