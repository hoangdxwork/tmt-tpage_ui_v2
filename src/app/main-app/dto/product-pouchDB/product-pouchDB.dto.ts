import { ProductTemplateV2DTO } from "../product-template/product-tempalte.dto";

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
}

export interface ProductPouchDBDTO {
  Id: number;
  IsDelete: boolean;
  Datas: DataPouchDBDTO[];
  Total: number;
}

export interface KeyCacheIndexDBDTO {
  cacheCount: number;
  cacheVersion: number;
  cacheDbStorage: DataPouchDBDTO[];
}

export interface SyncCreateProductTemplateDto {
  type: any;
  cacheDbStorage: DataPouchDBDTO[];
  productTmpl: ProductTemplateV2DTO;
}

export enum InventoryChangeType {
  _EDIT_LIVECAMPAIGN_POST = "_EDIT_LIVECAMPAIGN_POST",
  _TAB_ORDER = "_TAB_ORDER",
  _DEFAULT_PRODUCT = "_DEFAULT_PRODUCT",
  _DRAWER_ADD_PRODUCT = "_DRAWER_ADD_PRODUCT",
  _EDIT_ORDER = "_EDIT_ORDER"
}


