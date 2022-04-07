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


export interface ProductUOMDTOV2 {
  Id: number;
  Name: string;
  NameNoSign: string;
  Rounding: number;
  Active: boolean;
  Factor: number;
  FactorInv: number;
  UOMType: string;
  CategoryId: number;
  CategoryName: string;
  Description?: any;
  ShowUOMType: string;
  NameGet?: any;
  ShowFactor: number;
}

export interface OdataProductUOMDTOV2 {
  "@odata.context": string;
  "@odata.count": number;
  value: ProductUOMDTOV2[];
}
