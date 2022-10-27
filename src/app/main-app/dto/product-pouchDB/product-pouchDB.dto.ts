

export interface DataPouchDBDTO {
  Id: number;
  Name: string;
  UOMId: number;
  UOMName: string;
  NameGet: string;
  Barcode: string;
  Price: number;
  DefaultCode: string;
  ProductTmplId: number;
  PurchaseOK: boolean;
  SaleOK: boolean;
  PurchasePrice: number;
  DiscountSale: number;
  Weight: number;
  DiscountPurchase: number;
  Version: number;
  OldPrice: number;
  NameNoSign: string;
  Description?: any;
  POSCategId?: any;
  PosSalesCount: number;
  ImageUrl: string;
  AvailableInPOS: boolean;
  Product_UOMId: string;
  Active: boolean;
  Factor: number;
  IsDiscount: boolean;
  CategId: number;
  CategName: string;
  Tags: string,
  QtyAvailable?: number,
  VirtualAvailable?: number;

  AttributeLength?: any // field này dùng để check tạo mã chiến dịch live, ko có trong db
}

export interface ProductPouchDBDTO {
  Id: number;
  IsDelete: boolean;
  Datas: DataPouchDBDTO[];
}

export interface KeyCacheIndexDBDTO {
  cacheCount: number;
  cacheVersion: number;
  cacheDbStorage:  DataPouchDBDTO[];
}



