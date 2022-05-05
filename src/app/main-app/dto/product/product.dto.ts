import { AccountDTO, AccountJournalDTO, AccountTaxDTO } from '../account/account.dto';
import { IRAttachmentDTO } from '../attachment/attachment.dto';
import { POS_CategoryDTO } from '../category/category.dto';
import { PartnerCategoryDTO, PartnerDTO, PartnerExtDTO } from '../partner/partner.dto';
import { ProcurementRuleDTO } from '../rule/rule.dto';
import { ProductCategoryDTO } from './product-category.dto';
import { StockLocationRouteDTO } from './warehouse.dto';

export interface GetInventoryDTO { // /rest/v1.0/product/getinventory
  [key: number]: ValueGetInventoryDTO
}

export interface ValueGetInventoryDTO { // /rest/v1.0/product/getinventory
  QtyAvailable: number;
  VirtualAvailable: number;
}

export interface ProductDTO {
  Id: number;
  EAN13: string;
  DefaultCode: string;

  NameTemplate: string;
  NameNoSign: string;

  ProductTmplId: number;

  UOMId: number;
  UOM: ProductUOMDTO;
  UOMName: string;

  UOMPOId: number;
  UOMPO: ProductUOMDTO;

  QtyAvailable: number;
  VirtualAvailable: number;
  OutgoingQty?: number;
  IncomingQty?: number;
  NameGet: string;
  POSCategId?: number;
  POSCateg: POS_CategoryDTO;
  Price?: number;
  Barcode: string;
  Image: string;

  Images: Array<IRAttachmentDTO>;

  ImageUrl: string;
  PriceVariant?: number;
  SaleOK: boolean;
  PurchaseOK: boolean;
  DisplayAttributeValues: string;
  LstPrice?: number;
  Active: boolean;

  ListPrice?: number;
  PurchasePrice?: number;
  DiscountSale?: number;
  DiscountPurchase?: number;
  StandardPrice?: number;
  Weight?: number;
  OldPrice?: number;
  IsDiscount: boolean;
  ProductTmplEnableAll: boolean;

  // version
  Version: number;
  Description: string;

  AttributeValues: Array<ProductAttributeValueDTO>;

  LastUpdated?: Date;
  Type: string;

  UOMLines: Array<ProductTemplateUOMLineDTO>;

  CategId: number;
  Categ: ProductCategoryDTO;
  CostMethod: string;
  InvoicePolicy: string;
  Variant_TeamId: number;
  Name: string;

  PropertyCostMethod: string;
  PropertyValuation: string;
  PurchaseMethod: string;
  SaleDelay?: number;
  Tracking: string;
  Valuation: string;
  AvailableInPOS?: boolean;
  CompanyId?: number;
  IsCombo?: boolean;
  NameTemplateNoSign: string;
  TaxesIds: Array<number>;
  StockValue?: number;
  SaleValue?: number;

  // Số lượng bán ở điểm bán hàng
  PosSalesCount?: number;
  Dactor?: number;
  CategName: string;
  AmountTotal?: number;
  NameCombos: Array<string>;
  RewardName: string;
  RewardProductQuantity?: number;
  Product_UOMId: string;
  Tags: string;
  DateCreated?: Date;
}

export interface Product_PriceListDTO {
  Id: number;
  Name: string;
  CurrencyId: number;
  CurrencyName: string;
  Active?: boolean;
  CompanyId: number;
  Items: Array<Product_PriceList_ItemDTO>;
  PartnerCategories: PartnerCategoryDTO;
  PartnerCateName: string;
  Sequence?: number;
  DateStart?: Date;
  DateEnd?: Date;
  NameGet: string;
}

export interface Product_PriceList_ItemDTO {
  Id: number;
  ProductTmplId?: number;
  ProductTmpl: ProductTemplateDTO;

  ProductId?: number;
  Product: ProductDTO;

  UOMId?: number;
  UOM: ProductUOMDTO;

  CategId?: number;
  Categ: ProductCategoryDTO;

  PriceListId?: number;
  PriceList: Product_PriceListDTO;

  AppliedOn: string;
  MinQuantity: number;
  Sequence: number;
  Base: string;
  BasePriceListId?: number;
  BasePriceList: Product_PriceListDTO;

  PriceSurcharge?: number;
  PriceDiscount?: number;
  PriceRound?: number;
  PriceMinMargin?: number;
  PriceMaxMargin?: number;

  DateStart?: Date;
  DateEnd?: Date;
  ComputePrice: string;
  FixedPrice?: number;
  PriceDefault?: number;
  PriceRecent?: number;
  PercentPrice?: number;
  Price: string;
  Name: string;
  ProductName: string;
  UOMMName: string;
  ProductNameNoSign: string;
}

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

  UOSId: number;
  UOS: ProductUOMDTO;

  IsProductVariant: boolean;

  //related to display product product information if is_product_variant
  Ean13: string;

  //[RegularExpression(@"(^[a-zA-Z0-9]*$)", ErrorMessage = "Mã sản phẩm là tiếng việt không dấu và không được chứa các kí tự đặc biệt")]
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

  // Check if you want this product to appear in the Point of Sale
  AvailableInPOS?: boolean;
  PosCategId?: number;
  PosCateg: POS_CategoryDTO;

  CostMethod: string;

  // [RegularExpression(@"(^[a-zA-Z0-9]*$)", ErrorMessage = "Mã barcode là tiếng việt không dấu và không được chứa các kí tự đặc biệt")]
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
  // ProductSupplierInfos
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
  VariantFistId?: number;
  AaloProductId: string;
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
  Category: ProductUOMCategDTO;
  CategoryName: string;
  Description: string;

  ShowUOMType: string;

  NameGet: string;

  ShowFactor: number;
}

export interface ProductUOMCategDTO {
  Id: number;
  Name: string;
}

export interface ProductAttributeValueDTO {
  Id: number;
  Name: string;
  Code: string;
  Sequence?: number;
  AttributeId: number;
  Attribute: ProductAttributeDTO;
  AttributeName: string;
  PriceExtra?: number;
  NameGet: string;
}

export interface ProductAttributeDTO {
  Id: number;
  Name: string;
  Code: string;
  Sequence?: number;
  CreateVariant?: boolean;
}

export interface ProductTemplateUOMLineDTO {
  Id: number;
  ProductTmplId: number;
  ProductTmplListPrice?: number;

  UOMId: number;
  UOM: ProductUOMDTO;

  TemplateUOMFactor: number;
  ListPrice?: number;
  Barcode: string;
  Price?: number;

  //Ext
  ProductId: number;
  UOMName: string;
  NameGet: string;

  Factor: number;
}

export interface ProductAttributeLineDTO {
  Id: number;
  ProductTmplId: number;

  AttributeId: number;
  Attribute: ProductAttributeDTO;

  Values: Array<ProductAttributeValueDTO>;
}

export interface ProductSupplierInfoDTO {
  Id: number;
  SupplierId: number;
  Supplier: PartnerDTO;
  Sequence?: number;
  ProductName: string;
  ProductCode: string;
  MinQty: number;
  Price: number;
  ProductTmplId: number;
  ProductTmpl: ProductTemplateDTO;
  CompanyId?: number;

  DateStart?: Date;
  DateEnd?: Date;

  ProductId?: number;
  Delay: number;
}

export interface ProductComboDTO {
  Id: number;
  ProductId: number;
  Product: ProductDTO;
  Quantity: number;
}

export interface Product_TeamsDTO {
  Id: number;
  ProductTmplId: number;
  CRMTeamsId: number;
  CRMTeamsName: string;
  ProductTeamId: string;
  Type: string;
}

export interface OriginCountryDTO {
  Id: number;
  Name: string;
  Code: string;
  NameNoSign: string;
  Note: string;
  DateCreated?: Date;
  lastUpdated?: Date;
}

export interface QueryVariantTeamsDTO {
  limmit: number;
  skip: number;
  keyWord: string;
}

export interface ProductInnerDTO {
  id: number;
  name: string;
  description: string;
  picture: string;
  price?: number;
}

export const ProductType = ["Có thể lưu trữ", "Có thể tiêu thụ", "Dịch vụ"];

