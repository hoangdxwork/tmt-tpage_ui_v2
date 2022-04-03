export interface ProductUOMDTO {
  Id: number;
  Name: string;
  NameNoSign: string;
  Rounding: number;
  Active?: boolean;
  Factor: number;
  FactorInv: number;
  UOMType: string;
  CategoryId: number;
  Category: ProductUOMCateDTO;
  CategoryName: string;
  Description: string;
  ShowUOMType: string;

  NameGet: string;
  ShowFactor: number;
}

export interface ProductUOMCateDTO {
  Id: number;
  Name: string;
}
