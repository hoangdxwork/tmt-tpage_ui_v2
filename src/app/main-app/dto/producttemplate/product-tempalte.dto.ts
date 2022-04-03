import { PartnerExtDTO } from './../partner/partner.dto';
import { AccountTaxDTO } from '../account/account.dto';
import { IRAttachmentDTO } from '../attachment/attachment.dto';
import { POS_CategoryDTO } from '../category/category.dto';
import { StockLocationRouteDTO } from '../product/warehouse.dto';
import { ProductUOMDTO, ProductCategoryDTO, ProductAttributeLineDTO, Product_PriceList_ItemDTO,
  ProductUOMCategDTO, ProductTemplateUOMLineDTO, ProductSupplierInfoDTO, ProductComboDTO,
  Product_TeamsDTO, ProductDTO, OriginCountryDTO } from './../product/product.dto';

export interface ProductTemplateDTO {
  Id: number;

  Name: string;
  NameNoSign: string;

  Description: string;

  Type: string;

  ShowType: string;

  ListPrice?: number;
  DiscountSale?: number;
  DiscountPurchase?: number;

  PurchasePrice?: number;

  StandardPrice?: number;

  SaleOK: boolean;

  PurchaseOK: boolean;

  Active: boolean;

  UOMId: number;
  UOM: ProductUOMDTO;
  UOMName: string;

  UOMPOId: number;
  UOMPO: ProductUOMDTO;
  UOMPOName: string;

  UOSId?: number;
  UOS: ProductUOMDTO;

  IsProductVariant: boolean;

  //related to display product product information if is_product_variant
  EAN13: string;

  // "Mã sản phẩm là tiếng việt không dấu và không được chứa các kí tự đặc biệt")]
  DefaultCode: string;

  Routes: Array<StockLocationRouteDTO>;

  QtyAvailable: number;

  VirtualAvailable: number;

  OutgoingQty: number;

  IncomingQty: number;

  PropertyCostMethod: string;

  CategId: number;
  Categ: ProductCategoryDTO;
  CategCompleteName: string;
  CategName: string;

  Weight?: number;

  Tracking: string;

  DescriptionPurchase: string;

  DescriptionSale: string;

  CompanyId?: number;

  NameGet: string;

  PropertyStockProductionId?: number;

  SaleDelay?: number;

  InvoicePolicy: string;

  PurchaseMethod: string;

  PropertyValuation: string;

  Valuation: string;

  /// Check if you want this product to appear in the Point of Sale
  AvailableInPOS?: boolean;

  POSCategId?: number;
  POSCateg: POS_CategoryDTO;

  CostMethod: string;

  // "Mã barcode là tiếng việt không dấu và không được chứa các kí tự đặc biệt")]
  Barcode: string;

  Image: string;
  ImageUrl: string;

  AttributeLines: Array<ProductAttributeLineDTO>;

  ProductVariantCount: number;

  LastUpdated?: Date;

  Items: Array<Product_PriceList_ItemDTO>;

  UOMCategId?: number;
  UOMCateg: ProductUOMCategDTO;

  UOMLines: Array<ProductTemplateUOMLineDTO>;

  ///ProductSupplierInfos
  ProductSupplierInfos: Array<ProductSupplierInfoDTO>;

  BOMCount: number;

  Volume?: number;
  CategNameNoSign: string;
  UOMNameNoSign: string;
  UOMPONameNoSign: string;

  IsCombo?: boolean;
  EnableAll: boolean;

  ComboPurchased?: boolean;

  ComboProducts: Array<ProductComboDTO>;

  Taxes: Array<AccountTaxDTO>;

  SupplierTaxes: Array<AccountTaxDTO>;

  Product_Teams: Array<Product_TeamsDTO>;

  Images: Array<IRAttachmentDTO>;
  ProductVariants: Array<ProductDTO>;

  Version: number;
  VariantFirstId?: number;
  VariantFistId?: number; //cũ tạm
  ZaloProductId: string;
  CompanyName: string;
  CompanyNameNoSign: string;
  DateCreated?: Date;

  InitInventory?: number;

  UOMViewId?: number;
  UOMView: ProductUOMDTO;

  ImporterId?: number;
  Importer: PartnerExtDTO;

  ImporterName: string;
  ImporterAddress: string;

  ProducerId?: number;
  Producer: PartnerExtDTO;

  ProducerName: string;
  ProducerAddress: string;

  DistributorId?: number;
  Distributor: PartnerExtDTO;

  DistributorName: string;
  DistributorAddress: string;

  OriginCountryId?: number;
  OriginCountry: OriginCountryDTO;

  OriginCountryName: string;
  InfoWarning: string;
  Element: string;
  YearOfManufacture?: number;
  Specifications: string;
  Tags: string;
  CreatedByName: string;
}
