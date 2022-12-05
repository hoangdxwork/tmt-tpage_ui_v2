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
  _editLiveCampaignPost = "_EDIT_LIVECAMPAIGN_POST",
  _tabOrder = "_TAB_ORDER",
  _defaultProduct = "_DEFAULT_PRODUCT",
  _drawerAddProduct = "_DRAWER_ADD_PRODUCT",
  _editOrder = "_EDIT_ORDER"
}


