import { AccountDTO, AccountJournalDTO, AccountTaxDTO } from '../account/account.dto';
import { IRAttachmentDTO } from '../attachment/attachment.dto';
import { POS_CategoryDTO } from '../category/category.dto';
import { PartnerCategoryDTO, PartnerDTO, PartnerExtDTO } from '../partner/partner.dto';
import { ProcurementRuleDTO } from '../rule/rule.dto';
import { StockLocationRouteDTO } from './warehouse.dto';

export interface GetInventoryDTO { // /rest/v1.0/product/getinventory
  [key: number]: ValueGetInventoryDTO
}

export interface ValueGetInventoryDTO { // /rest/v1.0/product/getinventory
  QtyAvailable: number;
  VirtualAvailable: number;
}

export interface ProductDTO {
  id: number;
  eAN13: string;
  defaultCode: string;

  nameTemplate: string;
  nameNoSign: string;

  productTmplId: number;

  uOMId: number;
  uOM: ProductUOMDTO;
  uOMName: string;

  uOMPOId: number;
  uOMPO: ProductUOMDTO;

  qtyAvailable: number;
  virtualAvailable: number;
  outgoingQty?: number;
  incomingQty?: number;
  nameGet: string;
  pOSCategId?: number;
  pOSCateg: POS_CategoryDTO;
  price?: number;
  barcode: string;
  image: string;

  images: Array<IRAttachmentDTO>;

  imageUrl: string;
  priceVariant?: number;
  saleOK: boolean;
  purchaseOK: boolean;
  displayAttributeValues: string;
  lstPrice?: number;
  active: boolean;

  listPrice?: number;
  purchasePrice?: number;
  discountSale?: number;
  discountPurchase?: number;
  standardPrice?: number;
  weight?: number;
  oldPrice?: number;
  isDiscount: boolean;
  productTmplEnableAll: boolean;

  // version
  version: number;
  description: string;

  attributeValues: Array<ProductAttributeValueDTO>;

  lastUpdated?: Date;
  type: string;

  uomLines: Array<ProductTemplateUOMLineDTO>;

  categId: number;
  categ: ProductCategoryDTO;
  costMethod: string;
  invoicePolicy: string;
  variant_TeamId: number;
  name: string;

  propertyCostMethod: string;
  propertyValuation: string;
  purchaseMethod: string;
  saleDelay?: number;
  tracking: string;
  valuation: string;
  availableInPOS?: boolean;
  companyId?: number;
  isCombo?: boolean;
  nameTemplateNoSign: string;
  taxesIds: Array<number>;
  stockValue?: number;
  saleValue?: number;

  // Số lượng bán ở điểm bán hàng
  posSalesCount?: number;
  dactor?: number;
  categName: string;
  amountTotal?: number;
  nameCombos: Array<string>;
  rewardName: string;
  product_UOMId: string;
  tags: string;
  dateCreated?: Date;
}

export interface Product_PriceListDTO {
  id: number;
  name: string;
  currencyId: number;
  currencyName: string;
  active?: boolean;
  companyId: number;
  items: Array<Product_PriceList_ItemDTO>;
  partnerCategories: PartnerCategoryDTO;
  partnerCateName: string;
  sequence?: number;
  dateStart?: Date;
  dateEnd?: Date;
  nameGet: string;
}

export interface Product_PriceList_ItemDTO {
  id: number;
  productTmplId?: number;
  productTmpl: ProductTemplateDTO;

  productId?: number;
  product: ProductDTO;

  uomId?: number;
  uom: ProductUOMDTO;

  categId?: number;
  categ: ProductCategoryDTO;

  priceListId?: number;
  priceList: Product_PriceListDTO;

  appliedOn: string;
  minQuantity: number;
  sequence: number;
  base: string;
  basePriceListId?: number;
  basePriceList: Product_PriceListDTO;

  priceSurcharge?: number;
  priceDiscount?: number;
  priceRound?: number;
  priceMinMargin?: number;
  priceMaxMargin?: number;

  dateStart?: Date;
  dateEnd?: Date;
  computePrice: string;
  fixedPrice?: number;
  priceDefault?: number;
  priceRecent?: number;
  percentPrice?: number;
  price: string;
  name: string;
  productName: string;
  uomMName: string;
  productNameNoSign: string;
}

export interface ProductTemplateDTO {
  id: number;
  name: string;
  nameNoSign: string;
  description: string;
  type: string;

  showType: string;

  listPrice?: number;
  discountSale?: number;
  discountPurchase?: number;
  purchasePrice?: number;
  standardPrice?: number;
  saleOK: boolean;
  purchaseOK: boolean;
  active: boolean;

  uomId: number;
  uom: ProductUOMDTO;
  uomName: string;

  uomPOId: number;
  uomPO: ProductUOMDTO;
  uomPOName: string;

  uosId: number;
  uos: ProductUOMDTO;

  isProductVariant: boolean;

  //related to display product product information if is_product_variant
  ean13: string;

  //[RegularExpression(@"(^[a-zA-Z0-9]*$)", ErrorMessage = "Mã sản phẩm là tiếng việt không dấu và không được chứa các kí tự đặc biệt")]
  defaultCode: string;
  routes: Array<StockLocationRouteDTO>;
  qtyAvailable: number;
  virtualAvailable: number;
  outgoingQty: number;
  incomingQty: number;
  propertyCostMethod: string;
  categId: number;
  categ: ProductCategoryDTO;
  categCompleteName: string;
  categName: string;
  weight?: number;
  tracking: string;
  descriptionPurchase: string;
  descriptionSale: string;
  companyId?: number;
  nameGet: string;
  propertyStockProductionId?: number;
  saleDelay?: number;
  invoicePolicy: string;
  purchaseMethod: string;
  propertyValuation: string;
  valuation: string;

  // Check if you want this product to appear in the Point of Sale
  availableInPOS?: boolean;
  posCategId?: number;
  posCateg: POS_CategoryDTO;

  costMethod: string;

  // [RegularExpression(@"(^[a-zA-Z0-9]*$)", ErrorMessage = "Mã barcode là tiếng việt không dấu và không được chứa các kí tự đặc biệt")]
  barcode: string;

  image: string;
  imageUrl: string;

  attributeLines: Array<ProductAttributeLineDTO>;
  productVariantCount: number;
  lastUpdated?: Date;
  items: Array<Product_PriceList_ItemDTO>;

  uomCategId?: number;
  uomCateg: ProductUOMCategDTO;

  uomLines: Array<ProductTemplateUOMLineDTO>;
  // ProductSupplierInfos
  productSupplierInfos: Array<ProductSupplierInfoDTO>;
  bOMCount: number;

  volume?: number;
  categNameNoSign: string;
  uomNameNoSign: string;
  uomPONameNoSign: string;

  isCombo?: boolean;
  enableAll: boolean;

  comboPurchased?: boolean;
  comboProducts: Array<ProductComboDTO>;
  taxes: Array<AccountTaxDTO>;
  supplierTaxes: Array<AccountTaxDTO>;
  product_Teams: Array<Product_TeamsDTO>;
  images: Array<IRAttachmentDTO>;
  productVariants: Array<ProductDTO>;

  version: number;
  variantFirstId?: number;
  variantFistId?: number;
  zaloProductId: string;
  companyName: string;
  companyNameNoSign: string;
  dateCreated?: Date;

  initInventory?: number;
  uomViewId?: number;
  uomView: ProductUOMDTO;

  importerId?: number;
  importer: PartnerExtDTO;

  importerName: string;
  importerAddress: string;

  producerId?: number;
  producer: PartnerExtDTO;

  producerName: string;
  producerAddress: string;
  distributorId?: number;
  distributor: PartnerExtDTO;
  distributorName: string;
  distributorAddress: string;

  originCountryId?: number;
  originCountry: OriginCountryDTO;

  originCountryName: string;
  infoWarning: string;
  element: string;
  yearOfManufacture?: number;
  specifications: string;
  tags: string;
  createdByName: string;
}

export interface ProductCategoryDTO {
  id: number;
  name: string;
  completeName: string;

  parentId?: number;
  parent: ProductCategoryDTO;
  parentCompleteName: string;

  parentLeft?: number;
  parentRight?: number;
  sequence?: number;
  type: string;

  accountIncomeCategId?: number;
  accountIncomeCateg: AccountDTO;

  accountExpenseCategId?: number;
  accountExpenseCateg: AccountDTO;

  stockJournalId?: number;
  stockJournal: AccountJournalDTO;

  stockAccountInputCategId?: number;
  stockAccountInputCateg: AccountDTO;

  stockAccountOutputCategId?: number;
  stockAccountOutputCateg: AccountDTO;

  stockValuationAccountId?: number;
  stockValuationAccount: AccountDTO;

  propertyValuation: string;

  propertyCostMethod: string;

  routes: Array<ProcurementRuleDTO>;
  nameNoSign: string;
  isPos: boolean;
  version?: number;
  isDelete: boolean;
}

export interface ProductUOMDTO {
  id: number;
  name: string;
  nameNoSign: string;
  rounding: number;
  active?: boolean;
  factor: number;
  factorInv: number;
  uomType: string;

  categoryId: number;
  category: ProductUOMCategDTO;
  categoryName: string;
  description: string;

  showUOMType: string;

  nameGet: string;

  showFactor: number;
}

export interface ProductUOMCategDTO {
  id: number;
  name: string;
}

export interface ProductAttributeValueDTO {
  id: number;
  name: string;
  code: string;
  sequence?: number;
  attributeId: number;
  attribute: ProductAttributeDTO;
  attributeName: string;
  priceExtra?: number;
  nameGet: string;
}

export interface ProductAttributeDTO {
  id: number;
  name: string;
  code: string;
  sequence?: number;
  createVariant?: boolean;
}

export interface ProductTemplateUOMLineDTO {
  id: number;
  productTmplId: number;
  productTmplListPrice?: number;

  uomId: number;
  uom: ProductUOMDTO;

  templateUOMFactor: number;
  listPrice?: number;
  barcode: string;
  price?: number;

  //Ext
  productId: number;
  uomName: string;
  nameGet: string;

  factor: number;
}

export interface ProductAttributeLineDTO {
  id: number;
  productTmplId: number;

  attributeId: number;
  attribute: ProductAttributeDTO;

  values: Array<ProductAttributeValueDTO>;
}

export interface ProductSupplierInfoDTO {
  id: number;
  supplierId: number;
  supplier: PartnerDTO;
  sequence?: number;
  productName: string;
  productCode: string;
  minQty: number;
  price: number;
  productTmplId: number;
  productTmpl: ProductTemplateDTO;
  companyId?: number;

  dateStart?: Date;
  dateEnd?: Date;

  productId?: number;
  delay: number;
}

export interface ProductComboDTO {
  id: number;
  productId: number;
  product: ProductDTO;
  quantity: number;
}

export interface Product_TeamsDTO {
  id: number;
  productTmplId: number;
  crmTeamsId: number;
  crmTeamsName: string;
  productTeamId: string;
  type: string;
}

export interface OriginCountryDTO {
  id: number;
  name: string;
  code: string;
  nameNoSign: string;
  note: string;
  dateCreated?: Date;
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
