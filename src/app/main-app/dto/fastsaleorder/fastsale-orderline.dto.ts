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

export interface User {
  Avatar?: any;
  Email?: any;
  Name: string;
  Id: string;
  UserName?: any;
  PasswordNew?: any;
  CompanyId: number;
  CompanyName?: any;
  Image?: any;
  Subffix?: any;
  Active: boolean;
  Barcode?: any;
  PosSecurityPin?: any;
  GroupRefs: any[];
  InGroupPartnerManager: boolean;
  PartnerId?: any;
  LastUpdated?: any;
  Functions: any[];
  Fields: any[];
  PhoneNumber?: any;
  Roles: any[];
}

export interface Product {
  Id: number;
  EAN13?: any;
  DefaultCode?: any;
  NameTemplate: string;
  NameNoSign?: any;
  ProductTmplId: number;
  UOMId: number;
  UOMName: string;
  UOMPOId: number;
  QtyAvailable: number;
  VirtualAvailable: number;
  OutgoingQty?: any;
  IncomingQty?: any;
  NameGet: string;
  POSCategId?: any;
  Price?: any;
  Barcode?: any;
  Image?: any;
  ImageUrl: string;
  PriceVariant: number;
  SaleOK: boolean;
  PurchaseOK: boolean;
  DisplayAttributeValues?: any;
  LstPrice: number;
  Active: boolean;
  ListPrice: number;
  PurchasePrice?: any;
  DiscountSale?: any;
  DiscountPurchase?: any;
  StandardPrice: number;
  Weight: number;
  OldPrice?: any;
  IsDiscount: boolean;
  ProductTmplEnableAll: boolean;
  Version: number;
  Description?: any;
  LastUpdated?: any;
  Type: string;
  CategId: number;
  CostMethod?: any;
  InvoicePolicy: string;
  Variant_TeamId: number;
  Name: string;
  PropertyCostMethod?: any;
  PropertyValuation?: any;
  PurchaseMethod: string;
  SaleDelay: number;
  Tracking?: any;
  Valuation?: any;
  AvailableInPOS: boolean;
  CompanyId?: any;
  IsCombo?: any;
  NameTemplateNoSign: string;
  TaxesIds: any[];
  StockValue?: any;
  SaleValue?: any;
  PosSalesCount?: any;
  Factor?: any;
  CategName?: any;
  AmountTotal?: any;
  NameCombos: any[];
  RewardName?: any;
  Product_UOMId?: any;
  Tags?: any;
  DateCreated?: any;
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

export interface FSOrderLinesV2{
  Id: number;
  ProductId: number;
  ProductUOMId: number;
  PriceUnit: number;
  ProductUOMQty: number;
  UserId: string;
  Discount: number;
  Discount_Fixed: number;
  PriceTotal: number;
  PriceSubTotal: number;
  Weight: number;
  WeightTotal: number;
  AccountId: number;
  PriceRecent: number;
  Name?: any;
  IsName: boolean;
  ProductName?: any;
  ProductUOMName: string;
  SaleLineIds: any[];
  ProductNameGet: string;
  SaleLineId?: any;
  Type: string;
  PromotionProgramId?: any;
  Note?: any;
  ProductBarcode?: any;
  CompanyId: number;
  PartnerId: number;
  PriceSubTotalSigned: number;
  PromotionProgramComboId?: any;
  LiveCampaign_DetailId: string;
  Product: Product;
  ProductUOM: ProductUOM;
  Account: Account;
  SaleLine?: any;
  User: User;
}

export interface OdataFSOrderLinesV2{
  "@odata.context": string;
  value: FSOrderLinesV2[];
}