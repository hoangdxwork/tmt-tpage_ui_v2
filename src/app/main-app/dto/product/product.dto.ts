import { AccountDTO, AccountJournalDTO, AccountTaxDTO } from '../account/account.dto';
import { IRAttachmentDTO } from '../attachment/attachment.dto';
import { POS_CategoryDTO } from '../category/category.dto';
import { PartnerCategoryDTO, PartnerDTO, PartnerExtDTO } from '../partner/partner.dto';
import { ProcurementRuleDTO } from '../rule/rule.dto';
import { StockLocationRouteDTO } from './warehouse.dto';

export class ProductDTO {
  public id: number;
  public eAN13: string;
  public defaultCode: string;

  public nameTemplate: string;
  public nameNoSign: string;

  public productTmplId: number;

  public uOMId: number;
  public uOM: ProductUOMDTO;
  public uOMName: string;

  public uOMPOId: number;
  public uOMPO: ProductUOMDTO;

  public qtyAvailable: number;
  public virtualAvailable: number;
  public outgoingQty?: number;
  public incomingQty?: number;
  public nameGet: string;
  public pOSCategId?: number;
  public pOSCateg: POS_CategoryDTO;
  public price?: number;
  public barcode: string;
  public image: string;

  public images: Array<IRAttachmentDTO>;

  public imageUrl: string;
  public priceVariant?: number;
  public saleOK: boolean;
  public purchaseOK: boolean;
  public displayAttributeValues: string;
  public lstPrice?: number;
  public active: boolean;

  public listPrice?: number;
  public purchasePrice?: number;
  public discountSale?: number;
  public discountPurchase?: number;
  public standardPrice?: number;
  public weight?: number;
  public oldPrice?: number;
  public isDiscount: boolean;
  public productTmplEnableAll: boolean;

  // version
  public version: number;
  public description: string;

  public attributeValues: Array<ProductAttributeValueDTO>;

  public lastUpdated?: Date;
  public type: string;

  public uomLines: Array<ProductTemplateUOMLineDTO>;

  public categId: number;
  public categ: ProductCategoryDTO;
  public costMethod: string;
  public invoicePolicy: string;
  public variant_TeamId: number;
  public name: string;

  public propertyCostMethod: string;
  public propertyValuation: string;
  public purchaseMethod: string;
  public saleDelay?: number;
  public tracking: string;
  public valuation: string;
  public availableInPOS?: boolean;
  public companyId?: number;
  public isCombo?: boolean;
  public nameTemplateNoSign: string;
  public taxesIds: Array<number>;
  public stockValue?: number;
  public saleValue?: number;

  // Số lượng bán ở điểm bán hàng
  public posSalesCount?: number;
  public dactor?: number;
  public categName: string;
  public amountTotal?: number;
  public nameCombos: Array<string>;
  public rewardName: string;
  public product_UOMId: string;
  public tags: string;
  public dateCreated?: Date;

  constructor() {
    this.images = new Array<IRAttachmentDTO>();
  }
}

export class Product_PriceListDTO {
  public id: number;
  public name: string;
  public currencyId: number;
  public currencyName: string;
  public active?: boolean;
  public companyId: number;
  public items: Array<Product_PriceList_ItemDTO>;
  public partnerCategories: PartnerCategoryDTO;
  public partnerCateName: string;
  public sequence?: number;
  public dateStart?: Date;
  public dateEnd?: Date;
  public nameGet: string;

  constructor() {}
}

export class Product_PriceList_ItemDTO {
  public id: number;
  public productTmplId?: number;
  public productTmpl: ProductTemplateDTO;

  public productId?: number;
  public product: ProductDTO;

  public uomId?: number;
  public uom: ProductUOMDTO;

  public categId?: number;
  public categ: ProductCategoryDTO;

  public priceListId?: number;
  public priceList: Product_PriceListDTO;

  public appliedOn: string;
  public minQuantity: number;
  public sequence: number;
  public base: string;
  public basePriceListId?: number;
  public basePriceList: Product_PriceListDTO;

  public priceSurcharge?: number;
  public priceDiscount?: number;
  public priceRound?: number;
  public priceMinMargin?: number;
  public priceMaxMargin?: number;

  public dateStart?: Date;
  public dateEnd?: Date;
  public computePrice: string;
  public fixedPrice?: number;
  public priceDefault?: number;
  public priceRecent?: number;
  public percentPrice?: number;
  public price: string;
  public name: string;
  public productName: string;
  public uomMName: string;
  public productNameNoSign: string;

  constructor() {}
}

export class ProductTemplateDTO {
  public id: number;
  public name: string;
  public nameNoSign: string;
  public description: string;
  public type: string;

  public get showType(): string {
    switch (this.type) {
      case 'product':
        return 'Có thể lưu trữ';
      case 'consu':
        return 'Có thể tiêu thụ';
      default:
        return 'Dịch vụ';
    }
  }

  public set showType(str: string) {
    this.showType = str;
  }

  public listPrice?: number;
  public discountSale?: number;
  public discountPurchase?: number;
  public purchasePrice?: number;
  public standardPrice?: number;
  public saleOK: boolean;
  public purchaseOK: boolean;
  public active: boolean;

  public uomId: number;
  public uom: ProductUOMDTO;
  public uomName: string;

  public uomPOId: number;
  public uomPO: ProductUOMDTO;
  public uomPOName: string;

  public uosId: number;
  public uos: ProductUOMDTO;

  public isProductVariant: boolean;

  //related to display product product information if is_product_variant
  public ean13: string;

  //[RegularExpression(@"(^[a-zA-Z0-9]*$)", ErrorMessage = "Mã sản phẩm là tiếng việt không dấu và không được chứa các kí tự đặc biệt")]
  public defaultCode: string;
  public routes: Array<StockLocationRouteDTO>;
  public qtyAvailable: number;
  public virtualAvailable: number;
  public outgoingQty: number;
  public incomingQty: number;
  public propertyCostMethod: string;
  public categId: number;
  public categ: ProductCategoryDTO;
  public categCompleteName: string;
  public categName: string;
  public weight?: number;
  public tracking: string;
  public descriptionPurchase: string;
  public descriptionSale: string;
  public companyId?: number;
  public nameGet: string;
  public propertyStockProductionId?: number;
  public saleDelay?: number;
  public invoicePolicy: string;
  public purchaseMethod: string;
  public propertyValuation: string;
  public valuation: string;

  // Check if you want this product to appear in the Point of Sale
  public availableInPOS?: boolean;
  public posCategId?: number;
  public posCateg: POS_CategoryDTO;

  public costMethod: string;

  // [RegularExpression(@"(^[a-zA-Z0-9]*$)", ErrorMessage = "Mã barcode là tiếng việt không dấu và không được chứa các kí tự đặc biệt")]
  public barcode: string;

  public image: string;
  public imageUrl: string;

  public attributeLines: Array<ProductAttributeLineDTO>;
  public productVariantCount: number;
  public lastUpdated?: Date;
  public items: Array<Product_PriceList_ItemDTO>;

  public uomCategId?: number;
  public uomCateg: ProductUOMCategDTO;

  public uomLines: Array<ProductTemplateUOMLineDTO>;
  // ProductSupplierInfos
  public productSupplierInfos: Array<ProductSupplierInfoDTO>;
  public bOMCount: number;

  public volume?: number;
  public categNameNoSign: string;
  public uomNameNoSign: string;
  public uomPONameNoSign: string;

  public isCombo?: boolean;
  public enableAll: boolean;

  public comboPurchased?: boolean;
  public comboProducts: Array<ProductComboDTO>;
  public taxes: Array<AccountTaxDTO>;
  public supplierTaxes: Array<AccountTaxDTO>;
  public product_Teams: Array<Product_TeamsDTO>;
  public images: Array<IRAttachmentDTO>;
  public productVariants: Array<ProductDTO>;

  public version: number;
  public variantFirstId?: number;
  public variantFistId?: number;
  public zaloProductId: string;
  public companyName: string;
  public companyNameNoSign: string;
  public dateCreated?: Date;

  public initInventory?: number;
  public uomViewId?: number;
  public uomView: ProductUOMDTO;

  public importerId?: number;
  public importer: PartnerExtDTO;

  public importerName: string;
  public importerAddress: string;

  public producerId?: number;
  public producer: PartnerExtDTO;

  public producerName: string;
  public producerAddress: string;
  public distributorId?: number;
  public distributor: PartnerExtDTO;
  public distributorName: string;
  public distributorAddress: string;

  public originCountryId?: number;
  public originCountry: OriginCountryDTO;

  public originCountryName: string;
  public infoWarning: string;
  public element: string;
  public yearOfManufacture?: number;
  public specifications: string;
  public tags: string;
  public createdByName: string;

  constructor() {
    this.images = new Array<IRAttachmentDTO>();
    this.productVariants = new Array<ProductDTO>();
  }
}

export class ProductCategoryDTO {
  public id: number;
  public name: string;
  public completeName: string;

  public parentId?: number;
  public parent: ProductCategoryDTO;
  public parentCompleteName: string;

  public parentLeft?: number;
  public parentRight?: number;
  public sequence?: number;
  public type: string;

  public accountIncomeCategId?: number;
  public accountIncomeCateg: AccountDTO;

  public accountExpenseCategId?: number;
  public accountExpenseCateg: AccountDTO;

  public stockJournalId?: number;
  public stockJournal: AccountJournalDTO;

  public stockAccountInputCategId?: number;
  public stockAccountInputCateg: AccountDTO;

  public stockAccountOutputCategId?: number;
  public stockAccountOutputCateg: AccountDTO;

  public stockValuationAccountId?: number;
  public stockValuationAccount: AccountDTO;

  public propertyValuation: string;

  public propertyCostMethod: string;

  public routes: Array<ProcurementRuleDTO>;
  public nameNoSign: string;
  public isPos: boolean;
  public version?: number;
  public isDelete: boolean;

  constructor() {}
}

export class ProductUOMDTO {
  public id: number;
  public name: string;
  public nameNoSign: string;
  public rounding: number;
  public active?: boolean;
  public factor: number;
  public factorInv: number;
  public uomType: string;

  public categoryId: number;
  public category: ProductUOMCategDTO;
  public categoryName: string;
  public description: string;

  public get showUOMType(): string {
    switch (this.uomType) {
      case 'reference':
        return 'Đơn vị gốc của nhóm này';
      case 'bigger':
        return 'Lớn hơn đơn vị gốc';
      case 'smaller':
        return 'Nhỏ hơn đơn vị gốc';
      default:
        return '';
    }
  }

  public set showUOMType(str: string) {
    this.showUOMType = str;
  }

  public nameGet: string;

  public get showFactor(): number {
    if (this.uomType == 'bigger') return this.factorInv;
    return this.factor;
  }

  public set showFactor(number: number) {
    this.showFactor = number;
  }

  constructor() {
    this.active = true;
    // this.Rounding = 0.01M;
    this.factor = 1;
    this.uomType = 'reference';
    this.factorInv = 1;
  }
}

export class ProductUOMCategDTO {
  public id: number;
  public name: string;
}

export class ProductAttributeValueDTO {
  public id: number;
  public name: string;
  public code: string;
  public sequence?: number;
  public attributeId: number;
  public attribute: ProductAttributeDTO;
  public attributeName: string;
  public priceExtra?: number;
  public nameGet: string;
}

export class ProductAttributeDTO {
  public id: number;
  public name: string;
  public code: string;
  public sequence?: number;
  public createVariant?: boolean;

  constructor() {
    this.createVariant = true;
  }
}

export class ProductTemplateUOMLineDTO {
  public id: number;
  public productTmplId: number;
  public productTmplListPrice?: number;

  public uomId: number;
  public uom: ProductUOMDTO;

  public templateUOMFactor: number;
  public listPrice?: number;
  public barcode: string;
  public price?: number;

  //Ext
  public productId: number;
  public uomName: string;
  public nameGet: string;

  public get factor(): number {
    var price = this.listPrice ?? 0;
    if (price != 0)
      return (
        (this.templateUOMFactor * (this.productTmplListPrice ?? 0)) / price
      );
    return 1;
  }

  public set factor(number: number) {
    this.factor = number;
  }
}

export class ProductAttributeLineDTO {
  public id: number;
  public productTmplId: number;

  public attributeId: number;
  public attribute: ProductAttributeDTO;

  public values: Array<ProductAttributeValueDTO>;

  constructor() {
    this.values = new Array<ProductAttributeValueDTO>();
  }
}

export class ProductSupplierInfoDTO {
  public id: number;
  public supplierId: number;
  public supplier: PartnerDTO;
  public sequence?: number;
  public productName: string;
  public productCode: string;
  public minQty: number;
  public price: number;
  public productTmplId: number;
  public productTmpl: ProductTemplateDTO;
  public companyId?: number;

  public dateStart?: Date;
  public dateEnd?: Date;

  public productId?: number;
  public delay: number;
}

export class ProductComboDTO {
  public id: number;
  public productId: number;
  public product: ProductDTO;
  public quantity: number;
}

export class Product_TeamsDTO {
  public id: number;
  public productTmplId: number;
  public crmTeamsId: number;
  public crmTeamsName: string;
  public productTeamId: string;
  public type: string;
}

export class OriginCountryDTO {
  public id: number;
  public name: string;
  public code: string;
  public nameNoSign: string;
  public note: string;
  public dateCreated?: Date;
  public lastUpdated?: Date;
}

export interface QueryVariantTeamsDTO {
  limmit: number;
  skip: number;
  keyWord: string;
}

export class ProductInnerDTO {
  public id: number;
  public name: string;
  public description: string;
  public picture: string;
  public price?: number;
}
