export interface ProductUOM {
  Id: number;
  Name: string;
  NameNoSign?: any;
  Rounding: number;
  Active: boolean;
  Factor: number;
  FactorInv: number;
  UOMType: string;
  CategoryId: number;
  CategoryName: string;
  Description?: any;
  ShowUOMType: string;
  NameGet: string;
  ShowFactor: number;
}

export interface Account {
  Id: number;
  Name: string;
  Code: string;
  UserTypeId: number;
  UserTypeName?: any;
  Active: boolean;
  Note?: any;
  CompanyId: number;
  CompanyName?: any;
  CurrencyId?: any;
  InternalType?: any;
  NameGet: string;
  Reconcile: boolean;
}

export interface FSOrderLines {
  '@odata.context'?: string;
  Id: number;
  ProductId: number;
  ProductUOMId: number;
  PriceUnit: number;
  ProductUOMQty: number;
  UserId?: any;
  Discount: number;
  Discount_Fixed: number;
  PriceTotal?: any;
  PriceSubTotal?: any;
  Weight: number;
  WeightTotal?: any;
  AccountId: number;
  PriceRecent: number;
  Name?: any;
  IsName: boolean;
  ProductName?: any;
  ProductUOMName?: any;
  SaleLineIds: any[];
  ProductNameGet?: any;
  SaleLineId?: any;
  Type: string;
  PromotionProgramId?: any;
  Note?: any;
  ProductBarcode?: any;
  CompanyId?: any;
  PartnerId?: any;
  PriceSubTotalSigned?: any;
  PromotionProgramComboId?: any;
  LiveCampaign_DetailId?: any;
  ProductUOM: ProductUOM;
  Account: Account;
}
